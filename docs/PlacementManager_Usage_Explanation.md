# Giải Thích: PlacementManager Methods Được Gọi Ở Đâu?

## Câu Hỏi

**Q: Function static như `getNameNodeForTap` được gọi ở đâu? Đây có phải là method đặt tên cho sản phẩm không?**

**A: KHÔNG!** Đây **KHÔNG phải** là method đặt tên cho sản phẩm. Đây là method **trả về tên của placement node** (vị trí đặt sản phẩm) đã được định nghĩa sẵn trong scene 3D.

---

## 1. Hiểu Đúng Về PlacementManager

### 1.1. PlacementManager KHÔNG đặt tên sản phẩm

**PlacementManager KHÔNG:**
- ❌ Đặt tên cho sản phẩm
- ❌ Tạo placement nodes
- ❌ Quyết định vị trí sản phẩm

**PlacementManager LÀM:**
- ✅ Trả về **tên của placement node** đã có sẵn trong scene 3D
- ✅ Đảm bảo **naming convention** thống nhất
- ✅ Cung cấp **single source of truth** cho node names

### 1.2. Placement Nodes Đã Được Tạo Sẵn

**Placement nodes** là các empty nodes (Object3D) được **designer đặt sẵn** trong scene 3D với tên cụ thể:

```
Scene 3D (đã được export từ Blender/3D software):
  ├─ Wall (Mesh)
  ├─ Table (Mesh)
  ├─ Mic_Placement_1 (Empty Object3D) ← Đã có sẵn với tên này
  ├─ Mic_Placement_2 (Empty Object3D) ← Đã có sẵn với tên này
  ├─ Tap_Placement_Wall_1 (Empty Object3D) ← Đã có sẵn với tên này
  └─ Camera_Wall_Placement_1 (Empty Object3D) ← Đã có sẵn với tên này
```

**PlacementManager chỉ cung cấp methods để lấy đúng tên đó:**

```typescript
PlacementManager.getNameNodeForTap("Wall", 1)
// → Trả về: "Tap_Placement_Wall_1"
// Đây là tên node ĐÃ CÓ SẴN trong scene, không phải tạo mới!
```

---

## 2. Các Nơi Sử Dụng PlacementManager Methods

### 2.1. permissionUtils.ts - Tạo MountElement và ItemElement

**File:** `src/utils/permissionUtils.ts`

**Mục đích:** Khi tạo `MountElement` hoặc `ItemElement`, cần truyền `nodeName` (tên placement node)

**Ví dụ với Tap:**

```typescript
export function createStepMeetingController() {
  const setMountForTap = (item: ItemElement) => {
    return item
      .addDependenceMount(
        new MountElement(
          MeetingControllerName.TapWallMount,
          // ⭐ Sử dụng PlacementManager để lấy tên placement node
          PlacementManager.getNameNodeForTap("Wall", 1)
        )
      )
      .addDependenceMount(
        new MountElement(
          MeetingControllerName.TapRiserMount,
          PlacementManager.getNameNodeForTap("Table", 1)
        )
      )
      .setDefaultMount(
        new MountElement(
          item.name,
          PlacementManager.getNameNodeForTap("Table", 1)
        )
      );
  };
}
```

**Giải thích:**
- Khi tạo `MountElement`, constructor nhận 2 params: `(name, nodeName)`
- `nodeName` phải là tên placement node **đã có sẵn** trong scene
- `PlacementManager.getNameNodeForTap("Wall", 1)` trả về `"Tap_Placement_Wall_1"`
- Node này **phải tồn tại** trong scene 3D với đúng tên này

**Flow:**
```
1. Designer tạo scene 3D với node tên "Tap_Placement_Wall_1"
2. Code sử dụng PlacementManager.getNameNodeForTap("Wall", 1)
3. Method trả về "Tap_Placement_Wall_1"
4. MountElement được tạo với nodeName = "Tap_Placement_Wall_1"
5. Khi add sản phẩm, hệ thống tìm node có tên "Tap_Placement_Wall_1" trong scene
6. Đặt sản phẩm tại vị trí của node đó
```

---

### 2.2. roadMapDimension.ts - Định Nghĩa Dimension Data

**File:** `src/models/dimension/roadMapDimension.ts`

**Mục đích:** Định nghĩa dimension measurements cho các sản phẩm

```typescript
{
  conditions: [...],
  data: {
    camera: {
      // ⭐ Sử dụng PlacementManager để lấy tên node
      nodeName: PlacementManager.getNameNodeCommodeForCamera("RallyBar", 2),
    },
    micPod: {
      nodeName: PlacementManager.getNameNodeForMicWithoutSight(),
      orderMicPods: [[2, 1]],
    },
  },
}
```

**Giải thích:**
- Dimension system cần biết node nào để đo kích thước
- Sử dụng PlacementManager để đảm bảo dùng đúng tên node

---

### 2.3. ProductsNodes.tsx - Tìm Placement Nodes Trong Scene

**File:** `src/components/Assets/ProductsNodes.tsx`

**Mục đích:** Tạo node matchers để tìm placement nodes trong scene

