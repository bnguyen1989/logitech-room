# Hướng Dẫn: Gắn RallyBoard GLB Vào Placement Node RallyBoard_Mount

## Tổng Quan

Để gắn file GLB của RallyBoard vào vị trí placement node `RallyBoard_Mount`, bạn cần:

1. ✅ **Upload GLB lên Threekit** để lấy assetId
2. ✅ **Cấu hình permission/element** để map RallyBoard vào `RallyBoard_Mount`
3. ✅ **Đảm bảo placement node** `RallyBoard_Mount` đã có trong scene (đã tạo động trong Room.tsx)

---

## Bước 1: Upload GLB Lên Threekit Để Lấy AssetId

### 1.1. Upload File GLB

**Cách làm:**
1. Đăng nhập vào **Threekit Platform**
2. Vào **Assets** hoặc **Products** section
3. Upload file GLB của RallyBoard (trường hợp 1: RallyBoard trên tường)
4. Sau khi upload, Threekit sẽ tạo một **assetId** cho file GLB này
5. **Ghi lại assetId** này (ví dụ: `"rallyboard-wall-asset-id-123"`)

**Lưu ý:**
- Mỗi trường hợp RallyBoard (1, 2, 3) cần upload GLB riêng → 3 assetId khác nhau
- AssetId thường là một string dài (ví dụ: `"abc123def456ghi789"`)

### 1.2. Lấy AssetId

**Cách lấy assetId:**
- Từ Threekit dashboard: Copy assetId từ asset details
- Hoặc từ API response khi upload
- Hoặc từ URL của asset trong Threekit

**Ví dụ assetId:**
```
rallyboard-wall-asset-id-123  (trường hợp 1: trên tường)
rallyboard-credenza-asset-id-456  (trường hợp 2: trên credenza)
rallyboard-floor-asset-id-789  (trường hợp 3: trên sàn với stand)
```

---

## Bước 2: Tìm File Cấu Hình Permission/Element Cho RallyBoard

### 2.1. Tìm File Cấu Hình

**Cách làm:**
1. Tìm file cấu hình permission/element cho RallyBoard
2. File này có thể là:
   - JSON file trong `server/prisma/dataLang/` hoặc tương tự
   - TypeScript file trong `src/models/permission/`
   - Hoặc file cấu hình khác trong project

**Cách tìm:**
- Tìm các file có chứa tên sản phẩm khác (ví dụ: "mic", "camera") để biết cấu trúc
- Tìm file có chứa `ItemElement` hoặc `MountElement`
- Tìm file có chứa `getDefaultMount()` hoặc `getNameNode()`

### 2.2. Cấu Trúc Element Thường Có

**Ví dụ cấu trúc:**
```json
{
  "rallyboard": {
    "name": "RallyBoard",
    "keyPermission": "rallyboard",
    "element": {
      "type": "ItemElement",
      "defaultMount": {
        "type": "MountElement",
        "name": "RallyBoard_Mount",
        "nameNode": "RallyBoard_Mount"  // ← Phải trả về "RallyBoard_Mount"
      }
    }
  }
}
```

---

## Bước 3: Cấu Hình Element Cho RallyBoard (Trường Hợp 1)

### 3.1. Tạo Hoặc Cập Nhật Element

**Mục đích:** Đảm bảo khi user chọn RallyBoard, `defaultMount.getNameNode()` trả về `"RallyBoard_Mount"`

**Cách làm:**
1. Tìm hoặc tạo `ItemElement` cho RallyBoard
2. Tạo `MountElement` với:
   - `name`: `"RallyBoard_Mount"` (hoặc tên phù hợp)
   - `nameNode`: Phải trả về `"RallyBoard_Mount"` khi gọi `getNameNode()`

**Có 2 cách:**

**Cách 1: Sử dụng PlacementManager (khuyến nghị)**
- Trong `MountElement`, khi gọi `getNameNode()`, nó gọi `PlacementManager.getNameNodeForRallyBoardMount()`
- Method này đã được thêm vào PlacementManager → trả về `"RallyBoard_Mount"`

**Cách 2: Hardcode nameNode**
- Trong `MountElement`, hardcode `nameNode = "RallyBoard_Mount"`

### 3.2. Đảm Bảo Element Được Thêm Vào Permission

**Cách làm:**
1. Tìm file cấu hình permission cho step tương ứng (ví dụ: step "Video" hoặc step mới)
2. Thêm RallyBoard element vào step đó
3. Đảm bảo `keyPermission` của RallyBoard được thêm vào permission

---

## Bước 4: Cấu Hình Card Cho RallyBoard

### 4.1. Tạo Card Cho RallyBoard

**Mục đích:** Card chứa thông tin về RallyBoard, bao gồm assetId

**Cách làm:**
1. Tìm file cấu hình cards (có thể trong cùng file với permission)
2. Tạo card mới cho RallyBoard:
   ```json
   {
     "rallyboard": {
       "keyPermission": "rallyboard",
       "assetId": "rallyboard-wall-asset-id-123",  // ← AssetId từ Threekit
       "name": "RallyBoard",
       "counter": {
         "min": 0,
         "max": 1
       }
     }
   }
   ```

**Lưu ý:**
- `assetId` phải là assetId từ Threekit (bước 1)
- `keyPermission` phải khớp với `keyPermission` trong element (bước 3)

### 4.2. Đảm Bảo Card Được Thêm Vào Step

**Cách làm:**
1. Tìm step tương ứng (ví dụ: step "Video")
2. Thêm card RallyBoard vào step đó
3. Đảm bảo card có trong `step.cards`

---

## Bước 5: Kiểm Tra Flow Hoàn Chỉnh

