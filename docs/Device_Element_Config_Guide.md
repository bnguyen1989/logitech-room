# Hướng Dẫn: Tạo Element Tổng Quát Cho Device Dùng Local GLB

## 📋 Tổng Quan

Thay vì viết code riêng cho từng device trong `permissionUtils.ts`, bạn có thể sử dụng **JSON config** để tạo Element tự động.

**Lợi ích:**
- ✅ Không cần viết code cho mỗi device mới
- ✅ Dễ maintain - tất cả config ở một nơi
- ✅ Có thể load từ API hoặc file
- ✅ Tái sử dụng code

---

## 🔧 Cách Sử Dụng

### Bước 1: Thêm Config Vào JSON

**File:** `src/config/deviceElements.json`

```json
{
  "elements": [
    {
      "keyPermission": "RallyBoardMount",
      "placementManagerMethod": {
        "method": "getNameNodeForRallyBoardMount",
        "args": []
      }
    },
    {
      "keyPermission": "RallyBoardCredenza",
      "nodeName": "Camera_Commode_mini_display_1"
    },
    {
      "keyPermission": "RallyBoardWall",
      "placementManagerMethod": {
        "method": "getNameNodeForTap",
        "args": ["Wall", 1]
      }
    }
  ]
}
```

**Có 2 cách để định nghĩa `nodeName`:**

#### Cách 1: Dùng PlacementManager Method (Khuyến nghị)

```json
{
  "keyPermission": "RallyBoardMount",
  "placementManagerMethod": {
    "method": "getNameNodeForRallyBoardMount",
    "args": []
  }
}
```

**Lợi ích:**
- ✅ Tự động sử dụng method từ `PlacementManager`
- ✅ Đảm bảo consistency với code hiện tại
- ✅ Dễ maintain nếu method thay đổi

#### Cách 2: Dùng Direct nodeName

```json
{
  "keyPermission": "RallyBoardCredenza",
  "nodeName": "Camera_Commode_mini_display_1"
}
```

**Lợi ích:**
- ✅ Đơn giản cho placement node có sẵn
- ✅ Không cần method trong PlacementManager

---

### Bước 2: Import và Sử Dụng Trong permissionUtils.ts

**File:** `src/utils/permissionUtils.ts`

```typescript
import deviceElementsConfig from '../config/deviceElements.json';
import { registerDeviceElementsToStep } from './deviceElementConfig';

export function createStepConferenceCamera() {
  const stepConferenceCamera = new Step(StepName.ConferenceCamera);
  
  // ... existing code ...
  
  // ⭐ Register device elements from JSON config
  registerDeviceElementsToStep(
    stepConferenceCamera,
    deviceElementsConfig.elements
  );
  
  stepConferenceCamera.allElements = [
    // ... existing elements ...
    // ⭐ Elements từ JSON config đã được thêm vào step.allElements tự động
  ];
  
  return stepConferenceCamera;
}
```

**Lưu ý:**
- `registerDeviceElementsToStep()` sẽ tự động thêm elements vào `step.allElements`
- Bạn vẫn có thể thêm elements thủ công như bình thường
- Elements từ JSON config và elements thủ công sẽ được merge

---

## 📝 Cấu Trúc Config

### DeviceElementConfig Interface

```typescript
interface DeviceElementConfig {
  keyPermission: string; // ⭐ Bắt buộc - phải khớp với card.keyPermission
  nodeName?: string; // ⭐ Optional - dùng nếu không có placementManagerMethod
  placementManagerMethod?: { // ⭐ Optional - dùng nếu muốn dùng PlacementManager method
    method: string; // Tên method trong PlacementManager
    args?: any[]; // Arguments cho method
  };
}
```

### Ví Dụ Các Trường Hợp

#### Trường Hợp 1: Dùng PlacementManager Method Không Có Args

```json
{
  "keyPermission": "RallyBoardMount",
  "placementManagerMethod": {
    "method": "getNameNodeForRallyBoardMount",
    "args": []
  }
}
```

**Tương đương với:**
```typescript
PlacementManager.getNameNodeForRallyBoardMount() // → "RallyBoard_Mount"
```

