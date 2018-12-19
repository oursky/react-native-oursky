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
  showUndeterminedDialog: boolean,
  showDeniedDialog: boolean,
};

export default class RequirePermission extends React.PureComponent<
  Props,
  State
> {
  state = { showUndeterminedDialog: false, showDeniedDialog: false };
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
          this.setState({ showUndeterminedDialog: true });
          break;

        case "authorized":
          this.props.onAccept();
          break;

        case "denied":
        case "restricted":
          this.setState({ showDeniedDialog: true });
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
      this.setState({ showUndeterminedDialog: false });
    });
  };
  onCancelUndterminedDialog = () => {
    this.props.onReject();
    this.setState({ showUndeterminedDialog: false });
  };
  onSubmitDeniedDialog = () => {
    OpenSettings.openSettings();
    this.props.onReject();
    this.setState({ showDeniedDialog: false });
  };
  onCancelDeniedDialog = () => {
    this.props.onReject();
    this.setState({ showDeniedDialog: false });
  };
  render() {
    const { undeterminedDialogProps, deniedDialogProps } = this.props;
    const { showUndeterminedDialog, showDeniedDialog } = this.state;
    return (
      <>
        <Dialog
          {...undeterminedDialogProps}
          visible={showUndeterminedDialog}
          onSubmit={this.onSubmitUndeterminedDialog}
          onCancel={this.onCancelUndterminedDialog}
        />
        <Dialog
          {...deniedDialogProps}
          visible={showDeniedDialog}
          onSubmit={this.onSubmitDeniedDialog}
          onCancel={this.onCancelDeniedDialog}
        />
      </>
    );
  }
}
