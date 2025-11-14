# Giải Thích: permissionUtils.ts Làm Gì? Tại Sao Không Thấy Code GLB Elements?

## 📋 permissionUtils.ts Làm Gì?

### Mục Đích Chính

**`permissionUtils.ts`** là file **tạo cấu hình Permission System** cho toàn bộ configurator. Nó định nghĩa:

1. **Các Step (Bước)**: RoomSize, Platform, Services, ConferenceCamera, AudioExtensions, etc.
2. **Các Elements (Phần tử)**: ItemElement cho từng sản phẩm (Camera, Mic, Tap, etc.)
3. **Các Mounts (Vị trí đặt)**: MountElement định nghĩa placement node cho mỗi sản phẩm
4. **Business Logic**: Dependencies, conditions, rules, bundles

### Cấu Trúc

```typescript
// permissionUtils.ts
export function createStepConferenceCamera() {
  const stepConferenceCamera = new Step(StepName.ConferenceCamera);
  
  // Tạo GroupElement chứa các ItemElement
  const group = new GroupElement()
    .addElement(new ItemElement(CameraName.RallyBar))
    .addElement(new ItemElement(CameraName.RallyBarMini))
    // ...
  
  // Gán elements vào step
  stepConferenceCamera.allElements = [group, ...];
  
  return stepConferenceCamera;
}
```

### Các Function Chính

1. **`createStepRoomSize()`** - Tạo step cho Room Size (Phonebooth, Huddle, Small, etc.)
2. **`createStepPlatform()`** - Tạo step cho Platform (Google Meet, Teams, Zoom, etc.)
3. **`createStepServices()`** - Tạo step cho Services (Android, PC)
4. **`createStepConferenceCamera()`** - Tạo step cho Conference Camera (RallyBar, RallyBarMini, MeetUp2, etc.)
5. **`createStepAudioExtensions()`** - Tạo step cho Audio Extensions (Mic Pod, Speaker, etc.)
6. **`createStepMeetingController()`** - Tạo step cho Meeting Controller (Tap, Tap IP, etc.)
7. **`createStepVideoAccessories()`** - Tạo step cho Video Accessories
8. **`createStepSoftwareServices()`** - Tạo step cho Software Services

---

## ❓ Tại Sao Không Thấy Code GLB Elements?

### Lý Do

**Hiện tại `permissionUtils.ts` CHỈ tạo elements cho các sản phẩm Threekit** (RallyBar, RallyBarMini, MeetUp2, Mic Pod, Tap, etc.), **KHÔNG có code cho GLB elements** (RallyBoard, RallyBoardWall, etc.) vì:

1. **GLB elements chưa được implement** - Chưa có code tạo elements cho local GLB devices
2. **Cần thêm code** - Bạn cần thêm code để sử dụng `deviceElementConfig.ts` đã tạo

### Code Hiện Tại

```typescript
// permissionUtils.ts - dòng 496-502
stepConferenceCamera.allElements = [
  group,              // ⭐ Elements cho Threekit cameras (RallyBar, RallyBarMini, etc.)
  groupRallyCamera,  // ⭐ Elements cho RallyCamera
  groupCompute,       // ⭐ Elements cho Compute (MiniPC, RoomMate)
  groupSight,        // ⭐ Elements cho Sight
  // ❌ KHÔNG có elements cho GLB devices (RallyBoard, etc.)
];
```

---

## ✅ Cách Thêm Code GLB Elements

### Bước 1: Import deviceElementConfig

**File:** `src/utils/permissionUtils.ts`

```typescript
// Thêm import ở đầu file
import deviceElementsConfig from '../config/deviceElements.json';
import { registerDeviceElementsToStep } from './deviceElementConfig';
```

### Bước 2: Gọi registerDeviceElementsToStep trong createStepConferenceCamera

**File:** `src/utils/permissionUtils.ts` (dòng 146-503)

```typescript
export function createStepConferenceCamera() {
  const stepConferenceCamera = new Step(StepName.ConferenceCamera);
  
  // ... existing code (tạo group, groupRallyCamera, groupCompute, groupSight) ...
  
  // ⭐ THÊM CODE NÀY: Register GLB device elements từ JSON config
  registerDeviceElementsToStep(
    stepConferenceCamera,
    deviceElementsConfig.elements
  );
  
  stepConferenceCamera.allElements = [
    group,
    groupRallyCamera,
    groupCompute,
    groupSight,
    // ⭐ Elements từ JSON config đã được thêm tự động vào step.allElements
  ];
  
  return stepConferenceCamera;
}
```

### Kết Quả

Sau khi thêm code, `permissionUtils.ts` sẽ:
- ✅ Tạo elements cho Threekit devices (như hiện tại)
- ✅ Tạo elements cho GLB devices từ JSON config (RallyBoard, RallyBoardWall, etc.)
- ✅ Tất cả elements được merge vào `stepConferenceCamera.allElements`

