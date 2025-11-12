# Next Steps After Creating localAssetLoader.ts

## ✅ Completed Steps

1. ✅ Created `localAssetLoader.ts` with mapping and utility functions
2. ✅ Modified `Product.tsx` to use `useLocalOrThreekitAsset()`
3. ✅ Created placement node `RallyBoard_Mount` dynamically in `Room.tsx`
4. ✅ Added `getNameNodeForRallyBoardMount()` to `PlacementManager`
5. ✅ File GLB exists: `public/assets/models/RallyBoard65_Standalone-compressed.glb`

---

## 📋 Next Steps Checklist

### Step 1: Verify GLB File Location ✅

**Check:**
- [x] File exists at: `public/assets/models/RallyBoard65_Standalone-compressed.glb`
- [x] File is accessible via URL: `/assets/models/RallyBoard65_Standalone-compressed.glb`

**Test:**
- Open browser DevTools → Network tab
- Navigate to: `http://localhost:PORT/assets/models/RallyBoard65_Standalone-compressed.glb`
- Should return 200 OK (not 404)

---

### Step 2: Verify Mapping in localAssetLoader.ts ✅

**Check:**
- [x] Mapping exists: `"rallyboard-mount-asset-1"` → `"/assets/models/RallyBoard65_Standalone-compressed.glb"`

**File:** `src/utils/localAssetLoader.ts`

```typescript
export const LOCAL_ASSET_MAPPING: Record<string, string> = {
  "rallyboard-mount-asset-1": "/assets/models/RallyBoard65_Standalone-compressed.glb",
  // ... other mappings
};
```

### Step 3: Find and Configure Permission/Element

**Location:** `src/utils/permissionUtils.ts`

**Mục đích:** Xác định **VỊ TRÍ** (placement node name) - "Đặt RallyBoard ở đâu?"

**⚠️ Quan Trọng:** Khi dùng **local GLB file**, cách tạo Element **GIỐNG HỆT** như dùng Threekit!

**What to do:**
1. Find where other products (like `CameraName.RallyBar`) are configured
2. Create or add `ItemElement` for RallyBoard
3. Set `defaultMount` to use `PlacementManager.getNameNodeForRallyBoardMount()`

**Example structure:**
```typescript
// In permissionUtils.ts
// Tìm step phù hợp (ví dụ: StepName.ConferenceCamera)
export function createStepConferenceCamera() {
  const stepConferenceCamera = new Step(StepName.ConferenceCamera);
  
  // Tạo Element cho RallyBoard
  const rallyBoardElement = new ItemElement("rallyboard")
    .setDefaultMount(
      new MountElement("RallyBoard_Mount")
        .setNameNode(PlacementManager.getNameNodeForRallyBoardMount())
        // ↑ Trả về "RallyBoard_Mount" khi gọi getNameNode()
    );
  
  // Thêm Element vào step
  stepConferenceCamera.addElement(rallyBoardElement);
  
  return stepConferenceCamera;
}
```

**Lưu ý:**
- Element **KHÔNG** cần biết về assetId hay file GLB
- Element chỉ cần biết **placement node name** (`"RallyBoard_Mount"`)
- Cách tạo Element **GIỐNG HỆT** cho cả Threekit và local GLB

**Steps:**
1. Open `src/utils/permissionUtils.ts`
2. Search for similar products (e.g., `CameraName.RallyBar`)
3. Find the step where RallyBoard should be added (likely `StepName.ConferenceCamera` or `StepName.Video`)
4. Add RallyBoard element with mount pointing to `RallyBoard_Mount`

**Kết quả:**
- Khi user chọn RallyBoard, `mount.getNameNode()` trả về `"RallyBoard_Mount"`
- Hệ thống biết cần đặt ở placement node `"RallyBoard_Mount"`

---

### Step 4: Find and Configure Card/Asset

**Mục đích:** Xác định **FILE GLB** (assetId) - "Dùng file GLB nào?"

**⚠️ Quan Trọng:** Khi dùng **local GLB file**, Card khác ở **assetId** - dùng key trong `LOCAL_ASSET_MAPPING` thay vì Threekit ID!

**What to do:**
1. Find where product cards are configured (likely in `server/prisma/dataLang/` or JSON files)
2. Create card for RallyBoard with:
   - `keyPermission`: `"rallyboard"` (or match with element) ← **Phải khớp với Element!**
   - `assetId`: `"rallyboard-mount-asset-1"` (from LOCAL_ASSET_MAPPING) ← **KHÔNG phải Threekit ID!**
   - Other card properties (name, description, etc.)

**Where to look:**
- `server/prisma/dataLang/products/` - JSON files for products
- `public/PoductJson.json` - Product data
- `server/src/dataLang/` - Language/product data

