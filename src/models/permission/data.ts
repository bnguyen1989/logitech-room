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
  RallyBarMini = "Rally Bar Mini",
  RallyBar = "Rally Bar",
  RallyPlus = "Rally Plus",
}

export enum AudioExtensionName {
  RallyMicPod = "Rally Mic Pod",
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
                [CameraName.RallyBar]: {
                  [StepName.AudioExtensions]: {
                    [AudioExtensionName.RallyMicPod]: {},
                  },
                },
                [CameraName.RallyBarMini]: {
                  [StepName.AudioExtensions]: {
                    [AudioExtensionName.RallyMicPod]: {
                      defaultActive: true,
                      isRecommended: true,
                    },
                  },
                },
              },
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBar]: {
                  [StepName.AudioExtensions]: {
                    [AudioExtensionName.RallyMicPod]: {},
                  },
                },
                [CameraName.RallyBarMini]: {
                  [StepName.AudioExtensions]: {
                    [AudioExtensionName.RallyMicPod]: {
                      defaultActive: true,
                      isRecommended: true,
                    },
                  },
                },
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
