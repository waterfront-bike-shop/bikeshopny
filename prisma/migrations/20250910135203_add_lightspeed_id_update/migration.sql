/*
  Warnings:

  - The primary key for the `manufacturer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `tags` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "item_tags" DROP CONSTRAINT "item_tags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_category_id_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_manufacturerId_fkey";

-- AlterTable
ALTER TABLE "manufacturer" DROP CONSTRAINT "manufacturer_pkey",
ADD CONSTRAINT "manufacturer_pkey" PRIMARY KEY ("lightspeedId");

-- AlterTable
ALTER TABLE "tags" DROP CONSTRAINT "tags_pkey",
ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("lightspeedId");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("lightspeedId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturer"("lightspeedId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("lightspeedId") ON DELETE CASCADE ON UPDATE CASCADE;
