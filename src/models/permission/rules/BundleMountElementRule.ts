import { ItemElement } from "../elements/ItemElement";
import { MountElement } from "../elements/mounts/MountElement";
import { Step } from "../step/Step";
import { Rule } from "./Rule";

export class BundleMountElementRule extends Rule {
  public name: string = "BundleMountElementRule";
  public element: ItemElement;
  public bundleElement: MountElement;

  constructor(element: ItemElement, bundleElement: MountElement) {
    super();
    this.element = element;
    this.bundleElement = bundleElement;
  }

  public validate(step: Step): boolean {
    const bundleMountsDependence = this.element.getBundleMountsDependence();
    const bundleMountDependence =
      bundleMountsDependence[this.bundleElement.name];
    if (!bundleMountDependence) return true;

    const chainActiveElements = step.getChainActiveElements().flat();
    return bundleMountDependence.some((bundleMountDependence) =>
      chainActiveElements.some(
        (element) => element.name === bundleMountDependence
      )
    );
  }
}
