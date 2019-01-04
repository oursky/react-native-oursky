import React from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import Text from "./Text";

export interface Props {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  value: string;
  isError?: boolean;
  onPress?: () => void;
}

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

export default function CodeBox(props: Props) {
  const { isError, value, style, textStyle, onPress } = props;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.defaultStyle, style, isError ? styles.error : null]}>
        <Text style={[styles.text, textStyle]}>{value}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
