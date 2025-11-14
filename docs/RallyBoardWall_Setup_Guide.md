# Hướng Dẫn: Setup RallyBoardWall với Tap_Placement_Wall_1

## Tổng Quan

RallyBoardWall là một variant mới của RallyBoard, sử dụng file GLB `RallyBoard65_CredenzaFeet_CameraBelow-compressed.glb` và được gắn vào placement node có sẵn `Tap_Placement_Wall_1` trong GLTF scene.

## Khác Biệt với RallyBoard Hiện Tại

| | RallyBoard | RallyBoardWall |
|---|-----------|----------------|
| **Placement Node** | `RallyBoard_Mount` (tạo động) | `Tap_Placement_Wall_1` (có sẵn) |
| **File GLB** | `RallyBoard65_Standalone-compressed.glb` | `RallyBoard65_CredenzaFeet_CameraBelow-compressed.glb` |
| **KeyPermission** | `CameraName.RallyBoard` | `"RallyBoardWall"` |
| **AssetId** | `"rallyboard-mount-asset-1"` | `"rallyboard-wall-tap-asset-1"` |
| **Vị trí** | Tạo động dựa trên TV mesh | Sử dụng placement node có sẵn |

## Các Bước Setup

### 1. Thêm Mapping cho File GLB Mới

**File:** `src/utils/localAssetLoader.ts`

```typescript
export const LOCAL_ASSET_MAPPING: Record<string, string> = {
  // ... existing mappings ...
  
  // RallyBoard case 4: on wall with Tap_Placement_Wall_1
  "rallyboard-wall-tap-asset-1":
    "/assets/models/RallyBoard65_CredenzaFeet_CameraBelow-compressed.glb",
};
```

**Lưu ý:**
- File GLB phải nằm trong `public/assets/models/`
- AssetId `"rallyboard-wall-tap-asset-1"` được dùng trong Card config

### 2. Tạo Element Mới cho RallyBoardWall

**File:** `src/utils/permissionUtils.ts`

```typescript
// RallyBoardWall: RallyBoard on wall using Tap_Placement_Wall_1
const groupRallyBoardWall = new GroupElement().addElement(
  new ItemElement("RallyBoardWall").setDefaultMount(
    new MountElement(
      "RallyBoardWall",
      PlacementManager.getNameNodeForTap("Wall", 1) // Tap_Placement_Wall_1
    )
  )
);

stepConferenceCamera.allElements = [
  // ... existing elements ...
  groupRallyBoard,
  groupRallyBoardWall, // ⭐ Thêm vào step
];
```

**Lưu ý:**
- `keyPermission` là `"RallyBoardWall"` (string literal, không dùng enum)
- `defaultMount` trỏ đến `Tap_Placement_Wall_1` (có sẵn trong GLTF)
- Element được thêm vào `stepConferenceCamera.allElements`

### 3. Tạo Card Mới cho RallyBoardWall

**File:** `src/store/slices/ui/handlers/handlers.ts`

```typescript
/**
 * Add RallyBoardWall card with local GLB assetId
 * This card uses RallyBoard65_CredenzaFeet_CameraBelow-compressed.glb
 * and mounts to Tap_Placement_Wall_1 (existing placement node in GLTF)
 */
function addRallyBoardWallCard(store: Store) {
  const rallyBoardWallCard: CardI = {
    key: StepName.ConferenceCamera,
    keyPermission: "RallyBoardWall", // ⭐ KeyPermission mới
    dataThreekit: {
      attributeName: "RallyBoardWall",
      threekitItems: {
        RallyBoardWall: {
          id: "rallyboard-wall-tap-asset-1", // ⭐ Key trong LOCAL_ASSET_MAPPING
          assetId: "rallyboard-wall-tap-asset-1",
          key: "RallyBoardWall",
          name: "RallyBoardWall",
          type: "asset",
          // ... other properties ...
        },
      },
    },
    counter: {
      min: 0,
      max: 1,
      threekit: {
        key: "",
      },
    },
  };

  // Get existing cards from step and add RallyBoardWall card
  const state = store.getState();
  const stepData = state.ui.stepData[StepName.ConferenceCamera];
  if (stepData) {
    // Merge RallyBoardWall card with existing cards
    const existingCards = { ...stepData.cards };
    existingCards["RallyBoardWall"] = rallyBoardWallCard;
    
    // Convert to array and sort cards
    const cardsArray = Object.values(existingCards);
    const sortedKeyPermissions = getSortedKeyPermissionsByStep(StepName.ConferenceCamera)(store);
    const sortedCards = sortedCardsByArrTemplate(cardsArray, sortedKeyPermissions);
    
    // Convert back to Record format
    const sortedCardsRecord = sortedCards.reduce((acc, card) => {
      acc[card.keyPermission] = card;
      return acc;
    }, {} as Record<string, CardI>);
    
    // Update step with all cards including RallyBoardWall (sorted)
    store.dispatch(
      setDataCardsStep({
        step: StepName.ConferenceCamera,
        cards: sortedCardsRecord,
      })
    );
    
    // Create item for RallyBoardWall
    store.dispatch(
      createItem({
        step: StepName.ConferenceCamera,
        keyItemPermission: "RallyBoardWall",
      })
    );
  }
}
```

