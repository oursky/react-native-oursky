// @flow
import * as React from "react";
import { Platform } from "react-native";
import Permissions from "react-native-permissions";
import OpenSettings from "react-native-open-settings";

import Dialog from "./Dialog";
import type { LayoutProps as DialogLayoutProps } from "./Dialog";

const AndroidPermission = ["photo"];
const IOSPermission = ["notification", "photo"];

export type Props = {
  permission: "notification" | "photo",

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
  state = {
    showUndeterminedDialog: false,
    showDeniedDialog: false,
  };

  componentDidMount() {
    const validPermission = Platform.select({
      ios: IOSPermission,
      android: AndroidPermission,
    });
    const requestPermission = this.props.permission;

    if (validPermission.includes(requestPermission)) {
      this.requestPermission(requestPermission);
    }
  }

  requestPermission = async (permission: string) => {
    try {
      const granted: Status = await Permissions.check(permission);
      switch (granted) {
        case "undetermined":
          this.setState({
            showUndeterminedDialog: true,
          });
          break;
        case "authorized":
          this.props.onAccept();
          break;
        case "denied":
        case "restricted":
          this.setState({
            showDeniedDialog: true,
          });
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
      this.setState({
        showUndeterminedDialog: false,
      });
    });
  };

  onCancelUndterminedDialog = () => {
    this.props.onReject();
    this.setState({
      showUndeterminedDialog: false,
    });
  };

  onSubmitDeniedDialog = () => {
    OpenSettings.openSettings();
    this.props.onReject();
    this.setState({
      showDeniedDialog: false,
    });
  };

  onCancelDeniedDialog = () => {
    this.props.onReject();
    this.setState({
      showDeniedDialog: false,
    });
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
