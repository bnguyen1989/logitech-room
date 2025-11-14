# Hướng Dẫn: Tạo Placement Node Trên Tường Thay TV (Tổng Quát)

## 📋 Tổng Quan

Hướng dẫn này mô tả cách tạo placement node **tổng quát** cho vị trí trên tường thay TV, có thể dùng cho **bất kỳ sản phẩm nào** cần mount lên tường để thay thế TV (RallyBoard, hoặc bất kỳ device nào khác).

---

## 🎯 Mục Đích

Tạo một placement node **tổng quát** (`Wall_Mount_For_TV_Replacement`) thay vì tạo riêng cho từng device:
- ✅ **Tái sử dụng** - Một placement node cho nhiều devices
- ✅ **Dễ maintain** - Chỉ cần tạo một lần
- ✅ **Linh hoạt** - Bất kỳ device nào cần thay TV đều có thể dùng

---

## 🔧 Các Bước Thực Hiện

### Bước 1: Thêm Method Vào PlacementManager

**File:** `src/models/configurator/PlacementManager.ts`

```typescript
/**
 * Get placement node name for wall mount to replace TV
 * This is a generic placement node that can be used by any device that needs to mount on wall to replace TV
 * @returns Placement node name: "Wall_Mount_For_TV_Replacement"
 */
public static getNameNodeForWallMountTVReplacement(): string {
  return "Wall_Mount_For_TV_Replacement";
}
```

**Lưu ý:**
- Method này trả về tên placement node tổng quát
- Tên node: `"Wall_Mount_For_TV_Replacement"`
- Có thể dùng cho bất kỳ device nào cần thay TV

---

### Bước 2: Thêm Node Name Vào getAllPlacement()

**File:** `src/models/configurator/PlacementManager.ts`

```typescript
static getAllPlacement(): string[] {
  const placements = [
    // ... existing placements ...
    this.getNameNodeForWallMountTVReplacement()  // ⭐ Thêm vào đây
  ];
  return placements;
}
```

**Lưu ý:**
- Cần thêm vào `getAllPlacement()` để `ProductsNodes` có thể tìm thấy placement node
- Nếu không thêm → `ProductsNodes` không render `ProductNode` tại placement node này

---

### Bước 3: Tạo Utility Function

**File:** `src/utils/placementNodeUtils.ts` (đã tạo)

**Functions:**
- `findTVMesh()` - Tìm TV mesh trong scene
- `calculateFrontFaceTransform()` - Tính toán vị trí và rotation của front face
- `createWallMountPlacementNode()` - Tạo placement node cho wall mount
- `createWallMountPlacementNodes()` - Tạo nhiều placement nodes

**Cách sử dụng:**
```typescript
import { createWallMountPlacementNode } from '../../utils/placementNodeUtils';
import { PlacementManager } from '../../models/configurator/PlacementManager';

// Tạo placement node
const nodeName = PlacementManager.getNameNodeForWallMountTVReplacement();
createWallMountPlacementNode(gltf.scene, nodeName);
```

---

### Bước 4: Thêm Code Vào Room.tsx

**File:** `src/components/Assets/Room.tsx`

```typescript
import { createWallMountPlacementNode } from "../../utils/placementNodeUtils.js";
import { PlacementManager } from "../../models/configurator/PlacementManager.js";

export const Room: React.FC<RoomProps> = (props) => {
  // ... existing code ...

  useEffect(() => {
    if (!gltf) return;

    // ... existing code ...

    // Create placement node for wall mount to replace TV
    // This placement node can be used by any device that needs to mount on wall to replace TV
    const wallMountNodeName = PlacementManager.getNameNodeForWallMountTVReplacement();
    
    // Check if placement node already exists (don't create duplicate)
    const existingNode = gltf.scene.getObjectByName(wallMountNodeName);
    if (!existingNode) {
      createWallMountPlacementNode(gltf.scene, wallMountNodeName);
    }
  }, [gltf]);

  // ... rest of component ...
};
```

**Lưu ý:**
- Placement node được tạo tự động khi scene load
- Kiểm tra node đã tồn tại để tránh tạo duplicate
- Placement node được tạo dựa trên vị trí TV mesh

---

### Bước 5: Cấu Hình Element Cho Device

**File:** `src/config/deviceElements.json`

```json
{
  "elements": [
    {
      "keyPermission": "RallyBoardMount",
      "placementManagerMethod": {
        "method": "getNameNodeForWallMountTVReplacement",
        "args": []
      }
    },
    {
      "keyPermission": "AnyOtherDevice",
      "placementManagerMethod": {
        "method": "getNameNodeForWallMountTVReplacement",
        "args": []
      }
    }
  ]
}
```

**Lưu ý:**
- Bất kỳ device nào cần thay TV đều có thể dùng `getNameNodeForWallMountTVReplacement()`
- `keyPermission` phải khớp với `card.keyPermission`

---

## 📊 So Sánh: Cách Cũ vs Cách Mới

### Cách Cũ (Tạo Riêng Cho Từng Device)

```typescript
// RallyBoard
const groupRallyBoard = new GroupElement().addElement(
  new ItemElement("RallyBoard").setDefaultMount(
    new MountElement("RallyBoard", "RallyBoard_Mount")
  )
);

// Device khác
const groupOtherDevice = new GroupElement().addElement(
  new ItemElement("OtherDevice").setDefaultMount(
    new MountElement("OtherDevice", "OtherDevice_Mount")
  )
);
```

**Nhược điểm:**
- ❌ Phải tạo placement node riêng cho mỗi device
- ❌ Code lặp lại
- ❌ Khó maintain

---

### Cách Mới (Tổng Quát - Một Placement Node Cho Nhiều Devices)

