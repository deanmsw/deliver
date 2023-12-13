/*
  Warnings:

  - You are about to drop the column `latitude` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Route` table. All the data in the column will be lost.
  - Added the required column `endLocationId` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startLocationId` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Route" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "endLocationId" INTEGER NOT NULL,
ADD COLUMN     "startLocationId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_startLocationId_fkey" FOREIGN KEY ("startLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_endLocationId_fkey" FOREIGN KEY ("endLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
