# Phân Tích Chi Tiết: Load và Place Sản Phẩm Vào Phòng

## Tổng Quan

Hệ thống load và place sản phẩm vào phòng hoạt động theo cơ chế **placement nodes** - các node 3D được định nghĩa sẵn trong scene của phòng, mỗi node đại diện cho một vị trí có thể đặt sản phẩm. Khi user chọn sản phẩm, hệ thống sẽ map sản phẩm đó vào một placement node tương ứng.

---

## 1. Kiến Trúc Tổng Quan

### 1.1. Luồng Hoạt Động

```
User chọn sản phẩm 
  ↓
AddItemCommand được tạo
  ↓
Configuration được cập nhật (assetId)
  ↓
Redux Middleware xử lý
  ↓
updateNodesByConfiguration() được gọi
  ↓
addElement() map nameNode → assetId trong Redux store
  ↓
Room component render scene với GLTFNode
  ↓
ProductsNodes() matcher tìm các placement nodes
  ↓
ProductNode component được render cho mỗi placement node
  ↓
Product component load và render sản phẩm tại vị trí của placement node
```

### 1.2. Các Component Chính

1. **Room.tsx**: Component chính render phòng 3D
2. **GLTFNode.tsx**: Component render Three.js nodes thành React elements
3. **ProductsNodes.tsx**: Function tạo node matchers để tìm placement nodes
4. **ProductNode.tsx**: Component wrapper cho mỗi placement node
5. **Product.tsx**: Component load và render sản phẩm thực tế
6. **PlacementManager.ts**: Class quản lý tất cả placement node names

---

## 2. Placement Nodes - Vị Trí Đặt Sản Phẩm

### 2.1. Khái Niệm

**Placement nodes** là các empty nodes (Object3D) được đặt sẵn trong scene 3D của phòng. Mỗi node có:
- **Tên duy nhất** (ví dụ: `Mic_Placement_1`, `Camera_Wall_Placement_2`)
- **Vị trí (position)** trong không gian 3D
- **Rotation và Scale** nếu cần

### 2.2. PlacementManager Class

File: `src/models/configurator/PlacementManager.ts`

```typescript
export class PlacementManager {
  // Các method trả về tên placement node cho từng loại sản phẩm
  
  // Microphone placements
  public static getNameNodeForMic(id?: number): string {
    if (!id) return `Mic_Placement`;
    return `Mic_Placement_${id}`;
  }
  
  // Camera placements
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
  
  // Tap placements
  public static getNameNodeForTap(type: "Wall" | "Table", id: number): string {
    return `Tap_Placement_${type}_${id}`;
  }
  
  // ... nhiều methods khác
  
  // Lấy tất cả placement node names
  static getAllPlacement(): string[] {
    const placements: string[] = [];
    // Tạo array chứa tất cả tên placement nodes
    // Ví dụ: ["Mic_Placement_1", "Mic_Placement_2", ...]
    return placements;
  }
}
```

**Chức năng:**
- Định nghĩa naming convention cho placement nodes
- Cung cấp methods để lấy tên node cho từng loại sản phẩm
- `getAllPlacement()`: Trả về danh sách tất cả placement node names

**Ví dụ placement nodes:**
- `Mic_Placement_1`, `Mic_Placement_2`, ... (7 microphones)
- `Camera_Wall_Placement_1`, `Camera_Wall_Placement_2`, ... (4 wall cameras)
- `Camera_TV_Placement_1`, `Camera_TV_Placement_2` (2 TV cameras)
- `Tap_Placement_Wall_1`, `Tap_Placement_Table_1`, ...
- `Display_Placement_1` (TV/Display)
- `Scribe_Placement`, `Swytch_Placement`, ...

---

## 3. Quá Trình Load Phòng và Tìm Placement Nodes

### 3.1. Room Component Setup

File: `src/components/Assets/Room.tsx`

```typescript
export const Room: React.FC<RoomProps> = (props) => {
  const { roomAssetId, setSnapshotCameras } = props;
  const gltf = useScene({ assetId: roomAssetId }); // Load scene từ Threekit
  
  return (
    <>
      <GLTFNode 
        threeNode={gltf.scene} 
        nodeMatchers={ProductsNodes()} // Pass node matchers
      />
    </>
  );
};
```

**Giải thích:**
- `useScene()` load GLTF scene từ Threekit platform
- `GLTFNode` render scene và sử dụng `nodeMatchers` để tìm và replace các placement nodes

### 3.2. ProductsNodes - Node Matchers

File: `src/components/Assets/ProductsNodes.tsx`

```typescript
export const ProductsNodes = () => {
  // Lấy tất cả placement node names
  const allNodePlacement = PlacementManager.getAllPlacement();
  
  const nodeMatchers: NodeMatcher[] = [
    (threeNode) => {
      // Kiểm tra nếu node name có trong danh sách placements
      if (allNodePlacement.includes(threeNode.name)) {
        return (
          <Suspense>
            <ProductNode 
              parentNode={threeNode} 
              nameNode={threeNode.name} 
            />
          </Suspense>
        );
      }
      return undefined; // Không match, tiếp tục traverse
    },
  ];
  
  return nodeMatchers;
};
```

**Chức năng:**
- Tạo array các **node matchers** - functions kiểm tra từng node trong scene
- Mỗi matcher nhận `threeNode` và kiểm tra nếu `node.name` có trong `allNodePlacement`
- Nếu match → return `ProductNode` component
- Nếu không match → return `undefined`, GLTFNode tiếp tục traverse children

### 3.3. GLTFNode - Traverse và Match

File: `src/components/Assets/GLTFNode.tsx`

```typescript
export const GLTFNode = ({
  nodeMatchers,
  threeNode,
  props,
}: ThreeNodeRendererProps): ReactNode => {
  // 1. Kiểm tra node matchers trước
  if (nodeMatchers) {
    for (let i = 0; i < nodeMatchers.length; i++) {
      const jsx = nodeMatchers[i](threeNode, nodeMatchers);
      if (jsx) {
        return jsx; // Nếu match, return component thay vì render node gốc
      }
    }
  }
  
  // 2. Nếu không match, tiếp tục render children
  const children = threeNode.children.map((child) => (
    <GLTFNode
      key={child.uuid}
      threeNode={child}
      nodeMatchers={nodeMatchers} // Pass matchers xuống children
      {...props}
    />
  ));
  
  // 3. Render node (mesh hoặc group)
  if ("isMesh" in threeNode) {
    return <mesh ...>{children}</mesh>;
  } else {
    return <group ...>{children}</group>;
  }
};
```

**Quá trình:**
1. **Check matchers**: Với mỗi node, kiểm tra tất cả matchers
2. **Match found**: Nếu matcher return component → render component đó thay vì node gốc
3. **No match**: Render node bình thường và tiếp tục traverse children
4. **Recursive**: Process tất cả nodes trong scene tree

### 3.4. ⭐ QUAN TRỌNG: Code Thực Tế Hoạt Động Như Thế Nào?

**Câu hỏi thường gặp:**
> "Code chỉ check `gltf.scene.name` trong `getAllPlacement()`, chứ đâu có traverse tree để tìm các placement nodes?"

**Giải thích CHI TIẾT về Code Thực Tế:**

1. **Code THỰC TẾ trong GLTFNode.tsx:**
   ```typescript
   export const GLTFNode = ({ nodeMatchers, threeNode, props }) => {
     // BƯỚC 1: Check matchers cho node HIỆN TẠI
     if (nodeMatchers) {
       for (let i = 0; i < nodeMatchers.length; i++) {
         const jsx = nodeMatchers[i](threeNode, nodeMatchers);
         if (jsx) {
           return jsx;  // ⭐ Nếu match → return component và DỪNG
         }
       }
     }
     
     // BƯỚC 2: Nếu KHÔNG match → Traverse children (QUAN TRỌNG!)
     const children = threeNode.children.map((child) => (
       <GLTFNode
         key={child.uuid}
         threeNode={child}              // ⭐ RECURSIVE: Gọi lại GLTFNode cho từng child
         nodeMatchers={nodeMatchers}    // ⭐ Pass matchers xuống
         {...props}
       />
     ));
     
     // BƯỚC 3: Render node (mesh hoặc group) với children bên trong
     return <mesh> hoặc <group> với {children}
   };
   ```

