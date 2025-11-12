# Quy Trình Gắn Sản Phẩm Vào Placement Node - Chi Tiết

## Ví Dụ: Camera_TV_Placement_1_display_1

Tài liệu này giải thích chi tiết quy trình từ khi tìm thấy placement node trong scene đến khi sản phẩm được render tại vị trí đó.

---

## Tổng Quan Flow

```
1. Scene Load → GLTFNode traverse scene
2. ProductsNodes matcher tìm thấy "Camera_TV_Placement_1_display_1"
3. ProductNode kiểm tra Redux store: có mapping không?
4. Nếu có → Product component load asset và render
5. Sản phẩm hiển thị tại vị trí của placement node
```

---

## Bước 1: Scene Load và Traverse

### 1.1. Room Component Load Scene

```typescript
// Room.tsx
const gltf = useScene({ assetId: roomAssetId });

// Render scene với ProductsNodes matcher
<GLTFNode threeNode={gltf.scene} nodeMatchers={ProductsNodes()} />
```

**Kết quả:**
- Scene được load từ Threekit
- `gltf.scene` chứa toàn bộ scene graph
- Trong scene có node tên `"Camera_TV_Placement_1_display_1"` (empty Object3D)

---

## Bước 2: ProductsNodes Matcher Tìm Placement Nodes

### 2.1. ProductsNodes Function

```typescript
// ProductsNodes.tsx
export const ProductsNodes = () => {
  // Lấy danh sách TẤT CẢ placement node names từ PlacementManager
  const allNodePlacement = PlacementManager.getAllPlacement();
  // ["Mic_Placement_1", "Mic_Placement_2", ..., 
  //  "Camera_TV_Placement_1", "Camera_TV_Placement_1_display_1", ...]

  const nodeMatchers: NodeMatcher[] = [
    (threeNode) => {
      // Kiểm tra: node name có trong danh sách placement nodes không?
      if (allNodePlacement.includes(threeNode.name)) {
        // ✅ Tìm thấy placement node!
        return (
          <Suspense>
            <ProductNode parentNode={threeNode} nameNode={threeNode.name} />
          </Suspense>
        );
      }
      return undefined; // Không phải placement node → giữ nguyên
    },
  ];

  return nodeMatchers;
};
```

### 2.2. GLTFNode Traverse và Apply Matchers

```typescript
// GLTFNode.tsx
export const GLTFNode = ({ threeNode, nodeMatchers }) => {
  // Áp dụng nodeMatchers
  for (let i = 0; i < nodeMatchers.length; i++) {
    const jsx = nodeMatchers[i](threeNode, nodeMatchers);
    if (jsx) {
      // ✅ Matcher trả về JSX → replace node này
      return jsx;
    }
  }

  // Không match → render bình thường
  // Recursively render children
  const children = threeNode.children.map((child) => (
    <GLTFNode threeNode={child} nodeMatchers={nodeMatchers} />
  ));
  // ...
};
```

**Khi traverse đến node `"Camera_TV_Placement_1_display_1"`:**

1. **GLTFNode** gọi `nodeMatchers[0](threeNode)`
2. **ProductsNodes matcher** kiểm tra:
   ```typescript
   allNodePlacement.includes("Camera_TV_Placement_1_display_1")
   // → true (vì PlacementManager.getAllPlacement() có chứa tên này)
   ```
3. **Matcher trả về:**
   ```typescript
   <ProductNode 
     parentNode={threeNode}  // Node từ scene (có position, rotation, scale)
     nameNode="Camera_TV_Placement_1_display_1" 
   />
   ```
4. **GLTFNode** replace node gốc bằng `ProductNode` component

---

## Bước 3: ProductNode Kiểm Tra Redux Store

### 3.1. ProductNode Component

