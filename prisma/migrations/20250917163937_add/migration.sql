-- CreateEnum
CREATE TYPE "ShopDataType" AS ENUM ('allItems', 'categories', 'tags', 'manufacturers', 'allImages', 'imageDownloadFilelist');

-- CreateTable
CREATE TABLE "shopdata" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ShopDataType" NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "shopdata_pkey" PRIMARY KEY ("id")
);
