# Hướng Dẫn Chi Tiết: Đặt RallyBoard Vào Phòng PhoneBooth - 3 Trường Hợp

## Tổng Quan

Bạn có sản phẩm **RallyBoard** với 3 trường hợp đặt khác nhau trong phòng **phoneBooth**:

1. **Trường hợp 1**: Thay TV bằng RallyBoard (trên tường)
2. **Trường hợp 2**: Đặt RallyBoard ở vị trí `Camera_Commode_mini_display_1` (tái sử dụng placement node đã có, dùng cho các sản phẩm khác nếu được)
3. **Trường hợp 3**: Xóa credenza và TV khi add RallyBoard with Stand, đặt RallyBoard trên sàn, sát tường (chỗ để credenza và TV cũ)

Mỗi trường hợp sẽ có 1 file GLB riêng của RallyBoard.

---

## Câu Hỏi 1: TV Được Xác Định Vị Trí Như Thế Nào?

### Trả Lời Ngắn Gọn

- ✅ **TV là mesh được designer gắn sẵn trong file GLB của Room scene (phoneBooth)**
- ✅ **KHÔNG có file code nào xác định vị trí TV**
- ✅ **Vị trí TV được hardcode trong scene 3D bởi designer**

### Chi Tiết

**TV trong hệ thống:**
- TV là một **Mesh object** trong scene GLB
- TV có tên node (ví dụ: `"TV"`, `"Display"`, `"TV_Mesh"`, ...) - tên này do designer đặt
- TV có vị trí (position), rotation, scale được định nghĩa trong scene 3D
- TV **KHÔNG phải là sản phẩm động** - không được load từ Threekit, không có trong Redux store

**Để thay TV bằng RallyBoard:**
- Bạn cần **tìm tên node của TV mesh** trong scene
- **Ẩn TV mesh** khi RallyBoard được đặt (bằng cách set `visible = false`)
- **Hiện TV mesh lại** khi RallyBoard bị xóa

---

## Trường Hợp 1: Thay TV Bằng RallyBoard (Trên Tường)

### Mô Tả
- Thay TV bằng RallyBoard
- RallyBoard được đặt trên tường, tại vị trí TV cũ
- **Không có placement node sẵn ở vị trí TV** → Cần tạo placement node tạm thời
- **Tên placement node:** `RallyBar_Mount` (tạo động dựa trên vị trí TV)

### Các Bước Thực Hiện

#### Bước 1: Tìm Tên Node Của TV Mesh Trong Scene

**Mục đích:** Để có thể ẩn TV khi RallyBoard được đặt

**Cách làm:**
1. Mở file `src/components/Assets/Room.tsx`
2. Trong `useEffect` (sau khi `gltf` được load), thêm code để traverse scene và log tất cả nodes
3. Tìm tất cả Mesh objects trong scene
4. Log ra tên của từng mesh
5. Tìm mesh có tên liên quan đến TV (ví dụ: `"TV"`, `"Display"`, `"TV_Mesh"`, `"Screen"`, `"Monitor"`, ...)
6. Ghi lại tên chính xác của TV mesh (ví dụ: `"TV"` hoặc `"Display_Mesh"`)

**Lưu ý:** 
- Tên TV mesh có thể khác nhau tùy designer
- Có thể có nhiều mesh liên quan đến TV (khung, màn hình, ...) - cần tìm đúng mesh chính
- Nếu không chắc, log ra tất cả mesh names và xem trong scene 3D để xác định

**✅ Đã xác định cho phoneBooth:**
- **Parent group (khuyến nghị ẩn):** `Phonebooth_tv` (Object3D) - ẩn node này sẽ ẩn toàn bộ TV
- **TV display mesh:** `tv_display_phonebooth` (Mesh) - màn hình TV
- **TV body mesh:** `tv_body_phonebooth` (Mesh) - thân TV
- **TV mount mesh:** `tv_mount_phonebooth` (Mesh) - giá đỡ TV

