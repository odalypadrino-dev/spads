/*
  Warnings:

  - You are about to drop the column `patientFirstname` on the `donation` table. All the data in the column will be lost.
  - You are about to drop the column `patientLastname` on the `donation` table. All the data in the column will be lost.
  - Added the required column `patientFirstName` to the `Donation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientLastName` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `donation` DROP COLUMN `patientFirstname`,
    DROP COLUMN `patientLastname`,
    ADD COLUMN `patientFirstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `patientLastName` VARCHAR(191) NOT NULL;