**Lưu ý:**
- `keyPermission` phải khớp với Element (`"RallyBoardWall"`)
- `assetId` phải khớp với key trong `LOCAL_ASSET_MAPPING`
- Card được thêm vào `stepConferenceCamera.cards`

### 4. Gọi Hàm addRallyBoardWallCard trong setCameraData

**File:** `src/store/slices/ui/handlers/handlers.ts`

```typescript
function setCameraData(configurator: Configurator) {
  return (store: Store) => {
    setStepData(
      configurator,
      store,
      StepName.ConferenceCamera,
      Configurator.CameraName
    );
    
    // Add RallyBoard card manually for local GLB loading
    addRallyBoardCard(store);
    // Add RallyBoardWall card for Tap_Placement_Wall_1
    addRallyBoardWallCard(store); // ⭐ Thêm vào đây
  };
}
```

**Lưu ý:**
- Hàm được gọi khi app khởi động
- Card được thêm vào Redux store

## Flow Khi User Chọn RallyBoardWall

```
1. User click → CardItem.tsx
   ↓
2. app.addItemConfiguration(
     attributeName,        // "RallyBoardWall"
     assetId,              // "rallyboard-wall-tap-asset-1"
     keyPermission         // "RallyBoardWall"
   )
   ↓
3. Application.executeCommand(AddItemCommand)
   ↓
4. Redux middleware → addElement(card, stepName)
   ↓
5. Element = step.getElementByName("RallyBoardWall")
   → ItemElement với defaultMount trỏ đến Tap_Placement_Wall_1
   ↓
6. setElementByNameNode(
     "rallyboard-wall-tap-asset-1",
     "Tap_Placement_Wall_1"
   )
   ↓
7. Redux Store Update:
   nodes["Tap_Placement_Wall_1"] = "rallyboard-wall-tap-asset-1"
   ↓
8. ProductNode Re-render
   ↓
9. ProductNode thấy có mapping → render Product
   ↓
10. Product load GLB từ local file:
    "/assets/models/RallyBoard65_CredenzaFeet_CameraBelow-compressed.glb"
    ↓
11. Render tại placement node "Tap_Placement_Wall_1" (có sẵn trong GLTF)
    ↓
12. ✅ RallyBoardWall hiển thị tại Tap_Placement_Wall_1!
```

## Kiểm Tra Placement Node

### Cách Kiểm Tra Placement Node Có Sẵn

**File:** `src/components/Assets/Room.tsx`

```typescript
useEffect(() => {
  if (!gltf) return;

  // Kiểm tra xem Tap_Placement_Wall_1 có sẵn không
  let tapPlacementWall1: THREE.Object3D | null = null;
  gltf.scene.traverse((node) => {
    if (node.name === "Tap_Placement_Wall_1") {
      tapPlacementWall1 = node;
      console.log("✅ [Room] Tap_Placement_Wall_1 found:", {
        name: node.name,
        position: node.position,
        rotation: node.rotation,
        scale: node.scale,
      });
    }
  });

  if (!tapPlacementWall1) {
    console.warn("⚠️ [Room] Tap_Placement_Wall_1 not found in GLTF scene");
  }
}, [gltf]);
```

**Lưu ý:**
- Placement node `Tap_Placement_Wall_1` phải có sẵn trong GLTF scene
- Nếu không có, cần yêu cầu designer thêm vào GLTF file

## Điều Chỉnh Scale/Size

### Vấn Đề: Item Quá Nhỏ Hoặc Quá Lớn

Code hiện tại đã tự động xử lý scale cho RallyBoardWall trong `Product.tsx`:

**File:** `src/components/Assets/Product.tsx`

```typescript
// Check if this is a RallyBoard variant (by nameNode or assetId)
const isRallyBoardMount = nameNode === "RallyBoard_Mount";
const isRallyBoardWall = nameNode === "Tap_Placement_Wall_1";
const assetIdLower = (productAssetId || "").toLowerCase();
const resolvedIdLower = (resolvedAssetId || "").toLowerCase();
const isRallyBoardAsset =
  assetIdLower.includes("rallyboard") ||
  resolvedIdLower.includes("rallyboard");

// Process for RallyBoard variants
if (isRallyBoardMount || isRallyBoardWall || isRallyBoardAsset) {
  // Calculate bounding box
  const box = new THREE.Box3();
  box.setFromObject(clonedScene);
  const originalSize = box.getSize(new THREE.Vector3());
  const maxDimension = Math.max(originalSize.x, originalSize.y, originalSize.z);
  
  let scaleFactor = 1;
  if (maxDimension > 10) {
    // Scale down if too large (GLB is in cm, convert to meters)
    scaleFactor = 0.08; // cm to decimeters
    clonedScene.scale.multiplyScalar(scaleFactor);
  } else if (maxDimension < 0.5) {
    // Scale up if too small (GLB is already in meters but too small)
    scaleFactor = 2.0; // Scale up 2x
    clonedScene.scale.multiplyScalar(scaleFactor);
  }
  
  // Center at origin
  const centerAfterScale = boxAfterScale.getCenter(new THREE.Vector3());
  clonedScene.position.sub(centerAfterScale);
}
```