#### Bước 2: Tạo Placement Node Tạm Thời Tại Vị Trí TV

**Mục đích:** Tạo placement node `RallyBar_Mount` tại vị trí TV để có thể đặt RallyBoard

**Lý do:**
- ⚠️ **Không có placement node sẵn ở vị trí TV** trong scene phoneBooth
- ✅ **Cần tạo placement node tạm thời** với tên `RallyBar_Mount` tại vị trí TV

**Cách làm:**
1. Trong `Room.tsx`, trong `useEffect` sau khi `gltf` được load
2. Tìm node `Phonebooth_tv` hoặc `tv_display_phonebooth` trong scene
3. Lấy position, rotation, scale của TV node
4. Tính world position (có tính đến parent transforms)
5. Kiểm tra xem node `RallyBar_Mount` đã tồn tại chưa (tránh tạo duplicate)
6. Nếu chưa có, tạo Object3D mới với tên `RallyBar_Mount`
7. Set position, rotation, scale giống TV
8. Thêm vào scene: `gltf.scene.add(placementNode)`

**Lưu ý quan trọng:**
- **KHÔNG THỂ** đặt sản phẩm vào vị trí không có placement node
- Placement node là **BẮT BUỘC** để hệ thống biết đặt sản phẩm ở đâu
- Nếu chỉ ẩn TV mà không có placement node → RallyBoard không thể hiển thị tại vị trí đó

⚠️ **Lưu ý:** Đây là giải pháp tạm thời, không khuyến nghị cho production. Nên yêu cầu designer thêm placement node vào scene sau này.

**Chi tiết các bước:**

1. **Trong `Room.tsx`, trong `useEffect` sau khi load scene:**
   - Tìm node `Phonebooth_tv` hoặc `tv_display_phonebooth`
   - Lấy position, rotation, scale của TV node
   - Tính world position (có tính đến parent transforms)

2. **Tạo placement node động:**
   - Kiểm tra xem node `RallyBar_Mount` đã tồn tại chưa (tránh tạo duplicate)
   - Nếu chưa có, tạo Object3D mới với tên `RallyBar_Mount`
   - Set position, rotation, scale giống TV
   - Thêm vào scene: `gltf.scene.add(placementNode)`

3. **Về việc reload scene:**
   - ✅ **Node SẼ BỊ MẤT khi reload scene** (vì không có trong GLB file)
   - ✅ **CẦN SETUP LẠI mỗi khi scene load** (trong `useEffect` khi `gltf` được load)
   - ✅ **Logic tạo node phải chạy mỗi lần** scene được load

4. **Về TV visibility:**
   - ❌ **TV KHÔNG always invisible**
   - ✅ **TV chỉ invisible khi RallyBoard được đặt** (có mapping trong Redux store)
   - ✅ **Khi RallyBoard bị xóa → TV hiện lại**

5. **Flow hoàn chỉnh:**
   ```
   Scene load
     ↓
   useEffect chạy
     ↓
   Tìm TV node → Lấy position/rotation
     ↓
   Tạo placement node "RallyBar_Mount" tại vị trí TV
     ↓
   Thêm vào scene
     ↓
   User chọn RallyBoard mount on wall
     ↓
   RallyBoard được map vào "RallyBar_Mount"
     ↓
   Kiểm tra Redux store → Ẩn TV
     ↓
   User xóa RallyBoard
     ↓
   Kiểm tra Redux store → Hiện TV lại
   ```

6. **Vấn đề của cách này:**
   - Node không persistent (mất khi reload scene) → **phải tạo lại mỗi lần**
   - Phức tạp, dễ lỗi
   - Không sync với scene 3D gốc
   - Có thể conflict với ProductsNodes() matcher nếu không cẩn thận
   - Performance: phải tạo node mỗi lần scene load

7. **Khuyến nghị:**
   - **Luôn yêu cầu designer thêm node vào scene** (giải pháp tốt nhất)
   - Chỉ dùng cách này để test tạm thời
   - Nếu dùng, đảm bảo logic tạo node chạy đúng mỗi lần scene load

