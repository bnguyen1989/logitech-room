import { RootState } from "../../../";

export const getAllLangProducts = (state: RootState) => {
  return state.ui.langTextProduct;
};

export const getLangProduct = (keyProduct: string) => (state: RootState) => {
  if (keyProduct === "Rally Bar") {
    debugger;
  }
  console.log("keyProduct", keyProduct);

  // const keyProductShort = keyProduct.split("Logitech ")[1];

  if (state.ui.langTextProduct[keyProduct]) {
    return state.ui.langTextProduct[keyProduct];
  }
  if (state.ui.langTextProduct[keyProduct.toUpperCase()]) {
    return state.ui.langTextProduct[keyProduct.toUpperCase()];
  }
  // if (
  //   keyProductShort &&
  //   state.ui.langTextProduct[keyProductShort.toUpperCase()]
  // ) {
  //   return state.ui.langTextProduct[keyProductShort.toUpperCase()];
  // }

  return undefined;
};

type Blade1Type = {
  ProductName: string;
  ShortDescription: string;
  LongDescription: string;
  Colors: Record<string, string>;
};
export const getLangProductBlade1 =
  (keyProduct: string) => (state: RootState) => {
    const langsProduct = getLangProduct(keyProduct)(state);

    if (langsProduct && langsProduct["Blade_1"]) {
      return langsProduct["Blade_1"];
    }
    return undefined;
  };

export const getLangProductImage =
  (keyProduct: string) => (state: RootState) => {
    const Blade_1: Blade1Type = getLangProductBlade1(keyProduct)(state);

    if (!Blade_1) return undefined;
    if (!Blade_1["Colors"]) return undefined;
    if (Object.keys(Blade_1["Colors"]).length < 1) return undefined;
    const keyImg = Object.keys(Blade_1["Colors"])[0];
    return Blade_1["Colors"][keyImg];
  };
