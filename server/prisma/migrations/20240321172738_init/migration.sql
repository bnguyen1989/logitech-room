-- CreateTable
CREATE TABLE "Language" (
    "languageCode" TEXT NOT NULL,
    "localeCode" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("languageCode")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductDescription" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "languageCode" TEXT NOT NULL,
    "description" JSONB NOT NULL,

    CONSTRAINT "ProductDescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- AddForeignKey
ALTER TABLE "ProductDescription" ADD CONSTRAINT "ProductDescription_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDescription" ADD CONSTRAINT "ProductDescription_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("languageCode") ON DELETE RESTRICT ON UPDATE CASCADE;
