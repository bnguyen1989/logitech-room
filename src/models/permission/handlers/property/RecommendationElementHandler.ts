import { Step } from "../../step/Step";
import { PropertyElementHandler } from "./PropertyElementHandler";

export class RecommendationElementHandler extends PropertyElementHandler {
  public handle(step: Step): boolean {
    PropertyElementHandler.setValuePropertyElement(
      step,
      (element) => {
        return element.getRecommendationDependence();
      },
      (element, value) => {
        element.setRecommended(value);
      }
    );
    return true;
  }
}
