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
  bio TEXT,
  skills VARCHAR(255),
  interests VARCHAR(255),
  academic_details VARCHAR(255),
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

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  sender_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);
