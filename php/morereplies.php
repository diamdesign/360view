<?php

include("db360.php");

// Initialize an array to store messages and results
$response = [];

if(isset($_GET['id']) || isset($_POST['id'])) {

    if(isset($_GET['id'])) {
        $parent_id = $_GET['id'];
    } elseif (isset($_POST['id'])) {
        $parent_id = $_POST['id'];
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

    // Define limit
    $limit = 50;

    // Define a recursive SQL query to retrieve all replies
    $sql = "
    WITH RECURSIVE ReplyTree AS (
    SELECT 
        c.id,
        c.user_id,
        c.parent_id,
        c.reply_id,
        c.comment,
        c.registered
    FROM 
        comments c
    WHERE 
        c.parent_id = :parent_id
    UNION ALL
    SELECT 
        c.id,
        c.user_id,
        c.parent_id,
        c.reply_id,
        c.comment,
        c.registered
    FROM 
        ReplyTree rt
    JOIN 
        comments c ON rt.id = c.reply_id
)
SELECT 
    rt.*,
    u.username AS username,
    u.thumbnail AS thumbnail,
    COUNT(cl.comment_id) AS likes_count,
    SUM(CASE WHEN cl.user_id = :user_id THEN 1 ELSE 0 END) AS has_liked,
    ru.username AS reply_username
FROM 
    ReplyTree rt
LEFT JOIN 
    comments_likes cl ON rt.id = cl.comment_id
LEFT JOIN
    users u ON rt.user_id = u.id
LEFT JOIN
    comments rc ON rt.reply_id = rc.id
LEFT JOIN
    users ru ON rc.user_id = ru.id
GROUP BY 
    rt.id
ORDER BY 
    rt.registered ASC
LIMIT :limit OFFSET :offset";

    // Prepare the SQL statement
    $comments_statement = $pdo->prepare($sql);

    // Bind parameters
    $comments_statement->bindParam(':parent_id', $parent_id, PDO::PARAM_INT);
    $comments_statement->bindParam(':user_id', $current_user_id, PDO::PARAM_INT);
    $comments_statement->bindParam(':limit', $limit, PDO::PARAM_INT);
    $comments_statement->bindParam(':offset', $current_offset, PDO::PARAM_INT);

    // Execute the query
    $comments_statement->execute();

    // Fetch all replies
    $all_replies = $comments_statement->fetchAll(PDO::FETCH_ASSOC);

    // Adjust the 'has_liked' value to true or false
    foreach ($all_replies as &$reply) {
        $reply['has_liked'] = ($reply['has_liked'] == '1') ? true : false;
    }

    // Add replies details to the response
    $response = $all_replies;
}   else {
    // If 'i' parameter is not provided in the URL, set an appropriate message in the response array
    $response = ['message' => "No ID specified."];
}

// Convert the response object to JSON
$json_response = json_encode($response);

// Send the response as JSON
header('Content-Type: application/json');
echo $json_response;
