import { createReadStream, existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import csvParser from "csv-parser";
import dataTemplatePage from "../dataLang/pageTemplate.json";
import dataTemplateProduct from "../dataLang/productTemplate.json";

export class LanguageFileProcessor {
  private outputFilePath = path.join(__dirname, "./../dataLang/");
  private folderPage = "/page";
  private folderProduct = "/product";
  private templatePage = dataTemplatePage;
  private templateProduct = dataTemplateProduct;
  private pageJson: any[] = [];
  private productJson: any[] = [];
  private lineNumber: number = 0;

  public setOutputFilePath(outputFilePath: string): LanguageFileProcessor {
    this.outputFilePath = outputFilePath;
    return this;
  }

  public setFolderPage(folderPage: string): LanguageFileProcessor {
    this.folderPage = folderPage;
    return this;
  }

  public setFolderProduct(folderProduct: string): LanguageFileProcessor {
    this.folderProduct = folderProduct;
    return this;
  }

  public async processFile(filePath: string): Promise<void> {
    console.log("data");

    const readStream = createReadStream(filePath);
    readStream.on("data", (data: any) => {
      console.log("data", data);
    });
    readStream
      .pipe(csvParser({ separator: "\t" }))
      .on("data", (data: any) => {
        this.lineNumber++;
        if (this.lineNumber <= 116) {
          const path = this.findKeyPathPage(this.templatePage, data["en-us"]);
          if (path) {
            data["key"] = path;
          } else {
            data["key"] = "";
          }
          this.pageJson.push(data);
        } else {
          if (data["en-us"]) {
            const resultPath = this.findKeyPath(
              this.templateProduct,
              data["en-us"]
            );

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

  public isExist(): boolean {
    return existsSync(this.outputFilePath);
  }

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

    return null;
  }

  private findKeyPathPage(arr: any[], searchText: any, keyLang = "en-us") {
    for (const item of arr) {
      const value = item[keyLang];
      if (value === searchText) {
        return item.key;
      }
    }
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

  private async saveFiles(): Promise<void> {
    if (!this.isExist()) {
      mkdirSync(this.outputFilePath, { recursive: true });
    }
    await this.saveLanguageFiles(this.pageJson, this.folderPage);
    await this.saveLanguageFiles(this.productJson, this.folderProduct);
  }

  private async saveLanguageFiles(
    data: any[],
    nameFolder: string
  ): Promise<void> {
    const dir = path.join(this.outputFilePath, nameFolder);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const languageJSON = this.createLanguageFiles(data);
    for (const langCode in languageJSON) {
      const content = JSON.stringify(
        { [langCode]: languageJSON[langCode] },
        null,
        4
      );
      await writeFile(path.join(dir, `${langCode}.json`), content);
    }
  }
}
