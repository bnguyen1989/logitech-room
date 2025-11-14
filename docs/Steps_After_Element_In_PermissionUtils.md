# Các Bước Tiếp Theo Sau Khi Có Element Trong permissionUtils

## 📋 Tổng Quan

Sau khi đã tạo Element trong `permissionUtils.ts`, bạn cần thực hiện các bước sau để device hoạt động hoàn chỉnh:

1. ✅ **Element đã có trong permissionUtils** (đã làm)
2. ⭐ **Kiểm tra Card đã được register vào Redux chưa**
3. ⭐ **Kiểm tra Asset Mapping trong LOCAL_ASSET_MAPPING**
4. ⭐ **Đảm bảo Placement Node tồn tại trong Scene**
5. ⭐ **Test flow hoàn chỉnh**

---

## ✅ Bước 1: Kiểm Tra Element Đã Có Trong permissionUtils

### Đã Hoàn Thành

**File:** `src/utils/permissionUtils.ts` (dòng 499-504)

```typescript
// Register local GLB device elements from JSON config
registerDeviceElementsToStep(
  stepConferenceCamera,
  deviceElementsConfig.elements
);
```

**Kết quả:**
- ✅ Elements từ JSON config đã được tạo
- ✅ Elements đã được thêm vào `step.allElements`
- ✅ `step.getElementByName()` có thể tìm thấy elements

---

## ⭐ Bước 2: Kiểm Tra Card Đã Được Register Vào Redux Chưa

### Mục Đích

**Card** phải được register vào Redux store để:
- Hiển thị trong UI (danh sách sản phẩm)
- User có thể click để chọn device
- `getAssetFromCard()` có thể lấy assetId

### Kiểm Tra

**File:** `src/store/slices/ui/handlers/handlers.ts` (dòng 174)

```typescript
app.eventEmitter.on("threekitDataInitialized", (configurator: Configurator) => {
  // ... existing code ...
  
  // ⭐ Kiểm tra code này đã có chưa
  registerDevicesFromConfig(store, deviceCardsConfig.devices);
});
```

**Nếu chưa có:**
- Thêm import: `import deviceCardsConfig from "../../config/deviceCards.json";`
- Thêm import: `import { registerDevicesFromConfig } from "../../../../utils/deviceCardConfig";`
- Gọi function: `registerDevicesFromConfig(store, deviceCardsConfig.devices);`

### Kết Quả

Sau khi register:
- ✅ Cards được tạo từ JSON config
- ✅ Cards được thêm vào Redux store: `state.ui.stepData[step].cards`
- ✅ Cards hiển thị trong UI

---

## ⭐ Bước 3: Kiểm Tra Asset Mapping Trong LOCAL_ASSET_MAPPING

### Mục Đích

**LOCAL_ASSET_MAPPING** map `assetId` (từ card) → file path (GLB file) để load GLB từ local file.

### Kiểm Tra

**File:** `src/utils/localAssetLoader.ts` (dòng 93-108)

```typescript
export const LOCAL_ASSET_MAPPING: Record<string, string> = {
  // ⭐ Kiểm tra assetId từ deviceCards.json có trong mapping này không
  "rallyboard-mount-asset-1": "/assets/models/RallyBoard65_Standalone-compressed.glb",
  "rallyboard-credenza-asset-1": "/assets/models/rallyboard-credenza.glb",
  "rallyboard-floor-asset-1": "/assets/models/rallyboard-floor.glb",
  "rallyboard-floor-asset-2": "/assets/models/rallyboard-floor.glb",
  // ...
};
```

**Kiểm tra:**
- ✅ `assetId` từ `deviceCards.json` có trong `LOCAL_ASSET_MAPPING` không?
- ✅ File GLB có tồn tại tại path trong mapping không?
- ✅ Path đúng format: `/assets/models/...`

**Nếu thiếu:**
- Thêm entry vào `LOCAL_ASSET_MAPPING`
- Đảm bảo file GLB tồn tại tại path

---

## ⭐ Bước 4: Đảm Bảo Placement Node Tồn Tại Trong Scene

