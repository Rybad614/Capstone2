require("dotenv").config();
const axios = require("axios");
const { nylas, API_KEY } = require("../config");

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

const nylasEvent = nylas.events;

/**
 * Related functions for events.
 * 
 * @method create --Make a new event.
 * @method get --See events related to user.
 * @method update --Modify a event.
 * @method delete --Remove a event.
 */

class Event {
  /** 
   * Creates event with provided data, updates db, return new event data.
   * 
   * @augments title REQUIRED - How a user can identify an event.
   * @augments condition REQUIRED - Helps user with expectations for event (Either Indoor or Outdoor FOR NOW).
   * @augments activities REQUIRED - Helps user with expectations for event.
   * @augments attendance REQUIRED - Helps user with expectations for event (Either Voluntary or Mandatory FOR NOW).
   * @augments announcements REQUIRED - Helps user with expectations for event.
   * @augments day REQUIRED - Helps user with expectations for event. (EX. 1, 20, 31)
   * @augments month REQUIRED - Helps user with expectations for event. (EX. January, June, December)
   * @augments year REQUIRED - Helps user with expectations for event. (EX. 2024, 2025, 2026)
   * @augments from REQUIRED - Helps user with expectations for event. (EX. 02:00, 15:00, 23:45)
   * @augments until REQUIRED - Helps user with expectations for event. (EX. 05:00, 10:00, 12:30)
   * @augments calendar_id REQUIRED - Modify the right calendar.
   * @augments user_id REQUIRED - Associated admin user.
   * @augments e_token REQUIRED - Event identifier.
  */
  static async create({ title, condition, activities, attendance, announcements, day, month, year, from, until, calendar_id, user_id, e_token }) {
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

    if (user_grant) {
      const apiCall = await axios.get(`https://api.us.nylas.com/v3/grants/${user_grant.rows[0].user_grant}/calendars?select=id`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });

      try {
        const event = await nylasEvent.create({
          identifier: user_grant.rows[0].user_grant,
          requestBody: {
            title: title,
            description: condition,
            when: {
              startTime: EVENT[0].getTime() / 1000,
              endTime: EVENT[1].getTime() / 1000,
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
    }


    const event_date = EVENT.toLocaleString().split(",")[0];
    const start_time = EVENT.toLocaleString().split(",")[1];
    const end_time = EVENT.toLocaleString().split(",")[3];

    const result = await db.query(
      `INSERT INTO events
             (title,
              condition,
              activities,
              attendance,
              announcements,
              event_date,
              start_time,
              end_time,
              calendar_id,
              user_id,
              e_token)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *`,
      [
        title,
        condition,
        activities,
        attendance,
        announcements,
        event_date,
        start_time,
        end_time,
        calendar_id,
        user_id,
        e_token,
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

    if (user_grant) {
      const apiCall = await axios.get(`https://api.us.nylas.com/v3/grants/${user_grant.rows[0].user_grant}/calendars?select=id`, {
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
    }
    const result = await db.query(
      `SELECT *
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

    const apiCall = await axios.get(`https://api.us.nylas.com/v3/grants/${user_grant.rows[0].user_grant}/calendars?select=id`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    const apiCall2 = await axios.get(`https://api.us.nylas.com/v3/grants/${user_grant.rows[0].user_grant}/events?calendar_id=${apiCall.data.data[0].id}`, {
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
  static async delete(user_id, e_token) {
    const user_grant = await db.query(
      `SELECT user_grant
       FROM calendars
       WHERE user_id = $1`,
      [user_id],
    );

    if (user_grant) {
      const apiCall = await axios.get(`https://api.us.nylas.com/v3/grants/${user_grant.rows[0].user_grant}/calendars?select=id`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      const apiCall2 = await axios.get(`https://api.us.nylas.com/v3/grants/${user_grant.rows[0].user_grant}/events?calendar_id=${apiCall.data.data[0].id}`, {
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
    }

    const result = await db.query(
      `DELETE
             FROM events
             WHERE user_id = $1
             AND e_token = $2
             RETURNING user_id, title, calendar_id`,
      [user_id, e_token],
    );
    const event = result.rows[0];

    if (!event) throw new NotFoundError('Event does not exist.');

    return event;
  }
}


module.exports = Event;