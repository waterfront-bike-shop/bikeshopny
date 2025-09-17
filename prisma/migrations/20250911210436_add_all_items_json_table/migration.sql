-- CreateTable
CREATE TABLE "allitems" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "all_items" JSONB NOT NULL,

    CONSTRAINT "allitems_pkey" PRIMARY KEY ("id")
);
