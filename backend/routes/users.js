/**Routes for user activity between ADMIN and MEMBERS */

const express = require("express");
const { createToken } = require("../helpers/tokens")
const User = require("../models/user");

const router = new express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});
router.get("/:email", async function (req, res, next) {
  try {
    const user = await User.get(req.params.email);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});
router.patch("/:email", async function (req, res, next) {
  try {
    const user = await User.update(req.params.email, req.body);
    return res.json({ edited: user });
  } catch (err) {
    return next(err)
  }
});
router.delete("/:email", async function (req, res, next) {
  try {
    const user = await User.remove(req.params.email);
    return res.json({ deleted: user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;