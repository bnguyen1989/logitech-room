# Giải thích cách AnnotationModal hoạt động

## 📋 Tổng quan

`AnnotationModal` là một modal hiển thị thông tin chi tiết về sản phẩm khi người dùng click vào icon ℹ️ trên card sản phẩm.

## 🔄 Luồng hoạt động (Flow)

### Bước 1: User click icon info trên CardItem

```typescript
// File: src/components/Cards/CardItem/CardItem.tsx
const handleInfo = () => {
  // 1. Lấy productName từ Redux hoặc metadata
  let finalProductName = productName;
  
  // 2. Nếu không có, dùng mapping cho RallyBoard
  if (!finalProductName || finalProductName.trim() === "") {
    const productNameMap = {
      [CameraName.RallyBoard]: "RallyBoard Mount",
      [CameraName.RallyBoardCredenza]: "RallyBoard Credenza",
    };
    finalProductName = productNameMap[keyItemPermission] || keyItemPermission;
  }
  
  // 3. Dispatch action để mở modal
  dispatch(
    setAnnotationItemModal({
      isOpen: true,
      product: finalProductName,      // ← Tên sản phẩm (key để lookup language data)
      keyPermission: keyItemPermission, // ← Key permission (RallyBoard, RallyBoardCredenza, etc.)
      card: card,                      // ← Card object chứa metadata
    })
  );
};
```

### Bước 2: Redux Store cập nhật

```typescript
// File: src/store/slices/modals/Modals.slice.ts
setAnnotationItemModal: (state, action: PayloadAction<AnnotationItemModalI>) => {
  state[ModalName.ANNOTATION_ITEM] = action.payload;
  // State sẽ có dạng:
  // {
  //   isOpen: true,
  //   product: "RallyBoard Mount",
  //   keyPermission: "RallyBoard",
  //   card: {...}
  // }
}
```

### Bước 3: AnnotationModal component render

```typescript
// File: src/components/Modals/AnnotationModal/AnnotationModal.tsx
export const AnnotationModal: React.FC = () => {
  // 1. Lấy data từ Redux store
  const modalData = useAppSelector(getAnnotationModalData);
  const { isOpen, product, card, keyPermission } = modalData || {};
  
  // 2. Lấy language data dựa trên product name
  const dataProduct = useAppSelector(getLangForModalProduct(product));
  
  // 3. Lấy product image
  const langProductImage = useAppSelector(
    getLangProductImage(product, keyPermission)
  );
  
  // 4. Early returns nếu thiếu data
  if (!card) return <></>;        // ← Nếu không có card → return empty
  if (!dataProduct) return <></>; // ← Nếu không có dataProduct → return empty
  if (!isOpen) return null;       // ← Nếu modal chưa mở → return null
  
  // 5. Tạo Annotation instance để xử lý features
  const annotation = new Annotation(dataProduct);
  const featureList2A = annotation.getFeatures("fetures2A");
  const featureList3A = annotation.getFeatures("fetures3A");
  
  // 6. Render UI
  return <ModalContainer>...</ModalContainer>;
};
```

### Bước 4: getLangForModalProduct selector

```typescript
// File: src/store/slices/ui/selectors/selectoreLangProduct.ts
export const getLangForModalProduct = (keyProduct: string | undefined) => 
  (state: RootState) => {
    // 1. Kiểm tra keyProduct có tồn tại không
    if (!keyProduct) return undefined;
    
    // 2. Lookup trong state.ui.langText.products
    // Key phải match EXACTLY với keyProduct
    // Ví dụ: "RallyBoard Mount" phải match với key trong JSON
    
    // 3. Lấy Blade_1 (ProductName, ShortDescription, LongDescription, Colors)
    const langsProductBlade1 = getLangProductBlade1(keyProduct)(state);
    
    // 4. Lấy Blade_2 (Headline, Description, Image|Video)
    const langsProductBlade2 = getLangProductBlade2(keyProduct)(state);
    
    // 5. Lấy Blade_2A (Features array)
    const langsProductBlade2A = getLangProductBlade2A(keyProduct)(state);
    
    // 6. Lấy Blade_3A (Features array)
    const langsProductBlade3A = getLangProductBlade3A(keyProduct)(state);
    
    // 7. Merge tất cả lại thành objData
    let objData = {
      ...langsProductBlade1,  // ProductName, ShortDescription, LongDescription, Colors
      ...langsProductBlade2,   // Headline, Description, Image|Video
      fetures2A: {...},        // Features từ Blade_2A (converted to object)
      fetures3A: {...}         // Features từ Blade_3A (converted to object)
    };
    
    return objData;
  };
```

