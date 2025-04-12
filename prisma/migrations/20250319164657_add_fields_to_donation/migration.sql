/*
  Warnings:

  - Added the required column `patientCiLetter` to the `Donation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `donation` ADD COLUMN `patientCiLetter` VARCHAR(1) NOT NULL;
