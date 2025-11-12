# Hướng Dẫn: Hiển Thị Vị Trí Placement Nodes

## Component: PlacementNodesVisualizer

Component này giúp **visualize** (hiển thị trực quan) tất cả placement nodes trong scene, cho phép bạn biết chỗ nào có thể gắn sản phẩm.

---

## 1. Cách Sử Dụng

### 1.1. Import và Sử Dụng Trong Room.tsx

```typescript
// File: src/components/Assets/Room.tsx
import { PlacementNodesVisualizer } from "./PlacementNodesVisualizer";

export const Room: React.FC<RoomProps> = (props) => {
  const { roomAssetId, setSnapshotCameras } = props;
  const gltf = useScene({ assetId: roomAssetId });
  // ... existing code ...

  if (!gltf) return <></>;

  return (
    <>
      {three.camera && <primitive object={three.camera}></primitive>}
      <ambientLight intensity={1.5} color={"#ffffff"} />
      <GLTFNode threeNode={gltf.scene} nodeMatchers={ProductsNodes()} />
      <Dimension threeNode={gltf.scene} />
      <CameraRoom gltf={gltf} camera={three.camera} roomAssetId={roomAssetId} />
      
      {/* ⭐ Thêm PlacementNodesVisualizer */}
      <PlacementNodesVisualizer
        scene={gltf.scene}
        enabled={true}           // Bật/tắt visualization
        showLabels={true}        // Hiển thị tên node
        markerSize={0.1}         // Kích thước marker
        markerColor="#ff0000"    // Màu marker (đỏ)
      />
    </>
  );
};
```

---

### 1.2. Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `scene` | `THREE.Object3D` | **required** | Scene object từ GLTF |
| `enabled` | `boolean` | `true` | Bật/tắt visualization |
| `showLabels` | `boolean` | `true` | Hiển thị tên node |
| `markerSize` | `number` | `0.1` | Kích thước marker (sphere radius) |
| `markerColor` | `string` | `"#ff0000"` | Màu marker (hex color) |

---

## 2. Tính Năng

### 2.1. Visual Markers

- **Red spheres** tại vị trí của mỗi placement node
- **Semi-transparent** để không che khuất scene
- **Emissive** để dễ nhìn thấy

### 2.2. Labels

- **Tên node** hiển thị phía trên marker
- **Black background** với border màu đỏ
- **Monospace font** để dễ đọc

### 2.3. Axes Helper

- **Axes helper** hiển thị hướng của node (X, Y, Z)
- Giúp biết rotation của placement node

---

## 3. Ví Dụ Sử Dụng

### 3.1. Bật Visualization (Development)

```typescript
// Luôn bật trong development
<PlacementNodesVisualizer
  scene={gltf.scene}
  enabled={process.env.NODE_ENV === 'development'}
  showLabels={true}
/>
```

### 3.2. Toggle Bằng State

```typescript
const [showPlacements, setShowPlacements] = useState(false);

return (
  <>
    {/* Toggle button */}
    <button onClick={() => setShowPlacements(!showPlacements)}>
      {showPlacements ? 'Ẩn' : 'Hiện'} Placement Nodes
    </button>

    {/* Visualizer */}
    <PlacementNodesVisualizer
      scene={gltf.scene}
      enabled={showPlacements}
    />
  </>
);
```

### 3.3. Màu Khác Nhau Cho Từng Loại

```typescript
// Tùy chỉnh màu theo loại placement
const getColorForPlacement = (name: string): string => {
  if (name.includes('Mic')) return '#00ff00';      // Xanh lá
  if (name.includes('Camera')) return '#0000ff';   // Xanh dương
  if (name.includes('Tap')) return '#ffff00';      // Vàng
  return '#ff0000';                                // Đỏ mặc định
};

// Sử dụng trong component (cần modify component để support)
```

---

## 4. Cải Tiến Có Thể

### 4.1. Phân Loại Màu Theo Loại Sản Phẩm

**Modify PlacementNodesVisualizer.tsx:**

