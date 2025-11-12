# Giải Thích Chi Tiết: Code Flow Khi User Click Chọn RallyBoard

## Tổng Quan Flow

```
1. User Click → Card Component (PrepareCardContainer/CardItem)
2. Card Component → app.addItemConfiguration()
3. app.addItemConfiguration() → AddItemCommand
4. AddItemCommand → Threekit Configurator (setConfiguration)
5. Redux Middleware → Update Redux Store
6. Redux Middleware → addElement() → setElementByNameNode()
7. Redux Store Updated → nodes mapping: { "RallyBoard_Mount": "rallyboard-asset-id" }
8. ProductNode Re-render → Check nodes mapping
9. ProductNode → Render Product Component
10. Product Component → Load GLB Asset
11. Product Component → Process Scene (center, scale, orient)
12. Product Component → Render GLTFNode tại placement node position
13. RallyBoard hiển thị trong scene
```

---

## Bước 1: User Click Chọn RallyBoard Trong List

### 1.1. Card Component (PrepareCardContainer.tsx)

**File:** `src/components/Cards/PrepareCardContainer/PrepareCardContainer.tsx`

```typescript
export const PrepareCardContainer: React.FC<PropsI> = (props) => {
  const { keyItemPermission, children, onClick } = props;
  const dispatch = useDispatch();
  const activeStep = useAppSelector(getActiveStep);
  const card = useAppSelector(
    getCardByKeyPermission(activeStep, keyItemPermission)
  );

  const handleClick = () => {
    props.onSelectedAnalytics();
    onClick && onClick();
    
    // Lấy thông tin từ card
    const { attributeName, threekitItems } = card.dataThreekit;
    const threekitAsset = threekitItems[card.keyPermission];

    if (isActiveCard) {
      // Nếu đã chọn → xóa
      app.removeItem(attributeName, card.keyPermission);
      return;
    }

    // ⭐ QUAN TRỌNG: Gọi app.addItemConfiguration()
    app.addItemConfiguration(
      attributeName,        // Ví dụ: "rallyboard_display"
      threekitAsset.id,     // Ví dụ: "rallyboard-asset-id-123"
      card.keyPermission    // Ví dụ: "rallyboard_mount"
    );
  };

  return (
    <CardContainer onClick={handleClick} ...>
      {children}
    </CardContainer>
  );
};
```

**Kết quả:**
- User click vào card RallyBoard
- `handleClick()` được gọi
- `app.addItemConfiguration()` được gọi với:
  - `attributeName`: Tên attribute trong Threekit configurator
  - `assetId`: ID của RallyBoard asset
  - `keyPermission`: Key permission của card (ví dụ: "rallyboard_mount")

---

## Bước 2: Application.addItemConfiguration()

### 2.1. Application Class

**File:** `src/models/Application.ts`

```typescript
export class Application {
  public addItemConfiguration(
    nameProperty: string,      // "rallyboard_display"
    assetId: string,           // "rallyboard-asset-id-123"
    keyItemPermission: string  // "rallyboard_mount"
  ): Promise<boolean> {
    // ⭐ Tạo AddItemCommand và execute
    return this.executeCommand(
      new AddItemCommand(
        this.currentConfigurator,  // Threekit Configurator instance
        nameProperty,
        assetId,
        keyItemPermission
      )
    );
  }
}
```

**Kết quả:**
- `AddItemCommand` được tạo
- Command được execute thông qua `executeCommand()`

---

## Bước 3: AddItemCommand.executeCommand()

### 3.1. AddItemCommand Class

**File:** `src/models/command/AddItemCommand.ts`

```typescript
export class AddItemCommand extends ItemCommand {
  public assetId: string;
  public nameProperty: string;

  public executeCommand(): boolean {
    // ⭐ Cập nhật Threekit Configurator configuration
    this.configurator.setConfiguration({
      [this.nameProperty]: {
        assetId: this.assetId,
      },
    });
    this.changeProperties.push(this.nameProperty);
    return true;
  }
}
```

**Kết quả:**
- Threekit Configurator được cập nhật với:
  ```typescript
  {
    "rallyboard_display": {
      assetId: "rallyboard-asset-id-123"
    }
  }
  ```
- Command emit event `"executeCommand"` với `AddItemCommand` instance

---

