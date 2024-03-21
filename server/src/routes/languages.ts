import { Router } from "express"; 
import { createLanguages, deleteLanguage, getLanguages, updateLanguage } from "../handlers/languages";

const router = Router();

router.get('/', getLanguages);
router.put('/:languageCode', updateLanguage);
router.delete('/:languageCode', deleteLanguage);
router.post('/sets-list', createLanguages);

export default router;
