import { RootState } from "../../../";

export const getAllLangProducts = (state: RootState) => {
  return state.ui.langTextProduct;
};

export const getLangProduct = (keyProduct: string) => (state: RootState) => {
  const keyProductShort = keyProduct.split("Logitech ")[1];

  if (state.ui.langTextProduct[keyProduct]) {
    return state.ui.langTextProduct[keyProduct];
  }
  if (state.ui.langTextProduct[keyProduct.toUpperCase()]) {
    return state.ui.langTextProduct[keyProduct.toUpperCase()];
  }
  if (
    keyProductShort &&
    state.ui.langTextProduct[keyProductShort.toUpperCase()]
  ) {
    return state.ui.langTextProduct[keyProductShort.toUpperCase()];
  }

  return undefined;
};
export const getLangProductBlade1 =
  (keyProduct: string) => (state: RootState) => {
    const langsProduct = getLangProduct(keyProduct)(state);

    if (langsProduct && langsProduct["Blade_1"]) {
      return langsProduct["Blade_1"];
    }
    return undefined;
  };
