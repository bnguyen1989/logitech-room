# Giải Thích Chi Tiết Code GLTFNode.tsx

## Tổng Quan

`GLTFNode.tsx` là component **core** của hệ thống render 3D scene. Nó có nhiệm vụ:
1. **Recursively traverse** scene graph từ Three.js
2. **Convert** Three.js objects thành React Three Fiber components
3. **Apply node matchers** để replace specific nodes với custom React components
4. **Handle interactions** (pointer events, cursor changes)

---

## 1. Imports và Type Definitions

### 1.1. Imports

```typescript
import type { ReactElement, ReactNode } from "react";
import * as THREE from "three";
import type { Mesh, Object3D } from "three";
import { PlacementManager } from "../../models/configurator/PlacementManager";
```

**Giải thích:**
- `ReactElement`, `ReactNode`: Types từ React để định nghĩa return types
- `THREE`: Three.js library - 3D graphics library
- `Mesh`, `Object3D`: Three.js types cho 3D objects
- `PlacementManager`: Utility class để quản lý placement node names

---

### 1.2. Type Definitions

```typescript
export type ThreeNodeProps = {
  nodeMatchers?: NodeMatcher[];
  threeNode: Object3D;
  children?: ReactNode;
  props?: object;
};
```

**Giải thích:**
- `ThreeNodeProps`: Props type cho component (không được sử dụng trực tiếp trong code)
- `nodeMatchers`: Array các functions để match và replace nodes
- `threeNode`: Three.js Object3D cần render
- `children`: React children (optional)
- `props`: Additional props để pass xuống React Three Fiber components

---

```typescript
export type NodeMatcher = (
  threeNode: THREE.Object3D,
  nodeMatchers?: NodeMatcher[]
) => ReactElement | undefined;
```

**Giải thích:**
- `NodeMatcher`: Function type để match nodes
- **Input:**
  - `threeNode`: Node cần kiểm tra
  - `nodeMatchers`: Array matchers (để pass xuống recursive calls)
- **Output:**
  - `ReactElement`: Nếu match → return component để replace node
  - `undefined`: Nếu không match → tiếp tục render node gốc

**Ví dụ:**
```typescript
const matcher: NodeMatcher = (threeNode) => {
  if (threeNode.name === "Mic_Placement_1") {
    return <ProductNode parentNode={threeNode} nameNode={threeNode.name} />;
  }
  return undefined;
};
```

---

```typescript
export type ThreeNodeRendererProps = {
  threeNode: Object3D;
  nodeMatchers?: NodeMatcher[];
  props?: object;
};
```

**Giải thích:**
- `ThreeNodeRendererProps`: Props type cho `GLTFNode` component
- Tương tự `ThreeNodeProps` nhưng không có `children` (vì children được generate từ `threeNode.children`)

---

## 2. Helper Function: getParentNames

### 2.1. Function Signature

```typescript
const getParentNames = (object: THREE.Object3D): string[] => {
  const parentNames: string[] = [];
  let currentObject: THREE.Object3D | null = object;

  while (currentObject.parent) {
    if (currentObject.parent.name) {
      parentNames.push(currentObject.parent.name);
    }
    currentObject = currentObject.parent;
  }

  return parentNames;
};
```

**Mục đích:** Lấy tất cả tên của parent nodes từ một object lên đến root.

**Giải thích từng dòng:**

1. **`const parentNames: string[] = []`**
   - Khởi tạo array để lưu tên parent nodes

2. **`let currentObject: THREE.Object3D | null = object`**
   - Bắt đầu từ object được truyền vào
   - Type `| null` vì có thể không có parent

3. **`while (currentObject.parent)`**
   - Loop cho đến khi không còn parent (đến root node)
   - `currentObject.parent` là parent node trong scene graph

4. **`if (currentObject.parent.name)`**
   - Kiểm tra parent có tên không (có thể là empty string hoặc undefined)
   - Chỉ lưu nếu có tên

5. **`parentNames.push(currentObject.parent.name)`**
   - Thêm tên parent vào array

6. **`currentObject = currentObject.parent`**
   - Di chuyển lên parent node để tiếp tục loop

7. **`return parentNames`**
   - Trả về array tên parent nodes (từ immediate parent đến root)

**Ví dụ:**

