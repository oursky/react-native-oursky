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

export type Props<P> = P & {
  error?: string | null,
  errorStyle?: TextStyle,
  option?: string,
  optionStyle?: TextStyle,

  containerStyle?: ViewStyle,
};

function makeExtraText(
  error?: string | null,
  errorStyle?: TextStyle,
  option?: string,
  optionStyle?: TextStyle
): Text | null {
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
  }
}

export default function withExtraText<P>(Component: React.ComponentType<P>) {
  const forwardRef = (props: Props<P>, ref?) => {
    const {
      error,
      errorStyle,
      option,
      optionStyle,
      containerStyle,
      ...rest
    } = props;
    return (
      <View style={containerStyle}>
        <Component {...rest} ref={ref} />
        {makeExtraText(error, errorStyle, option, optionStyle)}
      </View>
    );
  };
  // $FlowFixMe
  return React.forwardRef(forwardRef);
}
