<?php 
require("db360.php");
require("functions.php");

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST)) {

    // Retrieve the JSON data from the POST request
    $jsonData = file_get_contents("php://input");

    // Decode the JSON data into a PHP associative array
    $data = json_decode($jsonData, true);

    if ($data !== null) {
        // Extract id, type, and html properties from the JSON data

        /*
        if(isset($_SESSION['user_id'])) {
            $user_id = $_SESSION['user_id'];
        } else {
             $response = ['error' => "User not logged in."];
            exit;
        }
        */

        $userId = $data["user_id"];

        /*
        if($userId !== $user_id) {
            $response = ['error' => "User ID's does not match."];
            exit;
        }
        */

        $userData = getUserInfo($pdo, $userId);

        $username = $userData["username"];

        $projectId = $data["projectid"];
        $locationId = $data["locationid"];
        $image = $data["image"];

        // Check if the image data is not empty
        if (!empty($image)) {
            // Get the MIME type of the image
            $image_info = getimagesize($image);
            $mime_type = $image_info['mime'];

           // Determine the file extension based on the image type
            $extension = '';
            switch ($mime_type) {
                case 'image/jpeg':
                    $extension = 'jpg';
                    break;
                case 'image/png':
                    $extension = 'png';
                    break;
                case 'image/gif':
                    $extension = 'gif';
                    break;
                default:
                    // Unsupported image type
                    $response = ['error' => "Unsupported image type"];
                    // Handle the error appropriately
                    break;
            }

            // Generate a unique filename with the correct extension
            do {
                $filename = uniqid() . '.' . $extension;
                $original_path = '../profile/' . $username . '/images/' . $filename;
            } while (file_exists($original_path));

            // Save the original image
            file_put_contents($original_path, file_get_contents($image));

            // Check if the image needs resizing
            if ($image_info[0] > 520) {
                // Load the image based on its MIME type
                if ($mime_type === 'image/jpeg') {
                    $image_resized = imagecreatefromjpeg($original_path);
                } elseif ($mime_type === 'image/png') {
                    $image_resized = imagecreatefrompng($original_path);
                } elseif ($mime_type === 'image/gif') {
                    $image_resized = imagecreatefromgif($original_path);
                } else {
                    // Unsupported image type
                    $response = ['error' => "Unsupported image type"];
                    // Handle the error appropriately
                }

                // Resize the image to a width of 520px
                $new_width = 520;
                $new_height = ($image_info[1] / $image_info[0]) * $new_width;
                $resized_image = imagescale($image_resized, $new_width, $new_height);

                // Save the resized image
                $resized_path = '../profile/' . $username . '/images/' . pathinfo($original_path, PATHINFO_FILENAME) . '-low.' . pathinfo($original_path, PATHINFO_EXTENSION);
                imagejpeg($resized_image, $resized_path);

                // Free up memory
                imagedestroy($image_resized);
                imagedestroy($resized_image);
            }

            try {
                // Insert into images table
                $imageStatement = $pdo->prepare("
                    INSERT INTO images (userId, fullpath) 
                    VALUES (:userId, :fullpath)
                ");
                $imageStatement->bindParam(':userId', $userId, PDO::PARAM_INT);
                $imageStatement->bindParam(':fullpath', $original_path, PDO::PARAM_STR);
                $imageStatement->execute();

                // Get the last inserted image ID
                $imageId = $pdo->lastInsertId();

                // Insert into projects_images table
                $projectImageStatement = $pdo->prepare("
                    INSERT INTO projects_images (user_id, project_id, location_id, images_id)
                    VALUES (:userId, :projectId, :locationId, :imageId)
                ");
                $projectImageStatement->bindParam(':userId', $userId, PDO::PARAM_INT);
                $projectImageStatement->bindParam(':projectId', $projectId, PDO::PARAM_INT);
                $projectImageStatement->bindParam(':locationId', $locationId, PDO::PARAM_INT);
                $projectImageStatement->bindParam(':imageId', $imageId, PDO::PARAM_INT);
                $projectImageStatement->execute();


            } catch (PDOException $e) {
                $response = ['error' => $e->getMessage()];
            }

            // Respond with the path
            $response = ['path' => $original_path];
        }
    }

    } else {

    $response = ['error' => "No POST data sent"];

}

// Convert the response object to JSON
$json_response = json_encode($response);

// Send the response as JSON
header('Content-Type: application/json');
echo $json_response;
