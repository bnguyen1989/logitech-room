export const getSKUProductByExtendedWarranty = (
  productName: string,
  year: string
) => {
  const number = year?.split(" ");
  if (!number && number[0]) return null;
  const sku = data[number[0]][productName];
  if (!sku) return null;
  return sku;
};

const data: Record<string, Record<string, string>> = {
  "1": {
    "Logitech Rally Bar Huddle": "994-000248",
    "Logitech Rally Bar Mini": "994-000138",
    "Logitech Rally Bar": "994-000137",
    "Logitech Rally Camera": "994-000107",
    "Logitech Rally Plus": "994-000101",
    "Logitech Sight": "994-000240",
    "Logitech Scribe": "994-000147",
    "Logitech Tap": "994-000139",
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
    "Logitech Tap": "994-000170",
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
