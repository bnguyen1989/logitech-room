import { GroupElement } from "../elements/GroupElement";
import { ItemElement } from "../elements/ItemElement";
import { MountElement } from "../elements/mounts/MountElement";
import { StepName } from "../type";
import { CountableMountElement } from "../elements/mounts/CountableMountElement";
import { ReferenceMountElement } from "../elements/mounts/ReferenceMountElement";

export class Step {
  public name: StepName;
  private _prevStep: Step | null = null;
  private _activeElements: Array<ItemElement | MountElement> = [];
  private _allElements: Array<ItemElement | GroupElement> = [];
  private validElements: Array<ItemElement | MountElement> = [];

  public static getElementByName(
    name: string,
    array: Array<ItemElement | MountElement>
  ) {
    return array.find((element) => element.name === name);
  }

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

  public getElementByName(
    name: string
  ): ItemElement | MountElement | undefined {
    const elements = this.getSimpleElements();
    const res = elements.find((element) => element.name === name);
    if (res) {
      return res;
    }

    const elementsMount = elements
      .map((element) => {
        const dependenceMounts = element.getDependenceMount();
        const defaultMount = element.getDefaultMount();
        if (!defaultMount) return dependenceMounts;
        if (defaultMount instanceof CountableMountElement)
          return dependenceMounts;
        if (defaultMount instanceof ReferenceMountElement)
          return dependenceMounts;

        const isExistDefaultMount = dependenceMounts.some(
          (mount) => mount.name === defaultMount.name
        );
        if (isExistDefaultMount) return dependenceMounts;

        dependenceMounts.push(defaultMount);
        return dependenceMounts;
      })
      .flat();

    return elementsMount.find((element) => element.name === name);
  }

  public addActiveElementByName(itemName: string): void {
    const element = this.getElementByName(itemName);

    if (!element) {
      return;
    }
    this.addActiveElement(element);
  }

  public getActiveItemElementByMountName(
    name: string
  ): ItemElement | undefined {
    const elements = this._activeElements;
    const res = elements.find((element) => {
      return (
        element instanceof ItemElement &&
        element.getDependenceMount().some((mount) => mount.name === name)
      );
    });
    return res as ItemElement;
  }

  public addActiveElement(element: ItemElement | MountElement) {
    const isExist = this._activeElements.some(
      (activeItem: ItemElement | MountElement) =>
        activeItem.name === element.name
    );
    if (!isExist) {
      this._activeElements.push(element);
    }

    return this;
  }

  public getActiveElements(): Array<ItemElement | MountElement> {
    return this._activeElements;
  }

  public getValidElements(): Array<ItemElement | MountElement> {
    return this.validElements;
  }

  public addValidElement(element: ItemElement | MountElement) {
    const isExist = this.validElements.some(
      (elem) => elem.name === element.name
    );
    if (isExist) return this;
    this.validElements.push(element);
    return this;
  }

  public removeValidElement(element: ItemElement | MountElement) {
    this.validElements = this.validElements.filter(
      (elem) => elem.name !== element.name
    );
    return this;
  }

  public removeActiveElement(item: ItemElement | MountElement): void {
    this._activeElements = this._activeElements.filter(
      (activeItem: ItemElement | MountElement) => activeItem.name !== item.name
    );
  }

  public getChainElements(): Array<Array<ItemElement | MountElement>> {
    return this.getChainElementsByCondition((step) => step.getSimpleElements());
  }

  public getChainActiveElements(): Array<Array<ItemElement | MountElement>> {
    return this.getChainElementsByCondition((step) => step.getActiveElements());
  }

  public isEmptyActiveElements(): boolean {
    return this._activeElements.length === 0;
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

  private getChainElementsByCondition(
    callback: (step: Step) => Array<ItemElement | MountElement>
  ) {
    const keys: Array<Array<ItemElement | MountElement>> = [];
    const elements = callback(this);
    if (elements.length > 0) {
      keys.push(elements);
    }
    let step: Step | null = this.prevStep;
    while (step) {
      const elements = callback(step);
      if (elements.length > 0) {
        keys.push(elements);
      }
      step = step.prevStep;
    }
    return keys.reverse();
  }
}
