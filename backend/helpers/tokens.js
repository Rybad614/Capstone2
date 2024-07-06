const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(user) {
  console.assert(user.username !== undefined,
      "createToken passed user without username property");

  let payload = {
    email: user.email,
    username: user.username,
  };
  try {
    return jwt.sign(payload, SECRET_KEY);
  } catch (error) {
    console.error("Error signing the JWT:", error);
    throw new Error("Error creating token");
  }
}

module.exports = { createToken };
