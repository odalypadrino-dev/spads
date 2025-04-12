/*
  Warnings:

  - Made the column `ciString` on table `donor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `historyId` on table `donor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `donor` MODIFY `ciString` VARCHAR(191) NOT NULL,
    MODIFY `historyId` VARCHAR(191) NOT NULL;
