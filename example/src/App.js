// @flow
import * as React from "react";
import {
  createAppContainer,
  createDrawerNavigator,
  createStackNavigator,
} from "react-navigation";
import { PortalHost } from "@oursky/react-native-oursky";

import PortalScreen from "./screens/PortalScreen";
import PickerScreen from "./screens/PickerScreen";
import FormScreen from "./screens/FormScreen";

const PortalScreenStackNavigator = createStackNavigator({
  PortalScreen: {
    screen: PortalScreen,
  },
});

const AppNavigator = createDrawerNavigator(
  {
    PickerScreen: {
      screen: PickerScreen,
    },
    FormScreen,
    PortalScreenStackNavigator: {
      screen: PortalScreenStackNavigator,
    },
  },
  {
    initialRouteName: "PickerScreen",
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
