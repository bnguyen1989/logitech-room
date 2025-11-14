# Mối Liên Kết Giữa placementNodeUtils và PlacementManager

## 📋 Tổng Quan

Tài liệu này giải thích **mối liên kết** giữa:
- `placementNodeUtils.ts` - Tạo placement node thực tế (THREE.Object3D)
- `PlacementManager.ts` - Quản lý tên placement nodes (string)

---

## 🔗 Mối Liên Kết

### 1. PlacementManager - Định Nghĩa Tên (String)

**File:** `src/models/configurator/PlacementManager.ts`

```typescript
export class PlacementManager {
  /**
   * Get placement node name for device mount to replace TV
   * @returns Placement node name: "Device_Mount"
   */
  public static getNameNodeForDeviceMount(): string {
    return "Device_Mount";  // ⭐ Trả về STRING
  }

  /**
   * Get all placement node names
   * @returns Array of placement node names (strings)
   */
  static getAllPlacement(): string[] {
    const placements: string[] = [];
    // ... add all placement node names ...
    placements.push(this.getNameNodeForDeviceMount());  // ⭐ Thêm "Device_Mount"
    return placements;
  }
}
```

**Chức năng:**
- Định nghĩa **TÊN** của placement nodes (string)
- Cung cấp methods để lấy tên placement node
- `getAllPlacement()` trả về danh sách tất cả placement node names

---

### 2. placementNodeUtils - Tạo Placement Node Thực Tế (THREE.Object3D)

**File:** `src/utils/placementNodeUtils.ts`

```typescript
import { PlacementManager } from "../models/configurator/PlacementManager";

export function createDeviceMountPlacementNode(
  scene: THREE.Scene | THREE.Group,
  nodeName: string = PlacementManager.getNameNodeForDeviceMount()  // ⭐ Lấy tên từ PlacementManager
): THREE.Object3D | null {
  // ... find TV mesh ...
  
  // Create placement node
  const placementNode = new THREE.Object3D();
  placementNode.name = nodeName;  // ⭐ Set tên từ PlacementManager
  
  // Set position, rotation, scale
  placementNode.position.copy(position);
  placementNode.quaternion.copy(quaternion);
  placementNode.scale.set(1, 1, 1);
  
  // Add to scene
  scene.add(placementNode);
  
  return placementNode;  // ⭐ Trả về THREE.Object3D
}
```

**Chức năng:**
- **Tạo** placement node thực tế (THREE.Object3D) trong scene
- **Sử dụng tên** từ PlacementManager (`getNameNodeForDeviceMount()`)
- **Set position, rotation, scale** cho placement node
- **Add vào scene** để có thể sử dụng

---

### 3. ProductsNodes - Sử Dụng PlacementManager Để Match Nodes

**File:** `src/components/Assets/ProductsNodes.tsx`

```typescript
import { PlacementManager } from "../../models/configurator/PlacementManager";

export const ProductsNodes = () => {
  // ⭐ Lấy danh sách tất cả placement node names từ PlacementManager
  const allNodePlacement = PlacementManager.getAllPlacement();
  // allNodePlacement = ["Device_Mount", "Mic_Placement_1", "Tap_Placement_Wall_1", ...]
  
  // ⭐ Lấy tên placement node từ PlacementManager
  const deviceMountNodeName = PlacementManager.getNameNodeForDeviceMount();
  // deviceMountNodeName = "Device_Mount"
  
  const nodeMatchers: NodeMatcher[] = [
    // Matcher 1: Tạo placement node với tên từ PlacementManager
    (threeNode) => {
      if (!deviceMountCreatedRef.current && threeNode.parent === null) {
        createDeviceMountPlacementNode(
          threeNode,
          deviceMountNodeName  // ⭐ Sử dụng tên từ PlacementManager
        );
      }
      return undefined;
    },
    
    // Matcher 2: Match placement nodes
    (threeNode) => {
      // ⭐ Check xem node có trong danh sách placement nodes không
      if (allNodePlacement.includes(threeNode.name)) {
        return (
          <ProductNode parentNode={threeNode} nameNode={threeNode.name} />
        );
      }
      return undefined;
    },
  ];
  
  return nodeMatchers;
};
```

**Chức năng:**
- **Lấy danh sách** placement node names từ `PlacementManager.getAllPlacement()`
- **Tạo placement node** với tên từ `PlacementManager.getNameNodeForDeviceMount()`
- **Match placement nodes** bằng cách check `allNodePlacement.includes(threeNode.name)`

---

## 🔄 Flow Kết Nối

### Flow Hoàn Chỉnh

```
1. PlacementManager.ts
   ↓ Định nghĩa tên placement node
   getNameNodeForDeviceMount() → "Device_Mount" (string)
   ↓
2. PlacementManager.ts
   ↓ Thêm vào danh sách
   getAllPlacement() → ["Device_Mount", ...] (string[])
   ↓
3. placementNodeUtils.ts
   ↓ Sử dụng tên từ PlacementManager
   createDeviceMountPlacementNode(
     scene,
     PlacementManager.getNameNodeForDeviceMount()  // "Device_Mount"
   )
   ↓
4. placementNodeUtils.ts
   ↓ Tạo placement node thực tế
   placementNode.name = "Device_Mount"
   scene.add(placementNode)
   ↓
5. ProductsNodes.tsx
   ↓ Lấy danh sách từ PlacementManager
   allNodePlacement = PlacementManager.getAllPlacement()
   ↓
6. ProductsNodes.tsx
   ↓ Match placement node
   if (allNodePlacement.includes(threeNode.name)) {
     // threeNode.name = "Device_Mount"
     // Match! → Render ProductNode
   }
```

