/*
  Warnings:

  - You are about to drop the column `itemId` on the `item_prices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[item_lightspeed_id,useTypeId]` on the table `item_prices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `item_lightspeed_id` to the `item_prices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "item_prices" DROP CONSTRAINT "item_prices_itemId_fkey";

-- DropIndex
DROP INDEX "item_prices_itemId_useTypeId_key";

-- AlterTable
ALTER TABLE "item_prices" DROP COLUMN "itemId",
ADD COLUMN     "item_lightspeed_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "item_prices_item_lightspeed_id_useTypeId_key" ON "item_prices"("item_lightspeed_id", "useTypeId");

-- AddForeignKey
ALTER TABLE "item_prices" ADD CONSTRAINT "item_prices_item_lightspeed_id_fkey" FOREIGN KEY ("item_lightspeed_id") REFERENCES "items"("lightspeed_id") ON DELETE RESTRICT ON UPDATE CASCADE;
