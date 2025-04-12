/*
  Warnings:

  - You are about to alter the column `number` on the `ci` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(9)`.

*/
-- AlterTable
ALTER TABLE `ci` MODIFY `number` VARCHAR(9) NOT NULL;
