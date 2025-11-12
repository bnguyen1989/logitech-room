# Tại Sao Cần Array Cho nodeMatchers Khi Chỉ Có 1 Phần Tử?

## Câu Hỏi

Bạn thấy:
```typescript
// ProductsNodes.tsx
const nodeMatchers: NodeMatcher[] = [
  (threeNode) => { ... }  // Chỉ có 1 function
];

// GLTFNode.tsx
for (let i = 0; i < nodeMatchers.length; i++) {
  const jsx = nodeMatchers[i](threeNode, nodeMatchers);
  // ...
}
```

**Câu hỏi:** Tại sao cần array khi chỉ có 1 phần tử? Tại sao không dùng function trực tiếp?

---

## Giải Thích

### 1. Flexibility - Có Thể Thêm Nhiều Matchers

**Pattern này cho phép thêm nhiều matchers khác nhau:**

```typescript
// Hiện tại: Chỉ có 1 matcher
const nodeMatchers = [
  (threeNode) => { /* ProductsNodes matcher */ }
];

// Tương lai: Có thể thêm nhiều matchers
const nodeMatchers = [
  (threeNode) => { /* ProductsNodes matcher */ },
  (threeNode) => { /* AnnotationNodes matcher */ },
  (threeNode) => { /* FilterNodes matcher */ },
  (threeNode) => { /* CustomNodes matcher */ },
];
```

**Lợi ích:**
- ✅ Dễ dàng thêm matchers mới
- ✅ Không cần sửa code cũ
- ✅ Mỗi matcher có thể handle một loại node khác nhau

---

### 2. Extensibility - Dễ Mở Rộng

**Ví dụ: Thêm Annotation Matcher**

```typescript
// ProductsNodes.tsx
export const ProductsNodes = () => {
  const allNodePlacement = PlacementManager.getAllPlacement();

  const nodeMatchers: NodeMatcher[] = [
    // Matcher 1: Products
    (threeNode) => {
      if (allNodePlacement.includes(threeNode.name)) {
        return <ProductNode ... />;
      }
      return undefined;
    },
    
    // Matcher 2: Annotations (có thể thêm sau)
    (threeNode) => {
      if (threeNode.name.startsWith("Annotation_")) {
        return <AnnotationNode ... />;
      }
      return undefined;
    },
    
    // Matcher 3: Filters (có thể thêm sau)
    (threeNode) => {
      if (threeNode.name.includes("Hidden")) {
        return null; // Hide node
      }
      return undefined;
    },
  ];

  return nodeMatchers;
};
```

**Lợi ích:**
- ✅ Có thể thêm nhiều matchers mà không sửa code cũ
- ✅ Mỗi matcher độc lập
- ✅ Dễ test từng matcher riêng

---

### 3. Pattern Consistency - Nhất Quán

**GLTFNode được thiết kế để nhận array:**

```typescript
// GLTFNode.tsx
export const GLTFNode = ({
  nodeMatchers,  // ← Type: NodeMatcher[] (array)
  threeNode,
  props,
}) => {
  if (nodeMatchers) {
    for (let i = 0; i < nodeMatchers.length; i++) {
      const jsx = nodeMatchers[i](threeNode, nodeMatchers);
      if (jsx) {
        return jsx;
      }
    }
  }
  // ...
};
```

**Nếu dùng function trực tiếp:**
```typescript
// ❌ Sẽ phải sửa GLTFNode
export const GLTFNode = ({
  nodeMatcher,  // ← Single function
  threeNode,
  props,
}) => {
  if (nodeMatcher) {
    const jsx = nodeMatcher(threeNode);
    if (jsx) {
      return jsx;
    }
  }
  // ...
};
```

**Vấn đề:**
- ❌ Nếu muốn thêm matcher thứ 2 → phải sửa GLTFNode
- ❌ Không flexible
- ❌ Phá vỡ pattern

**Với array:**
- ✅ Không cần sửa GLTFNode
- ✅ Chỉ cần thêm vào array
- ✅ Giữ pattern nhất quán

---

### 4. Chain Multiple Matchers - Chạy Tuần Tự

**Matchers được gọi tuần tự cho đến khi có match:**

```typescript
// GLTFNode.tsx
for (let i = 0; i < nodeMatchers.length; i++) {
  const jsx = nodeMatchers[i](threeNode, nodeMatchers);
  if (jsx) {
    return jsx;  // ✅ Match found → return ngay
  }
  // ❌ Không match → tiếp tục matcher tiếp theo
}
```

