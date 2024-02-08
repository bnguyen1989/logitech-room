import { StepName } from "./type";

export enum PlatformName {
  GoogleMeet = "Google Meet",
  MicrosoftTeams = "Microsoft Teams",
  Zoom = "Zoom",
}

export enum RoomSizeName {
  Phonebooth = "Phonebooth",
  Huddle = "Huddle",
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
  Auditorium = "Auditorium",
}

export enum ServiceName {
  Android = "Android",
  PC = "PC",
}

export enum CameraName {
  RallyBarHuddle = "Rally Bar Huddle",
  PreConfiguredMiniPC = "Pre-Configured Mini PC",
  MeetUp = "MeetUp",
  RoomMate = "RoomMate",
  RallyBarMini = "Logitech Rally Bar Mini",
  RallyBar = "Logitech Rally Bar",
  RallyPlus = "Rally Plus",
}

export enum AudioExtensionName {
  RallyMicPod = "Rally Mic Pod",
}

export enum MeetingControllerName {
  LogitechTapIP = "Logitech Tap IP",
  LogitechTap = "Logitech Tap",
  LogitechSight = "Logitech Sight",
  LogitechTapScheduler = "Logitech Tap Scheduler",
  LogitechScribe = "Logitech Scribe",
  LogitechSwytch = "Logitech Swytch",
}

export enum VideoAccessoryName {
  ComputeMount = "Compute Mount",
  WallMount = "Tap Mount - Wall Mount",
  RiserMount = "Tap Mount - Riser Mount",
  TableMount = "Tap Mount - Table Mount",
  WallMountForVideoBars = "Wall Mount for Video Bars",
  TVMountForVideoBars = "TV Mount for Video Bars",
  RallyMicPodMount = "Logitech Rally Mic Pod Mount",
  RallyMicPodHub = "Rally Mic Pod Hub",
  MicPodExtensionCable = "Mic Pod Extension Cable",
}

export enum SoftwareServicesName {
  LogitechSync = "Logitech Sync",
  SupportService = "Support Service",
}

