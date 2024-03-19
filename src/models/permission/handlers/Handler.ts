import { ItemElement } from '../elements/ItemElement'
import { Step } from '../step/Step'

export abstract class Handler {
	public static validateDependence(step: Step, element: ItemElement) {
		const chainActiveElements = step.getChainActiveElements();
		const dependence = element.getDependence();
		if(!dependence.length) {
			return true;
		}
		return dependence.every((item) => {
			return chainActiveElements.some((activeElements) => {
				return activeElements.some((activeElement) => {
					if(Array.isArray(item)) {
						return item.some((itemElement) => {
							return itemElement === activeElement.name;
						});
					}
					return activeElement.name === item;
				});
			});
		});
	}

	public abstract handle(step: Step): boolean;
}