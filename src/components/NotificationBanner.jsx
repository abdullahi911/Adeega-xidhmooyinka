import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Sparkles, Wrench, X, Pause, Play } from 'lucide-react';
import { notificationService } from '../services/db';
import '../styles/NotificationBanner.css';

export default function NotificationBanner() {
  const [notifications, setNotifications] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
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

  // Primary notification determines banner accent/gradient
  const primaryNotif =
    visibleNotifications.find((n) => n.type === 'alert') ||
    visibleNotifications.find((n) => n.type === 'maintenance') ||
    visibleNotifications.find((n) => n.type === 'promotion') ||
    visibleNotifications[0];

  const handleDismissAll = () => {
    const allIds = visibleNotifications.map((n) => n.id);
    const updated = [...dismissedIds, ...allIds];
    setDismissedIds(updated);
    try {
      sessionStorage.setItem('xirmo_dismissed_notifs', JSON.stringify(updated));
    } catch {}
  };

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle size={15} className="notif-banner__icon" />;
      case 'promotion':
        return <Sparkles size={15} className="notif-banner__icon" />;
      case 'maintenance':
        return <Wrench size={15} className="notif-banner__icon" />;
      default:
        return <Bell size={15} className="notif-banner__icon" />;
    }
  };

  const getBadgeText = (type) => {
    switch (type) {
      case 'alert':
        return 'Digniin';
      case 'promotion':
        return 'Qiimo Dhimis';
      case 'maintenance':
        return 'Hagaajin';
      default:
        return 'Ogeysiis';
    }
  };

  // Render announcement group (rendered twice for infinite seamless ticker)
  const renderAnnouncementGroup = (keySuffix) => (
    <div className="notif-banner__group" key={`group-${keySuffix}`} aria-hidden={keySuffix === 'clone'}>
      {visibleNotifications.map((notif, idx) => (
        <span className="notif-banner__item" key={`${notif.id}-${keySuffix}-${idx}`}>
          <strong className="notif-banner__item-title">{notif.title}:</strong>
          <span className="notif-banner__item-desc">{notif.description}</span>
          <span className="notif-banner__divider" aria-hidden="true">•</span>
        </span>
      ))}
    </div>
  );

  return (
    <aside
      className={`notif-banner notif-banner--${primaryNotif?.type || 'announcement'} ${isPaused ? 'notif-banner--paused' : ''}`}
      aria-label="Website Announcements"
    >
      <div className="container notif-banner__inner">
        {/* Left Badge with Icon */}
        <div className="notif-banner__badge">
          {getIcon(primaryNotif?.type)}
          <span>{getBadgeText(primaryNotif?.type)}</span>
        </div>

        {/* Middle Moving Marquee Ticker */}
        <div
          className="notif-banner__viewport"
          title="Hover or tap to pause reading"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="notif-banner__track">
            {renderAnnouncementGroup('orig')}
            {renderAnnouncementGroup('clone')}
          </div>
        </div>

        {/* Right Controls: Pause/Play & Dismiss */}
        <div className="notif-banner__actions">
          <button
            type="button"
            className="notif-banner__btn"
            onClick={() => setIsPaused((prev) => !prev)}
            aria-label={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
            title={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>

          <button
            type="button"
            className="notif-banner__btn"
            onClick={handleDismissAll}
            aria-label="Dismiss announcements"
            title="Dismiss announcements"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