#### Bước 3: Thêm Method Vào PlacementManager

**Mục đích:** Thêm method vào `PlacementManager` để trả về tên placement node `RallyBar_Mount`

**Cách làm:**
1. Mở file `src/models/configurator/PlacementManager.ts`
2. Thêm method mới:
   ```typescript
   public static getNameNodeForRallyBarMount(): string {
     return "RallyBar_Mount";
   }
   ```
3. Thêm vào `getAllPlacement()`:
   ```typescript
   placements.push(this.getNameNodeForRallyBarMount());
   ```

#### Bước 4: Lưu Reference Đến TV Mesh

**Mục đích:** Để có thể ẩn/hiện TV sau này

**Cách làm:**
1. Trong `Room.tsx`, tạo một biến state hoặc ref để lưu reference đến TV mesh
2. Trong `useEffect`, sau khi tìm thấy TV mesh bằng tên, lưu reference lại
3. Đảm bảo reference này được giữ lại khi component re-render

**Lưu ý:** 
- Có thể dùng `useRef` hoặc `useState` để lưu reference
- Reference phải là đến mesh object trong scene, không phải clone

#### Bước 5: Tạo Logic Ẩn TV Khi RallyBoard Được Đặt

**Mục đích:** Khi RallyBoard được đặt, ẩn TV mesh đi

**Lưu ý:** Tên placement node tùy vào tình huống:
- Nếu có node sẵn: `Camera_Commode_mini_display_1`
- Nếu tạo tạm thời: `RallyBoard_Wall`

**Cách làm:**
1. Trong `Room.tsx`, sau khi load scene, tìm TV node bằng tên:
   - Tìm node có tên `"Phonebooth_tv"` (parent group - khuyến nghị)
   - Hoặc tìm các mesh: `"tv_display_phonebooth"`, `"tv_body_phonebooth"`, `"tv_mount_phonebooth"`
2. Lưu reference đến TV node(s) vào state hoặc ref
3. Import Redux selector để lấy nodes mapping từ store
4. Trong `useEffect` hoặc một `useEffect` riêng, kiểm tra Redux store:
   - Lấy mapping `nameNode → assetId` từ Redux store
   - Kiểm tra xem có mapping `RallyBar_Mount → RallyBoard assetId` không
5. Nếu có mapping:
   - **Cách 1 (khuyến nghị):** Set `Phonebooth_tv.visible = false` để ẩn toàn bộ TV
   - **Cách 2:** Set từng mesh: `tv_display_phonebooth.visible = false`, `tv_body_phonebooth.visible = false`, `tv_mount_phonebooth.visible = false`
6. Nếu không có mapping (RallyBoard bị xóa):
   - Set `Phonebooth_tv.visible = true` để hiện TV lại
   - Hoặc set từng mesh: `tv_display_phonebooth.visible = true`, ...

**Lưu ý:**
- Cần kiểm tra Redux store mỗi khi store thay đổi (dùng selector)
- Cần xác định đúng assetId của RallyBoard (trường hợp 1)
- Logic này phải chạy mỗi khi Redux store thay đổi
- **Khuyến nghị:** Ẩn parent group `Phonebooth_tv` thay vì ẩn từng mesh riêng (đơn giản hơn)

#### Bước 6: Cấu Hình Permission/Element Cho RallyBoard (Trường Hợp 1)

**Mục đích:** Đảm bảo khi user chọn RallyBoard (trường hợp 1), nó được map vào placement node đúng

**Lưu ý:** Tên placement node là `RallyBar_Mount`

**Cách làm:**
1. Tìm file cấu hình permission/element cho RallyBoard
2. Tìm `ItemElement` hoặc `MountElement` của RallyBoard
3. Đảm bảo `defaultMount` của RallyBoard (trường hợp 1) trả về `RallyBar_Mount`
4. Hoặc trong logic `addElement()`, đảm bảo RallyBoard (trường hợp 1) được map vào `RallyBar_Mount`

