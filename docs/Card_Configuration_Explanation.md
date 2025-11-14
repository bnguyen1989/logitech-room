# Cấu Hình Card (Card Configuration) - Giải Thích

## 1. Card Dùng Để Làm Gì?

**Card** là đại diện UI cho một sản phẩm trong configurator. Card kết nối:
- **UI** (hiển thị trong danh sách sản phẩm)
- **Asset** (file GLB hoặc Threekit asset)
- **Element** (logic để đặt sản phẩm)

### 1.1. Chức Năng Chính của Card

1. **Hiển thị thông tin sản phẩm trong UI:**
   - Hình ảnh, tên, mô tả
   - Giá, SKU, màu sắc
   - Counter (số lượng)

2. **Lưu trữ assetId (file GLB hoặc Threekit asset):**
   - Card chứa `dataThreekit.threekitItems` với assetId
   - AssetId được dùng để load file GLB hoặc Threekit asset

3. **Kết nối với Element qua keyPermission:**
   - `card.keyPermission` khớp với `element.name`
   - Element quyết định placement node (đặt ở đâu)
   - Card quyết định assetId (dùng file nào)

### 1.2. Cấu Trúc Card

**File:** `src/store/slices/ui/type.ts`

```typescript
export interface CardI {
  key: StepName;              // Step mà card thuộc về (ví dụ: "ConferenceCamera")
  image?: string;             // Hình ảnh sản phẩm
  logo?: string;              // Logo
  subtitle?: string;          // Subtitle
  description?: string;       // Mô tả sản phẩm
  counter?: CounterI;         // Counter options (min, max)
  select?: SelectI;           // Select options
  keyPermission: string;      // ⭐ Identifier để kết nối với Element
  dataThreekit: {
    attributeName: string;    // Tên attribute trong Threekit
    threekitItems: Record<string, ValueAssetStateI>;  // ⭐ AssetId và metadata
  };
}
```

**Ví dụ Card:**
```typescript
const card: CardI = {
  key: StepName.ConferenceCamera,
  keyPermission: "RallyBoardWall",
  image: "/images/products/rallyboard-wall.jpg",
  subtitle: "RallyBoard for Wall",
  description: "RallyBoard display for wall mounting",
  counter: {
    min: 0,
    max: 1,
    threekit: { key: "" }
  },
  dataThreekit: {
    attributeName: "RallyBoardWall",
    threekitItems: {
      RallyBoardWall: {
        id: "rallyboard-wall-tap-asset-1",  // ⭐ AssetId
        assetId: "rallyboard-wall-tap-asset-1",
        key: "RallyBoardWall",
        name: "RallyBoardWall",
        type: "asset",
        // ... other properties ...
      }
    }
  }
};
```

---

## 2. Card Được Design Ở Đâu?

Cards có thể đến từ **2 nguồn**:

### 2.1. Cards Từ Threekit Configurator (Tự Động)

**Nguồn:** Threekit Platform

**Cách load:**
```typescript
// src/store/slices/ui/handlers/handlers.ts
function setCameraData(configurator: Configurator) {
  return (store: Store) => {
    // ⭐ Load cards từ Threekit configurator
    setStepData(
      configurator,          // Threekit configurator
      store,
      StepName.ConferenceCamera,
      Configurator.CameraName  // Array attributes từ Threekit
    );
  };
}
```

**setStepData() hoạt động:**
```typescript
function setStepData(
  configurator: Configurator,
  store: Store,
  stepName: StepName,
  arrayAttributes: Array<Array<string>>
) {
  const configuration = configurator.getConfiguration();
  
  // ⭐ Lấy data từ Threekit configurator
  const baseData = arrayAttributes.map(([name]) => {
    const value = configuration[name];
    if (!value || typeof value !== "object") return null;
    
    // Tạo card từ Threekit data
    return {
      key: stepName,
      keyPermission: name,  // keyPermission từ attribute name
      image: value.image,
      subtitle: value.subtitle,
      description: value.description,
      counter: value.counter,
      select: value.select,
      // ... other properties ...
    };
  });
  
  // Thêm cards vào Redux store
  store.dispatch(setDataCardsStep({
    step: stepName,
    cards: baseData.reduce((acc, card) => {
      if (card) {
        acc[card.keyPermission] = card;
      }
      return acc;
    }, {} as Record<string, CardI>)
  }));
}
```

