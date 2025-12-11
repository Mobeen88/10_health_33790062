# Health App
- A simple Health & Fitness tracking application built using Node.js, Express, MySQL, and EJS. This app allows users to log workouts, search workouts, and check weather conditions for outdoor exercise suitability.

## Features
Routes:
- `/` - Home Page
- `/about` - About Page
- `/workout/log` - Workout Log Page
- `/workout/add` - Add Workout Page
- `/workout/search` - Search Workouts Page
- `/users/register` - Register Page
- `/users/login` - Login Page
- `/users/audit` - Audit Log Page
- `/weather` - Weather Page

## dotenv Implementation
To secure database credentials by implementing the dotenv module:

1. Installed dotenv: `npm install dotenv`
2. Created a `.env` file using the professor's recommended format:
    - HEALTH_HOST='localhost'
    - HEALTH_USER='health_app'
    - HEALTH_PASSWORD='qwertyuiop'
    - HEALTH_DATABASE='health'
    - HEALTH_BASE_PATH='http://localhost:8000'
    - WEATHER_API_KEY='YOUR_OPENWEATHERMAP_API_KEY'
3. Updated the database configuration to use `process.env.BB_USER`, `process.env.BB_PASSWORD`, and `process.env.BB_DATABASE`
4. Added `.env` to `.gitignore` to prevent accidental exposure
5. Used 'localhost' as the host since it wasn't specified in the environment variables

## Data Validation
- Server-side validation using express-validator ensures data integrity.

 ## Applied To: ##
 - User Registration
 - Email: must be valid
 - Username: 5–20 characters
 - Password: minimum 8 characters, includes uppercase, lowercase, number, and special character
 - First & Last name: must not be empty
 - Add Workout
 - Workout type: not empty
 - Duration and Calories: numeric and positive
 - Date: valid format
 - Not Applied To:
 - Login: database check acts as validation
 - Search forms: flexible input allowed

## Input Sanitization (XSS Prevention)
Using express-sanitizer to prevent malicious input:
- Registration fields
- Workout form fields
- Search input

## Test Users and Password Policy
- Added default user: gold / smiths for grading.
- Password validation allows strong passwords, e.g., aaAA123!.
- Ensures consistency across environments.

## Audit Log
Implemented a comprehensive audit logging system to track login attempts:

 ## Features: ##
 - Records all login attempts, successful or failed.
 - Captures username, timestamp, success status, IP address, and user agent.
 - Provides a complete history of authentication events.

 ## Implementation: ##
 - Database Table audit_log with columns:
 - username, attempt_time, success, ip_address, user_agent
 - Logging Function: logLoginAttempt() automatically records each login attempt.
 - Audit Route: Displays all attempts in descending order with 1 and 0 as success or fail.

## Weather

- `/weather` route fetches current weather for a city using OpenWeatherMap API.

## Displays: ##
- Temperature
- Humidity
- Wind speed
- Running suitability: simple “Yes/No” based on conditions (e.g., no rain, temp 10–30°C, wind < 10 m/s)

- Error handling: invalid city or API failure shows clear error.

## Installation
To install and run:
- `npm install`
- `node index.js`
