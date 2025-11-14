# Hướng Dẫn: Load GLB Device Không Dùng Threekit (Tổng Quát)

## Tổng Quan

Hướng dẫn này mô tả các bước cần thiết để load GLB device từ local file (không dùng Threekit) và cách tạo hệ thống tổng quát cho nhiều device.

---

## Các Bước Load GLB Device Không Dùng Threekit

### Bước 1: Đặt File GLB Vào Public Folder

**Mục đích:** Đặt file GLB vào folder có thể access qua URL

**Cách làm:**
- Tạo folder `public/assets/models/` (hoặc folder khác trong `public/`)
- Đặt file GLB vào folder này
- Path: `public/assets/models/device-name.glb`
- URL access: `/assets/models/device-name.glb`

**Lưu ý:**
- File trong `public/` có thể access qua URL bắt đầu với `/`
- File GLB phải đúng format (đã test)
- **File GLB và Image là 2 loại file khác nhau:**
  - **GLB file (3D model)**: Lưu trong `public/assets/models/` - dùng để render 3D
  - **Image file (hình ảnh card)**: Lưu trong `public/images/` - dùng để hiển thị trong UI

### Bước 1.5: Đặt File Image Vào Public Folder (Nếu Có)

**Mục đích:** Đặt file image để hiển thị trong UI (card image)

**Cách làm:**
- Tạo folder `public/images/products/` (hoặc folder khác trong `public/images/`)
- Đặt file image vào folder này
- Path: `public/images/products/device-name.jpg`
- URL access: `/images/products/device-name.jpg`

**Lưu ý:**
- ⚠️ **Image KHÔNG lưu trong `public/assets/models/`** (đó là nơi lưu GLB files)
- ✅ **Image lưu trong `public/images/`** (hoặc subfolder như `public/images/products/`)
- Image dùng để hiển thị trong UI (card image), không phải 3D model
- Image là optional (có thể không có), nhưng nên có để hiển thị trong UI
- Nếu folder `products/` chưa có, cần tạo folder này trong `public/images/`

---

### Bước 2: Tạo/Update Asset Mapping

**Mục đích:** Map assetId (dùng trong card config) → file path (GLB file)

**File:** `src/utils/localAssetLoader.ts`

**Cách làm:**
- Thêm entry vào `LOCAL_ASSET_MAPPING`
- Key: assetId (dùng trong card config)
- Value: path đến file GLB (bắt đầu với `/`)

**Ví dụ:**
```typescript
export const LOCAL_ASSET_MAPPING: Record<string, string> = {
  "device-1-asset-id": "/assets/models/device-1.glb",
  "device-2-asset-id": "/assets/models/device-2.glb",
};
```

---

### Bước 3: Cấu Hình Card

**Mục đích:** Tạo card cho device trong Redux store

**Card là gì?**
- Card là đại diện UI cho một device/sản phẩm trong configurator
- Card kết nối 3 phần:
  1. **UI** (hiển thị trong danh sách sản phẩm) - hình ảnh, tên, mô tả
  2. **Asset** (file GLB) - assetId để load file GLB
  3. **Element** (logic placement) - keyPermission để kết nối với Element

**Tại sao cần tạo Card cho mỗi device?**
- ✅ Mỗi device cần 1 card riêng để hiển thị trong UI
- ✅ Card chứa assetId để load file GLB đúng cho device đó
- ✅ Card có keyPermission để kết nối với Element (quyết định đặt device ở đâu)
- ✅ Không có card → device không hiển thị trong UI → user không thể chọn

**Card làm gì?**
1. **Hiển thị device trong UI:**
   - User thấy card trong danh sách sản phẩm
   - User click card để chọn device

2. **Lưu trữ assetId:**
   - Card chứa `assetId` trong `dataThreekit.threekitItems`
   - AssetId được dùng để load file GLB (qua `LOCAL_ASSET_MAPPING`)

3. **Kết nối với Element:**
   - `card.keyPermission` khớp với `element.name` trong configurator
   - Element quyết định placement node (đặt device ở đâu)
   - Card quyết định assetId (dùng file GLB nào)

**File:** `src/store/slices/ui/handlers/handlers.ts`

**Có 2 cách để tạo Card:**

### Cách 1: Tạo Card Thủ Công (Manual) - Cho từng device riêng lẻ

**Cách làm:**
1. Tạo function `addDeviceCard(store: Store)` cho device mới
2. Tạo card object với các thông tin:
   - `key`: Step mà card thuộc về (ví dụ: `StepName.ConferenceCamera`)
   - `keyPermission`: Tên device (phải khớp với `element.name`)
   - `dataThreekit.threekitItems[deviceName].assetId`: Key trong `LOCAL_ASSET_MAPPING`
   - `counter`: Số lượng min/max (ví dụ: min: 0, max: 1)
3. Dispatch action `setDataCardsStep()` để add card vào Redux store

**Ví dụ: Tạo card cho RallyBoard (thủ công)**
```typescript
function addRallyBoardCard(store: Store) {
  const rallyBoardCard: CardI = {
    key: StepName.ConferenceCamera,
    keyPermission: CameraName.RallyBoard,  // "RallyBoard"
    dataThreekit: {
      attributeName: "RallyBoard",
      threekitItems: {
        [CameraName.RallyBoard]: {  // ⭐ Key của object - PHẢI khớp với keyPermission
          id: "rallyboard-mount-asset-1",  // ⭐ Key trong LOCAL_ASSET_MAPPING
          assetId: "rallyboard-mount-asset-1",
          key: CameraName.RallyBoard,      // ⭐ Key trong value object (không bắt buộc phải giống)
          name: CameraName.RallyBoard,     // ⭐ Tên hiển thị của asset
          type: "asset",
          // ... other properties ...
        },
      },
    },
    counter: {
      min: 0,
      max: 1,
      threekit: { key: "" },
    },
  };

  // Add card vào Redux store
  const state = store.getState();
  const stepData = state.ui.stepData[StepName.ConferenceCamera];
  if (stepData) {
    const existingCards = { ...stepData.cards };
    existingCards[CameraName.RallyBoard] = rallyBoardCard;
    
    store.dispatch(
      setDataCardsStep({
        step: StepName.ConferenceCamera,
        cards: existingCards,
      })
    );
  }
}
```

---

## Giải Thích: Tại Sao Dùng `dataThreekit.threekitItems` Mặc Dù GLB Không Từ Threekit?

### Câu Hỏi Thường Gặp:

1. **Tại sao dùng `dataThreekit.threekitItems` mặc dù GLB không từ Threekit?**
2. **Tại sao `key` và `name` có cùng giá trị?**
3. **Có ảnh hưởng gì không?**

### Giải Thích:

### 1. Tại Sao Dùng `dataThreekit.threekitItems` Mặc Dù GLB Không Từ Threekit?

**Lý do:**
- ✅ Hệ thống được thiết kế để hỗ trợ cả **Threekit assets** và **local GLB files**
- ✅ Card interface (`CardI`) có cấu trúc `dataThreekit.threekitItems` vì đây là cách hệ thống lưu trữ asset information
- ✅ `getAssetFromCard()` function sử dụng `card.dataThreekit.threekitItems` để lấy assetId
- ✅ Mặc dù tên là "threekitItems" nhưng nó có thể chứa cả Threekit assets và local GLB assets
- ✅ **Không ảnh hưởng gì** - đây chỉ là tên gọi, logic vẫn hoạt động bình thường

**Kết luận:**
- Đây chỉ là **tên gọi** (naming convention) từ khi hệ thống được thiết kế cho Threekit
- Hệ thống vẫn hoạt động bình thường với local GLB files
- Không cần thay đổi gì - chỉ cần đặt assetId đúng trong `threekitItems`

### 2. Tại Sao `key` Và `name` Có Cùng Giá Trị?

