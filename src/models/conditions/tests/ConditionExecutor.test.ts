import { Condition } from "../Condition";
import { ConditionChangeBuilder } from "../ConditionChangeBuilder";
import { ConditionExecutor } from "../ConditionExecutor";

describe("ConditionExecutor", () => {
  describe("applyChangesIfConditionsMet", () => {
    test("should apply changes when condition properties match", () => {
      const conditionExecutor = new ConditionExecutor().addConditionWithChanges(
        new ConditionChangeBuilder()
          .setCondition(
            new Condition("keyPermission1")
              .addProperty("active", true)
              .addProperty("count", 1)
          )
          .addChange("key1", "value1")
          .build()
      );

      const activeNames = ["keyPermission1"];
      const property = { count: 1 };
      const result = conditionExecutor.applyChangesIfConditionsMet(
        property,
        activeNames
      );
      expect(result).toEqual({ key1: "value1" });
    });

    test("should not apply changes when condition properties do not match", () => {
      const conditionExecutor = new ConditionExecutor().addConditionWithChanges(
        new ConditionChangeBuilder()
          .setCondition(
            new Condition("keyPermission2")
              .addProperty("active", false)
              .addProperty("count", 3)
          )
          .addChange("key2", "value2")
          .build()
      );

      const activeNames = ["keyPermission2"];
      const property = { count: 1 };
      const result = conditionExecutor.applyChangesIfConditionsMet(
        property,
        activeNames
      );
      expect(result).toEqual({});
    });

    test("should apply changes when condition and dependent conditions are met", () => {
      const conditionExecutor = new ConditionExecutor().addConditionWithChanges(
        new ConditionChangeBuilder()
          .setCondition(
            new Condition("keyPermission3")
              .addProperty("active", true)
              .addProperty("count", 2)
              .addDependentCondition(
                new Condition("keyPermission4").addProperty("active", true)
              )
              .addDependentCondition(
                new Condition("keyPermission5").addProperty("active", true)
              )
          )
          .addChange("key3", "value3")
          .build()
      );

      const activeNames = [
        "keyPermission3",
        "keyPermission4",
        "keyPermission5",
      ];
      const property = { count: 2 };
      const result = conditionExecutor.applyChangesIfConditionsMet(
        property,
        activeNames
      );
      expect(result).toEqual({ key3: "value3" });
    });
  });
});
