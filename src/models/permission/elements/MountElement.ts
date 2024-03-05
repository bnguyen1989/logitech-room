import { BaseElement } from './BaseElement'
import { Element } from "./Element";

export class MountElement extends BaseElement implements Element<MountElement>{
	public nodeName: string;
	private dependentMount: MountElement | null = null;

	constructor(name: string, nodeName: string) {
		super(name);
		this.nodeName = nodeName;
	}

	public setDependentMount(mount: MountElement): MountElement {
		this.dependentMount = mount;
		return this;
	}

	public getDependentMount(): MountElement | null {
		return this.dependentMount;
	}

	public getNameNode(): string {
		return this.nodeName;
	}

  public copy(): MountElement {
		const mountElement = new MountElement(this.name, this.nodeName);
    return mountElement;
  }
}
