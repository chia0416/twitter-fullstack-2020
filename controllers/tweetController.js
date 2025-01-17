const db = require("../models");
const { Op } = require("sequelize");
const { Tweet, User, Reply, Like } = db;
const moment = require("moment");
const { getTestUser, getTopUsers, getMyProfile } = require("../services/generalService");

const listAttributes = ["id", "name", "account", "avatar"];
const tweetController = {
  getPosts: async (req, res) => {
    const user = getTestUser(req);
    try {
      const profile = await getMyProfile(user);
      const topUsers = await getTopUsers(user);

      const rawTweets = await Tweet.findAll({
        include: [
          { model: User, attributes: listAttributes },
          { model: Reply, attributes: ["id"] },
          { model: User, as: "LikedUsers", attributes: ["id"] }
        ],
        order: [["createdAt", "DESC"]],
        limit: 20
      });
      const Tweets = await rawTweets.map((data) => ({
        ...data.dataValues,
        ReplyCount: data.Replies.length,
        LikedCount: data.LikedUsers.length,
        createdAt: moment(data.createdAt).fromNow()
      }));

      // add isLike property dynamically
      Tweets.forEach((Tweet) => {
        Tweet.LikedUsers.forEach((likedUser) => {
          if (Number(likedUser.id) === Number(user.id)) Tweet.isLiked = true;
        });
      });
      // return res.json({ topUsers, Tweets, Profile })
      return res.render("index", {
        tweets: Tweets,
        users: topUsers,
        profile: profile
      });
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  },

  getPost: async (req, res) => {
    const user = getTestUser(req);
    try {
      const profile = await getMyProfile(user);
      const topUsers = await getTopUsers(user);

      let tweet = await Tweet.findByPk(req.params.id, {
        include: [
          { model: User, attributes: listAttributes },
          { model: User, as: "LikedUsers", attributes: ["id"] },
          { model: Reply, include: [User] }
        ]
      });
      const ReplyCount = tweet.Replies.length;
      const LikedCount = tweet.LikedUsers.length;
      Replies = tweet.Replies.sort((a, b) => b.createdAt - a.createdAt);
      LikedUsers = tweet.LikedUsers.sort((a, b) => b.Like.createdAt - a.Like.createdAt);

      //add isLike property dynamically
      tweet = tweet.toJSON();
      tweet.LikedUsers.forEach((likedUser) => {
        if (Number(likedUser.id) === Number(user.id)) tweet.isLiked = true;
      });
      // return res.json({ tweet, ReplyCount, LikedCount, user: TopUsers,})
      return res.render("post2", {
        profile: profile,
        tweet,
        replies: tweet.Replies,
        ReplyCount,
        LikedCount,
        users: topUsers
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },

  postTweet: (req, res) => {
    const user = getTestUser(req);
    const { description } = req.body;
    if (!description.trim()) {
      req.flash("tweet_message", "你並未輸入任何文字")
      return res.redirect("back");
    }
    if (description.length > 140) {
      req.flash("tweet_message", "字數不可超過140字")
      return res.redirect("back");
    } else {
      return Tweet.create({
        UserId: user.id,
        description
      })
        .then((tweet) => {
          req.flash('tweet_success', '推文發送成功')
          res.redirect("back");
        })
        .catch((error) => res.status(400).json(error));
    }
  },
  //test only
  getReply: async (req, res) => {
    const user = getTestUser(req);
    try {
      const profile = await getMyProfile(user);
      const topUsers = await getTopUsers(user);

      let tweet = await Tweet.findByPk(req.params.id, {
        include: [
          { model: User, attributes: listAttributes },
          { model: User, as: "LikedUsers", attributes: ["id"] },
          { model: Reply, include: [User] }
        ]
      });
      const ReplyCount = tweet.Replies.length;
      const LikedCount = tweet.LikedUsers.length;
      Replies = tweet.Replies.sort((a, b) => b.createdAt - a.createdAt);
      LikedUsers = tweet.LikedUsers.sort((a, b) => b.Like.createdAt - a.Like.createdAt);

      //add isLike property dynamically
      tweet = tweet.toJSON();
      tweet.LikedUsers.forEach((likedUser) => {
        if (Number(likedUser.id) === Number(user.id)) tweet.isLiked = true;
      });
      // return res.json({ tweet, ReplyCount, LikedCount, user: TopUsers,})
      return res.render("post2", {
        profile: profile,
        tweet,
        replies: tweet.Replies,
        ReplyCount,
        LikedCount,
        users: topUsers
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },
  postReply: (req, res) => {
    const user = getTestUser(req);
    const { comment } = req.body;
    if (!comment) {
      req.flash('tweet_message', '你並未輸入任何文字')
      return res.redirect("back");
    }
    if (comment.length > 140) {
      req.flash('tweet_message', '字數不可超過140字')
      return res.redirect("back");
    } else {
      return Reply.create({
        UserId: user.id,
        TweetId: req.params.id,
        comment
      })
        .then((reply) => {
          req.flash('tweet_success', '回覆發送成功')
          res.redirect("back");
        })
        .catch((error) => res.status(400).json(error));
    }
  }
};

module.exports = tweetController;
