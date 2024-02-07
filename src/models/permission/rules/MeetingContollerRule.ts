import { StepName } from '../type'
import { ItemObject } from '../items/ItemObject'
import { Rule } from './Rule'

export class MeetingControllerRule extends Rule {
		public stepName: StepName = StepName.MeetingController;

		public getValidItems(): ItemObject[] {
				if (!this.prevRule || (this.prevRule.stepName !== StepName.AudioExtensions)) {
						return [];
				}

				return this.items;
		}
		
}