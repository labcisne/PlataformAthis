-- CreateTable
CREATE TABLE "facilities_questions" (
    "id" UUID NOT NULL,
    "formulario" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "obrigatoria" BOOLEAN NOT NULL DEFAULT false,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "opcoes" TEXT[],
    "allowOther" BOOLEAN NOT NULL DEFAULT false,
    "categoria" TEXT,

    CONSTRAINT "facilities_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities_answers" (
    "id" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "perguntaId" UUID NOT NULL,
    "resposta" TEXT NOT NULL,
    "dataResposta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID,

    CONSTRAINT "facilities_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facilities_questions_codigo_key" ON "facilities_questions"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "facilities_answers_familyId_perguntaId_key" ON "facilities_answers"("familyId", "perguntaId");

-- CreateIndex
CREATE INDEX "facilities_answers_familyId_idx" ON "facilities_answers"("familyId");

-- CreateIndex
CREATE INDEX "facilities_answers_perguntaId_idx" ON "facilities_answers"("perguntaId");

-- AddForeignKey
ALTER TABLE "facilities_answers" ADD CONSTRAINT "facilities_answers_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities_answers" ADD CONSTRAINT "facilities_answers_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "facilities_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facilities_answers" ADD CONSTRAINT "facilities_answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
