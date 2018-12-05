// @flow
import { createAppContainer, createDrawerNavigator } from "react-navigation";
import SignupWithMobileScreen from "./screens/SignupWithMobileScreen";
import VerifyOTPScreen from "./screens/VerifyOTPScreen";

const AppNavigator = createDrawerNavigator(
  {
    SignupWithMobile: {
      screen: SignupWithMobileScreen,
    },
    VerifyOTP: {
      screen: VerifyOTPScreen,
    },
  },
  {
    initialRouteName: "SignupWithMobile",
  }
);

export default createAppContainer(AppNavigator);
