import csvParser from "csv-parser";
import { Request, Response, Router } from "express";
import { createReadStream } from "fs";
import { writeFile } from "fs/promises";
import path from "path";
// import { createLanguages, deleteLanguage, getLanguages, updateLanguage } from "../handlers/languages";

const router = Router();
//
router.get("/", (req: Request, res: Response) => {});
// router.put('/:languageCode', updateLanguage);
// router.delete('/:languageCode', deleteLanguage);
// router.post('/sets-list', createLanguages);
let lineNumber = 0;
const firstPart: any = []; // Дані для першого файлу (1-161 рядок)
const secondPart: any = [];

console.log("test");
// const results: any = [];
const filePath = path.join(
  __dirname,
  "./../../../public/",
  "Translation_Sheet1.tsv"
);

// const outputPath = path.join(__dirname, "./../../../public/", "output.json"); // Шлях для збереження JSON файлу

const readStream = createReadStream(filePath);

// Використання потоку
readStream
  .pipe(
    csvParser({
      separator: "\t", // Вказівка табуляції як роздільника
    })
  )
  .on("data", (data) => {
    // console.log("Новий фрагмент даних отримано:");
    lineNumber++;
    if (lineNumber <= 116) {
      firstPart.push(data);
    } else {
      secondPart.push(data);
    }
  })
  .on("end", async () => {
    writeFile(
      path.join(__dirname, "./../../../public/", "PageJson.json"),
      JSON.stringify(firstPart, null, 2)
    );

    // Збереження другої частини даних
    writeFile(
      path.join(__dirname, "./../../../public/", "PoductJson.json"),
      JSON.stringify(secondPart, null, 2)
    );
  });

// Обробка помилки, якщо файл не знайдено або виникли інші проблеми при читанні
readStream.on("error", (error) => {
  console.error("Помилка при читанні файлу:", error);
});

export default router;