**Lưu ý:**
- Cần phân biệt 3 trường hợp RallyBoard (có thể dùng variant, option, hoặc 3 sản phẩm riêng)
- Trường hợp 1: RallyBoard assetId → `RallyBar_Mount`

#### Bước 7: Test Trường Hợp 1

**Các bước test:**
1. Load phòng phoneBooth → kiểm tra TV hiển thị
2. Chọn RallyBoard (trường hợp 1) → kiểm tra:
   - RallyBoard hiển thị tại vị trí TV (hoặc vị trí `Camera_Commode_mini_display_1`)
   - TV đã bị ẩn
3. Xóa RallyBoard → kiểm tra TV hiện lại

---

## Trường Hợp 2: RallyBoard Ở Vị Trí `Camera_Commode_mini_display_1` (Tái Sử Dụng Placement Node)

### Mô Tả
- Đặt RallyBoard ở vị trí `Camera_Commode_mini_display_1`
- Placement node này đã có sẵn, có thể dùng cho các sản phẩm khác
- Node này có thể nằm trên credenza hoặc vị trí khác (không phải trên tường như trường hợp 1)

### Các Bước Thực Hiện

#### Bước 1: Xác Định Vị Trí Của Placement Node `Camera_Commode_mini_display_1`

**Mục đích:** Xác định node này nằm ở đâu trong scene (trên credenza, trên tường, hay vị trí khác)

**Cách làm:**
1. Trong `Room.tsx`, sau khi load scene, tìm node `Camera_Commode_mini_display_1`
2. Lấy position của node này
3. So sánh với position của các mesh khác (TV, credenza, ...) để xác định node nằm ở đâu
4. Ghi lại: node này nằm trên credenza hay vị trí khác

**Lưu ý:**
- Node này có thể đã được designer đặt ở vị trí khác với TV
- Cần xác định chính xác để biết có cần ẩn mesh nào không

#### Bước 2: Kiểm Tra Có Cần Ẩn Mesh Nào Không

**Mục đích:** Xác định khi RallyBoard được đặt vào node này, có cần ẩn TV hoặc credenza không

**Cách làm:**
1. Dựa vào vị trí của node `Camera_Commode_mini_display_1`:
   - Nếu node nằm trên credenza → có thể không cần ẩn gì, hoặc chỉ ẩn TV
   - Nếu node nằm ở vị trí khác → xác định logic ẩn/hiện phù hợp
2. Ghi lại logic: khi RallyBoard được đặt vào node này, cần ẩn mesh nào

**Lưu ý:**
- Trường hợp 2 có thể khác với trường hợp 1 về vị trí node
- Cần phân biệt rõ: trường hợp 1 dùng node này để thay TV, trường hợp 2 dùng node này ở vị trí khác

#### Bước 3: Tạo Logic Ẩn/Hiện Mesh (Nếu Cần)

**Mục đích:** Ẩn mesh tương ứng khi RallyBoard được đặt

**Cách làm:**
1. Tương tự bước 5 của trường hợp 1
2. Trong `Room.tsx`, kiểm tra Redux store:
   - Nếu có mapping `Camera_Commode_mini_display_1 → RallyBoard assetId (trường hợp 2)`
   - Ẩn mesh tương ứng (TV, hoặc mesh khác tùy logic)
3. Nếu RallyBoard bị xóa → hiện mesh lại

**Lưu ý:**
- Cần phân biệt assetId của RallyBoard trường hợp 2 với trường hợp 1
- Logic ẩn/hiện có thể khác với trường hợp 1

#### Bước 4: Cấu Hình Permission/Element Cho RallyBoard (Trường Hợp 2)

**Mục đích:** Đảm bảo RallyBoard (trường hợp 2) được map vào `Camera_Commode_mini_display_1`

