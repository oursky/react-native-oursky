// @flow
import React from "react";
import {
  TouchableOpacity,
  Modal,
  SafeAreaView,
  FlatList,
  View,
  Image,
  StyleSheet,
} from "react-native";

import Text from "./Text";
import TextInput from "./TextInput";
import { TextStyle, ViewStyle } from "./styles";
import { countryCode } from "./countryCode";
import type { CountryCode } from "./countryCode";
import type { ListRenderItemInfo } from "./types";
import ExtraText from "./ExtraText";
import type { Props as ExtraTextProps } from "./ExtraText";

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    paddingHorizontal: 19,
    paddingVertical: 8,
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

  style?: ViewStyle,
  textStyle?: TextStyle,
  containerStyle?: ViewStyle,
};

type State = {
  selectedValue: string | null,
  showPicker: boolean,
  countriesCode: CountryCode[],
};

const dropdownArrowIcon = require("../images/dropdown-arrow.png");

class CountryPicker extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue || null,
      showPicker: false,
      countriesCode: countryCode.sort((a, b) => {
        if (a.callingCode == b.callingCode) {
          return a.name > b.name ? 1 : -1;
        } else {
          return a.callingCode > b.callingCode ? 1 : -1;
        }
      }),
    };
  }

  openPicker = () => {
    this.setState({ showPicker: true });
  };

  onPressCountry = (item: CountryCode) => () => {
    this.setState({
      selectedValue: item.callingCode,
      showPicker: false,
    });
    if (this.props.onValueChange) {
      this.props.onValueChange(item.callingCode);
    }
  };

  search = (text: string) => {
    this.setState({
      countriesCode: countryCode
        .filter(
          item =>
            text
              ? item.name.includes(text) || item.callingCode.includes(text)
              : true
        )
        .sort((a, b) => (a.callingCode > b.callingCode ? 1 : -1)),
    });
  };

  keyExtractor = (item: CountryCode) => {
    return item.isoCountryCode;
  };

  renderItem = ({ item }: ListRenderItemInfo<CountryCode>) => {
    return (
      <TouchableOpacity
        key={item.isoCountryCode}
        onPress={this.onPressCountry(item)}
        style={defaultStyles.item}
      >
        <Text key={item.isoCountryCode}>{`${item.flag} ${item.name} +${
          item.callingCode
        }`}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      placeholder,
      placeholderTextColor,
      style,
      textStyle,
      containerStyle,
      ...rest
    } = this.props;
    const { selectedValue, showPicker, countriesCode } = this.state;
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
        <Modal visible={showPicker} animationType="slide">
          <SafeAreaView style={defaultStyles.container}>
            <View style={defaultStyles.searchbarContainer}>
              <TextInput
                placeholder="Search"
                onChangeText={this.search}
                style={defaultStyles.searchbar}
                autoFocus={true}
              />
            </View>
            <FlatList
              data={countriesCode}
              keyExtractor={this.keyExtractor}
              extraData={this.state}
              renderItem={this.renderItem}
            />
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

export default CountryPicker;
