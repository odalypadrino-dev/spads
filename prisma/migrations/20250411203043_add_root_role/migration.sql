-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('USER', 'ADMIN', 'ROOT') NOT NULL DEFAULT 'USER';
