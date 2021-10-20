import React, {
  useState,
} from "react";
import {
  createAppContainer
} from "react-navigation";
import {
  createStackNavigator
} from "react-navigation-stack";
import {
  createDrawerNavigator
} from "react-navigation-drawer";
import AppLoading from "expo-app-loading";

import * as Font from "expo-font";
import SMSIn from "./src/screens/SMSIn";
import SMSOut from "./src/screens/SMSOut";
import Forward from "./src/screens/Forward";
import Ignore from "./src/screens/Ignore";
import Settings from "./src/screens/Settings";
import SMSService from './src/SMSService';

import _ from "lodash";


const smsService = new SMSService();

global.current_screen = 'SMSIn';

const DrawerNavigation = createDrawerNavigator({
  SMSIn: SMSIn,
  SMSOut: SMSOut,
  Settings: Settings,
  Forward: Forward,
  Ignore: Ignore,
});

const StackNavigation = createStackNavigator({
  DrawerNavigation: {
    screen: DrawerNavigation
  },
  SMSIn: SMSIn,
  SMSOut: SMSOut,
  Settings: Settings,
  Forward: Forward,
  Ignore: Ignore,
}, {
  headerMode: "none"
});

setInterval(() => {

  async function fetchData() {

    smsService.prepareInComingSMS();
    smsService.forwardInComingSMS();

    smsService.prepareOutGoing();
    smsService.sendOutGoing();


  }

  fetchData();

}, 15000);




const AppContainer = createAppContainer(StackNavigation);

function App() {

  const [isLoadingComplete, setLoadingComplete] = useState(false);
  if (!isLoadingComplete) {
    return ( <
      AppLoading startAsync = {
        loadResourcesAsync
      }
      onError = {
        handleLoadingError
      }
      onFinish = {
        () => handleFinishLoading(setLoadingComplete)
      }
      />
    );
  } else {
    return isLoadingComplete ? < AppContainer / > : < AppLoading / > ;
  }
}
async function loadResourcesAsync() {
  await Promise.all([
    Font.loadAsync({
      "roboto-regular": require("./src/assets/fonts/roboto-regular.ttf")
    })
  ]);
}

function handleLoadingError(error) {
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

export default App;