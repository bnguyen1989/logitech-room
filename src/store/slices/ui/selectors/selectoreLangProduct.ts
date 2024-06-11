import { RootState } from "../../../";
import {
  Blade_1,
  Blade_2,
  Blade_2A,
  Blade_3A,
  Card,
  ProductDataType,
} from "../../../../types/textTypeProduct";
import { getStepNameByKeyPermission } from "./selectors";
import { getPropertyColorCardByKeyPermission } from "./selectorsColorsCard";

export const getAllLangProducts = (state: RootState) => {
  return state.ui.langText.products;
};

export const getLangProduct =
  (keyProduct: string | undefined) =>
  (state: RootState): ProductDataType | undefined => {
    if (!keyProduct) return undefined;
    const allLangProducts = getAllLangProducts(state);
    if (allLangProducts[keyProduct]) {
      return allLangProducts[keyProduct];
    }
    if (allLangProducts[keyProduct.toUpperCase()]) {
      return allLangProducts[keyProduct.toUpperCase()];
    }

    return undefined;
  };

export const getLangProductCard =
  (keyProduct: string | undefined) =>
  (state: RootState): Card | undefined => {
    if (!keyProduct) return undefined;
    const langsProduct = getLangProduct(keyProduct)(state);

    if (langsProduct && langsProduct["Card"]) {
      return langsProduct["Card"] as Card;
    }
    return undefined;
  };

export const getLangProductBlade1 =
  (keyProduct: string | undefined) =>
  (state: RootState): Blade_1 | undefined => {
    if (!keyProduct) return undefined;
    const langsProduct = getLangProduct(keyProduct)(state);

    if (langsProduct && langsProduct["Blade_1"]) {
      return langsProduct["Blade_1"] as Blade_1;
    }
    return undefined;
  };

export const getLangProductBlade2 =
  (keyProduct: string | undefined) =>
  (state: RootState): Blade_2 | undefined => {
    if (!keyProduct) return undefined;
    const langsProduct = getLangProduct(keyProduct)(state);

    if (langsProduct && langsProduct["Blade_2"]) {
      return langsProduct["Blade_2"] as Blade_2;
    }
    return undefined;
  };
export const getLangProductBlade2A =
  (keyProduct: string | undefined) =>
  (state: RootState): Blade_2A | undefined => {
    if (!keyProduct) return undefined;
    const langsProduct = getLangProduct(keyProduct)(state);

    if (langsProduct && langsProduct["Blade_2A"]) {
      return langsProduct["Blade_2A"] as Blade_2A;
    }
    return undefined;
  };
export const getLangProductBlade3A =
  (keyProduct: string | undefined) =>
  (state: RootState): Blade_3A | undefined => {
    if (!keyProduct) return undefined;
    const langsProduct = getLangProduct(keyProduct)(state);

    if (langsProduct && langsProduct["Blade_3A"]) {
      return langsProduct["Blade_3A"] as Blade_3A;
    }
    return undefined;
  };

export const getLangProductImage =
  (keyProduct: string | undefined, keyItemPermission: string | undefined) =>
  (state: RootState) => {
    if (!keyProduct) return undefined;
    if (!keyItemPermission) return undefined;
    const Blade_1 = getLangProductBlade1(keyProduct)(state);
    if (!Blade_1) return undefined;

    const stepName = getStepNameByKeyPermission(keyItemPermission)(state);
    const activeColor = getPropertyColorCardByKeyPermission(
      stepName,
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



    const keyImg = Object.keys(Blade_1["Colors"])[0];
    return Blade_1["Colors"][keyImg];
  };

export const getLangSimpleColorProduct =
  (keyProduct: string | undefined) => (state: RootState) => {
    if (!keyProduct) return undefined;

    const Blade_1 = getLangProductBlade1(keyProduct)(state);
    if (!Blade_1) return undefined;

    if (!Blade_1["Colors"]) return undefined;

    if (Object.keys(Blade_1["Colors"]).length === 1)
      return Object.keys(Blade_1["Colors"])[0];

    return "";
  };

export const getLangForModalProduct =
  (keyProduct: string | undefined) => (state: RootState) => {
    if (!keyProduct) return undefined;
    let objData = {};

    const langsProductBlade1 = getLangProductBlade1(keyProduct)(state);

    if (langsProductBlade1) {
      objData = {
        ...langsProductBlade1,
      };
    }

    const langsProductBlade2 = getLangProductBlade2(keyProduct)(state);

    if (langsProductBlade2) {
      objData = {
        ...objData,
        ...langsProductBlade2,
      };
    }
    const langsProductBlade2A = getLangProductBlade2A(keyProduct)(state);

    if (langsProductBlade2A) {
      objData = {
        ...objData,
        fetures2A: { ...langsProductBlade2A["Features"] },
      };
    }
    const langsProductBlade3A = getLangProductBlade3A(keyProduct)(state);

    if (langsProductBlade3A) {
      objData = {
        ...objData,
        fetures3A: { ...langsProductBlade3A["Features"] },
      };
    }

    return objData;
  };
