# Card vs Element - Thông Tin Về Placement Node

## 📋 Tổng Quan

**Câu hỏi:** Trong card có thông tin về placement node mà device sẽ được gắn lên không? Hay chỉ có element mới có?

**Trả lời:** 
- ❌ **Card KHÔNG có thông tin về placement node**
- ✅ **Chỉ Element mới có thông tin về placement node**

---

## 🔍 Chi Tiết

### 1. Card (UI Layer) - KHÔNG Có Placement Node

**Card là gì?**
- Card là **UI representation** của một sản phẩm
- Card chứa thông tin để **hiển thị trong giao diện người dùng**
- Card được lưu trong **Redux store** (plain JavaScript object)

**Card chứa gì?**
```typescript
interface CardI {
  key: StepName;                    // Step name
  image?: string;                   // Hình ảnh sản phẩm
  logo?: string;                    // Logo
  subtitle?: string;                // Phụ đề
  description?: string;             // Mô tả
  counter?: CounterI;               // Counter config
  select?: SelectI;                 // Select config
  keyPermission: string;            // ⭐ Key permission (ví dụ: "RallyBoardMount")
  dataThreekit: {
    attributeName: string;
    threekitItems: typeThreekitValue;  // ⭐ Chứa assetId
  };
}
```

**Card KHÔNG chứa:**
- ❌ Placement node name
- ❌ Vị trí mount
- ❌ Business logic về placement

**Ví dụ Card:**
```json
{
  "deviceId": "rallyboard-mount",
  "keyPermission": "RallyBoardMount",  // ⭐ Chỉ có keyPermission
  "step": "Conference Camera",
  "assetId": "rallyboard-mount-asset-1",  // ⭐ Chỉ có assetId
  "attributeName": "RallyBoardMount"
}
```

---

### 2. Element (Permission System) - CÓ Placement Node

**Element là gì?**
- Element là **business logic layer** của một sản phẩm
- Element chứa thông tin về **placement, dependencies, rules**
- Element là **JavaScript class instance** (KHÔNG lưu trong Redux)

**Element chứa gì?**
```typescript
class ItemElement {
  name: string;                     // ⭐ keyPermission (ví dụ: "RallyBoardMount")
  defaultMount: MountElement;       // ⭐ CHỨA PLACEMENT NODE NAME
  // ... other properties
}

class MountElement {
  name: string;                     // Element name
  nodeName: string;                 // ⭐ PLACEMENT NODE NAME (ví dụ: "Device_Mount")
  // ... other properties
}
```

**Element CÓ chứa:**
- ✅ Placement node name (trong `defaultMount.nodeName`)
- ✅ Vị trí mount
- ✅ Business logic về placement

**Ví dụ Element:**
```typescript
// permissionUtils.ts hoặc deviceElements.json
{
  "keyPermission": "RallyBoardMount",  // ⭐ Khớp với card.keyPermission
  "placementManagerMethod": {
    "method": "getNameNodeForDeviceMount",  // ⭐ Trả về "Device_Mount"
    "args": []
  }
}
```

---

## 🔗 Kết Nối: Card → Element → Placement Node

### Flow Hoạt Động

```
1. User click Card trong UI
   ↓
2. Card có keyPermission = "RallyBoardMount"
   ↓
3. Middleware tìm Element từ Permission System
   ↓
   element = step.getElementByName("RallyBoardMount")
   ↓
4. Element có defaultMount với nodeName
   ↓
   nodeName = element.getMount().getNameNode()
   // nodeName = "Device_Mount"
   ↓
5. Tạo mapping trong Redux
   ↓
   setElementByNameNode(assetId, nodeName)
   // Redux: { "Device_Mount": "rallyboard-mount-asset-1" }
   ↓
6. ProductNode tìm placement node "Device_Mount"
   ↓
7. Render Product tại placement node
```

---

## 📊 So Sánh: Card vs Element

| Tiêu chí | Card | Element |
|----------|------|---------|
| **Layer** | UI Layer | Business Logic Layer |
| **Chứa placement node?** | ❌ KHÔNG | ✅ CÓ |
| **Chứa assetId?** | ✅ CÓ | ❌ KHÔNG |
| **Chứa keyPermission?** | ✅ CÓ | ✅ CÓ |
| **Lưu trong Redux?** | ✅ CÓ | ❌ KHÔNG |
| **Lưu ở đâu?** | Redux store | Permission System (memory) |
| **Mục đích** | Hiển thị UI | Business logic, placement rules |

---

## 🎯 Tại Sao Card Không Có Placement Node?

### 1. Separation of Concerns

- **Card** = UI concerns (hiển thị, tương tác)
- **Element** = Business logic concerns (placement, dependencies, rules)

### 2. Flexibility

- Một **Card** có thể có nhiều **Element** với placement nodes khác nhau
- Một **Element** có thể có nhiều **Mount** (defaultMount, dependenceMount, bundleMount)

### 3. Reusability

- **Card** có thể được tái sử dụng cho nhiều placement scenarios
- **Element** định nghĩa cụ thể placement cho từng scenario

---

## 📝 Ví Dụ Cụ Thể

### Card (deviceCards.json)

```json
{
  "deviceId": "rallyboard-mount",
  "keyPermission": "RallyBoardMount",  // ⭐ Chỉ có keyPermission
  "step": "Conference Camera",
  "assetId": "rallyboard-mount-asset-1",  // ⭐ Chỉ có assetId
  "attributeName": "RallyBoardMount"
}
```

**Card KHÔNG biết:**
- ❌ Device sẽ được mount ở đâu
- ❌ Placement node name là gì

---

### Element (deviceElements.json)

```json
{
  "keyPermission": "RallyBoardMount",  // ⭐ Khớp với card.keyPermission
  "placementManagerMethod": {
    "method": "getNameNodeForDeviceMount",  // ⭐ Trả về "Device_Mount"
    "args": []
  }
}
```

**Element BIẾT:**
- ✅ Device sẽ được mount ở placement node "Device_Mount"
- ✅ Placement node được tạo tại center của TV

---

## ✅ Tóm Tắt

### Câu Hỏi 1: Card có thông tin về placement node không?

**Trả lời:** ❌ **KHÔNG**

- Card chỉ chứa `keyPermission` và `assetId`
- Card KHÔNG biết device sẽ được mount ở đâu
- Card là UI layer, không chứa business logic về placement

---

### Câu Hỏi 2: Element có thông tin về placement node không?

**Trả lời:** ✅ **CÓ**

- Element chứa `defaultMount` với `nodeName`
- Element biết device sẽ được mount ở placement node nào
- Element là business logic layer, chứa thông tin về placement

---

### Flow Kết Nối

```
Card (UI)
  ↓ keyPermission
Element (Business Logic)
  ↓ nodeName
Placement Node (3D Scene)
  ↓ assetId
Product (3D Model)
```

**Kết luận:**
- **Card** → Chỉ có `keyPermission` và `assetId`
- **Element** → Có `nodeName` (placement node name)
- **Placement Node** → Vị trí thực tế trong 3D scene
- **Product** → 3D model được render tại placement node

