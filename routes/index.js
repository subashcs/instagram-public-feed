var express = require("express");
const FeedController = require("../controllers/feed.controller");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Instagram Feed Scraper" });
});

router.get("/feeds", FeedController.getFeeds);

module.exports = router;
