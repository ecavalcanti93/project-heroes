const express = require('express');
const router = express.Router();
const redis = require("../config/redis");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
