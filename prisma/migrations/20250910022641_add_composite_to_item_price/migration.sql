/*
  Warnings:

  - You are about to drop the column `item_id` on the `item_prices` table. All the data in the column will be lost.
  - You are about to drop the column `use_type` on the `item_prices` table. All the data in the column will be lost.
  - You are about to drop the column `use_type_id` on the `item_prices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[itemId,useTypeId]` on the table `item_prices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `itemId` to the `item_prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `item_prices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `useTypeId` to the `item_prices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "item_prices" DROP CONSTRAINT "item_prices_item_id_fkey";

-- AlterTable
ALTER TABLE "item_prices" DROP COLUMN "item_id",
DROP COLUMN "use_type",
DROP COLUMN "use_type_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "itemId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "useType" TEXT,
ADD COLUMN     "useTypeId" INTEGER NOT NULL,
ALTER COLUMN "amount" DROP NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);

-- CreateIndex
CREATE UNIQUE INDEX "item_prices_itemId_useTypeId_key" ON "item_prices"("itemId", "useTypeId");

-- AddForeignKey
ALTER TABLE "item_prices" ADD CONSTRAINT "item_prices_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
