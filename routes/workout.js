const express = require("express");
const router = express.Router();

//Middleware to ensure user is logged in
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        req.session.redirectTo = req.originalUrl;
        return res.redirect("./login");
    }
    next();
}

//Workout log
router.get("/log", requireLogin, (req, res) => {
    const sql = "SELECT * FROM workouts WHERE user_id=? ORDER BY workout_date DESC";
    global.db.query(sql, [req.session.userId], (err, results) => {
        if(err) throw err;
        res.render("workoutlog", {workouts: results});
    });
});

//Add workout
router.get("/add", requireLogin, (req, res) => {
    res.render("addworkout", {message: null});
});

router.post("/add", requireLogin, (req, res) => {
    const { workout_type, duration, calories, workout_date } = req.body;
    const dateObj = new Date(workout_date);
    const year = dateObj.getFullYear();
    if (isNaN(dateObj.getTime()) || year < 1900 || year > 2100) {
        return res.render("addworkout", { message: "Invalid date format." });
    }

    const sql = "INSERT INTO workouts (user_id, workout_type, duration, calories, workout_date) VALUES (?,?,?,?,?)";
    global.db.query(sql, [req.session.userId, workout_type, duration, calories, workout_date], (err) => {
        if(err) throw err;
        res.redirect("./log");
    });
});

//Edit workout
router.get("/edit/:id", requireLogin, (req, res) => {
    const sql = "SELECT * FROM workouts WHERE id=? AND user_id=?";
    global.db.query(sql, [req.params.id, req.session.userId], (err, results) => {
        if(err) throw err;
        if(results.length == 0) return res.redirect("./log");
        res.render("editworkout", { workout: results[0], message: null });
    });
});

router.post("/edit/:id", requireLogin, (req, res) => {
    const {workout_type, duration, calories, workout_date} = req.body;
    const sql = "UPDATE workouts SET workout_type=?, duration=?, calories=?, workout_date=? WHERE id=? AND user_id=?";
    global.db.query(sql, [workout_type, duration, calories, workout_date, req.params.id, req.session.userId], (err) => {
        if(err) throw err;
        res.redirect("./log");
    });
});

//Delete workout
router.get("/delete/:id", requireLogin, (req, res) => {
    const sql = "DELETE FROM workouts WHERE id=? AND user_id=?";
    global.db.query(sql, [req.params.id, req.session.userId], (err) => {
        if(err) throw err;
        res.redirect("./log");
    });
});

//Search workouts
router.get("/search", requireLogin, (req, res) => {
    res.render("searchworkout", { workouts: null });
});

router.post("/search", requireLogin, (req, res) => {
    const{workout_type, min_cal, max_cal} = req.body;

    let sql = "SELECT * FROM workouts WHERE user_id = ?";
    const params = [req.session.userId];

    if(workout_type){
        sql += " AND workout_type LIKE ?";
        params.push(`%${workout_type}%`);
    }
    if(min_cal){
        sql += " AND calories >= ?";
        params.push(min_cal);
    }
    if(max_cal){
        sql += " AND calories <= ?";
        params.push(max_cal);
    }

    global.db.query(sql, params, (err, results) => {
        if (err) throw err;
        res.render("searchworkout", {workouts: results});
    });
});

//Export the router object so index.js can access it
module.exports = router;