2. **Quá Trình Khi Gọi Với gltf.scene - CHI TIẾT TỪNG BƯỚC:**
   
   **Giả sử cấu trúc scene:**
   ```typescript
   gltf.scene.children = [
     Room_Mesh,           // Child index 0
     Mic_Placement_1,     // Child index 1
     Tap_Placement_Wall_1, // Child index 2
     Furniture_Group      // Child index 3
   ]
   ```
   
   **Lần gọi 1: GLTFNode(gltf.scene) - Root Node**
   ```typescript
   // Input: threeNode = gltf.scene (root node)
   // gltf.scene.name = "" hoặc "Scene"
   
   // Bước 1: Check matchers cho gltf.scene
   nodeMatchers[0](gltf.scene)
     → ProductsNodes matcher check: gltf.scene.name trong getAllPlacement()?
     → "Scene" KHÔNG có trong getAllPlacement()
     → return undefined
   
   // Bước 2: KHÔNG match → Tiếp tục xử lý (KHÔNG DỪNG!)
   // Code tiếp tục đến dòng 52 trong file GLTF.tsx
   
   // Bước 3: Traverse children - TẠO ARRAY các GLTFNode components
   const children = gltf.scene.children.map((child, index) => (
     <GLTFNode 
       key={child.uuid}
       threeNode={child}        // ⭐ threeNode = child (Object3D instance, KHÔNG phải child.name)
       nodeMatchers={nodeMatchers}
     />
   ));
   // ⚠️ LƯU Ý: child là THREE.Object3D instance (nguyên 1 node object)
   // - child.name là string property (ví dụ: "Room_Mesh")
   // - threeNode prop cần Object3D, không phải string
   
   // Kết quả: [
   //   <GLTFNode threeNode={Room_Mesh} ... />,           // Child 0 (Object3D)
   //     // threeNode.name = "Room_Mesh" (string)
   //   <GLTFNode threeNode={Mic_Placement_1} ... />,     // Child 1 (Object3D)
   //     // threeNode.name = "Mic_Placement_1" (string)
   //   <GLTFNode threeNode={Tap_Placement_Wall_1} ... />, // Child 2 (Object3D)
   //     // threeNode.name = "Tap_Placement_Wall_1" (string)
   //   <GLTFNode threeNode={Furniture_Group} ... />      // Child 3 (Object3D)
   //     // threeNode.name = "Furniture_Group" (string)
   // ]
   
   // Bước 4: Render group với children
   return <group>{children}</group>
   // ⭐ Khi React render {children}, nó sẽ gọi GLTFNode cho TỪNG child
   ```
   
   **Lần gọi 2: GLTFNode(Room_Mesh) - Child đầu tiên**
   ```typescript
   // Input: threeNode = Room_Mesh (child[0] của gltf.scene)
   // threeNode.name = "Room_Mesh"
   
   // Bước 1: Check matchers
   nodeMatchers[0](Room_Mesh)
     → ProductsNodes matcher check: "Room_Mesh" trong getAllPlacement()?
     → ❌ KHÔNG có → return undefined
   
   // Bước 2: KHÔNG match → Tiếp tục
   // Traverse children của Room_Mesh (nếu có)
   const children = Room_Mesh.children.map(child => 
     <GLTFNode threeNode={child} ... />
   );
   
   // Bước 3: Render mesh
   return <mesh>{children}</mesh>
   ```
   
   **Lần gọi 3: GLTFNode(Mic_Placement_1) - Child thứ hai**
   ```typescript
   // Input: threeNode = Mic_Placement_1 (child[1] của gltf.scene)
   // threeNode.name = "Mic_Placement_1"
   
   // Bước 1: Check matchers
   nodeMatchers[0](Mic_Placement_1)
     → ProductsNodes matcher check: "Mic_Placement_1" trong getAllPlacement()?
     → ✅ CÓ! "Mic_Placement_1" có trong getAllPlacement()
     → return <ProductNode nameNode="Mic_Placement_1" />
   
   // Bước 2: Match! → Return component và DỪNG
   return <ProductNode nameNode="Mic_Placement_1" />
   // ⚠️ KHÔNG traverse children của Mic_Placement_1 nữa
   ```
   
   **Lần gọi 4: GLTFNode(Tap_Placement_Wall_1) - Child thứ ba**
   ```typescript
   // Input: threeNode = Tap_Placement_Wall_1 (child[2] của gltf.scene)
   // threeNode.name = "Tap_Placement_Wall_1"
   // Giả sử Tap_Placement_Wall_1 có children: [Helper_Mesh, Marker_Sphere]
   
   // Bước 1: Check matchers
   nodeMatchers[0](Tap_Placement_Wall_1)
     → ProductsNodes matcher check: "Tap_Placement_Wall_1" trong getAllPlacement()?
     → ✅ CÓ! → return <ProductNode nameNode="Tap_Placement_Wall_1" />
   
   // Bước 2: Match! → Return và DỪNG NGAY
   return <ProductNode nameNode="Tap_Placement_Wall_1" />
   
   // ⚠️ QUAN TRỌNG: Code KHÔNG đến dòng 52-59 (traverse children)
   // → Children của Tap_Placement_Wall_1 (Helper_Mesh, Marker_Sphere) 
   //   SẼ KHÔNG ĐƯỢC RENDER!
   ```
   
   **⚠️ LƯU Ý QUAN TRỌNG: Children của Placement Node KHÔNG được render**
   
   Khi một placement node match và return `ProductNode`, code sẽ:
   - ✅ Return `ProductNode` ngay lập tức (dòng 47 trong GLTFNode.tsx)
   - ❌ **KHÔNG** traverse children của placement node (không đến dòng 52-59)
   - ❌ **KHÔNG** render children của placement node
   
   **Ví dụ:**
   ```typescript
   // Cấu trúc scene:
   Tap_Placement_Wall_1
   ├── Helper_Mesh (helper visualization)
   └── Marker_Sphere (marker for debugging)
   
   // Khi GLTFNode(Tap_Placement_Wall_1) được gọi:
   export const GLTFNode = ({ threeNode, nodeMatchers }) => {
     // Check matchers
     const jsx = nodeMatchers[0](Tap_Placement_Wall_1);
     // jsx = <ProductNode nameNode="Tap_Placement_Wall_1" />
     
     if (jsx) {
       return jsx;  // ⭐ Return ngay, KHÔNG đến phần traverse children
     }
     
     // ⚠️ Code KHÔNG đến đây khi match
     // const children = threeNode.children.map(...)  // ← KHÔNG được thực thi
   };
   
   // Kết quả:
   // ✅ ProductNode được render (load sản phẩm thực tế)
   // ❌ Helper_Mesh và Marker_Sphere KHÔNG được render
   ```
   
   **Tại sao điều này OK?**
   - Placement nodes thường là **empty nodes** (chỉ có position, rotation, scale)
   - Nếu có children, thường là helper meshes, markers, hoặc debug visualizations
   - Khi replace bằng `ProductNode`, sản phẩm thực tế sẽ được load và render
   - Children của placement node thường không cần thiết nữa
   
   **Nếu cần render children của placement node:**
   - Cần modify `ProductNode` để render children của `parentNode`
   - Hoặc modify `ProductsNodes` matcher để không return ngay, mà render `ProductNode` cùng với children
   
   **Lần gọi 5: GLTFNode(Furniture_Group) - Child thứ tư**
   ```typescript
   // Input: threeNode = Furniture_Group (child[3] của gltf.scene)
   // threeNode.name = "Furniture_Group"
   
   // Bước 1: Check matchers
   nodeMatchers[0](Furniture_Group)
     → ProductsNodes matcher check: "Furniture_Group" trong getAllPlacement()?
     → ❌ KHÔNG có → return undefined
   
   // Bước 2: KHÔNG match → Tiếp tục
   // Traverse children của Furniture_Group
   const children = Furniture_Group.children.map(child => 
     <GLTFNode threeNode={child} ... />
   );
   // children = [Table_Mesh, Chair_Mesh]
   
   // Bước 3: Render group và tiếp tục traverse
   return <group>{children}</group>
   // ⭐ React sẽ gọi GLTFNode cho Table_Mesh và Chair_Mesh
   ```
   
   **Lần gọi 6, 7: GLTFNode(Table_Mesh), GLTFNode(Chair_Mesh)**
   ```typescript
   // Tương tự như Room_Mesh - không match, render mesh bình thường
   ```
   
   **Sơ đồ thứ tự gọi:**
   ```
   ┌─────────────────────────────────────────────────────────┐
   │ Lần gọi 1: GLTFNode(gltf.scene)                        │
   │   threeNode.name = "Scene"                             │
   │   → Check "Scene" trong getAllPlacement()? ❌          │
   │   → Traverse children: [Room_Mesh, Mic_Placement_1, ...]│
   │   → Tạo array: [<GLTFNode threeNode={Room_Mesh} />,    │
   │                 <GLTFNode threeNode={Mic_Placement_1} />,│
   │                 ...]                                    │
   └─────────────────────────────────────────────────────────┘
                           │
                           ├─> React render children[0]
                           │
                           ▼
   ┌─────────────────────────────────────────────────────────┐
   │ Lần gọi 2: GLTFNode(Room_Mesh)                         │
   │   threeNode.name = "Room_Mesh"                         │
   │   → Check "Room_Mesh" trong getAllPlacement()? ❌      │
   │   → Render <mesh> với children (nếu có)                │
   └─────────────────────────────────────────────────────────┘
                           │
                           ├─> React render children[1]
                           │
                           ▼
   ┌─────────────────────────────────────────────────────────┐
   │ Lần gọi 3: GLTFNode(Mic_Placement_1)                   │
   │   threeNode.name = "Mic_Placement_1"                   │
   │   → Check "Mic_Placement_1" trong getAllPlacement()? ✅│
   │   → Return <ProductNode nameNode="Mic_Placement_1" />  │
   └─────────────────────────────────────────────────────────┘
                           │
                           ├─> React render children[2]
                           │
                           ▼
   ┌─────────────────────────────────────────────────────────┐
   │ Lần gọi 4: GLTFNode(Tap_Placement_Wall_1)              │
   │   threeNode.name = "Tap_Placement_Wall_1"              │
   │   → Check "Tap_Placement_Wall_1" trong getAllPlacement()? ✅│
   │   → Return <ProductNode nameNode="Tap_Placement_Wall_1" />│
   └─────────────────────────────────────────────────────────┘
                           │
                           ├─> React render children[3]
                           │
                           ▼
   ┌─────────────────────────────────────────────────────────┐
   │ Lần gọi 5: GLTFNode(Furniture_Group)                   │
   │   threeNode.name = "Furniture_Group"                   │
   │   → Check "Furniture_Group" trong getAllPlacement()? ❌│
   │   → Traverse children: [Table_Mesh, Chair_Mesh]        │
   │   → Tạo array: [<GLTFNode threeNode={Table_Mesh} />,   │
   │                 <GLTFNode threeNode={Chair_Mesh} />]    │
   └─────────────────────────────────────────────────────────┘
                           │
                           ├─> React render children của Furniture_Group
                           │
                           ▼
   ┌─────────────────────────────────────────────────────────┐
   │ Lần gọi 6: GLTFNode(Table_Mesh)                        │
   │ Lần gọi 7: GLTFNode(Chair_Mesh)                        │
   │   → Không match → Render mesh bình thường              │
   └─────────────────────────────────────────────────────────┘
   ```

