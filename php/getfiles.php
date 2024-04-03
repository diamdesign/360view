<?php 
require("db360.php");
require("functions.php");

// Initialize an array to store messages and results
$response = [];

if(isset($_POST['id']) && isset($_POST['type'])) {


    $user_id = $_POST['id'];
    $fileType = $_POST['type'];

    if($fileType === "image") {

    } elseif($fileType === "video") {
        
    } elseif($fileType ==="sound") {

    }

}  else {
    // If 'i' parameter is not provided in the URL, set an appropriate message in the response array
    $response = ['message' => "No Data specified."];
}

// Convert the response object to JSON
$json_response = json_encode($response);

// Send the response as JSON
header('Content-Type: application/json');
echo $json_response;


