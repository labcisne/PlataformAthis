-- AlterTable
ALTER TABLE "facilities_answers" ADD COLUMN     "edificacao_id" UUID,
ALTER COLUMN "familyId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "edificacoes" (
    "id" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "appsheet_source_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "edificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edificacao_images" (
    "id" UUID NOT NULL,
    "appsheet_source_id" TEXT,
    "timestamp" TIMESTAMP(3),
    "edificacao_id" UUID NOT NULL,
    "foto" TEXT,
    "descricao" TEXT,
    "orientacoes" TEXT,
    "storage_key" TEXT,
    "nome_original" TEXT,
    "mime_type" TEXT,
    "tamanho" INTEGER,
    "hash" TEXT,
    "origem" TEXT,
    "url_original" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "edificacao_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "edificacoes_familyId_idx" ON "edificacoes"("familyId");

-- CreateIndex
CREATE INDEX "edificacao_images_edificacao_id_idx" ON "edificacao_images"("edificacao_id");

-- CreateIndex
CREATE INDEX "facilities_answers_edificacao_id_idx" ON "facilities_answers"("edificacao_id");

-- CreateIndex
CREATE UNIQUE INDEX "facilities_answers_edificacao_id_perguntaId_key" ON "facilities_answers"("edificacao_id", "perguntaId");

-- AddForeignKey
ALTER TABLE "facilities_answers" ADD CONSTRAINT "facilities_answers_edificacao_id_fkey" FOREIGN KEY ("edificacao_id") REFERENCES "edificacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edificacoes" ADD CONSTRAINT "edificacoes_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edificacao_images" ADD CONSTRAINT "edificacao_images_edificacao_id_fkey" FOREIGN KEY ("edificacao_id") REFERENCES "edificacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
