import React from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import RNSimInfo from "rn-sim-info";
import Text from "./Text";
import defaultCountryCodes, { Country } from "./countryCode";
import ExtraText, { Props as ExtraTextProps } from "./ExtraText";
import CountryList from "./CountryList";

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(249, 249, 249)",
  },
  style: {
    flexDirection: "row",
    alignItems: "center",
  },
  textStyle: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 9,
    borderBottomColor: "#CACACA",
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
  },
  backButton: {
    flexDirection: "row",
    position: "absolute",
    left: 9,
    top: 12,
  },
  backButtonText: {
    fontSize: 17,
    color: "#007AFF",
    marginLeft: 5,
  },
  searchbarContainer: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CACACA",
  },
  searchbar: {
    backgroundColor: "rgba(142, 142, 147, .12)",
    paddingHorizontal: 9,
    borderRadius: 10,
    height: 36,
  },
  item: {
    paddingHorizontal: 19,
    paddingVertical: 8,
    borderBottomColor: "#CACACA",
    borderBottomWidth: 1,
  },
  selectedItem: {
    backgroundColor: "#F3F3F3",
  },
});

export type Props = ExtraTextProps & {
  placeholder?: string;
  placeholderTextColor?: string;
  selectedValue?: string;
  backButtonText?: React.ReactNode;
  countryCodes: Country[];
  headerTitle?: React.ReactNode;
  defaultBySimcardCountry: boolean;
  ListEmptyComponent?: React.ComponentType<any>;

  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;

  onValueChange?: (countryCode: string) => void;
  openAlternativeCountryList?: (
    countryCodes: Country[],
    onSelectCountry: (country: Country) => void
  ) => void;
  onClosePicker?: () => void;
};

type State = {
  selectedValue: string;
  showCountryList: boolean;
};

const dropdownArrowIcon = require("./images/ic_form_dropdown.png");

class CountryPicker extends React.PureComponent<Props, State> {
  static defaultProps = {
    defaultBySimcardCountry: false,
    countryCodes: defaultCountryCodes,
  };

  constructor(props: Props) {
    super(props);

    let selectedValue = this.props.selectedValue || "";
    if (props.defaultBySimcardCountry) {
      const upperCountryCode = RNSimInfo.getCountryCode().toUpperCase();
      const country = props.countryCodes.find(code => {
        return code.isoCountryCode === upperCountryCode;
      });
      selectedValue = (country && country.callingCode) || selectedValue;
      if (props.onValueChange) {
        props.onValueChange(selectedValue);
      }
    }

    this.state = {
      selectedValue,
      showCountryList: false,
    };
  }

  openCountryList = () => {
    if (this.props.openAlternativeCountryList) {
      this.props.openAlternativeCountryList(
        this.props.countryCodes,
        this.onSelectCountry
      );
    } else {
      this.setState({ showCountryList: true });
    }
  };

  onSelectCountry = (item: Country) => {
    this.setState({
      selectedValue: item.callingCode,
      showCountryList: false,
    });
    if (this.props.onValueChange) {
      this.props.onValueChange(item.callingCode);
    }
  };

  closePicker = () => {
    this.setState(
      {
        showCountryList: false,
      },
      () => {
        if (this.props.onClosePicker) {
          this.props.onClosePicker();
        }
      }
    );
  };

  render() {
    const {
      placeholder,
      placeholderTextColor,
      style,
      textStyle,
      containerStyle,
      backButtonText,
      countryCodes,
      headerTitle,
      ListEmptyComponent,
      error,
      errorStyle,
      ...rest
    } = this.props;
    const { selectedValue, showCountryList } = this.state;

    const flattedErrorStyle = StyleSheet.flatten(errorStyle);
    const errorColor = flattedErrorStyle && flattedErrorStyle.color;
    return (
      <View style={containerStyle}>
        <TouchableOpacity
          onPress={this.openCountryList}
          style={[
            defaultStyles.style,
            style,
            error && errorColor ? { borderBottomColor: errorColor } : null,
          ]}
        >
          <Text
            style={[
              defaultStyles.textStyle,
              textStyle,
              selectedValue ? null : { color: placeholderTextColor },
            ]}
          >
            {selectedValue ? `+${selectedValue}` : placeholder}
          </Text>
          <Image source={dropdownArrowIcon} />
        </TouchableOpacity>
        <ExtraText {...rest} error={error} errorStyle={errorStyle} />
        <CountryList
          visible={showCountryList}
          backButtonText={backButtonText}
          headerTitle={headerTitle}
          selectedValue={selectedValue}
          onPressBackButton={this.closePicker}
          onSelectCountry={this.onSelectCountry}
          ListEmptyComponent={ListEmptyComponent}
          countryCodes={countryCodes}
        />
      </View>
    );
  }
}

export default CountryPicker;
