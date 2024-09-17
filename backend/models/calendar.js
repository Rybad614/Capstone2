require("dotenv").config();
const axios = require("axios");
const { nylas, API_KEY } = require("../config");

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

const nylasCalendar = nylas.calendars;


/**
 * Functions for calendars.
 * 
 * 
 * @method create --Make a new calendar.
 * @method view --See calendars related to user.
 * @method update --Modify a calendar.
 * @method delete --Remove a calendar.
 */

class Calendar {

  /** Creates a calendar (from data), update db, return new calendar data.
   * 
   * data should be:
   * @augments name REQUIRED - How a user identifies a calendar.
   * @augments description REQUIRED - The purpose of the need for a calendar.
   * @augments user_grant REQUIRED - Allows a user the feature to update calendars outside of the app, via GoogleCalendar, iCalendar.
   * @augments user_id REQUIRED - specifies the creator of the calendar. MUST BE ADMIN.
   * 
   * @returns {Object} Data for calendar.
  */
  static async create({ name, description, user_grant, user_id }) {
    try {
      const calendar = await nylasCalendar.create({
        identifier: user_grant,
        requestBody: {
          name: name,
        }
      })

      console.log('CREATED Calendar:', calendar)
    } catch (error) {
      console.error('Error creating calendar:', error)
    }

    const result = await db.query(
      `INSERT INTO calendars
           (name,
            description,
            user_grant,
            user_id)
           VALUES ($1, $2, $3, $4)
           RETURNING name, description, user_id`,
      [
        name,
        description,
        user_grant,
        user_id,
      ],
    );
    const createCalendar = result.rows[0];

    return createCalendar;
  }
  /** Given a users ID, return calendar data to be displayed.
   * 
   * @returns {Array|Object} Any calendar associated to user.
   * 
  */
  static async view(user_id) {

    const user_grant = await db.query(
      `SELECT user_grant
               FROM calendars
               WHERE user_id = $1`,
      [user_id],
    );

    if (user_grant) {
      try {
        const calendar = await nylasCalendar.list({
          identifier: user_grant.rows[0].user_grant,
        })
        console.log('CALENDAR', calendar)
      } catch (err) {
        console.error('Error fetching calendar:', err)
      }
    }
    const result = await db.query(
      `SELECT calendar_id,
                  name,
                  description,
                  user_id
           FROM calendars
           WHERE user_id = $1`,
      [user_id],
    );
    const allCalendars = result.rows;

    return allCalendars;
  }
  /** @todo Update calendar data with `data`.
   * 
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   * 
   * @param {Number} user_id specifies admin user.
   * @param {Number} calendar_id specifies calendar.
   * @param {Object} data consist of NAME and DESCRIPTION.
   *  @arg {String} name - name of calendar.
   *  @arg {String} description - describes calendar.
   * 
  */
  static async update(user_id, calendar_id, data) {
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

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        name: "name",
        description: "description",
      });
    const calendarVarIdx = "$" + (values.length + 1);

    try {
      const calendar = nylasCalendar.update({
        identifier: user_grant.rows[0].user_grant,
        calendarId: apiCall.data.data[0].id,
        requestBody: {
          name: data.name
        }
      })
      console.log('UPDATING Calendar:', await calendar)

    } catch (err) {
      console.error('Error updating calendar:', err)
    }



    const querySql = `UPDATE calendars
                        SET ${setCols}
                        WHERE calendar_id = ${calendarVarIdx}
                        RETURNING calendar_id,
                                  name,
                                  description`;
    const result = await db.query(querySql, [...values, calendar_id]);
    const calendar = result.rows[0];

    if (!calendar) throw new NotFoundError(`calendar at ${calendar_id} does not exist.`);
    return calendar;
  }
  /** @todo Given a users ID and a specified calendar ID, remove calendar data.
   * 
   * @param {Number} user_id specifies admin user.
   * @param {Number} calendar_id specifies calendar.
   *  
   * @throws NotFoundError - calendar cannot be found.
  */
  static async delete(user_id, calendar_id) {
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

    try {
      const calendar = await nylasCalendar.destroy({
        identifier: user_grant.rows[0].user_grant,
        calendarId: apiCall.data.data[0].id,
      })

      console.log("Removed Calendar:", calendar)
    } catch (err) {
      console.error("FAILED to delete calendar.", err);
    }

    const result = await db.query(
      `DELETE 
             FROM calendars
             WHERE calendar_id = $1
             RETURNING calendar_id, user_id`,
      [calendar_id],
    );
    const calendar = result.rows[0];

    if (!calendar) throw new NotFoundError('Calendar does not exist.');

    return calendar;
  }
}


module.exports = Calendar;