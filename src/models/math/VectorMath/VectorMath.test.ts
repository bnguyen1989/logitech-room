import { VectorMath } from "./VectorMath";
import { PlaneOrientationT } from "./type";
import { ArrVector3T } from "../../../types/mathType";

describe("VectorMath", () => {
  describe("isHorizontal", () => {
    it("returns true for horizontal position on XY plane within tolerance", () => {
      const vectorMath = new VectorMath("XY", 0.01);
      const pos1: ArrVector3T = [1, 1, 0];
      const pos2: ArrVector3T = [2, 1, 0];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(true);
    });

    it("returns false for non-horizontal position on XY plane", () => {
      const vectorMath = new VectorMath("XY", 0.01);
      const pos1: ArrVector3T = [1, 1, 0];
      const pos2: ArrVector3T = [1, 2, 0];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(false);
    });

    it("returns true for horizontal position on XZ plane within tolerance", () => {
      const vectorMath = new VectorMath("XZ", 0.01);
      const pos1: ArrVector3T = [1, 0, 1];
      const pos2: ArrVector3T = [2, 0, 1];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(true);
    });

    it("returns false for non-horizontal position on XZ plane", () => {
      const vectorMath = new VectorMath("XZ", 0.01);
      const pos1: ArrVector3T = [1, 0, 1];
      const pos2: ArrVector3T = [1, 0, 2];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(false);
    });

    it("returns true for horizontal position on YZ plane within tolerance", () => {
      const vectorMath = new VectorMath("YZ", 0.01);
      const pos1: ArrVector3T = [0, 1, 1];
      const pos2: ArrVector3T = [0, 2, 1];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(true);
    });

    it("returns false for non-horizontal position on YZ plane", () => {
      const vectorMath = new VectorMath("YZ", 0.01);
      const pos1: ArrVector3T = [0, 1, 1];
      const pos2: ArrVector3T = [0, 1, 2];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(false);
    });

    it("returns false for unknown plane", () => {
      const vectorMath = new VectorMath("Unknown" as PlaneOrientationT, 0.01);
      const pos1: ArrVector3T = [1, 1, 1];
      const pos2: ArrVector3T = [2, 2, 2];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(false);
    });
  });

  describe("isVertical", () => {
    it("returns true for vertical position on XY plane within tolerance", () => {
      const vectorMath = new VectorMath("XY", 0.01);
      const pos1: ArrVector3T = [1, 1, 0];
      const pos2: ArrVector3T = [1, 2, 0];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(true);
    });

    it("returns false for non-vertical position on XY plane", () => {
      const vectorMath = new VectorMath("XY", 0.01);
      const pos1: ArrVector3T = [1, 1, 0];
      const pos2: ArrVector3T = [2, 1, 0];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(false);
    });

    it("returns true for vertical position on XZ plane within tolerance", () => {
      const vectorMath = new VectorMath("XZ", 0.01);
      const pos1: ArrVector3T = [1, 0, 1];
      const pos2: ArrVector3T = [1, 0, 2];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(true);
    });

    it("returns false for non-vertical position on XZ plane", () => {
      const vectorMath = new VectorMath("XZ", 0.01);
      const pos1: ArrVector3T = [1, 0, 1];
      const pos2: ArrVector3T = [2, 0, 1];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(false);
    });

    it("returns true for vertical position on YZ plane within tolerance", () => {
      const vectorMath = new VectorMath("YZ", 0.01);
      const pos1: ArrVector3T = [0, 1, 1];
      const pos2: ArrVector3T = [0, 1, 2];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(true);
    });

    it("returns false for non-vertical position on YZ plane", () => {
      const vectorMath = new VectorMath("YZ", 0.01);
      const pos1: ArrVector3T = [0, 1, 1];
      const pos2: ArrVector3T = [0, 2, 1];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(false);
    });

    it("returns false for unknown plane", () => {
      const vectorMath = new VectorMath("Unknown" as PlaneOrientationT, 0.01);
      const pos1: ArrVector3T = [1, 1, 1];
      const pos2: ArrVector3T = [2, 2, 2];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(false);
    });
  });

  describe("getPerpendicularPoints", () => {
    it("returns perpendicular points on XY plane", () => {
      const vectorMath = new VectorMath("XY");
      const pos1: ArrVector3T = [1, 1, 0];
      const pos2: ArrVector3T = [2, 1, 0];
      const [point1, point2] = vectorMath.getPerpendicularPoints(pos1, pos2, 1);
      expect(point1).toEqual([1, 0, 0]);
      expect(point2).toEqual([1, 2, 0]);
    });

    it("returns perpendicular points on XZ plane", () => {
      const vectorMath = new VectorMath("XZ");
      const pos1: ArrVector3T = [1, 0, 1];
      const pos2: ArrVector3T = [2, 0, 1];
      const [point1, point2] = vectorMath.getPerpendicularPoints(pos1, pos2, 1);
      expect(point1).toEqual([1, 0, 0]);
      expect(point2).toEqual([1, 0, 2]);
    });
  });

  describe("getMidPoint", () => {
    it("returns midpoint between two points", () => {
      const pos1: ArrVector3T = [1, 1, 0];
      const pos2: ArrVector3T = [3, 3, 0];
      expect(VectorMath.getMidPoint(pos1, pos2)).toEqual([2, 2, 0]);
    });
  });

  describe("getDirection", () => {
    it("returns unit direction vector between two points", () => {
      const vectorMath = new VectorMath("XY");
      const pos1: ArrVector3T = [1, 1, 0];
      const pos2: ArrVector3T = [4, 5, 0];
      expect(vectorMath.getDirection(pos1, pos2)).toEqual([0.6, 0.8, 0]);
    });

    it("returns zero vector if points are the same", () => {
      const vectorMath = new VectorMath("XY");
      const pos1: ArrVector3T = [1, 1, 1];
      const pos2: ArrVector3T = [1, 1, 1];
      expect(vectorMath.getDirection(pos1, pos2)).toEqual([0, 0, 0]);
    });
  });

  describe("getDistance", () => {
    it("returns distance between two points", () => {
      const vectorMath = new VectorMath("XY");
      const pos1: ArrVector3T = [1, 1, 0];
      const pos2: ArrVector3T = [4, 5, 0];
      expect(vectorMath.getDistance(pos1, pos2)).toBeCloseTo(5);
    });

    it("returns zero if points are the same", () => {
      const vectorMath = new VectorMath("XY");
      const pos1: ArrVector3T = [1, 1, 1];
      const pos2: ArrVector3T = [1, 1, 1];
      expect(vectorMath.getDistance(pos1, pos2)).toBe(0);
    });
  });

  describe("movePoint", () => {
    it("moves point in specified direction and distance", () => {
      const vectorMath = new VectorMath("XY");
      const pos: ArrVector3T = [1, 1, 0];
      const direction: ArrVector3T = [0, 1, 0];
      const movedPoint = vectorMath.movePoint(pos, direction, 2);
      expect(movedPoint).toEqual([1, 3, 0]);
    });
  });
});
