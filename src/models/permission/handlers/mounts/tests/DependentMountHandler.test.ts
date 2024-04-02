import { CameraName } from "../../../../../utils/permissionUtils";
import { ItemElement } from "../../../elements/ItemElement";
import { MountElement } from "../../../elements/mounts/MountElement";
import { Step } from "../../../step/Step";
import { StepName } from "../../../type";
import { DependentMountHandler } from "../DependentMountHandler";

describe("DependentMountHandler", () => {
  test("should add dependent mounts when valid elements are present", () => {
    const step = new Step(StepName.ConferenceCamera);
    const rallyBar = new ItemElement(CameraName.RallyBar);
    rallyBar.setDefaultMount(new MountElement("Wall", "wall_node"));
    rallyBar.addDependenceMount(new MountElement("Table", "table_node"));
    rallyBar.addDependenceMount(new MountElement("Wall", "wall_node"));
    step.addValidElement(rallyBar);
    step.addActiveElement(rallyBar);

    new DependentMountHandler().handle(step);
    const validElements = step.getValidElements();
    expect(validElements.length).toBe(3);
  });

  test("if default mount included in dependent mounts, default mount must be active", () => {
    const step = new Step(StepName.ConferenceCamera);
    const rallyBar = new ItemElement(CameraName.RallyBar);
    rallyBar.setDefaultMount(new MountElement("Wall", "wall_node"));
    rallyBar.addDependenceMount(new MountElement("Table", "table_node"));
    rallyBar.addDependenceMount(new MountElement("Wall", "wall_node"));
    step.addValidElement(rallyBar);
    step.addActiveElement(rallyBar);

    new DependentMountHandler().handle(step);
    const activeElements = step.getActiveElements();
    expect(activeElements.length).toBe(2);
  });

  test("if default mount is not included in dependent mounts, default mount should not be active", () => {
    const step = new Step(StepName.ConferenceCamera);
    const rallyBar = new ItemElement(CameraName.RallyBar);
    rallyBar.setDefaultMount(new MountElement("Wall", "wall_node"));
    rallyBar.addDependenceMount(new MountElement("Table", "table_node"));
    step.addValidElement(rallyBar);
    step.addActiveElement(rallyBar);

    new DependentMountHandler().handle(step);
    const activeElements = step.getActiveElements();
    expect(activeElements.length).toBe(1);
  });
});
