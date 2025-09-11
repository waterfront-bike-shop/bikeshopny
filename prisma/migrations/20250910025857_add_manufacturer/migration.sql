-- AlterTable
ALTER TABLE "items" ADD COLUMN     "isAvailable" BOOLEAN,
ADD COLUMN     "manufacturerId" INTEGER,
ADD COLUMN     "quantity" INTEGER;

-- CreateTable
CREATE TABLE "manufacturer" (
    "id" SERIAL NOT NULL,
    "lightspeedId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "manufacturer_lightspeedId_key" ON "manufacturer"("lightspeedId");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
