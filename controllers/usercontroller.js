const passport = require("passport");
const bcrypt = require("bcryptjs");
const db = require("../models");
const { Op } = require("sequelize");
const { User } = db;
const { getTestUser } = require("../services/generalService");

const userController = {
  signInPage: (req, res) => {
    return res.render("signin");
  },
  signupPage: (req, res) => {
    return res.render("signup");
  },
  signup: (req, res) => {
    const { name, email, account, password, confirmPassword } = req.body;
    const errors = [];
    if (!name || !email || !account || !password || !confirmPassword) {
      errors.push({ message: "所有欄位都是必填。" });
    }
    if (confirmPassword !== password) {
      errors.push({ message: "兩次密碼輸入不同！" });
    }
    if (errors.length) {
      return res.render("signup", {
        errors,
        name,
        email,
        account
      });
    }
    User.findOne({
      where: {
        [Op.or]: [{ email }, { account }]
      }
    }).then((user) => {
      if (user) {
        console.log(email);
        if (user.email === email) {
          errors.push({ message: "此信箱已被註冊！" });
          return res.render("signup", {
            errors,
            name,
            email,
            account
          });
        }
        if (user.account === account) {
          console.log(account);
          errors.push({ message: "此帳號已被使用！" });
          return res.render("signup", {
            errors,
            name,
            email,
            account
          });
        }
      } else {
        User.create({
          name: name,
          account: account,
          role: "user",
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        }).then((user) => {
          req.flash("success_messages", "成功註冊帳號！");
          return res.redirect("/signin");
        });
      }
    });
  },

  signOut: (req, res) => {
    req.flash("success_messages", "登出成功！");
    req.logout();
    res.redirect("/signin");
  },
  getUserSetting: (req, res) => {
    const user = getTestUser(req);
    return res.render("setting", { profile: user });
  },
  editUserSetting: (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
      req.flash("error_messages", "兩次密碼不同");
      return res.redirect("back");
    } else {
      User.findOne({ where: { email: req.body.email } }).then((userEmail) => {
        if (userEmail) {
          req.flash("error_messages", "此信箱已被使用");
          res.redirect("/tweets");
        } else {
          User.findByPk(req.params.id).then((user) => {
            user
              .update({
                name: req.body.name,
                account: req.body.account,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              })
              .then((user) => {
                req.flash("success_messages", "成功更新個人資料");
                res.redirect('back');
              });
          });
        }
      });
    }
  }
};

module.exports = userController;

