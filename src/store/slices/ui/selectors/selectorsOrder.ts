import { RootState } from "../../..";
import { StepName } from "../../../../utils/baseUtils";
import { ConfigData } from "../../../../utils/threekitUtils";
import { getAssetId, getNodes } from "../../configurator/selectors/selectors";
import { CardI } from "../type";
import {
  getDescriptionRoomBySize,
  getTitleFromDataByKeyPermission,
} from "../utils";
import {
  getLangProductBlade1,
  getLangProductImage,
  getLangSimpleColorProduct,
} from "./selectoreLangProduct";
import {
  getAssetFromCard,
  getMetadataProductNameAssetFromCard,
  getPriceFromMetadataByKeyPermission,
  getSelectedConfiguratorCards,
  getSelectedDataByKeyPermission,
  getSelectedPrepareCards,
  getSkuFromMetadataByCard,
  getTitleCardByKeyPermission,
} from "./selectors";

export const getPropertyColorCardByKeyPermissionForOrder =
  (selectData: any, keyProduct: string) => (state: RootState) => {
    if (selectData?.property?.color) return selectData?.property?.color;
    const simpleColorProduct = getLangSimpleColorProduct(keyProduct)(state);
    if (simpleColorProduct) return simpleColorProduct;

    return "";
  };

export const getOrderData = (state: RootState) => {
  const selectedCards = getSelectedConfiguratorCards(state);
  const cardData = selectedCards.map((card) => {
    const copyCard = JSON.parse(JSON.stringify(card)) as CardI;
    const cardAsset = getAssetFromCard(copyCard)(state);
    const selectData = getSelectedDataByKeyPermission(
      copyCard.key,
      copyCard.keyPermission
    )(state);
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

    return {
      metadata: {
        data: JSON.stringify(copyCard),
        title: title,
        description: langProduct?.ShortDescription,
        sku: sku,
        color: colorCard,
        count: selectData?.property?.count ?? 1,
        price: price,
      },
      configurationId: cardAsset?.id ?? "",
      count: 1,
    };
  });
  const nameOrder = getNameOrder(state);

  const description = getDescriptionRoom(state);

  const assetId = getAssetId(state);
  const nodes = getNodes(state);
  const configuration = JSON.stringify(
    app.currentConfigurator.getConfiguration()
  );
  return {
    customerId: ConfigData.userId,
    originOrgId: ConfigData.userId,
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
    },
    status: "List",
  };
};

const getNameOrder = (state: RootState) => {
  const selectedPrepareCards = getSelectedPrepareCards(state);
  const name = selectedPrepareCards
    .filter((item) => !(item.key !== StepName.Platform))
    .map((item) =>
      getTitleFromDataByKeyPermission(item.keyPermission).replace(" Room", "")
    )
    .join(" ");

  return `${name} Room`;
};

const getDescriptionRoom = (state: RootState) => {
  const selectedPrepareCards = getSelectedPrepareCards(state);
  const nameRoomSize = selectedPrepareCards.find(
    (card) => card.key === StepName.RoomSize
  )?.keyPermission;
  if (!nameRoomSize) return "";
  const description = getDescriptionRoomBySize(nameRoomSize);
  return description;
};