**Lý do:**
- ✅ Trong trường hợp đơn giản (không có color/select variants), `key` và `name` thường giống nhau
- ✅ **`key`** (trong `threekitItems` object): Key để lookup trong object (ví dụ: `threekitItems["RallyBoard"]`)
- ✅ **`name`** (trong `ValueAssetStateI`): Tên hiển thị của asset (dùng để hiển thị trong UI)

**Mục đích khác nhau:**
- **`key`**: Dùng để lookup asset trong `threekitItems` object (ví dụ: `threekitItems[key]`)
- **`name`**: Dùng để hiển thị tên sản phẩm trong UI (ví dụ: "RallyBoard")

**Khi nào khác nhau:**
- Khi có variants (color/select), `key` sẽ khác `name` để phân biệt các variants
- Ví dụ:
  ```typescript
  threekitItems: {
    "RallyBoard-Graphite": {  // ⭐ Key khác
      id: "rallyboard-graphite-asset-id",
      key: "RallyBoard-Graphite",
      name: "RallyBoard",  // ⭐ Name giống nhau (tên sản phẩm)
    },
    "RallyBoard-White": {
      id: "rallyboard-white-asset-id",
      key: "RallyBoard-White",
      name: "RallyBoard",  // ⭐ Name giống nhau
    },
  }
  ```

**Kết luận:**
- Nếu không có variants: `key` và `name` giống nhau là **bình thường** và **OK**
- Nếu có variants: `key` khác nhau, `name` giống nhau (tên sản phẩm)
- **Không ảnh hưởng gì** nếu chúng giống nhau trong trường hợp đơn giản

### 3. Mục Đích Của Từng Field:

| Field | Mục đích | Ví dụ |
|-------|----------|-------|
| **`id`** | AssetId để load file GLB (key trong `LOCAL_ASSET_MAPPING`) | `"rallyboard-mount-asset-1"` |
| **`assetId`** | Giống `id` (dùng để compatibility) | `"rallyboard-mount-asset-1"` |
| **`key`** | Key để lookup trong `threekitItems` object | `"RallyBoard"` hoặc `"RallyBoard-Graphite"` |
| **`name`** | Tên hiển thị của asset (dùng trong UI, metadata) | `"RallyBoard"` |
| **`type`** | Loại asset (thường là "asset") | `"asset"` |

### 4. Có Ảnh Hưởng Gì Không?

**Trường hợp đơn giản (không có variants):**
- ✅ **Không ảnh hưởng gì** nếu `key` và `name` giống nhau
- ✅ Hệ thống vẫn hoạt động bình thường
- ✅ Đây là cách làm đúng và phổ biến

**Trường hợp có variants (color/select):**
- ✅ `key` sẽ khác nhau để phân biệt các variants (ví dụ: `"RallyBoard-Graphite"`, `"RallyBoard-White"`)
- ✅ `name` giống nhau (tên sản phẩm: `"RallyBoard"`)
- ✅ Hệ thống sử dụng `key` để lookup asset, `name` để hiển thị trong UI

**Kết luận:**
- ✅ **Không ảnh hưởng gì** nếu `key` và `name` giống nhau trong trường hợp đơn giản
- ✅ Đây là cách làm đúng và được khuyến nghị

### 5. Key Của Object Trong `threekitItems` - Quan Trọng! ⚠️

**Câu hỏi:** Key của object trong `threekitItems` (trong `[CameraName.RallyBoard]`) có thể là `"RallyBoard"` thay vì `CameraName.RallyBoard` không?

**Trả lời:**
- ✅ **CÓ THỂ** dùng `"RallyBoard"` (string) thay vì `CameraName.RallyBoard` (enum)
- ✅ **Điều kiện:** Giá trị phải khớp với `card.keyPermission`
- ✅ **Quan trọng:** Key của object PHẢI khớp với `keyPermission` để lookup thành công

**Vì sao?**
```typescript
// getAssetFromCard() sử dụng keyPermission để lookup
const keyPermission = card.keyPermission;  // "RallyBoard" (hoặc CameraName.RallyBoard)
const asset = threekitItems[keyPermission];  // ⭐ Lookup bằng keyPermission

// Nếu key không khớp, sẽ fallback về key đầu tiên
if (threekitItems[keyPermission]) return threekitItems[keyPermission];
return threekitItems[keysThreekitItems[0]];  // ⭐ Fallback
```

**Ví dụ đúng:**
```typescript
// Cách 1: Dùng enum (khuyến nghị)
const card: CardI = {
  keyPermission: CameraName.RallyBoard,  // "RallyBoard"
  dataThreekit: {
    threekitItems: {
      [CameraName.RallyBoard]: {  // ⭐ Key = "RallyBoard" (giá trị của enum)
        id: "rallyboard-mount-asset-1",
        key: CameraName.RallyBoard,
        name: CameraName.RallyBoard,
      },
    },
  },
};

// Cách 2: Dùng string trực tiếp (cũng OK)
const card: CardI = {
  keyPermission: "RallyBoard",  // "RallyBoard"
  dataThreekit: {
    threekitItems: {
      "RallyBoard": {  // ⭐ Key = "RallyBoard" (string)
        id: "rallyboard-mount-asset-1",
        key: "RallyBoard",
        name: "RallyBoard",
      },
    },
  },
};
```

**Ví dụ sai:**
```typescript
// ❌ SAI: Key không khớp với keyPermission
const card: CardI = {
  keyPermission: "RallyBoard",  // "RallyBoard"
  dataThreekit: {
    threekitItems: {
      "RallyBoardMount": {  // ⭐ Key khác "RallyBoard" → sẽ fallback
        id: "rallyboard-mount-asset-1",
      },
    },
  },
};
// → getAssetFromCard() sẽ tìm "RallyBoard" nhưng không có
// → Fallback về key đầu tiên: "RallyBoardMount" (vẫn hoạt động nhưng không đúng ý)
```

**Kết luận:**
- ✅ **Key của object trong `threekitItems`** (ví dụ: `RallyBoard: {}`) **PHẢI khớp** với `card.keyPermission` (về giá trị)
- ✅ **`key` trong value object** (ví dụ: `key: "RallyBoard"`) **KHÔNG bắt buộc** phải giống với key của object
- ✅ Có thể dùng enum (`CameraName.RallyBoard`) hoặc string (`"RallyBoard"`) - đều OK
- ✅ **Quan trọng:** 
  - Key của object PHẢI khớp với `keyPermission` (dùng để lookup)
  - `key` trong value object có thể khác, nhưng nên giống để consistent

**Về `key` trong value object:**
- `key` trong value object (ví dụ: `key: CameraName.RallyBoard`) **KHÔNG bắt buộc** phải giống với key của object
- Nhưng để consistent và dễ hiểu, nên đặt giống nhau
- `key` trong value object dùng để hiển thị metadata, **KHÔNG dùng để lookup**
- **Lookup sử dụng key của object** (trong `[CameraName.RallyBoard]`), không sử dụng `key` trong value object

**Ví dụ cụ thể:**

**Câu hỏi:** Có thể dùng `key: "rallyBoardWall"` (camelCase) thay vì `key: "RallyBoard"` không?

**Trả lời:** ✅ **CÓ THỂ**, nhưng **KHÔNG KHUYẾN NGHỊ** vì sẽ gây confusion.

```typescript
// ✅ ĐÚNG: Key của object khớp với keyPermission
threekitItems: {
  "RallyBoard": {  // ⭐ Key của object - PHẢI khớp với keyPermission
    id: "rallyboard-mount-asset-1",
    key: "RallyBoard",  // ⭐ key trong value object - NÊN giống với key của object
    name: "RallyBoard",
  },
}

// ⚠️ CÓ THỂ (nhưng không khuyến nghị): key trong value object khác
threekitItems: {
  "RallyBoard": {  // ⭐ Key của object - PHẢI khớp với keyPermission
    id: "rallyboard-mount-asset-1",
    key: "rallyBoardWall",  // ⭐ key trong value object - KHÁC (có thể nhưng không khuyến nghị)
    name: "RallyBoard",
  },
}

// ❌ SAI: Key của object không khớp với keyPermission
threekitItems: {
  "rallyBoardWall": {  // ⭐ Key của object - KHÔNG khớp với keyPermission = "RallyBoard"
    id: "rallyboard-mount-asset-1",
    key: "rallyBoardWall",
    name: "RallyBoard",
  },
}
// → getAssetFromCard() sẽ tìm "RallyBoard" nhưng không có
// → Fallback về key đầu tiên: "rallyBoardWall" (vẫn hoạt động nhưng không đúng ý)
```

