// @flow
import * as React from "react";
import { Platform } from "react-native";
import Permissions from "react-native-permissions";
import OpenSettings from "react-native-open-settings";

import Dialog from "./Dialog";
import type { LayoutProps as DialogLayoutProps } from "./Dialog";

type AndroidPermission =
  | "photo"
  | "location"
  | "camera"
  | "microphone"
  | "contacts"
  | "event"
  | "storage"
  | "callPhone"
  | "readSms"
  | "receiveSms";

type IOSPermission =
  | "notification"
  | "photo"
  | "location"
  | "camera"
  | "microphone"
  | "contacts"
  | "event"
  | "bluetooth"
  | "reminder"
  | "backgroundRefresh"
  | "speechRecognition"
  | "mediaLibrary"
  | "motion";

const AndroidPermissions: AndroidPermission[] = [
  "photo",
  "location",
  "camera",
  "microphone",
  "contacts",
  "event",
  "storage",
  "callPhone",
  "readSms",
  "receiveSms",
];
const IOSPermissions: IOSPermission[] = [
  "notification",
  "photo",
  "location",
  "camera",
  "microphone",
  "contacts",
  "event",
  "bluetooth",
  "reminder",
  "backgroundRefresh",
  "speechRecognition",
  "mediaLibrary",
  "motion",
];

export type Props = {
  permission: AndroidPermission & IOSPermission,
  undeterminedDialogProps: DialogLayoutProps,
  deniedDialogProps: DialogLayoutProps,

  onAccept: () => void,
  onReject: () => void,
};

type Status = "authorized" | "denied" | "restricted" | "undetermined";

type State = {
  shownDialog: "undeterminedDialog" | "deniedDialog" | null,
};

export default class RequirePermission extends React.PureComponent<
  Props,
  State
> {
  state = { shownDialog: null };
  componentDidMount() {
    const validPermissions = Platform.select({
      ios: IOSPermissions,
      android: AndroidPermissions,
    });
    const permission = this.props.permission;

    if (validPermissions.includes(permission)) {
      this.checkPermission(permission);
    }
  }
  checkPermission = async (permission: string) => {
    try {
      const granted: Status = await Permissions.check(permission);
      switch (granted) {
        case "undetermined":
          this.setState({ shownDialog: "undeterminedDialog" });
          break;

        case "authorized":
          this.props.onAccept();
          break;

        case "denied":
        case "restricted":
          this.setState({ shownDialog: "deniedDialog" });
          break;
      }
    } catch (e) {
      this.props.onReject();
    }
  };
  onSubmitUndeterminedDialog = () => {
    const { permission } = this.props;
    Permissions.request(permission).then((granted: Status) => {
      if (granted == "authorized") {
        this.props.onAccept();
      } else {
        this.props.onReject();
      }
      this.setState({ shownDialog: null });
    });
  };
  onCancelUndeterminedDialog = () => {
    this.props.onReject();
    this.setState({ shownDialog: null });
  };
  onSubmitDeniedDialog = () => {
    OpenSettings.openSettings();
    this.props.onReject();
    this.setState({ shownDialog: null });
  };
  onCancelDeniedDialog = () => {
    this.props.onReject();
    this.setState({ shownDialog: null });
  };
  render() {
    const { undeterminedDialogProps, deniedDialogProps } = this.props;
    const { shownDialog } = this.state;
    switch (shownDialog) {
      case "undeterminedDialog":
        return (
          <Dialog
            {...undeterminedDialogProps}
            visible={true}
            onSubmit={this.onSubmitUndeterminedDialog}
            onCancel={this.onCancelUndeterminedDialog}
          />
        );

      case "deniedDialog":
        return (
          <Dialog
            {...deniedDialogProps}
            visible={true}
            onSubmit={this.onSubmitDeniedDialog}
            onCancel={this.onCancelDeniedDialog}
          />
        );

      default:
        return null;
    }
  }
}
