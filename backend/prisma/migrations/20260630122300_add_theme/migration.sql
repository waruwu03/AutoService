/*
  Warnings:

  - You are about to drop the column `theme` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `theme` VARCHAR(191) NOT NULL DEFAULT 'light';
