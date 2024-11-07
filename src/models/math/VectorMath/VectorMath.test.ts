import { VectorMath } from './VectorMath';
import { PlaneOrientationT } from './type';
import { ArrVector3T } from '../../../types/mathType';

describe('VectorMath', () => {
  describe('isHorizontal', () => {
    it('returns true for horizontal position on XY plane within tolerance', () => {
      const vectorMath = new VectorMath('XY', 0.01);
      const pos1: ArrVector3T = [1, 1, 0];
      const pos2: ArrVector3T = [2, 1, 0];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(true);
    });

    it('returns false for non-horizontal position on XY plane', () => {
      const vectorMath = new VectorMath('XY', 0.01);
      const pos1: ArrVector3T = [1, 1, 0];
      const pos2: ArrVector3T = [1, 2, 0];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(false);
    });

    it('returns true for horizontal position on XZ plane within tolerance', () => {
      const vectorMath = new VectorMath('XZ', 0.01);
      const pos1: ArrVector3T = [1, 0, 1];
      const pos2: ArrVector3T = [2, 0, 1];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(true);
    });

    it('returns false for non-horizontal position on XZ plane', () => {
      const vectorMath = new VectorMath('XZ', 0.01);
      const pos1: ArrVector3T = [1, 0, 1];
      const pos2: ArrVector3T = [1, 0, 2];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(false);
    });

    it('returns true for horizontal position on YZ plane within tolerance', () => {
      const vectorMath = new VectorMath('YZ', 0.01);
      const pos1: ArrVector3T = [0, 1, 1];
      const pos2: ArrVector3T = [0, 2, 1];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(true);
    });

    it('returns false for non-horizontal position on YZ plane', () => {
      const vectorMath = new VectorMath('YZ', 0.01);
      const pos1: ArrVector3T = [0, 1, 1];
      const pos2: ArrVector3T = [0, 1, 2];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(false);
    });

    it('returns false for unknown plane', () => {
      const vectorMath = new VectorMath('Unknown' as PlaneOrientationT, 0.01);
      const pos1: ArrVector3T = [1, 1, 1];
      const pos2: ArrVector3T = [2, 2, 2];
      expect(vectorMath.isHorizontal(pos1, pos2)).toBe(false);
    });
  });

  describe('isVertical', () => {
    it('returns true for vertical position on XY plane within tolerance', () => {
      const vectorMath = new VectorMath('XY', 0.01);
      const pos1: ArrVector3T = [1, 1, 0];
      const pos2: ArrVector3T = [1, 2, 0];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(true);
    });

    it('returns false for non-vertical position on XY plane', () => {
      const vectorMath = new VectorMath('XY', 0.01);
      const pos1: ArrVector3T = [1, 1, 0];
      const pos2: ArrVector3T = [2, 1, 0];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(false);
    });

    it('returns true for vertical position on XZ plane within tolerance', () => {
      const vectorMath = new VectorMath('XZ', 0.01);
      const pos1: ArrVector3T = [1, 0, 1];
      const pos2: ArrVector3T = [1, 0, 2];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(true);
    });

    it('returns false for non-vertical position on XZ plane', () => {
      const vectorMath = new VectorMath('XZ', 0.01);
      const pos1: ArrVector3T = [1, 0, 1];
      const pos2: ArrVector3T = [2, 0, 1];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(false);
    });

    it('returns true for vertical position on YZ plane within tolerance', () => {
      const vectorMath = new VectorMath('YZ', 0.01);
      const pos1: ArrVector3T = [0, 1, 1];
      const pos2: ArrVector3T = [0, 1, 2];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(true);
    });

    it('returns false for non-vertical position on YZ plane', () => {
      const vectorMath = new VectorMath('YZ', 0.01);
      const pos1: ArrVector3T = [0, 1, 1];
      const pos2: ArrVector3T = [0, 2, 1];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(false);
    });

    it('returns false for unknown plane', () => {
      const vectorMath = new VectorMath('Unknown' as PlaneOrientationT, 0.01);
      const pos1: ArrVector3T = [1, 1, 1];
      const pos2: ArrVector3T = [2, 2, 2];
      expect(vectorMath.isVertical(pos1, pos2)).toBe(false);
    });
  });
});
