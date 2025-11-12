# Placement Nodes: Mismatch và Thêm Mới

## 3 Câu Hỏi Quan Trọng

1. **Trong file GLTF đã có sẵn các placement node để gắn sản phẩm vào đúng không?**
2. **Nếu tên placement node không giống với tên trong PlacementManager thì sao?**
3. **Nếu muốn add sản phẩm vào vị trí chưa có placement node thì làm sao?**

---

## 1. Câu Hỏi 1: GLTF Đã Có Sẵn Placement Nodes?

### 1.1. Trả Lời: ĐÚNG!

**Trong file GLTF (scene 3D) đã có sẵn các placement nodes:**

```
GLTF Scene Structure:
  ├─ Room (Group)
  │   ├─ Wall (Mesh)
  │   ├─ Table (Mesh)
  │   ├─ Floor (Mesh)
  │   ├─ Mic_Placement_1 (Empty Object3D) ← Đã có sẵn
  │   ├─ Mic_Placement_2 (Empty Object3D) ← Đã có sẵn
  │   ├─ Tap_Placement_Wall_1 (Empty Object3D) ← Đã có sẵn
  │   ├─ Camera_Wall_Placement_1 (Empty Object3D) ← Đã có sẵn
  │   └─ ... (nhiều placement nodes khác)
```

**Placement nodes:**
- Được **designer tạo sẵn** trong Blender/3D software
- Là **empty Object3D** (không có geometry/material)
- Có **tên cụ thể** (ví dụ: `"Mic_Placement_1"`)
- Có **vị trí (position)** trong không gian 3D
- Có **rotation và scale** nếu cần

---

### 1.2. Quá Trình Load và Match

```typescript
// 1. Scene được load từ GLTF
const gltf = useScene({ assetId: roomAssetId });

// 2. GLTFNode traverse scene
<GLTFNode threeNode={gltf.scene} nodeMatchers={ProductsNodes()} />

// 3. ProductsNodes() tạo matchers
const allNodePlacement = PlacementManager.getAllPlacement();
// ["Mic_Placement_1", "Mic_Placement_2", ...]

// 4. Với mỗi node trong scene:
if (allNodePlacement.includes(threeNode.name)) {
  // ✅ Match! Đây là placement node
  return <ProductNode ... />;
}
```

**Kết luận:** Đúng, GLTF đã có sẵn placement nodes. Code chỉ cần **tìm và match** chúng.

---

## 2. Câu Hỏi 2: Tên Không Khớp Với PlacementManager?

### 2.1. Vấn Đề: Tên Không Khớp

**Scenario:**
- PlacementManager: `"Mic_Placement_1"`
- Scene thực tế: `"MicPlacement1"` (không có underscore)

**Code trong ProductsNodes.tsx:**
```typescript
const allNodePlacement = PlacementManager.getAllPlacement();
// ["Mic_Placement_1", "Mic_Placement_2", ...]

if (allNodePlacement.includes(threeNode.name)) {
  // threeNode.name = "MicPlacement1"
  // allNodePlacement.includes("MicPlacement1") → FALSE
  // ❌ KHÔNG MATCH!
  return undefined; // Không render ProductNode
}
```

**Kết quả:**
- ❌ Node không được match
- ❌ Không render `ProductNode`
- ❌ Sản phẩm **KHÔNG HIỂN THỊ**

---

### 2.2. Các Trường Hợp Mismatch

#### Case 1: Naming Convention Khác

**PlacementManager:**
```typescript
"Mic_Placement_1"
"Tap_Placement_Wall_1"
```

**Scene thực tế:**
```typescript
"MicPlacement1"        // Không có underscore
"TapPlacementWall1"    // Không có underscore
```

**Kết quả:** ❌ Không match → Sản phẩm không hiển thị

---

#### Case 2: Case Sensitivity

**PlacementManager:**
```typescript
"Mic_Placement_1"
```

