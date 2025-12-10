# Create database script for Health App

# Create the database
CREATE DATABASE IF NOT EXISTS health;
USE health;

# Create user table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(255),
    hashedPassword VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    workout_name VARCHAR(100) NOT NULL,
    calories INT NOT NULL,
    workout_date DATE DEFAULT CURRENT_DATE
);

# Audit log table (optional but in your example)
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    success BOOLEAN,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
# Create the application user
CREATE USER IF NOT EXISTS 'health_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON health.* TO 'health_app'@'localhost';
*/