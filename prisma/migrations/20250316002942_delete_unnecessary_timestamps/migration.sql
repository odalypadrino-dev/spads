/*
  Warnings:

  - You are about to drop the column `createdAt` on the `bloodresult` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `bloodresult` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ci` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ci` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `healthcondition` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `healthcondition` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `bloodresult` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `ci` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `healthcondition` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;