**Giải thích:**
```typescript
// getAssetFromCard() lookup:
const keyPermission = card.keyPermission;  // "RallyBoard"
const asset = threekitItems[keyPermission];  // ⭐ Sử dụng key của object: threekitItems["RallyBoard"]
// asset.key = "rallyBoardWall" (KHÔNG được dùng để lookup, chỉ là metadata)
```

**Kết luận:**
- ✅ **Key của object** (ví dụ: `RallyBoard: {}`) **PHẢI khớp** với `keyPermission` (quan trọng!)
- ✅ **`key` trong value object** (ví dụ: `key: "rallyBoardWall"`) **KHÔNG bắt buộc** phải giống, nhưng **NÊN giống** để consistent
- ✅ Có thể dùng `key: "rallyBoardWall"` (camelCase) nhưng **KHÔNG KHUYẾN NGHỊ** vì sẽ gây confusion
- ✅ **Khuyến nghị:** Đặt `key` trong value object giống với key của object để dễ hiểu và maintain

---

### 6. Cách Hệ Thống Sử Dụng Các Field:

**Trường hợp đơn giản (không có variants):**
```typescript
// getAssetFromCard() sử dụng keyPermission để lookup trong threekitItems
const threekitItems = card.dataThreekit.threekitItems;
const keyPermission = card.keyPermission;  // "RallyBoard"

// Lookup asset bằng keyPermission
const asset = threekitItems[keyPermission];  // ⭐ Sử dụng keyPermission để lookup
// asset = threekitItems["RallyBoard"]

// Lấy assetId từ asset
const assetId = asset.id;  // "rallyboard-mount-asset-1"

// Hiển thị tên trong UI
const displayName = asset.name;  // "RallyBoard" (dùng để hiển thị)
```

**Trường hợp có variants (color):**
```typescript
threekitItems: {
  "RallyBoard-Graphite": {  // ⭐ Key của object = "RallyBoard-Graphite"
    id: "rallyboard-graphite-asset-id",
    key: "RallyBoard-Graphite",      // ⭐ Key trong value object (thường giống key của object)
    name: "RallyBoard",              // ⭐ Name giống nhau (tên sản phẩm)
  },
  "RallyBoard-White": {  // ⭐ Key của object = "RallyBoard-White"
    id: "rallyboard-white-asset-id",
    key: "RallyBoard-White",         // ⭐ Key trong value object
    name: "RallyBoard",             // ⭐ Name giống nhau
  },
}

// Khi user chọn color "Graphite":
// getAssetFromCard() tạo key: "RallyBoard" + separator + "Graphite" = "RallyBoard-Graphite"
const asset = threekitItems["RallyBoard-Graphite"];  // ⭐ Lookup bằng key
const assetId = asset.id;  // "rallyboard-graphite-asset-id"
const displayName = asset.name;  // "RallyBoard" (hiển thị tên sản phẩm)
```

---

## Tóm Tắt

### Về `dataThreekit.threekitItems`:
- ✅ Đây chỉ là **tên gọi** (naming convention) từ khi hệ thống được thiết kế cho Threekit
- ✅ Hệ thống vẫn hoạt động bình thường với local GLB files
- ✅ Không cần thay đổi gì - chỉ cần đặt assetId đúng trong `threekitItems`

### Về Key Của Object Trong `threekitItems`:
- ✅ **PHẢI khớp** với `card.keyPermission` (về giá trị)
- ✅ Có thể dùng enum (`CameraName.RallyBoard`) hoặc string (`"RallyBoard"`) - đều OK
- ✅ **Quan trọng:** Giá trị phải khớp, không phải cách viết
- ✅ Nếu không khớp, hệ thống sẽ fallback về key đầu tiên (có thể gây confusion)

### Về `key` và `name` Trong Value Object:
- ✅ **Trường hợp đơn giản (không có variants):** `key` và `name` giống nhau là **bình thường** và **OK**
- ✅ **Trường hợp có variants (color/select):** `key` khác nhau, `name` giống nhau (tên sản phẩm)
- ✅ **Mục đích:**
  - `key` (trong value object): Dùng để hiển thị metadata, **KHÔNG dùng để lookup**
  - `name`: Dùng để hiển thị tên sản phẩm trong UI
- ✅ **Không bắt buộc** `key` trong value object phải giống với key của object (nhưng **NÊN giống** để consistent)
- ✅ **Có thể dùng** `key: "rallyBoardWall"` (camelCase) nhưng **KHÔNG KHUYẾN NGHỊ** vì sẽ gây confusion

**Tóm tắt:**
- **Key của object** (ví dụ: `RallyBoard: {}`) **PHẢI khớp** với `keyPermission` (dùng để lookup)
- **`key` trong value object** (ví dụ: `key: "rallyBoardWall"`) **KHÔNG bắt buộc** phải giống, nhưng **NÊN giống** để consistent
- **Khuyến nghị:** Đặt `key` trong value object giống với key của object để dễ hiểu và maintain

---

**Kết luận:**
- ✅ Cấu trúc hiện tại là **đúng** và **hoạt động bình thường**
- ✅ Không cần thay đổi gì
- ✅ Chỉ cần đảm bảo `assetId` đúng trong `threekitItems`

**Ưu điểm:**
- ✅ Hoàn toàn control từng card
- ✅ Có thể customize chi tiết

**Nhược điểm:**
- ❌ Phải viết code riêng cho mỗi device
- ❌ Khó maintain khi có nhiều devices

---

### Cách 2: Tạo Card Từ JSON Config (Tổng Quát) - ⭐ Khuyến nghị

**Cách làm:**
1. Tạo file JSON config chứa thông tin các devices
2. Import và sử dụng function `registerDevicesFromConfig()` để tự động tạo cards
3. Chỉ cần thêm device vào JSON config, không cần viết code

**Bước 1: Tạo file JSON config**

**File:** `src/config/deviceCards.json`
```json
{
  "devices": [
    {
      "deviceId": "rallyboard-mount",
      "keyPermission": "RallyBoard",
      "step": "Conference Camera",
      "assetId": "rallyboard-mount-asset-1",
      "attributeName": "RallyBoard",
      "counter": {
        "min": 0,
        "max": 1
      },
      "image": "/images/products/rallyboard.jpg",
      "subtitle": "RallyBoard",
      "description": "RallyBoard display for wall mounting"
    },
    {
      "deviceId": "device-2",
      "keyPermission": "Device2",
      "step": "Conference Camera",
      "assetId": "device-2-asset-1",
      "attributeName": "Device2",
      "counter": {
        "min": 0,
        "max": 1
      }
    }
  ]
}
```

**Bước 2: Import và sử dụng trong handlers.ts**

**File:** `src/store/slices/ui/handlers/handlers.ts`
```typescript
import deviceCardsConfig from '../../config/deviceCards.json';
import { registerDevicesFromConfig } from '../../../utils/deviceCardConfig';

// Trong function getUiHandlers hoặc event handler
app.eventEmitter.on("threekitDataInitialized", (configurator: Configurator) => {
  // ... existing code ...
  
  // Register device cards from JSON config
  registerDevicesFromConfig(store, deviceCardsConfig.devices);
});
```

**Hoặc register từng device riêng:**
```typescript
import { registerDeviceCard } from '../../../utils/deviceCardConfig';

// Register single device
registerDeviceCard(store, {
  deviceId: "rallyboard-mount",
  keyPermission: "RallyBoard",
  step: StepName.ConferenceCamera,
  assetId: "rallyboard-mount-asset-1",
  attributeName: "RallyBoard",
  counter: { min: 0, max: 1 },
});
```