**Cách làm:**
1. Tương tự bước 6 của trường hợp 1
2. Đảm bảo `defaultMount` của RallyBoard (trường hợp 2) trả về `Camera_Commode_mini_display_1`
3. Hoặc trong logic `addElement()`, đảm bảo RallyBoard (trường hợp 2) được map vào node này

**Lưu ý:**
- Trường hợp 2 cũng dùng `Camera_Commode_mini_display_1`, nhưng có thể là assetId khác (file GLB khác)
- Cần phân biệt với trường hợp 1

#### Bước 5: Test Trường Hợp 2

**Các bước test:**
1. Load phòng phoneBooth
2. Chọn RallyBoard (trường hợp 2) → kiểm tra:
   - RallyBoard hiển thị tại vị trí `Camera_Commode_mini_display_1`
   - Mesh tương ứng đã được ẩn (nếu có)
3. Xóa RallyBoard → kiểm tra mesh hiện lại

---

## Trường Hợp 3: RallyBoard Với Stand Trên Sàn, Xóa Credenza Và TV

### Mô Tả
- Xóa credenza mesh khỏi scene
- Xóa TV mesh khỏi scene
- Đặt RallyBoard với stand trên sàn nhà, sát tường
- Vị trí đặt: chỗ để credenza và TV cũ (tức là tại vị trí credenza và TV)

### Các Bước Thực Hiện

#### Bước 1: Tìm Tên Node Của Credenza Mesh

**Mục đích:** Để có thể ẩn credenza khi RallyBoard được đặt

**Cách làm:**
1. Tương tự bước 1 của trường hợp 1
2. Trong `Room.tsx`, traverse scene và log tất cả mesh names
3. Tìm mesh có tên liên quan đến credenza (ví dụ: `"Credenza"`, `"Cabinet"`, `"Furniture"`, `"Desk"`, ...)
4. Ghi lại tên chính xác của credenza mesh

**Lưu ý:**
- Credenza có thể có nhiều mesh (thân, ngăn kéo, ...) - cần tìm tất cả hoặc mesh chính
- Có thể credenza là một group chứa nhiều mesh - cần xử lý phù hợp

#### Bước 2: Xác Định Vị Trí Đặt RallyBoard Trên Sàn

**Mục đích:** Xác định vị trí chính xác để đặt RallyBoard với stand trên sàn, sát tường

**Cách làm:**

1. **Tìm vị trí của TV:**
   - Lấy position của TV mesh: `TV_mesh.position` → ví dụ: `(x_tv, y_tv, z_tv)`
   - TV thường nằm trên tường, có Y cao

2. **Tìm vị trí của credenza:**
   - Lấy position của credenza mesh: `credenza_mesh.position` → ví dụ: `(x_cred, y_cred, z_cred)`
   - Credenza thường nằm trên sàn, có Y thấp hơn TV

3. **Tính toán vị trí trên sàn:**
   - **X (ngang):** 
     - Có thể dùng X của credenza (nếu credenza nằm sát tường)
     - Hoặc X của TV (nếu muốn thẳng với TV)
     - Hoặc trung bình của X TV và X credenza
   - **Y (cao):** 
     - Tìm vị trí sàn: thường Y = 0 hoặc Y = height của sàn (từ scene)
     - Cộng thêm chiều cao của stand: `Y = floor_Y + stand_height`
     - Stand height: lấy từ GLB của RallyBoard với stand (có thể đo trong Blender hoặc từ bounding box)
   - **Z (sâu):** 
     - Sát tường: Z của tường (thường Z = 0 hoặc Z = wall_position)
     - Hoặc Z của credenza (nếu credenza sát tường)
     - Hoặc Z của TV (nếu TV sát tường)

4. **Lấy rotation:**
   - Rotation thường là `(0, 0, 0)` hoặc quay về phía phòng
   - Có thể lấy rotation của credenza hoặc TV và điều chỉnh

