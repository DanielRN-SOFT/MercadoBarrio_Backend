/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `suppliers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `suppliers` ADD COLUMN `address` VARCHAR(150) NOT NULL,
    ADD COLUMN `city` VARCHAR(45) NOT NULL,
    ADD COLUMN `email` VARCHAR(150) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `suppliers_email_key` ON `suppliers`(`email`);
