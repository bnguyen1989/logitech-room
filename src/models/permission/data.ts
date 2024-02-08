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
                  defaultActive: true,
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
                  defaultActive: true,
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
                  defaultActive: true,
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
                  defaultActive: true,
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
                  defaultActive: true,
                },
              },
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBarHuddle]: {},
                [CameraName.MeetUp]: {},
                [CameraName.PreConfiguredMiniPC]: {
                  isVisible: false,
                  defaultActive: true,
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
                  defaultActive: true,
                },
              },
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBarHuddle]: {},
                [CameraName.MeetUp]: {},
                [CameraName.PreConfiguredMiniPC]: {
                  isVisible: false,
                  defaultActive: true,
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
                  defaultActive: true,
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
            },
            [ServiceName.PC]: {
              [StepName.ConferenceCamera]: {
                [CameraName.RallyBar]: {},
                [CameraName.RallyBarMini]: {},
                [CameraName.PreConfiguredMiniPC]: {
                  isVisible: false,
                  defaultActive: true,
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
                  defaultActive: true,
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
                defaultActive: true,
              },
            },
          },
        },
      },
    },
  },
};
