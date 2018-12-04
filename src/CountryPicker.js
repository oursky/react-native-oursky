// @flow
import * as React from "react";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import Text from "./Text";
import TextInput from "./TextInput";
import { TextStyle, ViewStyle } from "./styles";
import countryCodes from "./countryCode";
import type { Country } from "./countryCode";
import ExtraText from "./ExtraText";
import type { Props as ExtraTextProps } from "./ExtraText";
import CountryList from "./CountryList";

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(249, 249, 249)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 9,
    borderBottomColor: "#CACACA",
    borderBottomWidth: 1,
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
  headerTitle: {
    fontSize: 17,
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
  style: {
    flexDirection: "row",
    alignItems: "center",
  },
  textStyle: {
    flex: 1,
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
});

export type Props = ExtraTextProps & {
  placeholder?: string,
  placeholderTextColor?: string,
  selectedValue?: string,
  onValueChange?: (countryCode: string) => void,
  backButtonText?: React.Node,
  headerTitle?: React.Node,

  style?: ViewStyle,
  textStyle?: TextStyle,
  containerStyle?: ViewStyle,
};

type State = {
  selectedValue: string,
  showPicker: boolean,
};

const dropdownArrowIcon = require("../images/dropdown-arrow.png");

class CountryPicker extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue || "",
      showPicker: false,
    };
  }

  openPicker = () => {
    this.setState({ showPicker: true });
  };

  onSelectCountry = (item: Country) => {
    this.setState({
      selectedValue: item.callingCode,
      showPicker: false,
    });
    if (this.props.onValueChange) {
      this.props.onValueChange(item.callingCode);
    }
  };

  closePicker = () => {
    this.setState({
      showPicker: false,
    });
  };

  render() {
    const {
      placeholder,
      placeholderTextColor,
      style,
      textStyle,
      containerStyle,
      backButtonText,
      headerTitle,
      ...rest
    } = this.props;
    const { selectedValue, showPicker } = this.state;

    return (
      <View style={containerStyle}>
        <TouchableOpacity
          onPress={this.openPicker}
          style={[defaultStyles.style, style]}
        >
          <Text
            onFocus={this.openPicker}
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
        <ExtraText {...rest} />
        <CountryList
          visible={showPicker}
          backButtonText={backButtonText}
          headerTitle={headerTitle}
          selectedValue={selectedValue}
          onPressBackButton={this.closePicker}
          onSelectCountry={this.onSelectCountry}
        />
      </View>
    );
  }
}

export default CountryPicker;
