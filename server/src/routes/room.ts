import { Router } from "express";
import { generateCSVByData } from "../handlers/room";

const router = Router();

router.post("/generate-csv", generateCSVByData);

export default router;
