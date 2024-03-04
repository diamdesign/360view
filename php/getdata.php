<?php 
include("../php/db360.php");
include("../php/functions.php");

// Initialize an array to store messages and results
$response = [];
$projects = [];
$locations = [];
$location = [];
$comments = [];


if(isset($_POST['i'])) {
    // Get the value of the 'i' parameter
    $embed_id = $_POST['i'];



    // Get the first letter of the 'embed_id' parameter and convert it to uppercase
    $first_letter = strtoupper(substr($embed_id, 0, 1));

    // Get current user id if user is logged in and session set
    if(isset($_SESSION['user_id'])) {
        $current_user_id = $_SESSION['user_id'];
    } else {
        $current_user_id = null;
    }


    // Check and insert visitors information into database
    visitorInfo($pdo, $current_user_id);

    // Check if the first letter is 'L or 'P'
    if($first_letter === 'L') {
        // Indicates it is a Location
               
        try {
            // Prepare a statement to select all rows from the "locations" table where "i" equals the provided "embed_id"
            $statement = $pdo->prepare("SELECT id, embed_id, user_id, location_title, file_type, file_name, base_url, duration, captions, info, custom_logo, logo_link, custom_css, ispublic, allowcomments, hasmusic, haspass, registered FROM locations WHERE embed_id = :embed_id");
            // Bind the parameter
            $statement->bindParam(':embed_id', $embed_id, PDO::PARAM_STR);
            // Execute the statement
            $statement->execute();
            // Fetch all rows as associative arrays
            $locations = $statement->fetch(PDO::FETCH_ASSOC);
            // Check if any rows were found
            if($locations) {

                $user_id = $locations['user_id'];
                $this_location_id = $locations['id'];

                // Count views
                $views_statement = $pdo->prepare("SELECT COUNT(*) as total_views FROM views WHERE location_id = :location_id");
                $views_statement->bindParam(':location_id', $this_location_id, PDO::PARAM_INT);
                $views_statement->execute();
                $views_result = $views_statement->fetch(PDO::FETCH_ASSOC);
                $total_views = $views_result['total_views'];

                // Count likes
                $likes_statement = $pdo->prepare("SELECT COUNT(*) as total_likes FROM likes WHERE location_id = :location_id");
                $likes_statement->bindParam(':location_id', $this_location_id, PDO::PARAM_INT);
                $likes_statement->execute();
                $likes_result = $likes_statement->fetch(PDO::FETCH_ASSOC);
                $total_likes = $likes_result['total_likes'];

  

                 // Get user info
                $statement = $pdo->prepare("SELECT id, username, email, thumbnail, coverimage, subscriber, registered FROM users WHERE id = :user_id");
                $statement->bindParam(':user_id', $user_id, PDO::PARAM_INT);
                $statement->execute();
                $user_array = $statement->fetch(PDO::FETCH_ASSOC);
                
                
                // Reset the $comments array for each location
                $comments = [];

                $location_details = $locations;

                if ($location_details) {

                        $location_id = $location_details['id'];

                        // Store counts in $locations array
                        $location_details['total_views'] = $total_views;
                        $location_details['total_likes'] = $total_likes;
                        
                        $location_details['ispublic'] = ($location_details['ispublic'] == '1') ? true : false;
                        $location_details['hasmusic'] = ($location_details['hasmusic'] == '1') ? true : false;
                        $location_details['haspass'] = ($location_details['haspass'] == '1') ? true : false;
                        $location_details['allowcomments'] = ($location_details['allowcomments'] == '1') ? true : false;
                    
                        
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
                
                // Store retrieved data into the response array
                $response = [
                    'user' => $user_array,
                    'locations' => [$location_details],
                ];
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
            // Retrieve data from the "projects" table
            $projects_statement = $pdo->prepare("SELECT id, embed_id, user_id, project_title, project_description, map_filename, base_url, custom_logo, logo_link, custom_css, ispublic, hasmusic, haspass, showlocations, overide_location_password, registered FROM projects WHERE embed_id = :embed_id");
            $projects_statement->bindParam(':embed_id', $embed_id, PDO::PARAM_STR);
            $projects_statement->execute();
            $projects = $projects_statement->fetch(PDO::FETCH_ASSOC); // Use fetch() instead of fetchAll()

            $project_id = $projects['id'];

            $user_id = $projects['user_id'];
            // Prepare the SQL statement
            $statement = $pdo->prepare("SELECT id, username, email, thumbnail, coverimage, subscriber, registered FROM users WHERE id = :user_id");
            // Bind the parameter
            $statement->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            // Execute the statement
            $statement->execute();
            // Fetch the result as an associative array
            $user_array = $statement->fetch(PDO::FETCH_ASSOC);

            // Get user info
            // $user_array = getUserInfo($pdo, $user_id);

            // Check if any projects are fetched
            if ($projects) { // Check if a project was fetched
                // Adjust the 'ispublic' field value if it exists
                $projects['overide_location_password'] = ($projects['overide_location_password'] == '1') ? true : false;
                $projects['showlocations'] = ($projects['showlocations'] == '1') ? true : false;
                $projects['ispublic'] = ($projects['ispublic'] == '1') ? true : false;
                $projects['haspass'] = ($projects['haspass'] == '1') ? true : false;
                $projects['hasmusic'] = ($projects['hasmusic'] == '1') ? true : false;
            }

            // Retrieve data from the "map_links" table
            $map_statement = $pdo->prepare("SELECT id, link_title, pos_top, pos_left, link_location_id, link_order_index FROM map_links WHERE project_id = :project_id");
            $map_statement->bindParam(':project_id', $project_id, PDO::PARAM_INT);
            $map_statement->execute();
            $maps = $map_statement->fetchAll(PDO::FETCH_ASSOC);

            $projects['map_links'] = $maps;

            if($projects['hasmusic'] === true) {
                // Retrieve data from the "map_links" table
                $music_statement = $pdo->prepare("SELECT id, file_name, base_url, artist, album, duration FROM music WHERE project_id = :project_id");
                $music_statement->bindParam(':project_id', $project_id, PDO::PARAM_INT);
                $music_statement->execute();
                $music = $music_statement->fetchAll(PDO::FETCH_ASSOC);

                $projects['music_list'] = $music;
            }

            // Retrieve data from the "project_list" table
            $project_list_statement = $pdo->prepare("SELECT * FROM project_list WHERE embed_id = :embed_id ORDER BY order_index");
            $project_list_statement->bindParam(':embed_id', $embed_id, PDO::PARAM_STR);
            $project_list_statement->execute();
            $project_list = $project_list_statement->fetchAll(PDO::FETCH_ASSOC);

            // Indicates it is a Project with locations
            if(isset($_POST['loc']) && $_POST['loc'] !== '') {
                $start_location = $_POST['loc'];
                $projects['start_order_index'] = $start_location;
            }

            $response = [
                'user' => $user_array,
                'project' => $projects,
                'locations' => [] // Initialize locations array here
            ];

            // Retrieve details from the "locations" table based on location_id from "project_list"
            foreach ($project_list as $project) {
                // Reset the $comments array for each location
                $comments = [];

                $location_id = $project['location_id'];
                $order_index = $project['order_index'];
                $location_statement = $pdo->prepare("SELECT id, embed_id, user_id, location_title, file_type, file_name, base_url, duration, captions, info, custom_logo, logo_link, custom_css, ispublic, allowcomments, hasmusic, haspass, registered FROM locations WHERE id = :location_id");
                $location_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
                $location_statement->execute();
                $locations_data = $location_statement->fetchAll(PDO::FETCH_ASSOC);

                foreach ($locations_data as &$location_details) {
                    if ($location_details) {

                        $location_details['order_index'] = $order_index;
                        $location_details['hasmusic'] = ($location_details['hasmusic'] == '1') ? true : false;
                        $location_details['haspass'] = ($location_details['haspass'] == '1') ? true : false;
                        $location_details['ispublic'] = ($location_details['ispublic'] == '1') ? true : false;
                        $location_details['allowcomments'] = ($location_details['allowcomments'] == '1') ? true : false;
                        
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
                        $markers_statement = $pdo->prepare("SELECT id, marker_title, pos_x, pos_y, pos_z, info, link, sound, autoplay, customcss FROM markers WHERE location_id = :location_id");
                        $markers_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
                        $markers_statement->execute();
                        $markers_details = $markers_statement->fetchAll(PDO::FETCH_ASSOC);
                        
                        // Check if markers details were fetched
                        if ($markers_details) {
                            foreach ($markers_details as &$marker_detail) {
                                $marker_detail['autoplay'] = ($marker_detail['autoplay'] == '1') ? true : false;
                            }
                            // Embed marker details inside location details
                            $location_details['markers'] = $markers_details;
                        } else {
                            // No caption details found
                            $location_details['markers'] = [];
                        }

                        if($location_details['hasmusic'] === true) {
                            // Retrieve data from the "map_links" table
                            $music_loc_statement = $pdo->prepare("SELECT id, file_name, base_url, artist, album, duration FROM music WHERE location_id = :location_id");
                            $music_loc_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
                            $music_loc_statement->execute();
                            $music_loc = $music_loc_statement->fetchAll(PDO::FETCH_ASSOC);

                            $location_details['music_list'] = $music_loc;
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

                        // Append location details to the $response['locations'] array
                        $response['locations'][] = $location_details;
                    }
                }



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

