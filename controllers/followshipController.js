const db = require("../models")
const { User, Tweet, Followship } = db;
const moment = require("moment")
const { getTopUser, getTestUser } = require("util.service")
//for test only

const listAttributes = [
  "id", "name", "account", "introduction", "updatedAt", "avatar",
];

const followshipController = {
  getFollowers: async (req, res) => {
    const user = getTestUser(req)
    try{
      const profile = await User.findByPk(req.params.id, {
      attributes: ["id", "name"],
      include: [
        { model: Tweet, attributes: ["id"] },
        { model: User, as: "Followers", attributes: listAttributes,
          include: { model: User, as: "Followers", attributes: ["id"] }}]})
      const topUsers = await getTopUser()
        profile = profile.toJSON()
        profile.tweetCount = profile.Tweets.length
        profile.Followers.forEach((follower) => {
          const arr = follower.Followers.map((el) => el.id);
          if (arr.indexOf(profile.id) > -1) follower.isFollowed = true
          else follower.isFollowed = false
          follower.updatedAtFormated = moment(follower.updatedAt).fromNow()
        })
      return res.render(
        "followship", { tagA: true, profile, followers: profile.Followers, users: topUsers });
        }catch(error){ res.status(400).json(error)}
  },

  getFollowings: (req, res) => {
    const user = getTestUser(req);
    User.findByPk(req.params.id, {
      attributes: ["id", "name"],
      include: [
        { model: Tweet, attributes: ["id"] },
        { model: User,
          as: "Followings",
          attributes: listAttributes }]})
      .then((user) => {
        user = user.toJSON();
        user.Followings.forEach((following) => {
          following.updatedAtFormated = moment(following.updatedAt).fromNow();});
        user.tweetCount = user.Tweets.length;
        return res.render("followship", { tagB: true, profile: user, followings: user.Followings });})
      .catch((error) => res.status(400).json(error))
  },

  addFollowing: (req, res) => {
    const user = getTestUser(req);
    if (user.id === req.params.id) {
      console.error('Cannot follow yourself')
      return res.redirect("back")
    }
    return Followship.findOrCreate({
      where: { 
        followerId: Number(user.id), 
        followingId: Number(req.params.id)
      }})
      .then((data) => { res.redirect("back") })
      .catch(error => res.status(400).json(error))
  },

  deleteFollowing: (req, res) => {
    const user = getTestUser(req);
    return Followship.destroy({
      where: { followerId: user.id, followingId: req.params.id }})
      .then(() => res.redirect("back"))
      .catch((error) => res.status(400).json(error));
  },
  putNotification: (req, res) => {
    const user = getTestUser(req);
    return Followship.findOne({where: {
      followerId: Number(user.id),
      followingId: Number(req.params.userId)}})
      .then(followship => {
      if (!followship) {
        console.error('You cannot get notification for someone you don\'t follow')     
      }else { followship.notification = !notification }
      return res.redirect('back')
    })}
};



module.exports = followshipController;
