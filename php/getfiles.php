<?php 
require("db360.php");
require("functions.php");

// Initialize an array to store messages and results
$response = [];

if(isset($_POST['id']) && isset($_POST['type']) || isset($_GET['id']) && isset($_GET['type'])) {


    if(isset($_POST['id'])) {
        $user_id = $_POST['id'];
        $fileType = $_POST['type'];
    } else {
        $user_id = $_GET['id'];
        $fileType = $_GET['type'];
    }


    if($fileType === "image") {
        $stmt = $pdo->prepare("
            SELECT pi.*, i.fullpath
            FROM project_images pi
            LEFT JOIN images i ON pi.image_id = i.id
            WHERE pi.user_id = :user_id
        ");

        // Bind the user_id parameter
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);

        // Execute the query
        $stmt->execute();

        // Fetch all matching rows
        $response = $stmt->fetchAll(PDO::FETCH_ASSOC);



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