**Scene thực tế:**
```typescript
"mic_placement_1"      // Chữ thường
"MIC_PLACEMENT_1"      // Chữ hoa
```

**Kết quả:** ❌ Không match (vì `includes()` là case-sensitive)

---

#### Case 3: Format Khác

**PlacementManager:**
```typescript
"Mic_Placement_1"
```

**Scene thực tế:**
```typescript
"Mic_Placement_01"     // Zero-padded
"Mic_Placement_001"    // Triple zero-padded
```

**Kết quả:** ❌ Không match

---

### 2.3. Cách Phát Hiện Mismatch

**Thêm code debug vào Room.tsx:**
```typescript
useEffect(() => {
  if (!gltf) return;
  
  const allPlacements = PlacementManager.getAllPlacement();
  const found: string[] = [];
  const missing: string[] = [];
  
  // Tìm nodes trong scene
  gltf.scene.traverse((node) => {
    if (node.name && allPlacements.includes(node.name)) {
      found.push(node.name);
    }
  });
  
  // Tìm missing
  allPlacements.forEach((name) => {
    if (!found.includes(name)) {
      missing.push(name);
    }
  });
  
  console.log("✅ Found placements:", found);
  console.log("❌ Missing placements:", missing);
  
  // Tìm nodes có tên tương tự (có thể là mismatch)
  console.log("🔍 Nodes with similar names:");
  gltf.scene.traverse((node) => {
    if (node.name) {
      const lower = node.name.toLowerCase();
      if (lower.includes('mic') || lower.includes('placement')) {
        console.log(`  - ${node.name} (expected: Mic_Placement_X)`);
      }
    }
  });
}, [gltf]);
```

---

### 2.4. Giải Pháp Khi Mismatch

#### Option 1: Sửa Scene (Khuyến Nghị)

**Yêu cầu designer sửa tên nodes trong scene:**
- `"MicPlacement1"` → `"Mic_Placement_1"`
- Đảm bảo tên khớp với PlacementManager

**Ưu điểm:**
- ✅ Code không cần sửa
- ✅ Consistent với naming convention
- ✅ Dễ maintain

---

#### Option 2: Sửa PlacementManager

**Sửa PlacementManager để match với scene:**
```typescript
public static getNameNodeForMic(id?: number): string {
  if (!id) return `MicPlacement`;  // Không có underscore
  return `MicPlacement${id}`;      // Không có underscore
}
```

**Nhược điểm:**
- ❌ Phải sửa nhiều methods
- ❌ Có thể ảnh hưởng code khác
- ❌ Không consistent

---

#### Option 3: Tạo Mapping Function

**Tạo function map tên:**
```typescript
// Tạo file: src/utils/placementNodeMapper.ts
export const mapPlacementNodeName = (sceneNodeName: string): string | null => {
  const mapping: Record<string, string> = {
    "MicPlacement1": "Mic_Placement_1",
    "MicPlacement2": "Mic_Placement_2",
    "TapPlacementWall1": "Tap_Placement_Wall_1",
    // ... mapping khác
  };
  
  return mapping[sceneNodeName] || null;
};

// Sử dụng trong ProductsNodes.tsx
export const ProductsNodes = () => {
  const allNodePlacement = PlacementManager.getAllPlacement();
  
  const nodeMatchers: NodeMatcher[] = [
    (threeNode) => {
      // Thử match trực tiếp
      if (allNodePlacement.includes(threeNode.name)) {
        return <ProductNode ... />;
      }
      
      // Thử map tên
      const mappedName = mapPlacementNodeName(threeNode.name);
      if (mappedName && allNodePlacement.includes(mappedName)) {
        return <ProductNode nameNode={mappedName} ... />;
      }
      
      return undefined;
    },
  ];
  
  return nodeMatchers;
};
```

**Ưu điểm:**
- ✅ Không cần sửa scene
- ✅ Không cần sửa PlacementManager
- ✅ Flexible

