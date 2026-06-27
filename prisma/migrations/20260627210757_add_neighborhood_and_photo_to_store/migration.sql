/*
  Warnings:

  - Added the required column `neighborhood` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stores` ADD COLUMN `neighborhood` VARCHAR(100) NOT NULL,
    ADD COLUMN `photo` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `photo` VARCHAR(255) NULL;
