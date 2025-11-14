# Danh Sách Các File Liên Quan Đến RallyBoard

## 📋 Tổng Quan

Tài liệu này liệt kê tất cả các file liên quan đến RallyBoard trong codebase và nhiệm vụ của từng file.

---

## 📁 Documentation Files (Docs)

### 1. `docs/RallyBoard_Selection_Flow_Detailed.md`
**Nhiệm vụ:** 
- Giải thích chi tiết code flow khi user click chọn RallyBoard
- Mô tả từng bước từ user click → Redux update → Product render
- Bao gồm: AddItemCommand, Redux middleware, addElement, ProductNode, Product component

### 2. `docs/RallyBoard_Placement_Guide.md`
**Nhiệm vụ:**
- Hướng dẫn chi tiết đặt RallyBoard vào phòng PhoneBooth với 3 trường hợp:
  1. Thay TV bằng RallyBoard (trên tường)
  2. Đặt RallyBoard ở vị trí `Camera_Commode_mini_display_1`
  3. Xóa credenza và TV khi add RallyBoard with Stand (trên sàn)
- Giải thích cách xác định vị trí TV, cách ẩn/hiện mesh, cách tạo placement node

### 3. `docs/RallyBoardWall_Setup_Guide.md`
**Nhiệm vụ:**
- Hướng dẫn setup RallyBoardWall (variant mới của RallyBoard)
- Sử dụng file GLB `RallyBoard65_CredenzaFeet_CameraBelow-compressed.glb`
- Gắn vào placement node `Tap_Placement_Wall_1` (có sẵn trong scene)
- Hướng dẫn thêm mapping, tạo element, cấu hình permission

### 4. `docs/How_To_Add_RallyBoard_To_PlacementNode.md`
**Nhiệm vụ:**
- Hướng dẫn gắn RallyBoard GLB vào placement node `RallyBoard_Mount`
- Hướng dẫn upload GLB lên Threekit để lấy assetId
- Hướng dẫn cấu hình permission/element cho RallyBoard

### 5. `docs/How_To_Load_GLB_From_Local_File.md`
**Nhiệm vụ:**
- Hướng dẫn load GLB từ local file (không qua Threekit)
- Giải thích cách sử dụng `useLocalAsset`, `LOCAL_ASSET_MAPPING`
- Áp dụng cho RallyBoard (local GLB)

---

## 💻 Source Code Files

### 6. `src/components/Assets/Product.tsx`
**Nhiệm vụ:**
- **Xử lý đặc biệt cho RallyBoard_Mount** (dòng 107-188):
  - Scale down GLB nếu quá lớn (dòng 128-133)
  - Center GLB tại origin (dòng 137-143)
  - Orient RallyBoard để front face hướng về room front (-Z) (dòng 147-151)
- Load GLB asset (local hoặc Threekit)
- Render Product tại vị trí placement node
- **Chỉ xử lý khi `nameNode === "RallyBoard_Mount"`**

### 7. `src/components/Assets/Room.tsx`
**Nhiệm vụ:**
- **Tạo placement node `RallyBoard_Mount` động** (dòng 230-280):
  - Tìm TV mesh trong scene
  - Tính toán vị trí placement node dựa trên TV front face
  - Tạo Object3D với tên "RallyBoard_Mount"
  - Xoay placement node 180 độ theo trục Y để RallyBoard mặt trước hướng ra ngoài
- Kiểm tra `isRallyBoardSelected` để ẩn/hiện TV (dòng 346-348)
- Render scene với ProductsNodes matchers

### 8. `src/components/Assets/ProductsNodes.tsx`
**Nhiệm vụ:**
- **Matcher để ẩn/hiện TV khi RallyBoard được chọn** (dòng 160-174):
  - Check `isRallyBoardSelected` prop
  - Set `threeNode.visible = !isRallyBoardSelected` cho TV nodes
- Matcher để tìm placement nodes và render ProductNode
- **Xử lý TV visibility dựa trên RallyBoard selection**