**Example card structure cho Local GLB:**
```json
{
  "rallyboard": {
    "keyPermission": "rallyboard",  // ← Phải khớp với Element!
    "assetId": "rallyboard-mount-asset-1",  // ← Key trong LOCAL_ASSET_MAPPING (KHÔNG phải Threekit ID!)
    "name": "RallyBoard",
    "description": "RallyBoard display",
    "counter": {
      "min": 0,
      "max": 1
    }
  }
}
```

**So sánh với Threekit:**
```json
// ❌ Threekit (KHÔNG dùng cho local GLB):
{
  "rallyboard": {
    "assetId": "threekit-asset-id-123"  // ← ID từ Threekit platform
  }
}

// ✅ Local GLB (Dùng cho file local):
{
  "rallyboard": {
    "assetId": "rallyboard-mount-asset-1"  // ← Key trong LOCAL_ASSET_MAPPING
  }
}
```

**Mapping trong `localAssetLoader.ts`:**
```typescript
export const LOCAL_ASSET_MAPPING: Record<string, string> = {
  "rallyboard-mount-asset-1": "/assets/models/RallyBoard65_Standalone-compressed.glb",
  // ↑ Key này được dùng trong card.assetId
};
```

**Kết quả:**
- Khi load Product, `getAssetFromCard(card)` trả về `"rallyboard-mount-asset-1"`
- `resolveAssetPath()` map đến `/assets/models/RallyBoard65_Standalone-compressed.glb`
- Hệ thống biết cần load file GLB nào từ local file (không phải Threekit)

---

### Step 5: Add RallyBoard to Step

**Location:** `src/utils/permissionUtils.ts`

**What to do:**
1. Find the step where RallyBoard should appear (e.g., `StepName.Video`)
2. Add RallyBoard card to the step's cards collection
3. Ensure step includes RallyBoard element in its permission structure

**Example:**
```typescript
// In createStepVideo() or similar function
step.addCard({
  keyPermission: "rallyboard",
  // ... other card properties
});
```
### Step 6: Test the Integration

**Testing steps:**

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Load phoneBooth room:**
   - Navigate to room configurator
   - Select phoneBooth room
   - Check console for: `"✅ Created placement node RallyBoard_Mount"`

3. **Check PlacementNodesVisualizer:**
   - In development mode, you should see a red marker at TV position
   - Marker should be labeled `RallyBoard_Mount`

4. **Select RallyBoard from UI:**
   - Find RallyBoard in the product list
   - Click to select it
   - Check Redux DevTools: `state.configurator.nodes["RallyBoard_Mount"]` should have assetId

5. **Verify GLB loads:**
   - Check Network tab: Request to `/assets/models/RallyBoard65_Standalone-compressed.glb` should succeed
   - Check console: No errors about loading GLB
   - Check 3D scene: RallyBoard should appear at TV position

6. **Verify TV is hidden (if implemented):**
   - TV mesh should be invisible when RallyBoard is placed

---

### Step 7: Handle Multiple Cases (Optional)

---

## 📚 What Is Step?

### Khái Niệm:

**Step** là một **bước trong quy trình configurator** - mỗi step đại diện cho một nhóm sản phẩm mà user có thể chọn.

### Ví Dụ Các Step:

```typescript
// Trong permissionUtils.ts
StepName.RoomSize          // Bước 1: Chọn kích thước phòng
StepName.Platform          // Bước 2: Chọn platform (Zoom, Teams, etc.)
StepName.ConferenceCamera  // Bước 3: Chọn camera
StepName.AudioExtensions   // Bước 4: Chọn audio extensions
StepName.MeetingController // Bước 5: Chọn meeting controller
```

### Cấu Trúc Step:

```typescript
// Mỗi Step chứa:
class Step {
  name: StepName;                    // Tên step (ví dụ: "ConferenceCamera")
  elements: ItemElement[];           // Các sản phẩm có thể chọn (Element)
  cards: CardI[];                    // Hiển thị trong UI (Card)
  activeElements: ItemElement[];     // Các sản phẩm đã được chọn
}
```

### Mối Quan Hệ:

```
Step (Bước)
  ├── Elements (Sản phẩm có thể chọn)
  │   └── ItemElement("rallyboard")
  │       └── defaultMount → "RallyBoard_Mount"
  │
  └── Cards (Hiển thị trong UI)
      └── Card { keyPermission: "rallyboard", assetId: "..." }
```

**Ví dụ:** Trong `StepName.ConferenceCamera`, user có thể chọn các camera như RallyBar, RallyBarMini, MeetUp2, etc.

---

## 🎯 Understanding Step 3 & 4: Why We Need Both Element and Card

Hệ thống cần **2 phần** để đặt sản phẩm vào đúng vị trí:

1. **Element (Step 3):** Trả lời câu hỏi **"ĐẶT Ở ĐÂU?"** (placement node name)
2. **Card (Step 4):** Trả lời câu hỏi **"DÙNG FILE NÀO?"** (assetId/GLB file)

