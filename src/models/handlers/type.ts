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
  tapQty_tapIp = "tapQty_tapIp",
  micPodQty_sight = "micPodQty_sight",
  micPod_micMount_optional = "micPod_micMount_optional",
  micPod_micPodExt_optional = "micPod_micPodExt_optional",
  micPod_micPodHub_required = "micPod_micPodHub_required",
  reco_micPendantMount_inWhite = "reco_micPendantMount_inWhite",
  reco_micPod_micPodHub = "reco_micPod_micPodHub",
}
