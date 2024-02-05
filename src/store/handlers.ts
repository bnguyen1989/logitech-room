import { store } from "./index";
import { geConfiguratorHandlers } from './slices/configurator/handlers/handlers'
import { getUiHandlers } from "./slices/ui/handlers/handlers";

export function initHandlers() {
  getUiHandlers(store);
  geConfiguratorHandlers(store);
}