**Ưu điểm:**
- ✅ **Không cần viết code cho mỗi device** - chỉ cần thêm vào JSON
- ✅ **Dễ maintain** - tất cả devices ở một nơi
- ✅ **Dễ thêm/sửa/xóa device** - chỉ cần sửa JSON
- ✅ **Tái sử dụng code** - một function cho tất cả devices
- ✅ **Có thể load từ API** - JSON có thể load từ server

**Nhược điểm:**
- ❌ Ít flexible hơn cách thủ công (nhưng đủ cho hầu hết trường hợp)

---

### So Sánh 2 Cách:

| Tiêu chí | Cách 1: Thủ Công | Cách 2: JSON Config |
|----------|------------------|---------------------|
| **Code phức tạp** | Nhiều code | Ít code |
| **Maintain** | Khó (phải sửa code) | Dễ (chỉ sửa JSON) |
| **Thêm device mới** | Phải viết function mới | Chỉ cần thêm vào JSON |
| **Flexibility** | Cao | Trung bình |
| **Khuyến nghị** | Cho device đặc biệt | Cho hầu hết devices ⭐ |

---

### Cấu Trúc DeviceCardConfig:

```typescript
interface DeviceCardConfig {
  deviceId: string;              // Unique device ID
  keyPermission: string;         // Key permission (must match element.name)
  step: StepName;                // Step name (e.g., "Conference Camera")
  assetId: string;               // Asset ID (key in LOCAL_ASSET_MAPPING)
  attributeName: string;         // Attribute name
  counter?: {                    // Counter configuration
    min: number;
    max: number;
  };
  image?: string;                // Image path
  logo?: string;                 // Logo path
  subtitle?: string;             // Subtitle
  description?: string;          // Description
}
```

**Flow hoạt động:**
```
1. User click card trong UI
   ↓
2. getAssetFromCard(card) → assetId = "rallyboard-mount-asset-1"
   ↓
3. addElement(card) → element → mount.getNameNode() → "RallyBoard_Mount"
   ↓
4. setElementByNameNode(assetId, "RallyBoard_Mount")
   ↓
5. Redux store: { "RallyBoard_Mount": "rallyboard-mount-asset-1" }
   ↓
6. ProductNode render Product tại placement node với assetId
   ↓
7. resolveAssetPath("rallyboard-mount-asset-1") → "/assets/models/..."
   ↓
8. useLocalAsset() load file GLB
   ↓
9. Device hiển thị trong 3D scene! ✅
```

---

## Sau Khi Register Card Vào Redux - Các Bước Tiếp Theo

### Tổng Quan

Sau khi register card vào Redux store, các bước tiếp theo sẽ diễn ra khi user tương tác với card trong UI:

---

### Bước 1: Card Được Hiển Thị Trong UI

**File:** `src/pages/configurator/Content/ConfiguratorSections/ConfigurationFormForStep/ConfigurationFormForStep.tsx`

```typescript
export const ConfigurationFormForStep = () => {
  const activeStepData = useAppSelector(getActiveStepData);
  
  return (
    <div className={s.form}>
      {Object.values(activeStepData.cards).map((card, index) =>
        <CardItem key={index} keyItemPermission={card.keyPermission} />
      )}
    </div>
  );
};
```

**Chức năng:**
- Lấy cards từ Redux store: `activeStepData.cards`
- Render `CardItem` component cho mỗi card
- Card hiển thị trong UI với hình ảnh, tên, mô tả

**Kết quả:**
- User thấy card trong danh sách sản phẩm
- User có thể click card để chọn device

---

### Bước 2: User Click Card

**File:** `src/components/Cards/CardItem/CardItem.tsx`

```typescript
const handleClick = () => {
  if (isActiveCard && card.keyPermission) {
    app.removeItem(attributeName, card.keyPermission);
    return;
  }

  // ⭐ BƯỚC 2: Gọi app.addItemConfiguration()
  app.addItemConfiguration(
    attributeName,        // "RallyBoard"
    threekitAsset.id,    // "rallyboard-mount-asset-1" (assetId từ card)
    card.keyPermission   // "RallyBoard"
  );
};
```

**Chức năng:**
- Lấy `assetId` từ card: `getAssetFromCard(card)`
- Gọi `app.addItemConfiguration()` với `attributeName`, `assetId`, `keyPermission`
- Dispatch action `ADD_ACTIVE_CARD` vào Redux store

**Kết quả:**
- Card được đánh dấu là active
- Action `ADD_ACTIVE_CARD` được dispatch

---

### Bước 3: Middleware Xử Lý Action ADD_ACTIVE_CARD

**File:** `src/store/middleware/index.ts`

```typescript
case UI_ACTION_NAME.ADD_ACTIVE_CARD: {
  const { key } = action.payload;
  const activeStep = getActiveStep(state);

  // ⭐ BƯỚC 3: Xử lý permission và update nodes
  const permission = getPermission(activeStep)(state);
  permission.processAddActiveElementByName(key);

  updateActiveCardsByPermissionData(permission)(store);
  updateColorForAutoChangeItems(activeStep, key)(store);
  updateDisplayBasedOnRecommendation(key, activeStep)(store);
  updateDisplayTypeByKeyPermission(key, activeStep)(store);

  // ⭐ BƯỚC 3 (tiếp): Update nodes từ configuration
  const updateNodes = updateNodesByConfiguration(
    currentConfigurator,
    activeStep
  );
  const attributeNames = Configurator.getNamesAttrByStepName(activeStep);
  updateNodes(store, attributeNames);

  updateAssetIdByKeyPermission(key)(store);
  break;
}
```

**Chức năng:**
- Xử lý permission: `processAddActiveElementByName(key)`
- Update active cards: `updateActiveCardsByPermissionData()`
- Update color, display, recommendation
- **Quan trọng:** `updateNodesByConfiguration()` - map assetId → nodeName

**Kết quả:**
- Permission được cập nhật
- Active cards được cập nhật
- Nodes được cập nhật với mapping: `{ nodeName: assetId }`

---

### Bước 4: updateNodesByConfiguration() - Map AssetId → NodeName

**File:** `src/store/slices/configurator/handlers/handlers.ts`

```typescript
export function updateNodesByConfiguration(
  configurator: Configurator,
  stepName: StepName
) {
  return (store: Store, arrayAttributes: Array<Array<string>>) => {
    const state = store.getState();
    const configuration = configurator.getConfiguration();
    const step = getDataStepByName(stepName)(state);
    
    arrayAttributes.forEach((item) => {
      const [name] = item;
      const value = configuration[name];

      if (!(typeof value === "object")) return;

      if (value.assetId.length) {
        // ⭐ BƯỚC 4: Tìm card từ assetId
        const card: CardI | undefined = findCard(
          (card) => getAssetFromCard(card)(state)?.id === value.assetId,
          Object.values(step.cards)
        );
        if (!card) return;

        const count = getPropertyCounterCardByKeyPermission(
          stepName,
          card.keyPermission
        )(state);

        const isMounted = isMountedCard(card, stepName)(value.assetId)(state);
        if (isMounted) return;
        
        // ⭐ BƯỚC 4 (tiếp): Add element để map assetId → nodeName
        addElement(card, stepName, count)(store);
      }
    });
  };
}
```

**Chức năng:**
- Tìm card từ `assetId` trong configuration
- Kiểm tra xem device đã được mount chưa
- Gọi `addElement(card, stepName, count)` để map assetId → nodeName

**Kết quả:**
- Element được add vào configurator
- Mapping `{ nodeName: assetId }` được tạo

---

### Bước 5: addElement() - Map AssetId → NodeName

**File:** `src/store/slices/configurator/handlers/handlers.ts`

