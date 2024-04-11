import { Request, Response, Router } from "express";
import { createReadStream } from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import csvParser from "csv-parser";
import dataLang from "./../../prisma/dataLang/products/en-us.json";

// import { createLanguages, deleteLanguage, getLanguages, updateLanguage } from "../handlers/languages";

const router = Router();
//
router.get("/", (req: Request, res: Response) => {});
// router.put('/:languageCode', updateLanguage);
// router.delete('/:languageCode', deleteLanguage);
// router.post('/sets-list', createLanguages);
let lineNumber = 0;
const firstPart: any = []; // Дані для першого файлу (1-161 рядок)
const productJson: any = [];

console.log("test");
// const results: any = [];
const filePath = path.join(
  __dirname,
  "./../../../public/",
  "Translation_Sheet1.tsv"
);

// const outputPath = path.join(__dirname, "./../../../public/", "output.json"); // Шлях для збереження JSON файлу

const readStream = createReadStream(filePath);

function findKeyPath(obj: any, searchText: any, currentPath = "") {
  for (const key in obj) {
    const value = obj[key];
    const newPath = currentPath ? `${currentPath}#${key}` : key;
    if (typeof value === "string") {
      if (value === searchText) {
        return newPath;
      }
    } else if (typeof value === "object" && value !== null) {
      const result: any = findKeyPath(value, searchText, newPath);
      if (result) {
        return result;
      }
    }
  }
  // Возвращаем null, если совпадение не найдено на текущем уровне и во вложенных объектах
  return null;
}

// Використання потоку
readStream
  .pipe(
    csvParser({
      separator: "\t", // Вказівка табуляції як роздільника
    })
  )
  .on("data", (data: any) => {
    // console.log("Новий фрагмент даних отримано:");
    lineNumber++;
    if (lineNumber <= 116) {
      firstPart.push(data);
    } else {
      if (data["en-us"]) {
        const resultPath = findKeyPath(dataLang, data["en-us"]);

        data["key"] = resultPath;
        productJson.push(data);
      } else {
        data["key"] = "";
        productJson.push(data);
      }
    }
  })
  .on("end", async () => {
    writeFile(
      path.join(__dirname, "./../../../public/", "PageJson.json"),
      JSON.stringify(firstPart, null, 2)
    );

    // Збереження другої частини даних
    writeFile(
      path.join(__dirname,   "./../../", "PoductJson.json"),
      JSON.stringify(productJson, null, 2)
    );
  });

// Обробка помилки, якщо файл не знайдено або виникли інші проблеми при читанні
readStream.on("error", (error: any) => {
  console.error("Помилка при читанні файлу:", error);
});

export default router;
