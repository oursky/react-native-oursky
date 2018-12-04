// @flow
import * as React from "react";
import { StyleSheet, View } from "react-native";

import Text from "./Text";
import { ViewStyle } from "./styles";

export type Props = {
  style?: ViewStyle,
  value: string,
  isError?: boolean,
};

const styles = StyleSheet.create({
  defaultStyle: {
    flex: 1,
    height: 86,
    marginHorizontal: 4.5,
    backgroundColor: "rgb(232, 232, 232)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  text: {
    fontSize: 42,
    color: "black",
  },
  error: {
    borderColor: "rgb(238, 0, 0)",
    borderWidth: 1,
  },
});

export default class CodeBox extends React.PureComponent<Props> {
  static defaultProps = {
    isError: false,
  };

  render() {
    const { isError, value, style } = this.props;
    return (
      <View style={[styles.defaultStyle, style, isError ? styles.error : null]}>
        <Text style={styles.text}>{value}</Text>
      </View>
    );
  }
}