3. **Điểm Quan Trọng:**
   - ✅ Code **CHỈ check `threeNode.name`** (tên của node hiện tại) trong `getAllPlacement()`
   - ✅ Nhưng khi **KHÔNG match**, code **KHÔNG DỪNG** mà tiếp tục đến dòng 52
   - ✅ Dòng 52-59: Code dùng `map()` để **tạo array các React components** (`<GLTFNode>`)
   - ✅ Mỗi component trong array có `threeNode` là một child khác nhau
   - ✅ React render từng component trong array **tuần tự**, mỗi lần render gọi `GLTFNode` với `threeNode` tương ứng
   - ✅ Thứ tự gọi = thứ tự trong array `children` (từ trái sang phải)
   - ✅ Quá trình này lặp lại đệ quy cho đến khi tất cả nodes trong tree đều được check
   - ✅ Khi một node match (tên có trong `getAllPlacement()`), nó được replace bằng `ProductNode`

4. **Ví Dụ Cấu Trúc Scene Tree:**
   ```
   gltf.scene (root, name: "" hoặc "Scene")
   ├── Room_Mesh (mesh node)
   ├── Furniture_Group (group)
   │   ├── Table_Mesh
   │   └── Chair_Mesh
   ├── Mic_Placement_1 (⭐ Placement node - có trong getAllPlacement())
   ├── Mic_Placement_2 (⭐ Placement node - có trong getAllPlacement())
   ├── Tap_Placement_Wall_1 (⭐ Placement node - có trong getAllPlacement())
   └── Camera_TV_Placement_1 (⭐ Placement node - có trong getAllPlacement())
   ```

5. **Quá Trình Traverse:**
   ```
   Level 0: gltf.scene
     → Check matchers: "scene" không có trong getAllPlacement() → Không match
     → Render group và traverse children
   
   Level 1: Room_Mesh, Furniture_Group, Mic_Placement_1, ...
     → Room_Mesh: Không match → Render mesh
     → Furniture_Group: Không match → Render group, traverse children
     → Mic_Placement_1: ⭐ MATCH! → Return <ProductNode>
     → Mic_Placement_2: ⭐ MATCH! → Return <ProductNode>
     → Tap_Placement_Wall_1: ⭐ MATCH! → Return <ProductNode>
   
   Level 2: (Children của Furniture_Group)
     → Table_Mesh: Không match → Render mesh
     → Chair_Mesh: Không match → Render mesh
   ```

6. **Kết Luận:**
   - ✅ Code chỉ check `threeNode.name` của node hiện tại trong `getAllPlacement()`
   - ✅ Khi không match, code KHÔNG dừng mà tiếp tục traverse children (dòng 52-59)
   - ✅ Traverse đệ quy đảm bảo TẤT CẢ nodes trong scene tree đều được check
   - ✅ `gltf.scene` KHÔNG CẦN có trong `getAllPlacement()` vì nó chỉ là root container
   - ✅ Placement nodes là **children/nested children** của `gltf.scene`
   - ✅ Khi tìm thấy node có tên trong `getAllPlacement()`, nó sẽ được replace bằng `ProductNode`

**Kết quả:**
- Các placement nodes được **replace** bởi `ProductNode` components
- Các nodes khác được render bình thường

7. **Sơ Đồ Luồng Xử Lý:**
   ```
   Room.tsx
   │
   └─> <GLTFNode threeNode={gltf.scene} nodeMatchers={ProductsNodes()} />
       │
       ├─> [Check Matchers] gltf.scene.name trong getAllPlacement()?
       │   └─> ❌ KHÔNG (gltf.scene không phải placement node)
       │
       ├─> [Render Root] Render <group> cho gltf.scene
       │
       └─> [Traverse Children] Map qua tất cả children của gltf.scene
           │
           ├─> Child 1: Room_Mesh
           │   ├─> [Check Matchers] "Room_Mesh" trong getAllPlacement()?
           │   │   └─> ❌ KHÔNG
           │   └─> [Render] <mesh> với children
           │
           ├─> Child 2: Mic_Placement_1 ⭐
           │   ├─> [Check Matchers] "Mic_Placement_1" trong getAllPlacement()?
           │   │   └─> ✅ CÓ!
           │   └─> [Replace] Return <ProductNode nameNode="Mic_Placement_1" />
           │
           ├─> Child 3: Tap_Placement_Wall_1 ⭐
           │   ├─> [Check Matchers] "Tap_Placement_Wall_1" trong getAllPlacement()?
           │   │   └─> ✅ CÓ!
           │   └─> [Replace] Return <ProductNode nameNode="Tap_Placement_Wall_1" />
           │
           └─> Child 4: Furniture_Group
               ├─> [Check Matchers] "Furniture_Group" trong getAllPlacement()?
               │   └─> ❌ KHÔNG
               ├─> [Render] <group>
               └─> [Traverse Children] Map qua children của Furniture_Group
                   ├─> Table_Mesh → Render <mesh>
                   └─> Chair_Mesh → Render <mesh>
   ```