```typescript
export function addElement(
  card: CardI,
  stepName: StepName,
  count?: number
) {
  return (store: Store) => {
    const state = store.getState();
    const asset = getAssetFromCard(card)(state);
    
    // ⭐ BƯỚC 5: Tìm element từ card.keyPermission
    const element = getElementByKeyPermission(stepName, card.keyPermission)(state);
    if (!element) return;

    // ⭐ BƯỚC 5 (tiếp): Lấy nodeName từ element
    const mount = element.getMount();
    const nameNode = mount.getNameNode();
    // nameNode = "RallyBoard_Mount"

    // ⭐ BƯỚC 5 (tiếp): Set element bằng nodeName và assetId
    setElementByNameNode(asset.id, nameNode)(store);
    // setElementByNameNode("rallyboard-mount-asset-1", "RallyBoard_Mount")
  };
}
```

**Chức năng:**
- Tìm element từ `card.keyPermission`
- Lấy `nodeName` từ `element.getMount().getNameNode()`
- Gọi `setElementByNameNode(assetId, nodeName)` để map vào Redux store

**Kết quả:**
- Mapping `{ nodeName: assetId }` được tạo
- Redux store được cập nhật: `{ "RallyBoard_Mount": "rallyboard-mount-asset-1" }`

---

### Bước 6: setElementByNameNode() - Update Redux Store

**File:** `src/store/slices/configurator/handlers/handlers.ts`

```typescript
function setElementByNameNode(assetId: string, nameNode: string) {
  return (store: Store) => {
    // ⭐ BƯỚC 6: Dispatch action để update Redux store
    store.dispatch(
      changeValueNodes({
        [nameNode]: assetId,  // { "RallyBoard_Mount": "rallyboard-mount-asset-1" }
      })
    );
  };
}
```

**Chức năng:**
- Dispatch action `changeValueNodes()` để update Redux store
- Merge mapping mới vào existing nodes: `{ ...existingNodes, [nameNode]: assetId }`

**Kết quả:**
- Redux store được cập nhật:
  ```typescript
  state.configurator.nodes = {
    "RallyBoard_Mount": "rallyboard-mount-asset-1",
    // ... other mappings ...
  }
  ```

---

### Bước 7: ProductNode Detect Mapping → Render Product

**File:** `src/components/Assets/ProductNode.tsx`

```typescript
export const ProductNode: FC<ProductProps> = ({ nameNode, parentNode }) => {
  // ⭐ BƯỚC 7: Lấy mapping từ Redux store
  const attachNodeNameToAssetId = useAppSelector(getNodes);
  // attachNodeNameToAssetId = {
  //   "RallyBoard_Mount": "rallyboard-mount-asset-1",
  //   // ... other mappings ...
  // }

  // Kiểm tra xem có mapping cho nameNode không
  if (!Object.keys(attachNodeNameToAssetId).includes(nameNode)) {
    return undefined;  // Không có mapping → không render
  }

  // ⭐ BƯỚC 7 (tiếp): Render Product component
  return (
    <Product
      parentNode={parentNode}  // Placement node từ GLTF
      configuration={configuration[nameNode]}
      productAssetId={attachNodeNameToAssetId[nameNode]}  // "rallyboard-mount-asset-1"
      highlight={isHighlightNode}
      popuptNode={isPopuptNode}
      callbackDisableHighlight={callbackDisableHighlight}
      callbackOnHighlight={callbackOnHighlight}
      callbackDisablePopuptNodes={callbackDisablePopuptNodes}
      callbackOnPopuptNodes={callbackOnPopuptNodes}
      nameNode={nameNode}  // "RallyBoard_Mount"
    />
  );
};
```

**Chức năng:**
- Lấy mapping từ Redux store: `getNodes()`
- Kiểm tra xem có mapping cho `nameNode` không
- Nếu có, render `Product` component với `productAssetId`

**Kết quả:**
- Product component được render với `productAssetId = "rallyboard-mount-asset-1"`

---

### Bước 8: Product Component - Load GLB File

**File:** `src/components/Assets/Product.tsx`

```typescript
export const Product: React.FC<ProductProps> = ({
  parentNode,
  productAssetId,
  configuration,
  nameNode,
}) => {
  // ⭐ BƯỚC 8: Load GLB asset từ assetId
  const productGltf = useAsset({ assetId: productAssetId, configuration });
  // productAssetId = "rallyboard-mount-asset-1"
  // → resolveAssetPath("rallyboard-mount-asset-1") → "/assets/models/..."
  // → useLocalAsset("/assets/models/...") → load GLB file

  // Render GLB model tại placement node
  return (
    <group
      name={generateName(nameNode, parentNode)}
      position={parentNode.position}
      scale={parentNode.scale}
      rotation={parentNode.rotation}
    >
      <GLTFNode
        threeNode={productGltf.scene.clone()}
        nodeMatchers={ProductsNodes()}
      />
    </group>
  );
};
```

**Chức năng:**
- Load GLB asset từ `productAssetId`
- `resolveAssetPath(productAssetId)` → file path: `/assets/models/...`
- `useLocalAsset(filePath)` → load GLB file
- Render GLB model tại placement node

**Kết quả:**
- GLB file được load
- Device được render trong 3D scene tại placement node

---

## Tóm Tắt Flow Hoàn Chỉnh

```
1. Register card vào Redux store
   ↓
2. Card được hiển thị trong UI
   ↓
3. User click card
   ↓
4. app.addItemConfiguration() được gọi
   ↓
5. Action ADD_ACTIVE_CARD được dispatch
   ↓
6. Middleware xử lý action
   ↓
7. updateNodesByConfiguration() map assetId → nodeName
   ↓
8. addElement() tìm element và lấy nodeName
   ↓
9. setElementByNameNode() update Redux store
   ↓
10. Redux store: { "RallyBoard_Mount": "rallyboard-mount-asset-1" }
   ↓
11. ProductNode detect mapping và render Product
   ↓
12. Product component load GLB file
   ↓
13. Device hiển thị trong 3D scene! ✅
```

---

## Các File Quan Trọng

1. **`ConfigurationFormForStep.tsx`** - Hiển thị cards trong UI
2. **`CardItem.tsx`** - Xử lý click event
3. **`middleware/index.ts`** - Xử lý action ADD_ACTIVE_CARD
4. **`handlers.ts`** - updateNodesByConfiguration(), addElement(), setElementByNameNode()
5. **`ProductNode.tsx`** - Detect mapping và render Product
6. **`Product.tsx`** - Load GLB file và render device

---

## Lưu Ý Quan Trọng

- ⚠️ **Card phải được register vào Redux store** trước khi user có thể tương tác
- ⚠️ **Element phải tồn tại** với `element.name = card.keyPermission`
- ⚠️ **Placement node phải tồn tại** trong GLTF scene với tên matching `nodeName`
- ⚠️ **AssetId phải có trong LOCAL_ASSET_MAPPING** để load GLB file
- ✅ **Mapping `{ nodeName: assetId }`** là key để render device đúng vị trí

**Lưu ý quan trọng:**
- ⚠️ **Mỗi device cần 1 card riêng** - không thể dùng chung card
- ⚠️ `assetId` phải khớp với key trong `LOCAL_ASSET_MAPPING`
- ⚠️ `keyPermission` phải khớp với `element.name` trong configurator
- ⚠️ Card phải được add vào đúng step (ví dụ: `StepName.ConferenceCamera`)
- ⚠️ Card phải được add vào Redux store trước khi user có thể chọn

---

### Bước 4: Kiểm Tra Product Component

**Mục đích:** Đảm bảo Product component có thể load local GLB

**File:** `src/components/Assets/Product.tsx`

**Cách làm:**
- Product component đã tự động detect local asset
- Sử dụng `resolveAssetPath()` để resolve assetId → path
- Sử dụng `isLocalAsset()` để check có phải local asset không
- Load qua `useLocalAsset()` nếu là local asset

**Lưu ý:**
- Product component đã được modify để support cả local và Threekit
- Không cần modify nếu chỉ thêm device mới

---

### Bước 5: Cấu Hình Device Processing (Nếu Cần)

**Mục đích:** Xử lý device sau khi load (scaling, centering, orientation)

**File:** `src/components/Assets/Product.tsx` (trong `useMemo`)

