import { MountElement } from "./MountElement";

export class CountableMountElement extends MountElement {
  public min: number;
  public max: number;
  public activeIndex: number;
  public notAvailableIndex: Array<number> = [];

  constructor(name: string, nodeName: string, min: number, max: number) {
    super(name, nodeName);
    this.min = min;
    this.max = max;
		this.activeIndex = min;
  }

  public getNexName(): string {
    const index = this.getNextIndex();
		this.activeIndex = index;
    return `${this.nodeName}_${index}`;
  }

  public getPrevName(): string {
    const index = this.getPrevIndex();
		this.activeIndex = index;
    return `${this.nodeName}_${index}`;
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

  public copy(): CountableMountElement {
    const mountElement = new CountableMountElement(
      this.name,
      this.nodeName,
      this.min,
      this.max
    );
    return mountElement;
  }

  private getNextIndex(): number {
    const nexIndex = this.activeIndex + 1;
    // if (this.notAvailableIndex.includes(nexIndex)) {
    //   return this.getNextIndex();
    // }
    if (nexIndex > this.max) {
      return this.max;
    }
    return nexIndex;
  }

  private getPrevIndex(): number {
    const prevIndex = this.activeIndex - 1;
    // if (this.notAvailableIndex.includes(prevIndex)) {
    //   return this.getPrevIndex();
    // }
    if (prevIndex < this.min) {
      return this.min;
    }
    return prevIndex;
  }
}
