import React, {FC} from 'react';
import {SafeAreaView, StyleSheet, Text, Linking} from 'react-native';
import {LinkingOptions, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';

import HomeScreen from './HomeScreen';
import ScreenTwo from './Screen2';
import ScreenThree from './Screen3';

type Screen = {
  name: string;
  component: FC;
};

export const ROOT_SCREEN_NAMES = {
  HOME_SCREEN: 'Home Screen',
  SCREEN_TWO: 'Screen Two',
  SCREEN_THREE: 'Screen Three',
};

const ROOT_STACK_SCREENS: Array<Screen> = [
  {
    name: ROOT_SCREEN_NAMES.HOME_SCREEN,
    component: HomeScreen,
  },
  {
    name: ROOT_SCREEN_NAMES.SCREEN_TWO,
    component: ScreenTwo,
  },
  {
    name: ROOT_SCREEN_NAMES.SCREEN_THREE,
    component: ScreenThree,
  },
];

const linking: LinkingOptions = {
  prefixes: ['mylinker://', 'http://mylinker.com/'],

  async getInitialURL(): Promise<string> {
    // Check if the app was opened by a deep link
    const url = await Linking.getInitialURL();

    const dynamicLinkUrl = await dynamicLinks().getInitialLink();

    if (dynamicLinkUrl) {
      console.log(dynamicLinkUrl.url);
      return dynamicLinkUrl.url;
      // return 'mylinker://screen3'
    }

    if (url) {
      return url;
    }

    // If it was not opened by a deep link, go to the home screen
    return 'mylinker://home';
  },

  // Custom function to subscribe to incoming links
  subscribe(listener: (deeplink: string) => void) {
    // First, you may want to do the default deep link handling
    const onReceiveURL = ({url}: {url: string}) => listener(url);

    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL);

    const handleDynamicLink = (
      dynamicLink: FirebaseDynamicLinksTypes.DynamicLink,
    ) => {
      listener(dynamicLink.url);
    };

    const unsubscribeToDynamicLinks = dynamicLinks().onLink(handleDynamicLink);

    return () => {
      unsubscribeToDynamicLinks();
      Linking.removeEventListener('url', onReceiveURL);
    };
  },

  config: {
    screens: {
      [ROOT_SCREEN_NAMES.HOME_SCREEN]: {
        path: 'home',
      },
      [ROOT_SCREEN_NAMES.SCREEN_TWO]: {
        path: 'screen2',
      },
      [ROOT_SCREEN_NAMES.SCREEN_THREE]: {
        path: 'screen3',
      },
    },
  },
};

const App: FC = () => {
  const RootStack = createStackNavigator();

  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator>
        {ROOT_STACK_SCREENS.map((screen: Screen, i: number) => (
          <RootStack.Screen
            key={i}
            name={screen.name}
            component={screen.component}
          />
        ))}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