```typescript
export const ProductsNodes = () => {
  // ⭐ Lấy tất cả placement node names
  const allNodePlacement = PlacementManager.getAllPlacement();
  // allNodePlacement = [
  //   "Mic_Placement_1",
  //   "Mic_Placement_2",
  //   "Tap_Placement_Wall_1",
  //   "Camera_Wall_Placement_1",
  //   ...
  // ]

  const nodeMatchers: NodeMatcher[] = [
    (threeNode) => {
      // Kiểm tra nếu node name có trong danh sách placements
      if (allNodePlacement.includes(threeNode.name)) {
        return (
          <Suspense>
            <ProductNode parentNode={threeNode} nameNode={threeNode.name} />
          </Suspense>
        );
      }
      return undefined;
    },
  ];

  return nodeMatchers;
};
```

**Giải thích:**
- `getAllPlacement()` trả về danh sách tất cả placement node names
- Khi traverse scene, kiểm tra nếu `node.name` có trong danh sách
- Nếu có → đây là placement node → replace bằng `ProductNode`

**Flow:**
```
1. Scene 3D được load
2. GLTFNode traverse tất cả nodes
3. Với mỗi node, check: node.name có trong allNodePlacement không?
4. Nếu node.name = "Tap_Placement_Wall_1" và có trong allNodePlacement
   → Đây là placement node → Render ProductNode
5. ProductNode sẽ kiểm tra Redux store xem có sản phẩm nào được assign không
```

---

### 2.4. Product.tsx - Kiểm Tra Sản Phẩm Không Tương Tác

**File:** `src/components/Assets/Product.tsx`

```typescript
{PlacementManager.getNameNodeWithoutInteraction().includes(nameNode) ? (
  // Sản phẩm không tương tác (như TV)
  <GLTFNode threeNode={productGltf.scene.clone()} />
) : (
  // Sản phẩm có thể tương tác
  <Select enabled={highlight} onClick={...}>
    <GLTFNode threeNode={productGltf.scene.clone()} />
  </Select>
)}
```

**Giải thích:**
- Kiểm tra nếu placement node là TV (không tương tác được)
- Nếu là TV → không wrap trong `<Select>` (không click được)

---

### 2.5. GLTFNode.tsx - Filter TV Nodes

**File:** `src/components/Assets/GLTFNode.tsx`

```typescript
.filter(
  (name) => !name.includes(PlacementManager.getNameNodeForTV())
);
```

**Giải thích:**
- Filter ra TV nodes khi xử lý pointer events
- TV không nên trigger pointer cursor changes

---

### 2.6. Handlers - addElement/removeElement

**File:** `src/store/slices/configurator/handlers/handlers.ts`

**Mục đích:** Khi add/remove sản phẩm, cần biết placement node name

```typescript
export function addElement(card: CardI, stepName: StepName) {
  return (store: Store) => {
    const element = step.getElementByName(card.keyPermission);
    
    if (element instanceof ItemElement) {
      const defaultMount = element.getDefaultMount();
      
      // ⭐ Lấy tên placement node từ MountElement
      const nodeName = defaultMount.getNameNode();
      // nodeName đã được set từ PlacementManager khi tạo MountElement
      
      // Map nameNode → assetId trong Redux store
      setElementByNameNode(cardAsset.id, nodeName)(store);
    }
  };
}
```

**Flow:**
```
1. MountElement được tạo với nodeName từ PlacementManager
   new MountElement("Tap", PlacementManager.getNameNodeForTap("Wall", 1))
   // nodeName = "Tap_Placement_Wall_1"

2. Khi user chọn sản phẩm, addElement() được gọi

3. Lấy nodeName từ MountElement
   const nodeName = defaultMount.getNameNode();
   // nodeName = "Tap_Placement_Wall_1"

4. Map vào Redux store
   setElementByNameNode(assetId, "Tap_Placement_Wall_1")(store);
   // Redux: { nodes: { "Tap_Placement_Wall_1": "asset-id-123" } }

5. ProductNode detect mapping mới và render Product component
```

---

## 3. Ví Dụ Cụ Thể: getNameNodeForTap

### 3.1. Method Definition

```typescript
public static getNameNodeForTap(type: "Wall" | "Table", id: number): string {
  return `Tap_Placement_${type}_${id}`;
}
```

**Chức năng:**
- Trả về string: `"Tap_Placement_Wall_1"` hoặc `"Tap_Placement_Table_2"`
- **KHÔNG tạo node**, chỉ trả về tên

---

### 3.2. Nơi Gọi Method

#### 3.2.1. permissionUtils.ts - Tạo MountElement

```typescript
new MountElement(
  MeetingControllerName.TapWallMount,
  PlacementManager.getNameNodeForTap("Wall", 1)
  // ↑ Trả về: "Tap_Placement_Wall_1"
)
```

**Kết quả:**
- `MountElement` có `nodeName = "Tap_Placement_Wall_1"`
- Node này **phải tồn tại** trong scene 3D với đúng tên này

---

#### 3.2.2. getAllPlacement() - Tạo Danh Sách Placements

