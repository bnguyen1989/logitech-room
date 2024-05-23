import { ValueAssetStateI } from "../../../models/configurator/type";
import { FormName, StepName } from "../../../utils/baseUtils";

export interface StepDataI {
  [StepName.Platform]: StepI;
  [StepName.RoomSize]: StepI;
  [StepName.Services]: StepI;
  [StepName.ConferenceCamera]: StepI;
  [StepName.AudioExtensions]: StepI;
  [StepName.MeetingController]: StepI;
  [StepName.VideoAccessories]: StepI;
  [StepName.SoftwareServices]: StepI;
}

export interface SelectedDataI {
  [key_step: string]: {
    [key_card: string]: {
      selected: Array<string>;
      property: {
        [key: string]: any;
        count?: number;
        color?: string;
      };
    };
  };
}

export interface StepI {
  key: StepName;
  name: string;
  title: string;
  subtitle: string;

  cards: Record<string, CardI>;
}

export type typeThreekitValue = Record<string, ValueAssetStateI>;
export type TypeCardPermissionWithDataThreekit = Record<
  string,
  typeThreekitValue
>;

export interface CardI {
  key: StepName;
  image?: string;
  logo?: string;
  subtitle?: string;
  description?: string;
  counter?: CounterI;
  select?: SelectI;
  keyPermission: string;
  dataThreekit: {
    attributeName: string;
    threekitItems: typeThreekitValue;
  };
}

export interface ColorItemI {
  name: string;
  value: string;
}
export interface ColorI {
  colors: Array<ColorItemI>;
}

export interface CounterI {
  min: number;
  max: number;
  threekit: Pick<ThreekitI, "key">;
}

export interface ThreekitI {
  assetId: string;
  key: string;
}

export interface SelectDataI {
  label: string;
  value: string;
}
export interface SelectI {
  data: Array<SelectDataI>;
}

export interface QuestionFormI {
  question: string;
  options: Array<{
    value: boolean;
    text: string;
  }>;
  active: boolean;
  done: boolean;
}

export interface LangTextI {
  pages: Record<string, any>;
  products: Record<string, any>;
}

export interface FormI {
  [FormName.QuestionFormSoftware]: FormDataI;
}

export interface FormDataI {
  isSubmit: boolean;
}
