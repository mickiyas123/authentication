/*
  Warnings:

  - You are about to drop the `_PermissionsToRoles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RolesToUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PermissionsToRoles" DROP CONSTRAINT "_PermissionsToRoles_A_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionsToRoles" DROP CONSTRAINT "_PermissionsToRoles_B_fkey";

-- DropForeignKey
ALTER TABLE "_RolesToUsers" DROP CONSTRAINT "_RolesToUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_RolesToUsers" DROP CONSTRAINT "_RolesToUsers_B_fkey";

-- DropTable
DROP TABLE "_PermissionsToRoles";

-- DropTable
DROP TABLE "_RolesToUsers";

-- CreateTable
CREATE TABLE "_UserHasRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RoleHasPermissions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserHasRoles_AB_unique" ON "_UserHasRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_UserHasRoles_B_index" ON "_UserHasRoles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoleHasPermissions_AB_unique" ON "_RoleHasPermissions"("A", "B");

-- CreateIndex
CREATE INDEX "_RoleHasPermissions_B_index" ON "_RoleHasPermissions"("B");

-- AddForeignKey
ALTER TABLE "_UserHasRoles" ADD CONSTRAINT "_UserHasRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserHasRoles" ADD CONSTRAINT "_UserHasRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleHasPermissions" ADD CONSTRAINT "_RoleHasPermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleHasPermissions" ADD CONSTRAINT "_RoleHasPermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