```typescript
// ProductNode.tsx
export const ProductNode: FC<ProductProps> = ({ nameNode, parentNode }) => {
  // ⭐ QUAN TRỌNG: Lấy mapping từ Redux store
  const attachNodeNameToAssetId = useAppSelector(getNodes);
  // attachNodeNameToAssetId = {
  //   "Mic_Placement_1": "mic-asset-id-123",
  //   "Camera_TV_Placement_1_display_1": "camera-asset-id-456",  // ← Nếu có
  //   ...
  // }

  const configuration = useAppSelector(getConfiguration);
  // configuration = {
  //   "Camera_TV_Placement_1_display_1": { color: "black", ... },  // ← Nếu có
  //   ...
  // }

  // ⭐ KIỂM TRA: Placement node này có sản phẩm được assign chưa?
  if (!Object.keys(attachNodeNameToAssetId).includes(nameNode)) {
    // ❌ Chưa có sản phẩm → không render gì
    return undefined;
  }

  // ✅ Có sản phẩm → render Product component
  return (
    <Product
      parentNode={parentNode}  // Placement node (có position, rotation, scale)
      productAssetId={attachNodeNameToAssetId[nameNode]}  // "camera-asset-id-456"
      configuration={configuration[nameNode]}  // Product configuration
      nameNode={nameNode}  // "Camera_TV_Placement_1_display_1"
      // ... các props khác
    />
  );
};
```

**Kết quả:**

- **Nếu Redux store CHƯA có mapping:**
  ```typescript
  attachNodeNameToAssetId = {
    "Mic_Placement_1": "mic-asset-id-123",
    // Không có "Camera_TV_Placement_1_display_1"
  }
  ```
  → `ProductNode` return `undefined` → Placement node trống (không hiển thị gì)

- **Nếu Redux store ĐÃ CÓ mapping:**
  ```typescript
  attachNodeNameToAssetId = {
    "Camera_TV_Placement_1_display_1": "camera-asset-id-456",
  }
  ```
  → `ProductNode` render `Product` component

---

## Bước 4: Product Component Load và Render

### 4.1. Load Product Asset

```typescript
// Product.tsx
export const Product: React.FC<ProductProps> = ({
  parentNode,        // Placement node từ scene
  productAssetId,   // "camera-asset-id-456" từ Redux store
  configuration,     // Product configuration
  nameNode,         // "Camera_TV_Placement_1_display_1"
}) => {
  // ⭐ Load product GLTF từ Threekit với configuration
  const productGltf = useAsset({ 
    assetId: productAssetId,  // "camera-asset-id-456"
    configuration              // { color: "black", ... }
  });

  // ⭐ Render tại vị trí của placement node
  return (
    <group
      position={parentNode.position}  // ← Vị trí từ placement node
      scale={parentNode.scale}        // ← Scale từ placement node
      rotation={parentNode.rotation}  // ← Rotation từ placement node
    >
      <GLTFNode
        threeNode={productGltf.scene.clone()}  // Product 3D model
        nodeMatchers={ProductsNodes()}         // Recursive: có thể có nested products
      />
    </group>
  );
};
```

**Kết quả:**
- Product 3D model được load từ Threekit
- Render tại **chính xác vị trí** của placement node
- Inherit position, rotation, scale từ placement node

---

## Bước 5: Mapping Được Tạo Như Thế Nào?

### 5.1. User Action → addElement

**Khi user chọn sản phẩm từ UI:**

```typescript
// User clicks "Add Camera" button
// → Handler gọi addElement()

addElement(card, StepName.ConferenceCamera)(store);
```

### 5.2. addElement Logic

