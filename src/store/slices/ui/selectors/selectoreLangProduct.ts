import { RootState } from "../../../";
import { getActiveStep } from "./selectors";
import { getPropertyColorCardByKeyPermission } from "./selectorsColorsCard";

export const getAllLangProducts = (state: RootState) => {
  return state.ui.langTextProduct;
};

export const getLangProduct = (keyProduct: string) => (state: RootState) => {
  if (state.ui.langTextProduct[keyProduct]) {
    return state.ui.langTextProduct[keyProduct];
  }
  if (state.ui.langTextProduct[keyProduct.toUpperCase()]) {
    return state.ui.langTextProduct[keyProduct.toUpperCase()];
  }

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
  (keyProduct: string, keyItemPermission: string) => (state: RootState) => {
    const Blade_1: Blade1Type = getLangProductBlade1(keyProduct)(state);

    const activeStep = getActiveStep(state);
    const activeColor = getPropertyColorCardByKeyPermission(
      activeStep,
      keyItemPermission
    )(state);

    if (!Blade_1) return undefined;
    if (!Blade_1["Colors"]) return undefined;
    if (Object.keys(Blade_1["Colors"]).length < 1) return undefined;

    if (activeColor) {
      if (Blade_1["Colors"][activeColor]) return Blade_1["Colors"][activeColor];
      console.log("activeColorData", {
        keyItemPermission,
        activeColor,
        Blade_1Data: Blade_1["Colors"],
        dataColor: Blade_1["Colors"][activeColor],
      });
    }

    // debugger

    const keyImg = Object.keys(Blade_1["Colors"])[0];
    return Blade_1["Colors"][keyImg];
  };
