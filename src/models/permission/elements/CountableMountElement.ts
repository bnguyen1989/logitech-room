import { MountElement } from "./MountElement";

export class CountableMountElement extends MountElement {
  public min: number = 0;
  public max: number = 0;
  public activeIndex: number = 0;
  public notAvailableIndex: Array<number> = [];

  constructor(name: string, nodeName: string) {
    super(name, nodeName);
  }

	public next(): CountableMountElement {
		const index = this.getNextIndex(this.activeIndex);
		this.activeIndex = index;
		return this;
	}

	public prev(): CountableMountElement {
		const index = this.getPrevIndex(this.activeIndex);
		this.activeIndex = index;
		return this;
	}

	public getNameNode(): string {
		return `${this.nodeName}_${this.activeIndex}`;
	}

  public getRangeNameNode(): string[] {
    const range = [];
    for (let i = this.min+1; i <= this.max; i++) {
      range.push(`${this.nodeName}_${i}`);
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
    const mountElement = new CountableMountElement(
      this.name,
      this.nodeName,
    );
		mountElement.min = this.min;
		mountElement.max = this.max;
		mountElement.activeIndex = this.activeIndex;
		mountElement.notAvailableIndex = this.notAvailableIndex;
    return mountElement;
  }

  private getNextIndex(index: number): number {
    const nexIndex = this.activeIndex + 1;
    if (this.notAvailableIndex.includes(nexIndex)) {
      return this.getNextIndex(index + 1);
    }
    if (nexIndex > this.max) {
      return this.max;
    }
    return nexIndex;
  }

  private getPrevIndex(index: number): number {
    const prevIndex = this.activeIndex - 1;
    if (this.notAvailableIndex.includes(prevIndex)) {
      return this.getPrevIndex(index - 1);
    }
    if (prevIndex < this.min) {
      return this.min;
    }
    return prevIndex;
  }
}
