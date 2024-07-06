require("dotenv").config();
const axios = require("axios");
const { nylas, API_KEY } = require("../config");

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

const nylasEvent = nylas.events;


// FOR VALIDATING A DATE:

// const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

// daysInMonth(2020, 12); // 31
// daysInMonth(2024, 2); // 29

class Event {
  /** */
  static async create({ title, description, day, month, year, from, until, calendar_id, user_id }) {
    const EVENT = [
      new Date(`${day} ${month} ${year} ${from}:00 UTC-04:00`),
      new Date(`${day} ${month} ${year} ${until}:00 UTC-04:00`)
    ];

    const user_grant = await db.query(
      `SELECT user_grant
       FROM calendars
       WHERE user_id = $1`,
      [user_id],
    );

    const apiCall = await axios.get(`https://api.us.nylas.com/v3/grants/${user_grant.rows[0].user_grant}/calendars?select=id`,{
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    try {
      const event = await nylasEvent.create({
        identifier: user_grant.rows[0].user_grant,
        requestBody: {
          title: title,
          description: JSON.stringify(description),
          when: {
            startTime: EVENT[0].getTime()/1000,
            endTime: EVENT[1].getTime()/1000,
          }
        },
        queryParams: {
          calendarId: apiCall.data.data[0].id,
        },
      })

      console.log('EVENT:', event)
    } catch (err) {
      console.error('Error creating event:', err);
    }


    const event_date = EVENT.toLocaleString().split(",")[0];
    const start_time = EVENT.toLocaleString().split(",")[1];
    const end_time = EVENT.toLocaleString().split(",")[3];

    const result = await db.query(
            `INSERT INTO events
             (title,
              description,
              event_date,
              start_time,
              end_time,
              calendar_id,
              user_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING title, event_date, calendar_id`,
            [
              title,
              description,
              event_date,
              start_time,
              end_time,
              calendar_id,
              user_id,
            ],
    );
    const createEvent = result.rows[0];

    return createEvent;
  }
  /** */
  static async get(user_id, calendar_id) {
    const user_grant = await db.query(
      `SELECT user_grant
       FROM calendars
       WHERE user_id = $1`,
      [user_id],
    );

    const apiCall = await axios.get(`https://api.us.nylas.com/v3/grants/${user_grant.rows[0].user_grant}/calendars?select=id`,{
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    try {
      const events = await nylasEvent.list({
        identifier: user_grant.rows[0].user_grant,
        queryParams: {
          calendarId: apiCall.data.data[0].id,
        }
      })

      console.log("EVENTS", events)
    } catch (err) {
      console.error('Error fetching events', err)
    }
    const result = await db.query(
          `SELECT title,
                  description,
                  event_date,
                  start_time,
                  end_time
           FROM events
           WHERE calendar_id = $1`,
           [calendar_id],
    );
    const allEvents = result.rows;

    return allEvents;
  }
  /** */
  static async update(user_id, calendar_id, event_id, data) {
    const user_grant = await db.query(
      `SELECT user_grant
       FROM calendars
       WHERE user_id = $1`,
      [user_id],
    );

    const apiCall = await axios.get(`https://api.us.nylas.com/v3/grants/${user_grant.rows[0].user_grant}/calendars?select=id`,{
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    const apiCall2 = await axios.get(`https://api.us.nylas.com/v3/grants/${user_grant.rows[0].user_grant}/events?calendar_id=${apiCall.data.data[0].id}`,{
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    const title = "";
    const description = "";

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        title: title,
        description: description,
      });
    const eventVarIdx = "$" + (values.length + 1);

    try {
      const event = await nylasEvent.update({
        identifier: user_grant.rows[0].user_grant,
        eventId: apiCall2.data.data[0].id,
        requestBody: {
          title: data.title,
          description: JSON.stringify(data.description),
          },
        queryParams: {
          calendarId: apiCall.data.data[0].id,
          notifyParticipants: false
        },
      })

      console.log(event);
    } catch (err) {
      console.error('Error adding participant to event:', err)
    }


    const querySql = `UPDATE events
                        SET ${setCols}
                        WHERE event_id = ${eventVarIdx}
                        RETURNING event_id,
                                  title,
                                  start_time`;
      const result = await db.query(querySql, [...values, calendar_id]);
      const event = result.rows[0];
      
      if (!event) throw new NotFoundError(`calendar at ${calendar_id} does not exist.`);
      return event;
  }
  /** */
  static async delete(user_id, event_id) {
    const user_grant = await db.query(
      `SELECT user_grant
       FROM calendars
       WHERE user_id = $1`,
      [user_id],
    );

    const apiCall = await axios.get(`https://api.us.nylas.com/v3/grants/${user_grant.rows[0].user_grant}/calendars?select=id`,{
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    const apiCall2 = await axios.get(`https://api.us.nylas.com/v3/grants/${user_grant.rows[0].user_grant}/events?calendar_id=${apiCall.data.data[0].id}`,{
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    try {
      const event = await nylasEvent.destroy({
        identifier: user_grant.rows[0].user_grant,
        eventId: apiCall2.data.data[0].id,
        queryParams: {
          calendarId: apiCall.data.data[0].id,
        },
      })

      console.log('event DELETED:', event);
    } catch (err) {
      console.error('Error deleting event:', err)
    }

    const result = await db.query(
            `DELETE
             FROM events
             WHERE event_id = $1
             RETURNING user_id, title, calendar_id`,
          [event_id],
    );
    const event = result.rows[0];
    
    if (!event) throw new NotFoundError('Event does not exist.');

    return event;
  }
}


module.exports = Event;