**Ví dụ tính toán:**
```
TV position: (5, 2.5, 0.1)      // X=5, Y=2.5 (trên tường), Z=0.1 (sát tường)
Credenza position: (5, 0.3, 0.1) // X=5, Y=0.3 (trên sàn), Z=0.1 (sát tường)
Floor Y: 0
Stand height: 0.5 (từ GLB RallyBoard với stand)

RallyBoard position:
  X: 5 (giữ nguyên, thẳng với TV và credenza)
  Y: 0 + 0.5 = 0.5 (trên sàn + stand height)
  Z: 0.1 (sát tường, giống TV và credenza)
```

#### Bước 3: Yêu Cầu Designer Thêm Placement Node Trên Sàn

**Mục đích:** Tạo placement node tại vị trí đã tính toán

**Cách làm:**
1. Cung cấp cho designer:
   - **Tên node:** `RallyBoard_Floor_Placement_1` (hoặc tên theo convention của project)
   - **Position:** (X, Y, Z) đã tính toán ở bước 2
   - **Rotation:** (0, 0, 0) hoặc rotation phù hợp
   - **Scale:** (1, 1, 1)
2. Designer thêm empty Object3D vào scene phoneBooth tại vị trí đó
3. Export scene mới
4. Test xem node có xuất hiện trong scene không

**Lưu ý:**
- Tên node phải theo convention của project (ví dụ: `RallyBoard_Floor_Placement_1`)
- Vị trí phải chính xác để RallyBoard với stand đứng đúng chỗ

#### Bước 4: Thêm Method Vào PlacementManager

**Mục đích:** Có method trả về tên placement node cho RallyBoard trên sàn

**Cách làm:**
1. Mở file `src/models/configurator/PlacementManager.ts`
2. Thêm method mới:
   - Method tên: `getNameNodeForRallyBoardFloor()` hoặc tên phù hợp
   - Method trả về: `"RallyBoard_Floor_Placement_1"` (hoặc tên node đã thỏa thuận với designer)
3. Thêm node này vào `getAllPlacement()`:
   - Trong method `getAllPlacement()`, thêm: `placements.push(this.getNameNodeForRallyBoardFloor())`

**Lưu ý:**
- Tên method và tên node phải khớp với tên node trong scene
- Đảm bảo node được thêm vào `getAllPlacement()` để ProductsNodes() có thể detect

#### Bước 5: Lưu Reference Đến Credenza Mesh

**Mục đích:** Để có thể ẩn credenza sau này

**Cách làm:**
1. Tương tự bước 4 của trường hợp 1
2. Trong `Room.tsx`, tạo biến state hoặc ref để lưu reference đến credenza mesh
3. Trong `useEffect`, sau khi tìm thấy credenza mesh bằng tên, lưu reference lại

**Lưu ý:**
- Credenza có thể là một group chứa nhiều mesh - cần lưu reference đến group hoặc tất cả mesh
- Nếu credenza là group, có thể set `group.visible = false` để ẩn toàn bộ

#### Bước 6: Tạo Logic Ẩn Credenza Và TV Khi RallyBoard Được Đặt

**Mục đích:** Khi RallyBoard với stand được đặt trên sàn, ẩn cả credenza và TV

**Cách làm:**
1. Trong `Room.tsx`, import Redux selector để lấy nodes mapping từ store
2. Trong `useEffect` hoặc một `useEffect` riêng, kiểm tra Redux store:
   - Lấy mapping `nameNode → assetId` từ Redux store
   - Kiểm tra xem có mapping `RallyBoard_Floor_Placement_1 → RallyBoard assetId (trường hợp 3)` không
3. Nếu có mapping:
   - Set `credenza_mesh.visible = false` để ẩn credenza
   - Set `TV_mesh.visible = false` để ẩn TV
4. Nếu không có mapping (RallyBoard bị xóa):
   - Set `credenza_mesh.visible = true` để hiện credenza lại
   - Set `TV_mesh.visible = true` để hiện TV lại

