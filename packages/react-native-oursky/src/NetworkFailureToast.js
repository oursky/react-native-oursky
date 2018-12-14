// @flow
import * as React from "react";
import { SafeAreaView, StyleSheet, View, Image, NetInfo } from "react-native";
import Text from "./Text";
import FadeAnimation from "./FadeAnimation";

const styles = StyleSheet.create({
  safeArea: {
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute",
    alignItems: "center",
  },
  toastContainer: {
    backgroundColor: "white",
    width: 349,
    height: 65,
    bottom: 69,
    borderColor: "#CACACA",
    borderWidth: 1,
    borderRadius: 6,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 14,
  },
  text: {
    fontSize: 14,
    color: "#333333",
  },
  textContainer: {
    flex: 1,
    paddingRight: 14,
  },
});

type State = {
  isNetworkConnected: boolean,
};

export default class NetworkFailureToast extends React.PureComponent<
  {},
  State
> {
  state = {
    isNetworkConnected: true,
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange = (isConnected: boolean) => {
    this.setState({
      isNetworkConnected: isConnected,
    });
  };

  render() {
    const { isNetworkConnected } = this.state;

    return (
      <SafeAreaView style={styles.safeArea} pointerEvents={"box-none"}>
        <FadeAnimation visible={!isNetworkConnected}>
          <View style={styles.toastContainer}>
            <Image
              style={styles.icon}
              source={require("./images/toast_offline_icon.png")}
              resizeMode="center"
            />
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                Cannot reach internet. Please check your device internet
                connections.
              </Text>
            </View>
          </View>
        </FadeAnimation>
      </SafeAreaView>
    );
  }
}
