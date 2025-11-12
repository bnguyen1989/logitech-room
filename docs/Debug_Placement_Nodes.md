# Debug và Tìm Placement Nodes Trong Scene

## Câu Hỏi

**Q: "Mic_Placement_1" là tên của cái chỗ mà sẽ gắn mic vào đúng không? Nhưng khi tôi console.log room mesh, không thấy có cái tên nào giống vậy?**

**A: Đúng!** `Mic_Placement_1` là tên của placement node (vị trí gắn mic). Nhưng có nhiều lý do tại sao bạn không thấy khi console.log:

---

## 1. Lý Do Không Thấy Placement Nodes

### 1.1. Placement Nodes KHÔNG phải Mesh

**Vấn đề:** Bạn đang log `mesh`, nhưng placement nodes là **Object3D** (empty), không phải Mesh!

```typescript
// ❌ SAI: Chỉ log meshes
gltf.scene.traverse((node) => {
  if (node instanceof THREE.Mesh) {
    console.log(node.name); // Chỉ thấy Mesh, không thấy placement nodes
  }
});
```

**Placement nodes:**
- Là **empty Object3D** (không có geometry/material)
- **KHÔNG phải Mesh**
- Chỉ có `name`, `position`, `rotation`, `scale`

---

### 1.2. Placement Nodes Bị Replace Bởi ProductNode

**Vấn đề:** Khi render, placement nodes bị **replace** bởi `ProductNode` component!

```typescript
// Trong GLTFNode.tsx
if (nodeMatchers) {
  for (let i = 0; i < nodeMatchers.length; i++) {
    const jsx = nodeMatchers[i](threeNode, nodeMatchers);
    if (jsx) {
      return jsx; // ⭐ Replace node gốc bằng ProductNode
    }
  }
}
```

**Flow:**
1. Scene load với node `Mic_Placement_1`
2. GLTFNode traverse và tìm thấy node này
3. Node matcher match → return `ProductNode`
4. Node gốc **bị replace** → không còn trong scene tree nữa

---

### 1.3. Placement Nodes Có Thể Nằm Sâu Trong Hierarchy

**Vấn đề:** Placement nodes có thể nằm trong groups/containers, không phải root level

```
Scene
  └─ Room_Group
      └─ Furniture_Group
          └─ Mic_Placement_1  ← Nằm sâu trong hierarchy
```

---

### 1.4. Tên Node Có Thể Khác Trong Scene Thực Tế

**Vấn đề:** Scene 3D có thể dùng naming khác với PlacementManager!

- PlacementManager: `"Mic_Placement_1"`
- Scene thực tế: `"MicPlacement1"` hoặc `"mic_placement_01"`

---

## 2. Cách Debug Đúng - Tìm Placement Nodes

### 2.1. Sử Dụng logNode Function (Đã Có Sẵn)

**File:** `src/components/Assets/Room.tsx`

```typescript
export const logNode = (node: THREE.Object3D, depth = 0) => {
  const prefix = " ".repeat(depth);
  console.log(`${prefix}${node.name}[${node.constructor.name}]`);
  node.children.forEach((child) => logNode(child, depth + 1));
};
```

**Cách sử dụng trong Room.tsx:**

```typescript
useEffect(() => {
  if (!gltf) return;
  
  // ⭐ Log toàn bộ scene để tìm placement nodes
  console.log("=== SCENE HIERARCHY ===");
  logNode(gltf.scene);
  
  // Hoặc log tất cả nodes (không chỉ Mesh)
  console.log("=== ALL NODES ===");
  gltf.scene.traverse((node) => {
    console.log(`Node: ${node.name}, Type: ${node.constructor.name}`);
  });
}, [gltf]);
```

---

### 2.2. Tìm Placement Nodes Cụ Thể

**Thêm vào Room.tsx:**

```typescript
useEffect(() => {
  if (!gltf) return;
  
  // Tìm tất cả placement nodes
  const allPlacements = PlacementManager.getAllPlacement();
  console.log("Expected placements:", allPlacements);
  
  const foundPlacements: string[] = [];
  const missingPlacements: string[] = [];
  
  gltf.scene.traverse((node) => {
    if (node.name && allPlacements.includes(node.name)) {
      foundPlacements.push(node.name);
      console.log(`✅ Found placement: ${node.name}`, node);
    }
  });
  
  allPlacements.forEach((name) => {
    if (!foundPlacements.includes(name)) {
      missingPlacements.push(name);
    }
  });
  
  console.log("✅ Found placements:", foundPlacements);
  console.log("❌ Missing placements:", missingPlacements);
  
  // Tìm nodes có tên gần giống
  console.log("=== NODES WITH 'Mic' OR 'Placement' ===");
  gltf.scene.traverse((node) => {
    if (node.name && (
      node.name.toLowerCase().includes('mic') ||
      node.name.toLowerCase().includes('placement')
    )) {
      console.log(`Similar: ${node.name}`, node);
    }
  });
}, [gltf]);
```

