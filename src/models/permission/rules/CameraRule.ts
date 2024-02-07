import { StepName } from '../type'
import { ItemObject } from '../items/ItemObject'
import { Rule } from './Rule'

export class CameraRule extends Rule {
	public stepName: StepName = StepName.ConferenceCamera;
	public readonly isUniqueActiveItem: boolean = true;

	public getValidItems(): ItemObject[] {
		if (!this.prevRule || (this.prevRule.stepName !== StepName.Services)) {
			return [];
		}

		const keys = this.getChainKeys();

		return keys.flat();

		// return this.items.filter((key: ItemObject) => {
		// 	return key.dependenceItems.every((dI: ItemObject) => {
		// 		keys.includes(dI);
		// 	});
		// });
	}
}