**Các bước xử lý:**
1. **Scaling:** Scale down nếu device quá lớn
2. **Centering:** Center device tại origin (pivot point = center)
3. **Orientation:** Rotate device để front face hướng về room front

**Lưu ý:**
- Chỉ cần xử lý nếu device có vấn đề về scale/position/rotation
- Có thể dùng `deviceOrientationUtils.ts` để orient device

---

## Tạo Hệ Thống Tổng Quát Cho Nhiều Device

### File 1: `src/utils/localAssetLoader.ts`

**Chức năng:**
- **`isLocalAsset(assetId: string): boolean`** - Check assetId có phải local path không
- **`resolveAssetPath(assetId: string): string`** - Resolve assetId → file path (từ mapping hoặc trực tiếp)
- **`useLocalAsset(assetPath: string): GLTFResult`** - Hook load GLB từ local file
- **`useThreekitAsset(...): GLTFResult | null`** - Hook load từ Threekit
- **`LOCAL_ASSET_MAPPING: Record<string, string>`** - Mapping assetId → file path

**Mục đích:**
- Load GLB từ local file hoặc Threekit
- Map assetId → file path
- Auto-detect local vs Threekit asset

---

### File 2: `src/utils/deviceRegistry.ts` (Tạo mới)

**Chức năng:**
- **`DeviceConfig`** - Type định nghĩa config cho device (scale, center, orientation, etc.)
- **`DEVICE_REGISTRY: Record<string, DeviceConfig>`** - Registry chứa config cho từng device
- **`getDeviceConfig(deviceId: string): DeviceConfig | null`** - Get config cho device
- **`registerDevice(deviceId: string, config: DeviceConfig): void`** - Register device config

**Mục đích:**
- Lưu trữ config cho từng device (scale factor, orientation, etc.)
- Tách biệt config khỏi code logic
- Dễ dàng thêm device mới chỉ cần thêm config

**Cấu trúc:**
```typescript
export interface DeviceConfig {
  assetId: string;              // AssetId trong LOCAL_ASSET_MAPPING
  scaleFactor?: number;         // Scale factor (default: 1)
  shouldCenter?: boolean;       // Center device tại origin (default: true)
  shouldOrient?: boolean;       // Orient device (default: true)
  deviceType?: DeviceType;      // Device type (RallyBoard, Camera, etc.)
  roomFrontDirection?: Vector3; // Room front direction (default: -Z)
  customProcessor?: (scene: Object3D) => Object3D; // Custom processor
}
```

---

### File 3: `src/utils/deviceProcessor.ts` (Tạo mới)

**Chức năng:**
- **`processDevice(scene: Object3D, config: DeviceConfig): Object3D`** - Process device theo config
- **`scaleDevice(scene: Object3D, scaleFactor: number): Object3D`** - Scale device
- **`centerDevice(scene: Object3D): Object3D`** - Center device tại origin
- **`orientDevice(scene: Object3D, config: DeviceConfig): Object3D`** - Orient device

**Mục đích:**
- Xử lý device sau khi load (scaling, centering, orientation)
- Tách biệt logic xử lý khỏi Product component
- Tái sử dụng cho nhiều device

**Lưu ý:**
- Sử dụng `deviceOrientationUtils.ts` để orient device
- Có thể extend để support custom processor

---

### File 4: `src/utils/deviceCardConfig.ts` (Tạo mới) ⭐

**Chức năng:**
- **`DeviceCardConfig`** - Interface định nghĩa config cho device card
- **`createDeviceCard(config: DeviceCardConfig): CardI`** - Tạo card từ config
- **`registerDeviceCard(store: Store, config: DeviceCardConfig): void`** - Register card vào store
- **`registerDeviceCards(store: Store, configs: DeviceCardConfig[]): void`** - Register nhiều cards
- **`registerDevicesFromConfig(store: Store, devices: DeviceCardConfig[]): void`** - Register từ JSON config

**Mục đích:**
- Tạo card cho device từ JSON config (không cần viết code)
- Register card vào Redux store tự động
- Tách biệt logic tạo card khỏi handlers.ts
- Dễ dàng thêm/sửa/xóa device chỉ cần sửa JSON

**Cách sử dụng:**
```typescript
// Cách 1: Từ JSON config file
import deviceCardsConfig from '../config/deviceCards.json';
import { registerDevicesFromConfig } from '../utils/deviceCardConfig';

registerDevicesFromConfig(store, deviceCardsConfig.devices);

// Cách 2: Từ config object
import { registerDeviceCard } from '../utils/deviceCardConfig';

registerDeviceCard(store, {
  deviceId: "rallyboard-mount",
  keyPermission: "RallyBoard",
  step: StepName.ConferenceCamera,
  assetId: "rallyboard-mount-asset-1",
  attributeName: "RallyBoard",
  counter: { min: 0, max: 1 },
});
```

**Lưu ý:**
- File này đã được tạo sẵn - không cần tạo mới
- Có thể dùng JSON config hoặc config object
- Tự động tạo card và add vào Redux store

---

### File 5: `src/config/deviceCards.json` (Tạo mới) ⭐

**Chức năng:**
- Chứa config cho tất cả device cards (JSON format)
- Có thể load từ file thay vì hardcode trong code

**Mục đích:**
- Dễ dàng thêm/sửa device card config mà không cần modify code
- Tất cả devices ở một nơi - dễ maintain
- Có thể load từ API hoặc file

**Cấu trúc:**
```json
{
  "devices": [
    {
      "deviceId": "rallyboard-mount",
      "keyPermission": "RallyBoard",
      "step": "Conference Camera",
      "assetId": "rallyboard-mount-asset-1",
      "attributeName": "RallyBoard",
      "counter": {
        "min": 0,
        "max": 1
      },
      "image": "/images/products/rallyboard.jpg",
      "subtitle": "RallyBoard",
      "description": "RallyBoard display for wall mounting"
    },
    {
      "deviceId": "device-2",
      "keyPermission": "Device2",
      "step": "Conference Camera",
      "assetId": "device-2-asset-1",
      "attributeName": "Device2",
      "counter": {
        "min": 0,
        "max": 1
      },
      "image": "/images/products/device-2.jpg"
    }
  ]
}
```

**Lưu ý quan trọng:**
- ⚠️ **Trong JSON config KHÔNG cần có `dataThreekit`** - function `createDeviceCard()` sẽ tự động tạo
- ✅ Function `createDeviceCard()` tự động tạo `dataThreekit` từ các field:
  - `attributeName` → `dataThreekit.attributeName`
  - `assetId` + `keyPermission` → `dataThreekit.threekitItems[keyPermission]`
- ✅ **Các field bắt buộc trong JSON:**
  - `deviceId`: Unique device ID
  - `keyPermission`: Key permission (must match element.name)
  - `step`: Step name
  - `assetId`: Asset ID (key in LOCAL_ASSET_MAPPING)
  - `attributeName`: Attribute name
- ✅ **Các field optional trong JSON:**
  - `counter`: Counter configuration (min, max)
  - `image`: Image path
  - `logo`: Logo path
  - `subtitle`: Subtitle
  - `description`: Description

**Lưu ý về Image:**
- ⚠️ **Image KHÔNG lưu trong `public/assets/models/`**
- ✅ **Image lưu trong `public/images/`** (hoặc subfolder như `public/images/products/`)
- ✅ Image path trong JSON: `/images/products/rallyboard.jpg`
- ✅ Image file path thực tế: `public/images/products/rallyboard.jpg`
- ✅ Image dùng để hiển thị trong UI (card image), không phải 3D model

**Lưu ý về `dataThreekit`:**
- ⚠️ **Trong JSON config KHÔNG cần có `dataThreekit`** - function `createDeviceCard()` sẽ tự động tạo
- ✅ Function `createDeviceCard()` tự động tạo `dataThreekit` từ các field khác:
  - `attributeName` → `dataThreekit.attributeName`
  - `assetId` + `keyPermission` → `dataThreekit.threekitItems[keyPermission]`