**Flow:**
```
Threekit Configurator
  ↓ getConfiguration()
  → Configuration data (attributes, assets, etc.)
  ↓ setStepData()
  → Transform thành Card objects
  ↓ setDataCardsStep()
  → Redux store: stepData[stepName].cards
```

**Ưu điểm:**
- ✅ Tự động từ Threekit Platform
- ✅ Đồng bộ với Threekit assets
- ✅ Dễ maintain (chỉ cần cập nhật trên Threekit)

**Nhược điểm:**
- ❌ Cần Threekit account
- ❌ Cần internet để load

### 2.2. Cards Tạo Thủ Công (Manual)

**Nguồn:** Code trong `src/store/slices/ui/handlers/handlers.ts`

**Ví dụ: RallyBoard Card**
```typescript
// src/store/slices/ui/handlers/handlers.ts
function addRallyBoardCard(store: Store) {
  const rallyBoardCard: CardI = {
    key: StepName.ConferenceCamera,
    keyPermission: CameraName.RallyBoard,  // "RallyBoard"
    dataThreekit: {
      attributeName: "RallyBoard",
      threekitItems: {
        [CameraName.RallyBoard]: {
          id: "rallyboard-mount-asset-1",  // ⭐ Key trong LOCAL_ASSET_MAPPING
          assetId: "rallyboard-mount-asset-1",
          key: CameraName.RallyBoard,
          name: CameraName.RallyBoard,
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

  // Thêm card vào Redux store
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

**Flow:**
```
Code trong handlers.ts
  ↓ addRallyBoardCard()
  → Tạo Card object thủ công
  ↓ setDataCardsStep()
  → Redux store: stepData[stepName].cards
```

**Khi nào dùng:**
- ✅ Local GLB files (không có trong Threekit)
- ✅ Custom products (RallyBoard, RallyBoardWall)
- ✅ Products chưa có trên Threekit Platform

**Ưu điểm:**
- ✅ Hoạt động offline
- ✅ Không cần Threekit account
- ✅ Hoàn toàn control

**Nhược điểm:**
- ❌ Phải maintain trong code
- ❌ Không tự động sync với Threekit

---

## 3. Card Được Load Khi Nào?

### 3.1. Khi App Khởi Động

**File:** `src/store/slices/ui/handlers/handlers.ts`

```typescript
// Khi app khởi động, gọi các handler để load cards
app.eventEmitter.on("configuratorReady", () => {
  // Load cards từ Threekit configurator
  setCameraData(configurator)(store);
  setAudioExtensionsData(configurator)(store);
  setMeetingControllerData(configurator)(store);
  // ... other steps ...
  
  // Thêm custom cards (thủ công)
  addRallyBoardCard(store);
  addRallyBoardWallCard(store);
});
```

### 3.2. Khi Configurator Thay Đổi

**File:** `src/store/slices/ui/handlers/handlers.ts`

```typescript
// Khi Threekit configurator thay đổi, update cards
app.eventEmitter.on("configuratorChange", () => {
  updateDataCardByStepName(stepName)(store, configurator);
});
```

---

## 4. Card Được Sử Dụng Ở Đâu?

### 4.1. UI - Hiển Thị Danh Sách Sản Phẩm

**File:** `src/components/Cards/CardItem/CardItem.tsx`

```typescript
export const CardItem: React.FC<PropsI> = ({ keyItemPermission }) => {
  // Lấy card từ Redux store
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );
  
  // Hiển thị card trong UI
  return (
    <CardContainer onClick={handleClick}>
      <CardImage image={card.image} />
      <CardText title={title} subtitle={subtitle} />
      <CounterItem card={card} />
      <ColorSwitcherItem card={card} />
    </CardContainer>
  );
};
```

### 4.2. Logic - Load Asset Khi User Chọn

**File:** `src/components/Cards/CardItem/CardItem.tsx`

```typescript
const handleClick = () => {
  // Lấy assetId từ card
  const threekitAsset = getAssetFromCard(card)(state);
  
  // Gọi app.addItemConfiguration() với assetId
  app.addItemConfiguration(
    attributeName,        // "RallyBoardWall"
    threekitAsset.id,     // "rallyboard-wall-tap-asset-1" (assetId)
    card.keyPermission   // "RallyBoardWall"
  );
};
```

**Flow:**
```
User click Card
  ↓
