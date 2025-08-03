/*
  Warnings:

  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdById` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDays` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `estimated` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "public"."Service" DROP CONSTRAINT "Service_createdById_fkey";

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'menunggu';

-- AlterTable
ALTER TABLE "public"."Service" DROP COLUMN "createdById",
DROP COLUMN "estimatedDays",
ADD COLUMN     "estimated" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt",
ALTER COLUMN "name" SET NOT NULL;

-- DropEnum
DROP TYPE "public"."OrderStatus";
