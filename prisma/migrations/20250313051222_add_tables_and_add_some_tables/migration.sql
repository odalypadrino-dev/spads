/*
  Warnings:

  - You are about to drop the column `patientId` on the `ci` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `donation` table. All the data in the column will be lost.
  - You are about to drop the column `toPatient` on the `donation` table. All the data in the column will be lost.
  - You are about to drop the `patient` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[donorId]` on the table `Ci` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `donorId` to the `Ci` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ci` table without a default value. This is not possible if the table is not empty.
  - Added the required column `donorId` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientCi` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientFirstname` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientLastname` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ci` DROP FOREIGN KEY `Ci_patientId_fkey`;

-- DropForeignKey
ALTER TABLE `donation` DROP FOREIGN KEY `Donation_patientId_fkey`;

-- DropIndex
DROP INDEX `Ci_patientId_key` ON `ci`;

-- DropIndex
DROP INDEX `Donation_patientId_fkey` ON `donation`;

-- AlterTable
ALTER TABLE `ci` DROP COLUMN `patientId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `donorId` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `donation` DROP COLUMN `patientId`,
    DROP COLUMN `toPatient`,
    ADD COLUMN `completed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `donorId` INTEGER NOT NULL,
    ADD COLUMN `patientCi` VARCHAR(191) NOT NULL,
    ADD COLUMN `patientFirstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `patientLastname` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `logs` ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `patient`;

-- CreateTable
CREATE TABLE `Donor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `names` VARCHAR(191) NOT NULL,
    `surnames` VARCHAR(191) NOT NULL,
    `birthdate` DATE NOT NULL,
    `genre` ENUM('Hombre', 'Mujer') NOT NULL,
    `phone` VARCHAR(11) NOT NULL,
    `dir` VARCHAR(191) NOT NULL,
    `weight` INTEGER NOT NULL,
    `bloodType` VARCHAR(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Donor_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HealthCondition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `donorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BloodTest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` INTEGER NOT NULL,
    `donorId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Ci_donorId_key` ON `Ci`(`donorId`);

-- AddForeignKey
ALTER TABLE `Ci` ADD CONSTRAINT `Ci_donorId_fkey` FOREIGN KEY (`donorId`) REFERENCES `Donor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_donorId_fkey` FOREIGN KEY (`donorId`) REFERENCES `Donor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HealthCondition` ADD CONSTRAINT `HealthCondition_donorId_fkey` FOREIGN KEY (`donorId`) REFERENCES `Donor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BloodTest` ADD CONSTRAINT `BloodTest_donorId_fkey` FOREIGN KEY (`donorId`) REFERENCES `Donor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
