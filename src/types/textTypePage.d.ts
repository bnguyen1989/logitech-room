export interface PagesI {
  "Room Size": RoomSize;
  mainPage: MainPage;
  Platform: Platform;
  Services: Services;
  "Conference Camera": ConferenceCamera;
  "Audio Extensions & Accessories": AudioExtensionsAccessories;
  "Meeting Controller & Add On": MeetingControllerAddOn;
  "Video Accessories": VideoAccessories;
  "Software & Services": SoftwareServices;
  SetupModal: SetupModal;
  Rooms: Rooms;
  Order: Order;
}

export type PagesIKeys = keyof PagesI;

export interface RoomSize {
  title: string;
  subtitle: string;
  Cards: Cards;
}

export interface Cards {
  Phonebooth: Phonebooth;
  Huddle: Huddle;
  Small: Small;
  Medium: Medium;
  Large: Large;
  Auditorium: Auditorium;
}

export interface Phonebooth {
  subtitle: string;
  title: string;
}

export interface Huddle {
  subtitle: string;
  title: string;
}

export interface Small {
  subtitle: string;
  title: string;
}

export interface Medium {
  subtitle: string;
  title: string;
}

export interface Large {
  subtitle: string;
  title: string;
}

export interface Auditorium {
  subtitle: string;
  title: string;
}

export interface MainPage {
  subtitle: string;
  title: string;
  list: List;
  Btn: Btn;
}

export interface List {
  "0": string;
  "1": string;
  "2": string;
  title: string;
}

export interface Btn {
  customer: string;
  partner: string;
}

export interface Platform {
  title: string;
  subtitle: string;
  Cards: Cards2;
  titleAditions: string;
}

export interface Cards2 {
  GoogleMeet: string;
  MicrosoftTeams: string;
  Zoom: string;
  AditionCard: AditionCard[];
}

export interface AditionCard {
  title: string;
}

export interface Services {
  title: string;
  Cards: Cards3;
}

export interface Cards3 {
  Appliance: Appliance;
  "PC based": PcBased;
}

export interface Appliance {
  title: string;
  descriptions: string;
}

export interface PcBased {
  title: string;
  descriptions: string;
}

export interface ConferenceCamera {
  title: string;
  subtitle1: string;
  subtitle2: string;
}

export interface AudioExtensionsAccessories {
  title: string;
  subtitle: string;
}

export interface MeetingControllerAddOn {
  title: string;
  subtitle: string;
}

export interface VideoAccessories {
  title: string;
  subtitle: string;
}

export interface SoftwareServices {
  title: string;
  helpButton: string;
  Cards: Cards4;
  QuestionForm: QuestionForm[];
}

export interface Cards4 {
  "Logitech Sync": LogitechSync;
  "Logitech Extended Warranty": LogitechExtendedWarranty;
  "Support Service": SupportService;
}

export interface LogitechSync {
  title: string;
  description: string;
}

export interface LogitechExtendedWarranty {
  title: string;
  description: string;
}

export interface SupportService {
  title: string;
  description: string;
}

export interface QuestionForm {
  question: string;
  option_1: string;
  option_2: string;
  option_3?: string;
}

export interface SetupModal {
  title: string;
  subtitle: string;
  btn_done: string;
}

export interface Rooms {
  header: Header;
  title: string;
  subtitle: string;
  btn_1: string;
  card: Card;
  btn_2: string;
}

export interface Header {
  name: string;
  subtitle: string;
}

export interface Card {
  templateRoomName: TemplateRoomName;
  descriptionRoomBySize: DescriptionRoomBySize;
  btn_view: string;
  btn_download: string;
}

export interface TemplateRoomName {
  Phonebooth: string;
  Huddle: string;
  Small: string;
  Medium: string;
  Large: string;
  Auditorium: string;
}

export interface DescriptionRoomBySize {
  Phonebooth: string;
  Huddle: string;
  Small: string;
  Medium: string;
  Large: string;
}

export interface Order {
  TemplateRoomName: string;
  Btn: Btn2;
  StepName: StepNameOrder;
  Footer: Footer;
}

export interface Btn2 {
  Back: string;
  Download: string;
}

export interface StepNameOrder {
  "Conference Camera": string;
  "Audio Extensions & Accessories": string;
  "Meeting Controller & Add On": string;
  "Video Accessories": string;
  "Software & Services": string;
}

export interface Footer {
  title: string;
  subtitle: string;
}
