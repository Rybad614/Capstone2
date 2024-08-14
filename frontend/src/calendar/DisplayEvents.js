import React from "react";


function DisplayEvents({ events, handleEditEvent, handleDeleteEvent }) {
console.log(events.map(event => event.e_token));
  return (
    <>
      {events.map((event, idx) => (
        <div className='event' key={idx}>
          <h3>{event.title}</h3>
          <span>{event.e_token}</span>
          <div className='event-date-wrapper'>
            <span>WHEN:</span>
            <div className='event-date'>Date: {event.event_date}</div>
            <div className='event-start-time'>Start Time: {event.start_time}</div>
            <div className='event-end-time'>End Time: {event.end_time}</div>
          </div>
          {/* <div className='event-title'>Description: {event.description}</div> */}
          <div className='event-buttons'>
            <i className='edit' onClick={() => handleEditEvent(event)}>L7</i>
            ----
            <i className='message' onClick={() => handleDeleteEvent(event.user_id, event.e_token)}>X</i>
          </div>
          <br />
        </div>
      ))}
    </>
  )
}

export default DisplayEvents;