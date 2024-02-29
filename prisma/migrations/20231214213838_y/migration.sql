/*
  Warnings:

  - A unique constraint covering the columns `[api_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "api_token" VARCHAR(80);

-- CreateIndex
CREATE UNIQUE INDEX "User_api_token_key" ON "User"("api_token");
