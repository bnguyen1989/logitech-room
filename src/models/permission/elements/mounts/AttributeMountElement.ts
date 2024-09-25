import { MountElement } from "./MountElement";

export class AttributeMountElement extends MountElement {
  public attributes: Record<string, any> = {};

  public setAttributes(attributes: Record<string, any>): AttributeMountElement {
    this.attributes = attributes;
    return this;
  }

  public updateAttributes(
    attributes: Record<string, any>
  ): AttributeMountElement {
    this.attributes = { ...this.attributes, ...attributes };
    return this;
  }

  public getAttributes(): Record<string, any> {
    return this.attributes;
  }

  public copy(): AttributeMountElement {
    const prev = super.copy();
    const mountElement = new AttributeMountElement(this.name, this.nodeName);
    Object.assign(mountElement, prev);
    mountElement.setAttributes(this.attributes);
    return mountElement;
  }
}
