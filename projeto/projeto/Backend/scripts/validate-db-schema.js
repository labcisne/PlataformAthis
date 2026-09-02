#!/usr/bin/env node

const prisma = require('../Utils/prisma');

const expected = {
  users: ['id'],
  families: ['id'],
  family_dados_pessoais: ['familyId', 'nomeMorador', 'telefone'],
  family_socioeconomica: ['familyId'],
  family_estrutural: ['familyId'],
  facilities_questions: ['id', 'formulario', 'codigo', 'texto', 'tipo', 'ordem', 'obrigatoria', 'ativa', 'opcoes', 'allowOther', 'categoria'],
  facilities_answers: ['id', 'familyId', 'perguntaId', 'resposta', 'dataResposta', 'userId'],
};

async function main() {
  const tables = await prisma.$queryRawUnsafe(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `);
  const tableSet = new Set(tables.map(row => row.table_name));
  const missingTables = Object.keys(expected).filter(t => !tableSet.has(t));
  if (missingTables.length) throw new Error(`Tabelas ausentes: ${missingTables.join(', ')}`);

  const columns = await prisma.$queryRawUnsafe(`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
  `);
  const byTable = new Map();
  for (const row of columns) {
    if (!byTable.has(row.table_name)) byTable.set(row.table_name, new Set());
    byTable.get(row.table_name).add(row.column_name);
  }

  const missingColumns = [];
  for (const [table, names] of Object.entries(expected)) {
    for (const name of names) if (!byTable.get(table).has(name)) missingColumns.push(`${table}.${name}`);
  }

  if (missingColumns.length) throw new Error(`Colunas ausentes: ${missingColumns.join(', ')}`);

  console.log('Schema OK. Nomes físicos verificados:');
  Object.entries(expected).forEach(([table, names]) => console.log(`- ${table}: ${names.length} colunas verificadas`));
}

main().catch(error => {
  console.error(`Schema ERROR: ${error.message}`);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
