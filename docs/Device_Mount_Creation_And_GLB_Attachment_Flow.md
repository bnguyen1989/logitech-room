# Device_Mount Creation và GLB Attachment Flow

## 📋 Tổng Quan

Tài liệu này giải thích:
1. **Tại sao code tạo Device_Mount được viết trong ProductsNodes** (thay vì Room.tsx)
2. **Code nào để gắn GLB vào placement node mới tạo**

---

## 🎯 Câu Hỏi 1: Tại Sao Code Tạo Device_Mount Trong ProductsNodes?

### Vấn Đề Ban Đầu

**Trước đây:** Code tạo Device_Mount được viết trong `Room.tsx`:
- ❌ Logic tạo placement node tách rời khỏi logic render nodes
- ❌ Phải tạo trong `useEffect` khi scene load
- ❌ Không linh hoạt khi cần tạo placement node động

### Giải Pháp: Di Chuyển Vào ProductsNodes

**Bây giờ:** Code tạo Device_Mount được viết trong `ProductsNodes.tsx`:
- ✅ Logic tạo placement node gần với logic render nodes
- ✅ Tạo khi traverse scene (trong nodeMatchers)
- ✅ Linh hoạt hơn, có thể tạo placement node động dựa trên scene structure

### Code Trong ProductsNodes

```typescript
// src/components/Assets/ProductsNodes.tsx
const nodeMatchers: NodeMatcher[] = [
  // Create Device_Mount placement node when traversing scene (only once)
  (threeNode, nodeMatchers) => {
    // Only create once, when traversing the root scene
    if (!deviceMountCreatedRef.current && threeNode.parent === null) {
      deviceMountCreatedRef.current = true;
      
      // Check if placement node already exists
      const existingNode = threeNode.getObjectByName(deviceMountNodeName);
      if (!existingNode) {
        // Create placement node at TV center
        createDeviceMountPlacementNode(threeNode as THREE.Scene | THREE.Group, deviceMountNodeName);
      }
    }
    return undefined;
  },
  
  // ... other matchers
];
```

**Lợi ích:**
- ✅ Tạo placement node khi traverse scene (trong quá trình render)
- ✅ Chỉ tạo một lần (dùng `useRef` để track)
- ✅ Gần với logic render ProductNode hơn

---

## 🎯 Câu Hỏi 2: Code Nào Để Gắn GLB Vào Placement Node?

### Flow Hoàn Chỉnh

```
1. User click Card (RallyBoard hoặc device khác)
   ↓
2. Middleware xử lý action ADD_ACTIVE_CARD
   ↓
3. addElement() tìm Element từ Permission System
   ↓
4. Element.getMount().getNameNode() → "Device_Mount"
   ↓
5. setElementByNameNode(assetId, "Device_Mount")
   ↓
6. Redux Store: { "Device_Mount": "rallyboard-mount-asset-1" }
   ↓
7. ProductsNodes traverse scene → tìm placement node "Device_Mount"
   ↓
8. ProductsNodes matcher match "Device_Mount" → render ProductNode
   ↓
9. ProductNode check Redux: nodes["Device_Mount"] có giá trị?
   ↓
10. Nếu có → render Product component với assetId
   ↓
11. Product component load GLB từ assetId
   ↓
12. GLB được render tại vị trí placement node "Device_Mount"
   ↓
13. Device hiển thị thay TV! ✅
```

---

## 📝 Code Chi Tiết

### Bước 1: Tạo Placement Node (ProductsNodes.tsx)

```typescript
// src/components/Assets/ProductsNodes.tsx
const nodeMatchers: NodeMatcher[] = [
  // Matcher 1: Tạo Device_Mount placement node
  (threeNode, nodeMatchers) => {
    if (!deviceMountCreatedRef.current && threeNode.parent === null) {
      deviceMountCreatedRef.current = true;
      const existingNode = threeNode.getObjectByName(deviceMountNodeName);
      if (!existingNode) {
        createDeviceMountPlacementNode(threeNode, deviceMountNodeName);
      }
    }
    return undefined;
  },
  
  // Matcher 2: Match placement nodes và render ProductNode
  (threeNode) => {
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
```

**Chức năng:**
- Tạo placement node `"Device_Mount"` tại TV center
- Match placement node và render `ProductNode`

---

### Bước 2: ProductNode Check Redux Mapping