#### Trường Hợp 2: Dùng PlacementManager Method Có Args

```json
{
  "keyPermission": "RallyBoardWall",
  "placementManagerMethod": {
    "method": "getNameNodeForTap",
    "args": ["Wall", 1]
  }
}
```

**Tương đương với:**
```typescript
PlacementManager.getNameNodeForTap("Wall", 1) // → "Tap_Placement_Wall_1"
```

#### Trường Hợp 3: Dùng Direct nodeName

```json
{
  "keyPermission": "RallyBoardCredenza",
  "nodeName": "Camera_Commode_mini_display_1"
}
```

**Tương đương với:**
```typescript
const nodeName = "Camera_Commode_mini_display_1";
```

---

## 🔍 Các Function Có Sẵn

### 1. `createDeviceElement(config: DeviceElementConfig): ItemElement`

Tạo `ItemElement` với `MountElement` từ config.

**Ví dụ:**
```typescript
import { createDeviceElement } from './deviceElementConfig';

const element = createDeviceElement({
  keyPermission: "RallyBoardMount",
  placementManagerMethod: {
    method: "getNameNodeForRallyBoardMount",
    args: []
  }
});

// element = ItemElement("RallyBoardMount") với defaultMount = MountElement("RallyBoardMount", "RallyBoard_Mount")
```

### 2. `createDeviceGroupElement(config: DeviceElementConfig): GroupElement`

Tạo `GroupElement` chứa `ItemElement` từ config.

**Ví dụ:**
```typescript
import { createDeviceGroupElement } from './deviceElementConfig';

const groupElement = createDeviceGroupElement({
  keyPermission: "RallyBoardMount",
  placementManagerMethod: {
    method: "getNameNodeForRallyBoardMount",
    args: []
  }
});

// groupElement = GroupElement chứa ItemElement("RallyBoardMount")
```

### 3. `registerDeviceElementsToStep(step: Step, configs: DeviceElementConfig[]): void`

Register nhiều device elements vào một step.

**Ví dụ:**
```typescript
import { registerDeviceElementsToStep } from './deviceElementConfig';
import deviceElementsConfig from '../config/deviceElements.json';

registerDeviceElementsToStep(stepConferenceCamera, deviceElementsConfig.elements);
// Tất cả elements từ JSON config sẽ được thêm vào step.allElements
```

### 4. `createDeviceGroupElements(configs: DeviceElementConfig[]): GroupElement[]`

Tạo array của `GroupElement` từ array config.

**Ví dụ:**
```typescript
import { createDeviceGroupElements } from './deviceElementConfig';

const groupElements = createDeviceGroupElements([
  {
    keyPermission: "RallyBoardMount",
    placementManagerMethod: {
      method: "getNameNodeForRallyBoardMount",
      args: []
    }
  },
  {
    keyPermission: "RallyBoardWall",
    placementManagerMethod: {
      method: "getNameNodeForTap",
      args: ["Wall", 1]
    }
  }
]);

// groupElements = [GroupElement(...), GroupElement(...)]
```

---

## 📚 Ví Dụ Hoàn Chỉnh

### Ví Dụ 1: RallyBoard với Placement Node Có Sẵn

**1. JSON Config:**
```json
{
  "elements": [
    {
      "keyPermission": "RallyBoardWall",
      "placementManagerMethod": {
        "method": "getNameNodeForTap",
        "args": ["Wall", 1]
      }
    }
  ]
}
```

**2. permissionUtils.ts:**
```typescript
import deviceElementsConfig from '../config/deviceElements.json';
import { registerDeviceElementsToStep } from './deviceElementConfig';

export function createStepConferenceCamera() {
  const stepConferenceCamera = new Step(StepName.ConferenceCamera);
  
  // ... existing code ...
  
  // Register device elements from JSON
  registerDeviceElementsToStep(
    stepConferenceCamera,
    deviceElementsConfig.elements
  );
  
  stepConferenceCamera.allElements = [
    // ... existing elements ...
  ];
  
  return stepConferenceCamera;
}
```

