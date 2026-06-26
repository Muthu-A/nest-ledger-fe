import NotificationPermissionCard from "./Notification";
import "./login.css";

export default function NotificationModal({
  onEnable,
  onDismiss,
}) {
  return (
    <div className="notification-modal-overlay">
      <div className="notification-modal-content">
        <NotificationPermissionCard
          onEnable={()=>onEnable()
          }
          onDismiss={onDismiss}
        />
      </div>
    </div>
  );
}