### Mục Đích

**Placement Node** phải tồn tại trong GLTF scene để ProductNode có thể render Product tại đúng vị trí.

### Có 2 Trường Hợp

#### Trường Hợp 1: Placement Node Có Sẵn Trong GLTF Scene

**Cách kiểm tra:**
- Mở GLTF scene trong Blender hoặc tool tương tự
- Tìm placement node với tên khớp với `nodeName` trong Element
- Ví dụ: `nodeName = "Tap_Placement_Wall_1"` → Tìm node `"Tap_Placement_Wall_1"` trong scene

**Nếu có:**
- ✅ Không cần làm gì thêm
- ✅ Placement node đã sẵn sàng

**Nếu không có:**
- ❌ Cần designer thêm placement node vào GLTF scene
- ❌ Hoặc tạo placement node động trong code (xem trường hợp 2)

---

#### Trường Hợp 2: Tạo Placement Node Động (Như RallyBoard_Mount)

**File:** `src/components/Assets/Room.tsx`

**Cách làm:**
```typescript
useEffect(() => {
  if (!gltf) return;

  // Tìm mesh có sẵn (ví dụ: TV mesh)
  const tvMesh = gltf.scene.getObjectByName("TV");
  if (!tvMesh) return;

  // Tạo placement node động
  const placementNode = new THREE.Object3D();
  placementNode.name = "RallyBoard_Mount";  // ⭐ nodeName khớp với Element
  
  // Tính toán position, rotation, scale dựa trên TV mesh
  placementNode.position.copy(tvMesh.position);
  // ... tính toán rotation, scale ...
  
  // Thêm vào scene
  gltf.scene.add(placementNode);
}, [gltf]);
```

**Kiểm tra:**
- ✅ Placement node được tạo với tên khớp với `nodeName` trong Element
- ✅ Placement node được thêm vào scene trước khi ProductNode render

---

## ⭐ Bước 5: Test Flow Hoàn Chỉnh

### Checklist Test

#### 1. Card Hiển Thị Trong UI

- [ ] Mở app trong browser
- [ ] Điều hướng đến step "Conference Camera"
- [ ] Kiểm tra card của device hiển thị trong danh sách sản phẩm
- [ ] Kiểm tra hình ảnh, tên, mô tả hiển thị đúng

#### 2. User Click Card

- [ ] Click card trong UI
- [ ] Kiểm tra card được đánh dấu là active (highlight)
- [ ] Kiểm tra console không có lỗi

#### 3. Element Được Tìm Thấy

- [ ] Mở DevTools → Console
- [ ] Click card
- [ ] Kiểm tra không có warning: `⚠️ Element not found: ...`
- [ ] Nếu có warning → Element chưa được tạo đúng

#### 4. Mapping Được Tạo Trong Redux

- [ ] Mở DevTools → Redux DevTools
- [ ] Click card
- [ ] Kiểm tra action `changeValueNodes` được dispatch
- [ ] Kiểm tra Redux state: `state.configurator.nodes` có mapping
- [ ] Ví dụ: `{ "RallyBoard_Mount": "rallyboard-mount-asset-1" }`

#### 5. Placement Node Được Tìm Thấy

- [ ] Mở DevTools → Console
- [ ] Click card
- [ ] Kiểm tra không có lỗi về placement node không tìm thấy
- [ ] Nếu có lỗi → Placement node chưa tồn tại trong scene

#### 6. GLB File Được Load

- [ ] Mở DevTools → Network tab
- [ ] Click card
- [ ] Kiểm tra request load GLB file (ví dụ: `/assets/models/RallyBoard65_Standalone-compressed.glb`)
- [ ] Kiểm tra response status = 200 (success)
- [ ] Nếu 404 → File GLB không tồn tại hoặc path sai

#### 7. Device Được Render Trong Scene

- [ ] Click card
- [ ] Kiểm tra device hiển thị trong 3D scene
- [ ] Kiểm tra device ở đúng vị trí (placement node)
- [ ] Kiểm tra device có scale, rotation đúng

