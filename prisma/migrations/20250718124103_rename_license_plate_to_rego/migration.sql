/*
  Warnings:

  - You are about to drop the column `licensePlate` on the `Vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rego]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rego` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Vehicle_licensePlate_key";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "licensePlate",
ADD COLUMN     "rego" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_rego_key" ON "Vehicle"("rego");
