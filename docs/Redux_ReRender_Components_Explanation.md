# Redux Update và Component Re-render - Giải Thích Chi Tiết

## Tổng Quan

Khi Redux store được cập nhật, **chỉ những component nào sử dụng `useAppSelector` (hoặc `useSelector`) để subscribe vào phần state đã thay đổi mới được re-render**.

## Nguyên Lý Hoạt Động

### 1. React-Redux Subscription Mechanism

React-Redux sử dụng cơ chế **subscription** để theo dõi thay đổi:

```typescript
// Khi component sử dụng useAppSelector
const nodes = useAppSelector(getNodes);

// React-Redux sẽ:
// 1. Subscribe component vào Redux store
// 2. Mỗi khi store update, kiểm tra xem giá trị từ selector có thay đổi không
// 3. Nếu có thay đổi → component re-render
// 4. Nếu không thay đổi → component KHÔNG re-render
```

### 2. Selector Function và Equality Check

React-Redux sử dụng **strict equality check** (`===`) để so sánh:

```typescript
// Ví dụ: Selector trả về object
const nodes = useAppSelector(getNodes);
// nodes = { "Mic_Placement_1": "asset-id-123" }

// Khi Redux update:
// - Nếu getNodes() trả về object MỚI (reference khác) → re-render
// - Nếu getNodes() trả về cùng object (reference giống) → KHÔNG re-render
```

---

## Các Component Re-render Khi Redux Update

### 1. Component Sử Dụng `useAppSelector`

**Chỉ những component nào có `useAppSelector` subscribe vào phần state đã thay đổi mới re-render.**

#### Ví Dụ 1: ProductNode Component

```typescript
// src/components/Assets/ProductNode.tsx
export const ProductNode: FC<ProductProps> = ({ nameNode, parentNode }) => {
  // ✅ Component này sẽ re-render khi:
  // - state.configurator.highlightNodes thay đổi
  const isHighlightNode = useAppSelector(
    getIsHighlightNode(selectedNode !== null ? selectedNode : nameNode)
  );
  
  // ✅ Component này sẽ re-render khi:
  // - state.configurator.popuptNodes thay đổi
  const isPopuptNode = useAppSelector(
    getIsPopuptNodes(selectedNode !== null ? selectedNode : nameNode)
  );
  
  // ✅ Component này sẽ re-render khi:
  // - state.configurator.nodes thay đổi (QUAN TRỌNG NHẤT)
  const attachNodeNameToAssetId = useAppSelector(getNodes);
  
  // ✅ Component này sẽ re-render khi:
  // - state.configurator.configuration thay đổi
  const configuration = useAppSelector(getConfiguration);
  
  // Logic render dựa trên nodes mapping
  if (!Object.keys(attachNodeNameToAssetId).includes(nameNode)) {
    return undefined; // Không có mapping → không render
  }
  
  return <Product productAssetId={attachNodeNameToAssetId[nameNode]} ... />;
};
```

**Khi nào ProductNode re-render?**

1. ✅ Khi `changeValueNodes()` được dispatch → `state.configurator.nodes` thay đổi
2. ✅ Khi `setHighlightNodes()` được dispatch → `state.configurator.highlightNodes` thay đổi
3. ✅ Khi `setPopuptNodes()` được dispatch → `state.configurator.popuptNodes` thay đổi
4. ✅ Khi `changeValueConfiguration()` được dispatch → `state.configurator.configuration` thay đổi
5. ❌ Khi `state.ui.activeStep` thay đổi → **KHÔNG re-render** (vì không subscribe)

#### Ví Dụ 2: Product Component

```typescript
// src/components/Assets/Product.tsx
export const Product: React.FC<ProductProps> = ({ ... }) => {
  // ✅ Re-render khi state.configurator.assetId thay đổi
  const roomAssetId = useAppSelector(getAssetId);
  
  // ✅ Re-render khi state.configurator.configuration thay đổi
  const keyPermissionObj = useAppSelector(
    getKeyPermissionFromNameNode(nameNode)
  );
  
  // Component này sẽ re-render khi:
  // - roomAssetId thay đổi
  // - keyPermissionObj thay đổi
};
```

#### Ví Dụ 3: Room Component

```typescript
// src/components/Assets/Room.tsx
export const Room: React.FC<RoomProps> = (props) => {
  // ✅ Re-render khi state.configurator.nodes thay đổi
  const nodes = useAppSelector(getNodes);
  
  // Component này sẽ re-render mỗi khi nodes mapping thay đổi
  // Ví dụ: khi user chọn sản phẩm mới → nodes update → Room re-render
};
```

#### Ví Dụ 4: Card Component

```typescript
// src/pages/configurator/Content/LoaderSection/Card/Card.tsx
export const Card: React.FC<PropsI> = ({ keyItemPermission }) => {
  // ✅ Re-render khi state.ui.stepData thay đổi
  const stepName = useAppSelector(
    getStepNameByKeyPermission(keyItemPermission)
  );
  
  // ✅ Re-render khi state.ui.stepData[stepName].cards thay đổi
  const card = useAppSelector(
    getCardByKeyPermission(stepName, keyItemPermission)
  );
  
  // ✅ Re-render khi state.ui.langText thay đổi
  const title = useAppSelector(
    getTitleCardByKeyPermission(stepName, keyItemPermission)
  );
  
  // Component này sẽ re-render khi:
  // - stepData thay đổi
  // - langText thay đổi
};
```

---

## Flow Re-render Khi Redux Update

### Scenario: User Chọn Sản Phẩm Mới

