type ProductColor = {
  [colorName: string]: string; // Имя цвета и ссылка на изображение
};
type ImageVideoBlade2 = {
  Video?: string; // Имя цвета и ссылка на изображение
  CoverImage?: string; // Имя цвета и ссылка на изображение
  [key: string]: string;
};

type ProductFeature = {
  HeaderFeature: string;
  sorting: string;
  KeyFeature: string;
  LinkImgFeature: {
    "Image link"?: string;
    Image?: string;
    "Cover image"?: string;
    Video?: string;
    [key: string]: string;
  };
};

export type Card = {
  ProductName: string;
  ShortDescription: string[];
}

export type Blade_1 = {
  ProductName: string;
  ShortDescription: string;
  LongDescription: string;
  Colors: ProductColor;
};
export type Blade_2 = {
  Headline: string;
  Description: string;
  "Image|Video": ImageVideoBlade2;
};
export type Blade_2A = {
  Features: ProductFeature[];
};
export type Blade_3A = {
  Features: ProductFeature[];
};

export type ProductDataType = {
  [bladeName: string]: Card | Blade_1 | Blade_2 | Blade_2A | Blade_3A;
};
export type ProductsObj = Record<string, ProductDataType>;
