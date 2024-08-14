const db = require("../db");

class Participant {
  /** */
  static async create({ chat_group_id, calendar_id, user_id }) {
    const result = await db.query(
          `INSERT INTO participants
           (user_id,
            calendar_id,
            chat_group_id)
            VALUES ($1, $2, $3)
            RETURNING user_id, calendar_id, chat_group_id`,
            [
              user_id,
              calendar_id,
              chat_group_id,
            ],
    );
    const participant = result.rows[0];

    return participant;
  }
  static async get(email) {
    const calendar_id = await db.query(
      `SELECT p.calendar_id
       FROM users u
       JOIN participants p ON u.user_id = p.user_id
       WHERE email = $1`,
       [email],
    );
    const participants = await db.query(
      `SELECT g.chat_group_id, g.group_name, p.user_id, p.calendar_id, u.email 
       FROM participants p 
       JOIN users u ON p.user_id = u.user_id 
       JOIN groupchats g ON p.chat_group_id = g.chat_group_id
       WHERE calendar_id = $1`,
       [calendar_id.rows[0].calendar_id],
    );

    return participants.rows;
  }
  static async remove(Participant_id) {
    const result = await db.query(
      `DELETE
       FROM participants
       WHERE participant_id = $1`,
       [Participant_id],
    );
    const participant = result.rows[0];
  }
}


module.exports = Participant;