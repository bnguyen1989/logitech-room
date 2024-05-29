import { Application } from "../Application";
import { Modal } from "./Modal";

declare const app: Application;

export class SelectProductModal extends Modal {
  public name = "SelectProductModal";
  public attributeName: string;
  public editCallback: () => void;
  public closeCallback: () => void;
	public continueCallback: () => void;

  constructor(
    attributeName: string,
    editCallback: () => void,
    closeCallback: () => void,
		continueCallback: () => void
  ) {
    super();
    this.attributeName = attributeName;
    this.editCallback = editCallback;
    this.closeCallback = closeCallback;
		this.continueCallback = continueCallback;

  }

  public show() {
    app.eventEmitter.emit("showModal", this);
  }
}
