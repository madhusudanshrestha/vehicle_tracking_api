/*
  Warnings:

  - A unique constraint covering the columns `[gpsDeviceId]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vehicleNumber,gpsDeviceId]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gpsDeviceId` to the `VehicleLocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vehiclelocation` ADD COLUMN `gpsDeviceId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Vehicle_gpsDeviceId_key` ON `Vehicle`(`gpsDeviceId`);

-- CreateIndex
CREATE UNIQUE INDEX `Vehicle_vehicleNumber_gpsDeviceId_key` ON `Vehicle`(`vehicleNumber`, `gpsDeviceId`);
