import { Store } from "@reduxjs/toolkit";
import { Application } from "../../../../models/Application";
import { AddItemCommand } from '../../../../models/command/AddItemCommand'
// import { changeValueNodes } from '../Configurator.slice'

declare const app: Application;

export const geConfiguratorHandlers = (store: Store) => {
  app.eventEmitter.on("executeCommand", (data) => {
		if(data instanceof AddItemCommand) {
      console.log('change state configurator', store.getState());
      // store.dispatch(changeValueNodes({
      //    'Camera_Cabinet_Placement': '5be60e22-45ca-441f-9eb3-c5297116e4f3'
      // }));
		}
	});
};

