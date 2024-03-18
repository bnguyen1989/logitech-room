import { RootState } from "../../..";
import { StepName } from "../../../../models/permission/type";
import { ConfigData } from "../../../../utils/threekitUtils";
import {
  getDescriptionRoomBySize,
  getTitleFromDataByKeyPermission,
} from "../utils";
import {
  getAssetFromCard,
  getPriceFromMetadataByKeyPermission,
  getSelectedConfiguratorCards,
  getSelectedDataByKeyPermission,
  getSelectedPrepareCards,
} from "./selectors";

export const getOrderData = (state: RootState) => {
  const selectedCards = getSelectedConfiguratorCards(state);
  const cardData = selectedCards.map((card) => {
    const cardAsset = getAssetFromCard(card)(state);
    const selectData = getSelectedDataByKeyPermission(card.key, card.keyPermission)(state);
    const price = getPriceFromMetadataByKeyPermission(card.key, card.keyPermission)(state);
    const title = getTitleFromDataByKeyPermission(card.keyPermission);

    return {
      metadata: {
        data: JSON.stringify(card),
        title: title,
        color: selectData?.property?.color ?? "Graphite",
        count: selectData?.property?.count ?? 1,
        price: price
      },
      configurationId: cardAsset?.id ?? "",
      count: 1,
    };
  });
  const nameOrder = getNameOrder(state);

  const description = getDescriptionRoom(state);
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
      assetId: app.currentConfigurator.assetId,
      configuration: JSON.stringify(app.currentConfigurator.getConfiguration()),
      description: description,
      name: nameOrder,
    },
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
