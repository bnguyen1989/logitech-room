# Flow Chi Tiết: AssetId Được Map Vào Redux Store

## Tổng Quan

Flow này giải thích chi tiết cách `assetId` từ Card được map vào Redux store thông qua `nodeName` từ MountElement.

---

## Flow Hoàn Chỉnh: Từ User Click Đến Redux Store Update

### Bước 1: User Click Card → CardItem.tsx

**File:** `src/components/Cards/CardItem/CardItem.tsx`

```typescript
const handleClick = () => {
  if (isActiveCard && card.keyPermission) {
    app.removeItem(attributeName, card.keyPermission);
    return;
  }

  // ⭐ BƯỚC 1: Gọi app.addItemConfiguration()
  app.addItemConfiguration(
    attributeName,        // "RallyBoardWall"
    threekitAsset.id,    // "rallyboard-wall-tap-asset-1" (assetId từ card)
    card.keyPermission   // "RallyBoardWall"
  );
};
```

**Input:**
- `attributeName`: `"RallyBoardWall"`
- `threekitAsset.id`: `"rallyboard-wall-tap-asset-1"` (assetId từ card config)
- `card.keyPermission`: `"RallyBoardWall"`

**Output:**
- Gọi `Application.addItemConfiguration()`

---

### Bước 2: Application.addItemConfiguration() → AddItemCommand

**File:** `src/models/Application.ts`

```typescript
public addItemConfiguration(
  nameProperty: string,
  assetId: string,
  keyItemPermission: string
): Promise<boolean> {
  return this.executeCommand(
    new AddItemCommand(
      this.currentConfigurator,
      nameProperty,        // "RallyBoardWall"
      assetId,            // "rallyboard-wall-tap-asset-1"
      keyItemPermission   // "RallyBoardWall"
    )
  );
}
```

**AddItemCommand được tạo:**
```typescript
// src/models/command/AddItemCommand.ts
export class AddItemCommand extends ItemCommand {
  public name: string = "AddItemCommand";
  public assetId: string;           // "rallyboard-wall-tap-asset-1"
  public nameProperty: string;      // "RallyBoardWall"
  public keyItemPermission: string; // "RallyBoardWall"

  constructor(
    configurator: Configurator,
    nameProperty: string,
    assetId: string,
    keyItemPermission: string
  ) {
    super(configurator, keyItemPermission);
    this.assetId = assetId;           // ⭐ Lưu assetId vào command
    this.nameProperty = nameProperty;
  }
}
```

**Kết quả:**
- `AddItemCommand` được tạo với `assetId = "rallyboard-wall-tap-asset-1"`
- Command được execute bởi `Application.executeCommand()`

---

### Bước 3: Application.executeCommand() → Emit Event

**File:** `src/models/Application.ts`

```typescript
public executeCommand(command: Command): Promise<boolean> {
  this.eventEmitter.emit("configuratorProcessing", true);
  return new Promise((resolve) => {
    command.execute().then((res) => {
      this.eventEmitter.emit("configuratorProcessing", false);
      if (!res) {
        resolve(false);
        return;
      }

      return new ConfigurationConstraintHandler(
        this.currentConfigurator,
        this.dataTableLevel1,
        this.dataTableLevel2
      )
        .handle()
        .then(() => {
          // ⭐ BƯỚC 3: Emit event "executeCommand" với AddItemCommand
          this.eventEmitter.emit("executeCommand", command);
          logger.log("ExecuteCommand", command);
          return resolve(true);
        });
    });
  });
}
```

**Kết quả:**
- Event `"executeCommand"` được emit với `AddItemCommand` object
- Redux middleware lắng nghe event này

---

### Bước 4: Redux Middleware Listen Event → addElement()

**File:** `src/store/slices/ui/handlers/handlers.ts`

```typescript
app.eventEmitter.on("executeCommand", (data) => {
  if (data instanceof AddItemCommand) {
    // ⭐ BƯỚC 4: Dispatch Redux action
    store.dispatch(addActiveCard({ key: data.keyItemPermission }));
    // data.keyItemPermission = "RallyBoardWall"
  }
});
```

**Redux Action:**
```typescript
// addActiveCard action được dispatch
// → Redux store được cập nhật với active card
```

**Sau đó, middleware khác lắng nghe và gọi addElement():**

**File:** `src/store/middleware/index.ts`

```typescript
// Middleware lắng nghe Redux actions và gọi addElement()
if (action.type === "ui/addActiveCard") {
  const card = getCardByKeyPermission(stepName, keyPermission)(store.getState());
  if (card) {
    // ⭐ BƯỚC 4 (tiếp): Gọi addElement()
    addElement(card, stepName)(store);
  }
}
```

