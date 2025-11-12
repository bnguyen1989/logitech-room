# Code Debug: Log Tất Cả Nodes Và Meshes Trong Scene

## Code Để Thêm Vào Room.tsx

Thêm đoạn code này vào `useEffect` trong `Room.tsx`, sau khi `gltf` được load (sau dòng 96, trước đoạn code traverse hiện tại).

### Code Đầy Đủ

```typescript
useEffect(() => {
  console.log("🔄 Room useEffect triggered:", { hasGltf: !!gltf });

  if (!gltf) {
    console.log("⏳ Waiting for GLTF to load...");
    return;
  }

  console.log("✅ GLTF loaded:", {
    hasScene: !!gltf.scene,
    hasCameras: !!gltf.cameras,
    cameras: Object.keys(gltf.cameras || {}),
  });

  try {
    dispatch(changeStatusBuilding(false));

    const { "1": Front, "2": Left } = gltf.cameras;

    if (Front && Left) {
      setSnapshotCameras({
        Front: new THREE.PerspectiveCamera().copy(
          Front as THREE.PerspectiveCamera
        ),
        Left: new THREE.PerspectiveCamera().copy(
          Left as THREE.PerspectiveCamera
        ),
      });
    }

    const domeLight = gltf.scene.userData.domeLight;
    const camera = gltf.scene.userData.camera as THREE.PerspectiveCamera;

    if (domeLight?.image) {
      three.scene.environment = domeLight.image;
    }

    if (camera) {
      setMainCamera(camera);
    }

    // ============================================
    // CODE DEBUG: LOG TẤT CẢ NODES VÀ MESHES
    // ============================================
    
    console.log("==========================================");
    console.log("🔍 DEBUG: LOG TẤT CẢ NODES VÀ MESHES");
    console.log("==========================================");

    // 1. Log tất cả nodes (bao gồm cả Object3D và Mesh)
    console.log("\n📋 TẤT CẢ NODES TRONG SCENE:");
    const allNodes: Array<{ name: string; type: string; position: THREE.Vector3 }> = [];
    gltf.scene.traverse((node) => {
      if (node.name) {
        allNodes.push({
          name: node.name,
          type: node.constructor.name,
          position: node.position.clone(),
        });
      }
    });
    console.table(allNodes);
    console.log(`Tổng số nodes: ${allNodes.length}`);

    // 2. Log tất cả meshes riêng biệt
    console.log("\n🎨 TẤT CẢ MESHES TRONG SCENE:");
    const allMeshes: Array<{
      name: string;
      position: { x: number; y: number; z: number };
      visible: boolean;
    }> = [];
    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh && node.isMesh) {
        allMeshes.push({
          name: node.name,
          position: {
            x: node.position.x,
            y: node.position.y,
            z: node.position.z,
          },
          visible: node.visible,
        });
      }
    });
    console.table(allMeshes);
    console.log(`Tổng số meshes: ${allMeshes.length}`);

    // 3. Tìm TV mesh
    console.log("\n📺 TÌM TV MESH:");
    const tvMeshes: Array<{
      name: string;
      position: { x: number; y: number; z: number };
      visible: boolean;
    }> = [];
    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh && node.isMesh) {
        const nameLower = node.name.toLowerCase();
        if (
          nameLower.includes("tv") ||
          nameLower.includes("display") ||
          nameLower.includes("screen") ||
          nameLower.includes("monitor")
        ) {
          tvMeshes.push({
            name: node.name,
            position: {
              x: node.position.x,
              y: node.position.y,
              z: node.position.z,
            },
            visible: node.visible,
          });
        }
      }
    });
    if (tvMeshes.length > 0) {
      console.table(tvMeshes);
      console.log("✅ Tìm thấy TV mesh(es):", tvMeshes.map((m) => m.name));
    } else {
      console.log("❌ Không tìm thấy TV mesh");
    }

    // 4. Tìm Credenza mesh
    console.log("\n🪑 TÌM CREDENZA MESH:");
    const credenzaMeshes: Array<{
      name: string;
      position: { x: number; y: number; z: number };
      visible: boolean;
    }> = [];
    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh && node.isMesh) {
        const nameLower = node.name.toLowerCase();
        if (
          nameLower.includes("credenza") ||
          nameLower.includes("cabinet") ||
          nameLower.includes("furniture") ||
          nameLower.includes("desk") ||
          nameLower.includes("table")
        ) {
          credenzaMeshes.push({
            name: node.name,
            position: {
              x: node.position.x,
              y: node.position.y,
              z: node.position.z,
            },
            visible: node.visible,
          });
        }
      }
    });
    if (credenzaMeshes.length > 0) {
      console.table(credenzaMeshes);
      console.log("✅ Tìm thấy Credenza mesh(es):", credenzaMeshes.map((m) => m.name));
    } else {
      console.log("❌ Không tìm thấy Credenza mesh");
    }

    // 5. Tìm Placement Nodes
    console.log("\n📍 TÌM PLACEMENT NODES:");
    const placementNodes: Array<{
      name: string;
      type: string;
      position: { x: number; y: number; z: number };
    }> = [];
    gltf.scene.traverse((node) => {
      if (node.name) {
        const nameLower = node.name.toLowerCase();
        if (nameLower.includes("placement")) {
          placementNodes.push({
            name: node.name,
            type: node.constructor.name,
            position: {
              x: node.position.x,
              y: node.position.y,
              z: node.position.z,
            },
          });
        }
      }
    });
    if (placementNodes.length > 0) {
      console.table(placementNodes);
      console.log("✅ Tìm thấy Placement nodes:", placementNodes.map((n) => n.name));
    } else {
      console.log("❌ Không tìm thấy Placement nodes");
    }

    // 6. Tìm cụ thể placement node Camera_Commode_mini_display_1
    console.log("\n🎯 TÌM PLACEMENT NODE: Camera_Commode_mini_display_1");
    let targetPlacementNode: THREE.Object3D | null = null;
    gltf.scene.traverse((node) => {
      if (node.name === "Camera_Commode_mini_display_1") {
        targetPlacementNode = node;
      }
    });
    if (targetPlacementNode) {
      console.log("✅ Tìm thấy Camera_Commode_mini_display_1:");
      console.log("  - Position:", {
        x: targetPlacementNode.position.x,
        y: targetPlacementNode.position.y,
        z: targetPlacementNode.position.z,
      });
      console.log("  - Rotation:", {
        x: targetPlacementNode.rotation.x,
        y: targetPlacementNode.rotation.y,
        z: targetPlacementNode.rotation.z,
      });
      console.log("  - Scale:", {
        x: targetPlacementNode.scale.x,
        y: targetPlacementNode.scale.y,
        z: targetPlacementNode.scale.z,
      });
    } else {
      console.log("❌ Không tìm thấy Camera_Commode_mini_display_1");
    }

    // 7. Log hierarchy (cấu trúc cây) của scene
    console.log("\n🌳 HIERARCHY CỦA SCENE:");
    logNode(gltf.scene);

    console.log("==========================================");
    console.log("✅ HOÀN THÀNH DEBUG LOG");
    console.log("==========================================");

    // ============================================
    // KẾT THÚC CODE DEBUG
    // ============================================

    // Code hiện tại: traverse để set material envMapIntensity
    gltf.scene.traverse((node) => {
      if (node instanceof THREE.Mesh && node.isMesh) {
        const materials = Array.isArray(node.material)
          ? node.material
          : [node.material];

        materials.forEach((material) => {
          if (
            material instanceof THREE.MeshStandardMaterial &&
            domeLight?.intensity
          ) {
            material.envMapIntensity = domeLight.intensity;
          }
        });
      }
    });
  } catch (error) {
    console.error("Error setting up room scene:", error);
  }
}, [gltf, dispatch, setSnapshotCameras, three.scene, setMainCamera]);
```

