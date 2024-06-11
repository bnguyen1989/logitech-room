export enum ModalName {
  MY_SETUP = "MY_SETUP",
  ANNOTATION_ITEM = "ANNOTATION_ITEM",
  SELECT_PRODUCT = "SELECT_PRODUCT",
  SHARE_PROJECT = "SHARE_PROJECT",
  FINISH = "FINISH",
  REQUEST_CONSULTATION = "REQUEST_CONSULTATION",
}

export interface ModalI {
  isOpen: boolean;
}

export interface AnnotationItemModalI extends ModalI {
  product?: string;
  card?: any;
  keyPermission?: any;
}

export interface SelectProductModalI extends ModalI {
  dataModal?: {
    attributeName: string;
    editHandlerName: string;
    closeHandlerName: string;
  };
}

export interface MySetupModalI extends ModalI {
  dataModal?: {
    linkSnapshot: string;
  };
}
