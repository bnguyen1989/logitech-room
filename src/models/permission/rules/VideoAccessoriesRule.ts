import { StepName } from '../type'
import { ItemObject } from '../items/ItemObject'
import { Rule } from './Rule'

export class VideoAccessoriesRule extends Rule {
	public stepName: StepName = StepName.VideoAccessories;

	public getValidItems(): ItemObject[] {
		if (!this.prevRule || (this.prevRule.stepName !== StepName.MeetingController)) {
			return [];
		}

		return this.items;
	}
	
}