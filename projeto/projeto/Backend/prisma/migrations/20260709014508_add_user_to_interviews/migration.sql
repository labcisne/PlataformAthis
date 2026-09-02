-- AlterTable
ALTER TABLE "family_estrutural" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "family_socioeconomica" ADD COLUMN     "userId" UUID;

-- AddForeignKey
ALTER TABLE "family_socioeconomica" ADD CONSTRAINT "family_socioeconomica_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_estrutural" ADD CONSTRAINT "family_estrutural_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