## Bước 4: Redux Middleware Xử Lý Command Event

### 4.1. UI Handlers

**File:** `src/store/slices/ui/handlers/handlers.ts`

```typescript
export const getUiHandlers = (store: Store) => {
  app.eventEmitter.on("executeCommand", (data) => {
    if (data instanceof AddItemCommand) {
      // ⭐ Dispatch Redux action
      store.dispatch(addActiveCard({ key: data.keyItemPermission }));
    }
    // ... các command khác
  });
};
```

**Kết quả:**
- Redux action `addActiveCard({ key: "rallyboard_mount" })` được dispatch

---

## Bước 5: Redux Middleware Xử Lý ADD_ACTIVE_CARD Action

### 5.1. Redux Middleware

**File:** `src/store/middleware/index.ts`

```typescript
export const middleware: Middleware = (store: any) => (next) => async (action: any) => {
  const res = next(action);
  let state = store.getState();

  switch (action.type) {
    case UI_ACTION_NAME.ADD_ACTIVE_CARD: {
      const { key } = action.payload;  // key = "rallyboard_mount"
      const activeStep = getActiveStep(state);

      // ... xử lý permissions, colors, displays ...

      // ⭐ QUAN TRỌNG: Update nodes mapping
      const updateNodes = updateNodesByConfiguration(
        currentConfigurator,
        activeStep
      );
      const attributeNames = Configurator.getNamesAttrByStepName(activeStep);
      updateNodes(store, attributeNames);

      // ⭐ Đặc biệt: Xử lý local GLB cards (RallyBoard)
      const card = getCardByKeyPermission(activeStep, key)(state);
      if (card) {
        const attributeName = card.dataThreekit.attributeName;
        const attributeNames = Configurator.getNamesAttrByStepName(activeStep);
        const isThreekitAttribute = attributeNames.some(
          (attrArray) => attrArray[0] === attributeName
        );

        // Nếu KHÔNG phải Threekit attribute → local GLB card
        if (!isThreekitAttribute) {
          console.log("🔵 [Local GLB] Calling addElement for:", key);
          const count = getPropertyCounterCardByKeyPermission(activeStep, key)(state);
          // ⭐ Gọi addElement() để tạo nodes mapping
          addElement(card, activeStep, count)(store);
        }
      }
      break;
    }
  }
};
```

**Kết quả:**
- Với RallyBoard (local GLB card), `addElement()` được gọi trực tiếp
- Với Threekit products, `updateNodesByConfiguration()` được gọi

---

## Bước 6: addElement() - Tạo Nodes Mapping

### 6.1. addElement Function

**File:** `src/store/slices/configurator/handlers/handlers.ts`

```typescript
export function addElement(
  card: CardI,           // RallyBoard card
  stepName: StepName,    // Current step
  countValue?: number
) {
  return (store: Store) => {
    const state = store.getState();
    const permission = getPermission(stepName)(state);
    const step = permission.getCurrentStep();

    // Lấy Element từ card
    const element = step.getElementByName(card.keyPermission);
    // element = RallyBoardElement (ItemElement)

    // Lấy asset ID từ card
    const cardAsset = getAssetFromCard(card)(state);
    // cardAsset.id = "rallyboard-asset-id-123"

    if (element instanceof ItemElement) {
      // Lấy defaultMount từ element
      const defaultMount = element.getDefaultMount();
      // defaultMount = MountElement với nameNode từ PlacementManager

      if (defaultMount instanceof MountElement) {
        // ⭐ Lấy tên placement node từ mount
        const nodeName = defaultMount.getNameNode();
        // nodeName = "RallyBoard_Mount"
        // (từ PlacementManager.getNameNodeForRallyBoardMount())

        const dependentMount = defaultMount.getDependentMount();
        if (!dependentMount) {
          // ⭐ QUAN TRỌNG: Map nameNode → assetId trong Redux store
          console.log("✅ [addElement] Setting node mapping:", {
            nodeName,        // "RallyBoard_Mount"
            assetId: cardAsset.id,  // "rallyboard-asset-id-123"
            keyPermission: card.keyPermission,  // "rallyboard_mount"
          });
          store.dispatch(changeStatusProcessing(true));
          setElementByNameNode(cardAsset.id, nodeName)(store);
          return;
        }
        // ... xử lý dependent mount ...
      }
    }
  };
}
```

