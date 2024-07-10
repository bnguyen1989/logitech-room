import { IdGenerator } from "../IdGenerator";
import { ItemElement } from "./elements/ItemElement";
import { Step } from "./step/Step";
import { ChangeStepRule } from "./rules/ChangeStepRule";
import { RemoveActiveElementRule } from "./rules/RemoveActiveElementRule";
import { AddActiveElementRule } from "./rules/AddActiveElementRule";
import { MountElement } from "./elements/mounts/MountElement";
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
import { CountableMountElement } from "./elements/mounts/CountableMountElement";
import { ReferenceMountElement } from "./elements/mounts/ReferenceMountElement";
import { RecommendationElementHandler } from "./handlers/property/RecommendationElementHandler";
import { RequiredElementHandler } from "./handlers/property/RequiredElementHandler";
import { ReservationMountHandler } from "./handlers/mounts/ReservationMountHandler";
import { DependentMountHandler } from "./handlers/mounts/DependentMountHandler";
import { DisabledCounterElementHandler } from "./handlers/property/DisabledCounterElementHandler";
import { DirectionStep, StepName } from "../../utils/baseUtils";
import { AvailableStepHandler } from "./handlers/property/AvailableStepHandler";
import { DisabledColorElementHandler } from "./handlers/property/DisabledColorElementHandler";
import { BundleMountElementRule } from "./rules/BundleMountElementRule";
import { SecondaryMountHandler } from "./handlers/mounts/SecondaryMountHandler";
import { NameNodeHandler } from "./handlers/NameNodeHandler";
export class Permission {
  public id: string = IdGenerator.generateId();
  private currentStepName: StepName;
  private steps: Array<Step> = [];
  private activeKeyItems: Array<string> = [];

