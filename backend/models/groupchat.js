const db = require("../db");
const { UnauthorizedError, BadRequestError } = require("../expressError");

class GroupChat {
  /** */
  static async create({ group_name, created_by }) {
    const result = await db.query(
            `INSERT INTO groupchats
             (group_name,
              created_by,
              created_at)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [
              group_name,
              created_by,
              new Date().toLocaleString(),
            ],
    );
    const chat = result.rows[0];

    return chat;
  }
  /** */
  static async delete(chat_group_id) {
    const result = await db.query(
            `DELETE
             FROM groupchats
             WHERE chat_group_id = $1
             RETURNING *`,
             [chat_group_id],
    );
  }
  /** */
  static async addUser({ chat_group_id, user_id }) {
    const result = await db.query(
            `INSERT INTO participants
              (chat_group_id, user_id)
             VALUES ($1, $2)
             RETURNING *`,
          [chat_group_id, user_id],
    );
    const chat = result.rows[0];

    return chat;
  }
  /** */
  static async removeUser(chat_group_id, participant_id) {
    const result = await db.query(
      `DELETE
       FROM participants
       WHERE chat_group_id = $1
       AND participant_id = $2`,
       [chat_group_id, participant_id],
    );
  }
}


module.exports = GroupChat;