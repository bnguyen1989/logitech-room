import { ArrVector3T } from "../../../types/mathType";
import { PlaneOrientationT } from "./type";

export class VectorMath {
  private plane: PlaneOrientationT;
  private tolerance: number;

  public static getMidPoint(pos1: ArrVector3T, pos2: ArrVector3T): ArrVector3T {
    return [
      (pos1[0] + pos2[0]) / 2,
      (pos1[1] + pos2[1]) / 2,
      (pos1[2] + pos2[2]) / 2,
    ];
  }

  constructor(plane: PlaneOrientationT, tolerance: number = 1e-3) {
    this.plane = plane;
    this.tolerance = tolerance;
  }

  public isHorizontal(pos1: ArrVector3T, pos2: ArrVector3T): boolean {
    switch (this.plane) {
      case "XY":
        return (
          Math.abs(pos1[1] - pos2[1]) < this.tolerance &&
          Math.abs(pos1[0] - pos2[0]) > this.tolerance
        );
      case "XZ":
        return (
          Math.abs(pos1[2] - pos2[2]) < this.tolerance &&
          Math.abs(pos1[0] - pos2[0]) > this.tolerance
        );
      case "YZ":
        return (
          Math.abs(pos1[2] - pos2[2]) < this.tolerance &&
          Math.abs(pos1[1] - pos2[1]) > this.tolerance
        );
      default:
        return false;
    }
  }

  public isVertical(pos1: ArrVector3T, pos2: ArrVector3T): boolean {
    switch (this.plane) {
      case "XY":
        return (
          Math.abs(pos1[0] - pos2[0]) < this.tolerance &&
          Math.abs(pos1[1] - pos2[1]) > this.tolerance
        );
      case "XZ":
        return (
          Math.abs(pos1[0] - pos2[0]) < this.tolerance &&
          Math.abs(pos1[2] - pos2[2]) > this.tolerance
        );
      case "YZ":
        return (
          Math.abs(pos1[1] - pos2[1]) < this.tolerance &&
          Math.abs(pos1[2] - pos2[2]) > this.tolerance
        );
      default:
        return false;
    }
  }

  public getPerpendicularPoints(
    pos1: ArrVector3T,
    pos2: ArrVector3T,
    distance: number = 1
  ): [ArrVector3T, ArrVector3T] {
    let direction: ArrVector3T = [0, 0, 0];

    switch (this.plane) {
      case "XY":
        direction = [pos2[1] - pos1[1], pos1[0] - pos2[0], 0];
        break;
      case "XZ":
        direction = [pos2[2] - pos1[2], 0, pos1[0] - pos2[0]];
        break;
      case "YZ":
        direction = [0, pos2[2] - pos1[2], pos1[1] - pos2[1]];
        break;
      default:
        throw new Error("Invalid plane orientation");
    }

    const length = Math.sqrt(
      direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2
    );
    direction = direction.map(
      (coord) => (coord / length) * distance
    ) as ArrVector3T;

    const point1: ArrVector3T = [
      pos1[0] + direction[0],
      pos1[1] + direction[1],
      pos1[2] + direction[2],
    ];
    const point2: ArrVector3T = [
      pos1[0] - direction[0],
      pos1[1] - direction[1],
      pos1[2] - direction[2],
    ];

    return [point1, point2];
  }

  public movePoint(
    pos: ArrVector3T,
    direction: ArrVector3T,
    distance: number
  ): ArrVector3T {
    const length = Math.sqrt(
      direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2
    );
    const unitDirection: ArrVector3T = direction.map(
      (coord) => coord / length
    ) as ArrVector3T;

    const scaledDirection: ArrVector3T = unitDirection.map(
      (coord) => coord * distance
    ) as ArrVector3T;

    return [
      pos[0] + scaledDirection[0],
      pos[1] + scaledDirection[1],
      pos[2] + scaledDirection[2],
    ];
  }

  public getDirection(pos1: ArrVector3T, pos2: ArrVector3T): ArrVector3T {
    const direction: ArrVector3T = [
      pos2[0] - pos1[0],
      pos2[1] - pos1[1],
      pos2[2] - pos1[2],
    ];

    const length = Math.sqrt(
      direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2
    );

    if (length === 0) {
      return [0, 0, 0];
    }
    return direction.map((coord) => coord / length) as ArrVector3T;
  }

  public getDistance(pos1: ArrVector3T, pos2: ArrVector3T): number {
    const dx = pos2[0] - pos1[0];
    const dy = pos2[1] - pos1[1];
    const dz = pos2[2] - pos1[2];

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
