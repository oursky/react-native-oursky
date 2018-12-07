// @flow
import * as React from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";

import type { ListRenderItemInfo } from "./types";
import Text from "./Text";
import type { Country } from "./countryCode";
import TextInput from "./TextInput";
import countryCodes from "./countryCode";

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

const backIcon = require("./images/back-icon.png");
const ITEM_HEIGHT = 34;

export type Props = {
  visible?: boolean,
  backButtonText?: React.Node,
  headerTitle?: React.Node,
  selectedValue?: string,

  onPressBackButton?: () => void,
  onSelectCountry?: Country => void,
};

type State = {
  selectedValue: string,
  countryCodes: Country[],
};

export default class CountryList extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedValue: props.selectedValue || "",
      countryCodes: countryCodes.sort((a, b) => {
        if (a.callingCode == b.callingCode) {
          return a.name > b.name ? 1 : -1;
        } else {
          return a.callingCode > b.callingCode ? 1 : -1;
        }
      }),
    };
  }

  componentDidUpdate() {
    if (this.state.selectedValue != this.props.selectedValue) {
      this.setState({
        selectedValue: this.props.selectedValue,
      });
    }
  }

  search = (text: string) => {
    this.setState({
      countryCodes: countryCodes
        .filter(item =>
          text
            ? item.name.includes(text) || item.callingCode.includes(text)
            : true
        )
        .sort((a, b) => (a.callingCode > b.callingCode ? 1 : -1)),
    });
  };

  onPressCountry = (country: Country) => () => {
    if (this.props.onSelectCountry) {
      this.props.onSelectCountry(country);
    }
  };

  keyExtractor = (item: Country) => {
    return item.isoCountryCode;
  };

  getItemLayout = (data?: Country[] | null, index: number) => {
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    };
  };

  renderItem = ({ item }: ListRenderItemInfo<Country>) => {
    const text = Platform.select({
      ios: `${item.flag} ${item.name} +${item.callingCode}`,
      android: `${item.name} +${item.callingCode}`,
    });
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
        <Text key={item.isoCountryCode}>{text}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      visible,
      backButtonText,
      headerTitle,

      onPressBackButton,
    } = this.props;

    const { countryCodes, selectedValue } = this.state;
    const selectedValueIndex = countryCodes.findIndex(
      item => item.callingCode === selectedValue
    );
    return (
      <Modal visible={visible} animationType="slide">
        <SafeAreaView style={defaultStyles.container}>
          <View style={defaultStyles.header}>
            <TouchableOpacity
              style={defaultStyles.backButton}
              onPress={onPressBackButton}
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
            data={countryCodes}
            keyExtractor={this.keyExtractor}
            extraData={this.state}
            renderItem={this.renderItem}
            initialScrollIndex={selectedValueIndex}
            initialNumToRender={25}
            getItemLayout={this.getItemLayout}
          />
        </SafeAreaView>
      </Modal>
    );
  }
}
