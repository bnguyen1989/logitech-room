import { StepName } from '../type'
import { ItemObject } from '../items/ItemObject'
import { Rule } from './Rule'

export class RoomRule extends Rule {
	public stepName: StepName = StepName.RoomSize;
	public readonly isUniqueActiveItem: boolean = true;


	public getValidItems(): ItemObject[] {
		if (!this.prevRule || (this.prevRule.stepName !== StepName.Platform)) {
			return [];
		}

		return this.items;
	}
	
}