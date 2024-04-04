<?php 
require("db360.php");
require("functions.php");

// Initialize an array to store messages and results
$response = [];
if(isset($_POST['id']) && isset($_POST['userid']) && isset($_POST['type']) || isset($_GET['id']) && isset($_GET['userid']) && isset($_GET['type'])) {


    if(isset($_POST['id'])) {
        $image_id = intval($_POST['id']);
        $fileType = $_POST['type'];
        $user_id = intval($_POST['userid']);
    } else {
        $image_id = intval($_GET['id']);
        $fileType = $_GET['type'];
        $user_id = intval($_GET['userid']);
    }

    if($fileType === "image") {
        try {

            $getpath = $pdo->prepare("SELECT fullpath FROM images WHERE id = :image_id AND user_id = :user_id");
            $getpath->bindParam(':image_id', $image_id, PDO::PARAM_INT);
            $getpath->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $getpath->execute();

            $fullpath = $getpath->fetch(PDO::FETCH_ASSOC);

            // Delete from the project_images table
            $projectImageStatement = $pdo->prepare("DELETE FROM project_images WHERE image_id = :image_id AND user_id = :user_id");
            $projectImageStatement->bindParam(':image_id', $image_id, PDO::PARAM_INT);
            $projectImageStatement->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $projectImageStatement->execute();

            // Delete from the images table
            $imageStatement = $pdo->prepare("DELETE FROM images WHERE id = :image_id AND user_id = :user_id");
            $imageStatement->bindParam(':image_id', $image_id, PDO::PARAM_INT);
            $imageStatement->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $imageStatement->execute();

            // Check if fullpath exists
            if (!empty($fullpath['fullpath'])) {
                // Get the full path of the file
                $filePath = $fullpath['fullpath'];
                
                // Delete the file
                if (unlink($filePath)) {
                    $response = ['success' => 'Records deleted successfully'];
                } else {
                    $response = ['message' => "Failed to remove file."];
                }
            } else {
               $response = ['message' => "Path not found."];
            }
        } catch (PDOException $e) {
            $response = ['error' => $e->getMessage()];
        }
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

