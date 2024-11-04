import { StepName } from "../../utils/baseUtils";

export type SectionT =
  | StepName.ConferenceCamera
  | StepName.AudioExtensions
  | StepName.MeetingController
  | StepName.VideoAccessories
  | StepName.SoftwareServices
  | "Room Solution Bundles";

export interface SectionI {
  title: string;
  data: Array<DataSectionI>;
  typeSection?: SectionT;
}

export interface DataSectionI {
  title?: string;
  subtitle?: string;
  image?: string;
  inStock: boolean;
  partNumber?: string;
  count?: string;
  priceData?: PriceDataI;
  selectValue?: string;
  labelValue?: string;
  keyPermission?: string;
}

export interface PriceDataI {
  amountNumber?: number;
  amount?: string;
  strikeThroughPrice?: string;
  isContactReseller?: boolean;
}
