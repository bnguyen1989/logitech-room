# Phân Tích Chi Tiết PlacementManager.ts

## Tổng Quan

`PlacementManager` là một **utility class** chứa toàn bộ các static methods để quản lý tên của placement nodes trong scene 3D. Class này đóng vai trò là **naming convention manager** - đảm bảo tất cả code trong ứng dụng sử dụng cùng một naming pattern cho placement nodes.

---

## 1. Cấu Trúc Class

```typescript
export class PlacementManager {
  // Tất cả methods đều là static
  // Không cần khởi tạo instance
}
```

**Đặc điểm:**
- **Static class**: Tất cả methods đều là `static`, không cần tạo instance
- **Utility class**: Chỉ chứa helper methods, không có state
- **Naming convention**: Đảm bảo consistency trong naming placement nodes

---

## 2. Phân Tích Từng Method

### 2.1. TV/Display Placement

```typescript
public static getNameNodeForTV(): string {
  return "Display_Placement_1";
}
```

**Ý nghĩa:**
- Trả về tên placement node cho TV/Display
- Chỉ có 1 TV trong phòng → hardcode `"Display_Placement_1"`

**Sử dụng:**
- Khi cần đặt TV vào phòng
- Khi kiểm tra nếu node là TV (không tương tác được)

---

```typescript
public static getNameNodeWithoutInteraction(): string[] {
  return [this.getNameNodeForTV()];
}
```

**Ý nghĩa:**
- Trả về danh sách các placement nodes **không thể tương tác** (không click được)
- Hiện tại chỉ có TV
- Có thể mở rộng thêm các sản phẩm khác không tương tác

**Sử dụng:**
- Trong `Product.tsx` để kiểm tra nếu sản phẩm không tương tác
- Không wrap trong `<Select>` component

---

### 2.2. Microphone Placements

#### 2.2.1. Basic Microphone

```typescript
public static getNameNodeForMic(id?: number): string {
  if (!id) return `Mic_Placement`;
  return `Mic_Placement_${id}`;
}
```

**Ý nghĩa:**
- Trả về tên placement node cho microphone cơ bản
- **Optional parameter `id`**: 
  - Nếu không có `id` → `"Mic_Placement"` (generic)
  - Nếu có `id` → `"Mic_Placement_1"`, `"Mic_Placement_2"`, ...

**Ví dụ:**
```typescript
getNameNodeForMic()        // → "Mic_Placement"
getNameNodeForMic(1)       // → "Mic_Placement_1"
getNameNodeForMic(2)       // → "Mic_Placement_2"
getNameNodeForMic(7)       // → "Mic_Placement_7"
```

**Pattern:**
- Sử dụng optional parameter để support cả generic và specific placement
- Generic name có thể dùng cho fallback hoặc default

---

#### 2.2.2. Microphone With Sight

```typescript
public static getNameNodeForMicWithSight(id?: number): string {
  if (!id) return `Mic_Placement_with_sight`;
  return `Mic_Placement_with_sight_${id}`;
}
```

**Ý nghĩa:**
- Microphone có kèm theo **sight** (cảm biến/thiết bị nhìn)
- Pattern tương tự `getNameNodeForMic()` nhưng có suffix `_with_sight`

**Ví dụ:**
```typescript
getNameNodeForMicWithSight()     // → "Mic_Placement_with_sight"
getNameNodeForMicWithSight(1)    // → "Mic_Placement_with_sight_1"
getNameNodeForMicWithSight(4)    // → "Mic_Placement_with_sight_4"
```

---

#### 2.2.3. Microphone Without Sight

```typescript
public static getNameNodeForMicWithoutSight(id?: number): string {
  if (!id) return `Mic_Placement_not_sight`;
  return `Mic_Placement_not_sight_${id}`;
}
```

**Ý nghĩa:**
- Microphone **không có** sight
- Suffix `_not_sight` để phân biệt với version có sight

**Lý do có 2 loại:**
- Có thể có 2 loại microphone khác nhau (có/không sight)
- Cần placement nodes riêng để đặt đúng loại

---

#### 2.2.4. Microphone Single/Double

