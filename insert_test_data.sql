# Insert test data for Health App

USE health;

# Insert default login user: username = gold, password = smiths
INSERT INTO users (username, first_name, last_name, email, hashedPassword)
VALUES (
    'gold',
    'Gold',
    'Smith',
    'gold@example.com',
    '$2b$10$gUG/33sbTrF6WSVFq7mIYuMOkcGSk9CNzdy1xLpQ.orhATunHTbTu'
);

# Insert sample workouts
INSERT INTO workouts (user_id, workout_type, duration, calories, workout_date)
VALUES
(
    'gold',
    'Running',
    30,
    300,
    '2025-01-01'
),
(
    'gold',
    'Cycling',
    45,
    450,
    '2025-01-03'
);