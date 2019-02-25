// @flow
import * as React from "react";
import {
  createAppContainer,
  createDrawerNavigator,
  createStackNavigator,
} from "react-navigation";
import { PortalHost } from "@oursky/react-native-oursky";

import SignupWithMobileScreen from "./screens/SignupWithMobileScreen";
import VerifyOTPScreen from "./screens/VerifyOTPScreen";
import DialogScreen from "./screens/DialogScreen";
import RequirePermissionScreen from "./screens/RequirePermissionScreen";
import PortalScreen from "./screens/PortalScreen";
import PickerScreen from "./screens/PickerScreen";

const PortalScreenStackNavigator = createStackNavigator({
  PortalScreen: {
    screen: PortalScreen,
  },
});

const AppNavigator = createDrawerNavigator(
  {
    SignupWithMobile: {
      screen: SignupWithMobileScreen,
    },
    VerifyOTP: {
      screen: VerifyOTPScreen,
    },
    Dialog: {
      screen: DialogScreen,
    },
    RequirePermission: {
      screen: RequirePermissionScreen,
    },
    PickerScreen: {
      screen: PickerScreen,
    },
    PortalScreenStackNavigator: {
      screen: PortalScreenStackNavigator,
    },
  },
  {
    initialRouteName: "SignupWithMobile",
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component<{}> {
  render() {
    return (
      <PortalHost>
        <AppContainer />
      </PortalHost>
    );
  }
}
