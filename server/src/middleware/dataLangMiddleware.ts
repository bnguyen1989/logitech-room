import { Request, Response, NextFunction } from "express";
import path from "node:path";
import { LanguageFileProcessor } from "../models/LanguageFileProcessor";

export function dataLangFile(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const processor = new LanguageFileProcessor()
    .setOutputFilePath(path.join(__dirname, "./../../dataLang/result"))
    .setFolderPage("/page")
    .setFolderProduct("/product");
  if (processor.isExist()) {
    return next();
  }

  const filePath = path.join(__dirname, "./../../dataLang/", "sheet.tsv");
  processor
    .processFile(filePath)
    .then(() => console.log("File processing completed successfully."))
    .catch((error) => console.error("Error processing file:", error))
    .finally(() => {
      next();
    });
}