```typescript
// Tất cả devices dùng chung một placement node
{
  "keyPermission": "RallyBoardMount",
  "placementManagerMethod": {
    "method": "getNameNodeForWallMountTVReplacement",
    "args": []
  }
},
{
  "keyPermission": "AnyOtherDevice",
  "placementManagerMethod": {
    "method": "getNameNodeForWallMountTVReplacement",
    "args": []
  }
}
```

**Ưu điểm:**
- ✅ Một placement node cho nhiều devices
- ✅ Không cần code lặp lại
- ✅ Dễ maintain

---

## 🔍 Cách Hoạt Động

### Flow Tạo Placement Node

```
1. Room.tsx load scene
   ↓
2. useEffect() chạy
   ↓
3. findTVMesh(gltf.scene) → Tìm TV mesh
   ↓
4. calculateFrontFaceTransform(tvMesh) → Tính toán vị trí và rotation
   ↓
5. createWallMountPlacementNode() → Tạo placement node
   ↓
6. placementNode.name = "Wall_Mount_For_TV_Replacement"
   ↓
7. placementNode.position = TV front face position + offset
   ↓
8. placementNode.rotation = TV rotation + 180° Y (để device mặt trước hướng ra ngoài)
   ↓
9. gltf.scene.add(placementNode)
   ↓
10. Placement node sẵn sàng cho bất kỳ device nào! ✅
```

### Flow Khi User Click Device

```
1. User click RallyBoard (hoặc device khác)
   ↓
2. addElement(card) → element = ItemElement("RallyBoardMount")
   ↓
3. element.getMount().getNameNode() → "Wall_Mount_For_TV_Replacement"
   ↓
4. setElementByNameNode(assetId, "Wall_Mount_For_TV_Replacement")
   ↓
5. Redux Store: { "Wall_Mount_For_TV_Replacement": "asset-id" }
   ↓
6. ProductNode tìm placement node "Wall_Mount_For_TV_Replacement"
   ↓
7. Product render tại vị trí placement node
   ↓
8. Device hiển thị trên tường thay TV! ✅
```

---

## 📝 Ví Dụ: RallyBoard Sử Dụng Placement Node Tổng Quát

### 1. Element Config

**File:** `src/config/deviceElements.json`

```json
{
  "elements": [
    {
      "keyPermission": "RallyBoardMount",
      "placementManagerMethod": {
        "method": "getNameNodeForWallMountTVReplacement",
        "args": []
      }
    }
  ]
}
```

### 2. Card Config

**File:** `src/config/deviceCards.json`

```json
{
  "devices": [
    {
      "deviceId": "rallyboard-mount",
      "keyPermission": "RallyBoardMount",
      "step": "Conference Camera",
      "assetId": "rallyboard-mount-asset-1",
      "attributeName": "RallyBoardMount"
    }
  ]
}
```

### 3. Kết Quả

- ✅ Placement node `"Wall_Mount_For_TV_Replacement"` được tạo tự động
- ✅ RallyBoard sử dụng placement node này
- ✅ RallyBoard hiển thị trên tường thay TV

---

## 🎯 Lợi Ích

### 1. Tái Sử Dụng

- ✅ Một placement node cho nhiều devices
- ✅ Không cần tạo riêng cho mỗi device

### 2. Dễ Maintain

- ✅ Chỉ cần sửa một chỗ (placementNodeUtils.ts)
- ✅ Tất cả devices tự động sử dụng placement node mới

### 3. Linh Hoạt

- ✅ Bất kỳ device nào cần thay TV đều có thể dùng
- ✅ Chỉ cần thêm vào `deviceElements.json` với `getNameNodeForWallMountTVReplacement()`

---

## ⚠️ Lưu Ý

### 1. Placement Node Chỉ Được Tạo Một Lần

- Code trong `Room.tsx` kiểm tra node đã tồn tại
- Nếu đã có → không tạo duplicate

### 2. TV Mesh Phải Tồn Tại

- Nếu không tìm thấy TV mesh → placement node không được tạo
- Console sẽ có warning: `⚠️ TV mesh not found`

### 3. Nhiều Devices Có Thể Dùng Cùng Placement Node

- ✅ **Được phép** - Nhiều devices có thể dùng cùng placement node
- ⚠️ **Lưu ý** - Chỉ device được chọn cuối cùng sẽ hiển thị (vì cùng vị trí)

---

## ✅ Checklist

Sau khi implement:

- [ ] Method `getNameNodeForWallMountTVReplacement()` đã được thêm vào PlacementManager
- [ ] Node name đã được thêm vào `getAllPlacement()`
- [ ] Utility function `createWallMountPlacementNode()` đã được tạo
- [ ] Code trong `Room.tsx` đã gọi `createWallMountPlacementNode()`
- [ ] Element config sử dụng `getNameNodeForWallMountTVReplacement()`
- [ ] Test: Placement node được tạo khi scene load
- [ ] Test: Device hiển thị trên tường thay TV

---

## 🎯 Tóm Tắt

**Để tạo placement node tổng quát cho vị trí trên tường thay TV:**

1. **Thêm method** `getNameNodeForWallMountTVReplacement()` vào PlacementManager
2. **Thêm node name** vào `getAllPlacement()`
3. **Tạo utility function** `createWallMountPlacementNode()`
4. **Gọi function** trong `Room.tsx` khi scene load
5. **Cấu hình Element** sử dụng `getNameNodeForWallMountTVReplacement()`

**Kết quả:**
- ✅ Placement node được tạo tự động
- ✅ Bất kỳ device nào cần thay TV đều có thể dùng
- ✅ Dễ maintain và mở rộng

