import { IdGenerator } from "../IdGenerator";
import { ItemElement } from "./elements/ItemElement";
import { StepName } from "./type";
import { Step } from "./step/Step";
import { ChangeStepRule } from "./rules/ChangeStepRule";
import { RemoveActiveElementRule } from "./rules/RemoveActiveElementRule";
import { ChangeStepHandler } from "./handlers/ChangeStepHandler";
import { AddActiveElementHandler } from "./handlers/AddActiveElementHandler";
import { RemoveActiveElementHandler } from "./handlers/RemoveActiveElementHandler";
import { AddActiveElementRule } from "./rules/AddActiveElementRule";
import { MountElement } from './elements/MountElement'

export class Permission {
  public id: string = IdGenerator.generateId();
  public currentStepName: StepName | null = null;
  private steps: Array<Step> = [];

  public addStep(step: Step): Permission {
    if (this.steps.length) {
      const lastStep = this.steps[this.steps.length - 1];
      step.prevStep = lastStep;
    }
    this.steps.push(step);
    return this;
  }

  public getSteps(): Array<Step> {
    return this.steps;
  }

  public canNextStep(): boolean {
    const currentStep = this.steps.find(
      (step) => step.name === this.currentStepName
    );
    if (currentStep) {
      return new ChangeStepRule("next").validate(currentStep);
    }
    return true;
  }

  public changeStepName(stepName: StepName | null): void {
    this.currentStepName = stepName;
    let indexCurrentStep = 0;
    if (stepName !== null) {
      indexCurrentStep = this.steps.findIndex((step) => step.name === stepName);
    }
    for (
      let index = indexCurrentStep;
      index < this.steps.length;
      index += 1
    ) {
      const step = this.steps[index];
      step.clearTempData();
    }
    const currentStep = this.steps[indexCurrentStep];
    new ChangeStepHandler().handle(currentStep);
  }

  public getCurrentStep(): Step | null {
    return (
      this.steps.find((step) => step.name === this.currentStepName) || null
    );
  }


  public canAddActiveElementByName(itemName: string): boolean {
    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      return false;
    }
    const element = currentStep.getElementByName(itemName);
    if (!element) {
      return false;
    }
    return new AddActiveElementRule(element).validate(currentStep);
  }

  public addActiveElementByName(itemName: string): void {
    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      return;
    }
    const element = currentStep.getElementByName(itemName);
    if (!element) {
      return;
    }
    const isAddElement = this.canAddActiveElementByName(itemName);
    if (isAddElement) {
      currentStep.addActiveElement(element);
      new AddActiveElementHandler(element).handle(currentStep);
    }
  }

  public canRemoveActiveItemByName(itemName: string): boolean {
    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      return false;
    }
    const element = currentStep.getElementByName(itemName);
    if (!element) {
      return false;
    }
    return new RemoveActiveElementRule(element).validate(currentStep);
  }

  public removeActiveItemByName(itemName: string): void {
    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      return;
    }
    const element = currentStep.getElementByName(itemName);
    
    if (!element) {
      return;
    }
    const isRemove = this.canRemoveActiveItemByName(itemName);
    if (isRemove) {
      currentStep.removeActiveElement(element);
      new RemoveActiveElementHandler(element).handle(currentStep);
    }
  }

  public getElements(): Array<ItemElement | MountElement> {
    const currentStep = this.getCurrentStep();
    if (currentStep) {
      return currentStep.getValidElements();
    }
    return [];
  }

  public getActiveItems(): Array<ItemElement | MountElement> {
    const currentStep = this.getCurrentStep();
    if (currentStep) {
      return currentStep.getActiveElements();
    }
    return [];
  }
}
