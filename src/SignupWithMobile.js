// @flow
import * as React from "react";
import {
  View,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import type { Props as ViewProps } from "react-native/Libraries/Components/View/View";
import StyleSheetPropType from "react-native/Libraries/StyleSheet/StyleSheetPropType";
import ViewStylePropTypes from "react-native/Libraries/Components/View/ViewStylePropTypes";
import TextStylePropTypes from "react-native/Libraries/Text/TextStylePropTypes";
import type { LayoutEvent } from "react-native/Libraries/Types/CoreEventTypes";
import {
  parseIncompletePhoneNumber,
  parsePhoneNumber,
} from "libphonenumber-js";

import Text from "./Text";
import type { Props as TextProps } from "./Text";
import TextInput from "./TextInput";
import type { Props as TextInputProps } from "./TextInput";
import CountryPicker from "./CountryPicker";
import type { Props as CountryPickerProps } from "./CountryPicker";
import { ViewStyle, TextStyle } from "./styles";

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  header: {
    color: "white",
    fontSize: 32,
    paddingBottom: 30,
  },
  box: {
    borderRadius: 24,
    backgroundColor: "white",
    shadowColor: "rgb(0, 0, 0)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    elevation: 15,
    paddingHorizontal: 21,
    paddingVertical: 31,
  },
  description: {
    fontSize: 18,
    lineHeight: 24,
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
  countryPickerContainer: {
    width: 108,
  },
  countryPicker: {
    borderBottomColor: "rgb(170, 170, 170)",
    borderBottomWidth: 1,
  },
  countryPickerText: {
    paddingVertical: 11,
    fontSize: 16,
  },
  mobileNumberContainer: {
    marginLeft: 15,
    flex: 1,
  },
  mobileNumberText: {
    // TextInput will have default padding on Android, and it can't be remove.
    paddingVertical: Platform.select({
      android: 8,
      ios: 11,
    }),
    borderBottomColor: "rgb(170, 170, 170)",
    borderBottomWidth: 1,
    fontSize: 16,
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

export type Mobile = {
  countryCallingCode: string,
  nationalNumber: string,
};

export type Props = {
  style?: ViewStyle,
  boxStyle?: ViewStyle,

  headerTitle?: React.Node,
  headerStyle?: TextStyle,
  description?: React.Node,
  descriptionStyle?: TextStyle,
  title?: React.Node,
  titleStyle?: TextStyle,

  countryPickerProps?: CountryPickerProps,
  mobileNumberProps?: TextInputProps,

  submitButtonStyle?: ViewStyle,
  submitButtonText?: React.Node,
  submitButtonTextStyle?: TextStyle,

  skipButtonStyle?: ViewStyle,
  skipButtonText?: React.Node,
  skipButtonTextStyle?: TextStyle,

  onPressSubmitButton?: (isValid: boolean, mobile: Mobile) => void,
  onPressSkipButton?: () => void,
};

type State = {
  countryCallingCode: string,
  nationalNumber: string,
  marginTop: number,
};

export default class SignupWithMobile extends React.PureComponent<
  Props,
  State
> {
  state = {
    countryCallingCode: "",
    nationalNumber: "",
    marginTop: 0,
  };

  onChangeText = (text: string) => {
    if (/^\d*$/.test(text)) {
      this.setState({
        nationalNumber: text,
      });
    }
  };

  onCountryCodeChange = (countryCallingCode: string) => {
    this.setState({ countryCallingCode });
  };

  onPressSubmitButton = () => {
    const { countryCallingCode, nationalNumber } = this.state;
    try {
      const phoneNumber = parsePhoneNumber(
        `${countryCallingCode} ${nationalNumber}`
      );
      if (this.props.onPressSubmitButton) {
        this.props.onPressSubmitButton(
          phoneNumber ? phoneNumber.isValid() : false,
          {
            countryCallingCode,
            nationalNumber,
          }
        );
      }
    } catch (e) {
      if (this.props.onPressSubmitButton) {
        this.props.onPressSubmitButton(false, {
          countryCallingCode,
          nationalNumber,
        });
      }
    }
  };

  // The box should be middle of the screen, so we need to raise this component.
  adjustLayout = (event: LayoutEvent) => {
    // If currect height less than iPhone SE height, then don't adjust layout.
    this.setState({
      marginTop:
        Dimensions.get("window").height > 568
          ? -event.nativeEvent.layout.height
          : 0,
    });
  };

  render() {
    const {
      headerTitle,
      description,
      title,
      submitButtonText,
      skipButtonText,

      style,
      headerStyle,
      boxStyle,
      descriptionStyle,
      titleStyle,
      submitButtonStyle,
      submitButtonTextStyle,
      skipButtonStyle,
      skipButtonTextStyle,
      countryPickerProps,
      mobileNumberProps,

      onPressSkipButton,
    } = this.props;
    const { nationalNumber, countryCallingCode, marginTop } = this.state;

    return (
      <View style={[defaultStyles.container, style, { marginTop }]}>
        <Text
          style={[defaultStyles.header, headerStyle]}
          onLayout={this.adjustLayout}
        >
          {headerTitle}
        </Text>
        <View style={[defaultStyles.box, boxStyle]}>
          <Text style={[defaultStyles.description, descriptionStyle]}>
            {description}
          </Text>
          <Text style={[defaultStyles.title, titleStyle]}>{title}</Text>
          <View style={defaultStyles.flexRow}>
            <CountryPicker
              {...countryPickerProps}
              style={[
                defaultStyles.countryPicker,
                countryPickerProps && countryPickerProps.style,
              ]}
              containerStyle={[
                defaultStyles.countryPickerContainer,
                countryPickerProps && countryPickerProps.containerStyle,
              ]}
              textStyle={[
                defaultStyles.countryPickerText,
                countryPickerProps && countryPickerProps.textStyle,
              ]}
              errorStyle={[
                defaultStyles.error,
                countryPickerProps && countryPickerProps.errorStyle,
              ]}
              onValueChange={this.onCountryCodeChange}
              selectedValue={countryCallingCode}
            />
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
              keyboardType="phone-pad"
              value={nationalNumber}
              onChangeText={this.onChangeText}
              autoFocus={true}
            />
          </View>
          <TouchableOpacity
            style={[defaultStyles.submitButton, submitButtonStyle]}
            onPress={this.onPressSubmitButton}
          >
            <Text style={[defaultStyles.submitText, submitButtonTextStyle]}>
              {submitButtonText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[defaultStyles.skipButton, skipButtonStyle]}
            onPress={onPressSkipButton}
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