getAssetFromCard(card)
  → assetId = "rallyboard-wall-tap-asset-1"
  ↓
app.addItemConfiguration(assetId, keyPermission)
  ↓
addElement(card, stepName)
  ↓
setElementByNameNode(assetId, nodeName)
  ↓
Redux store: { "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1" }
  ↓
ProductNode render Product với assetId
```

### 4.3. Order - Lưu Thông Tin Sản Phẩm

**File:** `src/store/slices/ui/selectors/selectorsOrder.ts`

```typescript
const getCardData = (state: RootState): CardDataI[] => {
  const selectedCards = getSelectedConfiguratorCards(state);
  
  return processCards(selectedCards)(state).map(({ card, selectData }) => {
    const cardAsset = getAssetFromCard(card)(state);
    const price = getPriceFromMetadataByKeyPermission(card.key, card.keyPermission)(state);
    const title = getTitleCardByKeyPermission(card.key, card.keyPermission)(state);
    
    return {
      metadata: {
        data: JSON.stringify(card),  // ⭐ Lưu card vào order
        title: title,
        description: description,
        sku: sku,
        price: price,
        count: selectData?.property?.count ?? 1,
      },
      configurationId: cardAsset?.id ?? "",
      count: 1,
    };
  });
};
```

---

## 5. Mối Quan Hệ: Card ↔ Element ↔ Placement Node

```
┌─────────────────────────────────────────────────────────────┐
│                         CARD                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ keyPermission: "RallyBoardWall"                       │  │
│  │ dataThreekit: {                                        │  │
│  │   threekitItems: {                                     │  │
│  │     RallyBoardWall: {                                  │  │
│  │       id: "rallyboard-wall-tap-asset-1"  ⭐ AssetId   │  │
│  │     }                                                  │  │
│  │   }                                                    │  │
│  │ }                                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    keyPermission
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                        ELEMENT                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ ItemElement("RallyBoardWall")                         │  │
│  │   .setDefaultMount(                                   │  │
│  │     MountElement(                                     │  │
│  │       "RallyBoardWall",                               │  │
│  │       "Tap_Placement_Wall_1"  ⭐ NodeName            │  │
│  │     )                                                 │  │
│  │   )                                                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    getNameNode()
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    PLACEMENT NODE                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ THREE.Object3D("Tap_Placement_Wall_1")                │  │
│  │   position: { x, y, z }                               │  │
│  │   rotation: { x, y, z }                               │  │
│  │   scale: { x, y, z }                                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Kết nối:**
```
1. Card.keyPermission = "RallyBoardWall"
   ↓
2. Element.name = "RallyBoardWall"  (khớp với Card.keyPermission)
   ↓
3. Element.getDefaultMount().getNameNode() = "Tap_Placement_Wall_1"
   ↓
4. Redux mapping: { "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1" }
   ↓
5. ProductNode render Product tại placement node với assetId
```

---

## 6. Tóm Tắt

### 6.1. Card Dùng Để Làm Gì?

1. **Hiển thị sản phẩm trong UI:**
   - Hình ảnh, tên, mô tả, giá
   - Counter, Select, Color options

2. **Lưu trữ assetId:**
   - File GLB hoặc Threekit asset ID
   - Dùng để load và render sản phẩm