8. **Giải Thích Về React Rendering và Thứ Tự Gọi:**
   
   **Câu hỏi thường gặp:**
   > "Khi `gltf.scene.children.map()` được gọi, `threeNode` lúc này là `child`, nghĩa là tên khác với `gltf.scene` phải không? Theo cấu trúc scene thì `threeNode` lúc này là `Room_Mesh`? Sau đó lại check `Room_Mesh` trong `getAllPlacement` array? Nếu đúng như vậy thì sao lại có lần gọi 2 như trong giải thích? Nếu là lần gọi 2 thì sao không gọi children tiếp theo của `gltf.scene` là `Room_Mesh` mà lại là `Mic_Placement_1`?"
   
   **Trả lời chi tiết:**
   
   **1. `map()` tạo ra ARRAY các React components, không phải gọi ngay:**
   ```typescript
   // Dòng 52-59 trong GLTFNode.tsx
   const children = gltf.scene.children.map((child) => (
     <GLTFNode
       key={child.uuid}
       threeNode={child}        // ⭐ threeNode = child (Object3D instance, KHÔNG phải string)
       nodeMatchers={nodeMatchers}
     />
   ));
   
   // ⚠️ QUAN TRỌNG: 
   // - child là THREE.Object3D instance (nguyên 1 node object)
   // - KHÔNG phải child.name (string)
   // - threeNode prop cần Object3D, không phải string
   
   // Ví dụ:
   // gltf.scene.children = [
   //   Room_Mesh (Object3D instance, có .name = "Room_Mesh"),
   //   Mic_Placement_1 (Object3D instance, có .name = "Mic_Placement_1"),
   //   Tap_Placement_Wall_1 (Object3D instance, có .name = "Tap_Placement_Wall_1"),
   //   Furniture_Group (Object3D instance, có .name = "Furniture_Group")
   // ]
   
   // Kết quả: children = [
   //   <GLTFNode threeNode={Room_Mesh} ... />,        
   //     // threeNode = Room_Mesh (Object3D)
   //     // threeNode.name = "Room_Mesh" (string property)
   //   <GLTFNode threeNode={Mic_Placement_1} ... />,  
   //     // threeNode = Mic_Placement_1 (Object3D)
   //     // threeNode.name = "Mic_Placement_1" (string property)
   //   <GLTFNode threeNode={Tap_Placement_Wall_1} ... />,
   //     // threeNode = Tap_Placement_Wall_1 (Object3D)
   //     // threeNode.name = "Tap_Placement_Wall_1" (string property)
   //   <GLTFNode threeNode={Furniture_Group} ... />
   //     // threeNode = Furniture_Group (Object3D)
   //     // threeNode.name = "Furniture_Group" (string property)
   // ]
   ```
   
   **Giải thích chi tiết:**
   - ✅ `child` là **THREE.Object3D instance** (nguyên 1 node object)
   - ✅ `child.name` là **string property** của node (ví dụ: "Room_Mesh")
   - ✅ `threeNode` prop cần **Object3D instance**, không phải string
   - ✅ Vì vậy phải dùng `threeNode={child}`, KHÔNG phải `threeNode={child.name}`
   - ✅ Trong `GLTFNode`, code sẽ dùng `threeNode.name` để check trong `getAllPlacement()`
   
   **2. React render các components theo thứ tự trong array:**
   ```typescript
   return (
     <group>
       {children}  // React sẽ render từng component trong array
     </group>
   );
   ```
   
   **3. Thứ tự gọi thực tế:**
   - **Lần gọi 1**: `GLTFNode(gltf.scene)` → Tạo array `children`
   - **Lần gọi 2**: React render `<GLTFNode threeNode={Room_Mesh} />` → Gọi `GLTFNode(Room_Mesh)`
     - Check: `"Room_Mesh"` trong `getAllPlacement()`? ❌ KHÔNG
     - Render `<mesh>` và traverse children của `Room_Mesh` (nếu có)
   - **Lần gọi 3**: React render `<GLTFNode threeNode={Mic_Placement_1} />` → Gọi `GLTFNode(Mic_Placement_1)`
     - Check: `"Mic_Placement_1"` trong `getAllPlacement()`? ✅ CÓ!
     - Return `<ProductNode>` và DỪNG
   - **Lần gọi 4**: React render `<GLTFNode threeNode={Tap_Placement_Wall_1} />` → Gọi `GLTFNode(Tap_Placement_Wall_1)`
     - Check: `"Tap_Placement_Wall_1"` trong `getAllPlacement()`? ✅ CÓ!
     - Return `<ProductNode>` và DỪNG
   - **Lần gọi 5**: React render `<GLTFNode threeNode={Furniture_Group} />` → Gọi `GLTFNode(Furniture_Group)`
     - Check: `"Furniture_Group"` trong `getAllPlacement()`? ❌ KHÔNG
     - Render `<group>` và traverse children của `Furniture_Group`
   
   **4. Điểm quan trọng:**
   - ✅ `map()` tạo array các React components, mỗi component có `threeNode` là một child khác nhau
   - ✅ `threeNode` trong mỗi lần gọi `GLTFNode` là KHÁC NHAU (Room_Mesh, Mic_Placement_1, ...)
   - ✅ Mỗi child được check `threeNode.name` trong `getAllPlacement()` một cách độc lập
   - ✅ Thứ tự gọi phụ thuộc vào thứ tự trong array `gltf.scene.children`
   - ✅ React render các components tuần tự, không phải cùng lúc
   
   **5. Ví dụ minh họa:**
   ```typescript
   // Giả sử gltf.scene.children = [Room_Mesh, Mic_Placement_1, Tap_Placement_Wall_1]
   
   // Lần gọi 1: GLTFNode(gltf.scene)
   const children = [
     <GLTFNode threeNode={Room_Mesh} ... />,      // threeNode.name = "Room_Mesh"
     <GLTFNode threeNode={Mic_Placement_1} ... />, // threeNode.name = "Mic_Placement_1"
     <GLTFNode threeNode={Tap_Placement_Wall_1} ... /> // threeNode.name = "Tap_Placement_Wall_1"
   ];
   
   // React render children[0] → Gọi GLTFNode(Room_Mesh)
   //   → Check "Room_Mesh" trong getAllPlacement()? ❌ → Render mesh
   
   // React render children[1] → Gọi GLTFNode(Mic_Placement_1)
   //   → Check "Mic_Placement_1" trong getAllPlacement()? ✅ → Return ProductNode
   
   // React render children[2] → Gọi GLTFNode(Tap_Placement_Wall_1)
   //   → Check "Tap_Placement_Wall_1" trong getAllPlacement()? ✅ → Return ProductNode
   ```

9. **Tóm Tắt - Trả Lời Tất Cả Câu Hỏi:**
   
   **Câu hỏi 1:** "Code chỉ check `gltf.scene.name` trong `getAllPlacement()`, chứ đâu có traverse tree?"
   
   **Trả lời:**
   - ✅ Đúng! Code chỉ check `threeNode.name` (tên của node hiện tại)
   - ✅ Nhưng khi **KHÔNG match**, code **KHÔNG DỪNG** mà tiếp tục thực thi
   - ✅ Dòng 52-59: Code dùng `map()` để tạo array các `<GLTFNode>` components cho từng child
   - ✅ React render từng component trong array, mỗi component gọi `GLTFNode` với `threeNode` là child tương ứng
   - ✅ Quá trình này đảm bảo **TẤT CẢ nodes** trong scene tree đều được check
   
   **Câu hỏi 2:** "Khi `gltf.scene.children.map()`, `threeNode` lúc này là `child`, nghĩa là tên khác với `gltf.scene` phải không?"
   
   **Trả lời:**
   - ✅ ĐÚNG! `threeNode` trong mỗi lần gọi `GLTFNode` là KHÁC NHAU
   - ✅ Lần gọi 1: `threeNode = gltf.scene` (name = "Scene" hoặc "")
   - ✅ Lần gọi 2: `threeNode = Room_Mesh` (name = "Room_Mesh")
   - ✅ Lần gọi 3: `threeNode = Mic_Placement_1` (name = "Mic_Placement_1")
   - ✅ Mỗi child có tên riêng và được check độc lập trong `getAllPlacement()`
   
   **Câu hỏi 3:** "Nếu là lần gọi 2 thì sao không gọi children tiếp theo của `gltf.scene` là `Room_Mesh` mà lại là `Mic_Placement_1`?"
   
   **Trả lời:**
   - ✅ Thực tế là **CÓ gọi `Room_Mesh` trước** (lần gọi 2)
   - ✅ Sau đó mới gọi `Mic_Placement_1` (lần gọi 3)
   - ✅ Thứ tự gọi phụ thuộc vào thứ tự trong array `gltf.scene.children`
   - ✅ React render các components theo thứ tự trong array (tuần tự, từ trái sang phải)
   
   **Câu hỏi 4:** "Nếu khi check ở lần gọi 4 tìm thấy node `Tap_Placement_Wall_1`, thì return `ProductNode` tương ứng, như vậy children bên trong node `Tap_Placement_Wall_1` sẽ không được render?"
   
   **Trả lời:**
   - ✅ **ĐÚNG!** Children của placement node **KHÔNG được render** khi match
   - ✅ Khi match và return `ProductNode`, code return ngay lập tức (dòng 47 trong GLTFNode.tsx)
   - ❌ Code **KHÔNG** đến phần traverse children (dòng 52-59)
   - ❌ Children của placement node (nếu có) sẽ **KHÔNG được render**
   - ✅ Điều này thường OK vì:
     - Placement nodes thường là empty nodes (chỉ có transform)
     - Nếu có children, thường là helper meshes/markers không cần thiết
     - `ProductNode` sẽ load sản phẩm thực tế thay thế
   - ⚠️ Nếu cần render children, cần modify `ProductNode` hoặc `ProductsNodes` matcher
   
   **Điểm then chốt:**
   ```typescript
   // 1. Check matchers cho node hiện tại
   if (nodeMatchers) {
     const jsx = nodeMatchers[0](threeNode);
     if (jsx) {
       return jsx;  // Match → return và DỪNG
     }
   }
   // 2. Không match → Tạo array các GLTFNode components
   const children = threeNode.children.map(child => 
     <GLTFNode threeNode={child} ... />  // ⭐ Mỗi child có threeNode KHÁC NHAU
   );
   // 3. React render từng component trong array
   return <group>{children}</group>
   ```
   
   **Kết luận:**
   - ✅ `map()` tạo array các React components, không gọi ngay
   - ✅ Mỗi component có `threeNode` là một child khác nhau
   - ✅ React render tuần tự, mỗi lần render gọi `GLTFNode` với `threeNode` tương ứng
   - ✅ Mỗi node được check `threeNode.name` trong `getAllPlacement()` một cách độc lập
   - ✅ Thứ tự gọi = thứ tự trong array `children`

