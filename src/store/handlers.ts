import { store } from "./index";
import { getModalsHandlers } from "./slices/modals/handlers/handlers";
import { getUiHandlers } from "./slices/ui/handlers/handlers";

export function initHandlers() {
  getUiHandlers(store);
  getModalsHandlers(store);
}
