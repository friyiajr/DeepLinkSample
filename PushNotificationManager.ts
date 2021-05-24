import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {
  ReceivedNotification,
} from 'react-native-push-notification';

export type AnyNotification = Pick<
  ReceivedNotification,
  | 'foreground'
  | 'userInteraction'
  | 'message'
  | 'data'
  | 'subText'
  | 'badge'
  | 'alert'
  | 'sound'
  | 'id'
  | 'action'
  | 'finish'
>;

type NotificationForwardingFunction = (arg0: AnyNotification) => void;

class PushNotificationManager {
  forwardNotificationFn: NotificationForwardingFunction | null;

  constructor() {
    this.forwardNotificationFn = null;
  }

  setNotificationForwardingFunction = (
    forwardNotification: NotificationForwardingFunction,
  ) => {
    this.forwardNotificationFn = forwardNotification;
  };

  onNotificationRecieved = (notification: AnyNotification) => {
    if (this.forwardNotificationFn) {
      this.forwardNotificationFn(notification);
    }

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  };

  // Must be outside of any component LifeCycle (such as `componentDidMount`).
  initialize(): void {
    PushNotification.configure({
      onNotification: this.onNotificationRecieved,

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

    PushNotification.createChannel(
      {
        channelId: 'REMOTE_NOTIFICATIONS',
        channelName: 'Remote Notifications',
        channelDescription: 'Remote notifications for this app',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      created => console.log(created),
    );
  }

  async getInitialPushNotification(): Promise<ReceivedNotification | null> {
    return new Promise<ReceivedNotification | null>((resolve, _) => {
      PushNotification.popInitialNotification(
        (notification: ReceivedNotification | null) => {
          resolve(notification);
        },
      );
    });
  }
}

const NotificationManager = new PushNotificationManager();

// Singelton that everything must reference to communicate with notifications
export default NotificationManager;
