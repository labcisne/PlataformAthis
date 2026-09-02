# Plano de migração AppSheet -> banco atual

## 1. Diagnóstico do projeto

O projeto atual usa PostgreSQL + Prisma.

Fluxo principal:
- `User` representa entrevistadores/moradores/administradores.
- `Family` é a entidade central da família.
- `FamilyMembership` relaciona usuários e famílias.
- `FacilitiesQuestion` é o catálogo atual de perguntas de Facilities e Edificações.
- `FacilitiesAnswer` guarda a resposta e possui `familyId` + `perguntaId`.
- `formatFamily()` reconstrói `tabelaSocioeconomica` e `tabelaEstrutural` a partir de `FacilitiesAnswer`.

Portanto, a migração não deve recriar tabelas de respostas. O destino correto é `facilities_answers`.

## 2. O que existe no arquivo fornecido

`Dados para serem migrados.xlsx` possui 17 planilhas.

Dados relevantes:
- `Facilities`: 32 famílias/registros.
- `Edificação`: 28 linhas com algum dado.
- Em `Edificação`, 27 linhas possuem o ID da família na segunda coluna.
- 1 linha (`ID_edificação = 86519225`) não possui ID de família e não pode ser ligada com segurança.
- 5 famílias da planilha Facilities não possuem registro correspondente na planilha Edificação.

As demais planilhas de arquivos/fotos estão vazias no arquivo fornecido e ficam fora desta migração de respostas.

## 3. Identificação das famílias

Por isso, o script deve:
1. ler exclusivamente `Numeração do levantamento:`;
2. usar esse número como `Family.appsheetSourceId` e chave de matching;
3. reutilizar uma família somente quando esse source ID já existir;
4. criar uma nova família quando o source ID ainda não existir;
5. reportar números ausentes ou duplicados no XLSX.

Nome, telefone e endereço não são usados para identificar ou reutilizar famílias.
Na aba `Edificação`, a referência técnica da linha `Facilities` é apenas traduzida
para o número do levantamento antes de resolver a família; ela não é uma chave alternativa.

## 4. Identificação das perguntas

As perguntas atuais já estão cadastradas em `FacilitiesQuestion`.

A migração usa os códigos atuais (`codigo`) como destino.

Não deve criar perguntas novas.

As colunas da planilha que não correspondem a perguntas ativas atuais devem ser apenas reportadas como "não migradas". Isso evita colocar dados antigos em perguntas históricas ou em campos que não pertencem ao formulário atual.

## 5. Valores

- Texto: preservar.
- Número: converter para representação numérica em string.
- Resposta única: preservar o valor de origem.
- Resposta múltipla: converter para JSON array; o delimitador histórico usado pela planilha é tratado como ` , `.
- Booleanos `True/False` da coluna de reforma são convertidos para `Sim/Não`.
- Valores históricos que não existem mais nas opções atuais não devem ser descartados: a resposta histórica deve ser preservada.

## 6. Entrevistador

Os responsáveis das entrevistas estruturais são valores textuais das respostas.
O script não consulta `User`, não cria responsáveis e grava essas respostas com
`userId` nulo.

## 7. Data da resposta

- Facilities: usar `Data da 1ª visita` quando disponível.
- Edificação: usar `Data da visita` quando disponível.
- Se a data estiver ausente, deixar o banco utilizar o `@default(now())`.

## 8. Segurança

O script deve funcionar em dois modos:

- `--dry-run` (padrão): não altera o banco.
- `--execute`: realiza a migração.

Além disso:
- por padrão, não sobrescrever respostas que já existam;
- `--overwrite` deve ser exigido para substituir uma resposta existente;
- executar a gravação dentro de transação;
- qualquer erro crítico deve provocar rollback.

## 9. Validação

Antes de executar:
- todas as famílias devem estar identificadas;
- todas as perguntas destino devem existir e estar ativas;
- nenhum vínculo de família deve ser ambíguo;
- registros estruturais sem família devem aparecer no relatório;
- respostas inválidas estruturalmente devem ser reportadas;
- a quantidade de registros processáveis deve ser apresentada.

Só depois do dry-run aprovado executar a migração.

## 10. Resultado esperado

As respostas devem terminar em:

`facilities_answers.familyId`
`facilities_answers.perguntaId`
`facilities_answers.resposta`
`facilities_answers.dataResposta`
`facilities_answers.userId`

Assim o sistema atual continuará encontrando as respostas pelo mesmo fluxo já utilizado pela aplicação.
