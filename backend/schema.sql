CREATE DATABASE IF NOT EXISTS roomsync;
USE roomsync;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','admin') DEFAULT 'student'
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id INT PRIMARY KEY,
  language VARCHAR(50),
  branch VARCHAR(50),
  cgpa_range VARCHAR(10),
  bed_pref ENUM('upper','lower'),
  expected_members INT,
  sleep_pref VARCHAR(50),
  study_pref VARCHAR(50),
  food_pref VARCHAR(50),
  cleanliness VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rooms (
  room_id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT,
  block VARCHAR(50),
  room_type VARCHAR(50),
  total_capacity INT,
  current_occupancy INT DEFAULT 1,
  use_custom_logic BOOLEAN DEFAULT FALSE,
  additional_requirements TEXT,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS room_requests (
  request_id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT,
  user_id INT,
  status ENUM('applied','accepted','rejected') DEFAULT 'applied',
  UNIQUE(room_id, user_id),
  FOREIGN KEY (room_id) REFERENCES rooms(room_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