**Logic Scale:**
- **Nếu GLB > 10 units**: Scale down với `scaleFactor = 0.08` (GLB đang ở cm, chuyển sang meters)
- **Nếu GLB < 0.5 units**: Scale up với `scaleFactor = 2.0` (GLB đã ở meters nhưng quá nhỏ)
- **Nếu GLB trong khoảng 0.5 - 10 units**: Giữ nguyên scale (GLB đã đúng kích thước)

**Điều Chỉnh Scale Factor:**

Nếu item vẫn quá nhỏ hoặc quá lớn, điều chỉnh `scaleFactor` trong `Product.tsx`:

```typescript
// Tăng scale nếu item quá nhỏ
if (maxDimension > 10) {
  scaleFactor = 0.1; // Tăng từ 0.08 lên 0.1 (item sẽ lớn hơn)
  clonedScene.scale.multiplyScalar(scaleFactor);
} else if (maxDimension < 0.5) {
  scaleFactor = 3.0; // Tăng từ 2.0 lên 3.0 (item sẽ lớn hơn)
  clonedScene.scale.multiplyScalar(scaleFactor);
}
```

**Lưu ý:**
- Scale factor có thể cần điều chỉnh dựa trên kích thước thực tế của GLB
- Kiểm tra console logs để xem `originalSize` và `scaleFactor`
- Điều chỉnh từ từ (0.01 - 0.02 mỗi lần) để tìm scale phù hợp

## Troubleshooting

### 1. Item Không Hiển Thị

**Nguyên nhân có thể:**
- Placement node không tồn tại trong GLTF
- GLB file không được load đúng
- Scale quá nhỏ (nhỏ hơn 0.001 units)
- Item bị ẩn bởi object khác
- Item nằm ngoài camera view

**Cách kiểm tra:**
```typescript
// Trong Product.tsx, debug logs đã được thêm tự động
console.log("🔧 [Product] RallyBoard scene processed:", {
  nameNode,
  isRallyBoardMount,
  isRallyBoardWall,
  isRallyBoardAsset,
  originalSize: { x, y, z },
  maxDimension,
  scaleFactor,
  finalPosition: { x, y, z },
});
```

**Giải pháp:**
1. Kiểm tra console logs để xem `scaleFactor` và `maxDimension`
2. Nếu `maxDimension < 0.01` sau khi scale, tăng `scaleFactor`
3. Kiểm tra placement node có tồn tại trong GLTF không
4. Kiểm tra GLB file có được load đúng không

### 2. Item Quá Nhỏ

**Nguyên nhân:**
- GLB file có kích thước quá nhỏ (đã ở meters nhưng nhỏ hơn 0.5 units)
- Scale factor quá nhỏ (`scaleFactor = 0.08` có thể làm item quá nhỏ)

**Giải pháp:**
1. **Tăng scale factor cho item nhỏ:**
   ```typescript
   } else if (maxDimension < 0.5) {
     scaleFactor = 3.0; // Tăng từ 2.0 lên 3.0
     clonedScene.scale.multiplyScalar(scaleFactor);
   }
   ```

2. **Điều chỉnh scale factor cho item lớn:**
   ```typescript
   if (maxDimension > 10) {
     scaleFactor = 0.1; // Tăng từ 0.08 lên 0.1 (item sẽ lớn hơn)
     clonedScene.scale.multiplyScalar(scaleFactor);
   }
   ```

3. **Kiểm tra kích thước thực tế:**
   - Xem console logs để biết `originalSize`
   - Nếu `originalSize` quá nhỏ (< 0.1), có thể cần scale up nhiều hơn
   - Nếu `originalSize` quá lớn (> 100), có thể cần scale down nhiều hơn

### 3. Item Sai Vị Trí

**Giải pháp:**
- Kiểm tra placement node position trong GLTF
- Kiểm tra parent node transform
- Điều chỉnh offset nếu cần

## Kết Luận

RallyBoardWall là một variant mới của RallyBoard, sử dụng placement node có sẵn `Tap_Placement_Wall_1` thay vì tạo động như RallyBoard hiện tại. Điều này giúp đơn giản hóa code và tận dụng placement nodes có sẵn trong GLTF scene.

**Lợi ích:**
- ✅ Sử dụng placement node có sẵn (không cần tạo động)
- ✅ Không ảnh hưởng đến RallyBoard hiện tại
- ✅ Dễ dàng thêm variant mới
- ✅ Code sạch và dễ maintain

**Lưu ý:**
- Placement node `Tap_Placement_Wall_1` phải có sẵn trong GLTF
- File GLB phải nằm trong `public/assets/models/`
- Scale có thể cần điều chỉnh dựa trên kích thước thực tế

