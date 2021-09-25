const helpers = require("../_helpers.js")
const db = require("../models")
const { User } = db;
const { Op } = require("sequelize");
const moment = require("moment");
const listAttributes = ["id", "name", "account", "avatar"];

getTestUser = (req) => {
  if (process.env.NODE_ENV === "test") {
    return helpers.getUser(req);
  } else { return req.user }},

getTopUser = (req, variant) => {
  User.findAll({
    attributes: listAttributes,
    include: [{ model: User, as: "Followers", attributes: ["id"] }],
    where: {
      id: { [Op.not]: getTestUser(req).id },
      role: { [Op.not]: "admin" }}})
  .then( rawUsers => { 
    const rankedUsers = rawUsers.map((data) => ({
      ...data.dataValues,
      FollowerCount: data.Followers.length,
      isFollowed: getTestUser(req).Followings.map((d) => d.id).includes(data.id)
    })).sort((a, b) => b.FollowerCount - a.FollowerCount);
    
    return variant = rankedUsers.slice(0, 10);})
} 



module.exports = { getTestUser, getTopUser }
