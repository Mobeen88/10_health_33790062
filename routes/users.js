const express = require("express")
const router = express.Router()

const bcrypt = require("bcrypt")
const saltRounds = 10

const {check, validationResult} = require('express-validator')

//Middleware: redirect to login if not logged in
const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
         req.session.redirectTo = req.originalUrl
         return res.redirect('/users/login')
    } 
    next();
};

//Register
router.get('/register', (req, res) => {
    res.render('register', {
        errors: [], old: { first: "", last: "", email: "", username: ""}, message: ""}
    );
});

router.post('/registered', 
    [
        check('email').isEmail().withMessage("Enter a valid email"), 
        check('username').isLength({min: 5, max: 20}).withMessage("Username must be 5-20 characters"),
        check('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/).withMessage("Password must be at least 8 characters long and include at least one uppercase, one lowercase, one number, and one special character"),
        check('first').notEmpty().withMessage('First name required'),
        check('last').notEmpty().withMessage('Last name required')
    ], 
    (req, res, next) => {

    //Sanitize inputs
    req.body.first = req.sanitize(req.body.first);
    req.body.last = req.sanitize(req.body.last);
    req.body.email = req.sanitize(req.body.email);
    req.body.username = req.sanitize(req.body.username);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', {
            errors: errors.array(),
            old:{
                first: req.body.first,
                last: req.body.last,
                email: req.body.email,
                username: req.body.username
            },
            message: ""
        });
    }

    const plainPassword = req.body.password;

    //Check if username exists
    const checkSql = "SELECT * FROM users WHERE username = ?";
    db.query(checkSql, [req.body.username], (err, result) => {
        if(err) return next(err);

        if(result.length > 0) {
            return res.render('register',{
                errors:[{ msg: "Username already exists" }],
                old:{
                    first: req.body.first,
                    last: req.body.last,
                    email: req.body.email,
                    username: req.body.username
                },
                message: ""
            });
        }

        //Hash password and insert
        bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
            if(err) return next(err);

            const sqlInsert = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
            const newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];

            db.query(sqlInsert, newrecord, (err, result) => {
                if(err) return next(err);

                //Redirects to login page after successful registration
                res.redirect('/users/login');
            });
        });
    });
});

//List of users
router.get("/list", redirectLogin, (req, res, next) => {
    const sqlquery = "SELECT id, username, first_name, last_name, email, created_at FROM users";
    db.query(sqlquery, (err, result) => {
        if(err) return next(err);
        res.render("listusers", {message: "", users: result});
    });
});

//Login
router.get("/login", (req, res) => {
    res.render("login", {errors: [], message: ""}); 
});

router.post("/loggedin", (req, res, next) => {
    const { username, password } = req.body;

    const sqlquery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, result) => {
        if(err) return next(err);

        if(result.length == 0) {
            logLoginAttempt(username, false, req);
            return res.render('login', { errors: [], message: "Username not found" });
        }

        const user = result[0];
        bcrypt.compare(password, user.hashedPassword, (err, match) => {
            if(err) {
                logLoginAttempt(username, false, req);
                return next(err);
            }

            if(match) {
                req.session.userId = username;
                logLoginAttempt(username, true, req);
                
                const redirectTo = req.session.redirectTo || '/users/list';
                delete req.session.redirectTo;
                return res.redirect(redirectTo);
            }else {
                logLoginAttempt(username, false, req);
                return res.render('login', { errors: [], message: "Incorrect password"});
            }
        });
    });
});

//Logout
router.get("/logout", redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if(err) return res.redirect('/users/list');
        res.clearCookie('connect.sid');
        res.redirect('/users/login');
    });
});

//Audit Log
function logLoginAttempt(username, success, req){
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent") || "Unknown";
    
    const sqlquery = "INSERT INTO audit_log (username, success, ip_address, user_agent) VALUES (?, ?, ?, ?)";
    const newrecord = [username, success, ipAddress, userAgent];
    
    db.query(sqlquery, newrecord, (err) => {
        if(err) console.error('Failed to log login attempt:', err);
    });
};

router.get("/audit", redirectLogin, (req, res, next) => {
    const sqlquery = "SELECT username, attempt_time, success, ip_address, user_agent FROM audit_log ORDER BY attempt_time DESC";
    db.query(sqlquery, (err, result) => {
        if(err) return next(err);
        res.render("audit", { auditLogs: result });
    });
});

//Export the router object so index.js can access it
module.exports = router;