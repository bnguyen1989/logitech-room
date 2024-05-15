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
    const readStream = createReadStream(filePath);

    readStream
      .pipe(csvParser({ separator: "\t", quote: "" }))
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
            const resultPaths = this.findKeyPaths(
              this.templateProduct,
              data["en-us"]
            );

            resultPaths.forEach((resultPath) => {
              data["key"] = resultPath;
              this.productJson.push({ ...data });
            });
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

  private findKeyPaths(obj: any, searchText: any, currentPath = "") {
    const newSearchText = searchText.trim().toUpperCase();
    let foundPaths: string[] = [];
    for (const key in obj) {
      const value = obj[key];
      const newPath = currentPath ? `${currentPath}#${key}` : key;
      if (typeof value === "string") {
        const newValue = value.trim().toUpperCase();
        if (newValue === newSearchText) {
          foundPaths.push(newPath);
        }
      } else if (typeof value === "object" && value !== null) {
        const results: string[] = this.findKeyPaths(
          value,
          newSearchText,
          newPath
        );
        if (results.length > 0) {
          foundPaths = foundPaths.concat(results);
        }
      }
    }

    return foundPaths;
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
    await this.saveLanguageFiles(
      this.productJson,
      this.folderProduct,
      this.templateProduct
    );
  }

  private async saveLanguageFiles(
    data: any[],
    nameFolder: string,
    template?: object
  ): Promise<void> {
    const dir = path.join(this.outputFilePath, nameFolder);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const languageJSON = this.createLanguageFiles(data);
    for (const langCode in languageJSON) {
      let dataLang = languageJSON[langCode];
      if (template) {
        dataLang = this.updateJson(
          nameFolder === "page" ? this.templatePage : this.templateProduct,
          dataLang
        );
      }

      const content = JSON.stringify(dataLang, null, 4);
      await writeFile(path.join(dir, `${langCode}.json`), content);
    }
  }

  private updateJson(template: any, update: any) {
    const updatedJson = JSON.parse(JSON.stringify(template));
    this.recursiveUpdate(updatedJson, update);
    return updatedJson;
  }

  private recursiveUpdate(target: any, source: any) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          if (
            typeof source[key] === "object" &&
            !Array.isArray(source[key]) &&
            typeof target[key] === "object"
          ) {
            this.recursiveUpdate(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
      }
    }
  }
}
