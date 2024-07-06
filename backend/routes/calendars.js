/**Routes for calendars (NYLAS api) */

const express = require("express");
const Calendar = require("../models/calendar");
const { BadRequestError, NotFoundError } = require("../expressError");

const router = new express.Router();



router.post("/", async (req, res, next) => {
  try {
    const calendar = await Calendar.create(req.body);
    return res.status(201).json({ calendar });
  } catch (err) {
    console.error("Error creating calendar:", err);
    next(err);
  }
});   
/** GET / => 
 * { Calendars: [ { requestId, data[{...}...] }, ...] }
 * 
 */
router.get("/:user_id", async (req, res, next) => {
  try {
    const calendar = await Calendar.view(req.params.user_id);
    return res.json({ calendar });
  } catch (err) {
    console.error("Error fetching calendars:", err);
    next(err);
  }
});   
router.patch("/:user_id/:calendar_id", async (req, res, next) => {
  try {
    const calendar = await Calendar.update(req.params.user_id, req.params.calendar_id, req.body);
    return res.json({ edited: calendar });
  } catch (err) {
    console.error("Error updating calendar:", err);
    next(err);
  }
});
router.delete("/:user_id/:calendar_id", async (req, res, next) => {
  try {
    const calendar = await Calendar.delete(req.params.user_id, req.params.calendar_id);
    return res.json({ deleted: calendar });
  } catch (err) {
    console.error("Error deleting calendar:", err);
    next(err);
  }
});

module.exports = router;