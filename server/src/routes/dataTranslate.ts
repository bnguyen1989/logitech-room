import { Request, Response, Router } from "express";
import { createReadStream } from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import csvParser from "csv-parser";
import dataLang from "./../../prisma/dataLang/products/en-us.json";
// import { log } from "console";

// class LanguageFileProcessor {
//   private outputFilePath = path.join(__dirname, "./../../../dataLang/");
//   private firstPart: any[] = [];
//   private productJson: any[] = [];
//   private lineNumber: number = 0;

//   private findKeyPath(
//     obj: any,
//     searchText: any,
//     currentPath = ""
//   ): string | null {
//     for (const key in obj) {
//       const value = obj[key];
//       const newPath = currentPath ? `${currentPath}#${key}` : key;

//       if (typeof value === "string") {
//         if (value === searchText) {
//           return newPath;
//         }
//       } else if (typeof value === "object" && value !== null) {
//         const result: any = this.findKeyPath(value, searchText, newPath);
//         if (result) {
//           return result;
//         }
//       }
//     }
//     // Возвращаем null, если совпадение не найдено на текущем уровне и во вложенных объектах
//     return null;
//   }

//   private createLanguageFiles(translations: any): any {
//     const languageFiles: any = {};

//     translations.forEach((item: any) => {
//       Object.keys(item).forEach((lang: any) => {
//         if (lang !== "key" && item.key) {
//           const keys = item.key.split("#");
//           const current: any = (languageFiles[lang] = languageFiles[lang] || {});

//           keys.forEach((key: any, index: any) => {
//             this.assignValueToKey(current, key, item, lang, keys, index);
//           });
//         }
//       });
//     });

//     return languageFiles;
//   }

//   private assignValueToKey(
//     current: any,
//     key: string,
//     item: any,
//     lang: string,
//     keys: string[],
//     index: number
//   ): void {
//     if (index === keys.length - 1) {
//       if (Array.isArray(current)) {
//         current[parseInt(key, 10)] = item[lang];
//       } else {
//         current[key] = item[lang];
//       }
//     } else if (/^\d+$/.test(key) && Array.isArray(current)) {
//       current = current[parseInt(key, 10)] = current[parseInt(key, 10)] || {};
//     } else {
//       current = current[key] =
//         current[key] ||
//         (index < keys.length - 2 && /^\d+$/.test(keys[index + 1]) ? [] : {});
//     }
//   }

//   public async processFile(filePath: string): Promise<void> {
//     const readStream = createReadStream(filePath);
//     readStream
//       .pipe(csvParser({ separator: "\t" }))
//       .on("data", (data: any) => {
//         this.lineNumber++;
//         if (this.lineNumber <= 116) {
//           this.firstPart.push(data);
//         } else {
//           this.handleData(data);
//         }
//       })
//       .on("end", async () => {
//         await this.saveFiles();
//       })
//       .on("error", (error: any) => {
//         console.error("Error reading file:", error);
//       });
//   }

//   private async handleData(data: any): Promise<void> {
//     if (data["en-us"]) {
//       const resultPath = this.findKeyPath(dataLang, data["en-us"]);

//       data["key"] = resultPath;
//     } else {
//       data["key"] = "";
//     }
//     debugger;
//     this.productJson.push(data);
//   }

//   private async saveFiles(): Promise<void> {
//     console.log("path ,", path.join(this.outputFilePath, "PageJson.json"));

//     await writeFile(
//       path.join(this.outputFilePath, "PageJson.json"),
//       JSON.stringify(this.firstPart, null, 2)
//     );
//     await writeFile(
//       path.join(this.outputFilePath, "ProductJson.json"),
//       JSON.stringify(this.productJson, null, 2)
//     );
//     debugger;
//     const languageJSON = this.createLanguageFiles(this.productJson);

//     for (const langCode in languageJSON) {
//       const content = JSON.stringify(
//         { [langCode]: languageJSON[langCode] },
//         null,
//         4
//       );
//       await writeFile(
//         path.join(this.outputFilePath, `${langCode}.json`),
//         content
//       );
//     }
//   }
// }

