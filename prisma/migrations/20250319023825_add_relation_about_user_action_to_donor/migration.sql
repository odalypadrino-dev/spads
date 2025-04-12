/*
  Warnings:

  - Added the required column `lastUpdatedById` to the `Donor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registeredById` to the `Donor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `donor` ADD COLUMN `lastUpdatedById` INTEGER NOT NULL,
    ADD COLUMN `registeredById` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Donor` ADD CONSTRAINT `Donor_registeredById_fkey` FOREIGN KEY (`registeredById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donor` ADD CONSTRAINT `Donor_lastUpdatedById_fkey` FOREIGN KEY (`lastUpdatedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
