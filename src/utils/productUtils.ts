import { CameraName, SoftwareServicesName } from "./permissionUtils";

export const getSKUProductByExtendedWarranty = (
  productName: string,
  year: string
) => {
  const number = year?.split(" ");
  if (!number && number[0]) return null;
  const sku = dataExtendedWarranty[number[0]][productName];
  if (!sku) return null;
  return sku;
};

const dataExtendedWarranty: Record<string, Record<string, string>> = {
  "1": {
    "Logitech Rally Bar Huddle": "994-000248",
    "Logitech Rally Bar Mini": "994-000138",
    "Logitech Rally Bar": "994-000137",
    "Logitech Rally Camera": "994-000107",
    "Logitech Rally Plus": "994-000101",
    "Logitech Sight": "994-000240",
    "Logitech Scribe": "994-000147",
    "Logitech Tap": "994-000150",
    "Logitech Tap IP": "994-000150",
    "Logitech Tap Scheduler": "994-000151",
    "Logitech Swytch": "994-000125",
    "Logitech RoomMate": "994-000139",
  },
  "3": {
    "Logitech Rally Bar Huddle": "994-000249",
    "Logitech Rally Bar Mini": "994-000169",
    "Logitech Rally Bar": "994-000168",
    "Logitech Rally Camera": "994-000157",
    "Logitech Rally Plus": "994-000156",
    "Logitech Sight": "994-000239",
    "Logitech Scribe": "994-000164",
    "Logitech Tap": "994-000159",
    "Logitech Tap IP": "994-000159",
    "Logitech Tap Scheduler": "994-000163",
    "Logitech Swytch": "994-000165",
    "Logitech RoomMate": "994-000170",
  },
};

export const isShowPriceByLocale = (locale: string) => {
  const localeNotShowPrice = [
    "es-MX",
    "ja-JP",
    "pt-BR",
    "zh-CN",
    "en-IN",
    "en-AU",
    "en-MY",
  ];
  return !localeNotShowPrice.includes(locale);
};

export const getExclusionServiceByLocale = (locale: string) => {
  const { ExtendedWarranty, EssentialServicePlan, SupportService } =
    SoftwareServicesName;

  const data: Record<string, string[]> = {
    ExtendedWarrantyOnly: [ExtendedWarranty],
    EssentialAndSupport: [EssentialServicePlan, SupportService],
    AllServices: [ExtendedWarranty, EssentialServicePlan, SupportService],
  };

  const mapping: Record<string, string[]> = {
    AU: data.ExtendedWarrantyOnly,
    DE: data.ExtendedWarrantyOnly,
    TH: data.ExtendedWarrantyOnly,
    KE: data.ExtendedWarrantyOnly,

    BR: data.AllServices,
    PR: data.AllServices,
    KH: data.AllServices,
    NG: data.AllServices,
    KZ: data.AllServices,

    CR: data.EssentialAndSupport,
    EC: data.EssentialAndSupport,
    UY: data.EssentialAndSupport,
    NI: data.EssentialAndSupport,
    PA: data.EssentialAndSupport,
    AL: data.EssentialAndSupport,
    MM: data.EssentialAndSupport,
    LK: data.EssentialAndSupport,
    BD: data.EssentialAndSupport,
    MT: data.EssentialAndSupport,
    UA: data.EssentialAndSupport,
  };

  const key = Object.keys(mapping).find((k) =>
    locale.toLowerCase().includes(k.toLowerCase())
  );

  return key ? mapping[key] : undefined;
};

export const getSKUSelectServiceByCamera = (
  cameraName: string,
  year: string
) => {
  if (!cameraName || !year) return null;
  const number = year?.split(" ");
  if (!number && number[0]) return null;
  const data: Record<string, Record<string, string>> = {
    "1": {
      [CameraName.MeetUp2]: "994-000368",
      [CameraName.RallyBarHuddle]: "994-000368",
    },
    "3": {
      [CameraName.MeetUp2]: "994-000369",
      [CameraName.RallyBarHuddle]: "994-000369",
    },
    "5": {
      [CameraName.MeetUp2]: "994-000370",
      [CameraName.RallyBarHuddle]: "994-000370",
    },
  };

  const sku = data[number[0]][cameraName];
  if (!sku) return null;
  return sku;
};
