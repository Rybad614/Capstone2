/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");
const { default: Nylas } = require("nylas");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const GRANT_ID = process.env.ICLOUD_GRANT || process.env.GMAIL_GRANT;
const PORT = +process.env.PORT || 3001;
const API_KEY = process.env.API_KEY;

const nylas = new Nylas({
  apiKey: API_KEY,
  apiUri: process.env.API_URI
})



// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "postgresql:///only_family_test"
      : process.env.DATABASE_URL || "postgresql:///only_family";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("only_family Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  nylas,
  SECRET_KEY,
  GRANT_ID,
  PORT,
  API_KEY,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
