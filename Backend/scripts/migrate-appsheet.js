#!/usr/bin/env node

/**
 * Migração genérica AppSheet/XLSX -> facilities_answers.
 *
 * Regras:
 * - o codigo da pergunta é o identificador estável;
 * - cabeçalhos novos são associados automaticamente pelo texto normalizado;
 * - cabeçalhos antigos podem usar aliases estáveis;
 * - perguntas inativas continuam podendo receber dados históricos;
 * - nada é apagado;
 * - sem --overwrite, respostas existentes não são alteradas;
 * - --execute é bloqueado quando existe ambiguidade ou coluna sem mapeamento.
 */
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const XLSX = require('xlsx');
const prisma = require('../Utils/prisma');
const { legacyColumnAliases = {}, ignoredSourceColumns = {} } = require('../Utils/questionCatalog');

const args = new Set(process.argv.slice(2));
const EXECUTE = args.has('--execute');
const OVERWRITE = args.has('--overwrite');
const DRY_RUN = !EXECUTE;

const workbookCandidates = [
  process.env.APPSHEET_XLSX,
  path.join(__dirname, '../../Dados para serem migrados.xlsx'),
  path.join(__dirname, '../../../Dados para serem migrados.xlsx'),
].filter(Boolean);
const workbookPath =
  workbookCandidates
    .map(candidate => path.resolve(candidate))
    .find(candidate => fs.existsSync(candidate))
  || path.resolve(workbookCandidates[0]);
const reportPath = path.resolve(process.env.MIGRATION_REPORT || path.join(__dirname, '../../migration-appsheet-report.json'));

const SHEETS = [
  { sheet: 'Facilities', formulario: 'Facilities' },
  { sheet: 'Edificação', formulario: 'Edificacoes' },
];

