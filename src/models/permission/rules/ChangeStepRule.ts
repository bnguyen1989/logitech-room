import { GroupElement } from '../elements/GroupElement'
import { Step } from '../step/Step'
import { Rule } from './Rule'

export class ChangeStepRule extends Rule {
	public name: string = "ChangeStepRule";
	public direction: 'next' | 'prev';

	constructor(direction: 'next' | 'prev') {
		super();
		this.direction = direction;
	}

	public validate(step: Step): boolean {
		if(this.direction === 'prev') {
			return true;
		}

		const group = step.allElements.find((element) => element instanceof GroupElement);
		if(!group || group instanceof GroupElement === false) {
			return true;
		}
		if(!group.isRequiredOne()) {
			return true;
		}
		if(group.isRequiredOne() && step.isEmptyActiveElements()) {
			return false;
		}
		const activeElements = step.getActiveElements();
		const visibleElements = activeElements.filter((element) => element.getVisible());
		return visibleElements.length > 0;
	}
}