**Nhược điểm:**
- ❌ Phải maintain mapping
- ❌ Phức tạp hơn

---

#### Option 4: Fuzzy Matching

**Tạo function fuzzy match:**
```typescript
const fuzzyMatchPlacement = (
  sceneNodeName: string,
  allPlacements: string[]
): string | null => {
  const lowerSceneName = sceneNodeName.toLowerCase().replace(/[_\s]/g, '');
  
  for (const placement of allPlacements) {
    const lowerPlacement = placement.toLowerCase().replace(/[_\s]/g, '');
    if (lowerSceneName === lowerPlacement) {
      return placement;
    }
  }
  
  return null;
};

// Sử dụng
const matchedName = fuzzyMatchPlacement(threeNode.name, allNodePlacement);
if (matchedName) {
  return <ProductNode nameNode={matchedName} ... />;
}
```

---

## 3. Câu Hỏi 3: Add Sản Phẩm Vào Vị Trí Chưa Có Placement Node?

### 3.1. Vấn Đề: Không Có Placement Node

**Scenario:**
- Muốn add microphone vào vị trí mới
- Nhưng scene không có placement node ở vị trí đó

**Hệ thống hiện tại:**
```typescript
// Code tìm placement node
if (allNodePlacement.includes(threeNode.name)) {
  // Chỉ render nếu có placement node
  return <ProductNode ... />;
}
```

**Nếu không có placement node:**
- ❌ Không có node để match
- ❌ Không render ProductNode
- ❌ **KHÔNG THỂ** add sản phẩm vào vị trí đó

---

### 3.2. Limitation Của Hệ Thống Hiện Tại

**Hệ thống hiện tại yêu cầu:**
1. ✅ Placement node **PHẢI CÓ SẴN** trong scene
2. ✅ Tên node **PHẢI KHỚP** với PlacementManager
3. ❌ **KHÔNG THỂ** tạo placement node động
4. ❌ **KHÔNG THỂ** add sản phẩm vào vị trí không có node

**Lý do:**
- Vị trí sản phẩm được xác định bởi **position của placement node**
- Nếu không có node → không có vị trí → không thể đặt sản phẩm

---

### 3.3. Giải Pháp: Thêm Placement Node Vào Scene

**Cách duy nhất: Yêu cầu designer thêm placement node vào scene 3D**

**Quy trình:**
1. Xác định vị trí muốn đặt sản phẩm (X, Y, Z)
2. Yêu cầu designer thêm empty Object3D tại vị trí đó
3. Đặt tên node theo PlacementManager convention
4. Export scene mới
5. Code sẽ tự động detect và sử dụng node mới

**Ví dụ:**
```
Designer thêm node mới:
- Tên: "Mic_Placement_8" (theo PlacementManager)
- Vị trí: (5, 2, 3)
- Rotation: (0, 0, 0)
- Scale: (1, 1, 1)
```

**Sau khi export:**
- Code tự động detect `"Mic_Placement_8"`
- Có thể add microphone vào vị trí đó

---

### 3.4. Giải Pháp Tạm Thời: Tạo Placement Node Động (Không Khuyến Nghị)

**Có thể tạo placement node động, nhưng phức tạp:**

```typescript
// ⚠️ KHÔNG KHUYẾN NGHỊ - Chỉ dùng tạm thời
useEffect(() => {
  if (!gltf) return;
  
  // Tạo placement node động
  const dynamicPlacement = new THREE.Object3D();
  dynamicPlacement.name = "Mic_Placement_8";
  dynamicPlacement.position.set(5, 2, 3);
  
  // Thêm vào scene
  gltf.scene.add(dynamicPlacement);
  
  // Cập nhật PlacementManager
  // (Cần modify PlacementManager để support dynamic nodes)
}, [gltf]);
```

