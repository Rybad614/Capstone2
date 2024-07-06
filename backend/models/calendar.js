require("dotenv").config();
const axios = require("axios");
const { nylas, API_KEY } = require("../config");

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

const nylasCalendar = nylas.calendars;

class Calendar {
  
  /** */
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
  /** */
  static async view(user_id) {
    
    const user_grant = await db.query(
              `SELECT user_grant
               FROM calendars
               WHERE user_id = $1`,
              [user_id],
    );

    try {
      const calendar = await nylasCalendar.list({
        identifier: user_grant.rows[0].user_grant,
      })
      console.log('CALENDAR', calendar)
    } catch (err) {
      console.error('Error fetching calendar:', err)
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
  /** */
  static async update(user_id, calendar_id, data) {
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
  /** */
  static async delete(user_id, calendar_id) {
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