```typescript
// handlers.ts
export function addElement(card: CardI, stepName: StepName) {
  return (store: Store) => {
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    
    // Lấy Element từ card
    const element = step.getElementByName(card.keyPermission);
    // element = CameraElement (ItemElement)
    
    if (element instanceof ItemElement) {
      const defaultMount = element.getDefaultMount();
      // defaultMount = MountElement với nameNode từ PlacementManager
      
      if (defaultMount instanceof MountElement) {
        // ⭐ Lấy tên placement node từ mount
        const nodeName = defaultMount.getNameNode();
        // nodeName = "Camera_TV_Placement_1_display_1"
        // (được tạo từ PlacementManager.getNameNodeForCamera("TV", 1, 1))
        
        // Lấy asset ID từ card
        const cardAsset = getAssetFromCard(card)(state);
        // cardAsset.id = "camera-asset-id-456"
        
        // ⭐ Map vào Redux store
        setElementByNameNode(cardAsset.id, nodeName)(store);
        // → Dispatch changeValueNodes({ "Camera_TV_Placement_1_display_1": "camera-asset-id-456" })
      }
    }
  };
}
```

### 5.3. setElementByNameNode

```typescript
// handlers.ts
function setElementByNameNode(assetId: string, nameNode: string) {
  return (store: Store) => {
    store.dispatch(
      changeValueNodes({
        [nameNode]: assetId,  // Map nameNode → assetId
      })
    );
  };
}
```

**Kết quả:**
```typescript
// Redux store được cập nhật:
state.configurator.nodes = {
  "Camera_TV_Placement_1_display_1": "camera-asset-id-456",
  // ...
}
```

---

## Bước 6: Redux Store Update → Component Re-render

### 6.1. Redux Store Update

```typescript
// Configurator.slice.ts
const configuratorSlice = createSlice({
  name: "configurator",
  reducers: {
    changeValueNodes: (state, action: PayloadAction<Record<string, string>>) => {
      state.nodes = { ...state.nodes, ...action.payload };
      // state.nodes["Camera_TV_Placement_1_display_1"] = "camera-asset-id-456"
    },
  },
});
```

### 6.2. ProductNode Re-render

```typescript
// ProductNode.tsx
// Khi Redux store update → useAppSelector trigger re-render
const attachNodeNameToAssetId = useAppSelector(getNodes);
// attachNodeNameToAssetId["Camera_TV_Placement_1_display_1"] = "camera-asset-id-456"

// ✅ Bây giờ có mapping → render Product
if (!Object.keys(attachNodeNameToAssetId).includes(nameNode)) {
  return undefined;  // ❌ Trước đây return undefined
}

// ✅ Bây giờ có mapping
return <Product productAssetId={attachNodeNameToAssetId[nameNode]} ... />;
```

### 6.3. Product Component Render

```typescript
// Product.tsx
const productGltf = useAsset({ 
  assetId: "camera-asset-id-456",  // Từ Redux store
  configuration 
});

// Render tại vị trí placement node
<group
  position={parentNode.position}  // Vị trí từ "Camera_TV_Placement_1_display_1" node
  // ...
>
  <GLTFNode threeNode={productGltf.scene.clone()} />
</group>
```

**Kết quả:** Camera 3D model hiển thị tại vị trí của `Camera_TV_Placement_1_display_1` node!

---

## Flow Diagram - Camera_TV_Placement_1_display_1

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Scene Load (Room.tsx)                                   │
│    gltf.scene chứa node "Camera_TV_Placement_1_display_1"  │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GLTFNode Traverse Scene                                  │
│    → Tìm thấy node "Camera_TV_Placement_1_display_1"       │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. ProductsNodes Matcher                                    │
│    allNodePlacement.includes("Camera_TV_Placement_1_...")  │
│    → ✅ Match! Return <ProductNode />                        │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. ProductNode Component                                    │
│    attachNodeNameToAssetId = useAppSelector(getNodes)      │
│                                                              │
│    Case 1: Chưa có mapping                                  │
│    → return undefined (placement node trống)                │
│                                                              │
│    Case 2: Đã có mapping                                    │
│    attachNodeNameToAssetId["Camera_TV_Placement_1_..."]     │
│      = "camera-asset-id-456"                                │
│    → return <Product productAssetId="camera-asset-id-456" />│
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Product Component                                        │
│    productGltf = useAsset({                                  │
│      assetId: "camera-asset-id-456",                        │
│      configuration                                           │
│    })                                                        │
│                                                              │
│    Render tại:                                               │
│    position={parentNode.position}  ← Từ placement node      │
│    rotation={parentNode.rotation}                           │
│    scale={parentNode.scale}                                 │
└────────────────────┬──────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Camera 3D Model Hiển Thị                                 │
│    ✅ Tại vị trí Camera_TV_Placement_1_display_1            │
└─────────────────────────────────────────────────────────────┘
```

---

## Mapping Được Tạo Khi Nào?

### User Flow: Từ Click Button Đến Render

```
1. User clicks "Add Camera" button
   ↓
