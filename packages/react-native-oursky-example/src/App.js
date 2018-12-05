// @flow
import { createAppContainer, createDrawerNavigator } from "react-navigation";
import SignupWithMobileScreen from "./screens/SignupWithMobileScreen";

const AppNavigator = createDrawerNavigator(
  {
    SignupWithMobile: {
      screen: SignupWithMobileScreen,
    },
  },
  {
    initialRouteName: "SignupWithMobile",
  }
);

export default createAppContainer(AppNavigator);