**Lưu ý:**
- Cần xử lý trường hợp có nhiều RallyBoard cùng lúc (trường hợp 1, 2, 3)
- Logic: 
  - Nếu có RallyBoard trên sàn (trường hợp 3) → ẩn credenza và TV
  - Nếu chỉ có RallyBoard trên tường (trường hợp 1) → chỉ ẩn TV
  - Nếu chỉ có RallyBoard ở vị trí khác (trường hợp 2) → logic tùy vị trí
- Cần kiểm tra Redux store mỗi khi store thay đổi

#### Bước 7: Cấu Hình Permission/Element Cho RallyBoard (Trường Hợp 3)

**Mục đích:** Đảm bảo RallyBoard (trường hợp 3) được map vào placement node trên sàn

**Cách làm:**
1. Tương tự bước 6 của trường hợp 1
2. Tìm file cấu hình permission/element cho RallyBoard
3. Đảm bảo `defaultMount` của RallyBoard (trường hợp 3) trả về `RallyBoard_Floor_Placement_1`
4. Hoặc trong logic `addElement()`, đảm bảo RallyBoard (trường hợp 3) được map vào node này

**Lưu ý:**
- Trường hợp 3: RallyBoard assetId (với stand) → `RallyBoard_Floor_Placement_1`
- Cần phân biệt với trường hợp 1 và 2

#### Bước 8: Test Trường Hợp 3

**Các bước test:**
1. Load phòng phoneBooth → kiểm tra TV và credenza hiển thị
2. Chọn RallyBoard với stand (trường hợp 3) → kiểm tra:
   - RallyBoard với stand hiển thị trên sàn, sát tường (tại vị trí credenza và TV cũ)
   - TV đã bị ẩn
   - Credenza đã bị ẩn
3. Xóa RallyBoard → kiểm tra TV và credenza hiện lại

---

## Tóm Tắt Quy Trình Chung

### 1. Về TV Và Credenza

- **TV và Credenza là mesh trong scene GLB phoneBooth**, không phải sản phẩm động
- **Không có file code xác định vị trí** - vị trí được hardcode trong scene
- **Để ẩn/hiện:** Set `mesh.visible = false/true` trong `Room.tsx`

### 2. Về Placement Nodes

- **Placement nodes phải có sẵn trong scene** (do designer tạo)
- **Trường hợp 1 và 2:** Dùng placement node `Camera_Commode_mini_display_1` (đã có sẵn)
- **Trường hợp 3:** Cần designer thêm placement node mới `RallyBoard_Floor_Placement_1` trên sàn
- **Tên node phải khớp với PlacementManager**

### 3. Về Vị Trí Đặt Sản Phẩm

- **Vị trí được xác định bởi placement node position**
- **Trường hợp 3:** Cần tính toán vị trí dựa trên vị trí TV và credenza, sau đó yêu cầu designer tạo node

### 4. Về Logic Ẩn/Hiện Mesh

- **Kiểm tra Redux store:** Có mapping `nameNode → assetId` không
- **Trường hợp 1:** Nếu có mapping `Camera_Commode_mini_display_1 → RallyBoard (trường hợp 1)` → ẩn TV
- **Trường hợp 2:** Nếu có mapping `Camera_Commode_mini_display_1 → RallyBoard (trường hợp 2)` → ẩn mesh tương ứng
- **Trường hợp 3:** Nếu có mapping `RallyBoard_Floor_Placement_1 → RallyBoard (trường hợp 3)` → ẩn cả credenza và TV

### 5. Về 3 Trường Hợp RallyBoard

- **Mỗi trường hợp có 1 file GLB riêng** → 3 assetId khác nhau
- **Trường hợp 1 và 2:** Dùng cùng placement node `Camera_Commode_mini_display_1` nhưng assetId khác nhau
- **Trường hợp 3:** Dùng placement node riêng `RallyBoard_Floor_Placement_1`
- **Logic ẩn/hiện mesh khác nhau** tùy trường hợp

---

## Checklist Tổng Hợp

### Trước Khi Bắt Đầu