### 9. `src/components/Assets/ProductNode.tsx`
**Nhiệm vụ:**
- Check Redux store để xem có mapping cho placement node không
- Render Product component nếu có mapping
- **Áp dụng cho tất cả placement nodes, bao gồm RallyBoard_Mount**

### 10. `src/utils/localAssetLoader.ts`
**Nhiệm vụ:**
- **LOCAL_ASSET_MAPPING** (dòng 85-118):
  - Map assetId → file path cho local GLB files
  - Ví dụ: `"rallyboard-mount-asset-1"` → `"/assets/models/RallyBoard65_Standalone-compressed.glb"`
  - `"rallyboard-wall-asset-1"` → `"/assets/models/rallyboard-wall.glb"`
- `useLocalAsset()`: Hook để load GLB từ local file
- `useThreekitAsset()`: Hook để load GLB từ Threekit
- `isLocalAsset()`: Check xem assetId có phải local path không
- `resolveAssetPath()`: Resolve assetId thành file path

### 11. `src/utils/deviceOrientationUtils.ts`
**Nhiệm vụ:**
- **`orientRallyBoard()` function** (dòng 358-368):
  - Orient RallyBoard để front face hướng về room front (-Z direction)
  - Gọi `orientDeviceToRoomFront()` với `deviceType: "RallyBoard"`
  - Đảm bảo screen/display của RallyBoard hướng ra ngoài (không úp vào tường)

### 12. `src/models/configurator/PlacementManager.ts`
**Nhiệm vụ:**
- **`getNameNodeForRallyBoardMount()` method** (dòng 142-143):
  - Return tên placement node: `"RallyBoard_Mount"`
  - Được sử dụng trong ProductsNodes để check TV visibility
- Quản lý tên các placement nodes (Mic, Camera, Tap, TV, RallyBoard, ...)

### 13. `src/store/middleware/index.ts`
**Nhiệm vụ:**
- **Xử lý `addActiveCard` action cho RallyBoard**:
  - Check nếu card là local GLB (không có trong Threekit attributes)
  - Gọi `addElement()` trực tiếp cho local GLB cards (bao gồm RallyBoard)
  - Update Redux store với nodes mapping

### 14. `src/store/slices/ui/handlers/handlers.ts`
**Nhiệm vụ:**
- **`addRallyBoardCard()` function** (dòng 694-771):
  - Thêm RallyBoard card vào UI
  - Xử lý logic đặc biệt cho RallyBoard card
  - Có thể xử lý các trường hợp khác nhau của RallyBoard

### 15. `src/store/slices/configurator/handlers/handlers.ts`
**Nhiệm vụ:**
- **`addElement()` function**:
  - Tạo nodes mapping trong Redux store
  - Lấy `assetId` từ card và `nodeName` từ Element
  - Dispatch `changeValueNodes` để update mapping
  - **Áp dụng cho tất cả products, bao gồm RallyBoard**

### 16. `src/utils/permissionUtils.ts`
**Nhiệm vụ:**
- **Tạo Element cho RallyBoard**:
  - `ItemElement("RallyBoard")` với `MountElement` chứa `nodeName`
  - Cấu hình permission/element cho RallyBoard
  - Định nghĩa default mount (placement node) cho RallyBoard

---

## 📦 Asset Files

### 17. `public/assets/models/RallyBoard65_Standalone-compressed.glb`
**Nhiệm vụ:**
- File GLB 3D model của RallyBoard (standalone version)
- Được sử dụng cho trường hợp RallyBoard trên tường (thay TV)
- Load qua `useLocalAsset()` hoặc `LOCAL_ASSET_MAPPING`

### 18. `public/assets/models/RallyBoard65_CredenzaFeet_CameraBelow-compressed.glb`
**Nhiệm vụ:**
- File GLB 3D model của RallyBoard với credenza và camera
- Được sử dụng cho RallyBoardWall variant
- Gắn vào placement node `Tap_Placement_Wall_1`

