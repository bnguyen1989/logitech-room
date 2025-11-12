# Hướng Dẫn: Load GLB Từ File Local (Không Cần Threekit)

## Tổng Quan

Bạn **CÓ THỂ** load GLB trực tiếp từ file local mà không cần upload lên Threekit. Hệ thống đã được cấu hình để hỗ trợ cả 2 cách:
- ✅ Load từ Threekit (assetId là Threekit ID)
- ✅ Load từ local file (assetId là path đến file GLB)

---

## Bước 1: Đặt File GLB Vào Folder Public

### 1.1. Tạo Folder Cho Models

**Cách làm:**
1. Tạo folder `public/assets/models/` (hoặc folder khác trong `public/`)
2. Đặt file GLB của RallyBoard vào folder này

**Cấu trúc folder:**
```
public/
  assets/
    models/
      rallyboard-wall.glb      (trường hợp 1: trên tường)
      rallyboard-credenza.glb  (trường hợp 2: trên credenza)
      rallyboard-floor.glb     (trường hợp 3: trên sàn với stand)
```

### 1.2. Lưu Ý Về Path

- File trong `public/` có thể access qua URL bắt đầu với `/`
- Ví dụ: `public/assets/models/rallyboard-wall.glb` → URL: `/assets/models/rallyboard-wall.glb`

---

## Bước 2: Cấu Hình Mapping AssetId → File Path

### 2.1. Mở File Mapping

**File:** `src/utils/localAssetLoader.ts`

**Cấu trúc:**
```typescript
export const LOCAL_ASSET_MAPPING: Record<string, string> = {
  // RallyBoard trường hợp 1: trên tường (thay TV)
  "rallyboard-wall-asset-id": "/assets/models/rallyboard-wall.glb",
  
  // RallyBoard trường hợp 2: trên credenza
  "rallyboard-credenza-asset-id": "/assets/models/rallyboard-credenza.glb",
  
  // RallyBoard trường hợp 3: trên sàn với stand
  "rallyboard-floor-asset-id": "/assets/models/rallyboard-floor.glb",
};
```

### 2.2. Thêm Mapping Cho RallyBoard

**Cách làm:**
1. Mở `src/utils/localAssetLoader.ts`
2. Thêm mapping cho RallyBoard vào `LOCAL_ASSET_MAPPING`:

```typescript
export const LOCAL_ASSET_MAPPING: Record<string, string> = {
  // RallyBoard - Case 1: Replace TV on wall
  "rallyboard-mount-asset-id": "/assets/models/rallyboard-wall.glb",
  
  // RallyBoard - Case 2: On credenza
  "rallyboard-credenza-asset-id": "/assets/models/rallyboard-credenza.glb",
  
  // RallyBoard - Case 3: On floor with stand
  "rallyboard-floor-asset-id": "/assets/models/rallyboard-floor.glb",
};
```

**Lưu ý:**
- Key (ví dụ: `"rallyboard-mount-asset-id"`) là assetId bạn sẽ dùng trong card config
- Value (ví dụ: `"/assets/models/rallyboard-wall.glb"`) là path đến file GLB trong `public/`

---

## Bước 3: Cấu Hình Card Với Local AssetId

### 3.1. Tìm File Cấu Hình Cards

**Cách làm:**
1. Tìm file cấu hình cards (có thể trong `server/prisma/dataLang/` hoặc file JSON khác)
2. Tạo hoặc cập nhật card cho RallyBoard

### 3.2. Cấu Hình Card

**Ví dụ cấu hình:**
```json
{
  "rallyboard": {
    "keyPermission": "rallyboard",
    "assetId": "rallyboard-mount-asset-id",  // ← AssetId từ LOCAL_ASSET_MAPPING
    "name": "RallyBoard",
    "counter": {
      "min": 0,
      "max": 1
    }
  }
}
```

**Lưu ý:**
- `assetId` phải khớp với key trong `LOCAL_ASSET_MAPPING`
- Hoặc bạn có thể dùng path trực tiếp: `"assetId": "/assets/models/rallyboard-wall.glb"`

---

## Bước 4: Modify Product Component (Nếu Cần)

### 4.1. Kiểm Tra Product Component

**File:** `src/components/Assets/Product.tsx`

**Hiện tại:**
```typescript
const productGltf = useAsset({ assetId: productAssetId, configuration });
```

### 4.2. Cách 1: Dùng Path Trực Tiếp (Đơn Giản Nhất)

**Nếu bạn set `assetId` là path trực tiếp (ví dụ: `"/assets/models/rallyboard-wall.glb"`):**

Bạn cần modify `Product.tsx` để detect và load từ local file:

