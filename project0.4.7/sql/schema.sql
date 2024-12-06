-- 组别表
CREATE TABLE `groups` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户表
CREATE TABLE `users` (
    `id` VARCHAR(36) PRIMARY KEY,
    `username` VARCHAR(50) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'teacher', 'student') NOT NULL DEFAULT 'student',
    `name` VARCHAR(100),
    `email` VARCHAR(255),
    `group_id` VARCHAR(36),
    `avatar` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `last_login` TIMESTAMP,
    FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL
);

-- 项目表
CREATE TABLE `projects` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `git_repo` VARCHAR(255),
    `group_id` VARCHAR(36),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL
);

-- 资源表
CREATE TABLE `resources` (
    `id` VARCHAR(36) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `type` ENUM('link', 'file') NOT NULL,
    `url` TEXT NOT NULL,
    `file_data` LONGTEXT,
    `description` TEXT,
    `group_id` VARCHAR(36),
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `uploaded_by` VARCHAR(36),
    FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- 展示表
CREATE TABLE `presentations` (
    `id` VARCHAR(36) PRIMARY KEY,
    `project_id` VARCHAR(36) NOT NULL,
    `description` TEXT,
    `start_time` DATETIME NOT NULL,
    `end_time` DATETIME NOT NULL,
    `status` ENUM('upcoming', 'ongoing', 'completed') NOT NULL DEFAULT 'upcoming',
    `group_id` VARCHAR(36),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`) ON DELETE SET NULL
);

-- 活动日志表
CREATE TABLE `activities` (
    `id` VARCHAR(36) PRIMARY KEY,
    `type` ENUM('student', 'project', 'resource', 'account') NOT NULL,
    `action` ENUM('create', 'update', 'delete') NOT NULL,
    `target_id` VARCHAR(36) NOT NULL,
    `target_name` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(36),
    `path` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);