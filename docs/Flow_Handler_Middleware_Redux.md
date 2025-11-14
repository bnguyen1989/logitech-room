# Flow: Handler → Middleware → Redux - Giải Thích Đơn Giản

## Tổng Quan Flow

```
Handler Listen Event → Dispatch Action → Middleware Intercept → Reducer Update State
```

---

## Chi Tiết Từng Bước

### Bước 1: Handler Listen Event Emitter

**File:** `src/store/slices/ui/handlers/handlers.ts`

```typescript
export const getUiHandlers = (store: Store) => {
  // ⭐ BƯỚC 1: Listen event "executeCommand"
  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      // ⭐ BƯỚC 2: Dispatch action
      store.dispatch(addActiveCard({ key: data.keyItemPermission }));
    }
  });
};
```

**Chức năng:**
- Handler là **event listener** - lắng nghe event từ `app.eventEmitter`
- Khi có event `"executeCommand"` → check nếu là `AddItemCommand`
- Dispatch action `addActiveCard()` vào Redux store

**Khi nào xảy ra:**
- User click card → `app.addItemConfiguration()` → tạo `AddItemCommand` → emit event `"executeCommand"`

---

### Bước 2: Dispatch Action Vào Redux Store

**File:** `src/store/slices/ui/handlers/handlers.ts` (line 106)

```typescript
store.dispatch(addActiveCard({ key: data.keyItemPermission }));
//                ↑
//         Action creator function
//         → Tạo action object: { type: "ui/addActiveCard", payload: { key: "RallyBoard" } }
```

**Chức năng:**
- `addActiveCard()` là action creator (function từ Redux Toolkit)
- Tạo action object: `{ type: "ui/addActiveCard", payload: { key: "RallyBoard" } }`
- Dispatch action vào Redux store

**Action object:**
```typescript
{
  type: "ui/addActiveCard",  // Action type
  payload: { key: "RallyBoard" }  // Data
}
```

---

### Bước 3: Middleware Intercept Action (Trước Khi Đến Reducer)

**File:** `src/store/middleware/index.ts`

```typescript
export const middleware: Middleware =
  (store: any) => (next) => async (action: any) => {
    // ⭐ BƯỚC 3: Intercept action TRƯỚC khi đến reducer
    switch (action.type) {
      case UI_ACTION_NAME.ADD_ACTIVE_CARD: {  // "ui/addActiveCard"
        const { key } = action.payload;
        
        // ⭐ Xử lý logic TRƯỚC reducer
        const permission = getPermission(activeStep)(state);
        if (!permission.canAddActiveElementByName(key)) return;
        
        updateDataCardByStepName(activeStep)(store, currentConfigurator);
        break;
      }
    }

    // ⭐ BƯỚC 3 (tiếp): Cho action đi tiếp đến reducer
    const res = next(action);
    //               ↑
    //        Gọi reducer để update state
    
    // ⭐ BƯỚC 3 (tiếp): Xử lý logic SAU reducer
    state = store.getState();
    switch (action.type) {
      case UI_ACTION_NAME.ADD_ACTIVE_CARD: {
        // Xử lý sau khi state đã update
        updateNodesByConfiguration(...);
        break;
      }
    }
  };
```

**Chức năng:**
- Middleware **intercept** action TRƯỚC khi đến reducer
- Xử lý logic trước (validate, permission check, etc.)
- Gọi `next(action)` để action đi tiếp đến reducer
- Xử lý logic sau (update nodes, etc.)

**Khi nào xảy ra:**
- Mỗi khi có action dispatch → middleware được gọi tự động

---

### Bước 4: Reducer Update State

**File:** `src/store/slices/ui/Ui.slice.ts`

```typescript
const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // ⭐ BƯỚC 4: Reducer nhận action và update state
    addActiveCard: (state, action: PayloadAction<{ key: string }>) => {
      const { activeStep } = state;
      const { key } = action.payload;
      
      // ⭐ Update state
      const stepData = state.selectedData[activeStep] ?? {};
      const cardData = stepData[key] ?? {
        selected: [],
        property: {},
      };
      
      if (!cardData.selected.some((item) => item === key)) {
        cardData.selected.push(key);
      }
      
      state.selectedData[activeStep] = {
        ...stepData,
        [key]: cardData,
      };
    },
  },
});
```

**Chức năng:**
- Reducer nhận action từ middleware (qua `next(action)`)
- Update Redux state dựa trên action type và payload
- Return state mới

**Kết quả:**
- Redux state được update: `state.ui.selectedData[activeStep][key].selected.push(key)`

---

## Flow Hoàn Chỉnh (Từ Đầu Đến Cuối)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Click Card                                          │
│    CardItem.tsx → app.addItemConfiguration()                │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Application Execute Command                              │
│    Application.ts → executeCommand()                        │
│    → emit event "executeCommand"                            │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Handler Listen Event                                     │
│    handlers.ts → app.eventEmitter.on("executeCommand")      │
│    → check if AddItemCommand                                │
│    → store.dispatch(addActiveCard(...)) ⭐                  │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Action Đi Qua Middleware (TRƯỚC reducer)                │
│    middleware/index.ts                                      │
│    → switch (action.type) {                                 │
│        case "ui/addActiveCard":                             │
│          // Xử lý logic trước                               │
│          updateDataCardByStepName(...)                      │
│      }                                                       │
│    → next(action) ⭐ (cho action đi tiếp)                   │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Reducer Update State                                     │
│    Ui.slice.ts → addActiveCard reducer                      │
│    → state.selectedData[activeStep][key].selected.push(key) │
│    → Return state mới                                       │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Middleware Xử Lý Logic SAU Reducer                      │
│    middleware/index.ts                                      │
│    → state = store.getState() (state đã được update)       │
│    → updateNodesByConfiguration(...)                        │
│    → map assetId → nodeName                                 │
└──────────────────┬──────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Components Re-render                                     │
│    React components subscribe Redux state                   │
│    → Auto re-render khi state thay đổi                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Kết Nối Giữa Handler, Middleware, và Redux

