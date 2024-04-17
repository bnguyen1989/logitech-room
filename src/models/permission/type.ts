
export type PropertyDependentElement = Record<
  string,
  {
    active: boolean;
    property?: Record<string, any>;
  }
>;
