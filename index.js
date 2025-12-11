//Import libraries
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const mysql = require("mysql2");
require("dotenv").config();
const session = require("express-session");
const expressSanitizer = require("express-sanitizer");

//Create app
const app = express();
const port = 8000;

//Set view engine
app.set("view engine", "ejs");

//Body parser
app.use(express.urlencoded({ extended: true }));

//Sanitizer
app.use(expressSanitizer());

//Static files
app.use(express.static(path.join(__dirname, "public")));

//Sessions
app.use(session({
    secret: "healthappsecret123",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 }
}));

//Makes sure userId is available to all ejs
app.use((req, res, next) => {
    res.locals.userId = req.session.userId || null;
    next();
});

//Define the application-specific data
app.locals.shopData = {shopName: "Health App"}

//Database connection
const db = mysql.createPool({
    host: process.env.HEALTH_HOST,
    user: process.env.HEALTH_USER,
    password: process.env.HEALTH_PASSWORD,
    database: process.env.HEALTH_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;

//Load routes
const mainRoutes = require("./routes/main");
app.use("/", mainRoutes);

const usersRoutes = require("./routes/users");
app.use("/users", usersRoutes);

const workoutRoutes = require("./routes/workout");
app.use("/workout", workoutRoutes);

//Start server
app.listen(port, () => {
    console.log(`Health App running on port ${port}`);
});