**Input:**
- `card`: Card object với `keyPermission = "RallyBoardWall"`
- `stepName`: `StepName.ConferenceCamera`

---

### Bước 5: addElement() → Lấy AssetId Từ Card

**File:** `src/store/slices/configurator/handlers/handlers.ts`

```typescript
export function addElement(
  card: CardI,
  stepName: StepName,
  countValue?: number
) {
  return (store: Store) => {
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();
    
    // ⭐ BƯỚC 5: Lấy assetId từ card
    const cardAsset = getAssetFromCard(card)(state);
    // cardAsset = { id: "rallyboard-wall-tap-asset-1", ... }
    
    console.log("🔵 [addElement] Called for:", card.keyPermission, {
      cardAssetId: cardAsset?.id,  // "rallyboard-wall-tap-asset-1"
      stepName,
    });
```

**getAssetFromCard() hoạt động như thế nào:**

**File:** `src/store/slices/ui/selectors/selectors.ts`

```typescript
export const getAssetFromCard = (card: CardI) => (state: RootState) => {
  const threekitItems = card.dataThreekit.threekitItems;
  const keyPermission = card.keyPermission;  // "RallyBoardWall"
  const stepName = card.key;

  const data = getSelectedDataByKeyPermission(stepName, keyPermission)(state);
  if (!data) return threekitItems[keyPermission];
  
  // ... xử lý select, color, etc. ...
  
  // ⭐ Trả về asset từ threekitItems
  if (threekitItems[keyPermission]) return threekitItems[keyPermission];
  return threekitItems[Object.keys(threekitItems)[0]];
};
```

**Card structure:**
```typescript
const card: CardI = {
  keyPermission: "RallyBoardWall",
  dataThreekit: {
    threekitItems: {
      RallyBoardWall: {
        id: "rallyboard-wall-tap-asset-1",  // ⭐ AssetId ở đây
        assetId: "rallyboard-wall-tap-asset-1",
        key: "RallyBoardWall",
        name: "RallyBoardWall",
        // ... other properties ...
      },
    },
  },
};
```

**Kết quả:**
- `cardAsset.id = "rallyboard-wall-tap-asset-1"` (assetId)

---

### Bước 6: addElement() → Lấy Element Từ Permission

**File:** `src/store/slices/configurator/handlers/handlers.ts`

```typescript
// ⭐ BƯỚC 6: Lấy Element từ Permission
const element = step.getElementByName(card.keyPermission);
// element = ItemElement("RallyBoardWall")

if (!element) {
  console.warn("⚠️ [addElement] Element not found:", card.keyPermission);
  return;
}
```

**Element được tạo từ permissionUtils.ts:**
```typescript
// src/utils/permissionUtils.ts
const groupRallyBoardWall = new GroupElement().addElement(
  new ItemElement("RallyBoardWall").setDefaultMount(
    new MountElement(
      "RallyBoardWall",
      PlacementManager.getNameNodeForTap("Wall", 1)  // → "Tap_Placement_Wall_1"
    )
  )
);
```

**Kết quả:**
- `element = ItemElement("RallyBoardWall")` với `defaultMount = MountElement("RallyBoardWall", "Tap_Placement_Wall_1")`

---

### Bước 7: addElement() → Lấy MountElement và nodeName

**File:** `src/store/slices/configurator/handlers/handlers.ts`

```typescript
if (element instanceof ItemElement) {
  // ⭐ BƯỚC 7: Lấy defaultMount từ Element
  const defaultMount = element.getDefaultMount();
  // defaultMount = MountElement("RallyBoardWall", "Tap_Placement_Wall_1")
  
  if (defaultMount instanceof MountElement) {
    const dependentMount = defaultMount.getDependentMount();
    if (!dependentMount) {
      // ⭐ BƯỚC 7 (tiếp): Lấy nodeName từ MountElement
      const nodeName = defaultMount.getNameNode();
      // nodeName = "Tap_Placement_Wall_1" (string)
      
      console.log("✅ [addElement] Setting node mapping:", {
        nodeName,                    // "Tap_Placement_Wall_1"
        assetId: cardAsset.id,      // "rallyboard-wall-tap-asset-1"
        keyPermission: card.keyPermission,  // "RallyBoardWall"
      });
```

**MountElement.getNameNode():**
```typescript
// src/models/permission/elements/mounts/MountElement.ts
public getNameNode(): string {
  return this.nodeName;  // "Tap_Placement_Wall_1"
}
```

**Kết quả:**
- `nodeName = "Tap_Placement_Wall_1"` (string)
- `cardAsset.id = "rallyboard-wall-tap-asset-1"` (assetId)

---

### Bước 8: setElementByNameNode() → Map Vào Redux Store