## 🗂️ Cấu trúc dữ liệu cần thiết

### 1. Redux Store Structure

```typescript
state.modals[ModalName.ANNOTATION_ITEM] = {
  isOpen: true,
  product: "RallyBoard Mount",        // ← Phải match với key trong en-us.json
  keyPermission: "RallyBoard",        // ← Key permission
  card: {                             // ← Card object
    keyPermission: "RallyBoard",
    dataThreekit: {
      threekitItems: {
        "RallyBoard": {
          metadata: {
            "Product Name": "RallyBoard Mount"  // ← Phải match với product
          }
        }
      }
    }
  }
}
```

### 2. Language Data Structure (en-us.json)

```json
{
  "RallyBoard Mount": {  // ← Key này phải match với product name
    "Card": {
      "ProductName": "RallyBoard Mount",
      "ShortDescription": ["Interactive display for wall mounting"]
    },
    "Blade_1": {
      "ProductName": "RallyBoard Mount",
      "ShortDescription": "Interactive display for wall mounting",
      "LongDescription": "RallyBoard Mount is an interactive display...",
      "Colors": {
        "Graphite": "/images/product/rallyboard-wall.jpg"
      }
    },
    "Blade_2": {
      "Headline": "WALL-MOUNTED INTERACTIVE DISPLAY",
      "Description": "RallyBoard Mount offers a space-efficient solution...",
      "Image|Video": {
        "Image link": "/images/product/rallyboard-wall.jpg"
      }
    },
    "Blade_3A": {
      "Features": [
        {
          "HeaderFeature": "SPACE-EFFICIENT DESIGN",
          "sorting": "1",
          "KeyFeature": "Wall-mounted design maximizes floor space...",
          "LinkImgFeature": {
            "Image link": "/images/product/rallyboard-wall.jpg"
          }
        }
      ]
    }
  }
}
```

### 3. dataProduct Structure (sau khi merge)

```typescript
dataProduct = {
  // Từ Blade_1
  ProductName: "RallyBoard Mount",
  ShortDescription: "Interactive display for wall mounting",
  LongDescription: "RallyBoard Mount is an interactive display...",
  Colors: { Graphite: "/images/product/rallyboard-wall.jpg" },
  
  // Từ Blade_2
  Headline: "WALL-MOUNTED INTERACTIVE DISPLAY",
  Description: "RallyBoard Mount offers a space-efficient solution...",
  "Image|Video": {
    "Image link": "/images/product/rallyboard-wall.jpg"
  },
  
  // Từ Blade_3A (converted to object)
  fetures3A: {
    0: {
      HeaderFeature: "SPACE-EFFICIENT DESIGN",
      sorting: "1",
      KeyFeature: "Wall-mounted design maximizes floor space...",
      LinkImgFeature: {
        "Image link": "/images/product/rallyboard-wall.jpg"
      }
    }
  }
}
```

## ❌ Tại sao modal không chạy?

### Vấn đề 1: `product` là `undefined`

**Nguyên nhân:**
- `getMetadataProductNameAssetFromCard` trả về `undefined` hoặc empty string
- Fallback logic trong `CardItem.handleInfo()` không chạy đúng

**Cách debug:**
```typescript
console.log("[CardItem] Opening annotation modal:", {
  productName,           // ← Kiểm tra giá trị này
  finalProductName,      // ← Kiểm tra giá trị này
  keyItemPermission,    // ← Kiểm tra giá trị này
});
```

**Cách fix:**
- Đảm bảo `productName` được set đúng trong `CardItem`
- Kiểm tra mapping trong `productNameMap` có đúng không
- Kiểm tra `card.dataThreekit.threekitItems[keyItemPermission].metadata["Product Name"]`

### Vấn đề 2: `dataProduct` là `undefined`

**Nguyên nhân:**
- `product` name không match với key trong `en-us.json`
- Language data chưa được load vào Redux store
- Key trong JSON không đúng (case-sensitive, spaces, etc.)

**Cách debug:**
```typescript
console.log("[getLangForModalProduct] Looking up product:", {
  keyProduct,                    // ← "RallyBoard Mount"
  availableProducts: Object.keys(getAllLangProducts(state))  // ← ["RALLYBOARD MOUNT", ...]
});
```

**Cách fix:**
- Đảm bảo `product` name match EXACTLY với key trong JSON
- Kiểm tra case sensitivity: "RallyBoard Mount" vs "RALLYBOARD MOUNT"
- Kiểm tra language data đã được load chưa: `state.ui.langText.products`

### Vấn đề 3: `card` là `undefined`