class LanguageFileProcessor {
  private outputFilePath = path.join(__dirname, "./../../../dataLang/");
  private pageJson: any[] = [];
  private productJson: any[] = [];
  private lineNumber: number = 0;

  private findKeyPath(obj: any, searchText: any, currentPath = "") {
    for (const key in obj) {
      const value = obj[key];
      const newPath = currentPath ? `${currentPath}#${key}` : key;
      if (typeof value === "string") {
        if (value === searchText) {
          return newPath;
        }
      } else if (typeof value === "object" && value !== null) {
        const result: any = this.findKeyPath(value, searchText, newPath);
        if (result) {
          return result;
        }
      }
    }
    // Возвращаем null, если совпадение не найдено на текущем уровне и во вложенных объектах
    return null;
  }
  private createLanguageFiles(translations: any) {
    const languageFiles: any = {};

    translations.forEach((item: any) => {
      Object.keys(item).forEach((lang: any) => {
        if (lang !== "key" && item.key) {
          const keys = item.key.split("#");
          let current = (languageFiles[lang] = languageFiles[lang] || {});

          keys.forEach((key: any, index: any) => {
            if (index === keys.length - 1) {
              // Handle the assignment of values
              if (Array.isArray(current)) {
                const keyIndex = parseInt(key, 10);
                current[keyIndex] = item[lang];
              } else {
                current[key] = item[lang];
              }
            } else if (/^\d+$/.test(key) && Array.isArray(current)) {
              // Handle array indices
              const keyIndex = parseInt(key, 10);
              current[keyIndex] = current[keyIndex] || {};
              current = current[keyIndex];
            } else {
              // Handle object keys
              const nextKeyIsIndex =
                index < keys.length - 2 && /^\d+$/.test(keys[index + 1]);
              if (nextKeyIsIndex) {
                current[key] = current[key] || [];
                current = current[key];
              } else {
                current[key] = current[key] || {};
                current = current[key];
              }
            }
          });
        }
      });
    });

    return languageFiles;
  }

  public async processFile(filePath: string): Promise<void> {
    const readStream = createReadStream(filePath);
    readStream
      .pipe(csvParser({ separator: "\t" }))
      .on("data", (data: any) => {
        this.lineNumber++;
        if (this.lineNumber <= 116) {
          data["key"] = "";
          this.pageJson.push(data);
        } else {
          if (data["en-us"]) {
            const resultPath = this.findKeyPath(dataLang, data["en-us"]);

            data["key"] = resultPath;
            this.productJson.push(data);
          } else {
            data["key"] = "";
            this.productJson.push(data);
          }
        }
      })
      .on("end", async () => {
        await this.saveFiles();
      })
      .on("error", (error: any) => {
        console.error("Error reading file:", error);
      });
  }

  private async saveFiles(): Promise<void> {
    // console.log("path ,", path.join(this.outputFilePath, "PageJson.json"));
    await writeFile(
      path.join(this.outputFilePath, "PageJson.json"),
      JSON.stringify(this.pageJson, null, 2)
    );
    
    // await writeFile(
    //   path.join(this.outputFilePath, "ProductJson.json"),
    //   JSON.stringify(this.productJson, null, 2)
    // );
    const languageJSON = this.createLanguageFiles(this.productJson);
    await writeFile(
      path.join(this.outputFilePath, "ProductJson.json"),
      JSON.stringify(languageJSON, null, 2)
    );
    console.log('path',path.join(this.outputFilePath, "ProductJson.json"));
    for (const langCode in languageJSON) {
      const content = JSON.stringify(
        { [langCode]: languageJSON[langCode] },
        null,
        4
      );
      await writeFile(
        path.join(this.outputFilePath, `${langCode}.json`),
        content
      );
    }
  }
}

const filePath = path.join(
  __dirname,
  "./../../../public/",
  "Translation_Sheet1.tsv"
);
const processor = new LanguageFileProcessor();

processor
  .processFile(filePath)
  .then(() => console.log("File processing completed successfully."))
  .catch((error) => console.error("Error processing file:", error));

// import { createLanguages, deleteLanguage, getLanguages, updateLanguage } from "../handlers/languages";

const router = Router();
//
router.get("/", (req: Request, res: Response) => {});

export default router;
