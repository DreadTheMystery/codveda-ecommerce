import React, { useState, useEffect } from "react";
import "./NotificationSystem.css";

const NotificationSystem = ({ notifications, onRemove }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

const Notification = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);

    // Auto remove after duration
    const timer = setTimeout(() => {
      handleRemove();
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      case "order":
        return "🛒";
      default:
        return "ℹ️";
    }
  };

  return (
    <div
      className={`notification notification-${notification.type} ${
        isVisible ? "notification-visible" : ""
      } ${isRemoving ? "notification-removing" : ""}`}
    >
      <div className="notification-icon">{getIcon()}</div>
      <div className="notification-content">
        <div className="notification-title">{notification.title}</div>
        {notification.message && (
          <div className="notification-message">{notification.message}</div>
        )}
      </div>
      <button className="notification-close" onClick={handleRemove}>
        ×
      </button>
    </div>
  );
};

export default NotificationSystem;