- [ ] Tìm tên chính xác của TV mesh trong scene phoneBooth
- [ ] Tìm tên chính xác của credenza mesh trong scene phoneBooth
- [ ] Kiểm tra placement node `Camera_Commode_mini_display_1` có tồn tại không
- [ ] Xác định vị trí của placement node `Camera_Commode_mini_display_1` (trên tường, trên credenza, hay vị trí khác)

### Cho Trường Hợp 1

- [ ] Lưu reference đến TV mesh
- [ ] Kiểm tra PlacementManager có method trả về `Camera_Commode_mini_display_1` chưa
- [ ] Đảm bảo placement node trong `getAllPlacement()`
- [ ] Tạo logic ẩn TV khi RallyBoard (trường hợp 1) được đặt
- [ ] Cấu hình permission/element cho RallyBoard (trường hợp 1)
- [ ] Test: RallyBoard hiển thị, TV ẩn

### Cho Trường Hợp 2

- [ ] Xác định vị trí của placement node `Camera_Commode_mini_display_1` (nằm ở đâu)
- [ ] Xác định logic ẩn/hiện mesh (nếu cần)
- [ ] Tạo logic ẩn/hiện mesh khi RallyBoard (trường hợp 2) được đặt
- [ ] Cấu hình permission/element cho RallyBoard (trường hợp 2)
- [ ] Test: RallyBoard hiển thị, mesh tương ứng ẩn (nếu có)

### Cho Trường Hợp 3

- [ ] Tính toán vị trí đặt RallyBoard trên sàn (dựa trên vị trí TV và credenza)
- [ ] Yêu cầu designer thêm placement node `RallyBoard_Floor_Placement_1` trên sàn
- [ ] Thêm method vào PlacementManager
- [ ] Lưu reference đến credenza mesh
- [ ] Tạo logic ẩn cả credenza và TV khi RallyBoard (trường hợp 3) được đặt
- [ ] Cấu hình permission/element cho RallyBoard (trường hợp 3)
- [ ] Test: RallyBoard với stand trên sàn, TV và credenza ẩn

### Sau Khi Hoàn Thành

- [ ] Test tất cả 3 trường hợp cùng lúc (chuyển đổi giữa các trường hợp)
- [ ] Test xóa RallyBoard → mesh hiện lại đúng
- [ ] Kiểm tra không có lỗi console
- [ ] Kiểm tra performance

---

## Lưu Ý Quan Trọng

1. **Room được load là phoneBooth** - tất cả các bước đều làm việc với scene phoneBooth
2. **TV và credenza là mesh trong scene**, không phải sản phẩm động - cần ẩn/hiện bằng `visible`
3. **Trường hợp 1 và 2 dùng cùng placement node** `Camera_Commode_mini_display_1` nhưng assetId khác nhau
4. **Trường hợp 3 cần placement node mới** `RallyBoard_Floor_Placement_1` - cần designer thêm vào scene
5. **Vị trí trường hợp 3:** Tại chỗ để credenza và TV cũ (tức là tính toán dựa trên vị trí credenza và TV)
6. **Mỗi trường hợp có file GLB riêng** → cần 3 assetId khác nhau trong cấu hình

---

## Kết Luận

Để implement 3 trường hợp RallyBoard trong phòng phoneBooth, bạn cần:

1. **Làm việc với designer** để:
   - Xác định tên mesh của TV và credenza trong scene phoneBooth
   - Xác nhận placement node `Camera_Commode_mini_display_1` có tồn tại và vị trí của nó
   - Thêm placement node `RallyBoard_Floor_Placement_1` trên sàn (trường hợp 3)

2. **Cập nhật code** để:
   - Tìm và lưu reference đến TV và credenza mesh
   - Thêm methods vào PlacementManager (nếu cần)
   - Tạo logic ẩn/hiện mesh dựa trên Redux store cho từng trường hợp
   - Cấu hình permission/element cho từng trường hợp

3. **Test kỹ lưỡng** tất cả các trường hợp và edge cases
