/*
  Warnings:

  - You are about to drop the column `condition` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `listed` on the `Route` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Route" DROP COLUMN "condition",
DROP COLUMN "images",
DROP COLUMN "listed";