**Kết quả:**
- `setElementByNameNode("rallyboard-asset-id-123", "RallyBoard_Mount")(store)` được gọi

---

## Bước 7: setElementByNameNode() - Cập Nhật Redux Store

### 7.1. setElementByNameNode Function

**File:** `src/store/slices/configurator/handlers/handlers.ts`

```typescript
function setElementByNameNode(assetId: string, nameNode: string) {
  return (store: Store) => {
    // ⭐ Dispatch Redux action để cập nhật nodes mapping
    store.dispatch(
      changeValueNodes({
        [nameNode]: assetId,  // { "RallyBoard_Mount": "rallyboard-asset-id-123" }
      })
    );
  };
}
```

### 7.2. Redux Reducer

**File:** `src/store/slices/configurator/Configurator.slice.ts`

```typescript
const configuratorSlice = createSlice({
  name: "configurator",
  initialState: {
    nodes: {},  // { "RallyBoard_Mount": "rallyboard-asset-id-123" }
    // ...
  },
  reducers: {
    changeValueNodes: (
      state,
      action: PayloadAction<Record<string, string>>
    ) => {
      // ⭐ Merge nodes mapping vào state
      state.nodes = { ...state.nodes, ...action.payload };
      // state.nodes = { "RallyBoard_Mount": "rallyboard-asset-id-123" }
    },
  },
});
```

**Kết quả:**
- Redux store được cập nhật:
  ```typescript
  {
    configurator: {
      nodes: {
        "RallyBoard_Mount": "rallyboard-asset-id-123"
      }
    }
  }
  ```

---

## Bước 8: ProductNode Re-render - Kiểm Tra Nodes Mapping

### 8.1. Room Component Render Scene

**File:** `src/components/Assets/Room.tsx`

```typescript
export const Room: React.FC<RoomProps> = (props) => {
  const gltf = useScene({ assetId: roomAssetId });

  return (
    <>
      <GLTFNode
        threeNode={gltf.scene}
        nodeMatchers={ProductsNodes({ isRallyBoardSelected })}
      />
    </>
  );
};
```

### 8.2. ProductsNodes Matcher Tìm Placement Nodes

**File:** `src/components/Assets/ProductsNodes.tsx`