export const jsonData = {
  [StepName.Platform]: {
    [PlatformName.GoogleMeet]: {
      [StepName.RoomSize]: {
        [RoomSizeName.Phonebooth]: {
          [StepName.Services]: {
            [ServiceName.Android]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBarHuddle]: {},
              },
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.MeetUp]: {},
                [CameraName.PreConfiguredMiniPC]: {
                  isVisible: false,
                  isRequired: true,
                },
              },
            },
          },
        },
        [RoomSizeName.Huddle]: {
          [StepName.Services]: {
            [ServiceName.Android]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBarHuddle]: {},
              },
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.MeetUp]: {},
                [CameraName.PreConfiguredMiniPC]: {
                  isVisible: false,
                  isRequired: true,
                },
              },
            },
          },
        },
        [RoomSizeName.Small]: {
          [StepName.Services]: {
            [ServiceName.Android]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBarMini]: {},
              },
            },
          },
        },
        [RoomSizeName.Medium]: {
          [StepName.Services]: {
            [ServiceName.Android]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBar]: {},
              },
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBarMini]: {},
                [CameraName.PreConfiguredMiniPC]: {
                  isVisible: false,
                  isRequired: true,
                },
              },
            },
          },
        },
        [RoomSizeName.Large]: {
          [StepName.Services]: {
            [ServiceName.Android]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBar]: {},
              },
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyPlus]: {},
                [CameraName.PreConfiguredMiniPC]: {
                  isVisible: false,
                  isRequired: true,
                },
              },
            },
          },
        },
      },
    },
    [PlatformName.MicrosoftTeams]: {
      [StepName.RoomSize]: {
        [RoomSizeName.Phonebooth]: {
          [StepName.Services]: {
            [ServiceName.Android]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBarHuddle]: {},
                [CameraName.MeetUp]: {},
                [CameraName.RoomMate]: {
                  dependence: [CameraName.MeetUp],
                  isRequired: true,
                },
              },
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBarHuddle]: {},
                [CameraName.MeetUp]: {},
                [CameraName.PreConfiguredMiniPC]: {
                  isVisible: false,
                  isRequired: true,
                },
              },
            },
          },
        },
        [RoomSizeName.Huddle]: {
          [StepName.Services]: {
            [ServiceName.Android]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBarHuddle]: {},
                [CameraName.MeetUp]: {},
                [CameraName.RoomMate]: {
                  dependence: [CameraName.MeetUp],
                  isRequired: true,
                },
              },
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBarHuddle]: {},
                [CameraName.MeetUp]: {},
                [CameraName.PreConfiguredMiniPC]: {
                  isVisible: false,
                  isRequired: true,
                },
              },
            },
          },
        },
        [RoomSizeName.Small]: {
          [StepName.Services]: {
            [ServiceName.Android]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBarMini]: {},
              },
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBarMini]: {},
                [CameraName.PreConfiguredMiniPC]: {
                  isVisible: false,
                  isRequired: true,
                },
              },
            },
          },
        },
        [RoomSizeName.Medium]: {
          [StepName.Services]: {
            [ServiceName.Android]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBar]: {},
                [CameraName.RallyBarMini]: {},
              },
              [StepName.AudioExtensions]: {
                dependence: {
                  [StepName.ConferenceCamera]: {
                    [CameraName.RallyBar]: {
                      [AudioExtensionName.RallyMicPod]: {},
                    },
                    [CameraName.RallyBarMini]: {
                      [AudioExtensionName.RallyMicPod]: {
                        defaultActive: true,
                        isRecommended: true,
                      },
                    },
                  },
                },
              },
              [StepName.MeetingController]: {
                [MeetingControllerName.LogitechTap]: {},
                [MeetingControllerName.LogitechTapIP]: {},
                [MeetingControllerName.LogitechSight]: {},
                [MeetingControllerName.LogitechTapScheduler]: {},
                [MeetingControllerName.LogitechSwytch]: {},
              },
              [StepName.VideoAccessories]: {
                [VideoAccessoryName.WallMount]: {},
                [VideoAccessoryName.RiserMount]: {},
                [VideoAccessoryName.TableMount]: {},
                [VideoAccessoryName.RallyMicPodHub]: {},
                [VideoAccessoryName.MicPodExtensionCable]: {},
              },
              [StepName.SoftwareServices]: {
                [SoftwareServicesName.LogitechSync]: {},
                [SoftwareServicesName.SupportService]: {},
              },
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBar]: {},
                [CameraName.RallyBarMini]: {},
                [CameraName.PreConfiguredMiniPC]: {
                  isVisible: false,
                  isRequired: true,
                },
              },
              [StepName.AudioExtensions]: {
                dependence: {
                  [StepName.ConferenceCamera]: {
                    [CameraName.RallyBar]: {
                      [AudioExtensionName.RallyMicPod]: {},
                    },
                    [CameraName.RallyBarMini]: {
                      [AudioExtensionName.RallyMicPod]: {
                        defaultActive: true,
                        isRecommended: true,
                      },
                    },
                  },
                },
              },
              [StepName.MeetingController]: {
                [MeetingControllerName.LogitechTap]: {},
                [MeetingControllerName.LogitechSight]: {},
                [MeetingControllerName.LogitechTapScheduler]: {},
                [MeetingControllerName.LogitechScribe]: {},
                [MeetingControllerName.LogitechSwytch]: {},
              },
              [StepName.VideoAccessories]: {
                [VideoAccessoryName.ComputeMount]: {},
                [VideoAccessoryName.WallMount]: {},
                [VideoAccessoryName.RiserMount]: {},
                [VideoAccessoryName.TableMount]: {},
                [VideoAccessoryName.TVMountForVideoBars]: {},
                [VideoAccessoryName.WallMountForVideoBars]: {},
                [VideoAccessoryName.RallyMicPodMount]: {},
                [VideoAccessoryName.RallyMicPodHub]: {},
                [VideoAccessoryName.MicPodExtensionCable]: {},
              },
              [StepName.SoftwareServices]: {
                [SoftwareServicesName.LogitechSync]: {},
                [SoftwareServicesName.SupportService]: {},
              },
            },
          },
        },
        [RoomSizeName.Large]: {
          [StepName.Services]: {
            [ServiceName.Android]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBar]: {},
                [CameraName.RallyPlus]: {},
              },
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBar]: {},
                [CameraName.RallyPlus]: {},
                [CameraName.PreConfiguredMiniPC]: {
                  isVisible: false,
                  isRequired: true,
                },
              },
            },
          },
        },
        [RoomSizeName.Auditorium]: {
          [StepName.Services]: {
            [ServiceName.Android]: {
              [CameraName.RallyPlus]: {},
              [CameraName.RoomMate]: {},
            },
            [ServiceName.PC]: {
              [CameraName.RallyPlus]: {},
              [CameraName.PreConfiguredMiniPC]: {
                isVisible: false,
                isRequired: true,
              },
            },
          },
        },
      },
    },
  },
};
