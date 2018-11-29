// @flow
import React from "react";
import { View, Platform, TouchableOpacity, StyleSheet } from "react-native";
import type { Props as ViewProps } from "react-native/Libraries/Components/View/View";
import StyleSheetPropType from "react-native/Libraries/StyleSheet/StyleSheetPropType";
import ViewStylePropTypes from "react-native/Libraries/Components/View/ViewStylePropTypes";
import TextStylePropTypes from "react-native/Libraries/Text/TextStylePropTypes";

import Text from "./Text";
import type { Props as TextProps } from "./Text";
import TextInput from "./TextInput";
import type { Props as TextInputProps } from "./TextInput";

const defaultStyles = StyleSheet.create({
  header: {
    color: "white",
    fontSize: 32,
    marginBottom: 30,
  },
  container: {
    borderRadius: 24,
    backgroundColor: "white",
    shadowColor: "rgba(0, 0, 0, .2)",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    paddingHorizontal: 21,
    paddingVertical: 31,
  },
  description: {
    fontSize: 18,
    color: "rgb(51, 51, 51)",
  },
  flexRow: {
    flexDirection: "row",
  },
  title: {
    color: "rgb(63, 68, 165)",
    marginTop: 27,
    fontSize: 24,
  },
  mobileNumberContainer: {
    flex: 1,
    marginTop: 8,
  },
  mobileNumberText: {
    borderBottomColor: "rgb(170, 170, 170)",
    borderBottomWidth: 1,
    paddingVertical: 11,
  },
  error: {
    paddingVertical: 4,
    color: "rgb(208, 2, 27)",
    fontSize: 13,
  },
  submitButton: {
    marginTop: 41,
    borderColor: "rgb(151, 151, 151)",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  submitText: {
    fontSize: 24,
    color: "rgb(51, 51, 51)",
  },
  skipButton: {
    marginTop: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    fontSize: 14,
    color: "rgb(63, 68, 165)",
  },
});

const ViewStyle = StyleSheetPropType(ViewStylePropTypes);
const TextStyle = StyleSheetPropType(TextStylePropTypes);

export type Mobile = {
  countryCallingCode: string,
  nationalNumber: string,
};

export type Props = {
  style?: ViewStyle,
  containerStyle?: ViewStyle,

  headerTitle?: string,
  headerStyle?: TextStyle,
  description?: string,
  descriptionStyle?: TextStyle,
  title?: string,
  titleStyle?: TextStyle,

  mobileNumberProps?: TextInputProps,

  submitButtonStyle?: ViewStyle,
  submitButtonText?: string,
  submitButtonTextStyle?: TextStyle,

  skipButtonStyle?: ViewStyle,
  skipButtonText?: string,
  skipButtonTextStyle?: TextStyle,

  onPressButton?: (mobile: Mobile) => void,
  onPressSkip?: () => void,
};

export default class SignupWithMobile extends React.PureComponent<Props> {
  render() {
    const {
      headerTitle,
      description,
      title,
      onPressButton,
      submitButtonText,
      onPressSkip,
      skipButtonText,

      style,
      headerStyle,
      containerStyle,
      descriptionStyle,
      titleStyle,
      submitButtonStyle,
      submitButtonTextStyle,
      skipButtonStyle,
      skipButtonTextStyle,
      mobileNumberProps,
    } = this.props;
    return (
      <View style={[style]}>
        <Text style={[defaultStyles.header, headerStyle]}>{headerTitle}</Text>
        <View style={[defaultStyles.container, containerStyle]}>
          <Text style={[defaultStyles.description, descriptionStyle]}>
            {description}
          </Text>
          <Text style={[defaultStyles.title, titleStyle]}>{title}</Text>
          <View style={defaultStyles.flexRow}>
            <TextInput
              {...mobileNumberProps}
              containerStyle={[
                defaultStyles.mobileNumberContainer,
                mobileNumberProps && mobileNumberProps.containerStyle,
              ]}
              style={[
                defaultStyles.mobileNumberText,
                mobileNumberProps && mobileNumberProps.style,
              ]}
              errorStyle={[
                defaultStyles.error,
                mobileNumberProps && mobileNumberProps.errorStyle,
              ]}
            />
          </View>
          <TouchableOpacity
            style={[defaultStyles.submitButton, submitButtonStyle]}
            onPress={onPressButton}
          >
            <Text style={[defaultStyles.submitText, submitButtonTextStyle]}>
              {submitButtonText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[defaultStyles.skipButton, skipButtonStyle]}
            onPress={onPressSkip}
          >
            <Text style={[defaultStyles.skipText, skipButtonTextStyle]}>
              {skipButtonText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
