CREATE DATABASE resume_builder;
USE resume_builder;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personal Information
CREATE TABLE personal_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    summary TEXT,
    photo_url VARCHAR(255)
);

-- Social Links
CREATE TABLE social_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    platform VARCHAR(50),
    username VARCHAR(100),
    url VARCHAR(255)
);

-- Experience
CREATE TABLE experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company VARCHAR(100),
    position VARCHAR(100),
    duration VARCHAR(50),
    description TEXT
);

-- Education
CREATE TABLE education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    institution VARCHAR(100),
    degree VARCHAR(100),
    field_of_study VARCHAR(100),
    cgpa VARCHAR(20),
    year VARCHAR(20)
);

-- Projects
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100),
    description TEXT,
    technologies VARCHAR(255),
    project_url VARCHAR(255),
    duration VARCHAR(50)
);

-- Publications
CREATE TABLE publications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    authors TEXT,
    venue VARCHAR(255),
    year VARCHAR(20)
);

-- Achievements
CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    year VARCHAR(20)
);

-- Skills
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skills_list TEXT
);