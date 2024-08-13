import {
  ConditionMountType,
  ruleMountsType,
} from "../../../configurator/RulleManagerMount";
import { MountElement } from "./MountElement";

export class CountableMountElement extends MountElement {
  public min: number = 0;
  public max: number = 0;
  public activeIndex: number = 0;
  public notAvailableIndex: Array<number> = [];
  public offsetIndex: number = 0;
  public mountLogic: ruleMountsType[] = [];
  public secondaryIndex: number[] = [];

  constructor(name: string, nodeName: string) {
    super(name, nodeName);
  }

  public setSecondaryIndex(indexArr: number[]): this {
    this.secondaryIndex = [...indexArr];
    return this;
  }

  public getSecondaryIndex(): number[] {
    return this.secondaryIndex;
  }

  public setOffsetIndex(offsetIndex: number): CountableMountElement {
    this.offsetIndex = offsetIndex;
    return this;
  }

  public next(): CountableMountElement {
    const index = this.getNextIndex();
    this.activeIndex = index;
    return this;
  }

  public prev(): CountableMountElement {
    const index = this.getPrevIndex();
    this.activeIndex = index;
    return this;
  }

  public getNameNode(): string {
    const availableIndex = this.getRangeAvailableIndex();
    const indexNode = availableIndex[this.activeIndex - this.min - 1];

    return `${this.nodeName}_${indexNode + this.offsetIndex}`;
  }

  public getRangeNameNode(): string[] {
    return this.getRangeAvailableIndex()
      .map((index) => `${this.nodeName}_${index + this.offsetIndex}`)
      .concat(this.getSecondaryNameNode());
  }

  public getAvailableNameNode(): string[] {
    const range = [];
    const rangeAvailableIndex = this.getRangeAvailableIndex();
    for (let i = 1; i <= this.activeIndex - this.min; i++) {
      const index = rangeAvailableIndex[i - 1];
      range.push(`${this.nodeName}_${index + this.offsetIndex}`);
    }
    return range.concat(this.getSecondaryNameNode());
  }

  public getSecondaryNameNode(): string[] {
    return this.secondaryIndex.map(
      (index) => `${this.nodeName}_${index + this.offsetIndex}`
    );
  }

  public setMountLogic(mountLogicType: ruleMountsType[]) {
    this.mountLogic = this.mountLogic.concat(mountLogicType);

    return this;
  }

  public getMatchingMountRulse(
    datacondition: ConditionMountType
  ): ruleMountsType | undefined {
    if (datacondition.count) {
      const mountRulse = this.getMountLogic();
      const matchingRulse = mountRulse
        .reverse()
        .find((rule) => rule.condition.count === datacondition.count);

      return matchingRulse;
    }

    return undefined;
  }

  public getMountLogic() {
    return this.mountLogic;
  }

  public addNotAvailableIndex(index: number): void {
    this.notAvailableIndex.push(index);
  }

  public removeNotAvailableIndex(index: number): void {
    const indexToRemove = this.notAvailableIndex.indexOf(index);
    if (indexToRemove !== -1) {
      this.notAvailableIndex.splice(indexToRemove, 1);
    }
  }

  public setActiveIndex(index: number): CountableMountElement {
    this.activeIndex = index;
    return this;
  }

  public setMin(min: number): CountableMountElement {
    this.min = min;
    return this;
  }

  public setMax(max: number): CountableMountElement {
    this.max = max;
    return this;
  }

  public copy(): CountableMountElement {
    const mountElement = new CountableMountElement(this.name, this.nodeName);
    mountElement.min = this.min;
    mountElement.max = this.max;
    mountElement.activeIndex = this.activeIndex;
    mountElement.notAvailableIndex = this.notAvailableIndex;
    return mountElement;
  }

  private getRangeAvailableIndex(): number[] {
    const range = [];
    const allCountIndex = this.max + this.notAvailableIndex.length;
    for (let i = this.min + 1; i <= allCountIndex; i++) {
      if (!this.notAvailableIndex.includes(i)) {
        range.push(i);
      }
    }
    return range;
  }

  private getNextIndex(): number {
    const nexIndex = this.activeIndex + 1;
    if (nexIndex > this.max) {
      return this.max;
    }

    return nexIndex;
  }

  private getPrevIndex(): number {
    const prevIndex = this.activeIndex - 1;
    if (prevIndex < this.min) {
      return this.min;
    }
    return prevIndex;
  }
}
