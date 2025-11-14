# Các Bước Tiếp Theo Sau Khi Tạo Cấu Hình Card

## 📋 Tổng Quan

Sau khi tạo cấu hình card (trong `deviceCards.json` hoặc `handlers.ts`), bạn cần thực hiện **2 bước quan trọng** để device có thể hoạt động:

1. **Tạo Element trong Permission System** ⭐
2. **Đảm bảo Placement Node tồn tại trong Scene** ⭐

---

## ⚠️ Tại Sao Cần 2 Bước Này?

### Flow Hoạt Động:

```
User click Card
  ↓
getAssetFromCard(card) → assetId = "rallyboard-mount-asset-1"
  ↓
addElement(card) → Tìm element từ card.keyPermission
  ↓
element.getMount().getNameNode() → "RallyBoard_Mount" (nodeName)
  ↓
setElementByNameNode(assetId, nodeName)
  ↓
Redux Store: { "RallyBoard_Mount": "rallyboard-mount-asset-1" }
  ↓
ProductNode render Product tại placement node với assetId
```

**Vấn đề:**
- Nếu **không có Element** → `addElement()` không tìm thấy element → không có nodeName → không tạo mapping
- Nếu **không có Placement Node** → ProductNode không tìm thấy placement node → không render Product

---

## 🔧 Bước 1: Tạo Element Trong Permission System

### Mục Đích

**Element** kết nối:
- `card.keyPermission` (ví dụ: `"RallyBoard"`)
- `placement node name` (ví dụ: `"RallyBoard_Mount"`)

**Element làm gì?**
- Định nghĩa **logic placement** cho device
- Quyết định device được đặt ở **placement node nào** trong scene
- Chứa **business logic**: dependencies, conditions, rules

### File Cần Sửa

**File:** `src/utils/permissionUtils.ts`

### Cách Tạo Element

#### Ví Dụ 1: RallyBoard với Placement Node Có Sẵn

```typescript
// src/utils/permissionUtils.ts
import { ItemElement, MountElement, GroupElement } from '../models/permission/...';
import { PlacementManager } from '../models/configurator/PlacementManager';

// Tạo Element cho RallyBoard
const groupRallyBoard = new GroupElement().addElement(
  new ItemElement("RallyBoard")  // ⭐ keyPermission = "RallyBoard"
    .setDefaultMount(
      new MountElement(
        "RallyBoard",
        PlacementManager.getNameNodeForRallyBoardMount()  // → "RallyBoard_Mount"
      )
    )
);

// Thêm vào step
stepConferenceCamera.allElements = [
  // ... existing elements ...
  groupRallyBoard,  // ⭐ Thêm vào step
];
```

#### Ví Dụ 2: RallyBoardWall với Tap Placement Node

```typescript
// src/utils/permissionUtils.ts
const groupRallyBoardWall = new GroupElement().addElement(
  new ItemElement("RallyBoardWall")  // ⭐ keyPermission = "RallyBoardWall"
    .setDefaultMount(
      new MountElement(
        "RallyBoardWall",
        PlacementManager.getNameNodeForTap("Wall", 1)  // → "Tap_Placement_Wall_1"
      )
    )
);

stepConferenceCamera.allElements = [
  // ... existing elements ...
  groupRallyBoardWall,  // ⭐ Thêm vào step
];
```

#### Ví Dụ 3: Device Mới với Placement Node Tùy Chỉnh

```typescript
// src/utils/permissionUtils.ts
const groupNewDevice = new GroupElement().addElement(
  new ItemElement("NewDevice")  // ⭐ keyPermission = "NewDevice" (phải khớp với card.keyPermission)
    .setDefaultMount(
      new MountElement(
        "NewDevice",
        "Custom_Placement_Node_1"  // ⭐ nodeName (phải tồn tại trong GLTF scene)
      )
    )
);

stepConferenceCamera.allElements = [
  // ... existing elements ...
  groupNewDevice,  // ⭐ Thêm vào step
];
```

### Lưu Ý Quan Trọng

1. **`keyPermission` phải khớp:**
   - `card.keyPermission = "RallyBoard"`
   - `element.name = "RallyBoard"` ✅
   - Nếu không khớp → `addElement()` không tìm thấy element

