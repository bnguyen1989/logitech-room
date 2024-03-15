import { store } from "./index";
import { getUiHandlers } from "./slices/ui/handlers/handlers";

export function initHandlers() {
  getUiHandlers(store);
}
