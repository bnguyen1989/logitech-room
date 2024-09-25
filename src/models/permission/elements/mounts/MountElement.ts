import { Condition } from "../../conditions/Condition";
import { BaseElement } from "../BaseElement";
import { Element } from "../Element";

export class MountElement extends BaseElement implements Element<MountElement> {
  public nodeName: string;
  private dependentMount: MountElement | null = null;
  private conditionNameNodes: Record<string, Condition> = {};

  constructor(name: string, nodeName: string) {
    super(name);
    this.nodeName = nodeName;
  }

  public addConditionNameNode(
    nodeName: string,
    condition: Condition
  ): MountElement {
    this.conditionNameNodes[nodeName] = condition;
    return this;
  }

  public setConditionNameNodes(
    conditionNameNodes: Record<string, Condition>
  ): MountElement {
    this.conditionNameNodes = conditionNameNodes;
    return this;
  }

  public getConditionNameNodes(): Record<string, Condition> {
    return this.conditionNameNodes;
  }

  public getNodeNamesConditionRemove(): string[] {
    return Object.keys(this.conditionNameNodes).filter(
      (key) => key !== this.nodeName
    );
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
    const prev = super.copy();
    const mountElement = new MountElement(this.name, this.nodeName);
    Object.assign(mountElement, prev);
    if (this.dependentMount)
      mountElement.setDependentMount(this.dependentMount);
    mountElement.setConditionNameNodes(this.conditionNameNodes);
    return mountElement;
  }
}