```typescript
// src/components/Assets/ProductNode.tsx
export const ProductNode: FC<ProductProps> = ({ nameNode, parentNode }) => {
  // Lấy mapping từ Redux store
  const attachNodeNameToAssetId = useAppSelector(getNodes);
  // attachNodeNameToAssetId = {
  //   "Device_Mount": "rallyboard-mount-asset-1",
  //   // ... other mappings ...
  // }

  // Kiểm tra xem có mapping cho nameNode không
  if (!Object.keys(attachNodeNameToAssetId).includes(nameNode)) {
    return undefined;  // Không có mapping → không render
  }

  // Render Product component với assetId
  return (
    <Product
      parentNode={parentNode}  // Placement node "Device_Mount"
      productAssetId={attachNodeNameToAssetId[nameNode]}  // "rallyboard-mount-asset-1"
      nameNode={nameNode}  // "Device_Mount"
      // ... other props
    />
  );
};
```

**Chức năng:**
- Check Redux store xem có mapping cho `nameNode` không
- Nếu có → render `Product` component với `assetId`

---

### Bước 3: Product Component Load GLB

```typescript
// src/components/Assets/Product.tsx
export const Product: React.FC<ProductProps> = ({
  parentNode,
  productAssetId,  // "rallyboard-mount-asset-1"
  nameNode,  // "Device_Mount"
}) => {
  // Load GLB asset từ assetId
  const productGltf = useLocalAsset(productAssetId);
  // hoặc
  // const productGltf = useThreekitAsset(productAssetId);

  return (
    <group
      position={parentNode.position}  // Vị trí từ placement node
      rotation={parentNode.rotation}  // Rotation từ placement node
      scale={parentNode.scale}        // Scale từ placement node
    >
      <GLTFNode
        threeNode={productGltf.scene.clone()}
        nodeMatchers={ProductsNodes()}
      />
    </group>
  );
};
```

**Chức năng:**
- Load GLB file từ `assetId` (local hoặc Threekit)
- Render GLB tại vị trí placement node (inherit position, rotation, scale)

---

## 🔍 So Sánh: Room.tsx vs ProductsNodes.tsx

### Room.tsx (Trước Đây)

```typescript
// ❌ Logic tạo placement node tách rời
useEffect(() => {
  // ... other code ...
  
  // Tạo placement node
  const deviceMountNodeName = PlacementManager.getNameNodeForDeviceMount();
  const existingNode = gltf.scene.getObjectByName(deviceMountNodeName);
  if (!existingNode) {
    createDeviceMountPlacementNode(gltf.scene, deviceMountNodeName);
  }
}, [gltf]);
```

**Nhược điểm:**
- ❌ Logic tạo placement node tách rời khỏi logic render
- ❌ Phải tạo trong `useEffect` khi scene load
- ❌ Khó maintain khi cần tạo nhiều placement nodes động

---

### ProductsNodes.tsx (Bây Giờ)

```typescript
// ✅ Logic tạo placement node trong nodeMatchers
const nodeMatchers: NodeMatcher[] = [
  (threeNode, nodeMatchers) => {
    if (!deviceMountCreatedRef.current && threeNode.parent === null) {
      deviceMountCreatedRef.current = true;
      const existingNode = threeNode.getObjectByName(deviceMountNodeName);
      if (!existingNode) {
        createDeviceMountPlacementNode(threeNode, deviceMountNodeName);
      }
    }
    return undefined;
  },
  // ... other matchers
];
```

**Ưu điểm:**
- ✅ Logic tạo placement node gần với logic render
- ✅ Tạo khi traverse scene (trong quá trình render)
- ✅ Linh hoạt hơn, có thể tạo placement node động

---

## 📊 Tóm Tắt

### 1. Tại Sao Code Tạo Device_Mount Trong ProductsNodes?

**Trả lời:**
- ✅ Logic tạo placement node gần với logic render nodes
- ✅ Tạo khi traverse scene (trong nodeMatchers)
- ✅ Linh hoạt hơn, dễ maintain

---

### 2. Code Nào Để Gắn GLB Vào Placement Node?

**Trả lời:**
- **ProductsNodes** → Tạo placement node và match để render `ProductNode`
- **ProductNode** → Check Redux mapping và render `Product` nếu có mapping
- **Product** → Load GLB từ `assetId` và render tại vị trí placement node

**Flow:**
```
ProductsNodes (tạo placement node + match)
  ↓
ProductNode (check Redux mapping)
  ↓
Product (load GLB + render)
```

---

## ✅ Kết Luận

1. **Code tạo Device_Mount** nên được viết trong **ProductsNodes.tsx** (nơi render nodes)
2. **Code gắn GLB** thông qua flow: **ProductsNodes → ProductNode → Product**
3. **Redux mapping** (`{ "Device_Mount": "asset-id" }`) là cầu nối giữa placement node và GLB asset

