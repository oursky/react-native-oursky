// @flow
import React from "react";
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
import { countryCode } from "./countryCode";
import type { CountryCode } from "./countryCode";
import type { ListRenderItemInfo } from "./types";
import ExtraText from "./ExtraText";
import type { Props as ExtraTextProps } from "./ExtraText";

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
  backButtonText?: string,
  headerTitle?: string,

  style?: ViewStyle,
  textStyle?: TextStyle,
  containerStyle?: ViewStyle,
};

type State = {
  selectedValue: string | null,
  showPicker: boolean,
  countriesCode: CountryCode[],
};

const ITEM_HEIGHT = 34;
const dropdownArrowIcon = require("../images/dropdown-arrow.png");
const backIcon = require("../images/back-icon.png");

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

  closePicker = () => {
    this.setState({
      showPicker: false,
    });
  };

  keyExtractor = (item: CountryCode) => {
    return item.isoCountryCode;
  };

  getItemLayout = (data?: CountryCode[] | null, index: number) => {
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    };
  };

  renderItem = ({ item }: ListRenderItemInfo<CountryCode>) => {
    return (
      <TouchableOpacity
        key={item.isoCountryCode}
        onPress={this.onPressCountry(item)}
        style={[
          defaultStyles.item,
          item.callingCode === this.state.selectedValue
            ? defaultStyles.selectedItem
            : null,
        ]}
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
      backButtonText,
      headerTitle,
      ...rest
    } = this.props;
    const { selectedValue, showPicker, countriesCode } = this.state;

    const selectedValueIndex = countriesCode.findIndex(
      item => item.callingCode === selectedValue
    );
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
            <View style={defaultStyles.header}>
              <TouchableOpacity
                style={defaultStyles.backButton}
                onPress={this.closePicker}
              >
                <Image source={backIcon} />
                <Text style={defaultStyles.backButtonText}>
                  {backButtonText || "Back"}
                </Text>
              </TouchableOpacity>
              <Text style={defaultStyles.headerTitle}>
                {headerTitle || "Select Country"}
              </Text>
            </View>
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
              initialScrollIndex={selectedValueIndex}
              initialNumToRender={25}
              getItemLayout={this.getItemLayout}
            />
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

export default CountryPicker;
