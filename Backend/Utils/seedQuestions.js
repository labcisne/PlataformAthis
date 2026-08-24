const prisma = require('./prisma');
const { facilitiesQuestions, estruturalQuestions, legacySourceQuestions } = require('./questionCatalog');

async function seedQuestions() {
  const questionsToSeed = [...facilitiesQuestions, ...estruturalQuestions, ...legacySourceQuestions];
  const byFormulario = new Map();

  for (const q of questionsToSeed) {
    const dbQuestion = await prisma.facilitiesQuestion.upsert({
      where: { codigo: q.codigo },
      update: {
        formulario: q.formulario,
        texto: q.texto,
        tipo: q.tipo,
        ordem: q.ordem,
        obrigatoria: q.obrigatoria,
        ativa: q.ativa,
        opcoes: q.opcoes || [],
        allowOther: q.allowOther || false,
        categoria: q.categoria || null
      },
      create: {
        formulario: q.formulario,
        codigo: q.codigo,
        texto: q.texto,
        tipo: q.tipo,
        ordem: q.ordem,
        obrigatoria: q.obrigatoria,
        ativa: q.ativa,
        opcoes: q.opcoes || [],
        allowOther: q.allowOther || false,
        categoria: q.categoria || null
      }
    });
    if (!byFormulario.has(q.formulario)) byFormulario.set(q.formulario, new Set());
    byFormulario.get(q.formulario).add(q.codigo);
  }

  // O catálogo é a fonte de verdade do formulário atual.
  // Se uma pergunta deixar de existir no catálogo, ela NÃO é apagada: apenas
  // fica inativa e suas respostas históricas continuam no banco.
  for (const [formulario, codes] of byFormulario) {
    await prisma.facilitiesQuestion.updateMany({
      where: { formulario, codigo: { notIn: [...codes] } },
      data: { ativa: false }
    });
  }

  console.log(`Questions synchronized: ${questionsToSeed.length}`);
}

async function migrateLegacyAnswers() {
  const questionsToSeed = [...facilitiesQuestions, ...estruturalQuestions];
  const questionMap = new Map();
  const seededQuestions = await prisma.facilitiesQuestion.findMany({ where: { codigo: { in: questionsToSeed.map(q => q.codigo) } } });
  seededQuestions.forEach(q => questionMap.set(q.codigo, q.id));
  // 2. Migrate existing Socioeconomica answers
  const socioRecords = await prisma.familySocioeconomica.findMany();
  let socioCount = 0;
  for (const rec of socioRecords) {
    const familyId = rec.familyId;
    const userId = rec.userId;
    const dateResponse = rec.dataPrimeiraVisita || new Date();

    for (const [col, val] of Object.entries(rec)) {
      if (col === 'familyId' || col === 'userId' || val === null || val === undefined || val === '') continue;

      const code = socioeconomicaColToQuestionCode[col];
      if (code && questionMap.has(code)) {
        const questionId = questionMap.get(code);
        // Format value to string
        let stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);

        await prisma.facilitiesAnswer.upsert({
          where: {
            familyId_perguntaId: {
              familyId,
              perguntaId: questionId
            }
          },
          update: {
            resposta: stringVal,
            userId: userId
          },
          create: {
            familyId,
            perguntaId: questionId,
            resposta: stringVal,
            dataResposta: dateResponse,
            userId: userId
          }
        });
        socioCount++;
      }
    }
  }
  console.log(`Migrated ${socioCount} socioeconomica answers.`);

  // 3. Migrate existing Estrutural answers
  const estruturalRecords = await prisma.familyEstrutural.findMany();
  let estruturalCount = 0;
  for (const rec of estruturalRecords) {
    const familyId = rec.familyId;
    const userId = rec.userId;

    for (const [col, val] of Object.entries(rec)) {
      if (col === 'familyId' || col === 'userId' || val === null || val === undefined || val === '') continue;

      const code = estruturalColToQuestionCode[col];
      if (code && questionMap.has(code)) {
        const questionId = questionMap.get(code);
        let stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);

        await prisma.facilitiesAnswer.upsert({
          where: {
            familyId_perguntaId: {
              familyId,
              perguntaId: questionId
            }
          },
          update: {
            resposta: stringVal,
            userId: userId
          },
          create: {
            familyId,
            perguntaId: questionId,
            resposta: stringVal,
            userId: userId
          }
        });
        estruturalCount++;
      }
    }
  }
  console.log(`Migrated ${estruturalCount} estrutural answers.`);
}

async function seedAndMigrate() {
  await seedQuestions();
  await migrateLegacyAnswers();
}

module.exports = seedQuestions;
module.exports.seedQuestions = seedQuestions;
module.exports.migrateLegacyAnswers = migrateLegacyAnswers;
module.exports.seedAndMigrate = seedAndMigrate;

if (require.main === module) {
  seedQuestions()
    .then(() => prisma.$disconnect())
    .catch(error => { console.error('Question sync ERROR:', error); process.exitCode = 1; })
    .finally(() => prisma.$disconnect());
}