```typescript
public static getNameNodeForMicSingle(id?: number): string {
  if (!id) return `Mic_Placement_Single`;
  return `Mic_Placement_Single_${id}`;
}

public static getNameNodeForMicDouble(id?: number): string {
  if (!id) return `Mic_Placement_Double`;
  return `Mic_Placement_Double_${id}`;
}
```

**Ý nghĩa:**
- **Single**: Microphone đơn (1 microphone)
- **Double**: Microphone đôi (2 microphones)
- Có thể có nhiều instances của mỗi loại

**Ví dụ:**
```typescript
getNameNodeForMicSingle(1)   // → "Mic_Placement_Single_1"
getNameNodeForMicDouble(2)   // → "Mic_Placement_Double_2"
```

---

### 2.3. Tap Placements

```typescript
public static getNameNodeForTap(type: "Wall" | "Table", id: number): string {
  return `Tap_Placement_${type}_${id}`;
}
```

**Ý nghĩa:**
- Tap (thiết bị điều khiển) có thể đặt trên **Wall** hoặc **Table**
- **Required parameters**: Cả `type` và `id` đều bắt buộc
- Pattern: `Tap_Placement_{type}_{id}`

**Ví dụ:**
```typescript
getNameNodeForTap("Wall", 1)   // → "Tap_Placement_Wall_1"
getNameNodeForTap("Wall", 2)   // → "Tap_Placement_Wall_2"
getNameNodeForTap("Table", 1)  // → "Tap_Placement_Table_1"
getNameNodeForTap("Table", 2)  // → "Tap_Placement_Table_2"
```

**Type safety:**
- Sử dụng union type `"Wall" | "Table"` để đảm bảo chỉ có 2 loại hợp lệ
- TypeScript sẽ báo lỗi nếu truyền type khác

---

### 2.4. Camera Placements

```typescript
public static getNameNodeForCamera(
  type: "Wall" | "TV",
  id?: number,
  display?: number
): string {
  if (!id) return `Camera_${type}_Placement`;
  let nameNode = `Camera_${type}_Placement_${id}`;
  if (display) nameNode += `_display_${display}`;
  return nameNode;
}
```

**Ý nghĩa:**
- Camera có thể đặt trên **Wall** hoặc trên **TV**
- **Optional `id`**: Số thứ tự camera
- **Optional `display`**: Số thứ tự display (khi camera gắn trên TV có nhiều displays)

**Logic:**
1. Nếu không có `id` → `"Camera_{type}_Placement"` (generic)
2. Nếu có `id` → `"Camera_{type}_Placement_{id}"`
3. Nếu có thêm `display` → thêm `"_display_{display}"`

**Ví dụ:**
```typescript
getNameNodeForCamera("Wall")                    // → "Camera_Wall_Placement"
getNameNodeForCamera("Wall", 1)                 // → "Camera_Wall_Placement_1"
getNameNodeForCamera("TV", 1)                   // → "Camera_TV_Placement_1"
getNameNodeForCamera("TV", 1, 1)               // → "Camera_TV_Placement_1_display_1"
getNameNodeForCamera("TV", 1, 2)               // → "Camera_TV_Placement_1_display_2"
getNameNodeForCamera("Wall", 2, 3)             // → "Camera_Wall_Placement_2_display_3"
```

**Use case với display:**
- Khi TV có nhiều displays, mỗi display có thể có camera riêng
- `display` parameter cho phép phân biệt camera trên display nào

---

### 2.5. Sight Placements

```typescript
public static getNameNodeForSight(): string {
  return "Sight_Placement";
}

public static getNameNodeForSight2(): string {
  return "Sight_Placement_2";
}
```

**Ý nghĩa:**
- Sight (thiết bị nhìn/cảm biến) có 2 placement nodes
- Hardcode tên vì chỉ có 2 instances

**Lý do có 2 methods riêng:**
- Có thể có 2 loại sight khác nhau hoặc 2 vị trí cố định
- Không dùng parameter vì số lượng cố định

---

### 2.6. Camera Commode Placements

```typescript
public static getNameNodeCommodeForCamera(
  type: "RallyBar" | "Huddle" | "Mini",
  display?: number
): string {
  let nameNode = `Camera_Commode_${type}`;
  if (display) nameNode += `_display_${display}`;
  return nameNode;
}
```