  constructor(
    activeKeyItems: Array<string> = [],
    dataItems: Record<string, Record<string, any>> = {},
    stepName: StepName
  ) {
    this.init();
    this.currentStepName = stepName;
    this.activeKeyItems = activeKeyItems;
    this.setInitDataItemsSteps(dataItems);

    const currentStep = this.getCurrentStep();
    new ChangeStepHandler().handle(currentStep);
    this.executeBasicHandlers(currentStep);
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

  public setInitDataItemsSteps(
    arrayActiveData: Record<string, Record<string, any>>
  ): void {
    this.steps.forEach((step) => {
      Object.entries(arrayActiveData).forEach(([key, value]) => {
        const element = step.getElementByName(key);
        if (!element) return;
        if (value?.color) {
          element.setProperty({ color: value.color });
        }
        if (value?.count !== undefined && element instanceof ItemElement) {
          const setDataCountableMount = (element: CountableMountElement) => {
            element.setActiveIndex(value.count);
            element.setMin(value.counterMin);
            element.setMax(value.counterMax);
          };
          const defaultMount = element.getDefaultMount();
          if (defaultMount instanceof CountableMountElement) {
            setDataCountableMount(defaultMount);
          }
          if (defaultMount instanceof ReferenceMountElement) {
            const dependentMount = defaultMount.getDependentMount();
            if (dependentMount instanceof CountableMountElement) {
              setDataCountableMount(dependentMount);
            }
          }
        }

        const isActiveElement = this.activeKeyItems.includes(element.name);
        if (isActiveElement) {
          step.addActiveElement(element);
        }
      });
    });
  }

  public executeBasicHandlers(step: Step): void {
    new NameNodeHandler().handle(step);
    new AvailableStepHandler().handle(step);
    new DependentMountHandler().handle(step);
    new ReservationMountHandler().handle(step);
    new SecondaryMountHandler().handle(step);
    new RecommendationElementHandler().handle(step);
    new RequiredElementHandler().handle(step);
    new DisabledCounterElementHandler().handle(step);
    new DisabledColorElementHandler().handle(step);
  }

  public addStep(step: Step): Permission {
    if (this.steps.length) {
      const lastStep = this.steps[this.steps.length - 1];
      step.prevStep = lastStep;
      lastStep.nextStep = step;
    }
    this.steps.push(step);
    return this;
  }

  public getSteps(): Array<Step> {
    return this.steps;
  }

  public canNextStep(): boolean {
    const currentStep = this.getCurrentStep();
    return new ChangeStepRule(DirectionStep.Next).validate(currentStep);
  }

  public canAddActiveElementByName(itemName: string): boolean {
    const currentStep = this.getCurrentStep();
    const element = currentStep.getElementByName(itemName);
    let resValid = false;
    if (element) {
      resValid = new AddActiveElementRule(element).validate(currentStep);
    }
    return resValid;
  }

  public processChangeColorElementByName(itemName: string): void {
    this.processAddActiveElementByName(itemName);
  }

  public processAddActiveElementByName(itemName: string): void {
    const currentStep = this.getCurrentStep();
    const element = currentStep.getElementByName(itemName);
    if (element) {
      new AddActiveElementHandler(element).handle(currentStep);
      this.executeBasicHandlers(currentStep);
    }
  }

  public canRemoveActiveElementByName(itemName: string): boolean {
    const currentStep = this.getCurrentStep();
    const element = currentStep.getElementByName(itemName);
    let resValid = false;
    if (element) {
      resValid = new RemoveActiveElementRule(element).validate(currentStep);
    }
    return resValid;
  }

  public processRemoveActiveElementByName(itemName: string): void {
    const currentStep = this.getCurrentStep();
    const element = currentStep.getElementByName(itemName);
    if (element) {
      new RemoveActiveElementHandler(element).handle(currentStep);
      this.executeBasicHandlers(currentStep);
    }
  }

  public getElements(): Array<ItemElement | MountElement> {
    const currentStep = this.getCurrentStep();
    return currentStep.getValidElements();
  }

  public getActiveElements(): Array<ItemElement | MountElement> {
    const currentStep = this.getCurrentStep();
    return currentStep.getActiveElements();
  }

  public getDataForRemove(): Record<string, Array<string>> {
    const currentStep = this.getCurrentStep();

    const arrayActiveKeys = this.activeKeyItems;
    const chainActiveElements = currentStep.getChainActiveElements();
    const activeKeys = chainActiveElements
      .flat()
      .map((element) => element.name);
    const keysNeedRemove = arrayActiveKeys.filter(
      (key) => !activeKeys.includes(key)
    );
    return this.groupKeyElementsByStepName(keysNeedRemove);
  }

  public getDataForAdd(): Record<string, Array<string>> {
    const currentStep = this.getCurrentStep();

    const arrayActiveKeys = this.activeKeyItems;
    const chainActiveElements = currentStep.getChainActiveElements();
    const activeKeys = chainActiveElements
      .flat()
      .map((element) => element.name);
    const keysNeedAdd = activeKeys.filter(
      (key) => !arrayActiveKeys.includes(key)
    );

    return this.groupKeyElementsByStepName(keysNeedAdd);
  }

  public getItemsNeedChange(name: string): Record<string, Array<string>> {
    const currentStep = this.getCurrentStep();
    const element = currentStep.getElementByName(name);
    if (!(element instanceof ItemElement)) return {};
    return element.getAutoChangeItems();
  }

  public isRecommendedElementByName(itemName: string): boolean {
    const currentStep = this.getCurrentStep();
    const element = currentStep.getElementByName(itemName);
    let res = false;
    if (element) res = element.getRecommended();
    return res;
  }

  public isSecondaryElementByName(itemName: string): boolean {
    const currentStep = this.getCurrentStep();
    const element = currentStep.getElementByName(itemName);
    let res = false;
    if (element) res = element.getSecondary();
    return res;
  }

  public getBundleMountElementsByName(itemName: string): Array<MountElement> {
    const currentStep = this.getCurrentStep();
    const element = currentStep.getElementByName(itemName);
    let res: Array<MountElement> = [];
    if (element instanceof ItemElement) {
      res = element.getBundleMount().filter((mount) => {
        return new BundleMountElementRule(element, mount).validate(currentStep);
      });
    }
    return res;
  }

  public getCurrentStep(): Step {
    return this.getStepByName(this.currentStepName);
  }

  public getStepByName(stepName: StepName): Step {
    return this.steps.find((step) => step.name === stepName) as Step;
  }

  private groupKeyElementsByStepName(
    keys: string[]
  ): Record<string, Array<string>> {
    const result: Record<string, Array<string>> = {};

    keys.forEach((key) => {
      const stepName = this.getStepNameByElementName(key);
      if (stepName) {
        if (!result[stepName]) {
          result[stepName] = [];
        }
        result[stepName].push(key);
      }
    });

    return result;
  }

  private getStepNameByElementName(elementName: string): StepName | undefined {
    return this.steps.find((step) => {
      return !!step.getElementByName(elementName);
    })?.name;
  }
}