## Cách Sử Dụng

1. **Mở file `src/components/Assets/Room.tsx`**
2. **Tìm `useEffect`** (khoảng dòng 57)
3. **Thêm đoạn code debug** sau dòng `setMainCamera(camera);` (sau dòng 96)
4. **Chạy ứng dụng** và mở Console trong browser
5. **Xem kết quả** trong Console:
   - Tất cả nodes trong scene
   - Tất cả meshes
   - TV mesh (nếu có)
   - Credenza mesh (nếu có)
   - Placement nodes
   - Placement node `Camera_Commode_mini_display_1` cụ thể
   - Hierarchy của scene

## Kết Quả Mong Đợi

Sau khi chạy, bạn sẽ thấy trong Console:

1. **Bảng tất cả nodes** - tên, type, position
2. **Bảng tất cả meshes** - tên, position, visible
3. **TV mesh(es)** - danh sách các mesh liên quan đến TV
4. **Credenza mesh(es)** - danh sách các mesh liên quan đến credenza
5. **Placement nodes** - tất cả nodes có chứa "placement" trong tên
6. **Placement node cụ thể** - thông tin chi tiết về `Camera_Commode_mini_display_1`
7. **Hierarchy** - cấu trúc cây của scene

## Lưu Ý

- Code này chỉ dùng để **debug**, sau khi tìm được tên mesh và nodes, có thể xóa hoặc comment lại
- Nếu không thấy TV hoặc credenza, có thể tên khác - kiểm tra lại trong bảng "TẤT CẢ MESHES"
- Nếu không thấy placement node `Camera_Commode_mini_display_1`, cần yêu cầu designer thêm vào scene

## Code Ngắn Gọn (Chỉ Log Tên)

Nếu bạn chỉ muốn log tên các nodes và meshes (không cần bảng chi tiết):

```typescript
// Log tất cả node names
console.log("📋 TẤT CẢ NODE NAMES:");
gltf.scene.traverse((node) => {
  if (node.name) {
    console.log(`  - ${node.name} [${node.constructor.name}]`);
  }
});

// Log tất cả mesh names
console.log("🎨 TẤT CẢ MESH NAMES:");
gltf.scene.traverse((node) => {
  if (node instanceof THREE.Mesh && node.isMesh) {
    console.log(`  - ${node.name} (visible: ${node.visible})`);
  }
});
```

