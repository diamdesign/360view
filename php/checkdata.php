<?php 
require("../php/db360.php");
require("../php/functions.php");

// Initialize an array to store messages and results
$response = [];


if(isset($_POST['i'])) {
    // Get the value of the 'i' parameter
    $embed_id = $_POST['i'];



    // Get the first letter of the 'embed_id' parameter and convert it to uppercase
    $first_letter = strtoupper(substr($embed_id, 0, 1));

    // Get current user id if user is logged in and session set
    if(isset($_SESSION['user_id'])) {
        $current_user_id = $_SESSION['user_id'];
    } else {
        $current_user_id = null;
    }

    // Check and insert visitors information into database
    visitorInfo($pdo, $current_user_id);

    // Check if the first letter is 'L or 'P'
    if($first_letter === 'L') {

        try {
            // Prepare a statement to select all rows from the "locations" table where "i" equals the provided "embed_id"
            $statement = $pdo->prepare("SELECT embed_id, ispublic, haspass FROM locations WHERE embed_id = :embed_id");
            // Bind the parameter
            $statement->bindParam(':embed_id', $embed_id, PDO::PARAM_STR);
            // Execute the statement
            $statement->execute();
            // Fetch all rows as associative arrays
            $locations = $statement->fetch(PDO::FETCH_ASSOC);
            // Check if any rows were found
            if($locations) {
                
                $locations['ispublic'] = ($locations['ispublic'] == '1') ? true : false;
                $locations['haspass'] = ($locations['haspass'] == '1') ? true : false;
                // Store retrieved data into the response array
                $response = $locations;

                } else {
                    // If no rows were found, set an appropriate message in the response array
                    $response = ['message' => "No locations found for Embed ID: $embed_id"];
            }
            } catch (PDOException $e) {
                // If an error occurs, add the error message to the response array
                $response = ['error' => $e->getMessage()];
        }
            
    } else {


        try {
            // Prepare a statement to select all rows from the "locations" table where "i" equals the provided "embed_id"
            $statement = $pdo->prepare("SELECT embed_id, ispublic, haspass FROM projects WHERE embed_id = :embed_id");
            // Bind the parameter
            $statement->bindParam(':embed_id', $embed_id, PDO::PARAM_STR);
            // Execute the statement
            $statement->execute();
            // Fetch all rows as associative arrays
            $locations = $statement->fetch(PDO::FETCH_ASSOC);
            // Check if any rows were found
            if($locations) {
                $locations['ispublic'] = ($locations['ispublic'] == '1') ? true : false;
                $locations['haspass'] = ($locations['haspass'] == '1') ? true : false;
                // Store retrieved data into the response array
                $response = $locations;

                } else {
                    // If no rows were found, set an appropriate message in the response array
                    $response = ['message' => "No locations found for Embed ID: $embed_id"];
            }
            } catch (PDOException $e) {
                // If an error occurs, add the error message to the response array
                $response = ['error' => $e->getMessage()];
        }
        
    } 

}  else {
    // If 'i' parameter is not provided in the URL, set an appropriate message in the response array
    $response = ['message' => "No Embed ID specified."];
}

// Convert the response object to JSON
$json_response = json_encode($response);

// Send the response as JSON
header('Content-Type: application/json');
echo $json_response;

