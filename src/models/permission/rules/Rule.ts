import { StepName } from '../type'
import { ItemObject } from '../items/ItemObject'

export abstract class Rule {
	public abstract stepName: StepName;
	public activeItems: Array<ItemObject> = [];
	private _items: Array<ItemObject> = [];
	private _prevRule: Rule | null = null;
	public readonly isUniqueActiveItem: boolean = false;

	public addActiveItem(item: ItemObject): void {
		if(this.isUniqueActiveItem) {
			this.activeItems = [item];
			return;
		}
		this.activeItems.push(item);
	}

	public set items(keys: Array<ItemObject>) {
		this._items = keys;
	}

	public get items(): Array<ItemObject> {
		return this._items;
	}

	public set prevRule(rule: Rule | null) {
		this._prevRule = rule;
	}

	public get prevRule(): Rule | null {
		return this._prevRule;
	}

	public abstract getValidItems(): Array<ItemObject>;

	protected getChainKeys(): Array<Array<ItemObject>> {
		const keys: Array<Array<ItemObject>> = [];
		if(this.activeItems.length > 0) {
			keys.push(this.activeItems);
		}
		let rule: Rule | null = this.prevRule;
		while(rule) {
			if(rule.activeItems.length > 0) {
				keys.push(rule.activeItems);
			}
			rule = rule.prevRule;
		}
		return keys.reverse();
	}

}