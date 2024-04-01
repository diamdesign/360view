<?php 

require("db360.php");

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST)) {
    // Retrieve the JSON data from the POST request
    $jsonData = file_get_contents("php://input");

    // Decode the JSON data into a PHP associative array
    $data = json_decode($jsonData, true);

    if ($data !== null) {
        // Extract id, type, and html properties from the JSON data
        $id = $data["id"];
        $type = $data["type"];
        $html = $data["html"];

        /*
        if(isset($_SESSION['user_id'])) {
            $user_id = $_SESSION['user_id'];
        } else {
             $response = ['error' => "User not logged in."];
            exit;
        }*/


        if($type === "info") {
            try {
                // Update locations table
                $stmt = $pdo->prepare("UPDATE locations SET info = :html WHERE id = :id");
                $stmt->bindParam(":html", $html);
                $stmt->bindParam(":id", $id);
    

                // Check if the update was successful
                if ($stmt->execute()) {
                    // Update successful
                    $response = ['success' => true];
                } else {
                
                    $response = ['error' => "Did not execute"];
                }
            } catch (PDOException $e) {
                // Error occurred during database operation
                // Handle the error, log it, or send an error response back to the client
                $response = ['error' => $e->getMessage()];
            }
        } elseif($type === "marker") {
            try {
                // Update locations table
                $stmt = $pdo->prepare("UPDATE markers SET info = :html WHERE id = :id");
                $stmt->bindParam(":html", $html);
                $stmt->bindParam(":id", $id);
     

                // Check if the update was successful
                if ($stmt->execute()) {
                    // Update successful
                    $response = ['success' => true];
                } else {
                  
                    $response = ['error' => "Did not execute"];
                }
            } catch (PDOException $e) {
                // Error occurred during database operation
                // Handle the error, log it, or send an error response back to the client
                $response = ['error' => $e->getMessage()];
            }
        }

    } else {
        $response = ['error' => "Invalid JSON data"];
    }
} else {
    $response = ['error' => "No POST data sent"];

}

// Convert the response object to JSON
$json_response = json_encode($response);

// Send the response as JSON
header('Content-Type: application/json');
echo $json_response;