---

## 4. ProductsNodes.tsx - Node Matchers

File: `src/components/Assets/ProductsNodes.tsx`

### 4.0. Code Flow Chi Tiết

```typescript
import { Suspense } from "react";
import { NodeMatcher } from "./GLTFNode";
import { ProductNode } from "./ProductNode";
import { PlacementManager } from "../../models/configurator/PlacementManager";

export const ProductsNodes = () => {
  // 1. Lấy tất cả placement node names từ PlacementManager
  const allNodePlacement = PlacementManager.getAllPlacement();
  // allNodePlacement = [
  //   "Mic_Placement_1",
  //   "Mic_Placement_2",
  //   "Tap_Placement_Wall_1",
  //   "Camera_TV_Placement_1",
  //   ...
  // ]

  // 2. Tạo node matcher function
  const nodeMatchers: NodeMatcher[] = [
    (threeNode) => {
      // 3. Check: Node name có trong danh sách placement nodes không?
      if (allNodePlacement.includes(threeNode.name)) {
        // ✅ Đây là placement node → Return ProductNode component
        return (
          <Suspense>
            <ProductNode 
              parentNode={threeNode}      // ⭐ Placement node (Object3D)
              nameNode={threeNode.name}   // ⭐ Tên placement node (string)
            />
          </Suspense>
        );
      }

      // ❌ Không phải placement node → return undefined
      // GLTFNode sẽ tiếp tục traverse children
      return undefined;
    },
  ];

  return nodeMatchers;
};
```

**Flow:**
1. `ProductsNodes()` được gọi mỗi lần `GLTFNode` check matchers
2. Với mỗi node, check `threeNode.name` có trong `allNodePlacement` không?
3. Nếu có → return `<ProductNode>` (placement node được replace)
4. Nếu không → return `undefined` (tiếp tục render node bình thường)

**⚠️ LƯU Ý QUAN TRỌNG:**
- `ProductsNodes` chỉ tìm và replace placement nodes
- **KHÔNG** check xem placement node có sản phẩm hay chưa
- Việc check sản phẩm được thực hiện trong `ProductNode` component

### 4.0.1. ⭐ Giải Thích Logic: Tại Sao Check "Có Sản Phẩm" Mới Render?

**Câu hỏi thường gặp:**
> "Theo tôi hiểu nếu placementNode đã có sản phẩm rồi, thì không cần render sản phẩm nữa chứ nhỉ?"

**Trả lời chi tiết:**

1. **Placement Node BAN ĐẦU là TRỐNG:**
   ```typescript
   // Trong scene 3D (GLTF file):
   Tap_Placement_Wall_1 (Object3D)
     - position: { x: 1, y: 2, z: 3 }
     - rotation: { x: 0, y: 0, z: 0 }
     - scale: { x: 1, y: 1, z: 1 }
     - children: []  // ⚠️ TRỐNG - không có sản phẩm
   ```
   - Placement node chỉ là **vị trí trống** (empty node)
   - Chỉ chứa transform (position, rotation, scale)
   - **KHÔNG** chứa sản phẩm 3D model

2. **Redux Store Quản Lý Mapping:**
   ```typescript
   // Redux store: state.configurator.nodes
   // Ban đầu: {} (trống)
   // Sau khi user chọn sản phẩm:
   {
     "Tap_Placement_Wall_1": "tap-asset-id-456",
     "Mic_Placement_1": "mic-asset-id-123",
     // nameNode → assetId mapping
   }
   ```
   - Redux store lưu mapping: **placement node name → product asset ID**
   - Khi user chọn sản phẩm → Redux store được cập nhật
   - Mapping này quyết định placement node nào có sản phẩm

3. **Logic Check trong ProductNode:**
   ```typescript
   // ProductNode.tsx
   const attachNodeNameToAssetId = useAppSelector(getNodes);
   // attachNodeNameToAssetId = { "Tap_Placement_Wall_1": "tap-asset-id-456" }
   
   // Check: "Tap_Placement_Wall_1" có trong keys không?
   if (!Object.keys(attachNodeNameToAssetId).includes(nameNode))
     return undefined; // ❌ KHÔNG có mapping → không render gì
   
   // ✅ CÓ mapping → render Product component
   return <Product productAssetId={attachNodeNameToAssetId[nameNode]} ... />
   ```

4. **Tại Sao Logic Này Đúng?**
   
   **Logic hiện tại:**
   - ✅ CÓ mapping trong Redux → render Product (hiển thị sản phẩm)
   - ❌ KHÔNG có mapping → return undefined (placement node trống)
   
   **Logic ngược lại (SAI):**
   - ❌ CÓ sản phẩm → không render (sai vì placement node trống, cần render để hiển thị)
   - ✅ KHÔNG có sản phẩm → render (sai vì không có gì để render)
   
   **Lý do:**
   - Placement node **KHÔNG** chứa sản phẩm trong scene
   - Sản phẩm được **load động** từ Threekit dựa trên asset ID trong Redux
   - Nếu không có mapping → không biết load sản phẩm nào → không render gì
   - Nếu có mapping → biết asset ID → load và render sản phẩm

5. **Flow Hoàn Chỉnh:**
   ```
   Bước 1: Scene load
     → Placement nodes được tìm thấy (TRỐNG, không có sản phẩm)
     → ProductsNodes matcher replace bằng ProductNode
   
   Bước 2: ProductNode check Redux
     → attachNodeNameToAssetId = {} (trống)
     → "Mic_Placement_1" không có trong keys
     → return undefined → placement node trống (không hiển thị gì)
   
   Bước 3: User chọn sản phẩm
     → Redux store được cập nhật: { "Mic_Placement_1": "mic-asset-id-123" }
     → ProductNode re-render (vì Redux state thay đổi)
   
   Bước 4: ProductNode check lại Redux
     → attachNodeNameToAssetId = { "Mic_Placement_1": "mic-asset-id-123" }
     → "Mic_Placement_1" CÓ trong keys
     → render Product component
   
   Bước 5: Product component
     → Load product GLTF từ Threekit (assetId = "mic-asset-id-123")
     → Render tại vị trí Mic_Placement_1
     → Sản phẩm hiển thị trên scene
   ```

6. **Tóm Tắt:**
   - ✅ Placement node ban đầu **TRỐNG** (không có sản phẩm)
   - ✅ Redux store quản lý mapping: nameNode → assetId
   - ✅ CÓ mapping → render Product (hiển thị sản phẩm)
   - ✅ KHÔNG có mapping → return undefined (placement node trống)
   - ✅ Logic này đúng vì sản phẩm được load động, không có sẵn trong scene

---

## 4. ProductNode - Wrapper Component

File: `src/components/Assets/ProductNode.tsx`

### 4.1. Code Chi Tiết

```typescript
import { FC, useState } from "react";
import { useAppSelector } from "../../hooks/redux";
import {
  getConfiguration,
  getIsHighlightNode,
  getIsPopuptNodes,
  getNodes,
} from "../../store/slices/configurator/selectors/selectors";
import { Product } from "./Product";
import * as THREE from "three";
import { useDispatch } from "react-redux";
import {
  disabledHighlightNode,
  disabledPopuptNodes,
  setHighlightNodes,
  setPopuptNodes,
} from "../../store/slices/configurator/Configurator.slice";

type ProductProps = {
  nameNode: string;              // Tên placement node (ví dụ: "Mic_Placement_1")
  parentNode: THREE.Object3D;    // Placement node từ scene (chứa position, rotation, scale)
};

export const ProductNode: FC<ProductProps> = ({ nameNode, parentNode }) => {
  // 1. State management cho highlight và popup
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const dispatch = useDispatch();

  // 2. Lấy state từ Redux store
  const isHighlightNode = useAppSelector(
    getIsHighlightNode(selectedNode !== null ? selectedNode : nameNode)
  );
  const isPopuptNode = useAppSelector(
    getIsPopuptNodes(selectedNode !== null ? selectedNode : nameNode)
  );
  const attachNodeNameToAssetId = useAppSelector(getNodes);
  // attachNodeNameToAssetId = {
  //   "Mic_Placement_1": "mic-asset-id-123",
  //   "Tap_Placement_Wall_1": "tap-asset-id-456",
  //   ...
  // }
  
  const configuration = useAppSelector(getConfiguration);
  // configuration = {
  //   "Mic_Placement_1": { color: "black", ... },
  //   ...
  // }

  // 3. Callback functions cho highlight và popup
  const callbackDisableHighlight = () => {
    setSelectedNode(null);
    dispatch(disabledHighlightNode(nameNode));
  };

  const callbackOnHighlight = (nameNodeParam: string) => {
    setSelectedNode(nameNodeParam);
    dispatch(setHighlightNodes({ [nameNodeParam]: true }));
  };

  const callbackDisablePopuptNodes = () => {
    dispatch(disabledPopuptNodes(nameNode));
  };
  
  const callbackOnPopuptNodes = (nameNodeParam: string) => {
    dispatch(setPopuptNodes({ [nameNodeParam]: true }));
  };

  // 4. ⭐ QUAN TRỌNG: Kiểm tra Placement node có sản phẩm được assign chưa?
  // 
  // Logic: Check Redux store (attachNodeNameToAssetId), KHÔNG phải check scene
  // 
  // Tại sao logic này?
  // - Placement node trong scene BAN ĐẦU là TRỐNG (empty node, chỉ có position/rotation/scale)
  // - Khi user chọn sản phẩm → Redux store được cập nhật với mapping: nameNode → assetId
  // - Nếu CÓ mapping trong Redux → có sản phẩm được assign → render Product
  // - Nếu KHÔNG có mapping → chưa có sản phẩm → return undefined (placement node vẫn trống)
  //
  // Ví dụ:
  // - Ban đầu: attachNodeNameToAssetId = {} (trống)
  //   → "Mic_Placement_1" không có trong keys → return undefined → placement node trống
  // - Sau khi user chọn mic: attachNodeNameToAssetId = { "Mic_Placement_1": "mic-asset-id-123" }
  //   → "Mic_Placement_1" có trong keys → render Product → hiển thị mic
  //
  if (!Object.keys(attachNodeNameToAssetId).includes(nameNode))
    return undefined; // ❌ Chưa có sản phẩm trong Redux → không render gì (placement node trống)

  // 5. ✅ Có sản phẩm trong Redux → render Product component
  return (
    <Product
      parentNode={parentNode}        // ⭐ Placement node (chứa transform)
      configuration={configuration[nameNode]}
      productAssetId={attachNodeNameToAssetId[nameNode]}
      highlight={isHighlightNode}
      popuptNode={isPopuptNode}
      callbackDisableHighlight={callbackDisableHighlight}
      callbackOnHighlight={callbackOnHighlight}
      callbackDisablePopuptNodes={callbackDisablePopuptNodes}
      callbackOnPopuptNodes={callbackOnPopuptNodes}
      nameNode={nameNode}
    />
  );
};
```

