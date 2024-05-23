import { MountElement } from "./MountElement";

export class CountableMountElement extends MountElement {
  public min: number = 0;
  public max: number = 0;
  public activeIndex: number = 0;
  public notAvailableIndex: Array<number> = [];
  private templateIndex: Array<number> = [];

  constructor(name: string, nodeName: string) {
    super(name, nodeName);
  }

  public setTemplateIndex(templateIndex: Array<number>): CountableMountElement {
    this.templateIndex = templateIndex;
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
    const indexNode = availableIndex[this.activeIndex - 1];

    const templateNode = this.getNameNodeByTemplateIndex(indexNode - 1);
    if (templateNode) {
      return templateNode;
    }
    return `${this.nodeName}_${indexNode}`;
  }

  public getRangeNameNode(): string[] {
    return this.getRangeAvailableIndex().map((index) => {
      const templateNode = this.getNameNodeByTemplateIndex(index - 1);
      if (templateNode) {
        return templateNode;
      }

      return `${this.nodeName}_${index}`;
    });
  }

  public getAvailableNameNode(): string[] {
    const range = [];
    const rangeAvailableIndex = this.getRangeAvailableIndex();
    for (let i = 1; i <= this.activeIndex; i++) {
      const index = rangeAvailableIndex[i - 1];
      const templateNode = this.getNameNodeByTemplateIndex(index - 1);
      if (templateNode) {
        range.push(templateNode);
      } else {
        range.push(`${this.nodeName}_${index}`);
      }
    }
    return range;
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

  public setActiveIndex(index: number): void {
    this.activeIndex = index;
  }

  public setMin(min: number): void {
    this.min = min;
  }

  public setMax(max: number): void {
    this.max = max;
  }

  public copy(): CountableMountElement {
    const mountElement = new CountableMountElement(this.name, this.nodeName);
    mountElement.min = this.min;
    mountElement.max = this.max;
    mountElement.activeIndex = this.activeIndex;
    mountElement.notAvailableIndex = this.notAvailableIndex;
    return mountElement;
  }

  private getNameNodeByTemplateIndex(index: number): string | undefined {
    const indexTemplate = this.templateIndex[index];
    if (!indexTemplate) return;
    return `${this.nodeName}_${indexTemplate}`;
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
