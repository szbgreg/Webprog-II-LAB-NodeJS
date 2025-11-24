var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
const flash = require("connect-flash");

require("dotenv").config();

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const expressLayouts = require("express-ejs-layouts");

var indexRouter = require("./routes/index");
var databaseRouter = require("./routes/database");
var usersRouter = require("./routes/users");
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var adminRouter = require("./routes/admin");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts");

app.use(
  session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: new MySQLStore({
      host: "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.isAuth = !!req.session.user;
  res.locals.isAdmin = req.session.user && req.session.user.isAdmin === 1;
  res.locals.userName = req.session.user ? req.session.user.username : '';
  res.locals.currentPath = req.path;
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/database", databaseRouter);
app.use("/users", usersRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/admin", adminRouter);
app.get("/logout", function (req, res, next) {
  req.session.destroy(function (err) {
    res.clearCookie(process.env.SESSION_KEY);
    res.redirect("/");
  });
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