### 4.2. ⭐ Tại Sao Dùng `parentNode` Mà Không Phải `placementNode`?

**Câu hỏi:** "Tại sao lại lấy `parentNode` mà không lấy `placementNode` cho props của `<Product>`?"

**Trả lời chi tiết:**

1. **`parentNode` chính là Placement Node:**
   ```typescript
   // Trong ProductsNodes.tsx - dòng 15
   <ProductNode parentNode={threeNode} nameNode={threeNode.name} />
   // threeNode ở đây chính là placement node (ví dụ: Tap_Placement_Wall_1)
   ```
   - Khi `GLTFNode` traverse và tìm thấy placement node, `threeNode` chính là placement node đó
   - `ProductsNodes` matcher pass `threeNode` vào `ProductNode` với tên `parentNode`
   - Vậy `parentNode` = placement node

2. **Tại sao đặt tên là `parentNode`?**
   
   **Lý do 1: Context của React Three Fiber**
   ```typescript
   // Trong Product.tsx - dòng 67-72
   return (
     <group
       position={parentNode.position}    // ⭐ Copy transform từ parentNode
       scale={parentNode.scale}
       rotation={parentNode.rotation}
     >
       <GLTFNode threeNode={productGltf.scene.clone()} />
     </group>
   );
   ```
   - Trong React Three Fiber, `parentNode` là node **parent** của product scene
   - Product scene được load và đặt vào trong một `<group>` mới
   - `<group>` này sử dụng transform (position, rotation, scale) từ `parentNode`
   - Về mặt cấu trúc, `parentNode` là parent container cho product scene

   **Lý do 2: Semantic Meaning**
   - `parentNode` mô tả **vai trò** của node trong cấu trúc React Three Fiber
   - `placementNode` chỉ mô tả **mục đích** của node (để đặt sản phẩm)
   - Trong context của component tree, `parentNode` có ý nghĩa rõ ràng hơn

   **Lý do 3: Consistency với Three.js Convention**
   - Trong Three.js, `parent` là thuật ngữ chuẩn cho node cha
   - `Object3D.parent` là property chuẩn trong Three.js
   - Dùng `parentNode` giữ consistency với Three.js API

3. **Có thể đổi tên thành `placementNode` không?**
   - ✅ **CÓ THỂ**, về mặt kỹ thuật hoàn toàn OK
   - ✅ Về mặt logic, `placementNode` có thể rõ ràng hơn trong một số context
   - ⚠️ Nhưng cần đổi tên ở tất cả các nơi:
     - `ProductNode.tsx`: type `ProductProps` và parameter
     - `ProductsNodes.tsx`: prop name khi pass vào
     - `Product.tsx`: type `ProductProps` và parameter
   - ⚠️ `parentNode` đã được dùng xuyên suốt codebase, đổi tên có thể gây confusion

4. **Cách `parentNode` được sử dụng trong Product.tsx:**
   ```typescript
   // Product.tsx
   export const Product: React.FC<ProductProps> = ({
     parentNode,  // ⭐ Đây chính là placement node
     productAssetId,
     configuration,
     nameNode,
   }) => {
     const productGltf = useAsset({ assetId: productAssetId, configuration });
     
     return (
       <group
         key={parentNode.uuid + `-group`}           // ⭐ Dùng UUID của placement node
         name={generateName(nameNode, parentNode)}   // ⭐ Generate name từ placement node
         position={parentNode.position}              // ⭐ Copy position từ placement node
         scale={parentNode.scale}                    // ⭐ Copy scale từ placement node
         rotation={parentNode.rotation}              // ⭐ Copy rotation từ placement node
       >
         <GLTFNode threeNode={productGltf.scene.clone()} />
       </group>
     );
   };
   ```
   
   **Giải thích:**
   - `parentNode` chứa **transform** (position, rotation, scale) của placement node
   - Product scene được load và đặt vào `<group>` mới
   - `<group>` này copy transform từ `parentNode` để đặt sản phẩm vào đúng vị trí
   - Về mặt cấu trúc, `parentNode` là parent của product scene trong scene graph

### 4.3. Flow Từ Placement Node Đến Product

```
1. GLTFNode traverse scene
   └─> Tìm thấy placement node: Tap_Placement_Wall_1
       └─> ProductsNodes matcher match
           └─> Return: <ProductNode parentNode={Tap_Placement_Wall_1} nameNode="Tap_Placement_Wall_1" />

2. ProductNode được render
   └─> Check Redux store: "Tap_Placement_Wall_1" có trong attachNodeNameToAssetId?
       └─> ✅ CÓ → Render: <Product parentNode={Tap_Placement_Wall_1} ... />

3. Product component
   └─> Load product GLTF từ Threekit
   └─> Tạo <group> với transform từ parentNode:
       - position={parentNode.position}  // Vị trí của Tap_Placement_Wall_1
       - rotation={parentNode.rotation}   // Rotation của Tap_Placement_Wall_1
       - scale={parentNode.scale}         // Scale của Tap_Placement_Wall_1
   └─> Render product scene bên trong <group>
```

### 4.4. Tóm Tắt

- ✅ `parentNode` chính là **placement node** từ scene
- ✅ Tên `parentNode` phản ánh **vai trò** của node trong React Three Fiber component tree
- ✅ `parentNode` chứa **transform** (position, rotation, scale) để đặt sản phẩm vào đúng vị trí
- ✅ Có thể đổi tên thành `placementNode`, nhưng `parentNode` đã được dùng xuyên suốt codebase
- ✅ Trong `Product.tsx`, `parentNode` được dùng để:
  - Tạo key và name cho group
  - Copy transform để đặt sản phẩm vào đúng vị trí

**Redux Store Structure:**
```typescript
// state.configurator.nodes
{
  "Mic_Placement_1": "asset-id-123",
  "Camera_Wall_Placement_2": "asset-id-456",
  // nameNode → assetId mapping
}
```

---

## 5. Product Component - Load và Render Sản Phẩm

File: `src/components/Assets/Product.tsx`

### 5.1. Load Product Asset

```typescript
export const Product: React.FC<ProductProps> = ({
  parentNode,        // Placement node từ scene
  productAssetId,   // Asset ID từ Redux store
  configuration,     // Product configuration
  nameNode,
  // ...
}) => {
  // Load product GLTF từ Threekit với configuration
  const productGltf = useAsset({ 
    assetId: productAssetId, 
    configuration 
  });
  
  // Tính size của sản phẩm (để position annotation)
  const sizeProduct = new THREE.Box3()
    .setFromObject(productGltf.scene.clone())
    .getSize(new THREE.Vector3());
  
  // ...
};
```

**Giải thích:**
- `useAsset()` load product 3D model từ Threekit với configuration (màu sắc, options, ...)
- `productGltf.scene` chứa Three.js scene của sản phẩm
- Tính bounding box để biết kích thước sản phẩm