```typescript
["Wall", "Table"].forEach((type: any) => {
  Array.from({ length: 2 }, (_, i) => i + 1).forEach((num) =>
    placements.push(this.getNameNodeForTap(type, num))
    // ↑ Gọi method để tạo danh sách: 
    //   "Tap_Placement_Wall_1", "Tap_Placement_Wall_2",
    //   "Tap_Placement_Table_1", "Tap_Placement_Table_2"
  );
});
```

**Kết quả:**
- Danh sách placements chứa: `["Tap_Placement_Wall_1", "Tap_Placement_Wall_2", ...]`
- Danh sách này được dùng để tìm placement nodes trong scene

---

### 3.3. Flow Hoàn Chỉnh

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DESIGNER tạo scene 3D                                     │
│    - Tạo node tên "Tap_Placement_Wall_1" tại vị trí X, Y, Z │
│    - Tạo node tên "Tap_Placement_Table_1" tại vị trí A, B, C│
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. CODE: permissionUtils.ts                                   │
│    new MountElement(                                          │
│      "TapWallMount",                                         │
│      PlacementManager.getNameNodeForTap("Wall", 1)          │
│      // → "Tap_Placement_Wall_1"                             │
│    )                                                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CODE: ProductsNodes.tsx                                    │
│    const allNodePlacement = PlacementManager.getAllPlacement()│
│    // → ["Tap_Placement_Wall_1", "Tap_Placement_Table_1", ...]│
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. RUNTIME: Room component load scene                        │
│    - GLTFNode traverse scene                                 │
│    - Tìm node có name = "Tap_Placement_Wall_1"              │
│    - Replace bằng ProductNode                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. RUNTIME: User chọn Tap sản phẩm                          │
│    - addElement() được gọi                                   │
│    - Lấy nodeName từ MountElement                            │
│    - nodeName = "Tap_Placement_Wall_1"                       │
│    - Map vào Redux: { "Tap_Placement_Wall_1": "asset-id" }  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. RUNTIME: ProductNode re-render                           │
│    - Detect mapping mới trong Redux                         │
│    - Render Product component                                │
│    - Product load asset và render tại vị trí node            │
│    - Vị trí = node.position (từ scene 3D)                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Tóm Tắt

### 4.1. PlacementManager KHÔNG phải là:

❌ **Method đặt tên sản phẩm**
- Sản phẩm có tên riêng (ví dụ: "Logitech Tap IP")
- PlacementManager không liên quan đến tên sản phẩm

❌ **Method tạo placement nodes**
- Placement nodes được tạo bởi designer trong scene 3D
- PlacementManager chỉ cung cấp tên

❌ **Method quyết định vị trí**
- Vị trí được quyết định bởi designer khi đặt nodes trong scene
- PlacementManager chỉ cung cấp tên để tìm node

---

### 4.2. PlacementManager LÀ:

✅ **Naming Convention Manager**
- Đảm bảo tất cả code dùng cùng naming pattern
- Single source of truth cho node names

✅ **Helper Methods**
- Cung cấp methods để lấy tên placement node
- Tránh hardcode strings trong code

✅ **Bridge giữa Code và Scene 3D**
- Code sử dụng PlacementManager để lấy tên
- Scene 3D có nodes với tên tương ứng
- Hệ thống match tên để tìm nodes

---

### 4.3. Quan Hệ Giữa Code và Scene 3D

```
Scene 3D (Blender/3D Software)          Code (TypeScript)
─────────────────────────────────       ────────────────────────
Node: "Tap_Placement_Wall_1"    ←──→    PlacementManager.getNameNodeForTap("Wall", 1)
  at position (X, Y, Z)                  → "Tap_Placement_Wall_1"
                                         
Node: "Mic_Placement_1"         ←──→    PlacementManager.getNameNodeForMic(1)
  at position (A, B, C)                  → "Mic_Placement_1"
                                         
Node: "Camera_Wall_Placement_2"  ←──→    PlacementManager.getNameNodeForCamera("Wall", 2)
  at position (M, N, O)                  → "Camera_Wall_Placement_2"
```

**Quy tắc:**
- Tên node trong scene 3D **PHẢI KHỚP** với tên từ PlacementManager
- Nếu không khớp → hệ thống không tìm thấy node → sản phẩm không hiển thị

---

## 5. Kết Luận

**PlacementManager methods như `getNameNodeForTap`:**

1. **Được gọi ở:** 
   - `permissionUtils.ts` - khi tạo MountElement/ItemElement
   - `getAllPlacement()` - để tạo danh sách placements
   - `roadMapDimension.ts` - để định nghĩa dimension data
   - Các nơi khác cần biết tên placement node

2. **KHÔNG phải method đặt tên sản phẩm:**
   - Đây là method trả về **tên placement node** (vị trí đặt sản phẩm)
   - Placement nodes đã được designer tạo sẵn trong scene 3D
   - PlacementManager chỉ cung cấp naming convention để lấy đúng tên

3. **Mục đích:**
   - Đảm bảo code và scene 3D dùng cùng naming pattern
   - Tránh hardcode strings
   - Single source of truth cho node names

**Tóm lại:** PlacementManager là **"dictionary"** để lấy tên placement nodes, không phải tool để đặt tên hay tạo nodes!

