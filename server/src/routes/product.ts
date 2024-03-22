import { Router } from "express";
import {
  createProductsLanguage,
  getLanguageProducts,
} from "../handlers/products";

const router = Router();

router.post("/add-products", createProductsLanguage);

router.get("/:languageCode", getLanguageProducts);

export default router;