### 5.1. Flow Khi User Chọn RallyBoard

```
1. User chọn RallyBoard từ UI
   ↓
2. Handler gọi: addElement(card, StepName.Video)(store)
   ↓
3. Get Element: step.getElementByName("rallyboard")
   ↓
4. Get Mount: element.getDefaultMount()
   ↓
5. Get Node Name: mount.getNameNode()
   → "RallyBoard_Mount"  ← Phải trả về đúng tên này
   ↓
6. Get Asset ID: getAssetFromCard(card)
   → "rallyboard-wall-asset-id-123"  ← AssetId từ Threekit
   ↓
7. Map vào Redux: setElementByNameNode("rallyboard-wall-asset-id-123", "RallyBoard_Mount")
   ↓
8. Redux Store Update:
   nodes["RallyBoard_Mount"] = "rallyboard-wall-asset-id-123"
   ↓
9. ProductNode Re-render
   ↓
10. ProductNode thấy có mapping → render Product
   ↓
11. Product load asset từ Threekit:
    useAsset({ assetId: "rallyboard-wall-asset-id-123", configuration })
   ↓
12. Render tại vị trí placement node RallyBoard_Mount
   ↓
13. ✅ RallyBoard hiển thị tại trung tâm TV!
```

### 5.2. Các Điểm Cần Kiểm Tra

**Checklist:**
- [ ] GLB đã được upload lên Threekit
- [ ] AssetId đã được ghi lại
- [ ] Placement node `RallyBoard_Mount` đã được tạo trong scene (Room.tsx)
- [ ] `PlacementManager.getNameNodeForRallyBoardMount()` đã được thêm
- [ ] `RallyBoard_Mount` đã được thêm vào `getAllPlacement()`
- [ ] Element cho RallyBoard đã được tạo với `defaultMount` trả về `"RallyBoard_Mount"`
- [ ] Card cho RallyBoard đã được tạo với `assetId` đúng
- [ ] Card và Element đã được thêm vào step tương ứng

---

## Bước 6: Test

### 6.1. Các Bước Test

1. **Load phòng phoneBooth:**
   - Kiểm tra console log: `"✅ Đã tạo placement node RallyBoard_Mount"`
   - Kiểm tra PlacementNodesVisualizer có hiển thị marker tại vị trí TV không

2. **Chọn RallyBoard từ UI:**
   - Click chọn RallyBoard (trường hợp 1)
   - Kiểm tra console log xem có mapping được tạo không

3. **Kiểm tra Redux store:**
   - Mở Redux DevTools
   - Kiểm tra `state.configurator.nodes["RallyBoard_Mount"]` có assetId không

4. **Kiểm tra 3D scene:**
   - RallyBoard có hiển thị tại vị trí TV không
   - TV có bị ẩn không (nếu đã implement logic ẩn TV)

### 6.2. Debug Nếu Không Hoạt Động

**Nếu RallyBoard không hiển thị:**

1. **Kiểm tra placement node:**
   - Console log: `"🔍 PlacementNodesVisualizer - Found nodes"`
   - Xem `RallyBoard_Mount` có trong `nodeNames` không
   - Nếu không có → node chưa được tạo hoặc chưa được detect

2. **Kiểm tra Redux store:**
   - Redux DevTools: `state.configurator.nodes`
   - Xem có `"RallyBoard_Mount": "asset-id"` không
   - Nếu không có → element/mount chưa được cấu hình đúng

3. **Kiểm tra assetId:**
   - Console log khi load Product
   - Xem có lỗi load asset từ Threekit không
   - Kiểm tra assetId có đúng không

4. **Kiểm tra element/mount:**
   - Console log trong `addElement()`
   - Xem `mount.getNameNode()` có trả về `"RallyBoard_Mount"` không
   - Nếu không → cấu hình mount chưa đúng

---

## Tóm Tắt

### Để Gắn RallyBoard Vào Placement Node:

1. ✅ **Upload GLB lên Threekit** → Lấy assetId
2. ✅ **Cấu hình Element:**
   - Tạo `ItemElement` cho RallyBoard
   - Tạo `MountElement` với `getNameNode()` trả về `"RallyBoard_Mount"`
3. ✅ **Cấu hình Card:**
   - Tạo card với `assetId` từ Threekit
   - Thêm card vào step tương ứng
4. ✅ **Đảm bảo placement node:**
   - Node `RallyBoard_Mount` đã được tạo trong scene (Room.tsx)
   - Node đã được thêm vào PlacementManager

### Khi User Chọn RallyBoard:

- `addElement()` được gọi
- `mount.getNameNode()` trả về `"RallyBoard_Mount"`
- `setElementByNameNode(assetId, "RallyBoard_Mount")` map vào Redux
- `ProductNode` detect mapping → render `Product`
- `Product` load asset từ Threekit và render tại vị trí `RallyBoard_Mount`

---

## Lưu Ý Quan Trọng

1. **Cần dùng Threekit để lấy assetId:**
   - ✅ **CÓ**, bạn **PHẢI** upload GLB lên Threekit để lấy assetId
   - Hệ thống sử dụng `useAsset({ assetId, configuration })` để load asset từ Threekit
   - Không thể load GLB trực tiếp từ file local

2. **AssetId là bắt buộc:**
   - Không có assetId → không thể load asset từ Threekit
   - AssetId phải là ID hợp lệ từ Threekit platform

3. **Cấu hình element/mount là bắt buộc:**
   - Nếu không cấu hình → `addElement()` không biết map vào placement node nào
   - `defaultMount.getNameNode()` phải trả về `"RallyBoard_Mount"`

