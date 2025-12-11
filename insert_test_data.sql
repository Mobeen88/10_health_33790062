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
INSERT INTO workouts (user_id, workout_date, type, duration_minutes, calories, notes)
VALUES
(
    (SELECT id FROM users WHERE username = 'gold'),
    '2025-01-01',
    'Running',
    30,
    300,
    'Morning run'
),
(
    (SELECT id FROM users WHERE username = 'gold'),
    '2025-01-03',
    'Cycling',
    45,
    450,
    'Spin class'
);
