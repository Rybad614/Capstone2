/** Express app for otf. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const calendarsRoutes = require("./routes/calendars");
const eventsRoutes = require("./routes/events");
const chatsRoutes = require("./routes/groupchats");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/calendars", calendarsRoutes);
app.use("/events", eventsRoutes);
app.use("/groupchats", chatsRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
