// @flow
import * as React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import { RequirePermission, Dialog, Text } from "@oursky/react-native-oursky";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(94, 99, 180)",
  },
  text: {
    color: "white",
  },
});

type State = {
  message: string,
};

export default class RequirePermissionScreen extends React.PureComponent<
  {},
  State
> {
  state = {
    message: "",
  };

  onAccept = () => {
    this.setState({
      message: "The permission been accept",
    });
  };

  onReject = () => {
    this.setState({
      message: "The permission been reject",
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <RequirePermission
          permission="photo"
          onAccept={this.onAccept}
          onReject={this.onReject}
          undeterminedDialogProps={{
            title: "Enable Image Library Access",
            description:
              "In order to choose and upload image please allow the image library access permission.",
            submitText: "Allow Access",
            cancelText: "Maybe Later",
          }}
          deniedDialogProps={{
            title: "Image Library Access Disabled",
            description:
              "Please tap the button below to go to the privacy settings and activate the image library permission manually.",
            submitText: "Go to Settings",
            cancelText: "Maybe Later",
          }}
        />
        <Text style={styles.text}>{this.state.message}</Text>
      </SafeAreaView>
    );
  }
}
