import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {
  ReceivedNotification,
} from 'react-native-push-notification';

class PushNotificationManager {
  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  initialize(): void {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Whether the library should pop the first notification when the app starts
      popInitialNotification: false,

      // Requestion permissions on startup
      requestPermissions: true,
    });
  }
}

const NotificationManager = new PushNotificationManager()

// Singelton that everything must reference to communicate with notifications
export default NotificationManager