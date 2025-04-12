/*
  Warnings:

  - You are about to alter the column `endDate` on the `healthcondition` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `healthcondition` MODIFY `endDate` DATETIME(3) NULL;
