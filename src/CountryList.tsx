import React from "react";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "./Text";
import { Country } from "./countryCode";
import TextInput from "./TextInput";

const ITEM_HEIGHT = 34;
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
    alignItems: "center",
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
    minHeight: ITEM_HEIGHT,
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

const backIcon = require("./images/ic_btn_back.png");

export interface Props {
  visible: boolean;
  backButtonText?: React.ReactNode;
  headerTitle?: React.ReactNode;
  selectedValue?: string;
  ListEmptyComponent?: React.ComponentType<any>;
  countryCodes: Country[];

  onPressBackButton?: () => void;
  onSelectCountry?: (country: Country) => void;
}

interface State {
  keyword: string;
  selectedValue: string;
}

function orderByCallingCodeAndName(a: Country, b: Country) {
  if (a.callingCode == b.callingCode) {
    return a.name > b.name ? 1 : -1;
  } else {
    return a.callingCode > b.callingCode ? 1 : -1;
  }
}

export default class CountryList extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      keyword: "",
      selectedValue: props.selectedValue || "",
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.state.selectedValue != this.props.selectedValue &&
      this.props.selectedValue != null
    ) {
      this.setState({
        selectedValue: this.props.selectedValue,
      });
    }
    if (prevProps.visible && !this.props.visible) {
      this.setState({
        keyword: "",
      });
    }
  }

  search = (text: string) => {
    this.setState({
      keyword: text,
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
      countryCodes,
      headerTitle,
      ListEmptyComponent,

      onPressBackButton,
    } = this.props;

    const { keyword } = this.state;
    const lowerCaseKeyword = keyword.toLowerCase();
    const renderCountryCodes = countryCodes
      .filter(item =>
        keyword
          ? item.name.toLowerCase().includes(lowerCaseKeyword) ||
            item.callingCode.includes(lowerCaseKeyword)
          : true
      )
      .sort(orderByCallingCodeAndName);
    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={onPressBackButton}
      >
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
              value={keyword}
              autoFocus={true}
            />
          </View>
          <FlatList
            data={renderCountryCodes}
            keyExtractor={this.keyExtractor}
            extraData={this.state.keyword}
            ListEmptyComponent={ListEmptyComponent}
            renderItem={this.renderItem}
            initialNumToRender={25}
          />
        </SafeAreaView>
      </Modal>
    );
  }
}
