<?php 
include("../php/db360.php");
include("../php/functions.php");

// Initialize an array to store messages and results
$response = [];
// Initialize an array to store locations details
$locations = [];
// Initialize an array to store comments
$comments = [];

if(isset($_GET['i'])) {
    // Get the value of the 'i' parameter
    $embed_id = $_GET['i'];

    // Get the first letter of the 'embed_id' parameter and convert it to uppercase
    $first_letter = strtoupper(substr($embed_id, 0, 1));

    // Get current user id if user is logged in and session set
    if($_SESSION['user_id']) {
        $current_user_id = $_SESSION['user_id'];
    }

    // Check and insert visitors information into database
    visitorInfo($pdo);

    // Check if the first letter is 'L or 'P'
    if($first_letter === 'L') {
        // Indicates it is a Location
       
        
        try {
            // Prepare a statement to select all rows from the "locations" table where "i" equals the provided "embed_id"
            $statement = $pdo->prepare("SELECT * FROM locations WHERE embed_id = :embed_id");
            // Bind the parameter
            $statement->bindParam(':embed_id', $embed_id, PDO::PARAM_STR);
            // Execute the statement
            $statement->execute();
            // Fetch all rows as associative arrays
            $locations = $statement->fetchAll(PDO::FETCH_ASSOC);
            // Check if any rows were found
            if($locations) {
                
        // Reset the $comments array for each location
        $comments = [];

        foreach ($locations as &$location_details) {
            if ($location_details) {

                $location_id = $location_details['id'];
                
                // Adjust value to true or false for 'ispublic'
                $ispublic = ($location_details['ispublic'] == '1') ? true : false;
                
                // Add the adjusted value to the array
                $location_details['ispublic'] = $ispublic;

                // Adjust value to true or false for 'allowcomments'
                $allowcomments = ($location_details['allowcomments'] == '1') ? true : false;
                
                // Add the adjusted value to the array
                $location_details['allowcomments'] = $allowcomments;
                
                // Check if the captions column is not null
                if ($location_details['captions'] !== null) {
                    // Fetch caption details from the captions table
                    $caption_statement = $pdo->prepare("SELECT id, caption_language FROM captions WHERE location_id = :location_id");
                    $caption_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
                    $caption_statement->execute();
                    $caption_details = $caption_statement->fetchAll(PDO::FETCH_ASSOC);
                    
                    // Check if caption details were fetched
                    if ($caption_details) {
                        // Embed caption details inside location details
                        $location_details['captions'] = $caption_details;
                    } else {
                        // No caption details found
                        $location_details['captions'] = [];
                    }
                }

                    // Fetch markers details from the captions table
                    $markers_statement = $pdo->prepare("SELECT id, marker_title, pos_x, pos_y, pos_z, info, link FROM markers WHERE location_id = :location_id");
                    $markers_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
                    $markers_statement->execute();
                    $markers_details = $markers_statement->fetchAll(PDO::FETCH_ASSOC);
                    
                    // Check if caption details were fetched
                    if ($markers_details) {
                        // Embed caption details inside location details
                        $location_details['markers'] = $markers_details;
                    } else {
                        // No caption details found
                        $location_details['markers'] = [];
                    }
                

                if ($location_details['allowcomments'] === true) {
                    // Retrieve data from the "comments" table with likes count and check if the current user has liked each comment
                    $comments_statement = $pdo->prepare("
                        SELECT 
                            c.id, 
                            c.user_id, 
                            c.reply_id, 
                            c.comment, 
                            c.registered,
                            COUNT(cl.comment_id) AS likes_count,
                            SUM(CASE WHEN cl.user_id = :user_id THEN 1 ELSE 0 END) AS has_liked
                        FROM 
                            comments c
                        LEFT JOIN 
                            comments_likes cl ON c.id = cl.comment_id
                        WHERE  
                            c.location_id = :location_id
                        GROUP BY 
                            c.id
                        ORDER BY 
                            c.id ASC 
                        LIMIT 0, 25;

                    ");
                    $comments_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
                    $comments_statement->bindParam(':user_id', $current_user_id, PDO::PARAM_INT);
                    $comments_statement->execute();
                    $all_comments = $comments_statement->fetchAll(PDO::FETCH_ASSOC);

                    // Organize comments into a hierarchical structure
                    foreach ($all_comments as $comment) {

                        // Adjust has_liked value to true or false
                        $has_liked = ($comment['has_liked'] == '1') ? true : false;
                        
                        // Add the adjusted value to the comment array
                        $comment['has_liked'] = $has_liked;

                        // If the comment is a reply, find its parent comment
                        if ($comment['reply_id'] !== null) {
                            $parent_id = $comment['reply_id'];
                            // Search for the parent comment in the $comments array
                            foreach ($comments as &$parent_comment) {
                                if ($parent_comment['id'] == $parent_id) {
                                    // If the parent comment is found, append the reply to its 'replies' array
                                    $parent_comment['replies'][] = $comment;
                                    break; // Stop searching for the parent comment
                                }
                            }
                        } else {
                            // If the comment is not a reply, add it directly to the $comments array
                            $comments[] = $comment;
                        }
                    }

                    // Add comments details to the location details
                    $location_details['comments'] = $comments;
                }
            }
        }
        // Store retrieved data into the response array
        $response['location'][] = $location_details;
            } else {
                // If no rows were found, set an appropriate message in the response array
                $response['message'] = "No locations found for Embed ID: $embed_id";
            }
        } catch (PDOException $e) {
            // If an error occurs, add the error message to the response array
            $response['error'] = $e->getMessage();
        }


    } else {
        // Indicates it is a Project with Locations
        try {
        // Retrieve data from the "projects" table
        $projects_statement = $pdo->prepare("SELECT * FROM projects WHERE embed_id = :embed_id");
        $projects_statement->bindParam(':embed_id', $embed_id, PDO::PARAM_STR);
        $projects_statement->execute();
        $projects = $projects_statement->fetchAll(PDO::FETCH_ASSOC);

        // Check if any projects are fetched
        if (!empty($projects)) {
            // Iterate through each project
            foreach ($projects as $key => $project) {
                // Check if the 'ispublic' field exists and adjust its value
                if (isset($project['ispublic'])) {
                    $projects[$key]['ispublic'] = ($project['ispublic'] == '1') ? true : false;
                }
            }
        }

        // Retrieve data from the "project_list" table
        $project_list_statement = $pdo->prepare("SELECT * FROM project_list WHERE embed_id = :embed_id");
        $project_list_statement->bindParam(':embed_id', $embed_id, PDO::PARAM_STR);
        $project_list_statement->execute();
        $project_list = $project_list_statement->fetchAll(PDO::FETCH_ASSOC);

        // Retrieve details from the "locations" table based on location_id from "project_list"
        foreach ($project_list as $project) {
            // Reset the $comments array for each location
            $comments = [];

            $location_id = $project['location_id'];
            $location_statement = $pdo->prepare("SELECT * FROM locations WHERE id = :location_id");
            $location_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
            $location_statement->execute();
            $locations_data = $location_statement->fetchAll(PDO::FETCH_ASSOC);

            foreach ($locations_data as &$location_details) {
                if ($location_details) {

                    // Adjust value to true or false for 'ispublic'
                    $ispublic = ($location_details['ispublic'] == '1') ? true : false;
                    
                    // Add the adjusted value to the array
                    $location_details['ispublic'] = $ispublic;

                    // Adjust value to true or false for 'allowcomments'
                    $allowcomments = ($location_details['allowcomments'] == '1') ? true : false;
                    
                    // Add the adjusted value to the array
                    $location_details['allowcomments'] = $allowcomments;
                    
                    // Check if the captions column is not null
                    if ($location_details['captions'] !== null) {
                        // Fetch caption details from the captions table
                        $caption_statement = $pdo->prepare("SELECT id, caption_language FROM captions WHERE location_id = :location_id");
                        $caption_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
                        $caption_statement->execute();
                        $caption_details = $caption_statement->fetchAll(PDO::FETCH_ASSOC);
                        
                        // Check if caption details were fetched
                        if ($caption_details) {
                            // Embed caption details inside location details
                            $location_details['captions'] = $caption_details;
                        } else {
                            // No caption details found
                            $location_details['captions'] = [];
                        }
                    }

                        // Fetch markers details from the captions table
                        $markers_statement = $pdo->prepare("SELECT id, marker_title, pos_x, pos_y, pos_z, info, link FROM markers WHERE location_id = :location_id");
                        $markers_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
                        $markers_statement->execute();
                        $markers_details = $markers_statement->fetchAll(PDO::FETCH_ASSOC);
                        
                        // Check if caption details were fetched
                        if ($markers_details) {
                            // Embed caption details inside location details
                            $location_details['markers'] = $markers_details;
                        } else {
                            // No caption details found
                            $location_details['markers'] = [];
                        }
                    

                    if ($location_details['allowcomments'] === true) {
                        // Retrieve data from the "comments" table with likes count and check if the current user has liked each comment
                        $comments_statement = $pdo->prepare("
                            SELECT 
                                c.id, 
                                c.user_id, 
                                c.reply_id, 
                                c.comment, 
                                c.registered,
                                COUNT(cl.comment_id) AS likes_count,
                                SUM(CASE WHEN cl.user_id = :user_id THEN 1 ELSE 0 END) AS has_liked
                            FROM 
                                comments c
                            LEFT JOIN 
                                comments_likes cl ON c.id = cl.comment_id
                            WHERE  
                                c.location_id = :location_id
                            GROUP BY 
                                c.id
                            ORDER BY 
                                c.id ASC 
                            LIMIT 0, 25;

                        ");
                        $comments_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
                        $comments_statement->bindParam(':user_id', $current_user_id, PDO::PARAM_INT);
                        $comments_statement->execute();
                        $all_comments = $comments_statement->fetchAll(PDO::FETCH_ASSOC);

                        // Organize comments into a hierarchical structure
                        foreach ($all_comments as $comment) {

                            // Adjust has_liked value to true or false
                            $has_liked = ($comment['has_liked'] == '1') ? true : false;
                            
                            // Add the adjusted value to the comment array
                            $comment['has_liked'] = $has_liked;

                            // If the comment is a reply, find its parent comment
                            if ($comment['reply_id'] !== null) {
                                $parent_id = $comment['reply_id'];
                                // Search for the parent comment in the $comments array
                                foreach ($comments as &$parent_comment) {
                                    if ($parent_comment['id'] == $parent_id) {
                                        // If the parent comment is found, append the reply to its 'replies' array
                                        $parent_comment['replies'][] = $comment;
                                        break; // Stop searching for the parent comment
                                    }
                                }
                            } else {
                                // If the comment is not a reply, add it directly to the $comments array
                                $comments[] = $comment;
                            }
                        }

                        // Add comments details to the location details
                        $location_details['comments'] = $comments;
                    }
                }
            }
            // Store retrieved data into the response array
            $response['project'] = $projects;
            $response['locations'][] = $location_details;
        }
    } catch (PDOException $e) {
            // If an error occurs, add the error message to the response array
            $response['error'] = $e->getMessage();
        }
    } 
}  else {
    // If 'i' parameter is not provided in the URL, set an appropriate message in the response array
    $response['message'] = "No Embed ID specified.";
}

// Send the response as JSON
header('Content-Type: application/json');
echo json_encode($response);


?>