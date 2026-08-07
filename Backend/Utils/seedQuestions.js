const prisma = require('./prisma');

const facilitiesQuestions = [
  // SECTION: Identificação
  {
    formulario: "Facilities",
    codigo: "observacoes",
    texto: "Observações",
    tipo: "texto",
    ordem: 1,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Identificação"
  },
  {
    formulario: "Facilities",
    codigo: "num_levantamento",
    texto: "Numeração do levantamento:",
    tipo: "texto",
    ordem: 2,
    obrigatoria: true,
    ativa: true,
    opcoes: [],
    categoria: "Identificação"
  },
  {
    formulario: "Facilities",
    codigo: "nome_morador",
    texto: "Nome do Morador:",
    tipo: "texto",
    ordem: 3,
    obrigatoria: true,
    ativa: true,
    opcoes: [],
    categoria: "Identificação"
  },
  {
    formulario: "Facilities",
    codigo: "idade",
    texto: "Idade:",
    tipo: "number",
    ordem: 4,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Identificação"
  },
  {
    formulario: "Facilities",
    codigo: "localizacao",
    texto: "Localização:",
    tipo: "texto",
    ordem: 5,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Identificação"
  },
  {
    formulario: "Facilities",
    codigo: "endereco",
    texto: "Endereço:",
    tipo: "texto",
    ordem: 6,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Identificação"
  },
  {
    formulario: "Facilities",
    codigo: "telefone_contato",
    texto: "Telefone de contato (com DDD):",
    tipo: "texto",
    ordem: 7,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Identificação"
  },
  {
    formulario: "Facilities",
    codigo: "dono_telefone",
    texto: "Dono do Telefone:",
    tipo: "texto",
    ordem: 8,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Identificação"
  },

  // SECTION: Renda e Composição Familiar
  {
    formulario: "Facilities",
    codigo: "renda_mensal_total",
    texto: "Qual a Renda mensal familiar total?",
    tipo: "resposta_unica",
    ordem: 9,
    obrigatoria: false,
    ativa: true,
    opcoes: ["1/2 s.m.", "1/2 a 1 s.m.", "1 a 2 s.m.", "2 a 3 s.m.", "3 a 5 s.m.", "5 a 10 s.m.", "Acima de 10 s.m."],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "chefe_familia",
    texto: "Chefe de família:",
    tipo: "resposta_unica",
    ordem: 10,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Sim - Único", "Chefia compartilhada", "Não"],
    allowOther: true,
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "criancas_1_a_5",
    texto: "Quantidade de crianças na 1º infância(1 a 5 anos)",
    tipo: "number",
    ordem: 11,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "criancas_6_a_9",
    texto: "Quantidade de crianças (6 a 9 anos)",
    tipo: "number",
    ordem: 12,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "pre_adolescentes_10_a_14",
    texto: "Quantidade de pré-adolescentes (10 a 14 anos)",
    tipo: "number",
    ordem: 13,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "adolescentes_15_a_19",
    texto: "Quantidade de Adolescentes (15 a 19 anos)",
    tipo: "number",
    ordem: 14,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "num_moradores",
    texto: "Quantidade de moradores no lote",
    tipo: "resposta_unica",
    ordem: 15,
    obrigatoria: false,
    ativa: true,
    opcoes: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "casas_no_lote",
    texto: "Quantidade de casas no lote",
    tipo: "resposta_unica",
    ordem: 16,
    obrigatoria: false,
    ativa: true,
    opcoes: ["1", "2", "3", "4", "5", "6", "7", "8+"],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "familias_no_lote",
    texto: "Quantidade de famílias no lote",
    tipo: "resposta_unica",
    ordem: 17,
    obrigatoria: false,
    ativa: true,
    opcoes: ["1", "2", "3", "4", "5", "6", "7", "8+"],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "parentesco_casa",
    texto: "Relação de parentesco na casa",
    tipo: "resposta_unica",
    ordem: 18,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Pessoa responsável", "Cônjuge", "Filho(a)", "Outro parente", "Empregado(a) doméstico(a)", "Outra"],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "parentesco_lote",
    texto: "Relação de parentesco no lote",
    tipo: "resposta_unica",
    ordem: 19,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Pessoa responsável", "Cônjuge", "Filho(a)", "Outro parente", "Empregado(a) doméstico(a)", "Outra"],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "ocupacao_responsavel_1",
    texto: "Ocupação do responsável 1",
    tipo: "resposta_multipla",
    ordem: 20,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Profissional liberal", "Assalariado", "Funcionário Público", "Dona de casa", "Estudante", "Estudante com bolsa", "Aposentado(idade)", "Aposentado (invalidez)", "Programa social", "MEI", "Informal", "-"],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "ocupacao_responsavel_2",
    texto: "Ocupação do responsável 2",
    tipo: "resposta_multipla",
    ordem: 21,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Profissional liberal", "Assalariado", "Funcionário Público", "Dona de casa", "Estudante", "Estudante com bolsa", "Aposentado(idade)", "Aposentado (invalidez)", "Programa social", "MEI", "Informal", "-"],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "ocupacao_respondente_nao_responsavel",
    texto: "Ocupação do respondente não responsável",
    tipo: "resposta_multipla",
    ordem: 22,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Profissional liberal", "Assalariado", "Funcionário Público", "Dona de casa", "Estudante", "Estudante com bolsa", "Aposentado(idade)", "Aposentado (invalidez)", "Programa social", "MEI", "Informal", "-"],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "escolaridade",
    texto: "Escolaridade",
    tipo: "resposta_unica",
    ordem: 23,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Não sabe ler", "Fund. incompleto", "Fund. Completo", "Médio incompleto", "Médio completo", "Sup. incompleto", "Sup completo", "Pós-graduação", "Não respondeu"],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "onde_estuda",
    texto: "Se for estudante, onde estuda?",
    tipo: "resposta_unica",
    ordem: 24,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Na comunidade", "Outro bairro de Viana", "Outro município de RMGV"],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "empregabilidade_responsavel_1",
    texto: "Empregabilidade do responsável 1",
    tipo: "resposta_multipla",
    ordem: 25,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Em casa", "Na comunidade", "Viana", "Vitória", "Vila Velha", "Cariacica", "Serra", "Outro município"],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "empregabilidade_responsavel_2",
    texto: "Empregabilidade do responsável 2",
    tipo: "resposta_multipla",
    ordem: 26,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Em casa", "Na comunidade", "Viana", "Vitória", "Vila Velha", "Cariacica", "Serra", "Outro município"],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "auto_declaracao",
    texto: "A família se autodeclara:",
    tipo: "texto",
    ordem: 27,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Renda e Composição Familiar"
  },
  {
    formulario: "Facilities",
    codigo: "considera_quilombola",
    texto: "A família se considera quilombola?",
    tipo: "resposta_unica",
    ordem: 28,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Sim", "Não"],
    allowOther: true,
    categoria: "Renda e Composição Familiar"
  },

  // SECTION: Saberes e Artesanato
  {
    formulario: "Facilities",
    codigo: "pratica_artesanato",
    texto: "Prática de artesanato",
    tipo: "resposta_multipla",
    ordem: 29,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Corte e costura", "Tecido(patchwork, fuxico etc.)", "Crochê\\tricô", "Pintura", "Saboaria", "Madeira", "Instrumentos afro", "Tranças", "Barro\\cerâmica", "Artesanato afro"],
    categoria: "Saberes e Artesanato"
  },
  {
    formulario: "Facilities",
    codigo: "saberes_adquiridos",
    texto: "Saberes adquiridos",
    tipo: "resposta_multipla",
    ordem: 30,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Cultivo de alimentos", "Práticas medicinais", "Pratos típicos", "Artesanato", "Música com instrumentos afro", "Conhecimentos históricos e oralidade"],
    categoria: "Saberes e Artesanato"
  },

  // SECTION: Saúde
  {
    formulario: "Facilities",
    codigo: "comorbidades_membro_1",
    texto: "Comorbidades na família (membro 1)",
    tipo: "resposta_multipla",
    ordem: 31,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Cardiovascular", "Respiratória", "Neurológica", "Diabetes", "Imunossupressão", "Não possui"],
    categoria: "Saúde"
  },
  {
    formulario: "Facilities",
    codigo: "comorbidades_membro_2",
    texto: "Comorbidades na família (membro 2)",
    tipo: "resposta_multipla",
    ordem: 32,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Cardiovascular", "Respiratória", "Neurológica", "Diabetes", "Imunossupressão", "Não possui"],
    categoria: "Saúde"
  },
  {
    formulario: "Facilities",
    codigo: "comorbidades_membro_3",
    texto: "Comorbidades na família (membro 3)",
    tipo: "resposta_multipla",
    ordem: 33,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Cardiovascular", "Respiratória", "Neurológica", "Diabetes", "Imunossupressão", "Não possui"],
    categoria: "Saúde"
  },
  {
    formulario: "Facilities",
    codigo: "comorbidades_membro_4",
    texto: "Comorbidades na família (membro 4)",
    tipo: "resposta_multipla",
    ordem: 34,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Cardiovascular", "Respiratória", "Neurológica", "Diabetes", "Imunossupressão", "Não possui"],
    categoria: "Saúde"
  },
  {
    formulario: "Facilities",
    codigo: "deficiencia_membro_1",
    texto: "Pessoas com deficiência na família (membro 1)",
    tipo: "resposta_multipla",
    ordem: 35,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Física", "Auditiva", "Visual", "Intelectual", "Psicossocial"],
    categoria: "Saúde"
  },
  {
    formulario: "Facilities",
    codigo: "deficiencia_membro_2",
    texto: "Pessoas com deficiência na família (membro 2)",
    tipo: "resposta_multipla",
    ordem: 36,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Física", "Auditiva", "Visual", "Intelectual", "Psicossocial"],
    categoria: "Saúde"
  },
  {
    formulario: "Facilities",
    codigo: "deficiencia_membro_3",
    texto: "Pessoas com deficiência na família (membro 3)",
    tipo: "resposta_multipla",
    ordem: 37,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Física", "Auditiva", "Visual", "Intelectual", "Psicossocial"],
    categoria: "Saúde"
  },
  {
    formulario: "Facilities",
    codigo: "deficiencia_membro_4",
    texto: "Pessoas com deficiência na família (membro 4)",
    tipo: "resposta_multipla",
    ordem: 38,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Física", "Auditiva", "Visual", "Intelectual", "Psicossocial"],
    categoria: "Saúde"
  },
  {
    formulario: "Facilities",
    codigo: "medicamento_uso_continuo",
    texto: "Medicamento de uso contínuo",
    tipo: "resposta_unica",
    ordem: 39,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Sim", "Não", "Pega na farmácia popular do SUS"],
    categoria: "Saúde"
  },
  {
    formulario: "Facilities",
    codigo: "finalidade_medicamento",
    texto: "Finalidade do medicamento",
    tipo: "texto",
    ordem: 40,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Saúde"
  },
  {
    formulario: "Facilities",
    codigo: "doenca_respiratoria_membro_1",
    texto: "Pessoas com deficiência respiratória crônica (membro 1)",
    tipo: "resposta_multipla",
    ordem: 41,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Asma", "Bronquite", "Rinite", "Sinusite", "Fibrose cística", "DPOC", "Câncer", "Tuberculose"],
    categoria: "Saúde"
  },
  {
    formulario: "Facilities",
    codigo: "doenca_respiratoria_membro_2",
    texto: "Pessoas com deficiência respiratória crônica (membro 2)",
    tipo: "resposta_multipla",
    ordem: 42,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Asma", "Bronquite", "Rinite", "Sinusite", "Fibrose cística", "DPOC", "Câncer", "Tuberculose"],
    categoria: "Saúde"
  },
  {
    formulario: "Facilities",
    codigo: "doenca_respiratoria_membro_3",
    texto: "Pessoas com deficiência respiratória crônica (membro 3)",
    tipo: "resposta_multipla",
    ordem: 43,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Asma", "Bronquite", "Rinite", "Sinusite", "Fibrose cística", "DPOC", "Câncer", "Tuberculose"],
    categoria: "Saúde"
  },

  // SECTION: Imóvel
  {
    formulario: "Facilities",
    codigo: "forma_aquisicao_imovel",
    texto: "Qual a forma de aquisição do imóvel?",
    tipo: "resposta_unica",
    ordem: 44,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Herança", "Compra com recibo", "Posse", "Doação particular", "Refúgio", "Usucapião", "Doação pública", "Assentado", "Não sabe"],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "ano_construcao_casa",
    texto: "Sabem dizer em que ano a casa foi construída?",
    tipo: "texto",
    ordem: 45,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "tempo_residencia_imovel",
    texto: "Há quanto tempo residem neste imóvel?",
    tipo: "texto",
    ordem: 46,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "quem_executou_casa",
    texto: "Quem executou a casa?",
    tipo: "resposta_multipla",
    ordem: 47,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Pessoa da família", "Ajuda de vizinhos", "Profissional especializado", "Não sabe informar"],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "geracoes_na_casa",
    texto: "Quantas gerações moram na casa",
    tipo: "number",
    ordem: 48,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "geracoes_no_lote",
    texto: "Quantas gerações moram no lote",
    tipo: "number",
    ordem: 49,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "origem_cidade_bairro",
    texto: "Origem - cidade e bairro de origem",
    tipo: "resposta_multipla",
    ordem: 50,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Sempre morei em araçatiba", "Morei em outros bairros de Viana", "Morei em outros municípios da RMGV", "Morei em outro município do ES", "Morei em outro estado"],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "outros_bairros_cidade_detalhes",
    texto: "Em caso de moradia em outro bairro cidade, informe aqui",
    tipo: "texto",
    ordem: 51,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "anos_residencia_aracatiba",
    texto: "Há quantos anos a família reside em Araçatiba",
    tipo: "number",
    ordem: 52,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "possui_outro_imovel",
    texto: "A família possui algum outro imóvel ou terreno?",
    tipo: "resposta_multipla",
    ordem: 53,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Não possui outro imóvel", "Possui outro imóvel na comunidade", "Possui outro imóvel in Viana", "Possui imóvel em outro município"],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "valor_aluguel",
    texto: "Se a família está morando de aluguel, qual o valor?",
    tipo: "number",
    ordem: 54,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "relacao_aluguel_renda",
    texto: "O aluguel em relação a renda familiar mensal:",
    tipo: "texto",
    ordem: 55,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "imovel_teve_reforma",
    texto: "O imóvel já recebeu algum tipo de reforma ou ampliação",
    tipo: "resposta_unica",
    ordem: 56,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Sim", "Não"],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "tipo_reforma_executada",
    texto: "Que tipo de reforma foi executada",
    tipo: "texto",
    ordem: 57,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "quem_executou_reforma",
    texto: "Quem executou a reforma",
    tipo: "resposta_multipla",
    ordem: 58,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Os moradores", "Vizinhos da comunidade", "Contratou profissional especializado", "Não reformei"],
    categoria: "Imóvel"
  },
  {
    formulario: "Facilities",
    codigo: "quem_custeou_reforma",
    texto: "Quem custeou a reforma",
    tipo: "resposta_unica",
    ordem: 59,
    obrigatoria: false,
    ativa: true,
    opcoes: ["A prefeitura", "Outro recurso público", "Recurso próprio", "Não reformei"],
    categoria: "Imóvel"
  },

  // SECTION: Comunidade
  {
    formulario: "Facilities",
    codigo: "boa_vivencia_vizinhos",
    texto: "Convivência com os vizinhos",
    tipo: "resposta_unica",
    ordem: 60,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Boa relação", "Relação ruim", "Indiferente", "Não deseja ou não sabe informar"],
    categoria: "Comunidade"
  },
  {
    formulario: "Facilities",
    codigo: "formas_uso_quintal",
    texto: "Formas de uso do quintal",
    tipo: "resposta_multipla",
    ordem: 61,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Reuniões\\Lazer", "Produção vegetal", "Ervas medicinais", "Produção animal", "Plantas ornamentais", "Garagem", "Guarda de utensílios", "Rituais religiosos", "Processamento de alimentos"],
    categoria: "Comunidade"
  },
  {
    formulario: "Facilities",
    codigo: "habitos_alimentares",
    texto: "Hábitos alimentares",
    tipo: "resposta_multipla",
    ordem: 62,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Produção para consumo próprio", "Produção para venda", "Processados para consumo próprio", "Processados para venda", "Alimentos tradicionais para consumo próprio", "Tradicionais para venda", "Consumo habitual de ultraprocessados"],
    categoria: "Comunidade"
  },
  {
    formulario: "Facilities",
    codigo: "representacao_comunidade",
    texto: "Representação na comunidade",
    tipo: "resposta_multipla",
    ordem: 63,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Associação de moradores", "Grupo de jovens", "Grupo de mães", "Associação Quilombola", "Associação de produtores", "Associação de mulheres artesãs", "Movimento negro", "Grupos culturais", "Conselhos Municipais"],
    categoria: "Comunidade"
  },
  {
    formulario: "Facilities",
    codigo: "indicacao_profissionais",
    texto: "Profissionais e lojas indicadas pela família:",
    tipo: "texto",
    ordem: 64,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Comunidade"
  },
  {
    formulario: "Facilities",
    codigo: "recebe_boleto_agua_energia",
    texto: "Estão recebendo boleto de cobrança (talão) de água e energia?",
    tipo: "resposta_unica",
    ordem: 65,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Sim", "Não", "Não deseja ou não sabe informar"],
    categoria: "Comunidade"
  },

  // OBSOLETE/HISTORICAL FACILITIES QUESTIONS (for migration mapping)
  {
    formulario: "Facilities",
    codigo: "tipoLevantamento",
    texto: "Tipo de Levantamento (Histórico)",
    tipo: "texto",
    ordem: 100,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "idade_residentes_old",
    texto: "Idade dos Residentes (Histórico)",
    tipo: "texto",
    ordem: 101,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "adultos_empregados_old",
    texto: "Adultos Empregados (Histórico)",
    tipo: "texto",
    ordem: 102,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "renda_mensal_total_numeric_old",
    texto: "Renda Mensal Familiar Total (Numérica Histórica)",
    tipo: "number",
    ordem: 103,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "mulher_chefe_familia_old",
    texto: "Mulher chefe de família (Histórico)",
    tipo: "texto",
    ordem: 104,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "idoso_chefe_familia_old",
    texto: "Idoso chefe de família (Histórico)",
    tipo: "texto",
    ordem: 105,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "num_criancas_old",
    texto: "Quantidade de crianças (Histórico)",
    tipo: "number",
    ordem: 106,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "cadastrada_bolsa_familia_old",
    texto: "Cadastrada Bolsa Família (Histórico)",
    tipo: "texto",
    ordem: 107,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "comorbidade_familia_old",
    texto: "Comorbidade na Família (Histórico)",
    tipo: "texto",
    ordem: 108,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "doenca_respiratoria_old",
    texto: "Apresenta Doença Respiratória (Histórico)",
    tipo: "texto",
    ordem: 109,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "ano_construcao_tempo_residindo_old",
    texto: "Ano de Construção ou Tempo Residindo (Histórico)",
    tipo: "texto",
    ordem: 110,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "possui_outro_imovel_old",
    texto: "Possui Outro Imóvel (Histórico)",
    tipo: "texto",
    ordem: 111,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "reside_imovel_levantado_old",
    texto: "Reside no Imóvel Levantado (Histórico)",
    tipo: "texto",
    ordem: 112,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "imovel_teve_acao_anterior_old",
    texto: "Imóvel teve ação anterior (Histórico)",
    tipo: "texto",
    ordem: 113,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "participa_reuniao_acao_comunidade_old",
    texto: "Participa de reunião/ação de comunidade (Histórico)",
    tipo: "texto",
    ordem: 114,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "utiliza_banco_comunitario_old",
    texto: "Utiliza Banco Comunitário (Histórico)",
    tipo: "texto",
    ordem: 115,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "ponto_proximo_entrega_old",
    texto: "Ponto próximo para entrega (Histórico)",
    tipo: "texto",
    ordem: 116,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "possui_reservatorio_agua_old",
    texto: "Possui reservatório de água (Histórico)",
    tipo: "texto",
    ordem: 117,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "estado_reservatorio_agua_old",
    texto: "Estado do reservatório de água (Histórico)",
    tipo: "texto",
    ordem: 118,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "espaco_para_hortas_canteiro_old",
    texto: "Espaço para hortas/canteiro (Histórico)",
    tipo: "texto",
    ordem: 119,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "possui_banheiro_old",
    texto: "Possui banheiro (Histórico)",
    tipo: "texto",
    ordem: 120,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "possui_cozinha_old",
    texto: "Possui cozinha (Histórico)",
    tipo: "texto",
    ordem: 121,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "data_primeira_visita_old",
    texto: "Data primeira visita (Histórico)",
    tipo: "texto",
    ordem: 122,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "nome_responsavel_formulario_old",
    texto: "Nome responsável formulário (Histórico)",
    tipo: "texto",
    ordem: 123,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "nome_responsavel_fotografico_old",
    texto: "Nome responsável fotográfico (Histórico)",
    tipo: "texto",
    ordem: 124,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "nome_responsavel_arquitetonico_old",
    texto: "Nome responsável arquitetônico (Histórico)",
    tipo: "texto",
    ordem: 125,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "nome_agente_comunitario_old",
    texto: "Nome agente comunitário (Histórico)",
    tipo: "texto",
    ordem: 126,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "outros_profissionais_envolvidos_old",
    texto: "Outros profissionais envolvidos (Histórico)",
    tipo: "texto",
    ordem: 127,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "demanda_familia_old",
    texto: "Demanda da família (Histórico)",
    tipo: "texto",
    ordem: 128,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },
  {
    formulario: "Facilities",
    codigo: "descricao_pendencias_old",
    texto: "Descrição das pendências (Histórico)",
    tipo: "texto",
    ordem: 129,
    obrigatoria: false,
    ativa: false,
    opcoes: [],
    categoria: "Histórico"
  },

  // SECTION: EDIFICAÇÕES (STRUCTURAL) QUESTIONS
  {
    formulario: "Edificacoes",
    codigo: "problemasInsalubridade",
    texto: "Problemas de insalubridade:",
    tipo: "resposta_multipla",
    ordem: 1,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Parâmetros de Salubridade"
  },
  {
    formulario: "Edificacoes",
    codigo: "necessitaReparosEstrutural",
    texto: "Necessita de reparos estruturais:",
    tipo: "resposta_unica",
    ordem: 2,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Sim", "Não"],
    categoria: "Parâmetros de Salubridade"
  },
  {
    formulario: "Edificacoes",
    codigo: "resolveProblemaNoProprioTerreno",
    texto: "Resolve o problema no próprio terreno:",
    tipo: "resposta_unica",
    ordem: 3,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Sim", "Não"],
    categoria: "Parâmetros de Salubridade"
  },
  {
    formulario: "Edificacoes",
    codigo: "edificacaoEmAreaDeRisco",
    texto: "Edificação em área de risco:",
    tipo: "resposta_unica",
    ordem: 4,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Sim", "Não"],
    categoria: "Parâmetros de Salubridade"
  },
  {
    formulario: "Edificacoes",
    codigo: "numQuartos",
    texto: "Nº de quartos:",
    tipo: "number",
    ordem: 5,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Parâmetros de Salubridade"
  },
  {
    formulario: "Edificacoes",
    codigo: "coabitacao",
    texto: "Coabitação:",
    tipo: "resposta_unica",
    ordem: 6,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Sim", "Não"],
    categoria: "Parâmetros de Salubridade"
  },
  {
    formulario: "Edificacoes",
    codigo: "insercaoLote",
    texto: "Inserção no lote:",
    tipo: "number",
    ordem: 7,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Componentes Construtivos"
  },
  {
    formulario: "Edificacoes",
    codigo: "fundacoes",
    texto: "Fundações:",
    tipo: "number",
    ordem: 8,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Componentes Construtivos"
  },
  {
    formulario: "Edificacoes",
    codigo: "estrutura",
    texto: "Estrutura:",
    tipo: "number",
    ordem: 9,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Componentes Construtivos"
  },
  {
    formulario: "Edificacoes",
    codigo: "paredes",
    texto: "Paredes:",
    tipo: "number",
    ordem: 10,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Componentes Construtivos"
  },
  {
    formulario: "Edificacoes",
    codigo: "cobertura",
    texto: "Cobertura:",
    tipo: "number",
    ordem: 11,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Componentes Construtivos"
  },
  {
    formulario: "Edificacoes",
    codigo: "esquadrias",
    texto: "Esquadrias:",
    tipo: "number",
    ordem: 12,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Componentes Construtivos"
  },
  {
    formulario: "Edificacoes",
    codigo: "hidrossanitario",
    texto: "Hidrossanitário:",
    tipo: "number",
    ordem: 13,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Componentes Construtivos"
  },
  {
    formulario: "Edificacoes",
    codigo: "eletrico",
    texto: "Elétrico:",
    tipo: "number",
    ordem: 14,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Componentes Construtivos"
  },
  {
    formulario: "Edificacoes",
    codigo: "banheiros",
    texto: "Banheiros:",
    tipo: "number",
    ordem: 15,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Componentes Construtivos"
  },
  {
    formulario: "Edificacoes",
    codigo: "cozinhaAreaDeServico",
    texto: "Cozinha / Área de serviço:",
    tipo: "number",
    ordem: 16,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Componentes Construtivos"
  },
  {
    formulario: "Edificacoes",
    codigo: "conforto",
    texto: "Conforto:",
    tipo: "number",
    ordem: 17,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Componentes Construtivos"
  },
  {
    formulario: "Edificacoes",
    codigo: "avaliacaoResidencia",
    texto: "Avaliação geral da residência:",
    tipo: "texto",
    ordem: 18,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Avaliação Qualitativa"
  },
  {
    formulario: "Edificacoes",
    codigo: "acompanhamentoPsicossocial",
    texto: "Necessita de acompanhamento psicossocial:",
    tipo: "resposta_unica",
    ordem: 19,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Sim", "Não"],
    categoria: "Avaliação Qualitativa"
  },
  {
    formulario: "Edificacoes",
    codigo: "circulacaoInternaSegura",
    texto: "Circulação interna segura:",
    tipo: "resposta_unica",
    ordem: 20,
    obrigatoria: false,
    ativa: true,
    opcoes: ["Sim", "Não"],
    categoria: "Avaliação Qualitativa"
  },
  {
    formulario: "Edificacoes",
    codigo: "avaliacaoInfraestruturaUrbana",
    texto: "Avaliação da infraestrutura urbana:",
    tipo: "number",
    ordem: 21,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Inserção Urbana e Acessibilidade"
  },
  {
    formulario: "Edificacoes",
    codigo: "avaliacaoAcessibilidadeTransporteLazerSaneamento",
    texto: "Acessibilidade/Transporte/Lazer/Saneamento:",
    tipo: "texto",
    ordem: 22,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Inserção Urbana e Acessibilidade"
  },
  {
    formulario: "Edificacoes",
    codigo: "opiniaoGeralDaCasa",
    texto: "Opinião geral da casa:",
    tipo: "number",
    ordem: 23,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Opinião Geral"
  },
  {
    formulario: "Edificacoes",
    codigo: "diagnosticoPreliminar",
    texto: "Diagnóstico preliminar:",
    tipo: "texto",
    ordem: 24,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Opinião Geral"
  },
  {
    formulario: "Edificacoes",
    codigo: "situacaoPositiva",
    texto: "Situação positiva:",
    tipo: "texto",
    ordem: 25,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Opinião Geral"
  },
  {
    formulario: "Edificacoes",
    codigo: "observacoesGerais",
    texto: "Observações gerais:",
    tipo: "texto",
    ordem: 26,
    obrigatoria: false,
    ativa: true,
    opcoes: [],
    categoria: "Opinião Geral"
  }
];