3. **Kết nối với Element:**
   - `card.keyPermission` khớp với `element.name`
   - Element quyết định placement node
   - Card quyết định assetId

### 6.2. Card Được Design Ở Đâu?

**2 nguồn:**

1. **Threekit Configurator (Tự động):**
   - Load từ Threekit Platform
   - Qua `setStepData(configurator, ...)`
   - Tự động sync với Threekit assets

2. **Code (Thủ công):**
   - Tạo trong `handlers.ts`
   - Qua `addRallyBoardCard()`, `addRallyBoardWallCard()`
   - Cho local GLB files hoặc custom products

### 6.3. Flow Hoàn Chỉnh

```
Card được Design
  ↓
Threekit Platform hoặc Code
  ↓
setStepData() hoặc addCard()
  ↓
Redux Store: stepData[stepName].cards
  ↓
UI: CardItem component hiển thị
  ↓
User click Card
  ↓
getAssetFromCard() → assetId
  ↓
addElement(card) → element → mount.getNameNode() → nodeName
  ↓
setElementByNameNode(assetId, nodeName)
  ↓
Redux Store: { nodeName: assetId }
  ↓
ProductNode render Product với assetId tại placement node
```

---

## 7. Ví Dụ Cụ Thể: RallyBoardWall

### 7.1. Card được Tạo Thủ Công

```typescript
// handlers.ts
function addRallyBoardWallCard(store: Store) {
  const rallyBoardWallCard: CardI = {
    key: StepName.ConferenceCamera,
    keyPermission: "RallyBoardWall",
    dataThreekit: {
      attributeName: "RallyBoardWall",
      threekitItems: {
        RallyBoardWall: {
          id: "rallyboard-wall-tap-asset-1",  // ⭐ AssetId
          // ...
        },
      },
    },
  };
  
  // Thêm vào Redux store
  store.dispatch(setDataCardsStep({
    step: StepName.ConferenceCamera,
    cards: { ...existingCards, RallyBoardWall: rallyBoardWallCard },
  }));
}
```

### 7.2. Card được Hiển Thị trong UI

```typescript
// CardItem.tsx
const card = useAppSelector(
  getCardByKeyPermission(StepName.ConferenceCamera, "RallyBoardWall")
);
// card = { keyPermission: "RallyBoardWall", ... }

// Hiển thị trong UI
<CardContainer>
  <CardImage image={card.image} />
  <CardText title="RallyBoard Wall" />
</CardContainer>
```

### 7.3. User Click Card → Load Asset

```typescript
// CardItem.tsx
const handleClick = () => {
  const threekitAsset = getAssetFromCard(card)(state);
  // threekitAsset.id = "rallyboard-wall-tap-asset-1"
  
  app.addItemConfiguration(
    "RallyBoardWall",
    "rallyboard-wall-tap-asset-1",  // ⭐ AssetId
    "RallyBoardWall"
  );
};
```

### 7.4. AssetId được Map vào Redux Store

```typescript
// addElement() trong handlers.ts
const cardAsset = getAssetFromCard(card)(state);
// cardAsset.id = "rallyboard-wall-tap-asset-1"

const element = step.getElementByName("RallyBoardWall");
const nodeName = element.getDefaultMount().getNameNode();
// nodeName = "Tap_Placement_Wall_1"

setElementByNameNode(cardAsset.id, nodeName)(store);
// Redux: { "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1" }
```

---

## Kết Luận

**Card Configuration:**
- ✅ Hiển thị sản phẩm trong UI
- ✅ Lưu trữ assetId (file GLB hoặc Threekit asset)
- ✅ Kết nối với Element qua keyPermission

**Card được Design:**
- 🔄 **Tự động**: Từ Threekit Platform (qua `setStepData()`)
- ✏️ **Thủ công**: Trong code (qua `addCard()`)

**Card được sử dụng:**
- 📱 UI: Hiển thị danh sách sản phẩm
- 🔧 Logic: Load asset khi user chọn
- 💾 Order: Lưu thông tin sản phẩm

