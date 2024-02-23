<?php 

function visitorInfo($pdo) {
    $info = [];
    // Get current user id if user is logged in and session set
    // Check if user_id is set in the session
    if(isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
    } else {
        $user_id = null; // or any default value you want to assign if user_id is not set
    }

    // Get user agent from HTTP headers
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    // Retrieve user information
    $ip_address = $_SERVER['REMOTE_ADDR'];
    $browser = $user_agent;
    $language = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : 'Unknown';

    
    // Insert user information into the database
    try {
        $stmt = $pdo->prepare("INSERT INTO visitors (user_id, ip_address, browser, user_language) 
                            VALUES (:user_id, :ip_address, :browser, :user_language)");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':ip_address', $ip_address);
        $stmt->bindParam(':browser', $browser);
        $stmt->bindParam(':user_language', $language);

        $stmt->execute();
    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
  
}