```
Scene Graph:
Root
  └─ Room
      └─ Wall
          └─ Camera_Placement_1  ← object được truyền vào
```

**Kết quả:**
```typescript
getParentNames(cameraPlacementNode)
// → ["Wall", "Room"]
// (từ immediate parent "Wall" lên đến "Room")
```

**Sử dụng:** Function này được dùng trong `onPointerMove` handler để kiểm tra parent nodes khi user hover.

---

## 3. Main Component: GLTFNode

### 3.1. Component Signature

```typescript
export const GLTFNode = ({
  nodeMatchers,
  threeNode,
  props,
}: ThreeNodeRendererProps): ReactNode => {
  // ...
};
```

**Giải thích:**
- **Component name:** `GLTFNode` - render một Three.js Object3D thành React component
- **Props:**
  - `nodeMatchers`: Array functions để match và replace nodes
  - `threeNode`: Three.js Object3D cần render
  - `props`: Additional props
- **Return type:** `ReactNode` - có thể là JSX element hoặc null

---

### 3.2. Step 1: Apply Node Matchers

```typescript
if (nodeMatchers) {
  for (let i = 0; i < nodeMatchers.length; i++) {
    const jsx = nodeMatchers[i](threeNode, nodeMatchers);
    if (jsx) {
      return jsx;
    }
  }
}
```

**Mục đích:** Kiểm tra xem node này có match với bất kỳ matcher nào không. Nếu có → replace node bằng component từ matcher.

**Giải thích từng dòng:**

1. **`if (nodeMatchers)`**
   - Kiểm tra có matchers không (optional prop)

2. **`for (let i = 0; i < nodeMatchers.length; i++)`**
   - Loop qua tất cả matchers
   - Dùng `for` loop thay vì `forEach` để có thể `return` sớm

3. **`const jsx = nodeMatchers[i](threeNode, nodeMatchers)`**
   - Gọi matcher function với:
     - `threeNode`: Node hiện tại
     - `nodeMatchers`: Pass xuống để recursive calls có thể dùng

4. **`if (jsx)`**
   - Kiểm tra matcher có return component không
   - Nếu `undefined` → tiếp tục matcher tiếp theo
   - Nếu có JSX → match found!

5. **`return jsx`**
   - **Quan trọng:** Return component từ matcher → **replace** node gốc
   - Không render node gốc nữa, chỉ render component từ matcher

**Ví dụ Flow:**

```typescript
// Scene có node: "Mic_Placement_1"
// Matchers: [ProductsNodes matcher]

// Step 1: Apply matchers
nodeMatchers[0](micPlacementNode)
  → ProductsNodes matcher kiểm tra: allPlacements.includes("Mic_Placement_1")
  → ✅ Match! Return <ProductNode parentNode={micPlacementNode} ... />
  → GLTFNode return <ProductNode /> → Replace node gốc
```

**Kết quả:**
- Nếu **match** → node được **replace** bởi component từ matcher
- Nếu **không match** → tiếp tục render node gốc

---

### 3.3. Step 2: Recursively Process Children

```typescript
const children = threeNode.children.map((child) => (
  <GLTFNode
    key={child.uuid}
    threeNode={child}
    nodeMatchers={nodeMatchers}
    {...props}
  />
));
```

**Mục đích:** Recursively render tất cả children nodes.

**Giải thích từng dòng:**

1. **`threeNode.children`**
   - Array các child nodes trong Three.js scene graph
   - Mỗi child là một `Object3D`

2. **`.map((child) => ...)`**
   - Convert mỗi child thành React component
   - **Recursive call:** Gọi `GLTFNode` cho mỗi child

3. **`<GLTFNode key={child.uuid} ...>`**
   - **`key={child.uuid}`**: React key (unique ID từ Three.js)
   - **`threeNode={child}`**: Pass child node
   - **`nodeMatchers={nodeMatchers}`**: Pass matchers xuống (để children cũng có thể match)
   - **`{...props}`**: Spread additional props

**Ví dụ Scene Graph:**

```
Room (root)
  ├─ Wall
  │   ├─ Camera_Placement_1  ← Match! → <ProductNode />
  │   └─ Mesh_001
  └─ Table
      └─ Tap_Placement_1  ← Match! → <ProductNode />
```

**Recursive Process:**

