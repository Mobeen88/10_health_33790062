//Create a new router
const express = require("express");
const router = express.Router();

//Home page
router.get("/", function (req, res) {
    res.render("index", {
        user: req.session.user || null
    });
});

//About page
router.get("/about", function (req, res) {
    res.render("about");
});

//Search Page
router.get("/search", function (req, res) {
    res.render("search", { results: [] });
});

//Search Post
router.post("/search", function (req, res) {
    let term = "%" + req.sanitize(req.body.term) + "%";

    const sql = `
        SELECT * FROM workouts 
        WHERE workout_name LIKE ?
        ORDER BY workout_date DESC
    `;

    db.query(sql, [term], (err, results) => {
        if (err) throw err;

        res.render("search", { results: results });
    });
});

//List of workouts
router.get("/workouts", function (req, res) {

    const sql = `
        SELECT * FROM workouts
        ORDER BY workout_date DESC
    `;

    db.query(sql, (err, results) => {
        if (err) throw err;

        res.render("workouts", { workouts: results });
    });
});

//Add workouts forms
router.get("/add-workout", function (req, res) {

    //Requires user to be logged in
    if (!req.session.user) {
        return res.redirect("/user/login");
    }

    res.render("add_workout", { message: "" });
});

//Add workout post
router.post("/add-workout", function (req, res) {

    if (!req.session.user) {
        return res.redirect("/user/login");
    }

    let workout_name = req.sanitize(req.body.workout_name);
    let calories = req.sanitize(req.body.calories);

    const sql = `
        INSERT INTO workouts (username, workout_name, calories)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [req.session.user, workout_name, calories], (err) => {
        if (err) {
            console.log(err);
            return res.render("add_workout", {
                message: "Failed to add workout."
            });
        }

        res.render("add_workout", {
            message: "Workout added successfully!"
        });  
    });
});

//Export the router object so index.js can access it
module.exports = router