2. **`nodeName` phải tồn tại trong GLTF scene:**
   - `nodeName = "RallyBoard_Mount"`
   - Placement node `"RallyBoard_Mount"` phải có trong GLTF scene ✅
   - Nếu không có → ProductNode không tìm thấy placement node

3. **Element phải được thêm vào step:**
   - `step.allElements = [...existingElements, newElement]`
   - Nếu không thêm → `step.getElementByName()` không tìm thấy element

---

## 🎯 Bước 2: Đảm Bảo Placement Node Tồn Tại Trong Scene

### Mục Đích

**Placement Node** là:
- `THREE.Object3D` trong GLTF scene
- Điểm đặt device trong 3D scene
- Có `position`, `rotation`, `scale`

**Placement Node làm gì?**
- Định nghĩa **vị trí** device trong scene
- Định nghĩa **hướng** device (rotation)
- Định nghĩa **kích thước** device (scale)

### Có 2 Trường Hợp

#### Trường Hợp 1: Placement Node Có Sẵn Trong GLTF Scene

**Cách làm:**
- Designer đã thêm placement node vào GLTF scene
- Placement node có tên (ví dụ: `"Tap_Placement_Wall_1"`)
- **Không cần code** - chỉ cần đảm bảo nodeName khớp

**Ví dụ:**
```typescript
// GLTF scene đã có:
// - Tap_Placement_Wall_1
// - Camera_Placement_1
// - Mic_Placement_1

// Element:
new MountElement("RallyBoardWall", "Tap_Placement_Wall_1")  // ✅ Node có sẵn
```

#### Trường Hợp 2: Tạo Placement Node Động (Như RallyBoard_Mount)

**Cách làm:**
- Tạo placement node trong code (trong `Room.tsx`)
- Tính toán vị trí dựa trên mesh có sẵn (ví dụ: TV mesh)
- Thêm placement node vào scene

**Ví dụ:**
```typescript
// src/components/Assets/Room.tsx
useEffect(() => {
  if (!gltf) return;

  // Tìm TV mesh
  const tvMesh = gltf.scene.getObjectByName("TV");
  if (!tvMesh) return;

  // Tính toán vị trí placement node
  const placementNode = new THREE.Object3D();
  placementNode.name = "RallyBoard_Mount";  // ⭐ nodeName
  placementNode.position.copy(tvMesh.position);
  // ... tính toán rotation, scale ...

  // Thêm vào scene
  gltf.scene.add(placementNode);
}, [gltf]);
```

**Lưu ý:**
- Placement node phải được tạo **trước khi** ProductNode render
- Placement node phải có **tên khớp** với `nodeName` trong Element

---

## 📝 Checklist Sau Khi Tạo Card

### ✅ Bước 1: Tạo Element

- [ ] Tạo `ItemElement` với `name = card.keyPermission`
- [ ] Tạo `MountElement` với `nodeName` (placement node name)
- [ ] Gọi `setDefaultMount()` để gắn MountElement vào ItemElement
- [ ] Thêm Element vào `step.allElements`
- [ ] Kiểm tra `keyPermission` khớp với `card.keyPermission`

### ✅ Bước 2: Đảm Bảo Placement Node

- [ ] **Nếu placement node có sẵn:**
  - [ ] Kiểm tra GLTF scene có placement node với tên khớp
  - [ ] Kiểm tra `nodeName` trong Element khớp với tên trong scene

- [ ] **Nếu tạo placement node động:**
  - [ ] Tạo placement node trong `Room.tsx` (hoặc component tương tự)
  - [ ] Đảm bảo placement node được tạo trước khi ProductNode render
  - [ ] Kiểm tra `nodeName` khớp với Element

### ✅ Bước 3: Kiểm Tra Asset Mapping

- [ ] `assetId` trong card có trong `LOCAL_ASSET_MAPPING`
- [ ] File GLB tồn tại tại path trong mapping

### ✅ Bước 4: Test

- [ ] Card hiển thị trong UI
- [ ] User click card → device được render trong scene
- [ ] Device ở đúng vị trí (placement node)
- [ ] Device có scale, rotation đúng

---

## 🔍 Debug Nếu Không Hoạt Động

### Vấn Đề 1: Element Không Tìm Thấy

**Lỗi:**
```
⚠️ [addElement] Element not found: RallyBoard
```

**Nguyên nhân:**
- `card.keyPermission` không khớp với `element.name`
- Element chưa được thêm vào `step.allElements`