```
GLTFNode(Room)
  → children = [
      GLTFNode(Wall),
      GLTFNode(Table)
    ]
    GLTFNode(Wall)
      → children = [
          GLTFNode(Camera_Placement_1)  ← Match! → <ProductNode />
          GLTFNode(Mesh_001)
        ]
    GLTFNode(Table)
      → children = [
          GLTFNode(Tap_Placement_1)  ← Match! → <ProductNode />
        ]
```

**Kết quả:** Tất cả nodes trong scene được process recursively, và placement nodes được replace bởi `ProductNode` components.

---

### 3.4. Step 3: Render Node (Mesh hoặc Group)

#### 3.4.1. Check if Mesh

```typescript
if ("isMesh" in threeNode) {
  // Render as <mesh>
} else {
  // Render as <group>
}
```

**Giải thích:**
- **`"isMesh" in threeNode`**: Type guard để kiểm tra node có phải Mesh không
- **Mesh**: Có geometry và material (visible 3D object)
- **Group/Object3D**: Container node (không có geometry, chỉ chứa children)

---

#### 3.4.2. Render Mesh

```typescript
if ("isMesh" in threeNode) {
  const mesh = threeNode as Mesh;
  return (
    <mesh
      castShadow
      receiveShadow
      key={mesh.uuid + "-mesh"}
      geometry={mesh.geometry}
      material={mesh.material}
      position={threeNode.position}
      scale={threeNode.scale}
      rotation={threeNode.rotation}
      {...props}
      onPointerMove={(e) => {
        // ... pointer event handler
      }}
    >
      {children}
    </mesh>
  );
}
```

**Giải thích từng prop:**

1. **`castShadow`**
   - Mesh có thể cast shadow lên objects khác
   - React Three Fiber prop

2. **`receiveShadow`**
   - Mesh có thể receive shadow từ objects khác
   - React Three Fiber prop

3. **`key={mesh.uuid + "-mesh"}`**
   - React key (unique)
   - `uuid`: Unique ID từ Three.js
   - `+ "-mesh"`: Suffix để tránh conflict với group keys

4. **`geometry={mesh.geometry}`**
   - Three.js geometry (vertices, faces)
   - React Three Fiber tự động handle

5. **`material={mesh.material}`**
   - Three.js material (color, texture, etc.)
   - React Three Fiber tự động handle

6. **`position={threeNode.position}`**
   - Position từ Three.js node
   - Type: `THREE.Vector3` → React Three Fiber tự convert

7. **`scale={threeNode.scale}`**
   - Scale từ Three.js node
   - Type: `THREE.Vector3`

8. **`rotation={threeNode.rotation}`**
   - Rotation từ Three.js node
   - Type: `THREE.Euler`

9. **`{...props}`**
   - Spread additional props từ parent

10. **`onPointerMove={(e) => { ... }}`**
    - Pointer event handler (khi mouse move trên mesh)
    - Xem chi tiết ở phần 3.5

11. **`{children}`**
    - Render children nodes (đã được process ở Step 2)

---

#### 3.4.3. Render Group

```typescript
else {
  return (
    <group
      key={threeNode.uuid + "-group"}
      position={threeNode.position}
      scale={threeNode.scene}
      rotation={threeNode.rotation}
      {...props}
    >
      {children}
    </group>
  );
}
```

**Giải thích:**
- **`<group>`**: React Three Fiber component cho container nodes
- Tương tự mesh nhưng:
  - Không có `geometry`, `material`
  - Không có `castShadow`, `receiveShadow`
  - Không có `onPointerMove` (vì group không có geometry để detect pointer)
- Chỉ là container để group children lại

**Ví dụ:**
```typescript
// Group node (không có geometry)
<group position={[0, 1, 0]}>
  <mesh geometry={...} material={...} />  ← Child mesh
  <mesh geometry={...} material={...} />  ← Child mesh
</group>
```

---

### 3.5. Pointer Event Handler: onPointerMove

```typescript
onPointerMove={(e) => {
  const intersections = e.intersections;

  const parentNames = getParentNames(intersections[0].object)
    .flat()
    .filter(
      (name, index, self) => name !== "" && self.indexOf(name) === index
    )
    .filter(
      (name) => !name.includes(PlacementManager.getNameNodeForTV())
    );

  document.body.style.cursor =
    parentNames.length > 0 ? "pointer" : "default";
}}
```