**Ý nghĩa:**
- Camera đặt trên **Commode** (tủ/bàn) với các loại: RallyBar, Huddle, Mini
- **Optional `display`**: Tương tự camera trên TV

**Ví dụ:**
```typescript
getNameNodeCommodeForCamera("RallyBar")         // → "Camera_Commode_RallyBar"
getNameNodeCommodeForCamera("Huddle")          // → "Camera_Commode_Huddle"
getNameNodeCommodeForCamera("Mini")            // → "Camera_Commode_Mini"
getNameNodeCommodeForCamera("RallyBar", 2)     // → "Camera_Commode_RallyBar_display_2"
```

**Commode vs Wall/TV:**
- Commode là loại mount riêng (tủ/bàn)
- Khác với camera gắn trực tiếp trên wall hoặc TV

---

### 2.7. Other Product Placements

#### 2.7.1. Scribe

```typescript
public static getNameNodeForScribe(): string {
  return "Scribe_Placement";
}
```

**Ý nghĩa:**
- Scribe (thiết bị ghi chép) - chỉ có 1 instance

---

#### 2.7.2. Swytch

```typescript
public static getNameNodeSwytch(): string {
  return "Swytch_Placement";
}
```

**Ý nghĩa:**
- Swytch (thiết bị chuyển đổi) - chỉ có 1 instance

---

#### 2.7.3. Scheduler

```typescript
public static getNameNodeScheduler(): string {
  return "Scheduler_Placement";
}
```

**Ý nghĩa:**
- Scheduler (thiết bị lập lịch) - chỉ có 1 instance

---

#### 2.7.4. Logitech Extend

```typescript
public static getNameNodeForLogitechExtend(): string {
  return "LogitechExtend_Placement";
}
```

**Ý nghĩa:**
- Logitech Extend (thiết bị mở rộng) - chỉ có 1 instance

---

### 2.8. Mount Placements

#### 2.8.1. Microphone Pod Mount

```typescript
public static getNameNodeMicPodMount(): string {
  return "Pod_Table_Mount_mic_point";
}
```

**Ý nghĩa:**
- Mount point cho microphone pod trên bàn
- Naming khác một chút: `_mic_point` thay vì `_Placement`

---

#### 2.8.2. Tap Mounts

```typescript
public static getNameNodeTapRiserMount(): string {
  return "Tap_Riser_Mount_Placement";
}

public static getNameNodeTapTableMount(): string {
  return "Tap_Table_Mount_Placement";
}
```

**Ý nghĩa:**
- **Riser Mount**: Tap mount trên riser (giá đỡ)
- **Table Mount**: Tap mount trên bàn
- 2 loại mount khác nhau cho Tap

---

#### 2.8.3. Camera Mounts

```typescript
public static getNameNodeCameraWallMount(): string {
  return "Camera_Wall_Mount_Placement";
}

public static getNameNodeCameraTVMount(): string {
  return "Camera_TV_Mount_placement";
}
```

**Ý nghĩa:**
- **Wall Mount**: Mount cho camera trên tường
- **TV Mount**: Mount cho camera trên TV
- Lưu ý: `TV_Mount_placement` (chữ thường) khác với pattern khác

**Inconsistency:**
- Hầu hết dùng `_Placement` (chữ P hoa)
- Nhưng `Camera_TV_Mount_placement` dùng `_placement` (chữ p thường)
- Có thể là lỗi hoặc legacy code

---

#### 2.8.4. Pendant Mounts

```typescript
public static getNameNodePendantMount(id?: number): string {
  if (!id) return `Mic_Placement_pedant`;
  return `Mic_Placement_pedant_${id}`;
}
```

**Ý nghĩa:**
- Pendant mount (mount treo) cho microphone
- Có thể có nhiều instances (8 instances theo `getAllPlacement()`)
- **Lưu ý**: `pedant` có thể là typo của `pendant`

**Variants:**