---

## 🔍 Debug Nếu Có Vấn Đề

### Vấn Đề 1: Card Không Hiển Thị Trong UI

**Nguyên nhân:**
- Card chưa được register vào Redux
- `keyPermission` không khớp

**Giải pháp:**
- Kiểm tra `registerDevicesFromConfig()` đã được gọi chưa
- Kiểm tra `deviceCards.json` có đúng format không
- Kiểm tra Redux state: `state.ui.stepData[step].cards`

---

### Vấn Đề 2: Element Not Found

**Lỗi:**
```
⚠️ Element not found: RallyBoardMount
```

**Nguyên nhân:**
- Element chưa được tạo trong permissionUtils
- `keyPermission` không khớp giữa Card và Element

**Giải pháp:**
- Kiểm tra `registerDeviceElementsToStep()` đã được gọi chưa
- Kiểm tra `deviceElements.json` có đúng format không
- Kiểm tra `card.keyPermission` khớp với `element.name`

---

### Vấn Đề 3: Asset Not Found (404)

**Lỗi:**
```
GET /assets/models/rallyboard.glb 404 (Not Found)
```

**Nguyên nhân:**
- File GLB không tồn tại
- Path trong `LOCAL_ASSET_MAPPING` sai
- `assetId` không có trong `LOCAL_ASSET_MAPPING`

**Giải pháp:**
- Kiểm tra file GLB tồn tại tại path
- Kiểm tra `assetId` có trong `LOCAL_ASSET_MAPPING` không
- Kiểm tra path đúng format: `/assets/models/...`

---

### Vấn Đề 4: Placement Node Not Found

**Lỗi:**
- Device không hiển thị trong scene
- ProductNode không render Product

**Nguyên nhân:**
- Placement node không tồn tại trong GLTF scene
- `nodeName` không khớp với tên trong scene

**Giải pháp:**
- Kiểm tra GLTF scene có placement node với tên khớp không
- Kiểm tra `nodeName` trong Element khớp với tên trong scene
- Nếu tạo động, kiểm tra placement node được tạo trước khi ProductNode render

---

## 📊 Flow Hoàn Chỉnh

```
1. ✅ Element trong permissionUtils
   ↓
2. ✅ Card trong Redux (từ deviceCards.json)
   ↓
3. ✅ Asset Mapping trong LOCAL_ASSET_MAPPING
   ↓
4. ✅ Placement Node trong Scene
   ↓
5. User click Card
   ↓
6. getAssetFromCard(card) → assetId
   ↓
7. addElement(card) → element = step.getElementByName(keyPermission)
   ↓
8. element.getMount().getNameNode() → nodeName
   ↓
9. setElementByNameNode(assetId, nodeName)
   ↓
10. Redux Store: { nodeName: assetId }
   ↓
11. ProductNode tìm placement node → render Product
   ↓
12. Product load GLB từ assetId → resolveAssetPath() → LOCAL_ASSET_MAPPING
   ↓
13. Device hiển thị trong scene! ✅
```

---

## ✅ Checklist Tổng Quan

Sau khi có Element trong permissionUtils, kiểm tra:

- [ ] **Card đã được register vào Redux** (handlers.ts)
- [ ] **Asset Mapping đã có trong LOCAL_ASSET_MAPPING** (localAssetLoader.ts)
- [ ] **Placement Node tồn tại trong Scene** (có sẵn hoặc tạo động)
- [ ] **Test flow hoàn chỉnh** (card hiển thị → click → device render)

**Nếu tất cả đều ✅ → Device hoạt động!**

---

## 🎯 Tóm Tắt

Sau khi có Element trong permissionUtils, bạn cần:

1. **Kiểm tra Card đã register** - Để hiển thị trong UI
2. **Kiểm tra Asset Mapping** - Để load GLB file
3. **Kiểm tra Placement Node** - Để render device đúng vị trí
4. **Test flow hoàn chỉnh** - Để đảm bảo mọi thứ hoạt động

**Nếu thiếu bất kỳ bước nào → Device không hoạt động!**