- ✅ **`dataThreekit` là BẮT BUỘC trong Card object** (không thể thiếu)
- ✅ Nếu thiếu `dataThreekit` trong Card object, sẽ lỗi khi:
  - `getAssetFromCard()` - không có `threekitItems` để lookup assetId
  - `CardItem` component - không có `attributeName` để gọi `app.addItemConfiguration()`
  - `PrepareCardContainer` component - không có `attributeName` và `threekitItems`
  - Middleware - không có `attributeName` để check Threekit attribute

**Lưu ý:**
- File này đã được tạo sẵn - chỉ cần thêm devices vào
- `step` có thể là string (ví dụ: "Conference Camera") hoặc StepName enum
- `assetId` phải khớp với key trong `LOCAL_ASSET_MAPPING`
- **Image path:**
  - Image **KHÔNG lưu trong `public/assets/models/`** (đó là nơi lưu GLB files)
  - Image **lưu trong `public/images/`** (hoặc subfolder như `public/images/products/`)
  - Image path trong JSON: `/images/products/rallyboard.jpg`
  - Image file path thực tế: `public/images/products/rallyboard.jpg`
  - Nếu folder `products/` chưa có, cần tạo folder này trong `public/images/`
- **`dataThreekit` trong JSON:**
  - **KHÔNG cần có trong JSON config** - function tự động tạo từ các field khác
  - Function `createDeviceCard()` tự động tạo `dataThreekit` từ `assetId`, `attributeName`, `keyPermission`

---

## Tóm Tắt Các Bước

### Để Load GLB Device Không Dùng Threekit:

1. ✅ **Đặt file GLB vào `public/assets/models/`**
   - File GLB (3D model) lưu trong `public/assets/models/`
   - URL access: `/assets/models/device-name.glb`

2. ✅ **Đặt file Image vào `public/images/`** (nếu có)
   - Image (hình ảnh card) lưu trong `public/images/` (hoặc subfolder như `public/images/products/`)
   - URL access: `/images/products/device-name.jpg`
   - **Image KHÔNG lưu trong `public/assets/models/`** (đó là nơi lưu GLB files)

3. ✅ **Thêm mapping vào `LOCAL_ASSET_MAPPING` trong `localAssetLoader.ts`**
   - Map assetId → file path GLB

4. ✅ **Tạo card** (có 2 cách):
   - **Cách 1 (Thủ công):** Tạo function trong `handlers.ts` cho từng device
   - **Cách 2 (Tổng quát - Khuyến nghị):** Thêm device vào `deviceCards.json` và gọi `registerDevicesFromConfig()`

5. ✅ **Kiểm tra Product component có thể load local GLB** (đã có sẵn)

6. ✅ **Cấu hình device processing nếu cần** (scaling, centering, orientation)

---

### Để Tạo Hệ Thống Tổng Quát:

1. ✅ **File `localAssetLoader.ts`** - Load GLB từ local/Threekit, map assetId → path (đã có)
2. ✅ **File `deviceCardConfig.ts`** - Utility tạo card từ JSON config (đã tạo) ⭐
3. ✅ **File `deviceCards.json`** - JSON config cho device cards (đã tạo) ⭐
4. ✅ **File `deviceRegistry.ts`** (Tùy chọn) - Registry chứa config cho device processing
5. ✅ **File `deviceProcessor.ts`** (Tùy chọn) - Xử lý device (scaling, centering, orientation)

---

## Ưu Điểm Của Hệ Thống Tổng Quát

- ✅ **Dễ thêm device mới:** Chỉ cần thêm config, không cần modify code
- ✅ **Tách biệt concerns:** Logic, config, và UI tách biệt
- ✅ **Tái sử dụng:** Các utility functions có thể dùng cho nhiều device
- ✅ **Dễ maintain:** Config có thể load từ file hoặc API
- ✅ **Flexible:** Có thể support custom processor cho từng device

---

## Lưu Ý

### Về File GLB (3D Model):
- ⚠️ File GLB phải đặt trong `public/assets/models/` để có thể access qua URL
- ⚠️ URL access: `/assets/models/device-name.glb`
- ⚠️ File GLB dùng để render 3D model trong scene
- ⚠️ File GLB được load bởi `useLocalAsset()` hoặc `useThreekitAsset()`

### Về File Image (Card Image):
- ⚠️ **Image KHÔNG lưu trong `public/assets/models/`** (đó là nơi lưu GLB files)
- ⚠️ **Image lưu trong `public/images/`** (hoặc subfolder như `public/images/products/`)
- ⚠️ URL access: `/images/products/device-name.jpg`
- ⚠️ Image dùng để hiển thị trong UI (card image), không phải 3D model
- ⚠️ Image là optional (có thể không có), nhưng nên có để hiển thị trong UI
- ⚠️ Nếu folder `products/` chưa có, cần tạo folder này trong `public/images/`
- ⚠️ Image được hiển thị trong Card component (UI), không được load bởi `useLocalAsset()`

### So Sánh GLB và Image:

| Đặc điểm | GLB File (3D Model) | Image File (Card Image) |
|----------|-------------------|------------------------|
| **Loại file** | 3D model (`.glb`) | Hình ảnh (`.jpg`, `.png`) |
| **Lưu ở đâu** | `public/assets/models/` | `public/images/` (hoặc subfolder) |
| **URL access** | `/assets/models/device.glb` | `/images/products/device.jpg` |
| **Dùng để làm gì** | Render 3D model trong scene | Hiển thị trong UI (card image) |
| **Được load bởi** | `useLocalAsset()` hoặc `useThreekitAsset()` | `<img src={image} />` trong Card component |
| **Bắt buộc** | ✅ Bắt buộc (để render device) | ❌ Optional (nhưng nên có) |

### Về Card Config:
- ⚠️ `assetId` trong card phải khớp với key trong `LOCAL_ASSET_MAPPING`
- ⚠️ `keyPermission` trong card phải khớp với `element.name` trong configurator
- ⚠️ `image` path trong JSON: `/images/products/device-name.jpg`
- ⚠️ Image file path thực tế: `public/images/products/device-name.jpg`

### Về `dataThreekit`:
- ⚠️ **Trong JSON config KHÔNG cần có `dataThreekit`** - function `createDeviceCard()` sẽ tự động tạo
- ✅ Function `createDeviceCard()` tự động tạo `dataThreekit` từ các field:
  - `attributeName` → `dataThreekit.attributeName`
  - `assetId` + `keyPermission` → `dataThreekit.threekitItems[keyPermission]`
- ✅ **`dataThreekit` là BẮT BUỘC trong Card object** (không thể thiếu)
- ✅ **Nếu thiếu `dataThreekit` trong Card object, sẽ lỗi khi:**
  - `getAssetFromCard()` - không có `threekitItems` để lookup assetId
  - `CardItem` component - không có `attributeName` để gọi `app.addItemConfiguration()`
  - `PrepareCardContainer` component - không có `attributeName` và `threekitItems`
  - Middleware - không có `attributeName` để check Threekit attribute
- ✅ **Kết luận:** JSON config KHÔNG cần có `dataThreekit`, nhưng Card object PHẢI có `dataThreekit` (function tự động tạo)

### Về Device Processing:
- ⚠️ Device processing chỉ cần nếu device có vấn đề về scale/position/rotation
- ⚠️ Test kỹ sau khi thêm device mới (load, scale, position, rotation)

---

## Ví Dụ: Thêm Device Mới (Dùng JSON Config)

### Bước 1: Đặt file GLB
```
public/assets/models/new-device.glb
```

**Lưu ý:**
- File GLB (3D model) lưu trong `public/assets/models/`
- URL access: `/assets/models/new-device.glb`

### Bước 1.5: Đặt file Image (nếu có)
```
public/images/products/new-device.jpg
```

**Lưu ý:**
- Image (hình ảnh card) lưu trong `public/images/` (hoặc subfolder như `public/images/products/`)
- URL access: `/images/products/new-device.jpg`
- Nếu folder `products/` chưa có, cần tạo folder này trong `public/images/`
- Image dùng để hiển thị trong UI (card image), không phải 3D model
- Image **KHÔNG lưu trong `public/assets/models/`** (đó là nơi lưu GLB files)