```typescript
// Single/Double
public static getNameNodePendantMountSingle(id?: number): string {
  if (!id) return `Mic_Placement_pedant_Single`;
  return `Mic_Placement_pedant_Single_${id}`;
}

public static getNameNodePendantMountDouble(id?: number): string {
  if (!id) return `Mic_Placement_pedant_Double`;
  return `Mic_Placement_pedant_Double_${id}`;
}

// With/Without Sight
public static getNameNodePendantMountWithSight(id?: number): string {
  if (!id) return `Mic_Placement_pedant_with_sight`;
  return `Mic_Placement_pedant_with_sight_${id}`;
}

public static getNameNodePendantMountWithoutSight(id?: number): string {
  if (!id) return `Mic_Placement_pedant_not_sight`;
  return `Mic_Placement_pedant_not_sight_${id}`;
}
```

**Pattern:**
- Tương tự microphone placements
- Có Single/Double và With/Without Sight variants

---

#### 2.8.5. Pod Pendant Mount

```typescript
public static getNameNodePodPendantMount(): string {
  return "Pod_Pendant_Mount_Point";
}
```

**Ý nghĩa:**
- Mount point cho pod pendant
- Naming: `_Point` thay vì `_Placement`

---

#### 2.8.6. Scheduler Mounts

```typescript
public static getNameNodeAngleMountScheduler(): string {
  return "Angle_Mount_scheduler_point";
}

public static getNameNodeSideMountScheduler(): string {
  return "Side_Mount_scheduler_point";
}
```

**Ý nghĩa:**
- **Angle Mount**: Mount góc cho scheduler
- **Side Mount**: Mount bên cho scheduler
- Naming: `_point` (chữ thường)

---

### 2.9. Special Camera Placements

```typescript
public static getNameNodeCameraRalyPlus(): string {
  return "Camera_Placement_RalyPlus";
}
```

**Ý nghĩa:**
- Camera đặc biệt cho Rally Plus
- **Lưu ý**: `RalyPlus` có thể là typo của `RallyPlus`

---

```typescript
public static getNameNodeCameraRallyPlusBackWall(): string[] {
  return [PlacementManager.getNameNodeForCamera("Wall", 4)];
}

public static getNameNodeCameraRallyPlusAboveTV(): string[] {
  return [
    PlacementManager.getNameNodeForCamera("Wall", 2),
    PlacementManager.getNameNodeForCamera("Wall", 3),
  ];
}
```

**Ý nghĩa:**
- **Back Wall**: Trả về camera placement trên tường sau (Wall 4)
- **Above TV**: Trả về 2 camera placements trên tường (Wall 2 và 3)
- **Return type**: `string[]` thay vì `string` - trả về array các placements

**Use case:**
- Rally Plus có thể cần nhiều cameras ở các vị trí cụ thể
- Methods này group các placements lại

---

### 2.10. Dimension Nodes

```typescript
public static getNameNodeRoomLength(id: number): string {
  return `Room_Length_${id}`;
}

public static getNameNodeRoomWidth(id: number): string {
  return `Room_Width_${id}`;
}

public static getNameNodeTableLength(id: number): string {
  return `Table_Length_${id}`;
}

public static getNameNodeTableDimension(): string {
  return `Table_Dimension`;
}

public static getNameNodeTableEndDimension(): string {
  return `Table_End_Dimension`;
}
```

**Ý nghĩa:**
- **Không phải placement nodes** cho sản phẩm
- Dùng cho **dimension measurements** (kích thước)
- `Room_Length_{id}`, `Room_Width_{id}`: Kích thước phòng
- `Table_Length_{id}`: Chiều dài bàn
- `Table_Dimension`, `Table_End_Dimension`: Kích thước bàn

**Lưu ý:**
- Các nodes này không được include trong `getAllPlacement()`
- Dùng riêng cho dimension display

---

## 3. getAllPlacement() - Method Quan Trọng Nhất

### 3.1. Tổng Quan

```typescript
static getAllPlacement(): string[] {
  const placements: string[] = [];
  // ... tạo array chứa tất cả placement node names
  return placements;
}
```

**Chức năng:**
- Trả về **danh sách tất cả placement node names** trong hệ thống
- Được sử dụng bởi `ProductsNodes()` để tìm placement nodes trong scene

**Sử dụng:**
```typescript
// Trong ProductsNodes.tsx
const allNodePlacement = PlacementManager.getAllPlacement();
// allNodePlacement = ["Mic_Placement_1", "Mic_Placement_2", ...]
```

---

### 3.2. Phân Tích Từng Phần

