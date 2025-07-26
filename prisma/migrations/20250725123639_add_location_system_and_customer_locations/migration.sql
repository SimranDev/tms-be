/*
  Warnings:

  - You are about to drop the column `address` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryAddress` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryLatitude` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryLongitude` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `pickupAddress` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `pickupLatitude` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `pickupLongitude` on the `Job` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryLocationId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupLocationId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "address",
ADD COLUMN     "addressId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "deliveryAddress",
DROP COLUMN "deliveryLatitude",
DROP COLUMN "deliveryLongitude",
DROP COLUMN "notes",
DROP COLUMN "pickupAddress",
DROP COLUMN "pickupLatitude",
DROP COLUMN "pickupLongitude",
ADD COLUMN     "customerReference" TEXT,
ADD COLUMN     "deliveryLocationId" TEXT NOT NULL,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "pickupLocationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "herePlaceId" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "streetName" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerLocation" (
    "customerId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerLocation_pkey" PRIMARY KEY ("customerId","locationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_herePlaceId_key" ON "Location"("herePlaceId");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerLocation" ADD CONSTRAINT "CustomerLocation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerLocation" ADD CONSTRAINT "CustomerLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_pickupLocationId_fkey" FOREIGN KEY ("pickupLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_deliveryLocationId_fkey" FOREIGN KEY ("deliveryLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
