import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Sparkles, Wrench, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { notificationService } from '../services/db';

export default function NotificationBanner() {
  const [notifications, setNotifications] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('xirmo_dismissed_notifs') || '[]');
    } catch {
      return [];
    }
  });

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getAll({ onlyActive: true });
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    loadNotifications();

    const handleDbChange = () => {
      loadNotifications();
    };

    window.addEventListener('xirmo:db_change', handleDbChange);
    return () => window.removeEventListener('xirmo:db_change', handleDbChange);
  }, []);

  // Filter out dismissed notifications
  const visibleNotifications = notifications.filter((n) => !dismissedIds.includes(n.id));

  if (visibleNotifications.length === 0) return null;

  const currentNotif = visibleNotifications[currentIndex] || visibleNotifications[0];

  const handleDismiss = (id) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      sessionStorage.setItem('xirmo_dismissed_notifs', JSON.stringify(updated));
    } catch {}
    if (currentIndex >= visibleNotifications.length - 1) {
      setCurrentIndex(0);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle size={17} className="notif-banner__icon notif-banner__icon--alert" />;
      case 'promotion':
        return <Sparkles size={17} className="notif-banner__icon notif-banner__icon--promo" />;
      case 'maintenance':
        return <Wrench size={17} className="notif-banner__icon notif-banner__icon--maint" />;
      default:
        return <Bell size={17} className="notif-banner__icon notif-banner__icon--info" />;
    }
  };

  const getBadgeText = (type) => {
    switch (type) {
      case 'alert':
        return 'Digniin Degdeg ah';
      case 'promotion':
        return 'Qiimo Dhimis Gaar ah';
      case 'maintenance':
        return 'Hagaajin';
      default:
        return 'Ogeysiis Muhiim ah';
    }
  };

  return (
    <aside
      className={`notif-banner notif-banner--${currentNotif.type || 'announcement'}`}
      aria-label="Ogeysiisyada Website-ka"
    >
      <div className="container notif-banner__inner">
        <div className="notif-banner__content">
          <div className="notif-banner__badge">
            {getIcon(currentNotif.type)}
            <span>{getBadgeText(currentNotif.type)}</span>
          </div>

          <div className="notif-banner__text">
            <strong className="notif-banner__title">{currentNotif.title}</strong>
            <span className="notif-banner__desc"> — {currentNotif.description}</span>
          </div>
        </div>

        <div className="notif-banner__actions">
          {visibleNotifications.length > 1 && (
            <div className="notif-banner__pagination" aria-label="Beddel Ogeysiiska">
              <button
                className="notif-banner__nav-btn"
                onClick={() =>
                  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : visibleNotifications.length - 1))
                }
                aria-label="Ogeysiiskii Hore"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="notif-banner__counter">
                {currentIndex + 1}/{visibleNotifications.length}
              </span>
              <button
                className="notif-banner__nav-btn"
                onClick={() =>
                  setCurrentIndex((prev) => (prev < visibleNotifications.length - 1 ? prev + 1 : 0))
                }
                aria-label="Ogeysiiska Xiga"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          <button
            className="notif-banner__close-btn"
            onClick={() => handleDismiss(currentNotif.id)}
            aria-label="Xir Ogeysiiska"
            title="Xir Ogeysiiska"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}