**Mục đích:** Thay đổi cursor khi hover vào interactive objects (không phải TV).

**Giải thích từng dòng:**

1. **`const intersections = e.intersections`**
   - `e`: Pointer event từ React Three Fiber
   - `intersections`: Array các objects bị intersect bởi pointer ray
   - `intersections[0]`: Object đầu tiên (closest)

2. **`getParentNames(intersections[0].object)`**
   - Lấy tên tất cả parent nodes
   - Ví dụ: `["Wall", "Room"]`

3. **`.flat()`**
   - Flatten array (không cần thiết trong trường hợp này vì `getParentNames` đã return 1D array)
   - Có thể là defensive coding

4. **`.filter((name, index, self) => name !== "" && self.indexOf(name) === index)`**
   - **`name !== ""`**: Loại bỏ empty strings
   - **`self.indexOf(name) === index`**: Loại bỏ duplicates (chỉ giữ lần xuất hiện đầu tiên)
   - **Kết quả:** Array unique, non-empty names

5. **`.filter((name) => !name.includes(PlacementManager.getNameNodeForTV()))`**
   - **`PlacementManager.getNameNodeForTV()`**: Trả về `"Display_Placement_1"` (TV node name)
   - **`!name.includes(...)`**: Loại bỏ TV nodes
   - **Lý do:** TV không nên trigger pointer cursor (không interactive)

6. **`document.body.style.cursor = parentNames.length > 0 ? "pointer" : "default"`**
   - **Nếu có parent names** (sau khi filter) → cursor = "pointer" (có thể click)
   - **Nếu không có** → cursor = "default" (normal cursor)

**Ví dụ Flow:**

```typescript
// User hover vào Camera mesh
// Scene: Room → Wall → Camera_Placement_1 → Camera_Mesh

onPointerMove triggered
  → intersections[0].object = Camera_Mesh
  → getParentNames(Camera_Mesh) = ["Camera_Placement_1", "Wall", "Room"]
  → filter empty → ["Camera_Placement_1", "Wall", "Room"]
  → filter duplicates → ["Camera_Placement_1", "Wall", "Room"]
  → filter TV → ["Camera_Placement_1", "Wall", "Room"] (không có TV)
  → parentNames.length = 3 > 0
  → cursor = "pointer" ✅
```

```typescript
// User hover vào TV mesh
// Scene: Room → TV_Placement → TV_Mesh

onPointerMove triggered
  → intersections[0].object = TV_Mesh
  → getParentNames(TV_Mesh) = ["Display_Placement_1", "Room"]
  → filter empty → ["Display_Placement_1", "Room"]
  → filter duplicates → ["Display_Placement_1", "Room"]
  → filter TV → [] (đã loại bỏ "Display_Placement_1")
  → parentNames.length = 0
  → cursor = "default" ✅ (TV không interactive)
```

---

## 4. Complete Flow Example

### 4.1. Scene Structure

```
Room (root Object3D)
  ├─ Wall (Group)
  │   ├─ Camera_Placement_1 (Empty Object3D) ← Placement node
  │   └─ Wall_Mesh (Mesh)
  └─ Table (Group)
      └─ Tap_Placement_1 (Empty Object3D) ← Placement node
```

### 4.2. Render Process

```
1. GLTFNode(Room)
   ├─ Apply matchers: No match
   ├─ Process children:
   │   ├─ GLTFNode(Wall)
   │   │   ├─ Apply matchers: No match
   │   │   ├─ Process children:
   │   │   │   ├─ GLTFNode(Camera_Placement_1)
   │   │   │   │   ├─ Apply matchers: ✅ Match! → <ProductNode />
   │   │   │   │   └─ Return <ProductNode /> (không render children)
   │   │   │   └─ GLTFNode(Wall_Mesh)
   │   │   │       ├─ Apply matchers: No match
   │   │   │       └─ Return <mesh> (render mesh)
   │   │   └─ Return <group> với children
   │   └─ GLTFNode(Table)
   │       ├─ Apply matchers: No match
   │       ├─ Process children:
   │       │   └─ GLTFNode(Tap_Placement_1)
   │       │       ├─ Apply matchers: ✅ Match! → <ProductNode />
   │       │       └─ Return <ProductNode />
   │       └─ Return <group> với children
   └─ Return <group> với children
```

