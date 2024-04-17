export enum ModalName {
  MY_SETUP = "MY_SETUP",
  INFO_ITEM = "INFO_ITEM",
  SELECT_PRODUCT = "SELECT_PRODUCT",
}

export interface ModalI {
  isOpen: boolean;
  product?: string;
  keyItemPermission?: string;
}

export interface SelectProductModalI extends ModalI {
  dataModal?: {
    attributeName: string;
    editHandlerName: string;
    closeHandlerName: string;
  };
}
