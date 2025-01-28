export interface PagesI {
  mainPage: MainPage;
  "Room Size": RoomSize;
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
  ShareModal: ShareModal;
  RequestConsultation: RequestConsultation;
  SelectProductModal: SelectProductModal;
  FinishModal: FinishModal;
  RemoveModal: RemoveModal;
  GuideModal: GuideModal;
  Navigation: Navigation;
  Loader: Loader;
  CSV: Csv;
  Card: CardPageI;
  Player: PlayerPageI;
}

export type PagesIKeys = keyof PagesI;

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

export interface RoomSize {
  name: string;
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

export interface Platform {
  name: string;
  title: string;
  subtitle: string;
  Cards: Cards2;
  titleAditions: string;
}

export interface Cards2 {
  "Google Meet": string;
  "Microsoft Teams": string;
  Zoom: string;
  AditionCard: AditionCard[];
}

export interface AditionCard {
  title: string;
}

export interface Services {
  name: string;
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
  name: string;
  title: string;
  subtitle1: string;
  subtitle2: string;
}

export interface AudioExtensionsAccessories {
  name: string;
  title: string;
  subtitle: string;
}
export interface MeetingControllerAddOn {
  name: string;
  title: string;
  subtitle: string;
}

export interface VideoAccessories {
  name: string;
  title: string;
  subtitle: string;
}

export interface SoftwareServices {
  name: string;
  title: string;
  titleAfterForm: string;
  buttons: SoftwareServicesButtons;
  Cards: Cards4;
  QuestionForm: QuestionForm;
}

export interface SoftwareServicesButtons {
  needHelp: string;
  alreadyKnow: string;
}

export interface Cards4 {
  "Essential Service Plan": EssentialServicePlan;
  "Logitech Sync": LogitechSync;
  "Logitech Extended Warranty": LogitechExtendedWarranty;
  "Support Service": SupportService;
}

export interface SelectSoftwareServiceCard {
  defaultLabel: string;
  valuesTemplate: string;
}

export interface EssentialServicePlan {
  title: string;
  list: List2;
  select: SelectSoftwareServiceCard;
}

export interface List2 {
  title: string;
  values: Values;
}

export interface Values {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
}

export interface LogitechSync {
  title: string;
  list: List3;
  description: string;
  select?: SelectSoftwareServiceCard;
}

export interface List3 {
  title: string;
  values: Values2;
}

export interface Values2 {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
}

export interface LogitechExtendedWarranty {
  title: string;
  description: string;
  select?: SelectSoftwareServiceCard;
}

export interface SupportService {
  title: string;
  list: List4;
  valuesTemplate: string;
  description: string;
  select?: SelectSoftwareServiceCard;
}

export interface List4 {
  title: string;
  values: Values3;
}

export interface Values3 {
  "0": string;
  "1": string;
  "2": string;
}

export interface QuestionForm {
  v1: V1[];
  v2: V2[];
}

export interface V1 {
  question: string;
  option_1: string;
  option_2: string;
  option_3?: string;
}

export interface V2 {
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
  subtitle: Subtitle2;
  buttons: Buttons2;
  card: Card;
}

export interface Header {
  name: string;
  title: string;
  subtitle: string;
  buttons: Buttons;
}

// export interface Subtitle {
//   "0": string;
//   "1": string;
//   "2": string;
// }

export interface Buttons {
  RequestConsultation: string;
  CopyYourCustomURL: string;
}

export interface Subtitle2 {
  v1: string;
  v2: string;
}

export interface Buttons2 {
  AddAnotherRoom: string;
  DownloadRoomGuideAll: string;
  ShareYourProject: string;
}

export interface Card {
  templateRoomName: TemplateRoomName;
  descriptionRoomBySize: DescriptionRoomBySize;
  templateRoomNameByPlatform: TemplateRoomNameByPlatform;
  buttons: Buttons3;
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
  Auditorium: string;
}

export interface TemplateRoomNameByPlatform {
  BYOD: Byod;
}

export interface Byod {
  Phonebooth: string;
  Huddle: string;
  Small: string;
  Medium: string;
  Large: string;
  Alternative: string;
}

export interface Buttons3 {
  ViewRoom: string;
  DownloadRoomGuide: string;
}

export interface Order {
  TemplateRoomName: string;
  subtitle: Subtitle3;
  buttons: Buttons4;
  StepName: StepName;
  Card: Card2;
  Footer: Footer;
}

export interface Subtitle3 {
  v1: string;
  v2: string;
}

export interface Buttons4 {
  Back: string;
  DownloadRoomGuide: string;
  RequestConsultation: string;
}

export interface StepName {
  "Room Solution Bundles": string;
  "Conference Camera": string;
  "Audio Extensions & Accessories": string;
  "Meeting Controller & Add On": string;
  "Video Accessories": string;
  "Software & Services": string;
}

export interface Card2 {
  PartNumber: string;
  PerUnit: string;
  MSRP: string;
  Price: string;
  ContactLocalReseller: string;
  ForAllWarranties: string;
  ForProduct: string;
}

export interface Footer {
  title: string;
  subtitle: string;
  Total: string;
}

export interface ShareModal {
  title: string;
  subtitle: string;
  button: string;
  labelAfterCopy: string;
}

export interface RequestConsultation {
  text: string;
}

export interface SelectProductModal {
  text: string;
  action: Action;
}

export interface Action {
  Yes: string;
  Back: string;
}

export interface FinishModal {
  text: string;
  action: Action2;
}

export interface Action2 {
  Yes: string;
  Back: string;
}

export interface RemoveModal {
  text: string;
  actions: Actions;
}

export interface Actions {
  Cancel: string;
  Delete: string;
}

export interface Navigation {
  Back: string;
  Next: string;
  Finish: string;
}

export interface Loader {
  Room: Room;
  Player: Player;
}

export interface Room {
  title: string;
  subtitle: string;
}

export interface Player {
  title: string;
}

export interface Csv {
  Annotation: string;
  Header: Header2;
}

export interface Header2 {
  RoomName: string;
  ProductName: string;
  ProductCategory: string;
  PartNumber: string;
  Quantity: string;
  MSRP: string;
  TotalMSRP: string;
}

export interface CardPageI {
  Colors: Colors;
  Counter: Counter;
  Text: Text;
  Display: CardDisplay;
}

export interface Colors {
  Graphite: string;
  White: string;
}

export interface Counter {
  Min: string;
  Max: string;
}

export interface Text {
  Accessories: string;
  Recommended: string;
  ChooseNumberOfYears: string;
  Years: string;
  AddToRoom: string;
}

export interface CardDisplay {
  Single: string;
  Dual: string;
  ForSingle: string;
  ForAll: string;
}

export interface GuideModal {
  CameraMouse: CameraMouse;
  CameraTouch: CameraTouch;
  Dimension: GuideModalTextTab;
  ProductInfo: GuideModalTextTab;
  Interact: GuideModalTextTab;
  Actions: Actions;
}

export interface CameraMouse {
  title: string;
  Card: CardCamera[];
}

export interface CameraTouch {
  title: string;
  Card: CardCamera[];
}

export interface CardCamera {
  title: string;
}

export interface GuideModalTextTab {
  title: string;
  subtitle: string;
}

export interface Actions {
  Next: string;
  Skip: string;
  LetsStarted: string;
}

export interface PlayerPageI {
  Dimension: DimensionTextDataI;
}

export interface DimensionTextDataI {
  Text: DimensionTextI;
}

export interface DimensionTextI {
  SizeTable: DimensionSizeTableI;
}

export interface DimensionSizeTableI {
  v1: string;
  v2: string;
}
