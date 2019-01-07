import React from "react";
import { StyleSheet, StyleProp, TextStyle } from "react-native";
import Text from "./Text";

const defaultStyles = StyleSheet.create({
  extraText: {
    alignSelf: "flex-start",
  },
  nonvisible: {
    opacity: 0,
  },
});

export interface Props {
  error?: React.ReactNode;
  errorStyle?: StyleProp<TextStyle>;
  option?: React.ReactNode;
  optionStyle?: StyleProp<TextStyle>;
}

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
