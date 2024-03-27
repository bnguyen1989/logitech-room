import { PrismaClient } from "@prisma/client";
import { promises as fsPromises } from "fs";
import { join } from "path";

import type { LanguageData, LocaleCodeOnly } from "../src/type/type";
import type { Product, ProductsObj } from "../src/type/product";

const prisma = new PrismaClient();

const FOLDER_NAME = "datalang";
const FOLDER_PRODUCTS_TEXT = "products";

// Функция для асинхронной загрузки языковых данных из файла JSON
async function loadLanguages(): Promise<LanguageData[]> {
  const languagesNameFile = "languages.json";
  const languagesFilePath = join(__dirname, FOLDER_NAME, languagesNameFile);

  try {
    const data = await fsPromises.readFile(languagesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading languages data:", error);
    process.exit(1); // Выход с ошибкой в случае неудачной загрузки данных
  }
}

// Функция для асинхронной загрузки данных продуктов из файла JSON
async function loadProducts(
  LanguageCode: LocaleCodeOnly
): Promise<Record<string, Product>> {
  const languagesNameFile = `${LanguageCode}.json`;

  const languagesFilePath = join(
    __dirname,
    FOLDER_NAME,
    FOLDER_PRODUCTS_TEXT,
    languagesNameFile
  );

  try {
    const data = await fsPromises.readFile(languagesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading product data:", error);
    process.exit(1);
  }
}

async function upsertLanguage({
  languageCode,
  localeCode,
  currencyCode,
}: LanguageData) {
  try {
    const language = await prisma.language.upsert({
      where: { languageCode },
      update: { localeCode, currencyCode },
      create: { languageCode, localeCode, currencyCode },
    });
    console.log(`Language processed: ${language.languageCode}`);
  } catch (error) {
    console.error(`Error processing language ${languageCode}:`, error);
  }
}

async function seedProductData(
  productData: ProductsObj,
  languageCode: LocaleCodeOnly
) {
  const updatedProductIds: string[] = [];

  for (const productName in productData) {
    const product = await prisma.product.upsert({
      where: { name: productName },
      update: {},
      create: { name: productName },
    });
    updatedProductIds.push(product.name);

    await prisma.productDescription.deleteMany({
      where: { productId: product.id, languageCode: languageCode },
    });

    const descriptions = {
      productId: product.id,
      languageCode: languageCode,
      description: productData[productName],
    };
    await prisma.productDescription.create({ data: descriptions });
  }

  return { processed: updatedProductIds, count: updatedProductIds.length };
}

// Основная функция для запуска процесса импорта данных
async function main() {
  try {
    const languagesData = await loadLanguages();
    for (const lang of languagesData) {
      await upsertLanguage(lang);
    }

    
    const productsData = await loadProducts("en-us");
    const result = await seedProductData(productsData, "en-us");
    console.log("Product processed", result);
  } catch (error) {
    console.error("An error occurred during the seeding process:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
