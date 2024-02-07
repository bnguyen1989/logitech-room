import { StepName } from '../type'
import { ItemObject } from '../items/ItemObject'
import { Rule } from './Rule'

export class ServiceRule extends Rule {
		public stepName: StepName = StepName.Services;
		public readonly isUniqueActiveItem: boolean = true;

		public getValidItems(): ItemObject[] {
				if (!this.prevRule || (this.prevRule.stepName !== StepName.RoomSize)) {
						return [];
				}

				return this.items;
		}
		
}