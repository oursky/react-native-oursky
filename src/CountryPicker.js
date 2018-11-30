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

const defaultStyles = StyleSheet.create({
  item: {
    paddingHorizontal: 19,
    paddingVertical: 8,
  },
  container: {
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
  textStyle: {
    paddingVertical: 10,
  },
  extraText: {
    alignSelf: "flex-start",
  },
  nonvisible: {
    opacity: 0,
  },
});

function makeExtraText(
  error?: string | null,
  errorStyle?: TextStyle,
  option?: string,
  optionStyle?: TextStyle
): Text | null {
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
  }
}

export type Props = {
  placeholder?: string,
  placeholderTextColor?: string,
  selectedValue?: string,
  error?: string,
  errorStyle?: TextStyle,
  option?: string,
  optionStyle?: TextStyle,

  style?: ViewStyle,
  containerStyle?: ViewStyle,
  textStyle?: TextStyle,
};

type State = {
  selectedValue: string,
  showPicker: boolean,
  countriesCode: CountryCode[],
};

export default class CountryPicker extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedValue: this.props.selectedValue || "",
      showPicker: false,
      countriesCode: countryCode.sort((a, b) => {
        if (a.code == b.code) {
          return a.name > b.name ? 1 : -1;
        } else {
          return a.code > b.code ? 1 : -1;
        }
      }),
    };
  }

  openPicker = () => {
    this.setState({ showPicker: true });
  };

  onPressCountry = (item: CountryCode) => () => {
    this.setState({
      selectedValue: item.code,
      showPicker: false,
    });
  };

  search = (text: string) => {
    this.setState({
      countriesCode: countryCode
        .filter(
          item =>
            text ? item.name.includes(text) || item.code.includes(text) : true
        )
        .sort((a, b) => (a.code > b.code ? 1 : -1)),
    });
  };

  renderItem = ({ item }: ListRenderItemInfo<CountryCode>) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={this.onPressCountry(item)}
        style={defaultStyles.item}
      >
        <Text key={item.id}>{`${item.flag} ${item.name} +${item.code}`}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      placeholder,
      placeholderTextColor,
      style,
      containerStyle,
      textStyle,

      error,
      errorStyle,
      option,
      optionStyle,
    } = this.props;
    const { selectedValue, showPicker, countriesCode } = this.state;
    console.log(placeholder, selectedValue);
    return (
      <>
        <View style={containerStyle}>
          <TouchableOpacity onPress={this.openPicker} style={style}>
            <Text
              onFocus={this.openPicker}
              style={[
                textStyle,
                selectedValue ? null : { color: placeholderTextColor },
              ]}
            >
              {selectedValue !== "" ? `+${selectedValue}` : placeholder}
            </Text>
          </TouchableOpacity>
          {makeExtraText(error, errorStyle, option, optionStyle)}
        </View>
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
              extraData={this.state}
              renderItem={this.renderItem}
            />
          </SafeAreaView>
        </Modal>
      </>
    );
  }
}
