import { ArrVector3T } from "../../../types/mathType";
import { PlaneOrientationT } from "./type";

export class VectorMath {
  private plane: PlaneOrientationT;
  private tolerance: number;

  constructor(plane: PlaneOrientationT, tolerance: number = 0.01) {
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
}