function norm(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
function empty(value) { return value === undefined || value === null || String(value).trim() === ''; }
function sourceValue(value) { return empty(value) ? null : value; }
function splitMulti(value) {
  if (Array.isArray(value)) return value;
  const raw = String(value).trim();
  if (!raw) return null;
  if (raw.startsWith('[')) {
    try { const parsed = JSON.parse(raw); if (Array.isArray(parsed)) return parsed.map(v => String(v).trim()).filter(Boolean); } catch (_) {}
  }
  const parts = raw.split(/\s*(?:,|;|\r?\n)\s*/).map(v => v.trim()).filter(Boolean);
  return parts.length ? parts : [raw];
}
function serialize(value, type, code) {
  if (empty(value)) return null;
  if (code === 'imovel_teve_reforma') {
    if (value === true || String(value).toLowerCase() === 'true') return 'Sim';
    if (value === false || String(value).toLowerCase() === 'false') return 'Não';
  }
  if (type === 'resposta_multipla') return JSON.stringify(splitMulti(value));
  if (typeof value === 'number') return String(value);
  if (value instanceof Date) return value.toISOString();
  return String(value).trim();
}

async function validatePhysicalSchema() {
  const expected = ['families', 'family_dados_pessoais', 'facilities_questions', 'facilities_answers', 'users', 'edificacoes', 'edificacao_images'];
  const rows = await prisma.$queryRawUnsafe(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = ANY($1::text[])
  `, expected);
  const found = new Set(rows.map(r => r.table_name));
  const missing = expected.filter(t => !found.has(t));
  if (missing.length) throw new Error(`Tabelas obrigatórias ausentes no schema public: ${missing.join(', ')}`);

  const familyColumns = await prisma.$queryRawUnsafe(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'families'
      AND column_name = 'appsheet_source_id'
  `);
  if (!familyColumns.length) {
    throw new Error('A coluna public.families.appsheet_source_id não existe. Aplique a migration de importação AppSheet antes de executar a migração.');
  }

  const answerColumns = await prisma.$queryRawUnsafe(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'facilities_answers'
      AND column_name = 'edificacao_id'
  `);
  if (!answerColumns.length) {
    throw new Error('A coluna public.facilities_answers.edificacao_id não existe. Aplique a migration de edificações antes de executar a migração.');
  }
  return expected;
}

function buildQuestionIndexes(questions, formulario) {
  const formQuestions = questions.filter(q => q.formulario === formulario);
  const byCode = new Map(formQuestions.map(q => [q.codigo, q]));
  const byText = new Map();
  for (const q of formQuestions) {
    const key = norm(q.texto);
    if (!key) continue;
    if (!byText.has(key)) byText.set(key, []);
    byText.get(key).push(q);
  }
  return { byCode, byText };
}

function resolveColumn(formulario, header, indexes, report) {
  const aliases = legacyColumnAliases?.[formulario] || {};
  const ignored = ignoredSourceColumns?.[formulario] || new Set();
  if (ignored.has && ignored.has(header)) return { ignored: true };

  const aliasCode = aliases[header] ?? Object.entries(aliases).find(([h]) => norm(h) === norm(header))?.[1];
  if (aliasCode) {
    const q = indexes.byCode.get(aliasCode);
    if (!q) {
      report.issues.push({ type: 'question_alias_target_not_found', formulario, column: header, code: aliasCode });
      return null;
    }
    return { question: q, method: 'alias', code: q.codigo };
  }

  const candidates = indexes.byText.get(norm(header)) || [];
  const activeCandidates = candidates.filter(q => q.ativa);
  if (activeCandidates.length === 1) return { question: activeCandidates[0], method: 'text_active', code: activeCandidates[0].codigo };
  if (activeCandidates.length > 1) {
    report.issues.push({ type: 'question_text_ambiguous', formulario, column: header, candidates: activeCandidates.map(q => ({ code: q.codigo, texto: q.texto })) });
    return null;
  }
  if (candidates.length === 1) return { question: candidates[0], method: 'text_inactive', code: candidates[0].codigo };
  if (candidates.length > 1) {
    report.issues.push({ type: 'question_text_ambiguous', formulario, column: header, candidates: candidates.map(q => ({ code: q.codigo, texto: q.texto })) });
    return null;
  }

  report.issues.push({ type: 'unmapped_source_column', formulario, column: header });
  return null;
}

function loadRows(wb, sheet) {
  if (!wb.Sheets[sheet]) throw new Error(`A aba "${sheet}" não existe no XLSX.`);
  return XLSX.utils.sheet_to_json(wb.Sheets[sheet], { defval: null, cellDates: true })
    .filter(row => Object.values(row).some(value => !empty(value)));
}

function buildMappings(wb, questions, report) {
  const mappings = {};
  for (const cfg of SHEETS) {
    const indexes = buildQuestionIndexes(questions, cfg.formulario);
    const rows = loadRows(wb, cfg.sheet);
    const headers = rows.length ? Object.keys(rows[0]) : [];
    mappings[cfg.formulario] = { cfg, rows, columns: new Map() };
    for (const header of headers) {
      if (header === '__EMPTY' && rows.every(row => empty(row[header]))) {
        continue;
      }

      if (cfg.formulario === 'Facilities' && header === 'ID') continue;
      if (cfg.formulario === 'Edificacoes' && (
        /^ID[_ ]edifica(?:ção|cao):?$/.test(header) ||
        header === 'Nome do Morador:'
      )) continue;

      const resolved = resolveColumn(cfg.formulario, header, indexes, report);

      if (header === '__EMPTY' && !resolved) {
        const values = rows
          .map(row => row[header])
          .filter(value => !empty(value))
          .map(value => String(value));
        const issue = report.issues.at(-1);
        if (issue?.type === 'unmapped_source_column' && issue.column === header) {
          issue.values = values;
          issue.reason = 'A coluna contém dados, mas não corresponde a nenhuma pergunta cadastrada para o formulário.';
        }
      }

      if (resolved?.ignored) continue;

      if (resolved) mappings[cfg.formulario].columns.set(header, resolved);
    }
  }
  return mappings;
}

function familySourceId(row) {
  return String(row?.['Numeração do levantamento:'] ?? '').trim() || null;
}

function familyRowId(row) {
  return String(row?.ID ?? '').trim() || null;
}

function familyDataFromFacilitiesRow(row) {
  const name = String(row['Nome do Morador:'] ?? '').trim();
  if (!name) return null;
  return {
    nomeMorador: name,
    documentoResponsavel: empty(row['CPF ou RG (CPF é mais relevante!):']) ? null : String(row['CPF ou RG (CPF é mais relevante!):']).trim(),
    endereco: empty(row['Endereço:']) ? null : String(row['Endereço:']).trim(),
    telefone: empty(row['Telefone:']) ? null : String(row['Telefone:']).trim(),
    donoTelefone: empty(row['Dono do Telefone:']) ? null : String(row['Dono do Telefone:']).trim(),
  };
}

function addFamilyToIndexes(family, bySurveyNumber, surveyNumber) {
  if (surveyNumber) {
    if (!bySurveyNumber.has(surveyNumber)) bySurveyNumber.set(surveyNumber, []);
    bySurveyNumber.get(surveyNumber).push(family);
  }
}

async function prepareFamilies(facilitiesRows, surveyQuestion, report, tx = null) {
  const client = tx ?? prisma;
  const families = await client.family.findMany({
    include: {
      dadosPessoais: true,
      answers: { where: { perguntaId: surveyQuestion.id }, select: { resposta: true } }
    }
  });
  const bySurveyNumber = new Map();
  const storedSourceIds = new Set(families.map(family => family.appsheetSourceId).filter(Boolean).map(String));
  for (const family of families) {
    const answer = family.answers[0];
    addFamilyToIndexes(family, bySurveyNumber, answer ? String(answer.resposta).trim() : null);
  }

  const familyMatches = new Map();
  const familyBySurveyNumber = new Map();
  const newFamilies = [];
  const seenSourceIds = new Set();
  const sourceIdsByRowId = new Map(
    facilitiesRows
      .map(row => [familyRowId(row), familySourceId(row)])
      .filter(([rowId, sourceId]) => rowId && sourceId)
  );

  for (const row of facilitiesRows) {
    const sourceId = familySourceId(row);
    const data = familyDataFromFacilitiesRow(row);

    if (!sourceId) {
      report.issues.push({ type: 'family_source_id_missing', name: row['Nome do Morador:'] ?? null });
      continue;
    }
    if (seenSourceIds.has(sourceId)) {
      report.issues.push({ type: 'family_source_id_duplicated_in_xlsx', sourceFamilyId: sourceId });
      continue;
    }
    seenSourceIds.add(sourceId);

    if (!data) {
      report.issues.push({ type: 'family_name_missing', sourceFamilyId: sourceId });
      continue;
    }

    const existingFamilies = bySurveyNumber.get(sourceId) || [];
    if (existingFamilies.length > 1) {
      report.issues.push({
        type: 'family_survey_number_duplicated_in_database',
        surveyNumber: sourceId,
        familyIds: existingFamilies.map(existingFamily => existingFamily.id)
      });
      continue;
    }

    // The survey number is the only logical identity of a Family.
    let family = existingFamilies[0];
    if (family) {
      familyMatches.set(sourceId, family);
      familyBySurveyNumber.set(sourceId, family);
      report.familiesExistingBySurveyNumber++;
      continue;
    }

    // This is an intentionally NEW family from the XLSX.
    const virtualId = crypto.randomUUID();
    const rowSourceId = familyRowId(row);
    const appsheetSourceId = rowSourceId && !storedSourceIds.has(rowSourceId) ? rowSourceId : null;
    family = {
      id: virtualId,
      appsheetSourceId,
      dadosPessoais: { familyId: virtualId, ...data },
    };

    if (tx) {
      family = await client.family.create({
        data: {
          ...(appsheetSourceId ? { appsheetSourceId } : {}),
          dadosPessoais: { create: data }
        },
        include: { dadosPessoais: true }
      });
      report.familiesCreated++;
    } else {
      report.familiesToCreate++;
    }

    newFamilies.push(family);
    familyMatches.set(sourceId, family);
    familyBySurveyNumber.set(sourceId, family);
    addFamilyToIndexes(family, bySurveyNumber, sourceId);
    if (appsheetSourceId) storedSourceIds.add(appsheetSourceId);
  }

  return { result: familyMatches, bySurveyNumber: familyBySurveyNumber, sourceIdsByRowId, newFamilies };
}

function edificacaoSourceId(row) {
  const id = row['ID_edificação:'] ?? row['ID edificação:'] ?? row['ID:'] ?? row['ID'] ?? row['ID_edificacao'] ?? row['ID edificacao'];
  return empty(id) ? null : String(id).trim();
}

function resolveEstrutural(row, bySourceId, sourceIdsByRowId, issues) {
  // Edificação references the Facilities row ID; translate it to the
  // authoritative Numeração do levantamento before resolving the Family.
  const rawRef = String(row['Nome do Morador:'] ?? '').trim();
  const structuralId = edificacaoSourceId(row) ?? '(sem ID)';
  if (!rawRef) {
    issues.push({ type: 'structural_without_family', structuralId });
    return null;
  }

  const sourceId = sourceIdsByRowId.get(rawRef) || rawRef;
  const family = bySourceId.get(sourceId);
  if (family) return family;

  issues.push({
    type: 'structural_family_not_found',
    structuralId,
    sourceFamilyId: sourceId,
    sourceReference: rawRef
  });
  return null;
}

async function prepareEdificacoes(edificacoesRows, familyMatches, sourceIdsByRowId, familyBySourceId, report, tx = null) {
  const client = tx ?? prisma;
  const existingEdificacoes = await client.edificacao.findMany();
  const edificacaoBySourceId = new Map();
  for (const edif of existingEdificacoes) {
    if (edif.appsheetSourceId) {
      edificacaoBySourceId.set(String(edif.appsheetSourceId).trim(), edif);
    }
  }

  for (const row of edificacoesRows) {
    const sourceIdEdif = edificacaoSourceId(row);
    if (!sourceIdEdif) {
      report.issues.push({ type: 'edificacao_source_id_missing', row });
      continue;
    }

    const family = resolveEstrutural(row, familyBySourceId, sourceIdsByRowId, tx ? [] : report.issues);
    if (!family) {
      continue;
    }

    let edificacao = edificacaoBySourceId.get(sourceIdEdif);
    if (edificacao) {
      report.edificacoesExistingBySourceId++;
      continue;
    }

    const virtualId = crypto.randomUUID();
    edificacao = {
      id: virtualId,
      familyId: family.id,
      appsheetSourceId: sourceIdEdif
    };

    if (tx) {
      edificacao = await client.edificacao.create({
        data: {
          familyId: family.id,
          appsheetSourceId: sourceIdEdif
        }
      });
      report.edificacoesCreated++;
    } else {
      report.edificacoesToCreate++;
    }

    edificacaoBySourceId.set(sourceIdEdif, edificacao);
  }

  return edificacaoBySourceId;
}

async function processAnswer({ familyId, edificacaoId, perguntaId, resposta, dataResposta, userId }, report, tx) {
  const client = tx ?? prisma;
  let existing = null;
  let where = null;

  if (edificacaoId) {
    where = { edificacaoId_perguntaId: { edificacaoId, perguntaId } };
    existing = await client.facilitiesAnswer.findUnique({ where });
  } else if (familyId) {
    where = { familyId_perguntaId: { familyId, perguntaId } };
    existing = await client.facilitiesAnswer.findUnique({ where });
  } else {
    report.issues.push({ type: 'answer_without_context', perguntaId });
    return;
  }

  if (existing) {
    report.existingAnswers++;
    if (!OVERWRITE) return;
    report.toUpdate++;
  } else {
    report.toCreate++;
  }

  if (!tx) return;

  if (edificacaoId) {
    await tx.facilitiesAnswer.upsert({
      where,
      update: { resposta, userId: userId ?? existing?.userId ?? null },
      create: { edificacaoId, familyId: null, perguntaId, resposta, ...(dataResposta ? { dataResposta } : {}), userId: userId ?? null }
    });
  } else {
    await tx.facilitiesAnswer.upsert({
      where,
      update: { resposta, userId: userId ?? existing?.userId ?? null },
      create: { familyId, edificacaoId: null, perguntaId, resposta, ...(dataResposta ? { dataResposta } : {}), userId: userId ?? null }
    });
  }
}

async function processRows(mappings, familyMatches, sourceIdsByRowId, familyBySourceId, edificacaoBySourceId, report, tx = null) {
  const facilities = mappings.Facilities.rows;
  for (const row of facilities) {
    const family = familyMatches.get(familySourceId(row));
    if (!family) continue;
    for (const [column, resolved] of mappings.Facilities.columns) {
      const value = sourceValue(row[column]);
      if (empty(value)) continue;
      const q = resolved.question;
      const resposta = serialize(value, q.tipo, q.codigo);
      if (resposta === null) continue;
      report.rowsProcessed++;
      await processAnswer({ familyId: family.id, edificacaoId: null, perguntaId: q.id, resposta, dataResposta: row['Data da 1ª visita:'] instanceof Date ? row['Data da 1ª visita:'] : null, userId: null }, report, tx);
    }
  }

  for (const row of mappings.Edificacoes.rows) {
    const sourceIdEdif = edificacaoSourceId(row);
    const edificacao = sourceIdEdif ? edificacaoBySourceId.get(sourceIdEdif) : null;
    if (!edificacao) {
      report.issues.push({ type: 'structural_answer_without_edificacao', edificacaoSourceId: sourceIdEdif, row });
      continue;
    }
    for (const [column, resolved] of mappings.Edificacoes.columns) {
      const value = sourceValue(row[column]);
      if (empty(value)) continue;
      const q = resolved.question;
      const resposta = serialize(value, q.tipo, q.codigo);
      if (resposta === null) continue;
      report.rowsProcessed++;
      await processAnswer({ familyId: null, edificacaoId: edificacao.id, perguntaId: q.id, resposta, dataResposta: row['Data da visita:'] instanceof Date ? row['Data da visita:'] : null, userId: null }, report, tx);
    }
  }
}

async function processImages(wb, edificacaoBySourceId, familyBySourceId, report, tx = null) {
  const photoSheets = wb.SheetNames.filter(s => norm(s).startsWith('fotos'));
  report.photoSheetsFound = photoSheets;

  const client = tx ?? prisma;
  const existingImages = await client.imagem.findMany({ select: { id: true, appsheetSourceId: true, edificacaoId: true } });
  const existingImagesBySourceId = new Map();
  for (const img of existingImages) {
    if (img.appsheetSourceId && img.edificacaoId) {
      existingImagesBySourceId.set(`${img.edificacaoId}:${img.appsheetSourceId}`, img);
    }
  }
  const existingFamilyImages = await client.familyImage.findMany({ select: { id: true, familyId: true, caminho: true } });
  const existingFamilyImagesBySource = new Map();
  for (const img of existingFamilyImages) {
    existingFamilyImagesBySource.set(`${img.familyId}:${img.caminho}`, img);
  }

  for (const sheetName of photoSheets) {
    const rows = loadRows(wb, sheetName);
    const isFamilySheet = sheetName === 'Fotos';
    for (const row of rows) {
      const imgSourceId = sourceValue(row['ID:'] ?? row['ID']);
      if (isFamilySheet) {
        const familySourceId = sourceValue(row['Nome'] ?? row['Nome:']);
        const family = familySourceId ? familyBySourceId.get(String(familySourceId).trim()) : null;
        const foto = sourceValue(row['Foto:'] ?? row['Foto']);
        const descricao = sourceValue(row['Descrição:'] ?? row['Descrição']);

        if (!imgSourceId) {
          report.issues.push({ type: 'image_source_id_missing', sheet: sheetName, row });
          continue;
        }
        if (!familySourceId || !family) {
          report.issues.push({ type: 'image_family_not_found', imageSourceId: String(imgSourceId), familySourceId: familySourceId ? String(familySourceId) : null, sheet: sheetName });
          continue;
        }
        if (!foto) {
          report.issues.push({ type: 'image_path_missing', imageSourceId: String(imgSourceId), sheet: sheetName });
          continue;
        }

        const familyImageKey = `${family.id}:${String(foto)}`;
        const existingFamilyImage = existingFamilyImagesBySource.get(familyImageKey);
        if (existingFamilyImage) {
          report.existingImages++;
          if (!OVERWRITE) continue;
          report.imagesToUpdate++;
        } else {
          report.imagesToCreate++;
        }

        if (tx) {
          if (existingFamilyImage) {
            if (OVERWRITE) {
              await tx.familyImage.update({ where: { id: existingFamilyImage.id }, data: { descricao } });
            }
          } else {
            const created = await tx.familyImage.create({ data: { familyId: family.id, caminho: String(foto), descricao } });
            existingFamilyImagesBySource.set(familyImageKey, created);
            report.imagesCreated++;
          }
        }
        continue;
      }

      const edifSourceId = sourceValue(row['ID_edificação:'] ?? row['ID_edificação'] ?? row['ID edificação:'] ?? row['ID edificação']);
      const foto = sourceValue(row['Foto:'] ?? row['Foto']);
      const descricao = sourceValue(row['Descrição:'] ?? row['Descrição']);
      const orientacoes = sourceValue(row['Orientações:'] ?? row['Orientações']);
      const timestampRaw = row['Timestamp:'] ?? row['Timestamp'];
      const timestamp = timestampRaw instanceof Date ? timestampRaw : (empty(timestampRaw) ? null : new Date(timestampRaw));
      const validTimestamp = timestamp instanceof Date && !isNaN(timestamp.getTime()) ? timestamp : null;

      if (!imgSourceId) {
        report.issues.push({ type: 'image_source_id_missing', sheet: sheetName, row });
        continue;
      }
      if (!edifSourceId) {
        report.issues.push({ type: 'image_edificacao_id_missing', imageSourceId: String(imgSourceId), sheet: sheetName });
        continue;
      }

      const edificacao = edificacaoBySourceId.get(String(edifSourceId).trim());
      if (!edificacao) {
        report.issues.push({ type: 'image_edificacao_not_found', imageSourceId: String(imgSourceId), edifSourceId: String(edifSourceId), sheet: sheetName });
        continue;
      }

      const compositeKey = `${edificacao.id}:${String(imgSourceId).trim()}`;
      const existing = existingImagesBySourceId.get(compositeKey);

      if (existing) {
        report.existingImages++;
        if (!OVERWRITE) continue;
        report.imagesToUpdate++;
      } else {
        report.imagesToCreate++;
      }

      if (tx) {
        if (existing) {
          if (OVERWRITE) {
            await tx.imagem.update({
              where: { id: existing.id },
              data: { foto, descricao, orientacoes, timestamp: validTimestamp }
            });
          }
        } else {
          const created = await tx.imagem.create({
            data: {
              edificacaoId: edificacao.id,
              appsheetSourceId: String(imgSourceId).trim(),
              foto,
              descricao,
              orientacoes,
              timestamp: validTimestamp
            }
          });
          existingImagesBySourceId.set(compositeKey, created);
          report.imagesCreated++;
        }
      }
    }
  }
}

async function main() {
  if (!fs.existsSync(workbookPath)) throw new Error(`Arquivo XLSX não encontrado: ${workbookPath}`);
  console.log(`Modo: ${DRY_RUN ? 'DRY-RUN' : 'EXECUTE'}${OVERWRITE ? ' + OVERWRITE' : ''}`);
  console.log(`Arquivo: ${workbookPath}\n`);

  await validatePhysicalSchema();
  const wb = XLSX.readFile(workbookPath, { cellDates: true });
  const questions = await prisma.facilitiesQuestion.findMany({ orderBy: [{ formulario: 'asc' }, { ordem: 'asc' }] });
  const report = {
    mode: DRY_RUN ? 'dry-run' : 'execute',
    overwrite: OVERWRITE,
    workbook: workbookPath,
    timestamp: new Date().toISOString(),
    summary: {},
    mapping: {},
    issues: [],
    existingAnswers: 0,
    toCreate: 0,
    toUpdate: 0,
    rowsProcessed: 0,
    familiesToCreate: 0,
    familiesCreated: 0,
    familiesExistingBySurveyNumber: 0,
    familiesReusedByLegacyMatch: 0,
    edificacoesToCreate: 0,
    edificacoesCreated: 0,
    edificacoesExistingBySourceId: 0,
    photoSheetsFound: [],
    existingImages: 0,
    imagesToCreate: 0,
    imagesToUpdate: 0,
    imagesCreated: 0
  };

  const mappings = buildMappings(wb, questions, report);
  for (const [form, info] of Object.entries(mappings)) {
    report.mapping[form] = [...info.columns.entries()].map(([column, r]) => ({ column, code: r.code, method: r.method, active: r.question.ativa, question: r.question.texto }));
  }

  const surveyQuestion = mappings.Facilities.columns.get('Numeração do levantamento:')?.question;
  if (!surveyQuestion) throw new Error('A pergunta "Numeração do levantamento:" não foi mapeada.');
  const familyPreparation = await prepareFamilies(mappings.Facilities.rows, surveyQuestion, report);
  const { result: familyMatches, sourceIdsByRowId, bySurveyNumber: familyBySourceId } = familyPreparation;

  const edificacaoBySourceId = await prepareEdificacoes(mappings.Edificacoes.rows, familyMatches, sourceIdsByRowId, familyBySourceId, report);

  await processRows(mappings, familyMatches, sourceIdsByRowId, familyBySourceId, edificacaoBySourceId, report);
  const familyByAppSheetSourceId = new Map(
    [...familyMatches.values()]
      .filter(family => family.appsheetSourceId)
      .map(family => [String(family.appsheetSourceId).trim(), family])
  );
  await processImages(wb, edificacaoBySourceId, familyByAppSheetSourceId, report);

  report.summary = {
    facilitiesRows: mappings.Facilities.rows.length,
    structuralRows: mappings.Edificacoes.rows.length,
    structuralRowsWithFamilyId: mappings.Edificacoes.rows.filter(r => !empty(r['Nome do Morador:'])).length,
    familiesInXlsx: mappings.Facilities.rows.length,
    familiesMatched: familyMatches.size,
    familiesToCreate: report.familiesToCreate,
    familiesCreated: report.familiesCreated,
    familiesExistingBySurveyNumber: report.familiesExistingBySurveyNumber,
    familiesReusedByLegacyMatch: report.familiesReusedByLegacyMatch,
    edificacoesInXlsx: mappings.Edificacoes.rows.length,
    edificacoesMatched: edificacaoBySourceId.size,
    edificacoesToCreate: report.edificacoesToCreate,
    edificacoesCreated: report.edificacoesCreated,
    edificacoesExisting: report.edificacoesExistingBySourceId,
    mappedFacilitiesColumns: mappings.Facilities.columns.size,
    mappedStructuralColumns: mappings.Edificacoes.columns.size,
    answersToCreate: report.toCreate,
    answersToUpdate: report.toUpdate,
    answersAlreadyExisting: report.existingAnswers,
    photoSheetsFound: report.photoSheetsFound,
    imagesToCreate: report.imagesToCreate,
    imagesCreated: report.imagesCreated,
    imagesAlreadyExisting: report.existingImages,
    issues: report.issues.length
  };

  const blocking = new Set([
    'question_alias_target_not_found',
    'question_text_ambiguous',
    'family_source_id_missing',
    'family_source_id_duplicated_in_xlsx',
    'family_name_missing',
    'structural_family_not_found',
    'edificacao_source_id_missing',
    'edificacao_family_not_found'
  ]);
  if (EXECUTE && report.issues.some(i => blocking.has(i.type))) throw new Error('Migração abortada: o dry-run encontrou problemas estruturais. Corrija-os antes do --execute.');

  if (EXECUTE) {
    report.toCreate = 0; report.toUpdate = 0; report.existingAnswers = 0; report.rowsProcessed = 0;
    report.familiesCreated = 0; report.edificacoesCreated = 0; report.imagesCreated = 0; report.imagesToCreate = 0; report.existingImages = 0;
    await prisma.$transaction(async tx => {
      const prepared = await prepareFamilies(mappings.Facilities.rows, surveyQuestion, report, tx);
      const preparedEdifs = await prepareEdificacoes(mappings.Edificacoes.rows, prepared.result, prepared.sourceIdsByRowId, prepared.bySurveyNumber, report, tx);
      await processRows(mappings, prepared.result, prepared.sourceIdsByRowId, prepared.bySurveyNumber, preparedEdifs, report, tx);
      const familyByAppSheetSourceId = new Map(
        [...prepared.result.values()]
          .filter(family => family.appsheetSourceId)
          .map(family => [String(family.appsheetSourceId).trim(), family])
      );
      await processImages(wb, preparedEdifs, familyByAppSheetSourceId, report, tx);
    },
    {
      timeout: 120000
    });
    report.summary.answersCreated = report.toCreate;
    report.summary.answersUpdated = report.toUpdate;
    report.summary.edificacoesCreated = report.edificacoesCreated;
    report.summary.imagesCreated = report.imagesCreated;
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(JSON.stringify(report.summary, null, 2));
  console.log(`\nRelatório completo: ${reportPath}`);
  if (DRY_RUN) console.log('\nDRY-RUN: nenhuma alteração foi feita no banco.');
}

main().catch(err => { console.error('\nMIGRATION ERROR:', err); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });

