/*
  Warnings:

  - Added the required column `label` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add label column with a default value first, then make it required
ALTER TABLE "Location" ADD COLUMN "label" TEXT;

-- Update existing records with a generated label
UPDATE "Location" SET "label" = CONCAT("streetNumber", ' ', "streetName", ', ', "city") WHERE "label" IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE "Location" ALTER COLUMN "label" SET NOT NULL;