### Element - "ĐẶT Ở ĐÂU?"

**Element** cho hệ thống biết: **Khi user chọn RallyBoard, đặt nó vào placement node nào?**

**Flow:**
```
User clicks RallyBoard
  ↓
addElement() gets Element
  ↓
mount.getNameNode() → "RallyBoard_Mount" ✅
```

**Nếu không có Element:**
- ❌ `addElement()` không biết đặt RallyBoard ở đâu
- ❌ Không có mapping trong Redux store
- ❌ Product không hiển thị

### Card - "DÙNG FILE NÀO?"

**Card** cho hệ thống biết: **RallyBoard sử dụng file GLB nào để hiển thị?**

**Flow:**
```
Redux: { "RallyBoard_Mount": "rallyboard-mount-asset-1" }
  ↓
resolveAssetPath("rallyboard-mount-asset-1")
  ↓
"/assets/models/RallyBoard65_Standalone-compressed.glb" ✅
```

**Nếu không có Card:**
- ❌ Không có `assetId` để load file GLB
- ❌ Không thể map vào Redux store
- ❌ Product không có file để render

### Kết Hợp Element + Card:

```
Element → "RallyBoard_Mount" (vị trí)
     +
Card   → "rallyboard-mount-asset-1" (file GLB)
     =
Redux: { "RallyBoard_Mount": "rallyboard-mount-asset-1" }
     ↓
Product render tại đúng vị trí với đúng file! ✅
```

**Flow hoàn chỉnh:**
```
1. User chọn RallyBoard
   ↓
2. Element trả lời: "Đặt ở RallyBoard_Mount"
   ↓
3. Card trả lời: "Dùng file rallyboard-mount-asset-1"
   ↓
4. Map vào Redux: { "RallyBoard_Mount": "rallyboard-mount-asset-1" }
   ↓
5. ProductNode detect → Render Product
   ↓
6. Product load GLB và render tại RallyBoard_Mount ✅
```

---


---

## 🔄 Flow Hoàn Chỉnh Khi Dùng Local GLB

### 1. User Chọn RallyBoard:
```
User clicks "RallyBoard" button
  ↓
addElement(card, StepName.ConferenceCamera)
```

### 2. Element Trả Lời "ĐẶT Ở ĐÂU?":
```typescript
// Trong addElement()
const element = step.getElementByName("rallyboard");
// → rallyBoardElement (từ Step 3)

const mount = element.getDefaultMount();
const nodeName = mount.getNameNode();
// → "RallyBoard_Mount" ✅
```

### 3. Card Trả Lời "DÙNG FILE NÀO?":
```typescript
// Trong addElement()
const card = getCardByKeyPermission("rallyboard");
const assetId = card.assetId;
// → "rallyboard-mount-asset-1" ✅ (KHÔNG phải Threekit ID!)
```

### 4. Resolve Asset Path:
```typescript
// Trong Product.tsx
const resolvedAssetId = resolveAssetPath("rallyboard-mount-asset-1");
// → "/assets/models/RallyBoard65_Standalone-compressed.glb" ✅
```

### 5. Load GLB File:
```typescript
// Trong Product.tsx
const gltf = useGLTF("/assets/models/RallyBoard65_Standalone-compressed.glb");
// → Load từ local file (KHÔNG phải từ Threekit!)
```

### 6. Map Vào Redux:
```typescript
setElementByNameNode(
  "rallyboard-mount-asset-1",  // ← Từ Card (local mapping key)
  "RallyBoard_Mount"            // ← Từ Element
);
// → Redux: { "RallyBoard_Mount": "rallyboard-mount-asset-1" }
```

### 7. Render Product:
```typescript
// Product component
<Product 
  productAssetId="rallyboard-mount-asset-1"  // ← Từ Redux
  // ...
/>
// → resolveAssetPath() → "/assets/models/...glb"
// → useGLTF() load từ local file
// → Render tại RallyBoard_Mount position ✅
```

---

## 📊 So Sánh: Threekit vs Local GLB

| Aspect | Threekit | Local GLB |
|--------|----------|-----------|
| **Element** | Giống nhau | Giống nhau |
| **Card.assetId** | `"threekit-id-123"` | `"rallyboard-mount-asset-1"` |
| **Mapping** | Không cần | Cần `LOCAL_ASSET_MAPPING` |
| **Load Asset** | `useAsset({ assetId })` | `useGLTF(path)` (tự động) |
| **File Location** | Threekit platform | `public/assets/models/` |

**Kết luận:** Cách tạo Element và Card **GIỐNG HỆT** cho cả Threekit và local GLB, chỉ khác ở **assetId** trong Card!

---



**For 3 different RallyBoard cases:**

