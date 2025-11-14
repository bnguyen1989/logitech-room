# Code Render GLB Tại Vị Trí Placement Node - Giải Thích Chi Tiết

## 📋 Tổng Quan

Tài liệu này giải thích **code nào** làm được việc "GLB được render tại vị trí placement node Device_Mount".

---

## 🎯 Code Quan Trọng Nhất

### Product.tsx - Dòng 67-73

```typescript
// src/components/Assets/Product.tsx
return (
  <group
    key={parentNode.uuid + `-group`}
    name={generateName(nameNode, parentNode)}
    position={parentNode.position}  // ⭐ CODE NÀY: Render tại vị trí placement node
    scale={parentNode.scale}         // ⭐ CODE NÀY: Scale theo placement node
    rotation={parentNode.rotation}  // ⭐ CODE NÀY: Rotation theo placement node
  >
    <GLTFNode
      threeNode={productGltf.scene.clone()}
      nodeMatchers={ProductsNodes()}
    />
  </group>
);
```

**Đây là code chính làm GLB render tại vị trí placement node!**

---

## 🔍 Flow Chi Tiết

### Bước 1: ProductsNodes Match Placement Node

**File:** `src/components/Assets/ProductsNodes.tsx`

```typescript
// Matcher 3: Match placement nodes và render ProductNode
(threeNode) => {
  if (allNodePlacement.includes(threeNode.name)) {
    // threeNode.name = "Device_Mount" (placement node)
    return (
      <Suspense>
        <ProductNode 
          parentNode={threeNode}  // ⭐ Pass placement node vào ProductNode
          nameNode={threeNode.name}  // "Device_Mount"
        />
      </Suspense>
    );
  }
  return undefined;
}
```

**Chức năng:**
- Tìm placement node `"Device_Mount"` trong scene
- Render `ProductNode` với `parentNode = placement node`

---

### Bước 2: ProductNode Pass Placement Node Vào Product

**File:** `src/components/Assets/ProductNode.tsx`

```typescript
export const ProductNode: FC<ProductProps> = ({ nameNode, parentNode }) => {
  // Lấy mapping từ Redux
  const attachNodeNameToAssetId = useAppSelector(getNodes);
  // attachNodeNameToAssetId = { "Device_Mount": "rallyboard-mount-asset-1" }

  // Check có mapping không
  if (!Object.keys(attachNodeNameToAssetId).includes(nameNode)) {
    return undefined;
  }

  // ⭐ Pass parentNode (placement node) vào Product
  return (
    <Product
      parentNode={parentNode}  // ⭐ Placement node "Device_Mount" (THREE.Object3D)
      productAssetId={attachNodeNameToAssetId[nameNode]}  // "rallyboard-mount-asset-1"
      nameNode={nameNode}  // "Device_Mount"
      // ... other props
    />
  );
};
```

**Chức năng:**
- Check Redux mapping
- Pass `parentNode` (placement node) vào `Product` component

---

### Bước 3: Product Component Render GLB Tại Vị Trí Placement Node

**File:** `src/components/Assets/Product.tsx`

```typescript
export const Product: React.FC<ProductProps> = ({
  parentNode,  // ⭐ Placement node "Device_Mount" (THREE.Object3D)
  productAssetId,  // "rallyboard-mount-asset-1"
  nameNode,  // "Device_Mount"
}) => {
  // Load GLB asset
  const productGltf = useAsset({ assetId: productAssetId, configuration });

  // ⭐ CODE QUAN TRỌNG: Render GLB tại vị trí placement node
  return (
    <group
      position={parentNode.position}  // ⭐ Vị trí từ placement node
      scale={parentNode.scale}        // ⭐ Scale từ placement node
      rotation={parentNode.rotation}  // ⭐ Rotation từ placement node
    >
      <GLTFNode
        threeNode={productGltf.scene.clone()}  // GLB scene
        nodeMatchers={ProductsNodes()}
      />
    </group>
  );
};
```

**Đây là code chính!**

**Giải thích:**
- `<group>` là React Three Fiber component
- `position={parentNode.position}` → GLB được render tại vị trí placement node
- `rotation={parentNode.rotation}` → GLB được xoay theo placement node
- `scale={parentNode.scale}` → GLB được scale theo placement node
- `<GLTFNode>` render GLB scene bên trong `<group>`

