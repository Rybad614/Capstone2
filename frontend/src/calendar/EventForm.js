import React, { useContext, useState } from "react";
import 'react-calendar/dist/Calendar.css';

import DisplayEvents from "./DisplayEvents";
import OtfApi from "../api/api";
import UserContext from "../auth/UserContext";
import AddEvent from "./AddEvent";


function EventForm({ eventPopup, showEventPopup, showAddEvent, setShowAddEvent, editingEvent, setEditingEvent }) {
  const { currentUser, setUserEvents } = useContext(UserContext);
  const [formData, setFormData] = useState({
    e_token: editingEvent ? editingEvent.e_token : Date.now().toString(),
    title: "",
    condition: "",
    activities: "",
    attendance: "",
    announcements: "",
    day: "",
    month: "",
    year: "",
    from: "",
    until: "",
    calendar_id: "",
    user_id: currentUser.user_id
  });
  const [events, setEvents] = useState(eventPopup);
  const [formErrors, setFormErrors] = useState([]);

  console.debug(
    "EventForm", "\n",
    "userEvents=", "\n",
    eventPopup, "\n",
    events, "\n",
    "formData=", formData, "\n",
    "showAddEvents=", showAddEvent, "\n",
  );

  async function createEvent(eventData) {
    try {
      let event = await OtfApi.createUserEvent(eventData);
      return { event };
    } catch (err) {
      console.error("Event Creation Failed \n", err)
    }
  }

  async function removeEvent(user_id, eventToken) {
    try {
      let event = await OtfApi.removeUserEvent(user_id, eventToken);
      return { removed: event };
    } catch (err) {
      console.error("Event Deletion Failed", err)
    }
  }

  function handleAddEvent() {
    setShowAddEvent(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newEvent = await createEvent(formData);

    let updatedEvents = [...events];

    if (editingEvent) {
      updatedEvents = updatedEvents.map((event) =>
        event.e_token === editingEvent.e_token ? newEvent : event,
      );
    } else {
      updatedEvents.push(newEvent.event);
      setUserEvents(updatedEvents);
    };


    setEvents(updatedEvents);
    setFormData(formData);
    showEventPopup(true);
    setShowAddEvent(false)
    setEditingEvent(null);
  }

  function handleEditEvent(event) {
    setFormData(event)
    setEditingEvent(event);
    showEventPopup(true);
  }

  async function handleDeleteEvent(user_id, eventToken) {
    user_id = currentUser.user_id;
    await removeEvent(user_id, eventToken);

    const updatedEvents = events.filter((event) => event.e_token !== eventToken);

    setUserEvents(updatedEvents);
    setEvents(updatedEvents);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  return (
    <>
      <DisplayEvents
        events={events}
        handleEditEvent={handleEditEvent}
        handleDeleteEvent={handleDeleteEvent}
      />
      <button type="button" onClick={handleAddEvent}>
        ADD EVENT
      </button>

      {(showAddEvent === true)
        ? <AddEvent
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          formData={formData}
          editingEvent={editingEvent}
         />
        : null
      }
    </>
  )
}

export default EventForm;