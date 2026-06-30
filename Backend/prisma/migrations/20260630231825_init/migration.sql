-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Administrador', 'Entrevistador', 'Morador', 'Lider Comunitario');

-- CreateEnum
CREATE TYPE "SecurityQuestion" AS ENUM ('Qual é o nome do seu animal de estimação?', 'Qual é a sua comida favorita?', 'Qual é o seu esporte favorito?');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipoUsuario" "UserType" NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tokenResetSenha" TEXT,
    "tokenResetSenhaExpira" TIMESTAMP(3),
    "senhaAlteradaEm" TIMESTAMP(3),
    "ultimaModificacao" TIMESTAMP(3),
    "perguntaSeguranca" "SecurityQuestion" NOT NULL,
    "respostaSeguranca" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "families" (
    "id" UUID NOT NULL,

    CONSTRAINT "families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_memberships" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "familyId" UUID NOT NULL,

    CONSTRAINT "family_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_dados_pessoais" (
    "familyId" UUID NOT NULL,
    "nomeMorador" TEXT NOT NULL,
    "documentoResponsavel" TEXT,
    "opcaoSelecionada" TEXT,
    "endereco" TEXT,
    "numeroCasa" TEXT,
    "cidade" TEXT,
    "regiao" TEXT,
    "telefone" TEXT,
    "donoTelefone" TEXT,

    CONSTRAINT "family_dados_pessoais_pkey" PRIMARY KEY ("familyId")
);

-- CreateTable
CREATE TABLE "family_localizacao" (
    "familyId" UUID NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "family_localizacao_pkey" PRIMARY KEY ("familyId")
);

-- CreateTable
CREATE TABLE "family_socioeconomica" (
    "familyId" UUID NOT NULL,
    "tipoLevantamento" TEXT,
    "numMoradores" DOUBLE PRECISION,
    "idadeResidentes" TEXT,
    "adultosEmpregados" TEXT,
    "rendaMensalTotal" DOUBLE PRECISION,
    "mulherChefeFamilia" TEXT,
    "idosoChefeFamilia" TEXT,
    "numCriancas" DOUBLE PRECISION,
    "autoDeclaracaoFamilia" TEXT,
    "cadastradaBolsaFamilia" TEXT,
    "comorbidadeNaFamilia" TEXT,
    "apresentaDoencaRespiratoria" TEXT,
    "formaAquisicaoImovel" TEXT,
    "anoDeConstrucaoTempoResidindo" TEXT,
    "possuiOutroImovel" TEXT,
    "resideNoImovelLevantado" TEXT,
    "qualValorAluguel" DOUBLE PRECISION,
    "relacaoAluguelRenda" TEXT,
    "imovelTeveAcaoAnterior" TEXT,
    "boaVivenciaVizinhos" TEXT,
    "participaReuniaoAcaoComunidade" TEXT,
    "utilizaBancoComunitario" TEXT,
    "indicacaoDeProfissionais" TEXT,
    "pontoProximoEntrega" TEXT,
    "recebeBoletoAguaEnergia" TEXT,
    "possuiReservatorioAgua" TEXT,
    "estadoReservatorioAgua" TEXT,
    "espacoParaHortasCanteiro" TEXT,
    "possuiBanheiro" TEXT,
    "possuiCozinha" TEXT,
    "dataPrimeiraVisita" TIMESTAMP(3),
    "nomeResponsavelFormulario" TEXT,
    "nomeResponsavelFotografico" TEXT,
    "nomeResponsavelArquitetonico" TEXT,
    "nomeAgenteComunitario" TEXT,
    "outrosProfissionaisEnvolvidos" TEXT,
    "demandaDaFamilia" TEXT,
    "descricaoPendencias" TEXT,

    CONSTRAINT "family_socioeconomica_pkey" PRIMARY KEY ("familyId")
);

-- CreateTable
CREATE TABLE "family_estrutural" (
    "familyId" UUID NOT NULL,
    "problemasInsalubridade" TEXT,
    "necessitaReparosEstrutural" TEXT,
    "resolveProblemaNoProprioTerreno" TEXT,
    "edificacaoEmAreaDeRisco" TEXT,
    "numQuartos" DOUBLE PRECISION,
    "coabitacao" TEXT,
    "insercaoLote" DOUBLE PRECISION,
    "fundacoes" DOUBLE PRECISION,
    "estrutura" DOUBLE PRECISION,
    "paredes" DOUBLE PRECISION,
    "cobertura" DOUBLE PRECISION,
    "esquadrias" DOUBLE PRECISION,
    "hidrossanitario" DOUBLE PRECISION,
    "eletrico" DOUBLE PRECISION,
    "banheiros" DOUBLE PRECISION,
    "cozinhaAreaDeServico" DOUBLE PRECISION,
    "conforto" DOUBLE PRECISION,
    "avaliacaoResidencia" TEXT,
    "acompanhamentoPsicossocial" TEXT,
    "circulacaoInternaSegura" TEXT,
    "avaliacaoInfraestruturaUrbana" DOUBLE PRECISION,
    "avaliacaoAcessibilidadeTransporteLazerSaneamento" TEXT,
    "opiniaoGeralDaCasa" DOUBLE PRECISION,
    "diagnosticoPreliminar" TEXT,
    "situacaoPositiva" TEXT,
    "observacoesGerais" TEXT,

    CONSTRAINT "family_estrutural_pkey" PRIMARY KEY ("familyId")
);

-- CreateTable
CREATE TABLE "family_images" (
    "id" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "caminho" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "family_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_files" (
    "id" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "caminho" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "family_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option_groups" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "option_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option_values" (
    "id" UUID NOT NULL,
    "optionGroupId" UUID NOT NULL,
    "valor" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "option_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE INDEX "family_memberships_userId_idx" ON "family_memberships"("userId");

-- CreateIndex
CREATE INDEX "family_memberships_familyId_idx" ON "family_memberships"("familyId");

-- CreateIndex
CREATE UNIQUE INDEX "family_memberships_userId_familyId_key" ON "family_memberships"("userId", "familyId");

-- CreateIndex
CREATE INDEX "family_images_familyId_idx" ON "family_images"("familyId");

-- CreateIndex
CREATE INDEX "family_files_familyId_idx" ON "family_files"("familyId");

-- CreateIndex
CREATE UNIQUE INDEX "option_groups_nome_key" ON "option_groups"("nome");

-- CreateIndex
CREATE INDEX "option_values_optionGroupId_idx" ON "option_values"("optionGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "option_values_optionGroupId_valor_key" ON "option_values"("optionGroupId", "valor");

-- AddForeignKey
ALTER TABLE "family_memberships" ADD CONSTRAINT "family_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_memberships" ADD CONSTRAINT "family_memberships_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_dados_pessoais" ADD CONSTRAINT "family_dados_pessoais_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_localizacao" ADD CONSTRAINT "family_localizacao_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_socioeconomica" ADD CONSTRAINT "family_socioeconomica_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_estrutural" ADD CONSTRAINT "family_estrutural_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_images" ADD CONSTRAINT "family_images_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_files" ADD CONSTRAINT "family_files_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option_values" ADD CONSTRAINT "option_values_optionGroupId_fkey" FOREIGN KEY ("optionGroupId") REFERENCES "option_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
