export enum ModalName {
  MY_SETUP = "MY_SETUP",
  ANNOTATION_ITEM = "ANNOTATION_ITEM",
  SELECT_PRODUCT = "SELECT_PRODUCT",
}

export interface ModalI {
  isOpen: boolean;
  product?: string;  
  card: any, 
  keyPermission: any, 
}

export interface SelectProductModalI extends ModalI {
  dataModal?: {
    attributeName: string;
    editHandlerName: string;
    closeHandlerName: string;
  };
}
