<?php
// Database configuration
$host = 'localhost'; // Change this to your database host
$dbname = 'diam:360'; // Change this to your database name
$username = 'diam_360'; // Change this to your database username
$password = 'qm4R5fQLyx6NexC5wyE8'; // Change this to your database password

try {
    // Creating a new PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    
    // Set PDO to throw exceptions on error
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Set PDO to return associative arrays by default
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Additional configuration options can be set here if needed
    
} catch (PDOException $e) {
    // If connection fails, handle the exception
    die("Database connection failed: " . $e->getMessage());
}
?>