---

## 📊 Sơ Đồ Flow

```
1. ProductsNodes.tsx
   ↓ Match placement node "Device_Mount"
   ↓
2. ProductNode.tsx
   ↓ Pass parentNode (placement node) vào Product
   ↓
3. Product.tsx
   ↓
   <group position={parentNode.position}>  ⭐ CODE NÀY
     <GLTFNode threeNode={productGltf.scene} />
   </group>
   ↓
4. GLB được render tại vị trí placement node! ✅
```

---

## 🔑 Điểm Quan Trọng

### 1. `parentNode` Là Placement Node

```typescript
// parentNode = placement node "Device_Mount" (THREE.Object3D)
// parentNode.position = { x: 1.5, y: 2.0, z: 0.1 }  (vị trí TV center)
// parentNode.rotation = { x: 0, y: 0, z: 0 }
// parentNode.scale = { x: 1, y: 1, z: 1 }
```

### 2. React Three Fiber `<group>` Component

```typescript
<group
  position={parentNode.position}  // React Three Fiber sẽ apply position này
  rotation={parentNode.rotation}  // React Three Fiber sẽ apply rotation này
  scale={parentNode.scale}        // React Three Fiber sẽ apply scale này
>
```

**React Three Fiber tự động:**
- Tạo `THREE.Group` object
- Set `position`, `rotation`, `scale` từ props
- Render children (GLB) bên trong group

### 3. GLB Scene Được Render Bên Trong Group

```typescript
<group position={parentNode.position}>
  <GLTFNode threeNode={productGltf.scene.clone()} />
</group>
```

**Kết quả:**
- GLB scene được render tại vị trí `parentNode.position`
- GLB scene được xoay theo `parentNode.rotation`
- GLB scene được scale theo `parentNode.scale`

---

## 💡 Ví Dụ Cụ Thể

### Placement Node "Device_Mount"

```typescript
// Placement node được tạo tại TV center
const placementNode = new THREE.Object3D();
placementNode.name = "Device_Mount";
placementNode.position.set(1.5, 2.0, 0.1);  // TV center position
placementNode.rotation.set(0, 0, 0);
placementNode.scale.set(1, 1, 1);
```

### Product Component Render

```typescript
// Product.tsx
<group
  position={placementNode.position}  // { x: 1.5, y: 2.0, z: 0.1 }
  rotation={placementNode.rotation}  // { x: 0, y: 0, z: 0 }
  scale={placementNode.scale}        // { x: 1, y: 1, z: 1 }
>
  <GLTFNode threeNode={rallyBoardGltf.scene.clone()} />
</group>
```

**Kết quả:**
- RallyBoard GLB được render tại vị trí `(1.5, 2.0, 0.1)` (TV center)
- RallyBoard GLB được xoay theo placement node rotation
- RallyBoard GLB được scale theo placement node scale

---

## ✅ Tóm Tắt

### Code Nào Làm GLB Render Tại Vị Trí Placement Node?

**Trả lời:** Code trong `Product.tsx` dòng 70-72:

```typescript
<group
  position={parentNode.position}  // ⭐ CODE NÀY
  scale={parentNode.scale}
  rotation={parentNode.rotation}
>
  <GLTFNode threeNode={productGltf.scene.clone()} />
</group>
```

**Giải thích:**
- `parentNode` là placement node `"Device_Mount"` (THREE.Object3D)
- `parentNode.position` là vị trí placement node (TV center)
- React Three Fiber `<group>` component apply position này
- GLB scene được render bên trong group → GLB hiển thị tại vị trí placement node

---

## 🎯 Flow Hoàn Chỉnh

```
1. ProductsNodes.tsx
   → Match placement node "Device_Mount"
   → Render ProductNode với parentNode = placement node

2. ProductNode.tsx
   → Check Redux mapping
   → Pass parentNode vào Product component

3. Product.tsx
   → Load GLB từ assetId
   → Render <group> với position={parentNode.position}  ⭐
   → Render GLB bên trong group
   → GLB hiển thị tại vị trí placement node! ✅
```

