// @flow
import * as React from "react";
import {
  View,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
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
  box: {
    borderRadius: 24,
    backgroundColor: "white",
    shadowColor: "black",
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
    alignSelf: "center",
    height: 52,
  },
  countryPickerText: {
    alignSelf: "center",
    fontSize: 16,
  },
  mobileNumberContainer: {
    marginLeft: 15,
    flex: 1,
  },
  mobileNumberText: {
    height: 52,
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

  description?: React.Node,
  descriptionStyle?: TextStyle,
  title?: React.Node,
  titleStyle?: TextStyle,

  countryPickerProps: CountryPickerProps,
  mobileNumberProps: TextInputProps,

  submitButtonStyle?: ViewStyle,
  submitButtonText?: React.Node,
  submitButtonTextStyle?: TextStyle,

  skipButtonStyle?: ViewStyle,
  skipButtonText?: React.Node,
  skipButtonTextStyle?: TextStyle,

  loading?: boolean,

  onPressSubmitButton?: (isValid: boolean, mobile: Mobile) => void,
  onPressSkipButton?: () => void,
};

type TextInputRefProps = {
  textInputRef?: React$Ref<TextInput>,
};

type State = {
  countryCallingCode: string,
  nationalNumber: string,
  marginTop: number,
};

class SignupWithMobile extends React.PureComponent<
  Props & TextInputRefProps,
  State
> {
  static defaultProps = {
    countryPickerProps: {},
    mobileNumberProps: {},
  };

  state = {
    countryCallingCode: "",
    nationalNumber: "",
    marginTop: 0,
  };

  onChangeText = (text: string) => {
    if (/^\d*$/.test(text)) {
      const { mobileNumberProps } = this.props;
      if (mobileNumberProps.onChangeText) {
        mobileNumberProps.onChangeText(text);
      }
      this.setState({
        nationalNumber: text,
      });
    }
  };

  onCountryCodeChange = (countryCallingCode: string) => {
    const { countryPickerProps } = this.props;
    if (countryPickerProps.onValueChange) {
      countryPickerProps.onValueChange(countryCallingCode);
    }
    this.setState({ countryCallingCode });
  };

  onPressSubmitButton = () => {
    const { countryCallingCode, nationalNumber } = this.state;
    try {
      const phoneNumber = parsePhoneNumber(
        `+${countryCallingCode} ${nationalNumber}`
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

  renderCountryPicker = () => {
    const { countryPickerProps } = this.props;
    const { countryCallingCode } = this.state;
    return (
      <CountryPicker
        {...countryPickerProps}
        style={[defaultStyles.countryPicker, countryPickerProps.style]}
        containerStyle={[
          defaultStyles.countryPickerContainer,
          countryPickerProps.containerStyle,
        ]}
        textStyle={[
          defaultStyles.countryPickerText,
          countryPickerProps.textStyle,
        ]}
        errorStyle={[defaultStyles.error, countryPickerProps.errorStyle]}
        onValueChange={this.onCountryCodeChange}
        selectedValue={countryCallingCode}
      />
    );
  };

  renderTextInput = () => {
    const { mobileNumberProps, textInputRef } = this.props;
    const { nationalNumber } = this.state;
    return (
      <TextInput
        {...mobileNumberProps}
        ref={textInputRef}
        containerStyle={[
          defaultStyles.mobileNumberContainer,
          mobileNumberProps.containerStyle,
        ]}
        style={[defaultStyles.mobileNumberText, mobileNumberProps.style]}
        errorStyle={[defaultStyles.error, mobileNumberProps.errorStyle]}
        keyboardType="phone-pad"
        value={nationalNumber}
        onChangeText={this.onChangeText}
        autoFocus={true}
      />
    );
  };

  render() {
    const {
      description,
      title,
      submitButtonText,
      skipButtonText,
      loading,

      style,
      descriptionStyle,
      titleStyle,
      submitButtonStyle,
      submitButtonTextStyle,
      skipButtonStyle,
      skipButtonTextStyle,

      onPressSkipButton,
    } = this.props;

    return (
      <View style={[defaultStyles.box, style]}>
        <Text style={[defaultStyles.description, descriptionStyle]}>
          {description}
        </Text>
        <Text style={[defaultStyles.title, titleStyle]}>{title}</Text>
        <View style={defaultStyles.flexRow}>
          {this.renderCountryPicker()}
          {this.renderTextInput()}
        </View>
        <TouchableOpacity
          disabled={loading}
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
    );
  }
}

export default SignupWithMobile;
