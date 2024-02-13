

export const jsonData = {
  // [StepName.Platform]: {
  //   [PlatformName.GoogleMeet]: {
  //     [StepName.RoomSize]: {
  //       [RoomSizeName.Phonebooth]: {
  //         [StepName.Services]: {
  //           [ServiceName.Android]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBarHuddle]: {},
  //             },
  //           },
  //           [ServiceName.PC]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.MeetUp]: {},
  //               [CameraName.PreConfiguredMiniPC]: {
  //                 isVisible: false,
  //                 isRequired: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       [RoomSizeName.Huddle]: {
  //         [StepName.Services]: {
  //           [ServiceName.Android]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBarHuddle]: {},
  //             },
  //           },
  //           [ServiceName.PC]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.MeetUp]: {},
  //               [CameraName.PreConfiguredMiniPC]: {
  //                 isVisible: false,
  //                 isRequired: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       [RoomSizeName.Small]: {
  //         [StepName.Services]: {
  //           [ServiceName.Android]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBarMini]: {},
  //             },
  //           },
  //         },
  //       },
  //       [RoomSizeName.Medium]: {
  //         [StepName.Services]: {
  //           [ServiceName.Android]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBar]: {},
  //             },
  //           },
  //           [ServiceName.PC]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBarMini]: {},
  //               [CameraName.PreConfiguredMiniPC]: {
  //                 isVisible: false,
  //                 isRequired: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       [RoomSizeName.Large]: {
  //         [StepName.Services]: {
  //           [ServiceName.Android]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBar]: {},
  //             },
  //           },
  //           [ServiceName.PC]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyPlus]: {},
  //               [CameraName.PreConfiguredMiniPC]: {
  //                 isVisible: false,
  //                 isRequired: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  //   [PlatformName.MicrosoftTeams]: {
  //     [StepName.RoomSize]: {
  //       [RoomSizeName.Phonebooth]: {
  //         [StepName.Services]: {
  //           [ServiceName.Android]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBarHuddle]: {},
  //               [CameraName.MeetUp]: {},
  //               [CameraName.RoomMate]: {
  //                 dependence: [CameraName.MeetUp],
  //                 isRequired: true,
  //               },
  //             },
  //           },
  //           [ServiceName.PC]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBarHuddle]: {},
  //               [CameraName.MeetUp]: {},
  //               [CameraName.PreConfiguredMiniPC]: {
  //                 isVisible: false,
  //                 isRequired: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       [RoomSizeName.Huddle]: {
  //         [StepName.Services]: {
  //           [ServiceName.Android]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBarHuddle]: {},
  //               [CameraName.MeetUp]: {},
  //               [CameraName.RoomMate]: {
  //                 dependence: [CameraName.MeetUp],
  //                 isRequired: true,
  //               },
  //             },
  //           },
  //           [ServiceName.PC]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBarHuddle]: {},
  //               [CameraName.MeetUp]: {},
  //               [CameraName.PreConfiguredMiniPC]: {
  //                 isVisible: false,
  //                 isRequired: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       [RoomSizeName.Small]: {
  //         [StepName.Services]: {
  //           [ServiceName.Android]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBarMini]: {},
  //             },
  //           },
  //           [ServiceName.PC]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBarMini]: {},
  //               [CameraName.PreConfiguredMiniPC]: {
  //                 isVisible: false,
  //                 isRequired: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       [RoomSizeName.Medium]: {
  //         [StepName.Services]: {
  //           [ServiceName.Android]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBar]: {},
  //               [CameraName.RallyBarMini]: {},
  //             },
  //             [StepName.AudioExtensions]: {
  //               dependenceFromSteps: {
  //                 [StepName.ConferenceCamera]: {
  //                   [CameraName.RallyBar]: {
  //                     [AudioExtensionName.RallyMicPod]: {},
  //                   },
  //                   [CameraName.RallyBarMini]: {
  //                     [AudioExtensionName.RallyMicPod]: {
  //                       defaultActive: true,
  //                       isRecommended: true,
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //             [StepName.MeetingController]: {
  //               [MeetingControllerName.LogitechTap]: {},
  //               [MeetingControllerName.LogitechTapIP]: {},
  //               [MeetingControllerName.LogitechSight]: {},
  //               [MeetingControllerName.LogitechTapScheduler]: {},
  //               [MeetingControllerName.LogitechSwytch]: {},
  //             },
  //             [StepName.VideoAccessories]: {
  //               [VideoAccessoryName.WallMount]: {},
  //               [VideoAccessoryName.RiserMount]: {},
  //               [VideoAccessoryName.TableMount]: {},
  //               [VideoAccessoryName.RallyMicPodHub]: {},
  //               [VideoAccessoryName.MicPodExtensionCable]: {},
  //             },
  //             [StepName.SoftwareServices]: {
  //               [SoftwareServicesName.LogitechSync]: {},
  //               [SoftwareServicesName.SupportService]: {},
  //             },
  //           },
  //           [ServiceName.PC]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBar]: {},
  //               [CameraName.RallyBarMini]: {},
  //               [CameraName.PreConfiguredMiniPC]: {
  //                 isVisible: false,
  //                 isRequired: true,
  //               },
  //             },
  //             [StepName.AudioExtensions]: {
  //               dependenceFromSteps: {
  //                 [StepName.ConferenceCamera]: {
  //                   [CameraName.RallyBar]: {
  //                     [AudioExtensionName.RallyMicPod]: {},
  //                   },
  //                   [CameraName.RallyBarMini]: {
  //                     [AudioExtensionName.RallyMicPod]: {
  //                       defaultActive: true,
  //                       isRecommended: true,
  //                     },
  //                   },
  //                 },
  //               },
  //             },
  //             [StepName.MeetingController]: {
  //               [MeetingControllerName.LogitechTap]: {},
  //               [MeetingControllerName.LogitechSight]: {},
  //               [MeetingControllerName.LogitechTapScheduler]: {},
  //               [MeetingControllerName.LogitechScribe]: {},
  //               [MeetingControllerName.LogitechSwytch]: {},
  //             },
  //             [StepName.VideoAccessories]: {
  //               [VideoAccessoryName.ComputeMount]: {},
  //               [VideoAccessoryName.WallMount]: {},
  //               [VideoAccessoryName.RiserMount]: {},
  //               [VideoAccessoryName.TableMount]: {},
  //               [VideoAccessoryName.TVMountForVideoBars]: {},
  //               [VideoAccessoryName.WallMountForVideoBars]: {},
  //               [VideoAccessoryName.RallyMicPodMount]: {},
  //               [VideoAccessoryName.RallyMicPodHub]: {},
  //               [VideoAccessoryName.MicPodExtensionCable]: {},
  //             },
  //             [StepName.SoftwareServices]: {
  //               [SoftwareServicesName.LogitechSync]: {},
  //               [SoftwareServicesName.SupportService]: {},
  //             },
  //           },
  //         },
  //       },
  //       [RoomSizeName.Large]: {
  //         [StepName.Services]: {
  //           [ServiceName.Android]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBar]: {},
  //               [CameraName.RallyPlus]: {},
  //             },
  //           },
  //           [ServiceName.PC]: {
  //             [StepName.ConferenceCamera]: {
  //               [CameraName.RallyBar]: {},
  //               [CameraName.RallyPlus]: {},
  //               [CameraName.PreConfiguredMiniPC]: {
  //                 isVisible: false,
  //                 isRequired: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       [RoomSizeName.Auditorium]: {
  //         [StepName.Services]: {
  //           [ServiceName.Android]: {
  //             [CameraName.RallyPlus]: {},
  //             [CameraName.RoomMate]: {},
  //           },
  //           [ServiceName.PC]: {
  //             [CameraName.RallyPlus]: {},
  //             [CameraName.PreConfiguredMiniPC]: {
  //               isVisible: false,
  //               isRequired: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
};