#### 3.2.1. Basic Microphones (7 instances)

```typescript
Array.from({ length: 7 }, (_, i) => i + 1).forEach((num) =>
  placements.push(this.getNameNodeForMic(num))
);
```

**Giải thích:**
- `Array.from({ length: 7 }, (_, i) => i + 1)`: Tạo array `[1, 2, 3, 4, 5, 6, 7]`
- `forEach((num) => ...)`: Với mỗi số từ 1 đến 7
- `this.getNameNodeForMic(num)`: Tạo tên `"Mic_Placement_1"`, `"Mic_Placement_2"`, ...
- **Kết quả**: 7 microphone placements

**Tại sao 7?**
- Có thể là số lượng tối đa microphones trong phòng lớn nhất
- Hoặc số lượng placement nodes được thiết kế trong scene

---

#### 3.2.2. Tap Placements (Wall và Table)

```typescript
["Wall", "Table"].forEach((type: any) => {
  Array.from({ length: 2 }, (_, i) => i + 1).forEach((num) =>
    placements.push(this.getNameNodeForTap(type, num))
  );
});
```

**Giải thích:**
- Với mỗi type (`"Wall"`, `"Table"`)
- Tạo 2 placements (num từ 1 đến 2)
- **Kết quả**: 
  - `"Tap_Placement_Wall_1"`, `"Tap_Placement_Wall_2"`
  - `"Tap_Placement_Table_1"`, `"Tap_Placement_Table_2"`
  - **Tổng: 4 tap placements**

---

#### 3.2.3. TV Camera Placements

```typescript
["TV"].forEach((type: any) => {
  Array.from({ length: 2 }, (_, i) => i + 1).forEach((num) => {
    placements.push(this.getNameNodeForCamera(type, num));
    placements.push(this.getNameNodeForCamera(type, num, num));
    placements.push(this.getNameNodeForCamera(type, num, num + 1));
  });
});
```

**Giải thích:**
- Với mỗi TV camera (2 cameras: num = 1, 2)
- Tạo **3 placements** cho mỗi camera:
  1. `getNameNodeForCamera("TV", num)` → `"Camera_TV_Placement_1"`, `"Camera_TV_Placement_2"`
  2. `getNameNodeForCamera("TV", num, num)` → `"Camera_TV_Placement_1_display_1"`, `"Camera_TV_Placement_2_display_2"`
  3. `getNameNodeForCamera("TV", num, num + 1)` → `"Camera_TV_Placement_1_display_2"`, `"Camera_TV_Placement_2_display_3"`

**Kết quả:**
- 2 cameras × 3 placements = **6 TV camera placements**

**Lý do 3 placements:**
- Camera có thể gắn trên display chính hoặc display phụ
- `display_1`, `display_2`, `display_3` cho phép linh hoạt

---

#### 3.2.4. Wall Camera Placements

```typescript
["Wall"].forEach((type: any) => {
  Array.from({ length: 4 }, (_, i) => i + 1).forEach((num) => {
    placements.push(this.getNameNodeForCamera(type, num));
    placements.push(this.getNameNodeForCamera(type, num, num));
    placements.push(this.getNameNodeForCamera(type, num, num + 1));
  });
});
```

**Giải thích:**
- Tương tự TV cameras nhưng có **4 cameras** (num từ 1 đến 4)
- Mỗi camera có 3 placements (base, display_self, display_next)

**Kết quả:**
- 4 cameras × 3 placements = **12 wall camera placements**

---

#### 3.2.5. Pendant Mounts (8 instances)

```typescript
Array.from({ length: 8 }, (_, i) => i + 1).forEach((num) =>
  placements.push(this.getNameNodePendantMount(num))
);
```

**Kết quả:**
- `"Mic_Placement_pedant_1"` đến `"Mic_Placement_pedant_8"`
- **8 pendant mount placements**

---

#### 3.2.6. Microphone With/Without Sight (4 instances mỗi loại)

```typescript
Array.from({ length: 4 }, (_, i) => i + 1).forEach((num) => {
  placements.push(this.getNameNodeForMicWithSight(num));
  placements.push(this.getNameNodeForMicWithoutSight(num));
});
```

**Kết quả:**
- 4 with sight + 4 without sight = **8 microphone placements**