---

### 2.3. Log Trước Khi Replace (Trong GLTFNode)

**Sửa GLTFNode.tsx để log trước khi replace:**

```typescript
export const GLTFNode = ({
  nodeMatchers,
  threeNode,
  props,
}: ThreeNodeRendererProps): ReactNode => {
  if (nodeMatchers) {
    for (let i = 0; i < nodeMatchers.length; i++) {
      const jsx = nodeMatchers[i](threeNode, nodeMatchers);
      if (jsx) {
        // ⭐ Log trước khi replace
        console.log(`🔄 Replacing placement node: ${threeNode.name}`, threeNode);
        return jsx;
      }
    }
  }
  // ...
};
```

---

### 2.4. Log Trong ProductsNodes Matcher

**Sửa ProductsNodes.tsx:**

```typescript
export const ProductsNodes = () => {
  const allNodePlacement = PlacementManager.getAllPlacement();
  
  const nodeMatchers: NodeMatcher[] = [
    (threeNode) => {
      // ⭐ Log để debug
      if (threeNode.name && allNodePlacement.includes(threeNode.name)) {
        console.log(`✅ Matched placement node: ${threeNode.name}`, {
          node: threeNode,
          position: threeNode.position,
          type: threeNode.constructor.name
        });
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

---

## 3. Code Debug Hoàn Chỉnh

### 3.1. Thêm Vào Room.tsx

```typescript
useEffect(() => {
  if (!gltf) return;
  
  console.log("=== DEBUG PLACEMENT NODES ===");
  
  // 1. Log toàn bộ scene hierarchy
  console.log("1. Full scene hierarchy:");
  logNode(gltf.scene);
  
  // 2. Log tất cả nodes (không chỉ Mesh)
  console.log("2. All nodes in scene:");
  const allNodes: Array<{name: string, type: string, position: THREE.Vector3}> = [];
  gltf.scene.traverse((node) => {
    allNodes.push({
      name: node.name || '(unnamed)',
      type: node.constructor.name,
      position: node.position.clone()
    });
  });
  console.table(allNodes);
  
  // 3. Tìm placement nodes
  const allPlacements = PlacementManager.getAllPlacement();
  console.log("3. Expected placements:", allPlacements);
  
  const found: string[] = [];
  const missing: string[] = [];
  
  gltf.scene.traverse((node) => {
    if (node.name && allPlacements.includes(node.name)) {
      found.push(node.name);
      console.log(`✅ Found: ${node.name}`, {
        position: node.position,
        rotation: node.rotation,
        scale: node.scale,
        type: node.constructor.name,
        children: node.children.length
      });
    }
  });
  
  allPlacements.forEach((name) => {
    if (!found.includes(name)) {
      missing.push(name);
    }
  });
  
  console.log(`4. Found ${found.length}/${allPlacements.length} placements`);
  console.log("Missing:", missing);
  
  // 5. Tìm nodes có tên tương tự
  console.log("5. Nodes with similar names:");
  gltf.scene.traverse((node) => {
    if (node.name) {
      const lowerName = node.name.toLowerCase();
      if (lowerName.includes('mic') || 
          lowerName.includes('placement') ||
          lowerName.includes('camera') ||
          lowerName.includes('tap')) {
        console.log(`  - ${node.name} (${node.constructor.name})`);
      }
    }
  });
  
}, [gltf]);
```

---

## 4. Các Trường Hợp Có Thể Xảy Ra

### 4.1. Scene Không Có Placement Nodes

**Triệu chứng:**
- Console log không thấy bất kỳ placement node nào
- `found.length = 0`

**Nguyên nhân:**
- Scene 3D chưa được export với placement nodes
- Designer chưa tạo placement nodes trong Blender/3D software

**Giải pháp:**
- Yêu cầu designer thêm placement nodes vào scene
- Đảm bảo tên nodes khớp với PlacementManager

---

### 4.2. Tên Nodes Khác Với PlacementManager

**Triệu chứng:**
- Console log thấy nodes nhưng tên khác
- Ví dụ: `"MicPlacement1"` thay vì `"Mic_Placement_1"`

**Nguyên nhân:**
- Naming convention trong scene khác với code
- Designer dùng naming khác

**Giải pháp:**
- Option 1: Sửa scene để match với PlacementManager
- Option 2: Sửa PlacementManager để match với scene
- Option 3: Tạo mapping function

---

### 4.3. Placement Nodes Bị Replace Ngay Lập Tức

**Triệu chứng:**
- Log thấy nodes nhưng sau đó biến mất
- Nodes bị replace bởi ProductNode

**Giải thích:**
- Đây là **behavior bình thường**
- Placement nodes được replace để render products
- Node gốc vẫn tồn tại trong `parentNode` của ProductNode

**Cách kiểm tra:**
```typescript
// Trong ProductNode.tsx
console.log("ProductNode for:", nameNode, "Parent:", parentNode);
// parentNode chính là placement node gốc
```

---

### 4.4. Placement Nodes Nằm Trong Groups

**Triệu chứng:**
- Log thấy nodes nhưng không ở root level
- Nodes nằm trong groups/containers

**Giải pháp:**
- Sử dụng `traverse()` để tìm tất cả nodes (đã làm ở trên)
- `traverse()` tự động duyệt qua toàn bộ hierarchy

---

## 5. Kiểm Tra Trong Browser DevTools

### 5.1. React DevTools

1. Mở React DevTools
2. Tìm component `Room`
3. Inspect `gltf.scene`
4. Xem scene hierarchy

### 5.2. Three.js Inspector

1. Thêm vào code:
```typescript
// @ts-ignore
window.scene = gltf.scene;
```

2. Trong console:
```javascript
// Traverse và tìm nodes
window.scene.traverse((node) => {
  if (node.name && node.name.includes('Mic')) {
    console.log(node.name, node);
  }
});
```

---

## 6. Ví Dụ Code Debug Thực Tế

### 6.1. Thêm Vào Room.tsx (Temporary)

```typescript
useEffect(() => {
  if (!gltf) return;
  
  // ⭐ DEBUG: Tìm placement nodes
  const debugPlacements = () => {
    const allPlacements = PlacementManager.getAllPlacement();
    const micPlacements = allPlacements.filter(p => p.includes('Mic'));
    
    console.group("🔍 DEBUG: Mic Placements");
    console.log("Expected Mic placements:", micPlacements);
    
    const found: any[] = [];
    gltf.scene.traverse((node) => {
      if (node.name && micPlacements.includes(node.name)) {
        found.push({
          name: node.name,
          position: node.position.toArray(),
          type: node.constructor.name
        });
      }
    });
    
    console.log("Found in scene:", found);
    console.log("Missing:", micPlacements.filter(p => !found.find(f => f.name === p)));
    console.groupEnd();
  };
  
  debugPlacements();
  
  // Rest of your code...
}, [gltf]);
```

---

## 7. Tóm Tắt

### Tại Sao Không Thấy Placement Nodes?

1. **Đang log Mesh thay vì Object3D**
   - Placement nodes là Object3D, không phải Mesh
   - Cần log tất cả nodes, không chỉ Mesh

2. **Nodes Bị Replace**
   - Placement nodes bị replace bởi ProductNode khi render
   - Node gốc vẫn tồn tại trong `parentNode`

3. **Tên Khác**
   - Scene có thể dùng naming khác với PlacementManager
   - Cần check tên thực tế trong scene

4. **Nằm Sâu Trong Hierarchy**
   - Nodes có thể nằm trong groups
   - Cần dùng `traverse()` để tìm

### Cách Debug Đúng

1. **Sử dụng `logNode()`** để log toàn bộ hierarchy
2. **Sử dụng `traverse()`** để tìm tất cả nodes
3. **So sánh** với `PlacementManager.getAllPlacement()`
4. **Log trong matchers** để xem khi nào nodes được match

### Code Mẫu

```typescript
// Log tất cả nodes
gltf.scene.traverse((node) => {
  console.log(node.name, node.constructor.name);
});

// Tìm placement nodes
const allPlacements = PlacementManager.getAllPlacement();
gltf.scene.traverse((node) => {
  if (node.name && allPlacements.includes(node.name)) {
    console.log("Found placement:", node.name, node);
  }
});
```

---

## Kết Luận

**"Mic_Placement_1" là tên của placement node** - đúng!

**Không thấy khi console.log** vì:
- Đang log Mesh thay vì Object3D
- Nodes bị replace khi render
- Tên có thể khác trong scene thực tế

**Cách tìm:**
- Sử dụng code debug ở trên
- Log tất cả nodes với `traverse()`
- So sánh với `PlacementManager.getAllPlacement()`