```typescript
const getColorForPlacement = (name: string): string => {
  if (name.includes('Mic')) return '#00ff00';      // Xanh lá - Microphone
  if (name.includes('Camera')) return '#0000ff';   // Xanh dương - Camera
  if (name.includes('Tap')) return '#ffff00';      // Vàng - Tap
  if (name.includes('Scribe')) return '#ff00ff';   // Tím - Scribe
  return '#ff0000';                                // Đỏ - Khác
};

// Sử dụng trong render
<meshStandardMaterial
  color={getColorForPlacement(name)}
  // ...
/>
```

### 4.2. Hiển Thị Thông Tin Chi Tiết

**Thêm tooltip với thông tin:**

```typescript
<Html
  position={[0, markerSize + 0.05, 0]}
  center
>
  <div style={{ ... }}>
    <div>{name}</div>
    <div style={{ fontSize: '10px', opacity: 0.7 }}>
      Position: {worldPosition.x.toFixed(2)}, {worldPosition.y.toFixed(2)}, {worldPosition.z.toFixed(2)}
    </div>
  </div>
</Html>
```

### 4.3. Click Để Highlight

**Thêm onClick handler:**

```typescript
const [selectedNode, setSelectedNode] = useState<string | null>(null);

// Trong marker
<mesh
  onClick={(e) => {
    e.stopPropagation();
    setSelectedNode(name);
    console.log('Selected placement:', name, worldPosition);
  }}
  onPointerOver={(e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  }}
  onPointerOut={(e) => {
    document.body.style.cursor = 'default';
  }}
>
  {/* ... */}
</mesh>
```

---

## 5. Troubleshooting

### 5.1. Không Thấy Markers

**Nguyên nhân:**
- Placement nodes không có trong scene
- Tên nodes không khớp với PlacementManager

**Giải pháp:**
```typescript
// Thêm debug log
useEffect(() => {
  if (!gltf) return;
  
  const allPlacements = PlacementManager.getAllPlacement();
  const found: string[] = [];
  
  gltf.scene.traverse((node) => {
    if (node.name && allPlacements.includes(node.name)) {
      found.push(node.name);
    }
  });
  
  console.log(`Found ${found.length} placement nodes:`, found);
}, [gltf]);
```

### 5.2. Markers Ở Sai Vị Trí

**Nguyên nhân:**
- Placement nodes có parent transforms
- World position không được tính đúng

**Giải pháp:**
- Component đã sử dụng `getWorldPosition()` để tính world position
- Nếu vẫn sai, check parent transforms của nodes

### 5.3. Labels Không Hiển Thị

**Nguyên nhân:**
- `@react-three/drei` chưa được install
- `showLabels={false}`

**Giải pháp:**
```bash
npm install @react-three/drei
```

---

## 6. Tùy Chỉnh Nâng Cao

### 6.1. Marker Shape Khác

**Thay sphere bằng box:**

```typescript
<mesh>
  <boxGeometry args={[markerSize, markerSize, markerSize]} />
  {/* ... */}
</mesh>
```

**Thay bằng wireframe:**

```typescript
<mesh>
  <sphereGeometry args={[markerSize, 16, 16]} />
  <meshStandardMaterial
    wireframe
    color={markerColor}
  />
</mesh>
```

### 6.2. Animation

**Thêm pulse animation:**

```typescript
import { useFrame } from "@react-three/fiber";

// Trong component
const scale = useRef(1);

useFrame((state) => {
  scale.current = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
});

// Trong mesh
<mesh scale={scale.current}>
  {/* ... */}
</mesh>
```

---

## 7. Kết Luận

**PlacementNodesVisualizer giúp:**
- ✅ **Visualize** tất cả placement nodes
- ✅ **Debug** vị trí có thể gắn sản phẩm
- ✅ **Kiểm tra** xem nodes có đúng vị trí không
- ✅ **Phát hiện** nodes missing hoặc mismatch

**Sử dụng khi:**
- Development và debugging
- Kiểm tra scene có đủ placement nodes
- Verify vị trí nodes có đúng không
- Training/onboarding để hiểu hệ thống

**Tắt khi:**
- Production (có thể dùng `enabled={process.env.NODE_ENV === 'development'}`)
- Không cần debug nữa

