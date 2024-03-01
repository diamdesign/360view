<?php 

// Function to get user info from the users table
function getUserInfo($pdo, $user_id) {
    // Check if user_id is null or empty
    if (empty($user_id)) {
        // Return null or any appropriate value indicating that user_id is not provided
        return null;
    }
    // Prepare the SQL statement
    $statement = $pdo->prepare("SELECT id, username, email, subscriber, registered FROM users WHERE id = :user_id");
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
       $response = ['error' => $e->getMessage()];
    }
  
}