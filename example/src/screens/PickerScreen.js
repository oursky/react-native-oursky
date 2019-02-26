// @flow
import * as React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@oursky/react-native-oursky";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 16,
  },
});

const ITEMS = [
  {
    label: "A",
    value: "A",
  },
  {
    label: "B",
    value: "B",
  },
  {
    label: "C",
    value: "C",
  },
];

type State = {
  selectedValue: string,
  visible: boolean,
};

export default class PortalScreen extends React.PureComponent<{}, State> {
  state = {
    selectedValue: "",
    visible: false,
  };

  onDismiss = (value: string) => {
    this.setState({ selectedValue: value, visible: false });
  };

  onDone = (value: string) => {
    this.setState({ selectedValue: value, visible: false });
  };

  onCancel = (value: string) => {
    this.setState({ selectedValue: value, visible: false });
  };

  showPicker = () => {
    this.setState({ visible: true });
  };

  render() {
    const { selectedValue, visible } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this.showPicker}>
          <Text>Show Picker: {JSON.stringify(selectedValue)}</Text>
        </TouchableOpacity>
        <Picker
          visible={visible}
          value={selectedValue}
          items={ITEMS}
          onDismiss={this.onDismiss}
          onDone={this.onDone}
          onCancel={this.onCancel}
        />
      </View>
    );
  }
}
