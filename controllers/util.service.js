const helpers = require("../_helpers.js")
module.exports = {
  getTestUser: (req) => {
    if (process.env.NODE_ENV === "test") {
      return helpers.getUser(req);
    } else { return req.user }},
    
  getTopUser:(req) => {
    User.findAll({
      attributes: listAttributes,
      include: [{ model: User, as: "Followers", attributes: ["id"] }],
      where: {
        id: { [Op.not]: user.id },
        role: { [Op.not]: "admin" }}})
    .then( rawUsers => { 
      rawUsers.map((data) => ({
        ...data.dataValues,
        FollowerCount: data.Followers.length,
        isFollowed: this.getTestUser(req).Followings.map((d) => d.id).includes(data.id)
      }))
      .sort((a, b) => b.FollowerCount - a.FollowerCount);
      return Users.slice(0, 10);})
  } 
}
