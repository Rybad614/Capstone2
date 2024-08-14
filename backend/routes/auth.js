/** Routes using authentication */

// const jsonschema = require("jsonschema");
const express = require("express");

const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
// const { BadRequestError, ForbiddenError } = require("../expressError");

const router = new express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.authenticate(email, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const newUser = await User.register({ ...req.body });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }});

module.exports = router;