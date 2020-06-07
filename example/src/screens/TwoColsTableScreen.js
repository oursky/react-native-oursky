// @flow
import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { TwoColsGroup, TwoColsRow, Text } from "@oursky/react-native-oursky";
import { SafeAreaView } from "react-navigation";

styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
  },
  button: {
    marginTop: 10,
    padding: 10,
    alignSelf: "flex-start",
    borderColor: "black",
    borderWidth: 1,
  },
  title: {
    backgroundColor: "red",
  },
  value: {
    flex: 1,
    backgroundColor: "green",
  },
});

type Props = NavigationScreenProps & {};

type State = {
  toggleAlignTitle: boolean,
};

class TwoColsTableScreen extends React.PureComponent<Props, State> {
  state = {
    toggleAlignTitle: false,
  };

  toggleAlignTitle = () => {
    this.setState(prevState => ({
      toggleAlignTitle: !prevState.toggleAlignTitle,
    }));
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TwoColsGroup alignTitle={this.state.toggleAlignTitle}>
          <TwoColsRow
            title="test 123"
            value="hello"
            titleStyle={styles.title}
            valueStyle={styles.value}
          />
          <TwoColsRow
            titleStyle={styles.title}
            valueStyle={styles.value}
            title="test"
            value="hello"
          />
          <TwoColsRow
            titleStyle={styles.title}
            valueStyle={styles.value}
            title="test long long"
            value="hello 123"
          />
        </TwoColsGroup>
        <TouchableOpacity style={styles.button} onPress={this.toggleAlignTitle}>
          <Text>{`Press to toggle align title: ${
            this.state.toggleAlignTitle
          }`}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

export default TwoColsTableScreen;
