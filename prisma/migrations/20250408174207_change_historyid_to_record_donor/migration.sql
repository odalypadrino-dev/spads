/*
  Warnings:

  - You are about to drop the column `historyId` on the `donor` table. All the data in the column will be lost.
  - Added the required column `record` to the `Donor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE donor
	CHANGE historyId record varchar(191) not null;