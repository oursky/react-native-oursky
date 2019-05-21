import React, { ReactNode, ReactElement } from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
  Text,
} from "react-native";

export function isFormRow(c: ReactNode): c is ReactElement<Props> {
  return React.isValidElement(c) && c.type === FormRow;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});

interface Props {
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
  title: ReactNode;
  value: ReactNode;
  onTitleLayoutChange?: (event: LayoutChangeEvent) => void;
}

export default function FormRow(props: Props) {
  return (
    <View style={[styles.container, props.style]}>
      <Text onLayout={props.onTitleLayoutChange} style={props.titleStyle}>
        {props.title}
      </Text>
      <Text style={props.valueStyle}>{props.value}</Text>
    </View>
  );
}
