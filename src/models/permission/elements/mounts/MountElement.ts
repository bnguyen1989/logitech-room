import { ConditionChangeType } from "../../../conditions/type";
import { BaseElement } from "../BaseElement";
import { Element } from "../Element";

export class MountElement extends BaseElement implements Element<MountElement> {
  public nodeName: string;
  private dependentMount: MountElement | null = null;
  private nodeNameConditions: ConditionChangeType[] = [];

  constructor(name: string, nodeName: string) {
    super(name);
    this.nodeName = nodeName;
  }

  public addConditionNameNode(
    nodeNameCondition: ConditionChangeType
  ): MountElement {
    this.nodeNameConditions.push(nodeNameCondition);
    return this;
  }

  public setConditionNameNodes(
    nodeNameConditions: ConditionChangeType[]
  ): MountElement {
    this.nodeNameConditions = nodeNameConditions;
    return this;
  }

  public getConditionNameNodes(): ConditionChangeType[] {
    return this.nodeNameConditions;
  }

  public getNodeNamesConditionRemove(): string[] {
    const nodeNames = this.nodeNameConditions
      .map((nodeNameCondition) => nodeNameCondition.changes["nodeName"])
      .filter(Boolean) as string[];
    return nodeNames.filter((key) => key !== this.nodeName);
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
    mountElement.setConditionNameNodes(this.nodeNameConditions);
    return mountElement;
  }
}
