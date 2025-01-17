if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const session = require("express-session");
const db = require("./models");
const methodOverride = require("method-override");

const usePassport = require("./config/passport");
const routes = require("./routes");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
const handlebars = require("express-handlebars");
const helpers = require("./_helpers");
const app = express();


port = process.env.PORT;
host = process.env.BASE_URL;
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.engine(
  ".hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: require("./config/handlebars-helpers"),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("view engine", ".hbs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));
const flash = require("connect-flash");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/upload", express.static(__dirname + "/upload"));
usePassport(app);
app.use(flash());
app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req);
  next();
});
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.errors = req.flash("errors")
  res.locals.tweet_message = req.flash("tweet_message")
  res.locals.tweet_success = req.flash("tweet_success")
  res.locals.user = helpers.getUser(req);
  next();
});

app.use(routes);
app.listen(port, () =>
  console.log(`simple-twitter app listening at ${host}:${port}`)
);

module.exports = app;
