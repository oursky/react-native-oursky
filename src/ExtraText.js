// @flow
import * as React from "react";
import { View, StyleSheet } from "react-native";
import type { RefObject } from "react-native/Libraries/Renderer/shims/ReactTypes";

import Text from "./Text";
import { TextStyle, ViewStyle } from "./styles";

const defaultStyles = StyleSheet.create({
  extraText: {
    alignSelf: "flex-start",
  },
  nonvisible: {
    opacity: 0,
  },
});

export type Props = {
  error?: React.Node | null,
  errorStyle?: TextStyle,
  option?: React.Node,
  optionStyle?: TextStyle,
};

export default function ExtraText(props: Props) {
  const { error, errorStyle, option, optionStyle } = props;
  if (error) {
    return <Text style={[defaultStyles.extraText, errorStyle]}>{error}</Text>;
  } else if (option) {
    return <Text style={[defaultStyles.extraText, optionStyle]}>{option}</Text>;
  } else if (error !== undefined) {
    // make sure layout won't unstable, whether error message show or not.
    return (
      <Text
        style={[defaultStyles.extraText, errorStyle, defaultStyles.nonvisible]}
      >
        nonvisible
      </Text>
    );
  } else {
    return null;
  }
}