**Kết quả JSX:**

```jsx
<group> {/* Room */}
  <group> {/* Wall */}
    <ProductNode parentNode={Camera_Placement_1} ... /> {/* Replaced */}
    <mesh>...</mesh> {/* Wall_Mesh */}
  </group>
  <group> {/* Table */}
    <ProductNode parentNode={Tap_Placement_1} ... /> {/* Replaced */}
  </group>
</group>
```

---

## 5. Key Concepts

### 5.1. Node Matchers Pattern

**Pattern:** Visitor pattern với replacement capability

- **Traverse:** Recursively visit all nodes
- **Match:** Check if node matches criteria
- **Replace:** Return custom component thay vì node gốc

**Lợi ích:**
- Flexible: Có thể add nhiều matchers
- Non-invasive: Không cần modify scene structure
- Declarative: Matchers được define ở một nơi

---

### 5.2. Recursive Rendering

**Pattern:** Recursive component rendering

- Component tự gọi chính nó cho children
- Tương tự tree traversal algorithms
- Mỗi level process children trước khi render parent

**Lợi ích:**
- Handle nested structures tự động
- Code đơn giản, dễ maintain
- Tự động handle bất kỳ depth nào

---

### 5.3. Type Safety

**Type guards:**
- `"isMesh" in threeNode`: Runtime type check
- `as Mesh`: Type assertion sau khi check

**Lợi ích:**
- TypeScript type safety
- Runtime safety (check trước khi cast)

---

## 6. Performance Considerations

### 6.1. Recursive Calls

**Potential issue:** Deep nesting có thể gây stack overflow

**Mitigation:**
- Three.js scenes thường không quá deep (< 10 levels)
- React handles rendering efficiently

---

### 6.2. Matcher Execution

**Potential issue:** Matchers được gọi cho mọi node

**Mitigation:**
- Matchers nên có early return
- Sử dụng efficient checks (array.includes thay vì complex logic)

---

### 6.3. Re-renders

**Potential issue:** Parent re-render → tất cả children re-render

**Mitigation:**
- React Three Fiber optimizes re-renders
- `key={child.uuid}` giúp React identify nodes

---

## 7. Common Use Cases

### 7.1. Replace Placement Nodes

```typescript
// ProductsNodes matcher
const matcher = (threeNode) => {
  if (allPlacements.includes(threeNode.name)) {
    return <ProductNode parentNode={threeNode} nameNode={threeNode.name} />;
  }
  return undefined;
};
```

**Kết quả:** Placement nodes được replace bởi `ProductNode` components.

---

### 7.2. Add Annotations

```typescript
// Annotation matcher
const matcher = (threeNode) => {
  if (threeNode.name.startsWith("Annotation_")) {
    return <AnnotationComponent node={threeNode} />;
  }
  return undefined;
};
```

**Kết quả:** Annotation nodes được replace bởi annotation components.

---

### 7.3. Filter Nodes

```typescript
// Filter matcher
const matcher = (threeNode) => {
  if (threeNode.name.includes("Hidden")) {
    return null; // Hide node
  }
  return undefined;
};
```

**Kết quả:** Hidden nodes không được render.

---

## 8. Debugging Tips

### 8.1. Log Node Names

```typescript
console.log("Rendering node:", threeNode.name, threeNode.constructor.name);
```

### 8.2. Check Matcher Results

```typescript
const jsx = nodeMatchers[i](threeNode, nodeMatchers);
if (jsx) {
  console.log("Matched node:", threeNode.name, "→", jsx.type);
}
```

### 8.3. Inspect Scene Graph

```typescript
// In Room.tsx
gltf.scene.traverse((node) => {
  console.log(node.name, node.constructor.name);
});
```

---

## Kết Luận

`GLTFNode` là component **core** của hệ thống render 3D:

1. **Recursively traverse** scene graph
2. **Apply matchers** để replace nodes
3. **Convert** Three.js objects thành React components
4. **Handle interactions** (pointer events)

**Key Features:**
- ✅ Flexible node replacement system
- ✅ Recursive rendering
- ✅ Type-safe
- ✅ Performance optimized

**Usage:**
```typescript
<GLTFNode 
  threeNode={gltf.scene} 
  nodeMatchers={ProductsNodes()} 
/>
```

