import { Request, Response } from "express";
import { Language, PrismaClient, Product, ProductDescription } from '@prisma/client'

const prisma: any = new PrismaClient();


interface ProductDescriptionInput {
    [key: string]: any; // Детальное описание продукта, где ключ - это название части (blade), а значение - детали описания
}

interface ProductInput {
    objectProduct: {
        [productName: string]: ProductDescriptionInput;
    };
    languageCode: string;
}



export async function createProductsLanguage(req: Request, res: Response) {
    const { objectProduct, languageCode } = req.body as ProductInput;

    try {
        const addedDescriptions = await Promise.all(
            Object.entries(objectProduct).map(async ([productName, description]) => {
                // Создаем или находим существующий продукт
                const product = await prisma.product.upsert({
                    where: { name: productName },
                    update: {},
                    create: { name: productName },
                });

                // Поиск существующего описания для данного продукта и языка
                let productDescription = await prisma.productDescription.findFirst({
                    where: {
                        productId: product.id,
                        languageCode: languageCode,
                    },
                });

                // Обновляем существующее описание или создаем новое
                if (productDescription) {
                    productDescription = await prisma.productDescription.update({
                        where: { id: productDescription.id },
                        data: { description: description },
                    });
                } else {
                    productDescription = await prisma.productDescription.create({
                        data: {
                            productId: product.id,
                            languageCode: languageCode,
                            description: description,
                        },
                    });
                }

                return {
                    productName: productName,
                    description: productDescription,
                };
            })
        );

        res.json({ message: 'Products and descriptions processed successfully', addedDescriptions });
    } catch (error) {
        console.error("Error processing products and descriptions:", error);
        res.status(500).json({ message: 'Error processing products and descriptions' });
    }
}

export async function getLanguageProducts(req: Request, res: Response) {
    const { languageCode } = req.params;

    try {
        const products = await prisma.product.findMany({
            include: {
                descriptions: {
                    where: {
                        languageCode: languageCode,
                    },
                    select: {
                        description: true, // Выбираем только описание
                    }
                },
            },
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this language' });
        }

        // Структура для хранения ответа
        interface ResponseStructure {
            languageCode: string;
            products: { [key: string]: any };
            languageInfo?: Language;
        }

        const response: ResponseStructure = {
            languageCode: languageCode,
            products: {},
        };

        products.forEach((product: Product & { descriptions: ProductDescription[] }) => {
            const productData = { nameProduct: product.name };
            product.descriptions.forEach((desc) => {
                Object.assign(productData, desc.description);
            });
            response.products[product.name] = productData;
        });

        const languageInfo = await prisma.language.findUnique({
            where: { languageCode },
        });

        if (languageInfo) response.languageInfo = languageInfo;

        res.json(response);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products' });
    }
}