```
1. User click vào Card → dispatch action
   ↓
2. Action: changeValueNodes({ "Mic_Placement_1": "new-asset-id" })
   ↓
3. Redux Reducer: state.configurator.nodes["Mic_Placement_1"] = "new-asset-id"
   ↓
4. Redux store notify tất cả subscribers
   ↓
5. React-Redux kiểm tra từng component:
   
   ✅ ProductNode (có useAppSelector(getNodes))
      → getNodes() trả về object MỚI
      → Re-render ProductNode
   
   ✅ Room (có useAppSelector(getNodes))
      → getNodes() trả về object MỚI
      → Re-render Room
   
   ❌ Card (chỉ có useAppSelector(getCardByKeyPermission))
      → getCardByKeyPermission() trả về cùng giá trị
      → KHÔNG re-render
   
   ❌ Product (không có useAppSelector(getNodes))
      → KHÔNG subscribe vào nodes
      → KHÔNG re-render (trừ khi props thay đổi)
```

---

## Các Redux Slices và Component Liên Quan

### 1. Configurator Slice

**State:**
```typescript
{
  assetId: string | null;
  isBuilding: boolean;
  isProcessing: boolean;
  configuration: Record<string, Configuration>;
  nodes: Record<string, string>;  // ⭐ QUAN TRỌNG: Mapping nodeName → assetId
  highlightNodes: Record<string, boolean>;
  popuptNodes: Record<string, boolean>;
  camera: DataCamera;
  dimensionEnabled: boolean;
}
```

**Components subscribe vào Configurator:**

| Component | Selector | Re-render khi |
|-----------|----------|---------------|
| `ProductNode` | `getNodes()` | `nodes` thay đổi |
| `ProductNode` | `getIsHighlightNode()` | `highlightNodes` thay đổi |
| `ProductNode` | `getIsPopuptNodes()` | `popuptNodes` thay đổi |
| `ProductNode` | `getConfiguration()` | `configuration` thay đổi |
| `Product` | `getAssetId()` | `assetId` thay đổi |
| `Product` | `getKeyPermissionFromNameNode()` | `configuration` thay đổi |
| `Room` | `getNodes()` | `nodes` thay đổi |

### 2. UI Slice

**State:**
```typescript
{
  locale: LocaleT | "";
  processInitData: boolean;
  stepData: StepDataI;
  activeStep: StepName;
  selectedData: SelectedDataI;
  langText: LangTextI;
  formData: FormI;
  typeDisplay: TVName | undefined;
}
```

**Components subscribe vào UI:**

| Component | Selector | Re-render khi |
|-----------|----------|---------------|
| `Card` | `getStepNameByKeyPermission()` | `stepData` thay đổi |
| `Card` | `getCardByKeyPermission()` | `stepData[step].cards` thay đổi |
| `Card` | `getTitleCardByKeyPermission()` | `langText` thay đổi |
| Nhiều component khác | `getActiveStep()` | `activeStep` thay đổi |

---

## Best Practices

### 1. Sử Dụng Selector Cụ Thể

**❌ KHÔNG NÊN:**
```typescript
// Subscribe vào toàn bộ state → re-render mỗi khi bất kỳ state nào thay đổi
const state = useAppSelector((state) => state);
```

**✅ NÊN:**
```typescript
// Chỉ subscribe vào phần state cần thiết
const nodes = useAppSelector(getNodes);
const configuration = useAppSelector(getConfiguration);
```

### 2. Sử Dụng Memoized Selector

**✅ Tốt:**
```typescript
// Selector được memoize → chỉ re-render khi giá trị thực sự thay đổi
const nodes = useAppSelector(getNodes);
```

### 3. Tránh Re-render Không Cần Thiết

**❌ Vấn đề:**
```typescript
// Mỗi lần render tạo object mới → luôn re-render
const config = useAppSelector((state) => ({
  nodes: state.configurator.nodes,
  configuration: state.configurator.configuration,
}));
```

**✅ Giải pháp:**
```typescript
// Sử dụng selector riêng biệt
const nodes = useAppSelector(getNodes);
const configuration = useAppSelector(getConfiguration);
```

---

## Tóm Tắt

### Component Re-render Khi:

1. ✅ Component có `useAppSelector` subscribe vào phần state đã thay đổi
2. ✅ Selector function trả về giá trị khác (reference khác với object/array)
3. ✅ Component nhận props mới từ parent (do parent re-render)

### Component KHÔNG Re-render Khi:

1. ❌ Redux state thay đổi nhưng component không subscribe vào phần đó
2. ❌ Selector trả về cùng giá trị (cùng reference với object/array)
3. ❌ State thay đổi nhưng không liên quan đến selector của component

### Ví Dụ Cụ Thể:

**Khi `changeValueNodes()` được dispatch:**

- ✅ `ProductNode` re-render (có `useAppSelector(getNodes)`)
- ✅ `Room` re-render (có `useAppSelector(getNodes)`)
- ❌ `Card` KHÔNG re-render (không subscribe vào `nodes`)
- ❌ `Product` KHÔNG re-render (trừ khi nhận props mới từ `ProductNode`)

---

## Debug Re-render

Để debug component nào re-render, thêm log vào component:

```typescript
export const ProductNode: FC<ProductProps> = ({ nameNode }) => {
  console.log("🔄 ProductNode re-render:", nameNode);
  
  const nodes = useAppSelector(getNodes);
  // ...
};
```

Hoặc sử dụng React DevTools Profiler để xem component nào re-render.

