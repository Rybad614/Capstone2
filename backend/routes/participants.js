const express = require("express");
const Participant = require("../models/participant");

const router = new express.Router();

router.post("/", async (req, res, next) => {
  try {
    const participant = await Participant.create(req.body);
    return res.status(201).json({ participant });
  } catch (err) {
    return next(err);
  }
});
router.get("/:email", async (req, res, next) => {
  try {
    const participants = await Participant.get(req.params.email);
    return res.json({ participants });
  } catch (err) {
    return next(err);
  }
});
router.delete("/remove", async (req, res, next) => {
  try {

  } catch (err) {
    return next(err);
  }
});

module.exports = router;