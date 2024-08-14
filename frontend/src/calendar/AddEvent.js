import React from "react";

function AddEvent({handleSubmit, handleChange, formData, editingEvent}) {

  return (
    <>
    <h2>Add New Event</h2>
      <form onSubmit={handleSubmit}>
        <section className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
          />
        </section>
        <div className="description">
          <h4>DESCRIPTION:</h4>
          <section className="form-group">
            <label htmlFor="condition">Condition:</label>
            <select
              name="condition"
              id="condition"
              className="form-control"
              value={formData.condition}
              onChange={handleChange}
            >
              <option value="N/A">Choose:</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </section>
          <section className="form-group">
            <label htmlFor="activities">Activities:</label>
            <input
              name="activities"
              className="form-control"
              value={formData.activities}
              onChange={handleChange}
            />
          </section>
          <section className="form-group">
            <label htmlFor="attendance">Attendance:</label>
            <select
              name="attendance"
              className="form-control"
              value={formData.attendance}
              onChange={handleChange}
            >
              <option value="Invited">Mandatory / Voluntary</option>
              <option value="Mandatory">Mandatory</option>
              <option value="Voluntary">Voluntary</option>
            </select>
          </section>
          <section className="form-group">
            <label htmlFor="announcements">Announcements:</label>
            <input
              name="announcements"
              className="form-control"
              value={formData.announcements}
              onChange={handleChange}
            />
          </section>
        </div>
        <section className="form-group">
          <label htmlFor="day">Day:</label>
          <input
            name="day"
            defaultValue={new Date().getDate()}
            onChange={handleChange}
          />
        </section>
        <section className="form-group">
          <label htmlFor="month">Month:</label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
          >
            <option value="Jan">January</option>
            <option value="Feb">February</option>
            <option value="Mar">March</option>
            <option value="Apr">April</option>
            <option value="May">May</option>
            <option value="Jun">June</option>
            <option value="Jul">July</option>
            <option value="Aug">August</option>
            <option value="Sep">September</option>
            <option value="Oct">October</option>
            <option value="Nov">November</option>
            <option value="Dec">December</option>
          </select>
        </section>
        <section className="form-group">
          <label htmlFor="year">Year:</label>
          <input
            name="year"
            value={formData.year}
            onChange={handleChange}
          />
        </section>
        <section className="form-group">
          <label htmlFor="start-time">Start Time:</label>
          <input
            name="from"
            value={formData.from}
            onChange={handleChange}
          />
        </section>
        <section className="form-group">
          <label htmlFor="end-time">End Time:</label>
          <input
            name="until"
            value={formData.until}
            onChange={handleChange}
          />
        </section>
        <section className="form-group">
          <label htmlFor="calendar-id">Calendar ID:</label>
          <input
            name="calendar_id"
            value={formData.calendar_id}
            onChange={handleChange}
          />
        </section>
        <section className="form-group">
          <label htmlFor="user-id">User ID:</label>
          <input
            name="user-id"
            value={formData.user_id}
            disabled
          />
        </section>
        <button type="submit" onSubmit={handleSubmit}>
          {editingEvent ? "Update" : "Add Event"}
        </button>
      </form>
    </>
  )
}

export default AddEvent;