import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma: any = new PrismaClient();


export interface LanguageInput {
    languageCode: string;
    localeCode: string;
    currencyCode: string;
}


export async function createLanguages(req: Request, res: Response) {
    const languages: LanguageInput[] = req.body.languages;

    try {
        const addedLanguages = await Promise.all(
            languages.map(async (lang) => {
                const { languageCode, localeCode, currencyCode } = lang;
                const existingLanguage = await prisma.language.findUnique({
                    where: { languageCode },
                });

                if (!existingLanguage) {
                    return await prisma.language.create({
                        data: { languageCode, localeCode, currencyCode },
                    });
                } else {
                    return existingLanguage;
                }
            })
        );

        res.json({ message: 'Languages processed successfully', addedLanguages });
    } catch (error) {
        console.error("Error processing languages:", error);
        res.status(400).json({ message: 'Error processing languages' });
    }
}

export async function getLanguages(req: Request, res: Response) {
    try {
        const languages = await prisma.language.findMany();
        res.json(languages);
    } catch (error) {
        console.error("Error fetching languages:", error);
        res.status(500).json({ message: 'Error fetching languages' });
    }
}
export async function updateLanguage(req: Request, res: Response) {
    const { languageCode } = req.params;
    const { localeCode, currencyCode } = req.body;

    try {
        const updatedLanguage = await prisma.language.update({
            where: { languageCode },
            data: { localeCode, currencyCode },
        });
        res.json(updatedLanguage);
    } catch (error) {
        console.error("Error updating language:", error);
        res.status(500).json({ message: 'Error updating language' });
    }
};
export async function deleteLanguage(req: Request, res: Response) {
    const { languageCode } = req.params;

    try {
        await prisma.language.delete({
            where: { languageCode },
        });
        res.json({ message: `Language ${languageCode} deleted successfully.` });
    } catch (error) {
        console.error("Error deleting language:", error);
        res.status(500).json({ message: 'Error deleting language' });
    }
};