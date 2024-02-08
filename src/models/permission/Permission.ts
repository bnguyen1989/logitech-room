import { IdGenerator } from "../IdGenerator";
import { ruleFactoryMethod } from "./factories/rule";
import { ItemObject } from "./items/ItemObject";
import { Rule } from "./rules/Rule";
import { StepName } from "./type";
import { jsonData } from "./data";

export class Permission {
  public id: string = IdGenerator.generateId();
  public currentStepName: StepName | null = null;
  private rules: Array<Rule> = [];

  public addRule(rule: Rule): Permission {
    if (this.rules.length) {
      const lastRule = this.rules[this.rules.length - 1];
      rule.prevRule = lastRule;
    }
    this.rules.push(rule);
    return this;
  }

  public getRules(): Array<Rule> {
    return this.rules;
  }

  public changeStepName(stepName: StepName | null): void {
    this.currentStepName = stepName;
    if (stepName === null) {
      this.rules = [];
      return;
    }
    const indexCurrentRule = this.rules.findIndex(
      (rule) => rule.stepName === stepName
    );
    if (indexCurrentRule !== -1) {
      this.rules = this.rules.slice(0, indexCurrentRule + 1);
      return;
    }
    const currentRule = ruleFactoryMethod(stepName);
    if (this.rules.length === 0) {
			const data = jsonData[stepName as never];
			const items = Object.keys(data).map((item: string) => new ItemObject(item));
			currentRule.items = items;
      this.addRule(currentRule);
			return;
    }

    let data = {...jsonData};
		for (let index = 0; index < this.rules.length; index+=1) {
      const rule = this.rules[index];
      const stepName = rule.stepName;
      const activeItems = rule.getActiveItems();
      const value = activeItems[0].name;
      data = data[stepName as never][value];
    }
    data = data[stepName as never];
    const items = Object.keys(data).map((item: string) => {
      const itemObject = new ItemObject(item);
      const value = data[item as never] as ItemObject;
      
      if(value.isVisible !== undefined) itemObject.isVisible = value.isVisible;
      if(value.defaultActive !== undefined) itemObject.defaultActive = value.defaultActive;
      if(value.isRequired !== undefined) itemObject.isRequired = value.isRequired;
      if(value.dependence) {
        const dependence = value.dependence as never as string[];
        itemObject.dependence = dependence.map((item: string) => new ItemObject(item));
      }
      return itemObject;
    });
    currentRule.items = items;
    this.addRule(currentRule);
  }

  public addActiveItemByName(itemName: string): void {
    const currentRule = this.rules.find(
      (rule) => rule.stepName === this.currentStepName
    );
    if(currentRule) {
      const item = currentRule.items.find(item => item.name === itemName);
      if(item) {
        currentRule.addActiveItem(item);
      }
    }
  }

  public removeActiveItemByName(itemName: string): void {
    const currentRule = this.rules.find(
      (rule) => rule.stepName === this.currentStepName
    );
    if(currentRule) {
      const item = currentRule.items.find(item => item.name === itemName);
      if(item) {
        currentRule.removeActiveItem(item);
      }
    }
  }

  public getItems(): Array<ItemObject> {
    const currentRule = this.rules.find(
      (rule) => rule.stepName === this.currentStepName
    );
    if (currentRule) {
      return currentRule.getValidItems();
    }
    return [];
  }

  public getActiveItems(): Array<ItemObject> {
    const currentRule = this.rules.find(
      (rule) => rule.stepName === this.currentStepName
    );
    if (currentRule) {
      return currentRule.getActiveItems();
    }
    return [];
  }

  public isRequiredActiveItems(): boolean {
    const currentRule = this.rules.find(
      (rule) => rule.stepName === this.currentStepName
    );
    if (currentRule) {
      return currentRule.isRequiredActiveItems;
    }
    return false;
  }
}
