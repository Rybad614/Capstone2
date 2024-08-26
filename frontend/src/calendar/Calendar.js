import React, { useContext, useState } from 'react';
import Calendar from 'react-calendar';
import EventForm from './EventForm';
import NotificationForm from './NotificationForm';
import UserContext from '../auth/UserContext';

import './Calendar.css';

export default function CalendarVis() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState(null);
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventPopup, setEventPopup] = useState(null);
  const { userCalendars, userEvents } = useContext(UserContext)

  console.debug(
    "Calendar", "\n",
    "today=", new Date(), "\n",
    "showEventPopup=", showEventPopup, "\n",
    "selectedDay=", selectedDay, "\n",
    "userCalendars=", userCalendars.calendar, "\n",
    "userEvents=", userEvents, "\n",
  );

  function handleDayClick(selectedDay) {
    let day = selectedDay.getDate();
    if (day >= new Date().getDate()) {
      setSelectedDay(selectedDay)
      setShowEventPopup(true);
      setShowAddEvent(false);
      setEventPopup(userEvents);
      setEditingEvent(null);
    }
  }

  return (
    <div className='container'>
      <div className='calendar-hp calendar-pp calendar-gc'>
        <Calendar
          onClickYear={(value, event) => console.log('Clicked year: ', value)}
          onClickMonth={(value, event) => console.log('Clicked month: ', value)}
          onClickDay={() => handleDayClick(selectedDay)}
          onChange={setSelectedDay}
          value={selectedDay}
          calendarType='gregory'
          minDate={new Date()}
        />
      </div>
        <NotificationForm />
        {(showEventPopup === true)
          ? <EventForm
            eventPopup={eventPopup}
            showEventPopup={setShowEventPopup}
            showAddEvent={showAddEvent}
            setShowAddEvent={setShowAddEvent}
            editingEvent={editingEvent}
            setEditingEvent={setEditingEvent}
          />
          : null
        }
    </div>
  );
}