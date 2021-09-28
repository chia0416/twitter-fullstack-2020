// This modules is for posts and comments (tablename: twitter and reply)
const express = require("express");
const tweetController = require("../../controllers/tweetController");
const likeController = require("../../controllers/likeController");
const router = express.Router();
const { authenticated } = require('../../middleware/authenticationHelper');
//因題目需求 此路徑已全更改為/tweets/
router.get("/", authenticated, tweetController.getPosts);
router.get("/:id", authenticated, tweetController.getPost);
router.post("/", authenticated, tweetController.postTweet);
router.put("/:id/like", authenticated, likeController.changeLike);
router.get("/:id/replies", authenticated, tweetController.postReply);
router.post("/:id/replies", authenticated, tweetController.postReply);

module.exports = router;