### 1. Handler → Redux Store

```typescript
// handlers.ts
export const getUiHandlers = (store: Store) => {
  app.eventEmitter.on("executeCommand", (data) => {
    // ⭐ Handler có reference đến store
    store.dispatch(addActiveCard({ key: data.keyItemPermission }));
    //     ↑
    //  Dispatch action trực tiếp vào store
  });
};
```

**Kết nối:**
- Handler nhận `store` làm parameter
- Handler có thể `dispatch` action trực tiếp

---

### 2. Middleware → Redux Store

```typescript
// store/index.ts
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    configurator: configuratorReducer,
    // ...
  },
  // ⭐ Middleware được connect vào store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});
```

**Kết nối:**
- Middleware được **connect vào Redux store** khi configure store
- Mọi action dispatch → đều đi qua middleware trước khi đến reducer

---

### 3. Redux Store → Components

```typescript
// Component subscribe Redux state
const isActiveCard = useAppSelector(
  getIsSelectedCardByKeyPermission(activeStep, keyItemPermission)
);
//     ↑
//  Component subscribe Redux state
//  → Auto re-render khi state thay đổi
```

**Kết nối:**
- Components subscribe Redux state qua `useAppSelector`
- Khi Redux state thay đổi → components tự động re-render

---

## Tóm Tắt Ngắn Gọn

### 1️⃣ Handler (Event Listener)
- **Vai trò:** Lắng nghe event từ `app.eventEmitter`
- **Khi nào:** Khi có event `"executeCommand"`
- **Làm gì:** Dispatch action vào Redux store

### 2️⃣ Dispatch Action
- **Vai trò:** Tạo action object và gửi vào Redux store
- **Action:** `{ type: "ui/addActiveCard", payload: { key: "RallyBoard" } }`

### 3️⃣ Middleware (Interceptor)
- **Vai trò:** Intercept action TRƯỚC và SAU reducer
- **Khi nào:** Mọi action dispatch đều đi qua middleware
- **Làm gì:** 
  - Xử lý logic trước reducer (validate, permission)
  - Gọi `next(action)` để action đi tiếp
  - Xử lý logic sau reducer (update nodes)

### 4️⃣ Reducer (State Updater)
- **Vai trò:** Update Redux state
- **Khi nào:** Sau khi middleware gọi `next(action)`
- **Làm gì:** Nhận action → update state → return state mới

### 5️⃣ Components Re-render
- **Vai trò:** Hiển thị UI dựa trên Redux state
- **Khi nào:** Khi Redux state thay đổi
- **Làm gì:** Auto re-render với state mới

---

## Ví Dụ Cụ Thể

### User Click Card "RallyBoard":

```
1. User click card
   ↓
2. CardItem.tsx → app.addItemConfiguration("RallyBoard", "asset-id", "RallyBoard")
   ↓
3. Application.ts → executeCommand(AddItemCommand)
   → emit event "executeCommand"
   ↓
4. handlers.ts → app.eventEmitter.on("executeCommand")
   → check if AddItemCommand ✅
   → store.dispatch(addActiveCard({ key: "RallyBoard" })) ⭐
   ↓
5. Middleware intercept action
   → switch (action.type) {
       case "ui/addActiveCard":
         // Validate permission
         updateDataCardByStepName(...)
     }
   → next(action) ⭐ (cho action đi tiếp)
   ↓
6. Reducer update state
   → addActiveCard reducer
   → state.selectedData["ConferenceCamera"]["RallyBoard"].selected.push("RallyBoard")
   → Return state mới
   ↓
7. Middleware xử lý logic sau
   → updateNodesByConfiguration(...)
   → map assetId → nodeName
   ↓
8. Components re-render
   → Card hiển thị là active ✅
```

---

## Lưu Ý Quan Trọng

- ⚠️ **Handler chỉ là event listener** - không phải Redux middleware
- ⚠️ **Middleware được connect vào Redux store** khi configure store
- ⚠️ **Mọi action dispatch đều đi qua middleware** trước khi đến reducer
- ✅ **Handler dispatch action** → **Middleware intercept** → **Reducer update state**
- ✅ **Middleware có 2 phần:** Xử lý TRƯỚC và SAU reducer

---

## File Quan Trọng

1. **`handlers.ts`** - Event listener, dispatch action
2. **`store/index.ts`** - Configure store với middleware
3. **`middleware/index.ts`** - Intercept action, xử lý logic
4. **`Ui.slice.ts`** - Reducer update state

---

## Kết Luận

**Flow đơn giản:**
1. Handler listen event → dispatch action
2. Action đi qua middleware (xử lý logic)
3. Middleware gọi `next(action)` → action đến reducer
4. Reducer update Redux state
5. Components re-render với state mới

**Kết nối:**
- Handler → Store: Handler có reference đến store, dispatch trực tiếp
- Middleware → Store: Middleware được connect vào store khi configure
- Store → Components: Components subscribe Redux state qua `useAppSelector`

