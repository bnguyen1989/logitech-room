import path from "node:path";
import { LanguageFileProcessor } from "../models/LanguageFileProcessor";

export const dataLangFile = (): void => {
  const processor = new LanguageFileProcessor()
    .setOutputFilePath(path.join(__dirname, "./../dataLang/result"))
    .setFolderPage("/page")
    .setFolderProduct("/product")
    .setNumberRowDivider(379);

  if (processor.isExist()) {
    return;
  }

  const filePath = path.join(__dirname, "./../dataLang/", "sheet.tsv");
  processor
    .processFile(filePath)
    .then(() => console.log("File processing completed successfully."))
    .catch((error) => console.error("Error processing file:", error));
};
