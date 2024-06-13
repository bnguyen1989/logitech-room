import { RootState } from "../../..";
import { StepName } from "../../../../utils/baseUtils";
import { getAssetId, getNodes } from "../../configurator/selectors/selectors";
import { CardI } from "../type";
import {
  getLangProductBlade1,
  getLangProductImage,
  getLangSimpleColorProduct,
} from "./selectoreLangProduct";
import {
  getAssetFromCard,
  getLocale,
  getMetadataProductNameAssetFromCard,
  getPriceFromMetadataByKeyPermission,
  getSelectedConfiguratorCards,
  getSelectedDataByKeyPermission,
  getSelectedPrepareCards,
  getSkuFromMetadataByCard,
  getTitleCardByKeyPermission,
} from "./selectors";
import {
  PlatformName,
  isBundleElement,
  isCameraElement,
  isTapElement,
} from "../../../../utils/permissionUtils";
import {
  getLangDescriptionRoomBySize,
  getPrepareCardTitleLangByKeyPermission,
  getPrepareDescriptionLangByKeyPermission,
  getRoomsLangPage,
} from "./selectoteLangPage";
import { localeToCurrency } from "../../../../utils/localeUtils";
import { deepCopy } from "../../../../utils/objUtils";
import { Byod } from "../../../../types/textTypePage";

export const getPropertyColorCardByKeyPermissionForOrder =
  (selectData: any, keyProduct: string) => (state: RootState) => {
    if (selectData?.property?.color) return selectData?.property?.color;
    const simpleColorProduct = getLangSimpleColorProduct(keyProduct)(state);
    if (simpleColorProduct) return simpleColorProduct;

    return "";
  };

export const getOrderData = (userId: string) => (state: RootState) => {
  const cardData = getCardData(state);
  const nameOrder = getNameOrder(state);

  const description = getDescriptionRoom(state);

  const assetId = getAssetId(state);
  const nodes = getNodes(state);
  const configuration = JSON.stringify(
    app.currentConfigurator.getConfiguration()
  );

  const currentLocale = getLocale(state);
  const currencyCode = getCurrencyCodeByLocale(state);
  return {
    customerId: userId,
    originOrgId: userId,
    platform: {
      id: "1",
      platform: "1",
      storeName: "1",
    },
    cart: cardData,
    metadata: {
      name: nameOrder,
      description: description,
      configurator: {
        assetId,
        nodes,
        configuration,
      },
      locale: {
        currency: currencyCode ?? "USD",
        currencyLocale: currentLocale ?? "en-US",
      },
    },
    status: "List",
  };
};

const getSelectValueBySelectData = (data: any, card: CardI) => {
  const select = card.select;
  if (!select) return;
  const value = data?.property.select;
  if (!value) return;
  const selectValue = select.data.find((item) => item.value === value);
  return selectValue?.label;
};

const getNameOrder = (state: RootState) => {
  const selectedPrepareCards = getSelectedPrepareCards(state);
  const platform = selectedPrepareCards.find(
    (card) => card.key === StepName.Platform
  )?.keyPermission;
  const roomSize = selectedPrepareCards.find(
    (card) => card.key === StepName.RoomSize
  )?.keyPermission as keyof Byod;
  if (platform === PlatformName.BYOD && roomSize) {
    const langRoom = getRoomsLangPage(state);
    return langRoom.card.templateRoomNameByPlatform.BYOD[roomSize];
  }
  const name = selectedPrepareCards.reduce<string>((acc, item) => {
    const titleCard = getPrepareCardTitleLangByKeyPermission(
      item.keyPermission
    )(state);
    if (item.key === StepName.RoomSize) {
      acc = acc.replace("{0}", titleCard.replace("Room", "").trim());
    }

    if (item.key === StepName.Platform) {
      acc = acc.replace("{1}", titleCard);
    }

    return acc;
  }, "{0} {1} Room");

  return name;
};

const getDescriptionRoom = (state: RootState) => {
  const selectedPrepareCards = getSelectedPrepareCards(state);
  const nameRoomSize = selectedPrepareCards.find(
    (card) => card.key === StepName.RoomSize
  )?.keyPermission;
  if (!nameRoomSize) return "";
  const description = getLangDescriptionRoomBySize(nameRoomSize)(state);
  return description;
};

const getCardData = (state: RootState) => {
  const selectedCards = getSelectedConfiguratorCards(state);
  return processCards(selectedCards)(state).map(({ card, selectData }) => {
    const copyCard = JSON.parse(JSON.stringify(card)) as CardI;
    const cardAsset = getAssetFromCard(copyCard)(state);
    const price = getPriceFromMetadataByKeyPermission(
      copyCard.key,
      copyCard.keyPermission
    )(state);
    const title = getTitleCardByKeyPermission(
      copyCard.key,
      copyCard.keyPermission
    )(state);
    const productName = getMetadataProductNameAssetFromCard(copyCard)(state);
    const langProduct = getLangProductBlade1(productName)(state);
    const sku = getSkuFromMetadataByCard(copyCard)(state);

    const selectValue = getSelectValueBySelectData(selectData, copyCard);

    const langProductImage = getLangProductImage(
      productName,
      copyCard.keyPermission
    )(state);
    const colorCard = getPropertyColorCardByKeyPermissionForOrder(
      selectData,
      productName
    )(state);

    if (langProductImage) {
      copyCard.image = langProductImage;
    }

    const prepareCardDescription = getPrepareDescriptionLangByKeyPermission(
      copyCard.keyPermission
    )(state);

    return {
      metadata: {
        data: JSON.stringify(copyCard),
        title: title,
        description: prepareCardDescription ?? langProduct?.ShortDescription,
        sku: sku,
        color: colorCard,
        count: selectData?.property?.count ?? 1,
        price: price,
        selectValue: selectValue,
      },
      configurationId: cardAsset?.id ?? "",
      count: 1,
    };
  });
};

const processCards = (cards: CardI[]) => (state: RootState) => {
  const existCardBundle = cards.some((card) =>
    isBundleElement(card.keyPermission)
  );
  return cards.reduce<
    {
      card: CardI;
      selectData: any;
    }[]
  >((acc, card) => {
    const selectData = getSelectedDataByKeyPermission(
      card.key,
      card.keyPermission
    )(state);
    const isCamera = isCameraElement(card.keyPermission);
    if (existCardBundle && isCamera) return acc;
    const isTap = isTapElement(card.keyPermission);
    if (existCardBundle && isTap) {
      const count = selectData?.property?.count;
      if (!count || count < 2) return acc;

      const copySelectData = deepCopy(selectData);
      copySelectData.property.count -= 1;
      return [
        ...acc,
        {
          card,
          selectData: copySelectData,
        },
      ];
    }

    return [
      ...acc,
      {
        card,
        selectData: selectData,
      },
    ];
  }, []);
};

export const getCurrencyCodeByLocale = (state: RootState) => {
  const locale = getLocale(state);
  if (!locale) return;
  return localeToCurrency[locale];
};
