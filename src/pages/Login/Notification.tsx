import "./login.css";

export default function NotificationPermissionCard({
  onEnable,
  onDismiss,
}) {
  return (
    <div className="notification-card">
      <button
        className="notification-close"
        onClick={onDismiss}
      >
        ✕
      </button>

      <div className="notification-content">
        <div className="notification-icon">
          🔔
        </div>

        <div className="notification-body">
          <h3>
            Never Miss Your Family Finance Updates
          </h3>

          <p>
            Enable notifications to receive
            daily expense reminders, budget
            alerts, goal updates and family
            activity notifications.
          </p>

          <div className="notification-features">
            <span>💰 Budget Alerts</span>
            <span>🎯 Goal Reminders</span>
            <span>📅 Daily Reminders</span>
            <span>👨‍👩‍👧 Family Activity</span>
          </div>

          <div className="notification-actions">
            <button
              className="enable-btn"
              onClick={onEnable}
            >
              Enable Notifications
            </button>

            <button
              className="later-btn"
              onClick={onDismiss}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}