---

## 📄 Configuration Files

### 19. `server/prisma/dataLang/products/en-us.json`
**Nhiệm vụ:**
- Cấu hình JSON cho RallyBoard product
- Chứa thông tin về RallyBoard: name, description, assetId, etc.
- Được sử dụng để hiển thị card trong UI

---

## 📚 Other Documentation Files

### 20. `docs/Card_Configuration_Explanation.md`
**Nhiệm vụ:**
- Giải thích cấu hình card cho các sản phẩm
- Có thể chứa ví dụ về RallyBoard card configuration

### 21. `docs/AssetId_To_Redux_Store_Flow_Detailed.md`
**Nhiệm vụ:**
- Giải thích flow từ assetId trong card → Redux store
- Áp dụng cho tất cả products, bao gồm RallyBoard

### 22. `docs/Next_Steps_After_LocalAssetLoader.md`
**Nhiệm vụ:**
- Hướng dẫn các bước tiếp theo sau khi implement local asset loader
- Có thể chứa hướng dẫn về RallyBoard

### 23. `docs/Why_Need_MountElement_When_PlacementNode_Exists.md`
**Nhiệm vụ:**
- Giải thích tại sao cần MountElement khi đã có placement node
- Có thể chứa ví dụ về RallyBoard

---

## 🎯 Tóm Tắt Theo Nhiệm Vụ

### **Core Rendering:**
- `Product.tsx`: Xử lý đặc biệt cho RallyBoard (scale, center, orient)
- `Room.tsx`: Tạo placement node `RallyBoard_Mount` động
- `ProductsNodes.tsx`: Ẩn/hiện TV khi RallyBoard được chọn
- `ProductNode.tsx`: Check mapping và render Product

### **Asset Loading:**
- `localAssetLoader.ts`: Load GLB từ local file, mapping assetId → file path
- `deviceOrientationUtils.ts`: Orient RallyBoard để front face hướng đúng

### **Configuration:**
- `PlacementManager.ts`: Quản lý tên placement node `RallyBoard_Mount`
- `permissionUtils.ts`: Cấu hình Element cho RallyBoard
- `handlers.ts`: Xử lý logic đặc biệt cho RallyBoard card

### **Documentation:**
- Các file `.md` trong `docs/`: Hướng dẫn chi tiết về RallyBoard

### **Assets:**
- `RallyBoard65_Standalone-compressed.glb`: GLB model cho RallyBoard standalone
- `RallyBoard65_CredenzaFeet_CameraBelow-compressed.glb`: GLB model cho RallyBoardWall

---

## 📊 Flow Tổng Quan

```
User Click RallyBoard Card
  ↓
handlers.ts → addRallyBoardCard()
  ↓
middleware/index.ts → addElement()
  ↓
handlers.ts → setElementByNameNode()
  ↓
Redux Store: nodes["RallyBoard_Mount"] = "rallyboard-mount-asset-1"
  ↓
Room.tsx → Tạo placement node "RallyBoard_Mount" động
  ↓
ProductsNodes.tsx → Ẩn TV khi RallyBoard được chọn
  ↓
ProductNode.tsx → Check mapping → render Product
  ↓
Product.tsx → Load GLB từ localAssetLoader.ts
  ↓
Product.tsx → Process scene (scale, center, orient) cho RallyBoard_Mount
  ↓
deviceOrientationUtils.ts → orientRallyBoard()
  ↓
RallyBoard được render tại vị trí placement node
```

---

## 🔍 File Quan Trọng Nhất

1. **`Product.tsx`** - Xử lý đặc biệt cho RallyBoard (scale, center, orient)
2. **`Room.tsx`** - Tạo placement node `RallyBoard_Mount` động
3. **`localAssetLoader.ts`** - Load GLB từ local file
4. **`ProductsNodes.tsx`** - Ẩn/hiện TV khi RallyBoard được chọn
5. **`deviceOrientationUtils.ts`** - Orient RallyBoard đúng hướng

