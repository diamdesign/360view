<?php 
require("db360.php");
require("functions.php");

// Initialize an array to store messages and results
$response = [];

// Check if JSON data is received
$jsonData = file_get_contents('php://input');

// Decode JSON data into an associative array
$requestData = json_decode($jsonData, true);

// Check if the required parameters are present
if(isset($requestData['id']) && isset($requestData['userid']) && isset($requestData['type'])) {
    $images_id = intval($requestData['id']);
    $fileType = $requestData['type'];
    $user_id = intval($requestData['userid']);

    $fullpath = [];

    if($fileType === "image") {
        try {
            // Fetch the full path of the image
            $getpath = $pdo->prepare("SELECT fullpath FROM images WHERE id = :images_id AND user_id = :user_id");
            $getpath->bindParam(':images_id', $images_id, PDO::PARAM_INT);
            $getpath->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $getpath->execute();

            $fullpath = $getpath->fetch(PDO::FETCH_ASSOC);

            // Delete from the project_images table
            $projectImageStatement = $pdo->prepare("DELETE FROM project_images WHERE images_id = :images_id AND user_id = :user_id");
            $projectImageStatement->bindParam(':images_id', $images_id, PDO::PARAM_INT);
            $projectImageStatement->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $projectImageStatement->execute();

            // Delete from the images table
            $imageStatement = $pdo->prepare("DELETE FROM images WHERE id = :images_id AND user_id = :user_id");
            $imageStatement->bindParam(':images_id', $images_id, PDO::PARAM_INT);
            $imageStatement->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $imageStatement->execute();

            // Check if fullpath exists
            if (!empty($fullpath['fullpath'])) {
                // Get the full path of the file
                $originalFilePath = $fullpath['fullpath'];

                // Delete the original file
                if (unlink($originalFilePath)) {
                    // Determine the low-resolution file path
                    $lowResolutionFilePath = preg_replace('/(\.[^.]+)$/', '-low640$1', $originalFilePath);

                    // Delete the low-resolution file if it exists
                    if (file_exists($lowResolutionFilePath)) {
                        unlink($lowResolutionFilePath);
                    }

                    $response = ['success' => 'Files deleted successfully']; // Set success message
                } else {
                    $response = ['message' => "Failed to remove original file."];
                }
            } else {
                $response = ['message' => "Path not found."];
            }
        } catch (PDOException $e) {
            $response = ['error' => $e->getMessage()];
        }
    }
} else {
    // If required parameters are not provided, set an appropriate message in the response array
    $response = ['message' => "Required parameters are missing."];
}

// Convert the response object to JSON
$json_response = json_encode($response);

// Send the response as JSON
header('Content-Type: application/json');
echo $json_response;
?>