```typescript
import { useGLTF } from "@react-three/drei";
import { useLocalOrThreekitAsset, resolveAssetPath } from "../../utils/localAssetLoader";

export const Product: React.FC<ProductProps> = ({
  // ... props
}) => {
  // Resolve assetId thành path thực tế
  const resolvedAssetId = resolveAssetPath(productAssetId);
  
  // Load từ local hoặc Threekit
  const productGltf = useLocalOrThreekitAsset(
    resolvedAssetId,
    useAsset,  // Threekit loader
    configuration
  );
  
  // ... rest of code
};
```

### 4.3. Cách 2: Dùng useGLTF Trực Tiếp (Nếu Chỉ Dùng Local)

**Nếu bạn chỉ dùng local files (không dùng Threekit cho RallyBoard):**

```typescript
import { useGLTF } from "@react-three/drei";
import { isLocalAsset, resolveAssetPath } from "../../utils/localAssetLoader";

export const Product: React.FC<ProductProps> = ({
  // ... props
}) => {
  const resolvedAssetId = resolveAssetPath(productAssetId);
  
  let productGltf;
  if (isLocalAsset(resolvedAssetId)) {
    // Load từ local file
    productGltf = useGLTF(resolvedAssetId);
  } else {
    // Load từ Threekit
    productGltf = useAsset({ assetId: resolvedAssetId, configuration });
  }
  
  // ... rest of code
};
```

---

## Bước 5: Test

### 5.1. Các Bước Test

1. **Kiểm tra file GLB có trong `public/assets/models/` không:**
   - `rallyboard-wall.glb`
   - `rallyboard-credenza.glb`
   - `rallyboard-floor.glb`

2. **Kiểm tra mapping trong `localAssetLoader.ts`:**
   - AssetId có trong `LOCAL_ASSET_MAPPING` không?
   - Path có đúng không?

3. **Kiểm tra card config:**
   - `assetId` có khớp với key trong mapping không?

4. **Test load:**
   - Chọn RallyBoard từ UI
   - Kiểm tra console có lỗi không
   - Kiểm tra 3D scene có hiển thị RallyBoard không

### 5.2. Debug Nếu Không Hoạt Động

**Nếu GLB không load:**

1. **Kiểm tra path:**
   - Mở browser DevTools → Network tab
   - Xem request đến file GLB có 404 không
   - Path có đúng không? (ví dụ: `/assets/models/rallyboard-wall.glb`)

2. **Kiểm tra console errors:**
   - Có lỗi gì khi load GLB không?
   - Có lỗi về CORS không? (thường không xảy ra với file trong `public/`)

3. **Kiểm tra mapping:**
   - `resolveAssetPath()` có trả về đúng path không?
   - Console log: `console.log("Resolved asset path:", resolveAssetPath(assetId))`

---

## Tóm Tắt

### Để Load GLB Từ Local File:

1. ✅ **Đặt file GLB vào `public/assets/models/`**
2. ✅ **Thêm mapping vào `LOCAL_ASSET_MAPPING` trong `localAssetLoader.ts`**
3. ✅ **Cấu hình card với assetId từ mapping**
4. ✅ **Modify Product component để detect và load từ local file** (nếu cần)

### Ưu Điểm:

- ✅ Không cần upload lên Threekit
- ✅ Có thể test nhanh với file local
- ✅ Không phụ thuộc vào Threekit platform
- ✅ Có thể dùng cả Threekit và local files trong cùng project

### Lưu Ý:

- ⚠️ File GLB phải được đặt trong `public/` để có thể access qua URL
- ⚠️ Nếu dùng path trực tiếp, đảm bảo path bắt đầu với `/`
- ⚠️ `useGLTF` từ `@react-three/drei` sẽ tự động cache file, nên reload sẽ nhanh hơn

---

## Ví Dụ Hoàn Chỉnh

### 1. File Structure:
```
public/
  assets/
    models/
      rallyboard-wall.glb
```

### 2. Mapping (`localAssetLoader.ts`):
```typescript
export const LOCAL_ASSET_MAPPING: Record<string, string> = {
  "rallyboard-mount-asset-id": "/assets/models/rallyboard-wall.glb",
};
```

### 3. Card Config:
```json
{
  "rallyboard": {
    "keyPermission": "rallyboard",
    "assetId": "rallyboard-mount-asset-id",
    "name": "RallyBoard"
  }
}
```

### 4. Product Component:
```typescript
const resolvedAssetId = resolveAssetPath(productAssetId);
const productGltf = useLocalOrThreekitAsset(
  resolvedAssetId,
  useAsset,
  configuration
);
```

### 5. Kết Quả:
- Khi user chọn RallyBoard
- `assetId` = `"rallyboard-mount-asset-id"`
- `resolveAssetPath()` → `"/assets/models/rallyboard-wall.glb"`
- `useGLTF()` load file từ local
- ✅ RallyBoard hiển thị!

