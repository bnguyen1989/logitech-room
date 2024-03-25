import { CountableMountElement } from "../CountableMountElement";

describe("CountableMountElement", () => {
  describe("get correct name node", () => {
    test("Get Correct Name Node when Index Available", () => {
      const mountElement = new CountableMountElement("name", "node");
      mountElement.setMin(0);
      mountElement.setMax(5);
      mountElement.setActiveIndex(3);
      expect(mountElement.getNameNode()).toBe("node_3");
    });

    test("Get Correct Name Node with Unavailable Index Added", () => {
      const mountElement = new CountableMountElement("name", "node");
      mountElement.setMin(0);
      mountElement.setMax(4);
      mountElement.setActiveIndex(3);
      mountElement.addNotAvailableIndex(3);
      expect(mountElement.getNameNode()).toBe("node_4");
    });

    test("Get Correct Name Node with Multiple Unavailable Indices Added", () => {
      const mountElement = new CountableMountElement("name", "node");
      mountElement.setMin(0);
      mountElement.setMax(3);
      mountElement.setActiveIndex(3);
      mountElement.addNotAvailableIndex(3);
      mountElement.addNotAvailableIndex(4);
      expect(mountElement.getNameNode()).toBe("node_5");
    });

    test("Ensure Name Node Doesn't Exceed Maximum Index", () => {
      const mountElement = new CountableMountElement("name", "node");
      mountElement.setMin(0);
      mountElement.setMax(2);
      mountElement.setActiveIndex(3);
      mountElement.addNotAvailableIndex(3);
      mountElement.addNotAvailableIndex(4);
      mountElement.addNotAvailableIndex(5);
      expect(mountElement.getNameNode()).not.toBe("node_6");
    });
  });

  describe("get correct range name node", () => {
    test("Get Correct Range Name Node", () => {
      const mountElement = new CountableMountElement("name", "node");
      mountElement.setMin(0);
      mountElement.setMax(5);
      expect(mountElement.getRangeNameNode()).toEqual([
        "node_1",
        "node_2",
        "node_3",
        "node_4",
        "node_5",
      ]);
    });

    test("Get Correct Range Name Node with Unavailable Index Added", () => {
      const mountElement = new CountableMountElement("name", "node");
      mountElement.setMin(0);
      mountElement.setMax(4);
      mountElement.addNotAvailableIndex(3);
      expect(mountElement.getRangeNameNode()).toEqual([
        "node_1",
        "node_2",
        "node_4",
        "node_5",
      ]);
    });

    test("Get Correct Range Name Node with Multiple Unavailable Indices Added", () => {
      const mountElement = new CountableMountElement("name", "node");
      mountElement.setMin(0);
      mountElement.setMax(3);
      mountElement.addNotAvailableIndex(3);
      mountElement.addNotAvailableIndex(4);
      expect(mountElement.getRangeNameNode()).toEqual([
        "node_1",
        "node_2",
        "node_5",
      ]);
    });
  });

  describe("get correct available name node", () => {
    test("Get Correct Available Name Node", () => {
      const mountElement = new CountableMountElement("name", "node");
      mountElement.setMin(0);
      mountElement.setMax(5);
      mountElement.setActiveIndex(3);
      expect(mountElement.getAvailableNameNode()).toEqual(["node_1", "node_2", "node_3"]);
    });

    test("Get Correct Available Name Node with Unavailable Index Added", () => {
      const mountElement = new CountableMountElement("name", "node");
      mountElement.setMin(0);
      mountElement.setMax(3);
      mountElement.setActiveIndex(3);
      mountElement.addNotAvailableIndex(3);
      expect(mountElement.getAvailableNameNode()).toEqual([
        "node_1",
        "node_2",
        "node_4",
      ]);
    });

    test("Get Correct Available Name Node with Multiple Unavailable Indices Added", () => {
      const mountElement = new CountableMountElement("name", "node");
      mountElement.setMin(0);
      mountElement.setMax(4);
      mountElement.setActiveIndex(4);
      mountElement.addNotAvailableIndex(3);
      mountElement.addNotAvailableIndex(4);
      expect(mountElement.getAvailableNameNode()).toEqual([
        "node_1",
        "node_2",
        "node_5",
        "node_6",
      ]);
    });
  });
});
