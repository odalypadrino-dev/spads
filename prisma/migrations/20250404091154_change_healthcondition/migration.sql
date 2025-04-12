-- AlterTable
ALTER TABLE `healthcondition` ADD COLUMN `endDateTime` DATETIME(3) NULL,
    MODIFY `endDate` VARCHAR(191) NULL;
