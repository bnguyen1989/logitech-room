import { EventDataAnalyticsI } from "./type";

export class Analytics {
  public name: string = "analytics-event";

  public notify(eventData: EventDataAnalyticsI): void {
    const event = new CustomEvent(this.name, {
      detail: eventData,
    });
    document.body.dispatchEvent(event);
  }
}