### Bước 2: Thêm mapping
**File:** `src/utils/localAssetLoader.ts`
```typescript
export const LOCAL_ASSET_MAPPING: Record<string, string> = {
  "new-device-asset-id": "/assets/models/new-device.glb",
};
```

### Bước 3: Thêm device vào JSON config
**File:** `src/config/deviceCards.json`
```json
{
  "devices": [
    {
      "deviceId": "new-device",
      "keyPermission": "NewDevice",
      "step": "Conference Camera",
      "assetId": "new-device-asset-id",
      "attributeName": "NewDevice",
      "counter": {
        "min": 0,
        "max": 1
      },
      "image": "/images/products/new-device.jpg",
      "subtitle": "New Device",
      "description": "New device description"
    }
  ]
}
```

**Lưu ý về Image:**
- `image` path trong JSON: `/images/products/new-device.jpg`
- Image file path thực tế: `public/images/products/new-device.jpg`
- Image **KHÔNG lưu trong `public/assets/models/`** (đó là nơi lưu GLB files)
- Image là optional (có thể không có), nhưng nên có để hiển thị trong UI

**Lưu ý về `dataThreekit`:**
- ⚠️ **Trong JSON config KHÔNG cần có `dataThreekit`** - function `createDeviceCard()` sẽ tự động tạo
- ✅ Function `createDeviceCard()` tự động tạo `dataThreekit` từ các field:
  - `attributeName: "NewDevice"` → `dataThreekit.attributeName = "NewDevice"`
  - `assetId: "new-device-asset-id"` + `keyPermission: "NewDevice"` → `dataThreekit.threekitItems["NewDevice"] = { id: "new-device-asset-id", ... }`
- ✅ **Kết quả:** Card object sẽ có `dataThreekit` đầy đủ, không cần khai báo trong JSON

### Bước 4: Import và register (đã có trong handlers.ts)
**File:** `src/store/slices/ui/handlers/handlers.ts`
```typescript
// Đã có sẵn trong handlers.ts, không cần thêm code:
import deviceCardsConfig from '../../config/deviceCards.json';
import { registerDevicesFromConfig } from '../../../utils/deviceCardConfig';

app.eventEmitter.on("threekitDataInitialized", (configurator: Configurator) => {
  // ... existing code ...
  
  // Register device cards from JSON config (đã có sẵn)
  registerDevicesFromConfig(store, deviceCardsConfig.devices);
});
```

### Bước 5: Test
- Chọn device từ UI
- Kiểm tra load, scale, position, rotation
- Debug nếu có lỗi

---

## Ví Dụ: Thêm Device Mới (Dùng Config Object)

Nếu không muốn dùng JSON, có thể dùng config object trực tiếp:

### Bước 1-2: Giống như trên (đặt file GLB và thêm mapping)

### Bước 3: Register device trong handlers.ts
**File:** `src/store/slices/ui/handlers/handlers.ts`
```typescript
import { registerDeviceCard } from '../../../utils/deviceCardConfig';
import { StepName } from '../../../utils/baseUtils';

// Trong function getUiHandlers hoặc event handler
app.eventEmitter.on("threekitDataInitialized", (configurator: Configurator) => {
  // ... existing code ...
  
  // Register device card từ config object
  registerDeviceCard(store, {
    deviceId: "new-device",
    keyPermission: "NewDevice",
    step: StepName.ConferenceCamera,
    assetId: "new-device-asset-id",
    attributeName: "NewDevice",
    counter: {
      min: 0,
      max: 1,
    },
    image: "/images/products/new-device.jpg",
    subtitle: "New Device",
    description: "New device description",
  });
});
```

**Lưu ý về `dataThreekit`:**
- ⚠️ **KHÔNG cần có `dataThreekit` trong config object** - function `createDeviceCard()` sẽ tự động tạo
- ✅ Function `createDeviceCard()` tự động tạo `dataThreekit` từ các field:
  - `attributeName: "NewDevice"` → `dataThreekit.attributeName = "NewDevice"`
  - `assetId: "new-device-asset-id"` + `keyPermission: "NewDevice"` → `dataThreekit.threekitItems["NewDevice"] = { id: "new-device-asset-id", ... }`
- ✅ **Kết quả:** Card object sẽ có `dataThreekit` đầy đủ, không cần khai báo trong config

---

## Giải Thích: Tại Sao JSON Config Không Cần `dataThreekit`?

### Câu Hỏi:
Trong file JSON không có cụm `dataThreekit` thì khi render tạo card có ảnh hưởng gì không?

### Trả Lời:
✅ **KHÔNG ảnh hưởng gì** - function `createDeviceCard()` sẽ tự động tạo `dataThreekit` từ các field khác.

### Giải Thích:

**1. Trong JSON config KHÔNG cần có `dataThreekit`:**
- JSON config chỉ cần các field cơ bản: `deviceId`, `keyPermission`, `step`, `assetId`, `attributeName`
- Function `createDeviceCard()` sẽ tự động tạo `dataThreekit` từ các field này

**2. Function `createDeviceCard()` tự động tạo `dataThreekit`:**
```typescript
// deviceCardConfig.ts
export function createDeviceCard(config: DeviceCardConfig): CardI {
  const valueAssetState = createValueAssetState(config);
  
  const card: CardI = {
    key: step,
    keyPermission: config.keyPermission,
    dataThreekit: {  // ⭐ Tự động tạo từ config
      attributeName: config.attributeName,  // ⭐ Từ config.attributeName
      threekitItems: {
        [config.keyPermission]: valueAssetState,  // ⭐ Từ config.assetId + keyPermission
      },
    },
    // ...
  };
  
  return card;
}
```

**3. Mapping từ config → `dataThreekit`:**
```typescript
// JSON config:
{
  "attributeName": "RallyBoard",
  "assetId": "rallyboard-mount-asset-1",
  "keyPermission": "RallyBoard",
}

// → Function tạo:
dataThreekit: {
  attributeName: "RallyBoard",  // ⭐ Từ config.attributeName
  threekitItems: {
    "RallyBoard": {  // ⭐ Key từ config.keyPermission
      id: "rallyboard-mount-asset-1",  // ⭐ Từ config.assetId
      assetId: "rallyboard-mount-asset-1",
      key: "RallyBoard",
      name: "RallyBoard",
      // ...
    },
  },
}
```

**4. `dataThreekit` là BẮT BUỘC trong Card object:**
- Card interface (`CardI`) có `dataThreekit: { attributeName: string; threekitItems: ... }` - không có `?` nghĩa là bắt buộc
- Nếu thiếu `dataThreekit` trong Card object, sẽ lỗi TypeScript và runtime

**5. Nếu thiếu `dataThreekit` trong Card object, sẽ lỗi khi:**
- `getAssetFromCard()` - không có `threekitItems` để lookup assetId
- `CardItem` component - không có `attributeName` để gọi `app.addItemConfiguration()`
- `PrepareCardContainer` component - không có `attributeName` và `threekitItems`
- Middleware - không có `attributeName` để check Threekit attribute

**6. Kết luận:**
- ✅ **JSON config KHÔNG cần có `dataThreekit`** - function tự động tạo
- ✅ **Card object PHẢI có `dataThreekit`** - function tự động tạo từ config
- ✅ **Không ảnh hưởng gì** - function tự động tạo `dataThreekit` đầy đủ
- ✅ **Chỉ cần đảm bảo các field cần thiết:** `assetId`, `attributeName`, `keyPermission`

---

## Kết Luận

Với hệ thống tổng quát này, bạn có thể:
- ✅ Load GLB device từ local file (không cần Threekit)
- ✅ Dễ dàng thêm device mới chỉ cần thêm config
- ✅ Tách biệt logic, config, và UI
- ✅ Tái sử dụng code cho nhiều device
- ✅ Dễ maintain và extend

