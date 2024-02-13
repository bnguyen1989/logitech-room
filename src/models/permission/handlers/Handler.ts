import { ItemElement } from '../elements/ItemElement'
import { Step } from '../step/Step'

export abstract class Handler {
	public static validateDependence(step: Step, element: ItemElement) {
		const chainActiveElements = step.getChainActiveElements();
		const dependence = element.getDependence();
		if(!dependence.length) {
			return true;
		}
		return dependence.every((element) => {
			return chainActiveElements.some((activeElements) => {
				return activeElements.some((activeElement) => {
					return activeElement.name === element.name;
				});
			});
		});
	}

	public abstract handle(step: Step): boolean;
}