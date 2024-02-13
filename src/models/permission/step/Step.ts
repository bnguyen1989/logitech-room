import { GroupElement } from "../elements/GroupElement";
import { ItemElement } from "../elements/ItemElement";
import { StepName } from "../type";

export class Step {
  public name: StepName;
  private _prevStep: Step | null = null;
  private _activeElements: Array<ItemElement> = [];
  private _allElements: Array<ItemElement | GroupElement> = [];
  private validElements: Array<ItemElement> = [];

  constructor(name: StepName) {
    this.name = name;
  }

  public getSimpleElements(): Array<ItemElement> {
    const resElements: Array<ItemElement> = [];
    this.allElements.forEach((elem) => {
      if (elem instanceof GroupElement) {
        return resElements.push(...elem.getSimpleElements());
      }
      resElements.push(elem);
    });
    return resElements;
  }

  public getElementByName(name: string): ItemElement | undefined {
    const elements = this.getSimpleElements();
    return elements.find((element) => element.name === name);
  }

  public addActiveElement(element: ItemElement) {
    this._activeElements.push(element);
    return this;
  }

  public getActiveElements(): Array<ItemElement> {
    return this._activeElements;
  }

  public getValidElements(): Array<ItemElement> {
    return this.validElements;
  }

  public addValidElement(element: ItemElement) {
    this.validElements.push(element);
    return this;
  }

  public removeValidElement(element: ItemElement) {
    this.validElements = this.validElements.filter(
      (elem) => elem.name !== element.name
    );
    return this;
  }

  public removeActiveElement(item: ItemElement): void {
    this._activeElements = this._activeElements.filter(
      (activeItem: ItemElement) => activeItem.name !== item.name
    );
  }

  public getChainActiveElements(): Array<Array<ItemElement>> {
    const keys: Array<Array<ItemElement>> = [];
    if (this._activeElements.length > 0) {
      keys.push(this._activeElements);
    }
    let step: Step | null = this.prevStep;
    while (step) {
      const activeElements = step.getActiveElements();
      if (activeElements.length > 0) {
        keys.push(activeElements);
      }
      step = step.prevStep;
    }
    return keys.reverse();
  }

  public isEmptyActiveElements(): boolean {
    return this._activeElements.length === 0;
  }

  public clearTempData() {
    this._activeElements = [];
    this.validElements = [];
  }

  public set allElements(elements: Array<ItemElement | GroupElement>) {
    this._allElements = elements;
  }

  public get allElements(): Array<ItemElement | GroupElement> {
    return this._allElements;
  }

  public set prevStep(step: Step | null) {
    this._prevStep = step;
  }

  public get prevStep(): Step | null {
    return this._prevStep;
  }
}
