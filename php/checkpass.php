<?php 
include("db360.php");

if(isset($_POST['i'])) {

    // Get the value of the 'i' parameter
    $embed_id = $_POST['i'];
    $userPassword = "";

    if(isset($_POST['pass'])) {
        trim($userPassword  = $_POST['pass']);
    }
    
    // Get the first letter of the 'embed_id' parameter and convert it to uppercase
    $first_letter = strtoupper(substr($embed_id, 0, 1));

     if($first_letter === 'L') {

         try {
            // Prepare a statement to select all rows from the "locations" table where "i" equals the provided "embed_id"
            $statement = $pdo->prepare("SELECT location_password FROM locations WHERE embed_id = :embed_id");
            $statement->bindParam(':embed_id', $embed_id, PDO::PARAM_STR);
            $statement->execute();
            $password = $statement->fetch(PDO::FETCH_ASSOC);

            if($password) {
                // Store retrieved data into the response array
                $storedHashedPassword = trim($password['location_password']);
    
                $result = password_verify($userPassword, $storedHashedPassword);
                // Compare the generated hash with the stored hash
                if ($result) {
                    // Passwords match, user is authenticated
                    $response = ['success' => "Password correct."];
                } else {
                    $response = ['error' => "Password missmatch."];
                }

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
      
            $statement = $pdo->prepare("SELECT project_password FROM projects WHERE embed_id = :embed_id");
            $statement->bindParam(':embed_id', $embed_id, PDO::PARAM_STR);
            $statement->execute();
            $password = $statement->fetch(PDO::FETCH_ASSOC);

            if($password) {
                // Store retrieved data into the response array
                $storedHashedPassword = trim($password['project_password']);
                
                $result = password_verify($userPassword, $storedHashedPassword);

                // Compare the generated hash with the stored hash
                if ($result) {
                    // Passwords match, user is authenticated
                    $response = ['success' => "Password correct."];
                } else {
                    // Passwords don't match
            
                    $response = ['error' => "Password missmatch."];
                }

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