---

## 📊 So Sánh: Trước vs Sau

### Trước (Hiện Tại)

```typescript
// permissionUtils.ts
export function createStepConferenceCamera() {
  const stepConferenceCamera = new Step(StepName.ConferenceCamera);
  
  // ... tạo elements cho Threekit devices ...
  
  stepConferenceCamera.allElements = [
    group,              // Threekit cameras
    groupRallyCamera,  // RallyCamera
    groupCompute,      // Compute
    groupSight,        // Sight
    // ❌ KHÔNG có GLB elements
  ];
  
  return stepConferenceCamera;
}
```

**Kết quả:**
- ❌ Không có elements cho GLB devices
- ❌ User không thể chọn GLB devices (RallyBoard, etc.)
- ❌ `addElement()` không tìm thấy element → không tạo mapping

### Sau (Sau Khi Thêm Code)

```typescript
// permissionUtils.ts
import deviceElementsConfig from '../config/deviceElements.json';
import { registerDeviceElementsToStep } from './deviceElementConfig';

export function createStepConferenceCamera() {
  const stepConferenceCamera = new Step(StepName.ConferenceCamera);
  
  // ... tạo elements cho Threekit devices ...
  
  // ⭐ THÊM: Register GLB device elements
  registerDeviceElementsToStep(
    stepConferenceCamera,
    deviceElementsConfig.elements
  );
  
  stepConferenceCamera.allElements = [
    group,              // Threekit cameras
    groupRallyCamera,  // RallyCamera
    groupCompute,      // Compute
    groupSight,        // Sight
    // ✅ GLB elements đã được thêm tự động
  ];
  
  return stepConferenceCamera;
}
```

**Kết quả:**
- ✅ Có elements cho GLB devices (RallyBoard, RallyBoardWall, etc.)
- ✅ User có thể chọn GLB devices
- ✅ `addElement()` tìm thấy element → tạo mapping → render device

---

## 🔍 Flow Hoạt Động

### Flow Hiện Tại (Không Có GLB Elements)

```
User click RallyBoard card
  ↓
getAssetFromCard(card) → assetId = "rallyboard-mount-asset-1"
  ↓
addElement(card) → Tìm element từ card.keyPermission = "RallyBoard"
  ↓
step.getElementByName("RallyBoard") → ❌ KHÔNG TÌM THẤY
  ↓
⚠️ Element not found → Không tạo mapping → Device không render
```

### Flow Sau Khi Thêm Code (Có GLB Elements)

```
User click RallyBoard card
  ↓
getAssetFromCard(card) → assetId = "rallyboard-mount-asset-1"
  ↓
addElement(card) → Tìm element từ card.keyPermission = "RallyBoard"
  ↓
step.getElementByName("RallyBoard") → ✅ TÌM THẤY (từ JSON config)
  ↓
element.getMount().getNameNode() → "RallyBoard_Mount"
  ↓
setElementByNameNode(assetId, "RallyBoard_Mount")
  ↓
Redux Store: { "RallyBoard_Mount": "rallyboard-mount-asset-1" }
  ↓
ProductNode render Product → Device hiển thị! ✅
```

---

## 📝 Tóm Tắt

### permissionUtils.ts Làm Gì?

1. **Tạo Permission System** - Định nghĩa Steps, Elements, Mounts
2. **Tạo Elements cho Threekit devices** - RallyBar, RallyBarMini, MeetUp2, Mic Pod, Tap, etc.
3. **Định nghĩa Business Logic** - Dependencies, conditions, rules, bundles



### Cách Thêm Code GLB Elements?

1. **Import** `deviceElementsConfig` và `registerDeviceElementsToStep`
2. **Gọi** `registerDeviceElementsToStep()` trong `createStepConferenceCamera()`
3. **Kết quả** - GLB elements được tạo tự động từ JSON config

---

## ⚠️ Lưu Ý

- **Phải thêm code** vào `permissionUtils.ts` để GLB elements hoạt động
- **Không thêm code** → GLB devices không hoạt động (không tìm thấy element)
- **Sau khi thêm code** → GLB devices hoạt động bình thường

Tại sao cần Element trong permissionUtils khi đã có JSON và Redux?
Phân biệt 3 thứ:
JSON Config (deviceElements.json)
Chỉ là file cấu hình (text)
Không phải Element object
Permission System không biết về nó
Element Object (trong Permission System)
Là JavaScript object (class instance)
Được tạo từ JSON bằng createDeviceElement()
Có methods: getMount(), getNameNode()
Permission System biết về nó
Redux Store (mapping)
Chỉ lưu mapping: { "RallyBoard_Mount": "asset-id" }
Không phải Element object
Không có methods
