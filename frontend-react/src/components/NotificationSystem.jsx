import React, { useState, useEffect } from "react";

let notificationId = 0;

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  // Global function to show notifications
  window.showNotification = (message, type = "success") => {
    const id = ++notificationId;
    const newNotification = { id, message, type };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto remove after 3 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case "error":
        return "linear-gradient(45deg, #dc3545, #c82333)";
      case "info":
        return "linear-gradient(45deg, #17a2b8, #138496)";
      default:
        return "linear-gradient(45deg, #28a745, #20c997)";
    }
  };

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="notification"
          style={{
            background: getBackgroundColor(notification.type),
          }}
          onClick={() => removeNotification(notification.id)}
        >
          {notification.message}
        </div>
      ))}

      <style jsx>{`
        .notification-container {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10000;
          pointer-events: none;
        }

        .notification {
          color: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          font-weight: 600;
          margin-bottom: 10px;
          animation: slideDown 0.3s ease;
          cursor: pointer;
          pointer-events: all;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationSystem;
