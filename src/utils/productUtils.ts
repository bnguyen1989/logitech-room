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
    "Logitech Rally Bar Mini - Graphite": "994-000248",
    "Logitech Rally Bar Mini - White": "994-000138",
    "Logitech Rally Bar Mini - TAA": "994-000137",
    "Logitech Rally Bar - Graphite": "994-000107",
    "Logitech Rally Bar - White": "994-000101",
    "Logitech Rally Bar - TAA": "994-000240",
    "Logitech Rally Camera": "994-000147",
    "Logitech Rally Plus - White": "994-000150",
    "Logitech Sight - White": "994-000151",
    "Logitech Scribe - White": "994-000125",
    "Logitech Tap - CAT5": "994-000139",
  },
  "3": {
    "Logitech Rally Bar Mini - Graphite": "994-000249",
    "Logitech Rally Bar Mini - White": "994-000169",
    "Logitech Rally Bar Mini - TAA": "994-000168",
    "Logitech Rally Bar - Graphite": "994-000157",
    "Logitech Rally Bar - White": "994-000156",
    "Logitech Rally Bar - TAA": "994-000239",
    "Logitech Rally Camera": "994-000164",
    "Logitech Rally Plus - White": "994-000159",
    "Logitech Sight - White": "994-000163",
    "Logitech Scribe - White": "994-000165",
    "Logitech Tap - CAT5": "994-000170",
  },
};