1. **Case 1: On wall (replace TV)** ✅
   - Placement node: `RallyBoard_Mount` (already created)
   - Asset mapping: `rallyboard-mount-asset-1`

2. **Case 2: On credenza**
   - Placement node: `Camera_Commode_mini_display_1` (existing)
   - Asset mapping: `rallyboard-credenza-asset-1` (need to add GLB file)

3. **Case 3: On floor with stand**
   - Placement node: Need to create new one or use existing
   - Asset mapping: `rallyboard-stand-asset-1` (need to add GLB file)

**For each case:**
- Add GLB file to `public/assets/models/`
- Add mapping to `LOCAL_ASSET_MAPPING`
- Configure separate cards or use conditions to switch between cases

---

## 🔍 How to Find Configuration Files

### Find Permission/Element Configuration:

```bash
# Search for where products are configured
grep -r "RallyBar" src/utils/permissionUtils.ts
grep -r "ItemElement" src/utils/permissionUtils.ts
grep -r "setDefaultMount" src/utils/permissionUtils.ts
```

### Find Card Configuration:

```bash
# Search for product cards
grep -r "keyPermission" server/prisma/dataLang/
grep -r "assetId" server/prisma/dataLang/
find . -name "*.json" -path "*/dataLang/*" -exec grep -l "RallyBar" {} \;
```

### Find Step Configuration:

```bash
# Search for step definitions
grep -r "StepName.Video" src/
grep -r "createStep" src/utils/permissionUtils.ts
```

---

## 📝 Quick Reference

### Key Files to Modify:

1. **Permission/Element:** `src/utils/permissionUtils.ts`
2. **Card/Asset:** `server/prisma/dataLang/products/*.json` or similar
3. **Placement Node:** Already done in `Room.tsx`
4. **Asset Mapping:** Already done in `localAssetLoader.ts`
5. **Product Component:** Already done in `Product.tsx`

### Key Values:

- **Placement Node Name:** `"RallyBoard_Mount"`
- **AssetId (mapping key):** `"rallyboard-mount-asset-1"`
- **GLB File Path:** `"/assets/models/RallyBoard65_Standalone-compressed.glb"`
- **Key Permission:** `"rallyboard"` (or match with existing convention)

---

## ⚠️ Common Issues

### Issue 1: GLB File Not Found (404)

**Solution:**
- Check file path in `LOCAL_ASSET_MAPPING`
- Ensure file is in `public/assets/models/`
- Restart dev server after adding file

### Issue 2: Placement Node Not Found

**Solution:**
- Check console for: `"✅ Created placement node RallyBoard_Mount"`
- Verify `PlacementManager.getAllPlacement()` includes `"RallyBoard_Mount"`
- Check `PlacementNodesVisualizer` shows the node

### Issue 3: Product Not Appearing

**Solution:**
- Check Redux store: `state.configurator.nodes["RallyBoard_Mount"]` has value
- Check Network tab: GLB file loads successfully
- Check console: No errors in `Product.tsx` or `useLocalOrThreekitAsset()`

### Issue 4: Element/Mount Not Configured

**Solution:**
- Verify `defaultMount.getNameNode()` returns `"RallyBoard_Mount"`
- Check `addElement()` is called when user selects RallyBoard
- Verify card has correct `keyPermission` matching element

### Issue 5: Element and Card Not Connected

**Symptoms:**
- Element exists but card doesn't, or vice versa
- `keyPermission` doesn't match between Element and Card

**Solution:**
- Ensure Element `keyPermission` = Card `keyPermission` (must match exactly!)
- Check both Element and Card are added to the same step
- Verify `addElement()` can find both Element and Card by `keyPermission`

---

## ✅ Completion Checklist

- [ ] GLB file verified and accessible
- [ ] Mapping in `localAssetLoader.ts` correct
- [ ] Permission/Element configured in `permissionUtils.ts`
- [ ] Card configured with correct `assetId`
- [ ] Card added to appropriate step
- [ ] Placement node visible in `PlacementNodesVisualizer`
- [ ] RallyBoard appears in product list
- [ ] Selecting RallyBoard creates mapping in Redux
- [ ] GLB loads successfully
- [ ] RallyBoard renders at correct position
- [ ] TV is hidden when RallyBoard is placed (if implemented)

---

## 🎯 Next Action

**Start with Step 3:** Find and configure Permission/Element in `src/utils/permissionUtils.ts`

Look for similar products (like `CameraName.RallyBar`) and follow the same pattern to add RallyBoard.

**Remember:**
- ✅ Element giống hệt cho cả Threekit và local GLB
- ✅ Card chỉ khác ở assetId (dùng key trong LOCAL_ASSET_MAPPING)
- ✅ Step là nơi chứa Elements và Cards
- ✅ keyPermission phải khớp giữa Element và Card

