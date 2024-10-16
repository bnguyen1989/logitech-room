export class PlacementManager {
  public static getNameNodeForTV(): string {
    return "Display_Placement_1";
  }
  public static getNameNodeWithoutInteraction(): string[] {
    return [this.getNameNodeForTV()];
  }

  public static getNameNodeForMic(id?: number): string {
    if (!id) return `Mic_Placement`;
    return `Mic_Placement_${id}`;
  }

  public static getNameNodeForMicWithSight(id?: number): string {
    if (!id) return `Mic_Placement_with_sight`;
    return `Mic_Placement_with_sight_${id}`;
  }

  public static getNameNodeForMicWithoutSight(id?: number): string {
    if (!id) return `Mic_Placement_not_sight`;
    return `Mic_Placement_not_sight_${id}`;
  }

  public static getNameNodeForMicSingle(id?: number): string {
    if (!id) return `Mic_Placement_Single`;
    return `Mic_Placement_Single_${id}`;
  }

  public static getNameNodeForMicDouble(id?: number): string {
    if (!id) return `Mic_Placement_Double`;
    return `Mic_Placement_Double_${id}`;
  }

  public static getNameNodeForTap(type: "Wall" | "Table", id: number): string {
    return `Tap_Placement_${type}_${id}`;
  }

  public static getNameNodeForCamera(
    type: "Wall" | "TV",
    id?: number,
    display?: number
  ): string {
    if (!id) return `Camera_${type}_Placement`;
    let nameNode = `Camera_${type}_Placement_${id}`;
    if (display) nameNode += `_display_${display}`;
    return nameNode;
  }

  public static getNameNodeForSight(): string {
    return "Sight_Placement";
  }

  public static getNameNodeForSight2(): string {
    return "Sight_Placement_2";
  }

  public static getNameNodeCommodeForCamera(
    type: "RallyBar" | "Huddle" | "Mini",
    display?: number
  ): string {
    let nameNode = `Camera_Commode_${type}`;
    if (display) nameNode += `_display_${display}`;
    return nameNode;
  }

  public static getNameNodeForScribe(): string {
    return "Scribe_Placement";
  }

  public static getNameNodeSwytch(): string {
    return "Swytch_Placement";
  }

  public static getNameNodeScheduler(): string {
    return "Scheduler_Placement";
  }

  public static getNameNodeMicPodMount(): string {
    return "Pod_Table_Mount_mic_point";
  }

  public static getNameNodeTapRiserMount(): string {
    return "Tap_Riser_Mount_Placement";
  }

  public static getNameNodeTapTableMount(): string {
    return "Tap_Table_Mount_Placement";
  }

  public static getNameNodeCameraWallMount(): string {
    return "Camera_Wall_Mount_Placement";
  }

  public static getNameNodeCameraTVMount(): string {
    return "Camera_TV_Mount_placement";
  }

  public static getNameNodePendantMount(id?: number): string {
    if (!id) return `Mic_Placement_pedant`;
    return `Mic_Placement_pedant_${id}`;
  }

  public static getNameNodePendantMountSingle(id?: number): string {
    if (!id) return `Mic_Placement_pedant_Single`;
    return `Mic_Placement_pedant_Single_${id}`;
  }

  public static getNameNodePendantMountDouble(id?: number): string {
    if (!id) return `Mic_Placement_pedant_Double`;
    return `Mic_Placement_pedant_Double_${id}`;
  }

  public static getNameNodePendantMountWithSight(id?: number): string {
    if (!id) return `Mic_Placement_pedant_with_sight`;
    return `Mic_Placement_pedant_with_sight_${id}`;
  }

  public static getNameNodePendantMountWithoutSight(id?: number): string {
    if (!id) return `Mic_Placement_pedant_not_sight`;
    return `Mic_Placement_pedant_not_sight_${id}`;
  }

  public static getNameNodePodPendantMount(): string {
    return "Pod_Pendant_Mount_Point";
  }

  public static getNameNodeAngleMountScheduler(): string {
    return "Angle_Mount_scheduler_point";
  }

  public static getNameNodeSideMountScheduler(): string {
    return "Side_Mount_scheduler_point";
  }
  public static getNameNodeCameraRalyPlus(): string {
    return "Camera_Placement_RalyPlus";
  }

  public static getNameNodeForLogitechExtend(): string {
    return "LogitechExtend_Placement";
  }

  public static getNameNodeCameraRallyPlusBackWall(): string[] {
    return [PlacementManager.getNameNodeForCamera("Wall", 4)];
  }
  public static getNameNodeCameraRallyPlusAboveTV(): string[] {
    return [
      PlacementManager.getNameNodeForCamera("Wall", 2),
      PlacementManager.getNameNodeForCamera("Wall", 3),
    ];
  }

  static getAllPlacement(): string[] {
    const placements: string[] = [];

    Array.from({ length: 7 }, (_, i) => i + 1).forEach((num) =>
      placements.push(this.getNameNodeForMic(num))
    );

    ["Wall", "Table"].forEach((type: any) => {
      Array.from({ length: 2 }, (_, i) => i + 1).forEach((num) =>
        placements.push(this.getNameNodeForTap(type, num))
      );
    });

    ["TV"].forEach((type: any) => {
      Array.from({ length: 2 }, (_, i) => i + 1).forEach((num) => {
        placements.push(this.getNameNodeForCamera(type, num));
        placements.push(this.getNameNodeForCamera(type, num, num));
        placements.push(this.getNameNodeForCamera(type, num, num + 1));
      });
    });

    ["Wall"].forEach((type: any) => {
      Array.from({ length: 4 }, (_, i) => i + 1).forEach((num) => {
        placements.push(this.getNameNodeForCamera(type, num));
        placements.push(this.getNameNodeForCamera(type, num, num));
        placements.push(this.getNameNodeForCamera(type, num, num + 1));
      });
    });

    Array.from({ length: 8 }, (_, i) => i + 1).forEach((num) =>
      placements.push(this.getNameNodePendantMount(num))
    );

    Array.from({ length: 4 }, (_, i) => i + 1).forEach((num) => {
      placements.push(this.getNameNodeForMicWithSight(num));
      placements.push(this.getNameNodeForMicWithoutSight(num));
    });

    Array.from({ length: 4 }, (_, i) => i + 1).forEach((num) => {
      placements.push(this.getNameNodePendantMountWithSight(num));
      placements.push(this.getNameNodePendantMountWithoutSight(num));
    });

    Array.from({ length: 2 }, (_, i) => i + 1).forEach((num) => {
      placements.push(this.getNameNodeForMicSingle(num));
      placements.push(this.getNameNodeForMicDouble(num));
    });

    Array.from({ length: 2 }, (_, i) => i + 1).forEach((num) => {
      placements.push(this.getNameNodePendantMountSingle(num));
      placements.push(this.getNameNodePendantMountDouble(num));
    });

    placements.push(
      this.getNameNodeForScribe(),
      this.getNameNodeSwytch(),
      this.getNameNodeScheduler(),
      this.getNameNodeMicPodMount(),
      this.getNameNodeTapRiserMount(),
      this.getNameNodeTapTableMount(),
      this.getNameNodeCameraWallMount(),
      this.getNameNodeCameraTVMount(),
      this.getNameNodeForSight(),
      this.getNameNodePodPendantMount(),
      this.getNameNodeAngleMountScheduler(),
      this.getNameNodeSideMountScheduler(),
      this.getNameNodeCommodeForCamera("RallyBar"),
      this.getNameNodeCommodeForCamera("RallyBar", 2),
      this.getNameNodeCommodeForCamera("Huddle"),
      this.getNameNodeCommodeForCamera("Mini"),
      this.getNameNodeCommodeForCamera("Mini", 1),
      this.getNameNodeForTV(),
      this.getNameNodeCameraRalyPlus(),
      this.getNameNodeForSight2(),
      this.getNameNodeForLogitechExtend()
    );

    return placements;
  }
}
