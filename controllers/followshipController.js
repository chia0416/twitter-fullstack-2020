const db = require("../models");
const { User, Tweet, Reply, Like, Followship, sequelize } = db;
const moment = require("moment");
const { dummyuser } = require("../dummyuser.json");
//for test only

const helpers = require("../_helpers.js");
const getTestUser = function (req) {
  if (process.env.NODE_ENV === "test") {
    return helpers.getUser(req);
  } else {
    return req.user;
  }
};

const followshipController = {
  getFollowers: (req, res) => {
    const user = dummyuser;
    const listAttributes = [
      "id",
      "name",
      "account",
      "introduction",
      "updatedAt",
      "avatar",
    ];

    User.findByPk(user.id, {
      attributes: ["id", "name"],
      include: [
        { model: Tweet, attributes: ["id"] },
        {
          model: User,
          as: "Followers",
          attributes: listAttributes,
          include: {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
        },
      ],
    })
      .then((user) => {
        user = user.toJSON();
        user.Followers.forEach((follower) => {
          const arr = follower.Followings.map((el) => el.id);
          if (arr.indexOf(user.id) > 0) follower.isFollowed = true;
          else follower.isFollowed = false;
          follower.updatedAtFormated = moment(follower.updatedAt).fromNow();
        });

        user.tweetCount = user.Tweets.length;
        return res.render("followship", {
          tagA: true,
          user,
          followers: user.Followers,
        });
      })
      .catch((error) => res.status(400).json(error));
  },

  getFollowings: (req, res) => {
    const user = dummyuser;
    const listAttributes = [
      "id",
      "name",
      "account",
      "introduction",
      "updatedAt",
      "avatar",
    ];

    User.findByPk(user.id, {
      attributes: ["id", "name"],
      include: [
        { model: Tweet, attributes: ["id"] },
        {
          model: User,
          as: "Followings",
          attributes: listAttributes,
        },
      ],
    })
      .then((user) => {
        user = user.toJSON();
        user.Followings.forEach((following) => {
          following.updatedAtFormated = moment(following.updatedAt).fromNow();
        });
        user.tweetCount = user.Tweets.length;
        return res.render("followship", {
          tagB: true,
          user,
          followings: user.Followings,
        });
      })
      .catch((error) => res.status(400).json(error));
  },

  addFollowing: (req, res) => {
    const user = dummyuser;
    if(user.id === req.params.id) return console.error('Cannot follow yourself')
    return Followship.findOrCreate({
      where: {
        followerId: user.id,
        followingId: req.params.id
      }
    })
      .then(() => res.redirect("back"))
      .catch(error => res.status(400).json(error));
  },

  deleteFollowing: (req, res) => {
    const user = dummyuser;
    return Followship.destroy({
      where: { followerId: user.id, followingId: req.params.id },
    }).then(() => res.redirect("back"))
      .catch(error => res.status(400).json(error));
  },
};

module.exports = followshipController;