**Ví dụ:**
```typescript
const nodeMatchers = [
  // Matcher 1: Products
  (threeNode) => {
    if (allPlacements.includes(threeNode.name)) {
      return <ProductNode ... />;
    }
    return undefined;  // Không match → tiếp tục
  },
  
  // Matcher 2: Annotations
  (threeNode) => {
    if (threeNode.name.startsWith("Annotation_")) {
      return <AnnotationNode ... />;
    }
    return undefined;  // Không match → tiếp tục
  },
  
  // Matcher 3: Default
  (threeNode) => {
    // Always return something
    return <DefaultNode ... />;
  },
];
```

**Flow:**
```
Node: "Mic_Placement_1"
  ↓
Matcher 1: Check placements → ✅ Match! → Return <ProductNode />
  ↓
Stop (không chạy matcher 2, 3)

---

Node: "Annotation_Info"
  ↓
Matcher 1: Check placements → ❌ No match → Continue
  ↓
Matcher 2: Check annotations → ✅ Match! → Return <AnnotationNode />
  ↓
Stop (không chạy matcher 3)
```

---

### 5. Priority System - Ưu Tiên

**Có thể sắp xếp matchers theo độ ưu tiên:**

```typescript
const nodeMatchers = [
  // Priority 1: Products (cao nhất)
  (threeNode) => {
    if (allPlacements.includes(threeNode.name)) {
      return <ProductNode ... />;
    }
    return undefined;
  },
  
  // Priority 2: Annotations
  (threeNode) => {
    if (threeNode.name.startsWith("Annotation_")) {
      return <AnnotationNode ... />;
    }
    return undefined;
  },
  
  // Priority 3: Default (thấp nhất)
  (threeNode) => {
    return <DefaultNode ... />;
  },
];
```

**Lợi ích:**
- ✅ Products được check trước (priority cao)
- ✅ Nếu không phải product → check annotation
- ✅ Nếu không phải annotation → dùng default

---

### 6. Conditional Matchers - Điều Kiện

**Có thể thêm/bớt matchers dựa trên điều kiện:**

```typescript
export const ProductsNodes = () => {
  const allNodePlacement = PlacementManager.getAllPlacement();
  
  const nodeMatchers: NodeMatcher[] = [
    // Always include products matcher
    (threeNode) => {
      if (allNodePlacement.includes(threeNode.name)) {
        return <ProductNode ... />;
      }
      return undefined;
    },
  ];
  
  // Conditionally add annotation matcher
  if (process.env.NODE_ENV === 'development') {
    nodeMatchers.push((threeNode) => {
      if (threeNode.name.startsWith("Debug_")) {
        return <DebugNode ... />;
      }
      return undefined;
    });
  }
  
  return nodeMatchers;
};
```

**Lợi ích:**
- ✅ Có thể thêm matchers dựa trên conditions
- ✅ Development vs Production có thể khác nhau
- ✅ Flexible configuration

---

### 7. Composition - Kết Hợp Nhiều Matchers

**Có thể combine nhiều matcher sources:**

```typescript
// ProductsNodes.tsx
export const ProductsNodes = () => {
  const productMatchers = createProductMatchers();
  const annotationMatchers = createAnnotationMatchers();
  const filterMatchers = createFilterMatchers();
  
  // Combine tất cả matchers
  const nodeMatchers: NodeMatcher[] = [
    ...productMatchers,
    ...annotationMatchers,
    ...filterMatchers,
  ];
  
  return nodeMatchers;
};
```

**Lợi ích:**
- ✅ Có thể combine từ nhiều sources
- ✅ Modular design
- ✅ Dễ maintain

---

## So Sánh: Array vs Single Function

### Option 1: Array (Hiện Tại) ✅

```typescript
const nodeMatchers: NodeMatcher[] = [
  (threeNode) => { ... }
];

// GLTFNode
for (let i = 0; i < nodeMatchers.length; i++) {
  const jsx = nodeMatchers[i](threeNode);
  if (jsx) return jsx;
}
```

**Lợi ích:**
- ✅ Flexible - dễ thêm matchers
- ✅ Extensible - không cần sửa code cũ
- ✅ Consistent pattern
- ✅ Priority system
- ✅ Conditional matchers

**Nhược điểm:**
- ⚠️ Overhead nhỏ (loop, array)

---

### Option 2: Single Function ❌

