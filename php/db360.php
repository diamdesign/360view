<?php
// Include the database configuration file
include 'db_config.php';

// Initialize an array to store error messages
$errors = [];

try {
    // Create Tables if they dont exist already
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NULL,
        email VARCHAR(100) NULL,
        user_password VARCHAR(255) NULL,
        apikey VARCHAR(20) NULL,
        subscriber INT(1) NOT NULL DEFAULT 0,
        registered DATETIME NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS projects (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        embed_id VARCHAR(50) NULL,
        user_id INT(30) NULL,
        project_title VARCHAR(255) NULL,
        map_filename VARCHAR(255) NULL,
        base_url VARCHAR(255) NULL,
        custom_logo VARCHAR(255) NULL,
        custom_css VARCHAR(255) NULL,
        ispublic INT(1) NOT NULL DEFAULT 0,
        registered DATETIME NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS project_list (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        embed_id VARCHAR(50) NULL,
        user_id INT(30) NULL,
        project_id INT(30) NULL,
        location_id INT(30) NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS markers (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        location_id INT(30) NULL,
        marker_title VARCHAR(255) NULL,
        pos_x INT(11) NULL,
        pos_y INT(11) NULL,
        pos_z INT(11) NULL,
        info TEXT NULL,
        link VARCHAR(255) NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS map_links (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        project_id INT(30) NULL,
        link_title VARCHAR(255) NULL,
        pos_top INT(4) NULL,
        pos_left INT(4) NULL,
        link_location_id INT(30) NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS locations (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        embed_id VARCHAR(50) NULL,
        user_id INT(30) NULL,
        location_title VARCHAR(255) NULL,
        file_type VARCHAR(20) NULL,
        file_name VARCHAR(255) NULL,
        base_url VARCHAR(255) NULL,
        duration VARCHAR(50) NULL,
        captions VARCHAR(255) NULL,
        info TEXT NULL,
        custom_logo VARCHAR(255) NULL,
        custom_css TEXT NULL,
        ispublic INT(1) NOT NULL DEFAULT 0
        allowcomments INT(1) NOT NULL DEFAULT 1,
        registered DATETIME NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS likes (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        project_id INT(30) NULL,
        registered DATETIME NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS comments (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        location_id INT(30) NULL,
        reply_id INT(30) NULL,
        comment TEXT
        registered DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS comments_likes (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        comment_id INT(30) NULL,
        registered DATETIME NULL
    )");


    $pdo->exec("CREATE TABLE IF NOT EXISTS captions (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        location_id INT(30) NULL,
        caption_language VARCHAR(255)
    )");

} catch (PDOException $e) {
    // If an error occurs, add the error message to the $errors array
    $errors[] = $e->getMessage();
}

// Send the error messages array as JSON
echo json_encode($errors);
?>