**Vấn đề:**
- ❌ Phức tạp, dễ lỗi
- ❌ Không persistent (mất khi reload)
- ❌ Không sync với scene 3D gốc
- ❌ Khó maintain

**Khuyến nghị:** Luôn thêm placement node vào scene 3D gốc.

---

### 3.5. Workaround: Sử Dụng Placement Node Có Sẵn

**Nếu không thể thêm node mới ngay:**
- Sử dụng placement node có sẵn gần nhất
- Hoặc tạm thời không support vị trí đó
- Chờ designer thêm node vào scene

---

## 4. Tóm Tắt

### 4.1. Câu Hỏi 1: GLTF Đã Có Sẵn Placement Nodes?

**Trả lời:** ✅ **ĐÚNG!**
- Placement nodes được designer tạo sẵn trong scene 3D
- Code chỉ cần tìm và match chúng
- Nodes có tên, position, rotation, scale

---

### 4.2. Câu Hỏi 2: Tên Không Khớp?

**Trả lời:** ❌ **SẢN PHẨM KHÔNG HIỂN THỊ**

**Nguyên nhân:**
- Code check: `allNodePlacement.includes(threeNode.name)`
- Nếu tên không khớp → không match → không render

**Giải pháp:**
1. ✅ **Sửa scene** để match PlacementManager (khuyến nghị)
2. Sửa PlacementManager để match scene
3. Tạo mapping function
4. Fuzzy matching

---

### 4.3. Câu Hỏi 3: Add Vào Vị Trí Chưa Có Node?

**Trả lời:** ❌ **KHÔNG THỂ** (với hệ thống hiện tại)

**Lý do:**
- Hệ thống yêu cầu placement node phải có sẵn trong scene
- Vị trí được xác định bởi node position
- Không có node → không có vị trí → không thể đặt

**Giải pháp:**
1. ✅ **Yêu cầu designer thêm node vào scene** (khuyến nghị)
2. Tạo node động (không khuyến nghị, phức tạp)
3. Sử dụng node có sẵn gần nhất (tạm thời)

---

## 5. Best Practices

### 5.1. Đảm Bảo Naming Consistency

**Checklist:**
- ✅ Scene nodes phải match PlacementManager
- ✅ Sử dụng code debug để check mismatch
- ✅ Document naming convention cho designer

---

### 5.2. Quy Trình Thêm Placement Node Mới

1. **Xác định vị trí** muốn đặt sản phẩm
2. **Yêu cầu designer** thêm empty Object3D
3. **Đặt tên** theo PlacementManager convention
4. **Export scene** mới
5. **Test** xem code có detect được không

---

### 5.3. Code Debug Template

```typescript
// Thêm vào Room.tsx để check placements
useEffect(() => {
  if (!gltf) return;
  
  const allPlacements = PlacementManager.getAllPlacement();
  const found: string[] = [];
  const missing: string[] = [];
  
  gltf.scene.traverse((node) => {
    if (node.name && allPlacements.includes(node.name)) {
      found.push(node.name);
    }
  });
  
  allPlacements.forEach((name) => {
    if (!found.includes(name)) {
      missing.push(name);
    }
  });
  
  console.log(`✅ Found: ${found.length}/${allPlacements.length}`);
  console.log("❌ Missing:", missing);
  
  if (missing.length > 0) {
    console.warn("⚠️ Some placement nodes are missing in scene!");
  }
}, [gltf]);
```

---

## Kết Luận

1. **GLTF có sẵn placement nodes** - Đúng
2. **Tên không khớp** - Sản phẩm không hiển thị, cần sửa scene hoặc tạo mapping
3. **Add vào vị trí chưa có node** - Không thể, cần designer thêm node vào scene

**Quy tắc vàng:**
- ✅ Placement nodes **PHẢI CÓ SẴN** trong scene
- ✅ Tên nodes **PHẢI KHỚP** với PlacementManager
- ✅ Nếu cần vị trí mới → **THÊM NODE VÀO SCENE**

