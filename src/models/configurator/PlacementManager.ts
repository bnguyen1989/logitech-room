export class PlacementManager {
  public static getNameNodeForMic(id?: number): string {
    if (!id) return `Mic_Placement`;
    return `Mic_Placement_${id}`;
  }

  public static getNameNodeForTap(type: "Wall" | "Table", id: number): string {
    return `Tap_Placement_${type}_${id}`;
  }

  public static getNameNodeForCamera(type: "Wall" | "TV", id: number): string {
    return `Camera_${type}_Placement_${id}`;
  }

  public static getNameNodeCommodeForCamera(
    type: "RallyBar" | "Huddle" | "Mini"
  ): string {
    return `Camera_Commode_${type}`;
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

  public static getNameNodePodPendantMount(): string {
    return "Pod_Pendant_Mount_Point";
  }

  public static getNameNodeAngleMountScheduler(): string {
    return "Angle_Mount_scheduler_point";
  }

  public static getNameNodeSideMountScheduler(): string {
    return "Side_Mount_scheduler_point";
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

    ["Wall", "TV"].forEach((type: any) => {
      Array.from({ length: 2 }, (_, i) => i + 1).forEach((num) =>
        placements.push(this.getNameNodeForCamera(type, num))
      );
    });

    Array.from({ length: 3 }, (_, i) => i + 1).forEach((num) =>
      placements.push(this.getNameNodePendantMount(num))
    );

    placements.push(
      this.getNameNodeForScribe(),
      this.getNameNodeSwytch(),
      this.getNameNodeScheduler(),
      this.getNameNodeMicPodMount(),
      this.getNameNodeTapRiserMount(),
      this.getNameNodeTapTableMount(),
      this.getNameNodeCameraWallMount(),
      this.getNameNodeCameraTVMount(),
      this.getNameNodePodPendantMount(),
      this.getNameNodeAngleMountScheduler(),
      this.getNameNodeSideMountScheduler(),
      this.getNameNodeCommodeForCamera("RallyBar"),
      this.getNameNodeCommodeForCamera("Huddle"),
      this.getNameNodeCommodeForCamera("Mini")
    );

    return placements;
  }
}
