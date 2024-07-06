/** Routes using authentication */

// const jsonschema = require("jsonschema");
const express = require("express");

// const User = require("../models/user");
// const { BadRequestError, ForbiddenError } = require("../expressError");

const router = new express.Router();

router.post("/", (req, res) => {
  res.send("WELCOME admin, LETS GET YOU STARTED...");
});

router.get("/", (req, res) => {
  res.send("SIGN UP");
});

module.exports = router;