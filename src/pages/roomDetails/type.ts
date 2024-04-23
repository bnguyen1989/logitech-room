export interface SectionI {
  title: string;
  data: Array<{
    title: string;
    subtitle: string;
    image: string;
    partNumber?: string;
    count?: number;
    amount?: string;
    selectValue?: string;
  }>;
}