**File:** `src/store/slices/configurator/handlers/handlers.ts`

```typescript
// ⭐ BƯỚC 8: Map assetId và nodeName vào Redux store
store.dispatch(changeStatusProcessing(true));
setElementByNameNode(cardAsset.id, nodeName)(store);
```

**setElementByNameNode() function:**
```typescript
// src/store/slices/configurator/handlers/handlers.ts
function setElementByNameNode(assetId: string, nameNode: string) {
  return (store: Store) => {
    // ⭐ BƯỚC 8 (tiếp): Dispatch Redux action
    store.dispatch(
      changeValueNodes({
        [nameNode]: assetId,  // { "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1" }
      })
    );
  };
}
```

**Redux Action:**
```typescript
// src/store/slices/configurator/Configurator.slice.ts
changeValueNodes: (
  state,
  action: PayloadAction<Record<string, string>>
) => {
  // ⭐ BƯỚC 8 (tiếp): Cập nhật Redux store
  state.nodes = { ...state.nodes, ...action.payload };
  // state.nodes = {
  //   ...existingNodes,
  //   "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1"
  // }
}
```

**Kết quả:**
- Redux store được cập nhật:
  ```typescript
  state.configurator.nodes = {
    "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1",
    // ... other mappings ...
  }
  ```

---

### Bước 9: ProductNode Detect Mapping → Render Product

**File:** `src/components/Assets/ProductNode.tsx`

```typescript
export const ProductNode: FC<ProductProps> = ({ nameNode, parentNode }) => {
  // ⭐ BƯỚC 9: Lấy mapping từ Redux store
  const attachNodeNameToAssetId = useAppSelector(getNodes);
  // attachNodeNameToAssetId = {
  //   "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1",
  //   // ... other mappings ...
  // }

  // Kiểm tra xem có mapping cho nameNode không
  if (!Object.keys(attachNodeNameToAssetId).includes(nameNode)) {
    return undefined;  // Không có mapping → không render
  }

  // ⭐ BƯỚC 9 (tiếp): Render Product component
  return (
    <Product
      parentNode={parentNode}  // Placement node từ GLTF
      configuration={configuration[nameNode]}
      productAssetId={attachNodeNameToAssetId[nameNode]}  // "rallyboard-wall-tap-asset-1"
      highlight={isHighlightNode}
      popuptNode={isPopuptNode}
      callbackDisableHighlight={callbackDisableHighlight}
      callbackOnHighlight={callbackOnHighlight}
      callbackDisablePopuptNodes={callbackDisablePopuptNodes}
      callbackOnPopuptNodes={callbackOnPopuptNodes}
      nameNode={nameNode}  // "Tap_Placement_Wall_1"
    />
  );
};
```

**Kết quả:**
- Product component được render với `productAssetId = "rallyboard-wall-tap-asset-1"`

---

## Tóm Tắt Flow

```
1. User Click Card
   ↓
   app.addItemConfiguration(
     attributeName: "RallyBoardWall",
     assetId: "rallyboard-wall-tap-asset-1",  // ⭐ AssetId từ card
     keyPermission: "RallyBoardWall"
   )
   ↓
2. AddItemCommand được tạo
   ↓
   AddItemCommand.assetId = "rallyboard-wall-tap-asset-1"
   ↓
3. Application.executeCommand() → Emit event "executeCommand"
   ↓
4. Redux middleware listen event → addElement(card, stepName)
   ↓
5. addElement() → getAssetFromCard(card)
   ↓
   cardAsset.id = "rallyboard-wall-tap-asset-1"  // ⭐ AssetId từ card
   ↓
6. addElement() → step.getElementByName("RallyBoardWall")
   ↓
   element = ItemElement("RallyBoardWall")
   ↓
7. addElement() → element.getDefaultMount().getNameNode()
   ↓
   nodeName = "Tap_Placement_Wall_1"  // ⭐ NodeName từ MountElement
   ↓
8. setElementByNameNode(assetId, nodeName)
   ↓
   store.dispatch(changeValueNodes({
     "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1"  // ⭐ Mapping
   }))
   ↓
9. Redux Store Updated
   ↓
   state.configurator.nodes = {
     "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1"
   }
   ↓
10. ProductNode detect mapping → Render Product
    ↓
    <Product productAssetId="rallyboard-wall-tap-asset-1" />
```

---

## Điểm Quan Trọng

### 1. AssetId Đến Từ Đâu?

**AssetId đến từ Card config:**
```typescript
const card: CardI = {
  keyPermission: "RallyBoardWall",
  dataThreekit: {
    threekitItems: {
      RallyBoardWall: {
        id: "rallyboard-wall-tap-asset-1",  // ⭐ AssetId ở đây
        assetId: "rallyboard-wall-tap-asset-1",
        // ...
      },
    },
  },
};
```