2. Handler: addElement(card, StepName.ConferenceCamera)(store)
   ↓
3. Get Element: step.getElementByName("camera")
   ↓
4. Get Mount: element.getDefaultMount()
   ↓
5. Get Node Name: mount.getNameNode()
   → "Camera_TV_Placement_1_display_1"
   (từ PlacementManager.getNameNodeForCamera("TV", 1, 1))
   ↓
6. Get Asset ID: getAssetFromCard(card)
   → "camera-asset-id-456"
   ↓
7. Map vào Redux: setElementByNameNode("camera-asset-id-456", "Camera_TV_Placement_1_display_1")
   ↓
8. Redux Store Update:
   nodes["Camera_TV_Placement_1_display_1"] = "camera-asset-id-456"
   ↓
9. ProductNode Re-render (vì useAppSelector trigger)
   ↓
10. ProductNode thấy có mapping → render Product
   ↓
11. Product load asset và render tại vị trí placement node
   ↓
12. ✅ Camera hiển thị!
```

---

## Điểm Quan Trọng

### 1. Placement Node Phải Có Trong Scene

- Node `"Camera_TV_Placement_1_display_1"` **PHẢI** tồn tại trong GLTF scene
- Nếu không có → `ProductsNodes` matcher không tìm thấy → không render `ProductNode`

### 2. Placement Node Phải Có Trong PlacementManager

- `PlacementManager.getAllPlacement()` **PHẢI** chứa `"Camera_TV_Placement_1_display_1"`
- Nếu không có → `allNodePlacement.includes(node.name)` = false → không match

### 3. Redux Store Phải Có Mapping

- `state.configurator.nodes["Camera_TV_Placement_1_display_1"]` **PHẢI** có giá trị
- Nếu không có → `ProductNode` return `undefined` → không render sản phẩm

### 4. Vị Trí Sản Phẩm = Vị Trí Placement Node

- Sản phẩm render tại **chính xác** `parentNode.position`
- Không có logic tính toán position động
- Position được định nghĩa sẵn trong 3D scene bởi designer

---

## Debug Checklist

Nếu sản phẩm không hiển thị, kiểm tra:

1. ✅ **Placement node có trong scene?**
   - Mở console, xem logs từ PlacementNodesVisualizer
   - Kiểm tra `found` > 0

2. ✅ **Placement node có trong PlacementManager?**
   - `PlacementManager.getAllPlacement().includes("Camera_TV_Placement_1_display_1")`
   - Phải = true

3. ✅ **Redux store có mapping?**
   - `useAppSelector(getNodes)["Camera_TV_Placement_1_display_1"]`
   - Phải có giá trị (asset ID)

4. ✅ **Product component có load asset?**
   - Kiểm tra `productGltf` không null
   - Kiểm tra network tab xem có request asset không

---

## Kết Luận

Quy trình gắn sản phẩm vào placement node:

1. **Scene load** → GLTFNode traverse
2. **ProductsNodes matcher** tìm thấy placement node
3. **ProductNode** kiểm tra Redux store có mapping không
4. **Nếu có** → Product load asset và render tại vị trí placement node
5. **Mapping được tạo** khi user add sản phẩm → `addElement` → `setElementByNameNode`

**Vị trí sản phẩm = vị trí placement node** (được định nghĩa sẵn trong 3D scene).

