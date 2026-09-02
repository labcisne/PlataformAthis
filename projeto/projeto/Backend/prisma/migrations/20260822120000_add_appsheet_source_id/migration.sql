-- Persist the stable AppSheet family identifier so XLSX imports are idempotent.
ALTER TABLE "families" ADD COLUMN "appsheet_source_id" TEXT;
CREATE UNIQUE INDEX "families_appsheet_source_id_key" ON "families"("appsheet_source_id");
