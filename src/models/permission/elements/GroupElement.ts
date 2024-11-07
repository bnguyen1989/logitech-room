import { ItemElement } from "./ItemElement";
import { Element } from "./Element";

export class GroupElement extends Element<GroupElement> {
  private _isRequiredOne: boolean = false;
  private elements: Array<ItemElement | GroupElement> = [];

  public addElement(element: ItemElement | GroupElement): GroupElement {
    this.elements.push(element);
    return this;
  }

  public getElements(): Array<ItemElement | GroupElement> {
    return this.elements;
  }

  public getSimpleElements(): Array<ItemElement> {
    const resElements: Array<ItemElement> = [];
    this.elements.forEach((elem) => {
      if (elem instanceof GroupElement) {
        return resElements.push(...elem.getSimpleElements());
      }
      resElements.push(elem);
    });
    return resElements;
  }

  public setRequiredOne(value: boolean): GroupElement {
    this._isRequiredOne = value;
    return this;
  }

  public isRequiredOne(): boolean {
    return this._isRequiredOne;
  }

  public getGroupBySimpleElementName(name: string): GroupElement | undefined {
    for (const element of this.elements) {
      if (element instanceof GroupElement) {
        return element.getGroupBySimpleElementName(name);
      }

      if (element instanceof ItemElement) {
        if (element.name === name) {
          return this as GroupElement;
        }
      }
    }
  }

  public includeElement(element: ItemElement): boolean {
    return this.elements.some((elem) => {
      if (elem instanceof ItemElement) {
        return elem.name === element.name;
      } else {
        return false;
      }
    });
  }

  public compare(element: GroupElement): boolean {
    return this.elements.every((elem) => {
      if (elem instanceof ItemElement) {
        return element.includeElement(elem);
      } else {
        return elem.compare(element);
      }
    });
  }

  public copy(): GroupElement {
    const groupElement = new GroupElement();
    groupElement.elements = this.elements.map((element) => {
      if (element instanceof ItemElement) {
        return element.copy();
      } else {
        return element.copy();
      }
    });
    return groupElement;
  }
}
