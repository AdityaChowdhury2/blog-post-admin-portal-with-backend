/*
  Warnings:

  - You are about to drop the column `subtitle` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Blog` DROP COLUMN `subtitle`,
    ADD COLUMN `subTitle` VARCHAR(191) NULL;
