const express = require("express");
const router = express.Router();

//Middleware to ensure user is logged in
function requireLogin(req, res, next) {
    if (!req.session.userId) return res.redirect("/users/login");
    next();
}

//Workout log
router.get("/log", requireLogin, (req, res) => {
    const sql = "SELECT * FROM workouts WHERE user_id=? ORDER BY workout_date DESC";
    global.db.query(sql, [req.session.userId], (err, results) => {
        if(err) throw err;
        res.render("workoutlog", { workouts: results });
    });
});

//Add workout
router.get("/add", requireLogin, (req, res) => {
    res.render("addworkout", { message: null });
});

router.post("/add", requireLogin, (req, res) => {
    const {workout_type, duration, calories, workout_date} = req.body;
    const sql = "INSERT INTO workouts (user_id, workout_type, duration, calories, workout_date) VALUES (?,?,?,?,?)";
    global.db.query(sql, [req.session.userId, workout_type, duration, calories, workout_date], (err) => {
        if(err) throw err;
        res.redirect("/workout/log");
    });
});

//Edit workout
router.get("/edit/:id", requireLogin, (req, res) => {
    const sql = "SELECT * FROM workouts WHERE id=? AND user_id=?";
    global.db.query(sql, [req.params.id, req.session.userId], (err, results) => {
        if(err) throw err;
        if(results.length === 0) return res.redirect("/workout/log");
        res.render("editworkout", {workout: results[0], message: null});
    });
});

router.post("/edit/:id", requireLogin, (req, res) => {
    const { workout_type, duration, calories, workout_date } = req.body;
    const sql = "UPDATE workouts SET workout_type=?, duration=?, calories=?, workout_date=? WHERE id=? AND user_id=?";
    global.db.query(sql, [workout_type, duration, calories, workout_date, req.params.id, req.session.userId], (err) => {
        if(err) throw err;
        res.redirect("/workout/log");
    });
});

//Delete workout
router.get("/delete/:id", requireLogin, (req, res) => {
    const sql = "DELETE FROM workouts WHERE id=? AND user_id=?";
    global.db.query(sql, [req.params.id, req.session.userId], (err) => {
        if(err) throw err;
        res.redirect("/workout/log");
    });
});

//Export the router object so index.js can access it
module.exports = router;