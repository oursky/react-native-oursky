import React from "react";
import { Platform } from "react-native";
import Permissions, {
  Permission,
  AndroidPermission,
  IOSPermission,
  PermissionResult,
} from "react-native-permissions";
import OpenSettings from "react-native-open-settings";
import Dialog, { LayoutProps as DialogLayoutProps } from "./Dialog";

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

export interface Props {
  permission: Permission;
  undeterminedDialogProps: DialogLayoutProps;
  deniedDialogProps: DialogLayoutProps;
  onAccept: () => void;
  onReject: () => void;
}

type State = {
  shownDialog: "undeterminedDialog" | "deniedDialog" | null;
};

export default class RequirePermission extends React.PureComponent<
  Props,
  State
> {
  state = { shownDialog: null };
  componentDidMount() {
    const validPermissions: Permission[] = Platform.select({
      ios: IOSPermissions as Permission[],
      android: AndroidPermissions as Permission[],
    });
    const permission = this.props.permission;

    if (validPermissions.includes(permission)) {
      this.checkPermission(permission);
    }
  }
  checkPermission = async (permission: string) => {
    try {
      const granted = await Permissions.check(permission as Permission);
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
    Permissions.request(permission).then((granted: PermissionResult) => {
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
    if (shownDialog == null) {
      return null;
    }
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
