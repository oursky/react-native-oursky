// @flow
import * as React from "react";
import { Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Dialog } from "@oursky/react-native-oursky";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgb(94, 99, 180)",
  },
});

type State = {
  showDialog: boolean,
};

export default class DialogScreen extends React.PureComponent<{}, State> {
  state = {
    showDialog: false,
  };

  toggleDialog = () => {
    this.setState(prevState => ({
      showDialog: !prevState.showDialog,
    }));
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Button color="white" onPress={this.toggleDialog} title="Show Dialog" />
        <Dialog
          visible={this.state.showDialog}
          title="Enable Push Notifications"
          description="Receive notice from your latest message from coach and keep track of your status updates"
          submitText="Enable Notifications"
          cancelText="Maybe Later"
          onSubmit={this.toggleDialog}
          onCancel={this.toggleDialog}
        />
      </SafeAreaView>
    );
  }
}