```typescript
const nodeMatcher: NodeMatcher = (threeNode) => { ... };

// GLTFNode
if (nodeMatcher) {
  const jsx = nodeMatcher(threeNode);
  if (jsx) return jsx;
}
```

**Lợi ích:**
- ✅ Đơn giản hơn (không cần loop)
- ✅ Ít overhead

**Nhược điểm:**
- ❌ Không flexible - khó thêm matchers
- ❌ Phải sửa code khi thêm matcher mới
- ❌ Không có priority system
- ❌ Không có conditional matchers

---

## Ví Dụ Thực Tế: Thêm Matcher Mới

### Scenario: Thêm Annotation Matcher

**Với Array Pattern (Dễ):**
```typescript
// ProductsNodes.tsx
export const ProductsNodes = () => {
  const allNodePlacement = PlacementManager.getAllPlacement();

  const nodeMatchers: NodeMatcher[] = [
    // Existing matcher
    (threeNode) => {
      if (allNodePlacement.includes(threeNode.name)) {
        return <ProductNode ... />;
      }
      return undefined;
    },
    
    // ✅ Thêm matcher mới - không cần sửa code cũ
    (threeNode) => {
      if (threeNode.name.startsWith("Annotation_")) {
        return <AnnotationNode ... />;
      }
      return undefined;
    },
  ];

  return nodeMatchers;
};
```

**Với Single Function (Khó):**
```typescript
// ❌ Phải sửa function cũ
const nodeMatcher = (threeNode) => {
  // Check products
  if (allNodePlacement.includes(threeNode.name)) {
    return <ProductNode ... />;
  }
  
  // Check annotations
  if (threeNode.name.startsWith("Annotation_")) {
    return <AnnotationNode ... />;
  }
  
  return undefined;
};
```

**Vấn đề:**
- ❌ Phải sửa function cũ
- ❌ Logic phức tạp hơn
- ❌ Khó maintain

---

## Design Pattern: Strategy Pattern

**Array of matchers là implementation của Strategy Pattern:**

```typescript
// Strategy Pattern
const strategies: Strategy[] = [
  strategy1,
  strategy2,
  strategy3,
];

// Apply strategies
for (const strategy of strategies) {
  const result = strategy.execute();
  if (result) return result;
}
```

**Tương tự:**
```typescript
// Node Matcher Pattern
const matchers: NodeMatcher[] = [
  matcher1,
  matcher2,
  matcher3,
];

// Apply matchers
for (const matcher of matchers) {
  const jsx = matcher(threeNode);
  if (jsx) return jsx;
}
```

**Lợi ích:**
- ✅ Flexible - dễ thêm strategies
- ✅ Extensible - không cần sửa code cũ
- ✅ Testable - test từng strategy riêng

---

## Kết Luận

### Tại Sao Cần Array?

1. **Flexibility** - Có thể thêm nhiều matchers
2. **Extensibility** - Dễ mở rộng mà không sửa code cũ
3. **Pattern Consistency** - Giữ pattern nhất quán
4. **Priority System** - Sắp xếp theo độ ưu tiên
5. **Conditional Matchers** - Thêm/bớt dựa trên điều kiện
6. **Composition** - Kết hợp nhiều matcher sources
7. **Design Pattern** - Strategy Pattern

### Hiện Tại vs Tương Lai

**Hiện tại:**
```typescript
const nodeMatchers = [
  (threeNode) => { /* Products */ }
];  // 1 matcher
```

**Tương lai (có thể):**
```typescript
const nodeMatchers = [
  (threeNode) => { /* Products */ },
  (threeNode) => { /* Annotations */ },
  (threeNode) => { /* Filters */ },
  (threeNode) => { /* Custom */ },
];  // Nhiều matchers
```

**Với array pattern:**
- ✅ Chỉ cần thêm vào array
- ✅ Không cần sửa GLTFNode
- ✅ Không cần sửa code cũ

---

## Tóm Tắt

**Câu trả lời ngắn gọn:**

1. **Flexibility** - Dễ thêm matchers mới
2. **Extensibility** - Không cần sửa code cũ
3. **Pattern** - Giữ pattern nhất quán
4. **Future-proof** - Sẵn sàng cho tương lai

**Mặc dù hiện tại chỉ có 1 matcher, nhưng pattern này cho phép:**
- ✅ Thêm matchers mới dễ dàng
- ✅ Không phá vỡ code cũ
- ✅ Maintainable và scalable

**Đây là best practice trong software design: "Design for the future, not just the present"**