---

#### 3.2.7. Pendant Mount With/Without Sight (4 instances mỗi loại)

```typescript
Array.from({ length: 4 }, (_, i) => i + 1).forEach((num) => {
  placements.push(this.getNameNodePendantMountWithSight(num));
  placements.push(this.getNameNodePendantMountWithoutSight(num));
});
```

**Kết quả:**
- 4 with sight + 4 without sight = **8 pendant mount placements**

---

#### 3.2.8. Microphone Single/Double (2 instances mỗi loại)

```typescript
Array.from({ length: 2 }, (_, i) => i + 1).forEach((num) => {
  placements.push(this.getNameNodeForMicSingle(num));
  placements.push(this.getNameNodeForMicDouble(num));
});
```

**Kết quả:**
- 2 single + 2 double = **4 microphone placements**

---

#### 3.2.9. Pendant Mount Single/Double (2 instances mỗi loại)

```typescript
Array.from({ length: 2 }, (_, i) => i + 1).forEach((num) => {
  placements.push(this.getNameNodePendantMountSingle(num));
  placements.push(this.getNameNodePendantMountDouble(num));
});
```

**Kết quả:**
- 2 single + 2 double = **4 pendant mount placements**

---

#### 3.2.10. Single Placements (Hardcoded)

```typescript
placements.push(
  this.getNameNodeForScribe(),              // "Scribe_Placement"
  this.getNameNodeSwytch(),                  // "Swytch_Placement"
  this.getNameNodeScheduler(),              // "Scheduler_Placement"
  this.getNameNodeMicPodMount(),            // "Pod_Table_Mount_mic_point"
  this.getNameNodeTapRiserMount(),          // "Tap_Riser_Mount_Placement"
  this.getNameNodeTapTableMount(),          // "Tap_Table_Mount_Placement"
  this.getNameNodeCameraWallMount(),        // "Camera_Wall_Mount_Placement"
  this.getNameNodeCameraTVMount(),          // "Camera_TV_Mount_placement"
  this.getNameNodeForSight(),                // "Sight_Placement"
  this.getNameNodePodPendantMount(),         // "Pod_Pendant_Mount_Point"
  this.getNameNodeAngleMountScheduler(),     // "Angle_Mount_scheduler_point"
  this.getNameNodeSideMountScheduler(),      // "Side_Mount_scheduler_point"
  this.getNameNodeCommodeForCamera("RallyBar"),      // "Camera_Commode_RallyBar"
  this.getNameNodeCommodeForCamera("RallyBar", 2),  // "Camera_Commode_RallyBar_display_2"
  this.getNameNodeCommodeForCamera("Huddle"),       // "Camera_Commode_Huddle"
  this.getNameNodeCommodeForCamera("Mini"),          // "Camera_Commode_Mini"
  this.getNameNodeCommodeForCamera("Mini", 1),      // "Camera_Commode_Mini_display_1"
  this.getNameNodeForTV(),                   // "Display_Placement_1"
  this.getNameNodeCameraRalyPlus(),         // "Camera_Placement_RalyPlus"
  this.getNameNodeForSight2(),              // "Sight_Placement_2"
  this.getNameNodeForLogitechExtend()        // "LogitechExtend_Placement"
);
```

**Kết quả:**
- **20 single placements** (mỗi loại chỉ có 1 instance)

---

### 3.3. Tổng Kết getAllPlacement()

**Tổng số placements:**

| Loại | Số lượng |
|------|----------|
| Basic Microphones | 7 |
| Tap (Wall + Table) | 4 |
| TV Cameras | 6 |
| Wall Cameras | 12 |
| Pendant Mounts | 8 |
| Mic With/Without Sight | 8 |
| Pendant With/Without Sight | 8 |
| Mic Single/Double | 4 |
| Pendant Single/Double | 4 |
| Single Placements | 20 |
| **TỔNG** | **~85 placements** |

**Lưu ý:**
- Số lượng chính xác có thể thay đổi khi thêm/sửa code
- `getAllPlacement()` được gọi mỗi khi render scene để tìm placement nodes

---

## 4. Naming Conventions

### 4.1. Pattern Chung

```
{ProductType}_Placement_{Variant}_{Id}_{SubVariant}
```