```typescript
export const ProductsNodes = (opts?: ProductsNodesOpts) => {
  const allNodePlacement = PlacementManager.getAllPlacement();
  // allNodePlacement = ["RallyBoard_Mount", "Mic_Placement_1", ...]

  const nodeMatchers: NodeMatcher[] = [
    (threeNode) => {
      // Kiểm tra: node name có trong danh sách placement nodes không?
      if (allNodePlacement.includes(threeNode.name)) {
        // ✅ Tìm thấy placement node "RallyBoard_Mount"
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

**Kết quả:**
- `GLTFNode` traverse scene và tìm thấy node `"RallyBoard_Mount"`
- `ProductsNodes` matcher trả về `<ProductNode>` component

### 8.3. ProductNode Component

**File:** `src/components/Assets/ProductNode.tsx`

```typescript
export const ProductNode: FC<ProductProps> = ({ nameNode, parentNode }) => {
  // ⭐ Lấy nodes mapping từ Redux store
  const attachNodeNameToAssetId = useAppSelector(getNodes);
  // attachNodeNameToAssetId = { "RallyBoard_Mount": "rallyboard-asset-id-123" }

  const configuration = useAppSelector(getConfiguration);
  // configuration = { "RallyBoard_Mount": { ... } }

  // Debug log
  if (nameNode === "RallyBoard_Mount") {
    console.log("🎯 [ProductNode] RallyBoard_Mount check:", {
      nameNode,
      hasMapping: Object.keys(attachNodeNameToAssetId).includes(nameNode),
      assetId: attachNodeNameToAssetId[nameNode],
    });
  }

  // ⭐ KIỂM TRA: Placement node này có sản phẩm được assign chưa?
  if (!Object.keys(attachNodeNameToAssetId).includes(nameNode)) {
    // ❌ Chưa có mapping → không render gì
    return undefined;
  }

  // ✅ CÓ mapping → render Product component
  return (
    <Product
      parentNode={parentNode}        // Placement node (có position, rotation, scale)
      productAssetId={attachNodeNameToAssetId[nameNode]}  // "rallyboard-asset-id-123"
      configuration={configuration[nameNode]}  // Product configuration
      nameNode={nameNode}  // "RallyBoard_Mount"
      // ... các props khác
    />
  );
};
```

**Kết quả:**
- `ProductNode` kiểm tra Redux store
- Tìm thấy mapping: `"RallyBoard_Mount" → "rallyboard-asset-id-123"`
- Render `<Product>` component

---

## Bước 9: Product Component Load GLB Asset

### 9.1. Product Component

**File:** `src/components/Assets/Product.tsx`

```typescript
export const Product: React.FC<ProductProps> = ({
  parentNode,           // Placement node
  productAssetId,       // "rallyboard-asset-id-123"
  configuration,        // Product configuration
  nameNode,             // "RallyBoard_Mount"
  // ...
}) => {
  // Resolve assetId: check mapping or use directly
  const resolvedAssetId = resolveAssetPath(productAssetId);

  // Load from local file or Threekit (auto-detect)
  const isLocal = isLocalAsset(resolvedAssetId);

  // ⭐ Load GLB asset
  const localGltf = useLocalAsset(
    isLocal ? resolvedAssetId : "/assets/models/RallyBoard65_Standalone-compressed.glb"
  );
  const threekitGltf = useThreekitAsset(
    isLocal ? roomAssetId || "" : resolvedAssetId,
    useAsset,
    isLocal ? undefined : configuration
  );

  // Use local asset if isLocal, otherwise use Threekit asset
  const productGltf = isLocal ? localGltf : threekitGltf || localGltf;

  console.log("📦 [Product] GLTF loaded:", {
    nameNode,
    hasProductGltf: !!productGltf,
    isLocal,
  });

  // ...
};
```

**Kết quả:**
- GLB asset được load từ local file hoặc Threekit
- `productGltf.scene` chứa Three.js scene của RallyBoard

---

## Bước 10: Product Component Process Scene

### 10.1. Process Scene (Center, Scale, Orient)

**File:** `src/components/Assets/Product.tsx`

```typescript
const processedScene = useMemo(() => {
  if (!productGltf) return null;

  const clonedScene = productGltf.scene.clone();

  // ⭐ Chỉ process cho RallyBoard_Mount
  if (nameNode === "RallyBoard_Mount") {
    // 1. Calculate bounding box
    const box = new THREE.Box3();
    box.setFromObject(clonedScene);
    const originalCenter = box.getCenter(new THREE.Vector3());
    const originalSize = box.getSize(new THREE.Vector3());

    // 2. Scale down if too large
    const maxDimension = Math.max(originalSize.x, originalSize.y, originalSize.z);
    let scaleFactor = 1;
    if (maxDimension > 10) {
      scaleFactor = 0.08;  // cm to decimeters
      clonedScene.scale.multiplyScalar(scaleFactor);
    }

    // 3. Recalculate bounding box after scaling
    const boxAfterScale = new THREE.Box3();
    boxAfterScale.setFromObject(clonedScene);
    const centerAfterScale = boxAfterScale.getCenter(new THREE.Vector3());

    // 4. Center the scene at origin
    clonedScene.position.sub(centerAfterScale);

    // 5. Orient RallyBoard: Rotate front face towards room front (-Z direction)
    orientRallyBoard(
      clonedScene,
      new THREE.Vector3(0, 0, -1),  // Room front is -Z
      true  // Enable debug logs
    );

    console.log("🔧 [Product] RallyBoard scene processed:", {
      originalCenter,
      originalSize,
      centerAfterScale,
      scaleFactor,
      finalPosition: clonedScene.position,
    });
  }

  return clonedScene;
}, [productGltf, nameNode]);
```

**Kết quả:**
- Scene được center tại origin (0, 0, 0)
- Scene được scale xuống nếu quá lớn
- Scene được orient để front face hướng về room front (-Z)

---

## Bước 11: Product Component Render tại Placement Node

### 11.1. Render GLTFNode

**File:** `src/components/Assets/Product.tsx`

```typescript
return (
  <group
    key={parentNode.uuid + `-group`}
    name={generateName(nameNode, parentNode)}
    // ⭐ QUAN TRỌNG: Copy position, scale, rotation từ placement node
    position={parentNode.position}  // Vị trí của placement node
    scale={parentNode.scale}        // Scale của placement node
    rotation={parentNode.rotation}  // Rotation của placement node
  >
    {/* Debug marker */}
    {nameNode === "RallyBoard_Mount" && (
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#00ff00" />
      </mesh>
    )}

    {/* Axes helpers */}
    {showAxesHelpers && (
      <DeviceAxesHelpers
        showLocal={true}
        showWorld={true}
        size={2.0}
      />
    )}

    {/* Render GLB scene */}
    {PlacementManager.getNameNodeWithoutInteraction().includes(nameNode) ? (
      // Sản phẩm không tương tác được (như TV)
      <GLTFNode
        threeNode={processedScene}
        nodeMatchers={ProductsNodes({ isRallyBoardSelected: false })}
      />
    ) : (
      // Sản phẩm có thể tương tác
      <Select enabled={highlight} onClick={...}>
        {popuptNode && (
          <AnnotationProductContainer
            stepPermission={...}
            keyPermissions={...}
            position={[0, sizeProduct.y / 2, 0]}
            callbackDisablePopuptNodes={callbackDisablePopuptNodes}
          />
        )}
        <GLTFNode
          threeNode={processedScene}
          nodeMatchers={ProductsNodes({ isRallyBoardSelected: false })}
        />
      </Select>
    )}
  </group>
);
```

**Kết quả:**
- RallyBoard được render tại vị trí của placement node
- RallyBoard có position, scale, rotation từ placement node
- RallyBoard hiển thị trong scene 3D

---

## Tóm Tắt Flow

1. **User Click** → Card component gọi `app.addItemConfiguration()`
2. **AddItemCommand** → Cập nhật Threekit Configurator
3. **Redux Middleware** → Dispatch `addActiveCard` action
4. **addElement()** → Tạo nodes mapping trong Redux store
5. **Redux Store Updated** → `nodes["RallyBoard_Mount"] = "rallyboard-asset-id-123"`
6. **ProductNode Re-render** → Kiểm tra nodes mapping
7. **Product Component** → Load GLB asset
8. **Process Scene** → Center, scale, orient RallyBoard
9. **Render** → RallyBoard hiển thị tại placement node position

---

## Điểm Quan Trọng

### 1. Nodes Mapping
- Redux store lưu mapping: `nameNode → assetId`
- Mapping được tạo bởi `addElement()` → `setElementByNameNode()`
- Mapping quyết định placement node nào có sản phẩm

### 2. Placement Node
- Placement node là empty Object3D trong scene
- Placement node có position, rotation, scale từ designer
- Product được render tại vị trí của placement node

### 3. Local GLB vs Threekit Asset
- Local GLB: Load từ file local (`/assets/models/...`)
- Threekit Asset: Load từ Threekit API
- RallyBoard là local GLB card

### 4. Scene Processing
- RallyBoard được center tại origin
- RallyBoard được scale xuống nếu quá lớn
- RallyBoard được orient để front face hướng về room front

### 5. Rendering
- Product component render tại placement node position
- GLTFNode traverse và render scene
- ProductsNodes matcher tìm và render sub-products

---

## Debug Logs

### Console Logs để Debug

1. **ProductNode:**
   ```typescript
   console.log("🎯 [ProductNode] RallyBoard_Mount check:", {
     nameNode,
     hasMapping: Object.keys(attachNodeNameToAssetId).includes(nameNode),
     assetId: attachNodeNameToAssetId[nameNode],
   });
   ```

2. **Product:**
   ```typescript
   console.log("📦 [Product] GLTF loaded:", {
     nameNode,
     hasProductGltf: !!productGltf,
     isLocal,
   });
   ```

3. **addElement:**
   ```typescript
   console.log("✅ [addElement] Setting node mapping:", {
     nodeName,
     assetId: cardAsset.id,
     keyPermission: card.keyPermission,
   });
   ```

---

## Kết Luận

Flow này đảm bảo:
1. User click chọn RallyBoard → Redux store được cập nhật
2. Redux store cập nhật → Component re-render
3. Component re-render → Product được load và render
4. Product render → RallyBoard hiển thị tại placement node position

Tất cả các bước đều được trace qua console logs để dễ debug.

