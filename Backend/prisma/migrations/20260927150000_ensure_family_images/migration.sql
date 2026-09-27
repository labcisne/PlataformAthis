-- Ensure family-level images are available for AppSheet Fotos imports.
CREATE TABLE IF NOT EXISTS "family_images" (
    "id" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "caminho" TEXT NOT NULL,
    "descricao" TEXT,
    CONSTRAINT "family_images_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "family_images"
    ADD COLUMN IF NOT EXISTS "id" UUID,
    ADD COLUMN IF NOT EXISTS "familyId" UUID,
    ADD COLUMN IF NOT EXISTS "caminho" TEXT,
    ADD COLUMN IF NOT EXISTS "descricao" TEXT;

CREATE INDEX IF NOT EXISTS "family_images_familyId_idx"
    ON "family_images"("familyId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'family_images_familyId_fkey'
          AND conrelid = 'family_images'::regclass
    ) THEN
        ALTER TABLE "family_images"
            ADD CONSTRAINT "family_images_familyId_fkey"
            FOREIGN KEY ("familyId") REFERENCES "families"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
