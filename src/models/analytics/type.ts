export enum EventCategoryName {
  get_started = "get_started",
  threekit_configurator = "threekit_configurator",
  summary_page = "summary_page",
  room_page = "room_page",
}

export enum EventActionName {
  chose_type_user = "chose_type_user",
  step_complete = "step_complete",
  back_step = "back_step",
  configurator_complete = "configurator_complete",
  add_another_room = "add_another_room",
  download_room_all = "download_room_all",
  share_project = "share_project",
  download_room = "download_room",
  view_room = "view_room",
  delete_room = "delete_room",
  request_consultation = "request_consultation",
  back_to_summary_page = "back_to_summary_page",
}

export interface EventDataAnalyticsI {
  category: EventCategoryName;
  action: EventActionName;
  locale: string;
  value: object;
}
