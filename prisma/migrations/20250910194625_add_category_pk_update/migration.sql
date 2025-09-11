/*
  Warnings:

  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "category" DROP CONSTRAINT "category_pkey",
ADD CONSTRAINT "category_pkey" PRIMARY KEY ("lightspeedId");
