<?php 

require("db360.php");
include("functions.php");

$response = [];


if(isset($_GET['i']) || isset($_POST['i'])) {
    // Get the value of the 'i' parameter
    if(isset($_GET['i'])) {
        $embed_id = $_GET['i'];
    } elseif (isset($_POST['i'])) {
         $embed_id = $_POST['i'];
    }

        // Get current user id if user is logged in and session set
    if(isset($_SESSION['user_id'])) {
        $current_user_id = $_SESSION['user_id'];
        $statement = $pdo->prepare("
            SELECT id, username, email, thumbnail, coverimage, subscriber, registered 
            FROM users 
            WHERE id = :current_user_id
        ");
        $statement->bindParam(':current_user_id', $current_user_id, PDO::PARAM_INT);
        $statement->execute();
        $userinfo = $statement->fetch(PDO::FETCH_ASSOC);
        // Check if any rows were found
        if($userinfo) {
            $current_userinfo = $userinfo;
        }


    } else {
        $temp = 1;
        $statement = $pdo->prepare("
            SELECT id, username, email, thumbnail, coverimage, subscriber, registered 
            FROM users 
            WHERE id = :current_user_id
        ");

        $statement->bindParam(':current_user_id', $temp, PDO::PARAM_INT);

        if ($statement->execute()) {
            $userinfo = $statement->fetch(PDO::FETCH_ASSOC);

            if ($userinfo) {
                $current_userinfo = $userinfo;
            } else {
                // Handle case where no user was found
                $response['error'] = "User not found";
            }
        } else {
            // Handle statement execution error
            $response['error'] = "Error executing statement";
        }

        $current_user_id = $temp;
    }

    // Get userid for creator info
    $statement = $pdo->prepare("
        SELECT 
            l.id AS location_id, 
            l.user_id, 
            l.allowcomments, 
            (SELECT COUNT(*) FROM comments WHERE location_id = l.id) AS total_comments 
        FROM 
            locations l
        WHERE 
            l.embed_id = :embed_id
    ");


    $statement->bindParam(':embed_id', $embed_id, PDO::PARAM_INT);
    $statement->execute();
    $creator = $statement->fetch(PDO::FETCH_ASSOC);

    $creator_id = $creator['user_id'];
    $location_id = $creator['location_id']; // Corrected variable name

    $allowcomments = ($creator['allowcomments'] == '1') ? true : false;

    $total_comments = $creator['total_comments'];

    
    // Get creator info
    $statement = $pdo->prepare("SELECT id, username, email, thumbnail, coverimage, subscriber, registered FROM users WHERE id = :creator_id");
    $statement->bindParam(':creator_id', $creator_id, PDO::PARAM_INT);
    $statement->execute();
    $user_array = $statement->fetch(PDO::FETCH_ASSOC);


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
            LIMIT 50;
        ");

            $comments_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
            $comments_statement->bindParam(':user_id', $current_user_id, PDO::PARAM_INT);
            $comments_statement->execute();
            $all_comments = $comments_statement->fetchAll(PDO::FETCH_ASSOC);

            
            // Adjust the 'has_liked' value to true or false and add reply_count to each comment
            foreach ($all_comments as &$comment) {
                $comment['has_liked'] = ($comment['has_liked'] == '1') ? true : false;
                $comment['reply_count'] = intval($comment['reply_count']); // Convert reply_count to integer
            }


            

        $response = [
            'id' => $location_id,
            'allowcomments' => $allowcomments,
            'total_comments' => $total_comments,
            'user' => $current_userinfo,
            'creator' => $user_array,
            'comments' => [] 
        ];

        // Append location details to the $response['locations'] array
        $response['comments'] = $all_comments;
                       
}  else {
    // If 'i' parameter is not provided in the URL, set an appropriate message in the response array
    $response = ['message' => "No Embed ID specified."];
}

// Convert the response object to JSON
$json_response = json_encode($response);

// Send the response as JSON
header('Content-Type: application/json');
echo $json_response;


?>