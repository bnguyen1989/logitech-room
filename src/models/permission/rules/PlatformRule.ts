import { StepName } from '../type'
import { ItemObject } from '../items/ItemObject'
import { Rule } from './Rule'

export class PlatformRule extends Rule {
	public stepName: StepName = StepName.Platform;
	public isUniqueActiveItem: boolean = true;


	public getValidItems(): ItemObject[] {
		return this.items;
	}
	
}