---

## 📊 So Sánh: PlacementManager vs placementNodeUtils

| Tiêu chí | PlacementManager | placementNodeUtils |
|----------|------------------|-------------------|
| **Loại dữ liệu** | String (tên) | THREE.Object3D (object thực tế) |
| **Chức năng** | Định nghĩa tên | Tạo object trong scene |
| **Khi nào dùng** | Lấy tên placement node | Tạo placement node thực tế |
| **Ví dụ** | `"Device_Mount"` | `THREE.Object3D { name: "Device_Mount", position: {...} }` |

---

## 🔑 Điểm Quan Trọng

### 1. PlacementManager Chỉ Định Nghĩa Tên

```typescript
// PlacementManager.ts
public static getNameNodeForDeviceMount(): string {
  return "Device_Mount";  // ⭐ Chỉ là STRING, không phải object
}
```

**Không tạo object, chỉ trả về tên!**

---

### 2. placementNodeUtils Tạo Object Thực Tế

```typescript
// placementNodeUtils.ts
const placementNode = new THREE.Object3D();
placementNode.name = PlacementManager.getNameNodeForDeviceMount();  // ⭐ Sử dụng tên từ PlacementManager
placementNode.position.copy(position);
scene.add(placementNode);
```

**Tạo object thực tế với tên từ PlacementManager!**

---

### 3. ProductsNodes Sử Dụng Cả Hai

```typescript
// ProductsNodes.tsx
// 1. Lấy tên từ PlacementManager
const deviceMountNodeName = PlacementManager.getNameNodeForDeviceMount();

// 2. Tạo placement node với tên đó
createDeviceMountPlacementNode(threeNode, deviceMountNodeName);

// 3. Match placement nodes bằng danh sách từ PlacementManager
const allNodePlacement = PlacementManager.getAllPlacement();
if (allNodePlacement.includes(threeNode.name)) {
  // Match!
}
```

---

## 💡 Ví Dụ Cụ Thể

### Bước 1: PlacementManager Định Nghĩa Tên

```typescript
// PlacementManager.ts
public static getNameNodeForDeviceMount(): string {
  return "Device_Mount";
}

static getAllPlacement(): string[] {
  return [
    // ... other placements ...
    "Device_Mount",  // ⭐ Thêm vào danh sách
  ];
}
```

---

### Bước 2: placementNodeUtils Tạo Placement Node

```typescript
// placementNodeUtils.ts
export function createDeviceMountPlacementNode(
  scene: THREE.Scene | THREE.Group,
  nodeName: string = PlacementManager.getNameNodeForDeviceMount()  // ⭐ Lấy "Device_Mount"
): THREE.Object3D | null {
  const placementNode = new THREE.Object3D();
  placementNode.name = nodeName;  // ⭐ Set tên = "Device_Mount"
  placementNode.position.set(1.5, 2.0, 0.1);
  scene.add(placementNode);
  return placementNode;
}
```

**Kết quả:**
- Placement node được tạo trong scene với tên `"Device_Mount"`
- Placement node có position, rotation, scale

---

### Bước 3: ProductsNodes Match Placement Node

```typescript
// ProductsNodes.tsx
const allNodePlacement = PlacementManager.getAllPlacement();
// allNodePlacement = ["Device_Mount", "Mic_Placement_1", ...]

const nodeMatchers: NodeMatcher[] = [
  (threeNode) => {
    // Check xem node có trong danh sách placement nodes không
    if (allNodePlacement.includes(threeNode.name)) {
      // threeNode.name = "Device_Mount"
      // allNodePlacement.includes("Device_Mount") = true
      // Match! → Render ProductNode
      return <ProductNode parentNode={threeNode} nameNode={threeNode.name} />;
    }
    return undefined;
  },
];
```

**Kết quả:**
- ProductsNodes match placement node `"Device_Mount"` từ scene
- Render ProductNode tại placement node đó

---

## ✅ Tóm Tắt

### Mối Liên Kết

1. **PlacementManager** → Định nghĩa **TÊN** placement nodes (string)
2. **placementNodeUtils** → Tạo placement node **THỰC TẾ** (THREE.Object3D) với tên từ PlacementManager
3. **ProductsNodes** → Sử dụng PlacementManager để:
   - Lấy tên placement node
   - Lấy danh sách tất cả placement nodes
   - Match placement nodes trong scene

### Flow

```
PlacementManager (tên)
  ↓
placementNodeUtils (tạo object với tên đó)
  ↓
ProductsNodes (match object bằng tên)
```

### Code Quan Trọng

```typescript
// 1. PlacementManager định nghĩa tên
PlacementManager.getNameNodeForDeviceMount() → "Device_Mount"

// 2. placementNodeUtils tạo object với tên đó
placementNode.name = PlacementManager.getNameNodeForDeviceMount();

// 3. ProductsNodes match bằng danh sách từ PlacementManager
allNodePlacement.includes(threeNode.name)
```

