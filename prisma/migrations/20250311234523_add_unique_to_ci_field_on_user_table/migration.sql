/*
  Warnings:

  - A unique constraint covering the columns `[ci]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_ci_key` ON `User`(`ci`);
