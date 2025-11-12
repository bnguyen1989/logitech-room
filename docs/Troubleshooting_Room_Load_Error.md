# Troubleshooting: Room Không Load Được

## Các Bước Debug

### 1. Kiểm Tra Console Errors

Mở Browser DevTools (F12) và xem Console tab:
- Copy toàn bộ error message
- Copy stack trace
- Ghi lại file và line number gây lỗi

---

### 2. Kiểm Tra Network Tab

Xem Network tab trong DevTools:
- Scene có được load không? (GLTF file)
- Có request nào fail không?
- Status code là gì? (200, 404, 500, ...)

---

### 3. Kiểm Tra React DevTools

1. Mở React DevTools
2. Tìm component `Room`
3. Xem props có đúng không:
   - `roomAssetId` có giá trị?
   - `setSnapshotCameras` có được pass?

---

### 4. Thêm Debug Logs

**Thêm vào Room.tsx:**

```typescript
export const Room: React.FC<RoomProps> = (props) => {
  const { roomAssetId, setSnapshotCameras } = props;
  console.log("Room component render:", { roomAssetId });
  
  const dispatch = useDispatch();
  const gltf = useScene({ assetId: roomAssetId });
  const three = useThree();
  
  console.log("Room state:", {
    gltf: !!gltf,
    three: !!three,
    scene: !!three?.scene,
  });

  // ... rest of code
};
```

---

### 5. Kiểm Tra useThree Hook

**Lỗi có thể xảy ra nếu:**
- Component không nằm trong Canvas/Viewer context
- `useThree()` được gọi bên ngoài React Three Fiber context

**Kiểm tra:**
- Room component có được render bên trong `<Viewer>` không?
- Xem Player.tsx để confirm

---

### 6. Kiểm Tra GuideModal

**Nếu lỗi từ GuideModal:**
- Đã fix với optional chaining
- Nhưng có thể cần check thêm

**Tạm thời disable GuideModal:**

```typescript
// Trong Modals.tsx hoặc nơi render GuideModal
// Comment out để test
// <GuideModal />
```

---

### 7. Common Errors và Solutions

#### Error: "Cannot read properties of undefined"

**Nguyên nhân:** Object chưa được khởi tạo

**Solution:** Thêm optional chaining và null checks

```typescript
// ❌
gltf.scene.userData.domeLight.image

// ✅
gltf.scene?.userData?.domeLight?.image
```

---

#### Error: "useThree must be used within Canvas"

**Nguyên nhân:** Component không nằm trong Canvas context

**Solution:** Đảm bảo Room được render trong Viewer/Canvas

---

#### Error: "Cannot read properties of undefined (reading 'Dimension')"

**Nguyên nhân:** Language data chưa load

**Solution:** Đã fix với optional chaining trong GuideModal

---

## Quick Fix: Tạm Thời Disable Các Components

**Nếu vẫn lỗi, thử disable từng phần:**

### 1. Disable Dimension

```typescript
// Comment out
// <Dimension threeNode={gltf.scene} />
```

### 2. Disable CameraRoom

```typescript
// Comment out
// <CameraRoom gltf={gltf} camera={three.camera} roomAssetId={roomAssetId} />
```

### 3. Disable ProductsNodes

```typescript
// Comment out nodeMatchers
<GLTFNode threeNode={gltf.scene} nodeMatchers={undefined} />
```

---

## Code Debug Hoàn Chỉnh

**Thêm vào Room.tsx để debug:**

```typescript
export const Room: React.FC<RoomProps> = (props) => {
  const { roomAssetId, setSnapshotCameras } = props;
  
  console.group("🔍 Room Component Debug");
  console.log("Props:", { roomAssetId, hasSetSnapshotCameras: !!setSnapshotCameras });
  
  const dispatch = useDispatch();
  const gltf = useScene({ assetId: roomAssetId });
  const three = useThree();
  
  console.log("State:", {
    hasGltf: !!gltf,
    hasThree: !!three,
    hasScene: !!three?.scene,
    hasCamera: !!three?.camera,
  });
  
  useEffect(() => {
    if (!gltf) {
      console.log("⏳ Waiting for GLTF to load...");
      return;
    }
    
    console.log("✅ GLTF loaded:", {
      hasScene: !!gltf.scene,
      hasCameras: !!gltf.cameras,
      cameras: Object.keys(gltf.cameras || {}),
    });
    
    // ... rest of setup code
  }, [gltf]);
  
  console.groupEnd();
  
  // ... rest of component
};
```

---

## Nếu Vẫn Lỗi

**Vui lòng cung cấp:**
1. ✅ Full error message từ console
2. ✅ Stack trace
3. ✅ File và line number
4. ✅ Screenshot của error (nếu có)
5. ✅ Network tab - có request nào fail không?

**Hoặc thử:**
- Clear browser cache
- Restart dev server
- Check xem có conflict với code khác không

