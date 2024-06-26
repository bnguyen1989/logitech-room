export interface SectionI {
  title: string;
  data: Array<DataSectionI>;
}

export interface DataSectionI {
  title: string;
  subtitle: string;
  image: string;
  partNumber?: string;
  count?: string;
  amount?: string;
  selectValue?: string;
  labelValue?: string;
}
