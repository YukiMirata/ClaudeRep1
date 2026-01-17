import { useState, useEffect } from 'react';
import { Howl } from 'howler';
import EventNotification from './EventNotification';
import { Event } from '../../types/event';
import { useSettingsStore } from '../../stores/useSettingsStore';

interface ActiveNotification {
  id: string;
  event: Event;
  occurrenceTime: number;
}

const NotificationManager = () => {
  const [notifications, setNotifications] = useState<ActiveNotification[]>([]);
  const settings = useSettingsStore((state) => state.settings);

  // Play notification sound
  const playSound = (soundFile?: string, volume: number = 1.0) => {
    if (!settings?.soundsEnabled) return;

    // Use default sound if none specified
    const soundPath = soundFile || '/sounds/bell.mp3';

    try {
      const sound = new Howl({
        src: [soundPath],
        volume: volume,
        onloaderror: (id, error) => {
          console.error('Error loading sound:', error);
          // Fallback to browser beep
          console.log('🔔 BEEP! (sound file not found)');
        },
        onplayerror: (id, error) => {
          console.error('Error playing sound:', error);
        },
      });

      sound.play();
    } catch (error) {
      console.error('Error creating Howl:', error);
    }
  };

  // Listen for event triggers from Electron
  useEffect(() => {
    if (typeof window === 'undefined' || !window.electronAPI) return;

    const unsubscribe = window.electronAPI.onEventTriggered((data: any) => {
      console.log('🔔 Notification received:', data.event.title);

      const notification: ActiveNotification = {
        id: data.id || Math.random().toString(),
        event: data.event,
        occurrenceTime: data.occurrenceTime,
      };

      // Play sound
      playSound(data.event.soundFile, data.event.soundVolume);

      // Add notification
      setNotifications((prev) => [...prev, notification]);

      // Auto-dismiss after 10 seconds
      setTimeout(() => {
        handleDismiss(notification.id);
      }, 10000);
    });

    return unsubscribe;
  }, [settings?.soundsEnabled]);

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!settings?.notificationsEnabled) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 z-[100] pointer-events-none">
      <div className="flex flex-col gap-4 p-4 pointer-events-auto">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            style={{
              marginTop: index * 8,
            }}
          >
            <EventNotification
              event={notification.event}
              occurrenceTime={notification.occurrenceTime}
              onDismiss={() => handleDismiss(notification.id)}
              isVisible={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationManager;
