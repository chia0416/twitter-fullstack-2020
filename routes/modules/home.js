// This modules is for index view page
const express = require("express");
const userController = require("../../controllers/userController");
const adminController = require("../../controllers/adminController")
const router = express.Router();
const db = require("../../models");
const { User, Tweet, Reply } = db;
const passport = require('passport')



router.get("/", (req, res) => {
  res.redirect('/signin')
})
router.get("/signup", userController.signupPage);
router.post("/signup", userController.signup);

router.get("/signin", userController.signInPage);
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/tweets',
  failureRedirect: '/signin'
}))

router.get("/admin/signin", adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', {
  successRedirect: '/admin/tweets',
  failureRedirect: '/admin/signin'
}), adminController.signIn);


module.exports = router;
