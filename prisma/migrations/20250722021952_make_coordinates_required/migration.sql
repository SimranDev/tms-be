/*
  Warnings:

  - Made the column `deliveryLatitude` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryLongitude` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pickupLatitude` on table `Job` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pickupLongitude` on table `Job` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "deliveryLatitude" SET NOT NULL,
ALTER COLUMN "deliveryLongitude" SET NOT NULL,
ALTER COLUMN "pickupLatitude" SET NOT NULL,
ALTER COLUMN "pickupLongitude" SET NOT NULL;