### 5.2. Render Product tại Vị Trí Placement Node

```typescript
return (
  <group
    key={parentNode.uuid + `-group`}
    name={generateName(nameNode, parentNode)}
    // ⭐ QUAN TRỌNG: Copy position, scale, rotation từ placement node
    position={parentNode.position}
    scale={parentNode.scale}
    rotation={parentNode.rotation}
  >
    {PlacementManager.getNameNodeWithoutInteraction().includes(nameNode) ? (
      // Sản phẩm không tương tác được (như TV)
      <GLTFNode
        threeNode={productGltf.scene.clone()}
        nodeMatchers={ProductsNodes()}
      />
    ) : (
      // Sản phẩm có thể tương tác
      <Select enabled={highlight} onClick={...}>
        {popuptNode && (
          <AnnotationProductContainer
            position={[0, sizeProduct.y / 2, 0]} // Annotation ở trên sản phẩm
            // ...
          />
        )}
        <GLTFNode
          threeNode={productGltf.scene.clone()}
          nodeMatchers={ProductsNodes()}
        />
      </Select>
    )}
  </group>
);
```

**Điểm quan trọng:**

1. **Position từ Placement Node:**
   ```typescript
   position={parentNode.position}
   scale={parentNode.scale}
   rotation={parentNode.rotation}
   ```
   - Sản phẩm được đặt **chính xác** tại vị trí của placement node
   - Placement node đã được designer đặt sẵn trong scene 3D

2. **Clone Scene:**
   ```typescript
   productGltf.scene.clone()
   ```
   - Clone scene để tránh mutate scene gốc
   - Mỗi instance có scene riêng

3. **Recursive Products:**
   ```typescript
   nodeMatchers={ProductsNodes()}
   ```
   - Product có thể chứa sub-products (ví dụ: camera mount có camera)
   - Sử dụng lại ProductsNodes() để tìm và render sub-products

4. **Interaction:**
   - Sản phẩm có thể được highlight và click
   - Annotation popup hiển thị khi click

---

## 6. Quá Trình Add Sản Phẩm - Redux Flow

### 6.1. User Action → Command

Khi user chọn sản phẩm từ UI:

```typescript
// AddItemCommand.ts
export class AddItemCommand extends ItemCommand {
  public assetId: string;
  public nameProperty: string;
  
  public executeCommand(): boolean {
    // Cập nhật configuration với assetId
    this.configurator.setConfiguration({
      [this.nameProperty]: {
        assetId: this.assetId,
      },
    });
    return true;
  }
}
```

**Kết quả:** Configuration được cập nhật với `{ attributeName: { assetId: "..." } }`

### 6.2. Redux Middleware Xử Lý

File: `src/store/middleware/index.ts`

```typescript
case UI_ACTION_NAME.ADD_ACTIVE_CARD: {
  const { key } = action.payload;
  const activeStep = getActiveStep(state);
  
  // ... xử lý permissions, colors, displays ...
  
  // ⭐ Quan trọng: Update nodes mapping
  const updateNodes = updateNodesByConfiguration(
    currentConfigurator,
    activeStep
  );
  const attributeNames = Configurator.getNamesAttrByStepName(activeStep);
  updateNodes(store, attributeNames); // Gọi hàm update nodes
  break;
}
```

### 6.3. updateNodesByConfiguration

File: `src/store/slices/configurator/handlers/handlers.ts`

```typescript
export function updateNodesByConfiguration(
  configurator: Configurator,
  stepName: StepName
) {
  return (store: Store, arrayAttributes: Array<Array<string>>) => {
    const state = store.getState();
    const configuration = configurator.getConfiguration();
    const step = getDataStepByName(stepName)(state);
    
    arrayAttributes.forEach((item) => {
      const [name] = item; // attribute name (ví dụ: "mic1")
      const value = configuration[name]; // { assetId: "..." }
      
      if (!(typeof value === "object")) return;
      if (value.assetId.length) {
        // Tìm card tương ứng với assetId
        const card: CardI | undefined = findCard(
          (card) => getAssetFromCard(card)(state)?.id === value.assetId,
          Object.values(step.cards)
        );
        if (!card) return;
        
        // Kiểm tra xem đã được mount chưa
        const isMounted = isMountedCard(card, stepName)(value.assetId)(state);
        if (isMounted) return; // Đã mount rồi, skip
        
        // ⭐ Gọi addElement để map nameNode → assetId
        addElement(card, stepName, count)(store);
      }
    });
  };
}
```

### 6.4. addElement - Core Logic

File: `src/store/slices/configurator/handlers/handlers.ts`

```typescript
export function addElement(
  card: CardI,
  stepName: StepName,
  countValue?: number
) {
  return (store: Store) => {
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    if (!card || !step) return;
    
    const cardAsset = getAssetFromCard(card)(state);
    const element = step.getElementByName(card.keyPermission);
    
    if (element instanceof ItemElement) {
      const defaultMount = element.getDefaultMount();
      
      if (defaultMount instanceof CountableMountElement) {
        // Mount có thể có nhiều instances (ví dụ: nhiều microphones)
        defaultMount.setActiveIndex(card.counter.min);
        const nodeName = defaultMount.next().getNameNode(); // Lấy placement node name
        
        // ⭐ QUAN TRỌNG: Map nameNode → assetId trong Redux store
        setElementByNameNode(cardAsset.id, nodeName)(store);
        return;
      } else if (defaultMount instanceof MountElement) {
        // Mount đơn giản (1 instance)
        const dependentMount = defaultMount.getDependentMount();
        
        if (!dependentMount) {
          // Không có dependency → đặt trực tiếp
          setElementByNameNode(cardAsset.id, defaultMount.getNameNode())(store);
          return;
        }
        
        // Có dependency (ví dụ: camera cần mount trước)
        const dependentCard = getCardByKeyPermission(
          stepName,
          dependentMount.name
        )(state);
        const dependentCardAsset = getAssetFromCard(dependentCard)(state);
        
        // Đặt dependent mount trước
        setElementByNameNode(
          dependentCardAsset.id,
          defaultMount.getNameNode()
        )(store);
        // Sau đó đặt item vào dependent mount
        setElementByNameNode(
          cardAsset.id,
          dependentMount.getNameNode()
        )(store);
      }
    }
  };
}
```

**Logic chính:**

1. **Lấy Element từ Permission:**
   - Mỗi card có một `Element` (ItemElement hoặc MountElement)
   - Element chứa thông tin về placement node name

2. **Xác Định Placement Node:**
   - `defaultMount.getNameNode()` → trả về tên placement node (ví dụ: `"Mic_Placement_1"`)
   - Với CountableMountElement: có thể có nhiều nodes, dùng `next()` để lấy node tiếp theo

3. **Map vào Redux Store:**
   ```typescript
   setElementByNameNode(cardAsset.id, nodeName)(store);
   ```
   - Dispatch action `changeValueNodes({ [nodeName]: assetId })`
   - Cập nhật `state.configurator.nodes[nodeName] = assetId`

### 6.5. setElementByNameNode

```typescript
function setElementByNameNode(assetId: string, nameNode: string) {
  return (store: Store) => {
    store.dispatch(
      changeValueNodes({
        [nameNode]: assetId, // Map nameNode → assetId
      })
    );
  };
}
```

**Kết quả:** Redux store được cập nhật:
```typescript
{
  nodes: {
    "Mic_Placement_1": "asset-id-123",
    "Camera_Wall_Placement_2": "asset-id-456",
  }
}
```

---

## 7. Render Flow - Từ Redux Store Đến 3D Scene

### 7.1. Redux Store Update → Component Re-render

Khi `changeValueNodes` được dispatch:

1. **Redux store cập nhật:**
   ```typescript
   state.configurator.nodes["Mic_Placement_1"] = "asset-id-123"
   ```

2. **ProductNode re-render:**
   ```typescript
   const attachNodeNameToAssetId = useAppSelector(getNodes);
   // attachNodeNameToAssetId["Mic_Placement_1"] = "asset-id-123"
   
   if (!Object.keys(attachNodeNameToAssetId).includes(nameNode))
     return undefined; // ❌ Trước đây return undefined
   
   // ✅ Bây giờ có mapping → render Product
   return <Product productAssetId={attachNodeNameToAssetId[nameNode]} ... />
   ```

3. **Product component load asset:**
   ```typescript
   const productGltf = useAsset({ 
     assetId: "asset-id-123", 
     configuration 
   });
   ```

4. **Render tại vị trí placement node:**
   ```typescript
   <group position={parentNode.position} ...>
     <GLTFNode threeNode={productGltf.scene.clone()} />
   </group>
   ```

### 7.2. Visual Result

