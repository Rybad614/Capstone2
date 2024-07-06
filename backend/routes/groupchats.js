const express = require("express");
const GroupChat = require("../models/groupchat")

const router = new express.Router();

router.post("/create", async (req, res, next) => {
  try {
    const chat = await GroupChat.create(req.body);
    return res.status(201).json({ chat });
  } catch (err) {
    return next(err);
  }
});
router.delete("/:chat_id", async (req, res, next) => {
  try {
    const chat = await GroupChat.delete(req.params.chat_id);
    return res.json({ Deleted: chat });
  } catch (err) {
    return next(err);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const chat = await GroupChat.addUser(req.body);
    return res.status(200).json({ userAdded: chat });
  } catch (err) {
    return next(err);
  }
})
router.delete("/:chat_group_id/:participant_id", async (req, res, next) => {
  try {
    const chat = await GroupChat.removeUser(req.params.chat_group_id, req.params.participant_id);
    return res.json({ Removed: chat });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;