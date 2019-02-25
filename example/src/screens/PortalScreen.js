// @flow
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Modal } from "@oursky/react-native-oursky";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 14,
    backgroundColor: "red",
    margin: 10,
  },
});

type State = {
  count: number,
  showPortal: boolean,
};

export default class PortalScreen extends React.PureComponent<{}, State> {
  state = {
    count: 0,
    showPortal: false,
  };

  showPortal = () => {
    this.setState({
      showPortal: true,
    });
  };

  hidePortal = () => {
    this.setState({
      showPortal: false,
    });
  };

  changeCount = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }));
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this.showPortal}>
          <Text>Press me</Text>
        </TouchableOpacity>
        <Text>Count: {this.state.count}</Text>
        <Modal visible={this.state.showPortal} onRequestClose={this.hidePortal}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.button} onPress={this.changeCount}>
              <Text>Add 1</Text>
            </TouchableOpacity>
            <Text>Count in portal: {this.state.count}</Text>
            <TouchableOpacity style={styles.button} onPress={this.hidePortal}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}
