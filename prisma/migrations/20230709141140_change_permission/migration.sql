/*
  Warnings:

  - You are about to drop the column `name` on the `Permissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[action]` on the table `Permissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subject]` on the table `Permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action` to the `Permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `Permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Permissions_name_key";

-- AlterTable
ALTER TABLE "Permissions" DROP COLUMN "name",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_action_key" ON "Permissions"("action");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_subject_key" ON "Permissions"("subject");