**getAssetFromCard() trích xuất assetId:**
```typescript
const cardAsset = getAssetFromCard(card)(state);
// cardAsset.id = "rallyboard-wall-tap-asset-1"
```

### 2. NodeName Đến Từ Đâu?

**NodeName đến từ MountElement:**
```typescript
// permissionUtils.ts
new MountElement(
  "RallyBoardWall",
  PlacementManager.getNameNodeForTap("Wall", 1)  // → "Tap_Placement_Wall_1"
)
```

**MountElement.getNameNode() trả về nodeName:**
```typescript
const nodeName = defaultMount.getNameNode();
// nodeName = "Tap_Placement_Wall_1"
```

### 3. Mapping Được Tạo Như Thế Nào?

**setElementByNameNode() tạo mapping:**
```typescript
setElementByNameNode(cardAsset.id, nodeName)(store);
// cardAsset.id = "rallyboard-wall-tap-asset-1"
// nodeName = "Tap_Placement_Wall_1"
// → Mapping: { "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1" }
```

**Redux action cập nhật store:**
```typescript
store.dispatch(changeValueNodes({
  "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1"
}));
// → state.configurator.nodes["Tap_Placement_Wall_1"] = "rallyboard-wall-tap-asset-1"
```

### 4. ProductNode Sử Dụng Mapping Như Thế Nào?

**ProductNode lấy mapping từ Redux:**
```typescript
const attachNodeNameToAssetId = useAppSelector(getNodes);
// attachNodeNameToAssetId = {
//   "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1"
// }

// Kiểm tra mapping
if (attachNodeNameToAssetId[nameNode]) {
  // Render Product với assetId
  <Product productAssetId={attachNodeNameToAssetId[nameNode]} />
}
```

---

## Code Snippets Chi Tiết

### 1. getAssetFromCard() - Trích Xuất AssetId

```typescript
// src/store/slices/ui/selectors/selectors.ts
export const getAssetFromCard = (card: CardI) => (state: RootState) => {
  const threekitItems = card.dataThreekit.threekitItems;
  const keyPermission = card.keyPermission;  // "RallyBoardWall"
  
  // Lấy asset từ threekitItems
  if (threekitItems[keyPermission]) {
    return threekitItems[keyPermission];
    // → { id: "rallyboard-wall-tap-asset-1", ... }
  }
  
  return threekitItems[Object.keys(threekitItems)[0]];
};
```

### 2. setElementByNameNode() - Tạo Mapping

```typescript
// src/store/slices/configurator/handlers/handlers.ts
function setElementByNameNode(assetId: string, nameNode: string) {
  return (store: Store) => {
    store.dispatch(
      changeValueNodes({
        [nameNode]: assetId,  // { "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1" }
      })
    );
  };
}
```

### 3. changeValueNodes() - Redux Reducer

```typescript
// src/store/slices/configurator/Configurator.slice.ts
changeValueNodes: (
  state,
  action: PayloadAction<Record<string, string>>
) => {
  state.nodes = { ...state.nodes, ...action.payload };
  // Merge mapping mới vào existing nodes
}
```

### 4. ProductNode - Sử Dụng Mapping

```typescript
// src/components/Assets/ProductNode.tsx
const attachNodeNameToAssetId = useAppSelector(getNodes);
// attachNodeNameToAssetId = {
//   "Tap_Placement_Wall_1": "rallyboard-wall-tap-asset-1"
// }

if (!Object.keys(attachNodeNameToAssetId).includes(nameNode)) {
  return undefined;  // Không có mapping → không render
}

return (
  <Product
    productAssetId={attachNodeNameToAssetId[nameNode]}  // "rallyboard-wall-tap-asset-1"
    nameNode={nameNode}  // "Tap_Placement_Wall_1"
  />
);
```

---

## Kết Luận

**Flow hoàn chỉnh:**
1. **AssetId** đến từ Card config (`card.dataThreekit.threekitItems[keyPermission].id`)
2. **NodeName** đến từ MountElement (`mountElement.getNameNode()`)
3. **Mapping** được tạo bởi `setElementByNameNode(assetId, nodeName)`
4. **Redux store** được cập nhật với mapping: `{ nodeName: assetId }`
5. **ProductNode** sử dụng mapping để render Product với đúng assetId

**Điểm quan trọng:**
- AssetId và NodeName đến từ hai nguồn khác nhau (Card và MountElement)
- Mapping kết nối hai nguồn này lại với nhau
- Redux store là nơi lưu trữ mapping này
- ProductNode sử dụng mapping để biết render asset nào tại placement node nào

