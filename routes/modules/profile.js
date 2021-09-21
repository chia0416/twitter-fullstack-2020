// This modules is for posts and comments (tablename: twitter and reply)
const express = require("express");
const profileController = require("../../controllers/profileController");
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;

router.get("/:id/posts", profileController.getPosts)
// router.get("/:id", profileController.getPost)
// router.post("/posts", profileController.postTweet)

module.exports = router;