```
Scene 3D:
  Room (GLTF scene)
    ├─ Wall (Mesh)
    ├─ Table (Mesh)
    ├─ Mic_Placement_1 (Empty Object3D) → Replaced by ProductNode
    │   └─ Product (group at Mic_Placement_1.position)
    │       └─ Microphone 3D Model
    ├─ Mic_Placement_2 (Empty Object3D) → Replaced by ProductNode
    │   └─ Product (group at Mic_Placement_2.position)
    │       └─ Microphone 3D Model
    └─ Camera_Wall_Placement_1 (Empty Object3D) → Replaced by ProductNode
        └─ Product (group at Camera_Wall_Placement_1.position)
            └─ Camera 3D Model
```

---

## 8. Các Trường Hợp Đặc Biệt

### 8.1. Countable Mounts (Nhiều Instances)

Một số sản phẩm có thể có nhiều instances (ví dụ: 7 microphones):

```typescript
if (defaultMount instanceof CountableMountElement) {
  defaultMount.setActiveIndex(card.counter.min);
  const nodeName = defaultMount.next().getNameNode();
  // next() trả về placement node tiếp theo chưa được sử dụng
  // Ví dụ: "Mic_Placement_1", "Mic_Placement_2", ...
  setElementByNameNode(cardAsset.id, nodeName)(store);
}
```

**Logic:**
- `CountableMountElement` quản lý danh sách placement nodes
- `next()` trả về node tiếp theo chưa được assign
- Khi user tăng số lượng → gọi `next()` để lấy node mới

### 8.2. Dependent Mounts (Dependencies)

Một số sản phẩm cần mount khác trước (ví dụ: camera cần camera mount):

```typescript
const dependentMount = defaultMount.getDependentMount();
if (dependentMount) {
  // Tìm card của dependent mount
  const dependentCard = getCardByKeyPermission(stepName, dependentMount.name)(state);
  const dependentCardAsset = getAssetFromCard(dependentCard)(state);
  
  // Đặt mount trước
  setElementByNameNode(
    dependentCardAsset.id,
    defaultMount.getNameNode() // Mount placement node
  )(store);
  
  // Sau đó đặt item vào mount
  setElementByNameNode(
    cardAsset.id,
    dependentMount.getNameNode() // Item placement node (trên mount)
  )(store);
}
```

**Ví dụ:**
- Camera cần `Camera_Wall_Mount_Placement` trước
- Sau đó camera được đặt vào `Camera_Wall_Placement_1` (trên mount)

### 8.3. Bundle Mounts

Một số sản phẩm đi kèm với mounts tự động:

```typescript
const bundleMountApply = (element: ItemElement) => {
  const bundleMount = permission.getBundleMountElementsByName(element.name);
  bundleMount.forEach((mount) => {
    const card = getCardByKeyPermission(...)(state);
    const cardAsset = getAssetFromCard(card)(state);
    
    if (mount instanceof CountableMountElement) {
      mount.getAvailableNameNode().forEach((nameNode) => {
        setElementByNameNode(cardAsset.id, nameNode)(store);
      });
    } else {
      setElementByNameNode(cardAsset.id, mount.getNameNode())(store);
    }
  });
};
```

**Ví dụ:** Khi chọn microphone, tự động thêm microphone mount

### 8.4. Auto Change Items

Một số items tự động thay đổi khi count thay đổi:

```typescript
const autoChangeItems = element.getAutoChangeItems();
// Ví dụ: Khi tăng số microphone, tự động thêm mounts tương ứng
```

---

## 9. Remove Sản Phẩm

### 9.1. removeElement Function

File: `src/store/slices/configurator/handlers/handlers.ts`

```typescript
export function removeElement(card: CardI, stepName: StepName) {
  return (store: Store) => {
    const state = store.getState();
    const cardAsset = getAssetFromCard(card)(state);
    
    const element = step.getElementByName(card.keyPermission);
    
    if (element instanceof ItemElement) {
      const mountElement = element.getDefaultMount();
      
      if (mountElement instanceof CountableMountElement) {
        // Lấy tất cả placement nodes đang được sử dụng
        const names = mountElement.getAvailableNameNode();
        // Xóa mapping
        store.dispatch(removeNodeByKeys(names));
      } else if (mountElement instanceof MountElement) {
        // Xóa single node
        store.dispatch(removeNodeByKeys([mountElement.getNameNode()]));
      }
    }
    
    // Xóa tất cả nodes có assetId này
    store.dispatch(removeNodes(cardAsset.id));
  };
}
```

**Kết quả:**
- Nodes được xóa khỏi Redux store
- `ProductNode` re-render và return `undefined` (không có mapping)
- Sản phẩm biến mất khỏi scene

---

## 10. Tóm Tắt Quy Trình

### 10.1. Setup Phase (Khi load phòng)

1. **Room component load scene:**
   - `useScene({ assetId: roomAssetId })` → load GLTF scene

2. **GLTFNode traverse scene:**
   - Duyệt qua tất cả nodes trong scene
   - Sử dụng `ProductsNodes()` matchers để tìm placement nodes

3. **Placement nodes được replace:**
   - Mỗi placement node → `ProductNode` component
   - `ProductNode` kiểm tra Redux store
   - Nếu chưa có mapping → return `undefined` (node trống)
   - Nếu có mapping → render `Product` component

### 10.2. Add Product Phase (Khi user chọn sản phẩm)

1. **User action:**
   - Click chọn sản phẩm từ UI

2. **Command execution:**
   - `AddItemCommand.executeCommand()` → update configuration

3. **Redux middleware:**
   - `updateNodesByConfiguration()` được gọi

4. **addElement():**
   - Xác định placement node name từ element/mount
   - `setElementByNameNode(assetId, nameNode)` → update Redux store

5. **Component re-render:**
   - `ProductNode` detect mapping mới
   - Render `Product` component
   - `Product` load asset và render tại vị trí placement node

### 10.3. Position Logic

**Vị trí sản phẩm được xác định bởi:**
- **Placement node position** trong scene 3D (được designer đặt sẵn)
- Product component copy `position`, `scale`, `rotation` từ placement node
- **Không có logic tính toán position** - tất cả dựa vào placement nodes có sẵn

---

## 11. Điểm Quan Trọng Cần Nhớ

1. **Placement nodes là foundation:**
   - Tất cả vị trí được định nghĩa sẵn trong scene 3D
   - Không thể đặt sản phẩm ở vị trí không có placement node

2. **Redux store là source of truth:**
   - `state.configurator.nodes` chứa mapping `nameNode → assetId`
   - Component react với store changes

3. **Node matchers pattern:**
   - Sử dụng matcher functions để tìm và replace nodes
   - Cho phép flexible và extensible

4. **Recursive products:**
   - Products có thể chứa sub-products
   - Sử dụng lại `ProductsNodes()` matchers

5. **Configuration:**
   - Mỗi product có configuration riêng (màu sắc, options)
   - Configuration được load cùng với asset

6. **Dependencies:**
   - Một số sản phẩm cần mounts/dependencies trước
   - Logic phức tạp trong `addElement()`

---

## 12. Code Examples

### 12.1. Thêm Microphone vào Placement Node

```typescript
// 1. User chọn microphone
// 2. AddItemCommand được tạo
const command = new AddItemCommand(
  configurator,
  "mic1", // attribute name
  "mic-asset-id-123", // asset ID
  "mic" // keyPermission
);

// 3. Command execute
command.executeCommand();
// Configuration: { mic1: { assetId: "mic-asset-id-123" } }

// 4. Redux middleware
updateNodesByConfiguration(configurator, StepName.Audio)(store, [["mic1"]]);

// 5. addElement
const card = getCardByKeyPermission(StepName.Audio, "mic")(state);
addElement(card, StepName.Audio)(store);

// 6. setElementByNameNode
setElementByNameNode("mic-asset-id-123", "Mic_Placement_1")(store);
// Redux: { nodes: { "Mic_Placement_1": "mic-asset-id-123" } }

// 7. ProductNode re-render
// attachNodeNameToAssetId["Mic_Placement_1"] = "mic-asset-id-123"
// → Render Product component

// 8. Product load và render
const productGltf = useAsset({ assetId: "mic-asset-id-123", configuration });
// Render tại Mic_Placement_1.position
```

### 12.2. Kiểm Tra Placement Node Có Sản Phẩm

```typescript
// Trong ProductNode
const attachNodeNameToAssetId = useAppSelector(getNodes);

if (!Object.keys(attachNodeNameToAssetId).includes(nameNode)) {
  // Placement node trống → không render gì
  return undefined;
}

// Có sản phẩm → render
return <Product productAssetId={attachNodeNameToAssetId[nameNode]} ... />;
```

---

## Kết Luận

Hệ thống load và place sản phẩm hoạt động dựa trên:
1. **Placement nodes** được định nghĩa sẵn trong scene 3D
2. **Node matchers** tìm và replace placement nodes
3. **Redux store** lưu mapping `nameNode → assetId`
4. **Product components** load và render tại vị trí placement nodes

Vị trí sản phẩm được xác định hoàn toàn bởi **placement node position** trong scene 3D, không có logic tính toán position động.