**Ví dụ:**
- `Mic_Placement_1` → ProductType: Mic, Variant: none, Id: 1
- `Camera_TV_Placement_1_display_2` → ProductType: Camera, Variant: TV, Id: 1, SubVariant: display_2
- `Tap_Placement_Wall_1` → ProductType: Tap, Variant: Wall, Id: 1

### 4.2. Inconsistencies

1. **Case sensitivity:**
   - Hầu hết: `_Placement` (P hoa)
   - Một số: `_placement` (p thường) - `Camera_TV_Mount_placement`
   - Một số: `_point` (chữ thường) - `Pod_Table_Mount_mic_point`

2. **Typo:**
   - `pedant` thay vì `pendant`
   - `RalyPlus` thay vì `RallyPlus`

3. **Naming style:**
   - Hầu hết: `{Type}_Placement_{Id}`
   - Một số: `{Type}_Mount_{Variant}_point`

---

## 5. Sử Dụng Trong Codebase

### 5.1. ProductsNodes.tsx

```typescript
export const ProductsNodes = () => {
  const allNodePlacement = PlacementManager.getAllPlacement();
  // Sử dụng để match placement nodes trong scene
};
```

### 5.2. Product.tsx

```typescript
if (PlacementManager.getNameNodeWithoutInteraction().includes(nameNode)) {
  // Sản phẩm không tương tác (như TV)
}
```

### 5.3. GLTFNode.tsx

```typescript
.filter(
  (name) => !name.includes(PlacementManager.getNameNodeForTV())
);
```

### 5.4. Handlers (addElement, removeElement)

```typescript
// Sử dụng các methods để lấy tên placement node
const nodeName = mountElement.getNameNode(); // Trả về tên từ PlacementManager
setElementByNameNode(assetId, nodeName)(store);
```

---

## 6. Best Practices và Recommendations

### 6.1. Naming Consistency

**Nên:**
- Sử dụng `_Placement` (P hoa) cho tất cả
- Hoặc standardize thành `_placement` (p thường)
- Tránh mix case

**Hiện tại:**
- Có mix giữa `_Placement`, `_placement`, `_point`
- Nên refactor để consistent

### 6.2. Fix Typos

**Nên fix:**
- `pedant` → `pendant`
- `RalyPlus` → `RallyPlus`

**Lưu ý:**
- Cần đảm bảo scene 3D cũng dùng tên đúng
- Nếu scene đã dùng tên cũ, cần update cả scene hoặc giữ backward compatibility

### 6.3. Type Safety

**Hiện tại:**
```typescript
["Wall", "Table"].forEach((type: any) => {
  // type: any - không type safe
});
```

**Nên:**
```typescript
(["Wall", "Table"] as const).forEach((type: "Wall" | "Table") => {
  // Type safe
});
```

### 6.4. Documentation

**Nên thêm:**
- JSDoc comments cho mỗi method
- Giải thích khi nào dùng method nào
- Ví dụ sử dụng

---

## 7. Tóm Tắt

### 7.1. Chức Năng Chính

1. **Naming Convention Manager**: Đảm bảo consistency trong naming
2. **Placement Node Registry**: Quản lý tất cả placement node names
3. **Utility Methods**: Cung cấp methods để lấy tên node cho từng loại sản phẩm

### 7.2. Điểm Quan Trọng

1. **Static class**: Không cần instance
2. **getAllPlacement()**: Method quan trọng nhất, trả về tất cả placements
3. **Optional parameters**: Nhiều methods dùng optional `id` để support cả generic và specific
4. **Type safety**: Một số methods dùng union types để đảm bảo type safety

### 7.3. Cải Thiện Có Thể

1. Fix typos (`pedant`, `RalyPlus`)
2. Standardize naming (`_Placement` vs `_placement` vs `_point`)
3. Thêm JSDoc comments
4. Improve type safety (tránh `any`)
5. Có thể tách thành multiple files nếu quá lớn

---

## Kết Luận

`PlacementManager` là một utility class quan trọng trong hệ thống, đảm bảo tất cả code sử dụng cùng naming convention cho placement nodes. Class này đóng vai trò là **single source of truth** cho placement node names, giúp dễ dàng maintain và extend trong tương lai.

