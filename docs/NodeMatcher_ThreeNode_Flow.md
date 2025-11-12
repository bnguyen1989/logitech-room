# Giải Thích: threeNode Được Pass Vào Matcher Function Như Thế Nào?

## Câu Hỏi

Bạn thấy:
```typescript
// Room.tsx
<GLTFNode threeNode={gltf.scene} nodeMatchers={ProductsNodes()} />

// ProductsNodes.tsx
const nodeMatchers: NodeMatcher[] = [
  (threeNode) => {  // ← threeNode ở đây từ đâu?
    if (allNodePlacement.includes(threeNode.name)) {
      return <ProductNode parentNode={threeNode} nameNode={threeNode.name} />;
    }
    return undefined;
  },
];
```

**Câu hỏi:** `threeNode` trong matcher function từ đâu? Không thấy pass vào `ProductsNodes()`?

---

## Giải Thích

### Quan Trọng: `threeNode` KHÔNG Được Pass Vào `ProductsNodes()`

**`ProductsNodes()` chỉ tạo matcher functions, không nhận `threeNode`:**

```typescript
// ProductsNodes.tsx
export const ProductsNodes = () => {
  // ❌ KHÔNG nhận threeNode làm parameter
  // ✅ Chỉ tạo và return matcher functions
  
  const nodeMatchers: NodeMatcher[] = [
    (threeNode) => {  // ← Đây là FUNCTION DEFINITION, chưa được gọi
      // threeNode sẽ được pass vào KHI FUNCTION ĐƯỢC GỌI
      // (không phải bây giờ)
    },
  ];
  
  return nodeMatchers;  // Return array các functions
};
```

**Giải thích:**
- `(threeNode) => { ... }` là **function definition** (chưa được gọi)
- `threeNode` là **parameter** của function này
- `threeNode` sẽ có giá trị **khi function được gọi** (không phải bây giờ)

---

## Flow: threeNode Được Pass Vào Khi Nào?

### Step 1: ProductsNodes() Tạo Matchers

```typescript
// Room.tsx
<GLTFNode threeNode={gltf.scene} nodeMatchers={ProductsNodes()} />
```

**ProductsNodes() được gọi:**
```typescript
ProductsNodes()
  ↓
// Tạo matcher function (chưa gọi)
const nodeMatchers = [
  (threeNode) => {  // ← Function definition, threeNode chưa có giá trị
    // ...
  }
];
  ↓
// Return array
return nodeMatchers;
```

**Kết quả:**
```typescript
nodeMatchers = [
  (threeNode) => { ... }  // Function object, chưa được gọi
]
```

**Lưu ý:** `threeNode` trong function definition chưa có giá trị, chỉ là parameter name.

---

### Step 2: GLTFNode Nhận Props

```typescript
// GLTFNode.tsx
export const GLTFNode = ({
  nodeMatchers,  // = [function1, function2, ...]
  threeNode,     // = gltf.scene (từ Room.tsx)
  props,
}) => {
  // ...
};
```

**Props:**
- `nodeMatchers` = `[function1, function2, ...]` (array các functions)
- `threeNode` = `gltf.scene` (Three.js Object3D)

---

### Step 3: GLTFNode Gọi Matcher Function Với threeNode

```typescript
// GLTFNode.tsx (dòng 43-49)
if (nodeMatchers) {
  for (let i = 0; i < nodeMatchers.length; i++) {
    const jsx = nodeMatchers[i](threeNode, nodeMatchers);
    //              ↑              ↑
    //              |              └─ Pass threeNode vào đây!
    //              └─ Gọi function trong array
    if (jsx) {
      return jsx;
    }
  }
}
```

**Giải thích từng dòng:**

1. **`nodeMatchers[i]`**
   - Lấy function thứ `i` từ array
   - Ví dụ: `nodeMatchers[0]` = `(threeNode) => { ... }`

2. **`nodeMatchers[i](threeNode, nodeMatchers)`**
   - **Gọi function** với arguments:
     - `threeNode`: Node hiện tại (từ props)
     - `nodeMatchers`: Array matchers (để pass xuống recursive calls)
   - **Đây là nơi `threeNode` được pass vào!**

3. **`const jsx = ...`**
   - Lưu kết quả (ReactElement hoặc undefined)

