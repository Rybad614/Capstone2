const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} = require("../expressError");

const { sqlForPartialUpdate } = require("../helpers/sql");
const { BCRYPT_WORK_FACTOR } = require("../config.js");


/** */
class User {
  /** */
  static async authenticate(email, password) {
    const result = await db.query(
      `SELECT username,
              password,
              first_name,
              email,
              user_type
       FROM users
       WHERE email = $1`,
      [email],
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(password, user.passowrd);
      if (isValid === true) {
        delete user.passowrd;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }


  /** */
  static async register({ user_type, username, first_name, password, email }) {
    const duplicateCheck = await db.query(
      `SELECT email
       FROM users
       WHERE email = $1`,
      [email],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Account under ${email} already exists.`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
          `INSERT INTO users
           (user_type,
            username,
            first_name,
            password,
            email,
            created_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING user_type, username, first_name, password, email, created_at`,
        [
          user_type,
          username,
          first_name,
          hashedPassword,
          email,
          new Date().toLocaleString(),
        ],
    );
    const user = result.rows[0];

    return user;
  }
  /** */
  static async get(email) {
    const result = await db.query(
      `SELECT user_type,
              username,
              first_name,
              email
       FROM users
       WHERE email = $1`,
      [email],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`${email} does not match a user.`);

    return user;
  }
  /** */
  static async update(email, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
      data, 
      {
        firstName: "first_name",
        password: "password",
      });
    const emailVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users
                      SET ${setCols}
                      WHERE email = ${emailVarIdx}
                      RETURNING username,
                                first_name AS "firstName",
                                email`;
    const result = await db.query(querySql, [...values, email]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`${email} does not match a user.`);
    
    delete user.passowrd;
    return user;
  }
  /** */
  static async remove(email) {
    const result = await db.query(
          `DELETE
           FROM users
           WHERE email = $1
           RETURNING email`,
        [email],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`${email} does not match a user.`)
  }
}


module.exports = User;