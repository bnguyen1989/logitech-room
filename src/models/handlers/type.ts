export interface AttrSpecI {
  [key: string]: {
    attrType: string;
    allowBlank: boolean;
    validOptionNames: Array<string>;
    validOptionIds: Array<string>;
    defaultValue: string;
    preInvalid: string;
  };
}

export enum RuleName {
  // Attribute Rules
  tapQty_tapIp = "tapQty_tapIp",
  micPodQty_sight = "micPodQty_sight",
  micPod_CATCoupler = "micPod_CATCoupler",
  micPod_micMount_inNoneWhite = "micPod_micMount_inNoneWhite",
  micPod_micMount_inWhite = "micPod_micMount_inWhite",
  rallyBar_TapIp_bundle = "rallyBar_TapIp_bundle",
  rallyBarMini_TapIp_bundle = "rallyBarMini_TapIp_bundle",
  rallyPlus_bundle = "rallyPlus_bundle",
  byod_reqOneAddon = "byod_reqOneAddon",
  tapIp_scribe = "tapIp_scribe",

  //Recommendation Rules
  reco_micPendantMount_inWhite = "reco_micPendantMount_inWhite",
  reco_micPod_micPodHub = "reco_micPod_micPodHub",
  reco_RallyBar = "reco_RallyBar",
  reco_RallyPlus = "reco_RallyPlus",
}

export enum PrefixName {
  DEFAULT_ACTIVE = "*",
  RECOMMENDED_DEFAULT_ACTIVE = "r*",
  RECOMMENDED_DEFAULT = "r_",
}