**Giải pháp:**
- Kiểm tra `card.keyPermission = "RallyBoard"` và `element.name = "RallyBoard"` khớp
- Kiểm tra Element đã được thêm vào `step.allElements`

### Vấn Đề 2: Placement Node Không Tìm Thấy

**Lỗi:**
- ProductNode không render Product
- Device không hiển thị trong scene

**Nguyên nhân:**
- Placement node không tồn tại trong GLTF scene
- `nodeName` trong Element không khớp với tên trong scene

**Giải pháp:**
- Kiểm tra GLTF scene có placement node với tên khớp
- Kiểm tra `nodeName` trong Element khớp với tên trong scene
- Nếu tạo động, kiểm tra placement node được tạo trước khi ProductNode render

### Vấn Đề 3: Asset Không Load

**Lỗi:**
- Product component không load GLB file

**Nguyên nhân:**
- `assetId` không có trong `LOCAL_ASSET_MAPPING`
- File GLB không tồn tại tại path trong mapping

**Giải pháp:**
- Kiểm tra `assetId` có trong `LOCAL_ASSET_MAPPING`
- Kiểm tra file GLB tồn tại tại path trong mapping

---

## 📚 Ví Dụ Hoàn Chỉnh: RallyBoard

### 1. Card Configuration

```typescript
// deviceCards.json hoặc handlers.ts
{
  deviceId: "rallyboard-mount",
  keyPermission: "RallyBoard",  // ⭐
  step: "Conference Camera",
  assetId: "rallyboard-mount-asset-1",  // ⭐
  attributeName: "RallyBoard",
}
```

### 2. Asset Mapping

```typescript
// src/utils/localAssetLoader.ts
export const LOCAL_ASSET_MAPPING: Record<string, string> = {
  "rallyboard-mount-asset-1": "/assets/models/RallyBoard65_Standalone-compressed.glb",  // ⭐
};
```

### 3. Element (Permission System)

```typescript
// src/utils/permissionUtils.ts
const groupRallyBoard = new GroupElement().addElement(
  new ItemElement("RallyBoard")  // ⭐ keyPermission = "RallyBoard"
    .setDefaultMount(
      new MountElement(
        "RallyBoard",
        PlacementManager.getNameNodeForRallyBoardMount()  // → "RallyBoard_Mount" ⭐
      )
    )
);

stepConferenceCamera.allElements = [
  // ... existing elements ...
  groupRallyBoard,  // ⭐
];
```

### 4. Placement Node (Tạo Động)

```typescript
// src/components/Assets/Room.tsx
useEffect(() => {
  // Tìm TV mesh và tạo placement node
  const placementNode = new THREE.Object3D();
  placementNode.name = "RallyBoard_Mount";  // ⭐ nodeName khớp với Element
  // ... tính toán position, rotation, scale ...
  gltf.scene.add(placementNode);
}, [gltf]);
```

### 5. Flow Hoạt Động

```
User click Card
  ↓
getAssetFromCard(card) → assetId = "rallyboard-mount-asset-1"
  ↓
addElement(card) → element = ItemElement("RallyBoard")
  ↓
element.getMount().getNameNode() → "RallyBoard_Mount"
  ↓
setElementByNameNode("rallyboard-mount-asset-1", "RallyBoard_Mount")
  ↓
Redux Store: { "RallyBoard_Mount": "rallyboard-mount-asset-1" }
  ↓
ProductNode tìm placement node "RallyBoard_Mount" → render Product
  ↓
Product load GLB từ "rallyboard-mount-asset-1" → "/assets/models/..."
  ↓
RallyBoard hiển thị trong scene! ✅
```

---

## 🎯 Tóm Tắt

Sau khi tạo cấu hình card, bạn **PHẢI** thực hiện 2 bước:

1. **Tạo Element trong Permission System:**
   - `ItemElement(keyPermission)` với `MountElement(nodeName)`
   - Thêm vào `step.allElements`
   - Đảm bảo `keyPermission` khớp với `card.keyPermission`

2. **Đảm bảo Placement Node tồn tại:**
   - Nếu có sẵn: Kiểm tra GLTF scene có placement node với tên khớp
   - Nếu tạo động: Tạo placement node trong `Room.tsx` với tên khớp

**Nếu thiếu 1 trong 2 bước → Device không hoạt động!**

