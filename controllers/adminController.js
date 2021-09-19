const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
  getPosts: (req, res) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      const data = tweets.map(t => ({
        ...t.dataValues,
        description: t.description.substring(0, 50),
      }))
      return res.json(data)
    })
  },
  deletePost: (req, res) => {
    return Tweet.findByPk(req.params.id).then((tweet) => {
      tweet.destroy().then(() => {
        return res.json({ status: 'success', tweet })
      })
    })
  },
  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then(users => {
      return res.json(users)
    })
  }
}

module.exports = adminController