// Perguntas vigentes da entrevista Estrutural. As perguntas anteriores foram
// mantidas apenas no histórico de respostas; não são mais semeadas/ativadas.
const estruturalQuestions = [
  { formulario: "Edificacoes", codigo: "EST001", texto: "Possui reservatório de água na residência?", tipo: "resposta_unica", ordem: 1, obrigatoria: false, ativa: true, opcoes: ["Caixa d'água", "Água encanada", "Não sabe informar"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST002", texto: "A unidade tem banheiro?", tipo: "resposta_multipla", ordem: 2, obrigatoria: false, ativa: true, opcoes: ["Sim, dentro da casa", "Sim, fora da casa", "Não", "Duchas no quintal"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST003", texto: "A unidade tem cozinha?", tipo: "resposta_multipla", ordem: 3, obrigatoria: false, ativa: true, opcoes: ["Sim, dentro de casa", "Sim, fora de casa", "Sim, dentro e fora de casa", "Possui apenas fogão a gás/elétrico", "Possui apenas fogão a lenha", "Possui ambos"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST004", texto: "Data da 1ª visita:", tipo: "data", ordem: 4, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST005", texto: "Nome do responsável pelo formulário:", tipo: "texto", ordem: 5, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST006", texto: "Nome do responsável pelo relatório fotográfico:", tipo: "texto", ordem: 6, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST007", texto: "Nome do responsável pelo levantamento arquitetônico:", tipo: "texto", ordem: 7, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST008", texto: "Nome do agente comunitário:", tipo: "texto", ordem: 8, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST009", texto: "Outros profissionais envolvidos (nomes e funções desempenhadas):", tipo: "texto", ordem: 9, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST010", texto: "Demanda apresentada pela família:", tipo: "texto", ordem: 10, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST011", texto: "ID", tipo: "texto", ordem: 11, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST012", texto: "Nome do Morador:", tipo: "texto", ordem: 12, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST013", texto: "Há problemas de insalubridade com:", tipo: "texto", ordem: 13, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST014", texto: "Existe a necessidade de realização de reparos estruturais?", tipo: "resposta_unica", ordem: 14, obrigatoria: false, ativa: true, opcoes: ["Sim", "Não"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST015", texto: "Fotos para verificação do engenheiro:", tipo: "texto", ordem: 15, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST016", texto: "Existe a possibilidade de resolver os problemas dentro do próprio terreno (a partir da estrutura existente)?", tipo: "resposta_unica", ordem: 16, obrigatoria: false, ativa: true, opcoes: ["Sim", "Não"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST017", texto: "De acordo com a defesa civil? A edificação encontra-se em área de risco?", tipo: "resposta_unica", ordem: 17, obrigatoria: false, ativa: true, opcoes: [], allowOther: true, categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST018", texto: "Número de quartos:", tipo: "number", ordem: 18, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST019", texto: "Superpopulação:", tipo: "texto", ordem: 19, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST020", texto: "Coabitação:", tipo: "resposta_unica", ordem: 20, obrigatoria: false, ativa: true, opcoes: ["Sim", "Não"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST021", texto: "Inserção no lote:", tipo: "resposta_unica", ordem: 21, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST022", texto: "Fundações:", tipo: "resposta_unica", ordem: 22, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST023", texto: "Estrutura:", tipo: "resposta_unica", ordem: 23, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST024", texto: "Paredes:", tipo: "resposta_unica", ordem: 24, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST025", texto: "Cobertura:", tipo: "resposta_unica", ordem: 25, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST026", texto: "Esquadrias:", tipo: "resposta_unica", ordem: 26, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST027", texto: "Hidrossanitário:", tipo: "resposta_unica", ordem: 27, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST028", texto: "Elétrico:", tipo: "resposta_unica", ordem: 28, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST029", texto: "Banheiro(s):", tipo: "resposta_unica", ordem: 29, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST030", texto: "Cozinha/área de serviço:", tipo: "resposta_unica", ordem: 30, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST031", texto: "Conforto:", tipo: "resposta_unica", ordem: 31, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST032", texto: "Avaliação da residência:", tipo: "texto", ordem: 32, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST033", texto: "A circulação interna na unidade é segura e adequada para todos os membros da família?", tipo: "resposta_unica", ordem: 33, obrigatoria: false, ativa: true, opcoes: ["Sim", "Não"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST034", texto: "Como você avaliaria a infraestrutura urbana no entorno da residência?", tipo: "resposta_unica", ordem: 34, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST035", texto: "Como você avaliaria a acessibilidade, transporte, lazer, saneamento básico e serviços?", tipo: "texto", ordem: 35, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST036", texto: "Na sua opinião, qual a situação geral da casa?", tipo: "resposta_unica", ordem: 36, obrigatoria: false, ativa: true, opcoes: ["1", "2", "3"], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST037", texto: "Diagnóstico preliminar:", tipo: "texto", ordem: 37, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST038", texto: "Aponte pelo menos uma situação positiva da edificação que você observou.", tipo: "texto", ordem: 38, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" },
  { formulario: "Edificacoes", codigo: "EST039", texto: "Observações gerais:", tipo: "texto", ordem: 39, obrigatoria: false, ativa: true, opcoes: [], categoria: "Edificação" }
];

const socioeconomicaColToQuestionCode = {
  tipoLevantamento: 'tipoLevantamento',
  numMoradores: 'num_moradores',
  idadeResidentes: 'idade_residentes_old',
  adultosEmpregados: 'adultos_empregados_old',
  rendaMensalTotal: 'renda_mensal_total_numeric_old',
  mulherChefeFamilia: 'mulher_chefe_familia_old',
  idosoChefeFamilia: 'idoso_chefe_familia_old',
  numCriancas: 'num_criancas_old',
  autoDeclaracaoFamilia: 'auto_declaracao',
  cadastradaBolsaFamilia: 'cadastrada_bolsa_familia_old',
  comorbidadeNaFamilia: 'comorbidade_familia_old',
  apresentaDoencaRespiratoria: 'doenca_respiratoria_old',
  formaAquisicaoImovel: 'forma_aquisicao_imovel',
  anoDeConstrucaoTempoResidindo: 'ano_construcao_tempo_residindo_old',
  possuiOutroImovel: 'possui_outro_imovel_old',
  resideNoImovelLevantado: 'reside_imovel_levantado_old',
  qualValorAluguel: 'valor_aluguel',
  relacaoAluguelRenda: 'relacao_aluguel_renda',
  imovelTeveAcaoAnterior: 'imovel_teve_acao_anterior_old',
  boaVivenciaVizinhos: 'boa_vivencia_vizinhos',
  participaReuniaoAcaoComunidade: 'participa_reuniao_acao_comunidade_old',
  utilizaBancoComunitario: 'utiliza_banco_comunitario_old',
  indicacaoDeProfissionais: 'indicacao_profissionais',
  pontoProximoEntrega: 'ponto_proximo_entrega_old',
  recebeBoletoAguaEnergia: 'recebe_boleto_agua_energia',
  possuiReservatorioAgua: 'possui_reservatorio_agua_old',
  estadoReservatorioAgua: 'estado_reservatorio_agua_old',
  espacoParaHortasCanteiro: 'espaco_para_hortas_canteiro_old',
  possuiBanheiro: 'possui_banheiro_old',
  possuiCozinha: 'possui_cozinha_old',
  dataPrimeiraVisita: 'data_primeira_visita_old',
  nomeResponsavelFormulario: 'nome_responsavel_formulario_old',
  nomeResponsavelFotografico: 'nome_responsavel_fotografico_old',
  nomeResponsavelArquitetonico: 'nome_responsavel_arquitetonico_old',
  nomeAgenteComunitario: 'nome_agente_comunitario_old',
  outrosProfissionaisEnvolvidos: 'outros_profissionais_envolvidos_old',
  demandaDaFamilia: 'demanda_familia_old',
  descricaoPendencias: 'descricao_pendencias_old'
};

const estruturalColToQuestionCode = {
  problemasInsalubridade: 'problemasInsalubridade',
  necessitaReparosEstrutural: 'necessitaReparosEstrutural',
  resolveProblemaNoProprioTerreno: 'resolveProblemaNoProprioTerreno',
  edificacaoEmAreaDeRisco: 'edificacaoEmAreaDeRisco',
  numQuartos: 'numQuartos',
  coabitacao: 'coabitacao',
  insercaoLote: 'insercaoLote',
  fundacoes: 'fundacoes',
  estrutura: 'estrutura',
  paredes: 'paredes',
  cobertura: 'cobertura',
  esquadrias: 'esquadrias',
  hidrossanitario: 'hidrossanitario',
  eletrico: 'eletrico',
  banheiros: 'banheiros',
  cozinhaAreaDeServico: 'cozinhaAreaDeServico',
  conforto: 'conforto',
  avaliacaoResidencia: 'avaliacaoResidencia',
  acompanhamentoPsicossocial: 'acompanhamentoPsicossocial',
  circulacaoInternaSegura: 'circulacaoInternaSegura',
  avaliacaoInfraestruturaUrbana: 'avaliacaoInfraestruturaUrbana',
  avaliacaoAcessibilidadeTransporteLazerSaneamento: 'avaliacaoAcessibilidadeTransporteLazerSaneamento',
  opiniaoGeralDaCasa: 'opiniaoGeralDaCasa',
  diagnosticoPreliminar: 'diagnosticoPreliminar',
  situacaoPositiva: 'situacaoPositiva',
  observacoesGerais: 'observacoesGerais'
};

async function seedAndMigrate() {
  console.log('Starting Questions Seeding and Data Migration...');

  // 1. Seed/Upsert questions
  const questionsToSeed = [...facilitiesQuestions, ...estruturalQuestions];
  const structuralCodes = estruturalQuestions.map(q => q.codigo);

  const questionMap = new Map();
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
        opcoes: q.opcoes,
        allowOther: q.allowOther || false,
        categoria: q.categoria
      },
      create: {
        formulario: q.formulario,
        codigo: q.codigo,
        texto: q.texto,
        tipo: q.tipo,
        ordem: q.ordem,
        obrigatoria: q.obrigatoria,
        ativa: q.ativa,
        opcoes: q.opcoes,
        allowOther: q.allowOther || false,
        categoria: q.categoria
      }
    });
    questionMap.set(q.codigo, dbQuestion.id);
  }
  // Retira do formulário as perguntas estruturais antigas sem apagar suas
  // respostas históricas, que continuam vinculadas às perguntas originais.
  // Elas ainda são semeadas acima para que a migração dos registros legados
  // consiga preservar a ligação pergunta-resposta quando necessário.
  await prisma.facilitiesQuestion.updateMany({
    where: { formulario: 'Edificacoes', codigo: { notIn: structuralCodes } },
    data: { ativa: false }
  });
  console.log('Seeded', questionsToSeed.length, 'questions.');

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
  console.log('Seeding and Migration completed successfully!');
}

module.exports = seedAndMigrate;
