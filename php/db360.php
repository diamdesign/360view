<?php
// Include the database configuration file
include ("db360_config.php");

// Start the session if it hasn't been started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Initialize an array to store error messages
$errors = [];

try {
    // Create Tables if they dont exist already
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NULL,
        email VARCHAR(100) NULL,
        thumbnail VARCHAR(255) NULL,
        coverimage VARCHAR(255) NULL,
        user_password VARCHAR(255) NULL,
        apikey VARCHAR(20) NULL,
        subscriber TINYINT(1) NOT NULL DEFAULT 0,
        registered DATETIME NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS projects (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        embed_id VARCHAR(50) NULL,
        user_id INT(30) NULL,
        project_title VARCHAR(255) NULL,
        project_description TEXT NULL,
        map_filename VARCHAR(255) NULL,
        base_url VARCHAR(255) NULL,
        custom_logo VARCHAR(255) NULL,
        logo_link VARCHAR(255) NULL,
        custom_css VARCHAR(255) NULL,
        ispublic TINYINT(1) NOT NULL DEFAULT 1,
        hasmusic TINYINT(1) NOT NULL DEFAULT 0,
        haspass TINYINT(1) NOT NULL DEFAULT 0,
        hasinventory TINYINT(1) NOT NULL DEFAULT 0,
        showlocations TINYINT(1) NOT NULL DEFAULT 1,
        project_password VARCHAR(255) NULL,
        overide_location_password TINYINT(1) NOT NULL DEFAULT 0,
        registered DATETIME NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS project_list (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        embed_id VARCHAR(50) NULL,
        user_id INT(30) NULL,
        project_id INT(30) NULL,
        location_id INT(30) NULL,
        order_index INT(2) NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS markers (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        location_id INT(30) NULL,
        marker_title VARCHAR(255) NULL,
        pos_x INT(11) NULL,
        pos_y INT(11) NULL,
        pos_z INT(11) NULL,
        info TEXT NULL,
        link VARCHAR(255) NULL,
        user_id INT(30) NULL,
        customcss TEXT NULL,
        sound VARCHAR(255) NULL,
        autoplay TINYINT(1) NOT NULL DEFAULT 0
    )");


    $pdo->exec("CREATE TABLE IF NOT EXISTS map_links (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        project_id INT(30) NULL,
        link_title VARCHAR(255) NULL,
        pos_top INT(4) NULL,
        pos_left INT(4) NULL,
        link_location_id INT(30) NULL,
        link_order_index INT(30) NULL,
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS locations (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        embed_id VARCHAR(50) NULL,
        user_id INT(30) NULL,
        location_title VARCHAR(255) NULL,
        location_description VARCHAR(255) NULL,
        file_type VARCHAR(20) NULL,
        file_name VARCHAR(255) NULL,
        base_url VARCHAR(255) NULL,
        duration VARCHAR(50) NULL,
        captions VARCHAR(255) NULL,
        info TEXT NULL,
        custom_logo VARCHAR(255) NULL,
        logo_link VARCHAR(255) NULL,
        custom_css TEXT NULL,
        ispublic TINYINT(1) NOT NULL DEFAULT 1,
        allowcomments TINYINT(1) NOT NULL DEFAULT 1,
        hasmusic TINYINT(1) NOT NULL DEFAULT 0,
        haspass TINYINT(1) NOT NULL DEFAULT 0,
        hasinventory TINYINT(1) NOT NULL DEFAULT 0,
        location_password VARCHAR(255) NULL,
        registered DATETIME NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS likes (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        location_id INT(30) NULL,
        project_id INT(30) NULL,
        registered DATETIME NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS comments (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        location_id INT(30) NULL,
        parent_id INT(30) NULL,
        reply_id INT(30) NULL,
        comment TEXT,
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

    $pdo->exec("CREATE TABLE IF NOT EXISTS music (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        project_id INT(30) NULL,
        location_id INT(30) NULL,
        file_name VARCHAR(255) NULL,
        base_url VARCHAR(255) NULL,
        duration VARCHAR(20) NULL,
        artist VARCHAR(255) NULL,
        album VARCHAR(255) NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS inventory (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        location_id INT(30) NULL,
        project_id INT(30) NULL,
        inventory_name VARCHAR(255) NULL,
        inventory_description VARCHAR(255) NULL,
        inventory_image VARCHAR(255) NULL,
        usewith_id INT(30) NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS user_inventory (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        location_id INT(30) NULL,
        project_id INT(30) NULL,
        inventory_id INT(30) NULL
    )");

    
    $pdo->exec("CREATE TABLE IF NOT EXISTS customcss (
        id INT(30) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        customname VARCHAR(255) NULL,
        maplink TINYINT(1) DEFAULT 0,
        marker TINYINT(1) DEFAULT 0,
        markerinfo TINYINT(1) DEFAULT 0,
        customcss TEXT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS views (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        location_id INT(30) NULL,
        project_id INT(30) NULL,
        visitor_ipadress VARCHAR(255) NULL,
        visited TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");


    $pdo->exec("CREATE TABLE IF NOT EXISTS visitors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT(30) NULL,
        ip_address VARCHAR(45) NULL,
        browser VARCHAR(255) NULL,
        resolution VARCHAR(20) NULL,
        user_language VARCHAR(50) NULL,
        operating_system VARCHAR(50) NULL,
        device_type ENUM('Mobile', 'Desktop', 'Tablet', 'Other') NULL,
        current_url VARCHAR(255) NULL,
        current_url_system VARCHAR(255) NULL,
        visited TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");



} catch (PDOException $e) {
    // If an error occurs, add the error message to the $errors array
    $errors[] = $e->getMessage();
}

?>