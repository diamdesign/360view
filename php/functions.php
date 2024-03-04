<?php 

// Function to get user info from the users table
function getUserInfo($pdo, $user_id) {
    // Check if user_id is null or empty
    if ($user_id === null) {
        // Return null or any appropriate value indicating that user_id is not provided
        return null;
    }
    // Prepare the SQL statement
    $statement = $pdo->prepare("SELECT id, username, email, thumbnail, coverimage, subscriber, registered FROM users WHERE id = :user_id");
    // Bind the parameter
    $statement->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    // Execute the statement
    $statement->execute();
    // Fetch the result as an associative array
    $userArray = $statement->fetch(PDO::FETCH_ASSOC);
    // Return the user information
    return $userArray;
}

// Function to insert visitor information to database
function visitorInfo($pdo, $user_id) {

    $current_url_system = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $current_url = $_SERVER['HTTP_REFERER'];
    // Get user agent from HTTP headers
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    // Retrieve user information
    $ip_address = $_SERVER['REMOTE_ADDR'];
    $browser = $user_agent;
    $language = isset($_SERVER['HTTP_ACCEPT_LANGUAGE']) ? $_SERVER['HTTP_ACCEPT_LANGUAGE'] : 'Unknown';
    
    // Insert user information into the database
    try {
        $stmt = $pdo->prepare("INSERT INTO visitors (user_id, ip_address, browser, user_language, current_url, current_url_system) 
                            VALUES (:user_id, :ip_address, :browser, :user_language, :current_url, :current_url_system)");
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':ip_address', $ip_address);
        $stmt->bindParam(':browser', $browser);
        $stmt->bindParam(':user_language', $language);
        $stmt->bindParam(':current_url', $current_url);
        $stmt->bindParam(':current_url_system', $current_url_system);

        $stmt->execute();
    } catch(PDOException $e) {
       $response = ['error' => $e->getMessage()];
    }
  
}