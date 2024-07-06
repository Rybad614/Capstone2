const express = require("express");
const Event = require("../models/event");

const router = new express.Router();



router.post("/", async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    return res.status(201).json({ event });
  } catch (err) {
    console.error("Error creating event:");
    next(err);
  }
});
router.get("/:user_id/:calendar_id", async (req, res, next) => {
  try {
    const event = await Event.get(req.params.user_id, req.params.calendar_id);
    return res.json({ event });
  } catch (err) {
    console.error("Error fetching event:");
    next(err);
  }
});
router.patch("/:user_id/:calendar_id", async (req, res, next) => {
  try {
    const event = await Event.update(req.params.user_id, req.params.calendar_id, req.body);
    return res.json({ edited: event });
  } catch (err) {
    console.error("Error trying EDIT event:");
    next(err);
  }
});
router.delete("/:user_id/:event_id", async (req, res, next) => {
  try {
    const event = await Event.delete(req.params.user_id, req.params.event_id);
    return res.json({ DELETED: event });
  } catch (err) {
    console.error("Error trying DELETE event:");
    next(err);
  }
});



module.exports = router;