**3. Kết quả:**
- Element `ItemElement("RallyBoardWall")` với `MountElement("RallyBoardWall", "Tap_Placement_Wall_1")` được tạo
- Element được thêm vào `stepConferenceCamera.allElements`
- Khi user click card với `keyPermission = "RallyBoardWall"`, system sẽ tìm element và map vào placement node `"Tap_Placement_Wall_1"`

---

### Ví Dụ 2: RallyBoard với Direct nodeName

**1. JSON Config:**
```json
{
  "elements": [
    {
      "keyPermission": "RallyBoardCredenza",
      "nodeName": "Camera_Commode_mini_display_1"
    }
  ]
}
```

**2. Kết quả:**
- Element `ItemElement("RallyBoardCredenza")` với `MountElement("RallyBoardCredenza", "Camera_Commode_mini_display_1")` được tạo
- Placement node `"Camera_Commode_mini_display_1"` phải tồn tại trong GLTF scene

---

## ⚠️ Lưu Ý Quan Trọng

### 1. `keyPermission` Phải Khớp

- `card.keyPermission = "RallyBoardWall"`
- `element.name = "RallyBoardWall"` ✅
- Nếu không khớp → `addElement()` không tìm thấy element

### 2. `nodeName` Phải Tồn Tại Trong Scene

- `nodeName = "Tap_Placement_Wall_1"`
- Placement node `"Tap_Placement_Wall_1"` phải có trong GLTF scene ✅
- Nếu không có → ProductNode không tìm thấy placement node

### 3. PlacementManager Method Phải Tồn Tại

- `method = "getNameNodeForTap"`
- `PlacementManager.getNameNodeForTap()` phải tồn tại ✅
- Nếu không có → sẽ throw error

### 4. Element Phải Được Thêm Vào Step

- `registerDeviceElementsToStep()` tự động thêm vào `step.allElements`
- Nếu không gọi function này → Element không được thêm vào step

---

## 🔄 So Sánh: Cách Cũ vs Cách Mới

### Cách Cũ (Thủ Công)

```typescript
// permissionUtils.ts
const groupRallyBoardWall = new GroupElement().addElement(
  new ItemElement("RallyBoardWall").setDefaultMount(
    new MountElement(
      "RallyBoardWall",
      PlacementManager.getNameNodeForTap("Wall", 1)
    )
  )
);

stepConferenceCamera.allElements = [
  // ... existing elements ...
  groupRallyBoardWall, // ⭐ Phải viết code cho mỗi device
];
```

**Nhược điểm:**
- ❌ Phải viết code cho mỗi device
- ❌ Khó maintain khi có nhiều devices
- ❌ Code dài và lặp lại

### Cách Mới (JSON Config)

```json
// deviceElements.json
{
  "elements": [
    {
      "keyPermission": "RallyBoardWall",
      "placementManagerMethod": {
        "method": "getNameNodeForTap",
        "args": ["Wall", 1]
      }
    }
  ]
}
```

```typescript
// permissionUtils.ts
import deviceElementsConfig from '../config/deviceElements.json';
import { registerDeviceElementsToStep } from './deviceElementConfig';

registerDeviceElementsToStep(
  stepConferenceCamera,
  deviceElementsConfig.elements
);
```

**Ưu điểm:**
- ✅ Không cần viết code cho mỗi device
- ✅ Dễ maintain - tất cả config ở một nơi
- ✅ Có thể load từ API hoặc file
- ✅ Tái sử dụng code

---

## 🎯 Tóm Tắt

**Để tạo Element tổng quát cho device dùng local GLB:**

1. **Thêm config vào JSON:**
   - `src/config/deviceElements.json`
   - Định nghĩa `keyPermission` và `nodeName` (hoặc `placementManagerMethod`)

2. **Import và sử dụng trong permissionUtils.ts:**
   - Import `registerDeviceElementsToStep` và JSON config
   - Gọi function để register elements vào step

3. **Đảm bảo:**
   - `keyPermission` khớp với `card.keyPermission`
   - `nodeName` tồn tại trong GLTF scene
   - PlacementManager method tồn tại (nếu dùng)

**Kết quả:**
- Element được tạo tự động từ JSON config
- Không cần viết code cho mỗi device mới
- Dễ maintain và mở rộng

