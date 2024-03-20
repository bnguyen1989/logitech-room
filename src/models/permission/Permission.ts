import { IdGenerator } from "../IdGenerator";
import { ItemElement } from "./elements/ItemElement";
import { StepName } from "./type";
import { Step } from "./step/Step";
import { ChangeStepRule } from "./rules/ChangeStepRule";
import { RemoveActiveElementRule } from "./rules/RemoveActiveElementRule";
import { AddActiveElementRule } from "./rules/AddActiveElementRule";
import { MountElement } from "./elements/MountElement";
import {
  createStepAudioExtensions,
  createStepConferenceCamera,
  createStepMeetingController,
  createStepPlatform,
  createStepRoomSize,
  createStepServices,
  createStepSoftwareServices,
  createStepVideoAccessories,
} from "../../utils/permissionUtils";
import { AddActiveElementHandler } from "./handlers/AddActiveElementHandler";
import { RemoveActiveElementHandler } from "./handlers/RemoveActiveElementHandler";
import { ChangeStepHandler } from "./handlers/ChangeStepHandler";
export class Permission {
  public id: string = IdGenerator.generateId();
  private currentStepName: StepName | null = null;
  private steps: Array<Step> = [];
  private arrayActiveKeys: Array<string> = [];

  constructor(arrayActiveKeys: Array<string> = [], stepName: StepName) {
    this.init();
    this.currentStepName = stepName;
    this.arrayActiveKeys = arrayActiveKeys;
    this.setActiveItemsSteps(arrayActiveKeys);

    const currentStep = this.getCurrentStep();
    if (currentStep) {
      new ChangeStepHandler().handle(currentStep);
    }
  }

  public init(): void {
    this.addStep(createStepRoomSize());
    this.addStep(createStepPlatform());
    this.addStep(createStepServices());
    this.addStep(createStepConferenceCamera());
    this.addStep(createStepAudioExtensions());
    this.addStep(createStepMeetingController());
    this.addStep(createStepVideoAccessories());
    this.addStep(createStepSoftwareServices());
  }

  public setActiveItemsSteps(arrayActiveKeys: Array<string>): void {
    this.steps.forEach((step) => {
      arrayActiveKeys.forEach((key) => {
        step.addActiveElementByName(key);
      });
    });
  }

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
    const currentStep = this.getCurrentStep();
    if (currentStep) {
      return new ChangeStepRule("next").validate(currentStep);
    }
    return true;
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

  public processChangeColorElementByName(itemName: string): void {
    this.canAddActiveElementByName(itemName);
  }

  public processAddActiveElementByName(itemName: string): void {
    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      return;
    }
    const element = currentStep.getElementByName(itemName);
    if (!element) {
      return;
    }
    new AddActiveElementHandler(element).handle(currentStep);
  }

  public canRemoveActiveElementByName(itemName: string): boolean {
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

  public processRemoveActiveElementByName(itemName: string): void {
    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      return;
    }
    const element = currentStep.getElementByName(itemName);

    if (!element) {
      return;
    }
    new RemoveActiveElementHandler(element).handle(currentStep);
  }

  public getElements(): Array<ItemElement | MountElement> {
    const currentStep = this.getCurrentStep();
    if (currentStep) {
      return currentStep.getValidElements();
    }
    return [];
  }

  public getActiveElements(): Array<ItemElement | MountElement> {
    const currentStep = this.getCurrentStep();
    if (currentStep) {
      return currentStep.getActiveElements();
    }
    return [];
  }

  public getRemoveKeys(): Array<string> {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return [];

    const chainActiveElements = currentStep.getChainActiveElements();
    const keys = chainActiveElements.flat().map((element) => element.name);
    return this.arrayActiveKeys.filter((key) => !keys.includes(key));
  }

  public getAddKeys(): Array<string> {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return [];
    const chainActiveElements = currentStep.getChainActiveElements();
    const keys = chainActiveElements.flat().map((element) => element.name);
    return keys.filter((key) => !this.arrayActiveKeys.includes(key));
  }

  public getItemsNeedChange(name: string): Record<string, Array<string>> {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return {};
    const element = currentStep.getElementByName(name);
    if (!(element instanceof ItemElement)) return {};
    return element.getAutoChangeItems();
  }

  public isRecommendedElementByName(itemName: string): boolean {
    const currentStep = this.getCurrentStep();
    if (!currentStep) return false;
    const element = currentStep.getElementByName(itemName);
    if (!element) return false;
    return element.getRecommended();
  }

  public getCurrentStep(): Step | null {
    return (
      this.steps.find((step) => step.name === this.currentStepName) || null
    );
  }
}
