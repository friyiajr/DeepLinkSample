/**
 * @format
 */

import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import NotificationManager from './PushNotificationManager';

NotificationManager.initialize()

AppRegistry.registerComponent(appName, () => App);
