/*
  Warnings:

  - You are about to alter the column `completedDate` on the `donation` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `donation` MODIFY `completedDate` DATETIME(3) NULL;