**Ví dụ cụ thể:**
```typescript
// nodeMatchers[0] = (threeNode) => { ... }
// threeNode = gltf.scene

nodeMatchers[0](gltf.scene, nodeMatchers)
  ↓
// Gọi function với threeNode = gltf.scene
(threeNode) => {
  // threeNode bây giờ = gltf.scene ✅
  if (allNodePlacement.includes(threeNode.name)) {
    return <ProductNode parentNode={threeNode} nameNode={threeNode.name} />;
  }
  return undefined;
}
```

---

## Flow Diagram Hoàn Chỉnh

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Room.tsx                                        │
│ <GLTFNode threeNode={gltf.scene} nodeMatchers={ProductsNodes()} /> │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Step 2: ProductsNodes() được gọi                        │
│ ProductsNodes()                                         │
│   → Tạo matcher function (chưa gọi)                     │
│   → return [function1, function2, ...]                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Step 3: GLTFNode nhận props                             │
│ nodeMatchers = [function1, function2, ...]              │
│ threeNode = gltf.scene                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Step 4: GLTFNode gọi matcher function                   │
│ for (let i = 0; i < nodeMatchers.length; i++) {        │
│   const jsx = nodeMatchers[i](threeNode, nodeMatchers); │
│   //              ↑              ↑                      │
│   //              |              └─ Pass threeNode vào! │
│   //              └─ Gọi function                        │
│ }                                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Step 5: Matcher function được gọi với threeNode         │
│ (threeNode) => {                                        │
│   // threeNode bây giờ = gltf.scene ✅                   │
│   if (allNodePlacement.includes(threeNode.name)) {      │
│     return <ProductNode ... />;                         │
│   }                                                     │
│   return undefined;                                     │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Ví Dụ Cụ Thể

### Scenario: Scene Có Node "Camera_TV_Placement_1_display_1"

```typescript
// Step 1: Room.tsx
<GLTFNode 
  threeNode={gltf.scene}  // ← Pass gltf.scene vào GLTFNode
  nodeMatchers={ProductsNodes()}  // ← Gọi ProductsNodes()
/>

// Step 2: ProductsNodes() tạo matcher
const matchers = ProductsNodes();
// matchers = [
//   (threeNode) => {  // ← Function definition, threeNode chưa có giá trị
//     if (allNodePlacement.includes(threeNode.name)) {
//       return <ProductNode ... />;
//     }
//     return undefined;
//   }
// ]

// Step 3: GLTFNode nhận props
GLTFNode({
  nodeMatchers: matchers,  // = [function1, ...]
  threeNode: gltf.scene,   // = gltf.scene
})

// Step 4: GLTFNode traverse scene
// Tìm thấy node: "Camera_TV_Placement_1_display_1"

// Step 5: GLTFNode gọi matcher với threeNode
for (let i = 0; i < matchers.length; i++) {
  const jsx = matchers[i](cameraNode, matchers);
  //              ↑         ↑
  //              |         └─ Pass cameraNode vào đây!
  //              └─ Gọi function
  
  // matchers[0](cameraNode, matchers)
  //   → Gọi function với threeNode = cameraNode
  //   → (threeNode) => {
  //        // threeNode bây giờ = cameraNode ✅
  //        if (allNodePlacement.includes(threeNode.name)) {
  //          // threeNode.name = "Camera_TV_Placement_1_display_1"
  //          return <ProductNode parentNode={cameraNode} ... />;
  //        }
  //      }
}
```

---

## Giải Thích Chi Tiết Code

### Code Trong ProductsNodes.tsx

```typescript
const nodeMatchers: NodeMatcher[] = [
  (threeNode) => {
    // Kiểm tra: node name có trong danh sách placements không?
    if (allNodePlacement.includes(threeNode.name)) {
      // ✅ Match! → Đây là placement node
      return <ProductNode parentNode={threeNode} nameNode={threeNode.name} />;
    }
    
    // ❌ Không match → không phải placement node
    return undefined;
  },
];
```

**Giải thích từng phần:**

1. **`const nodeMatchers: NodeMatcher[] = [...]`**
   - Tạo array các matcher functions
   - Type: `NodeMatcher[]` (array of functions)

2. **`(threeNode) => { ... }`**
   - **Arrow function definition**
   - `threeNode` là **parameter** (chưa có giá trị)
   - Function này sẽ được gọi **sau này** trong GLTFNode

3. **`if (allNodePlacement.includes(threeNode.name))`**
   - Khi function được gọi, `threeNode` sẽ có giá trị
   - Kiểm tra `threeNode.name` có trong `allNodePlacement` không

4. **`return <ProductNode parentNode={threeNode} ... />`**
   - Nếu match → return React component
   - `threeNode` được pass vào `ProductNode` component

5. **`return undefined`**
   - Nếu không match → return undefined
   - GLTFNode sẽ tiếp tục render node gốc

---

## So Sánh: Function Definition vs Function Call

### Function Definition (Trong ProductsNodes)

```typescript
// ProductsNodes.tsx
const nodeMatchers = [
  (threeNode) => {  // ← Function DEFINITION
    // threeNode là parameter, chưa có giá trị
    // Function chưa được gọi
  }
];
```

**Đặc điểm:**
- Function chưa được gọi
- `threeNode` chỉ là parameter name
- Chưa có giá trị thực tế

---

### Function Call (Trong GLTFNode)

```typescript
// GLTFNode.tsx
const jsx = nodeMatchers[i](threeNode, nodeMatchers);
//              ↑              ↑
//              |              └─ Pass giá trị vào đây!
//              └─ Gọi function
```

**Đặc điểm:**
- Function được gọi với arguments
- `threeNode` có giá trị thực tế (từ props)
- Function body được execute

---

## Ví Dụ Tương Tự

### Ví Dụ 1: Array.map()

```typescript
// Tạo function (chưa gọi)
const double = (x) => x * 2;

// Gọi function với giá trị
const result = double(5);  // → 10
//              ↑    ↑
//              |    └─ Pass giá trị vào
//              └─ Gọi function
```

**Tương tự:**
```typescript
// ProductsNodes: Tạo function (chưa gọi)
const matcher = (threeNode) => { ... };

// GLTFNode: Gọi function với giá trị
const jsx = matcher(gltf.scene);  // Pass gltf.scene vào
```

---

### Ví Dụ 2: Event Handler

```typescript
// Tạo function (chưa gọi)
const handleClick = (event) => {
  console.log(event.target);
};

// Gọi function khi event xảy ra
button.onclick = handleClick;
// Khi click → handleClick(event) được gọi
// event được pass vào tự động
```

**Tương tự:**
```typescript
// ProductsNodes: Tạo function (chưa gọi)
const matcher = (threeNode) => { ... };

// GLTFNode: Gọi function khi traverse
matcher(currentNode);  // Pass currentNode vào
```

---

## Tóm Tắt

### 1. ProductsNodes() Không Nhận threeNode

```typescript
ProductsNodes()  // ← Không có parameter
// Chỉ tạo và return matcher functions
```

### 2. threeNode Được Pass Vào Matcher Function

```typescript
// GLTFNode.tsx
nodeMatchers[i](threeNode, nodeMatchers)
//              ↑
//              └─ Pass threeNode vào đây!
```

### 3. Flow

```
ProductsNodes() 
  → Tạo matcher function (chưa gọi)
  → Return array [function1, ...]
  ↓
GLTFNode nhận props
  → nodeMatchers = [function1, ...]
  → threeNode = gltf.scene
  ↓
GLTFNode gọi matcher
  → nodeMatchers[i](threeNode)  ← Pass threeNode vào
  → Matcher function execute với threeNode có giá trị
```

### 4. Điểm Quan Trọng

- `(threeNode) => { ... }` là **function definition** (chưa gọi)
- `threeNode` là **parameter** (chưa có giá trị)
- `threeNode` có giá trị **khi function được gọi** trong GLTFNode
- GLTFNode pass `threeNode` vào matcher function khi gọi: `nodeMatchers[i](threeNode)`

---

## Kết Luận

**Câu trả lời ngắn gọn:**

1. `ProductsNodes()` **KHÔNG** nhận `threeNode` làm parameter
2. `ProductsNodes()` chỉ tạo và return matcher functions
3. `threeNode` được pass vào matcher function **khi GLTFNode gọi function**
4. Code trong GLTFNode: `nodeMatchers[i](threeNode, nodeMatchers)` ← Đây là nơi pass `threeNode` vào!

**Flow:**
```
ProductsNodes() → Tạo functions (chưa gọi)
  ↓
GLTFNode nhận props: threeNode = gltf.scene
  ↓
GLTFNode gọi: nodeMatchers[i](threeNode)  ← Pass vào đây!
  ↓
Matcher function execute với threeNode có giá trị
```