**Nguyên nhân:**
- Card không được truyền vào `setAnnotationItemModal`
- Card bị mất trong quá trình dispatch

**Cách debug:**
```typescript
console.log("[AnnotationModal] Initial state:", {
  modalData,
  hasCard: !!card,
  cardKeyPermission: card?.keyPermission,
});
```

**Cách fix:**
- Đảm bảo `card` được truyền vào `setAnnotationItemModal`
- Kiểm tra `card` có tồn tại trong `CardItem` không

### Vấn đề 4: Image URLs không đúng format

**Nguyên nhân:**
- Image paths trong JSON là relative paths (`/images/...`)
- Cần convert sang absolute URLs bằng `getImageUrl()`

**Cách fix:**
- Đã được fix trong `getLangForModalProduct` và `getLangProductImage`
- Image paths được process qua `getImageUrl()` nếu bắt đầu với `/images/`

## 🔍 Checklist để debug

1. ✅ **Kiểm tra `product` có giá trị không?**
   ```typescript
   console.log("[AnnotationModal] product:", product);
   ```

2. ✅ **Kiểm tra `keyPermission` có giá trị không?**
   ```typescript
   console.log("[AnnotationModal] keyPermission:", keyPermission);
   ```

3. ✅ **Kiểm tra `card` có tồn tại không?**
   ```typescript
   console.log("[AnnotationModal] card:", card);
   ```

4. ✅ **Kiểm tra `dataProduct` có được load không?**
   ```typescript
   console.log("[AnnotationModal] dataProduct:", dataProduct);
   ```

5. ✅ **Kiểm tra product name có match với JSON key không?**
   ```typescript
   console.log("[getLangForModalProduct] availableProducts:", 
     Object.keys(getAllLangProducts(state))
   );
   ```

6. ✅ **Kiểm tra language data đã được load chưa?**
   ```typescript
   console.log("[getLangForModalProduct] langText.products:", 
     state.ui.langText.products
   );
   ```

## 🛠️ Cách sửa nhanh

### Nếu `product` là `undefined`:

1. Kiểm tra `CardItem.tsx` - đảm bảo `productName` được set đúng
2. Kiểm tra `buildLocalRallyBoardCard` - đảm bảo metadata `"Product Name"` được set
3. Thêm fallback trong `handleInfo()`:

```typescript
const handleInfo = () => {
  let finalProductName = productName;
  
  // Fallback 1: Từ card metadata
  if (!finalProductName) {
    finalProductName = card?.dataThreekit?.threekitItems?.[keyItemPermission]?.metadata?.["Product Name"];
  }
  
  // Fallback 2: Từ mapping
  if (!finalProductName) {
    const productNameMap = {
      [CameraName.RallyBoard]: "RallyBoard Mount",
      [CameraName.RallyBoardCredenza]: "RallyBoard Credenza",
    };
    finalProductName = productNameMap[keyItemPermission] || keyItemPermission;
  }
  
  dispatch(setAnnotationItemModal({
    isOpen: true,
    product: finalProductName,
    keyPermission: keyItemPermission,
    card: card,
  }));
};
```

### Nếu `dataProduct` là `undefined`:

1. Kiểm tra product name có match với JSON key không
2. Kiểm tra language data đã được load chưa
3. Kiểm tra case sensitivity

```typescript
// Trong getLangForModalProduct, thêm logging:
console.log("[getLangForModalProduct] Looking up:", {
  keyProduct,
  availableProducts: Object.keys(getAllLangProducts(state)),
  match: Object.keys(getAllLangProducts(state)).includes(keyProduct.toUpperCase())
});
```

## 📝 Tóm tắt

**AnnotationModal hoạt động theo 4 bước:**

1. **User click** → `CardItem.handleInfo()` dispatch `setAnnotationItemModal`
2. **Redux update** → Store cập nhật với `{isOpen: true, product, keyPermission, card}`
3. **Modal render** → `AnnotationModal` lấy data từ Redux và lookup language data
4. **Display** → Render UI dựa trên `dataProduct`

**Modal sẽ không hiển thị nếu:**
- `product` là `undefined` → `dataProduct` sẽ là `undefined` → return `<></>`
- `card` là `undefined` → return `<></>`
- `isOpen` là `false` → return `null`
- Product name không match với JSON key → `dataProduct` sẽ là `undefined` → return `<></>`

**Cách fix:**
- Đảm bảo `product` luôn có giá trị (dùng fallback)
- Đảm bảo product name match với JSON key
- Đảm bảo language data đã được load
- Kiểm tra console logs để trace data flow

