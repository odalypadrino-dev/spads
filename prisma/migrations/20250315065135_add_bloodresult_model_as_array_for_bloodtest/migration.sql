/*
  Warnings:

  - You are about to drop the column `type` on the `bloodtest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `bloodtest` DROP COLUMN `type`;

-- CreateTable
CREATE TABLE `BloodResult` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `bloodTestId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BloodResult` ADD CONSTRAINT `BloodResult_bloodTestId_fkey` FOREIGN KEY (`bloodTestId`) REFERENCES `BloodTest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
