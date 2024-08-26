import React from "react";

import './NotificationForm.css';
function NotificationForm() {

  return (
    <div className="card noty">
      <div className="card-body">
        <div className="noty-card-title">Notifications:</div>
        <div className="noty-wrapper">
          <div className="noty-body">
            <p className="noty-text">Nothing! Check back in a bit.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationForm;