import { Condition } from "../Condition";

describe("Condition", () => {
  describe("checkCondition", () => {
    test("should return true when properties match exactly", () => {
      const condition = new Condition("keyPermission1");
      condition.addProperty("active", true);
      condition.addProperty("count", 1);

      const expectProperty = { active: true, count: 1 };
      expect(condition.checkCondition(expectProperty)).toBe(true);
    });

    test("should return false when a property value differs", () => {
      const condition = new Condition("keyPermission1");
      condition.addProperty("active", true);
      condition.addProperty("count", 1);

      const expectProperty = { active: true, count: 2 };
      expect(condition.checkCondition(expectProperty)).toBe(false);
    });

    test("should return true when expected properties have additional fields", () => {
      const condition = new Condition("keyPermission1");
      condition.addProperty("active", true);
      condition.addProperty("count", 1);

      const expectProperty = { active: true, count: 1, color: "White" };
      expect(condition.checkCondition(expectProperty)).toBe(true);
    });
  });
});
