import { Step } from "../../step/Step";
import { PropertyHandler } from "./PropertyHandler";

export class RecommendationElementHandler extends PropertyHandler {
  public handle(step: Step): boolean {
    PropertyHandler.setValuePropertyElement(
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
