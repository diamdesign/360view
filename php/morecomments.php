<?php 

require("db360.php");

// Initialize an array to store messages and results
$response = [];

if(isset($_GET['id']) || isset($_POST['id'])) {

    if(isset($_GET['id'])) {
        $location_id = $_GET['id'];
    } elseif (isset($_POST['id'])) {
        $location_id = $_POST['id'];
    }

    if(isset($_GET['user'])) {
        $current_user_id = $_GET['user'];
    } elseif (isset($_POST['user'])) {
        $current_user_id = $_POST['user'];
    } else {
        $current_user_id = null;
    }

    if(isset($_GET['offset'])) {
        $current_offset = $_GET['offset'];
    } elseif (isset($_POST['user'])) {
        $current_offset = $_POST['offset'];
    } else {
        $current_offset = 0;
    }

    $limit = 50;


        // Retrieve data from the "comments" table with likes count and check if the current user has liked each comment
        $comments_statement = $pdo->prepare("
        SELECT 
            c.*,
            u.username AS username, 
            u.thumbnail AS thumbnail, 
            COUNT(cl.comment_id) AS likes_count,
            SUM(CASE WHEN cl.user_id = :user_id THEN 1 ELSE 0 END) AS has_liked,
            (SELECT COUNT(*) FROM comments rc WHERE rc.parent_id = c.id) AS reply_count
        FROM 
            comments c
        LEFT JOIN 
            comments_likes cl ON c.id = cl.comment_id
        LEFT JOIN
            users u ON c.user_id = u.id
        WHERE  
            c.location_id = :location_id AND
            c.parent_id IS NULL
        GROUP BY 
            c.id
        ORDER BY 
            c.registered DESC
        LIMIT :limit OFFSET :offset;
    ");

        $comments_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
        $comments_statement->bindParam(':user_id', $current_user_id, PDO::PARAM_INT);
        $comments_statement->bindParam(':limit', $limit, PDO::PARAM_INT);
        $comments_statement->bindParam(':offset', $current_offset, PDO::PARAM_INT);
        
        $comments_statement->execute();
        $all_comments = $comments_statement->fetchAll(PDO::FETCH_ASSOC);

  
        // Adjust the 'has_liked' value to true or false and add reply_count to each comment
        foreach ($all_comments as &$comment) {
            $comment['has_liked'] = ($comment['has_liked'] == '1') ? true : false;
            $comment['reply_count'] = intval($comment['reply_count']); // Convert reply_count to integer
        }

    // Add comments details to the location details
    $response = $all_comments;
        
    }  else {
    // If 'i' parameter is not provided in the URL, set an appropriate message in the response array
    $response = ['message' => "No ID specified."];
}

// Convert the response object to JSON
$json_response = json_encode($response);

// Send the response as JSON
header('Content-Type: application/json');
echo $json_response;