import { BaseElement } from './BaseElement'
import { Element } from "./Element";

export class MountElement extends BaseElement implements Element<MountElement>{
	public nodeName: string;

	constructor(name: string, nodeName: string) {
		super(name);
		this.nodeName = nodeName;
	}

  public copy(): MountElement {
		const mountElement = new MountElement(this.name, this.nodeName);
    return mountElement;
  }
}
