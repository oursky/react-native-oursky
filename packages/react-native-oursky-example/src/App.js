// @flow
import { createAppContainer, createDrawerNavigator } from "react-navigation";
import SignupWithMobileScreen from "./screens/SignupWithMobileScreen";
import VerifyOTPScreen from "./screens/VerifyOTPScreen";
import DialogScreen from "./screens/DialogScreen";

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
  },
  {
    initialRouteName: "SignupWithMobile",
  }
);

export default createAppContainer(AppNavigator);
