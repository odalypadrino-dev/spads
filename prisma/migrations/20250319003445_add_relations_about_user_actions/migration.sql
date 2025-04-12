/*
  Warnings:

  - Added the required column `createdById` to the `BloodTest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `HealthCondition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bloodtest` ADD COLUMN `createdById` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `donation` ADD COLUMN `completedById` INTEGER NULL,
    ADD COLUMN `createdById` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `healthcondition` ADD COLUMN `createdById` INTEGER NOT NULL,
    ADD COLUMN `endedById` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `HealthCondition` ADD CONSTRAINT `HealthCondition_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HealthCondition` ADD CONSTRAINT `HealthCondition_endedById_fkey` FOREIGN KEY (`endedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BloodTest` ADD CONSTRAINT `BloodTest_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_completedById_fkey` FOREIGN KEY (`completedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
