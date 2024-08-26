import React from "react";

import './EventForm.css'


function DisplayEvents({ events, handleEditEvent, handleDeleteEvent }) {
console.log(events.map(event => event.e_token));
  return (
    <>
      {events.map((event, idx) => (
        <div className='card-body event' key={idx}>
          <div className="evt-card-title">{event.title}</div>
          <span className="evt-id">EvtId: {event.e_token}</span>
          <form className='event-date-wrapper'>
            <span className="form-title">WHEN:</span>
            <div className='evt-form-group event-date'>Date: {event.event_date}</div>
            <div className='evt-form-group event-start-time'>Start Time: {event.start_time}</div>
            <div className='evt-form-group event-end-time'>End Time: {event.end_time}</div>
          </form>
          {/* <div className='event-title'>Description: {event.description}</div> */}
          <div className='event-buttons'>
            <i className='edit' onClick={() => handleEditEvent(event)}>L7</i>
            ----
            <i className='delete' onClick={() => handleDeleteEvent(event.user_id, event.e_token)}>X</i>
          </div>
          <br />
        </div>
      ))}
    </>
  )
}

export default DisplayEvents;