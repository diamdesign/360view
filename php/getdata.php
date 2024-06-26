<?php 
require("db360.php");
require("functions.php");

// Initialize an array to store messages and results
$response = [];
$projects = [];
$locations = [];
$location = [];
$comments = [];


if(isset($_GET['i']) || isset($_POST['i'])) {
    // Get the value of the 'i' parameter
    if(isset($_GET['i'])) {
        $embed_id = $_GET['i'];
    } elseif (isset($_POST['i'])) {
         $embed_id = $_POST['i'];
    }



    // Get the first letter of the 'embed_id' parameter and convert it to uppercase
    $first_letter = strtoupper(substr($embed_id, 0, 1));

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




    // Check and insert visitors information into database
    visitorInfo($pdo, $current_user_id);

    // Check if the first letter is 'L or 'P'
    if($first_letter === 'L') {
        // Indicates it is a Location
               
        try {
            // Prepare a statement to select all rows from the "locations" table where "i" equals the provided "embed_id"
            $statement = $pdo->prepare("
                SELECT 
                    l.id, 
                    l.embed_id, 
                    l.user_id, 
                    l.location_title, 
                    l.location_description,
                    l.file_type, 
                    l.file_name, 
                    l.base_url, 
                    l.duration, 
                    l.captions, 
                    l.info, 
                    l.custom_logo, 
                    l.logo_link, 
                    l.custom_css, 
                    l.ispublic, 
                    l.allowcomments, 
                    l.hasmusic, 
                    l.haspass, 
                    l.registered,
                    (SELECT COUNT(*) FROM likes WHERE location_id = l.id) AS likes_count,
                    (SELECT COUNT(DISTINCT visitor_ipadress) FROM views WHERE location_id = l.id) AS views_count,
                    (SELECT COUNT(*) FROM likes WHERE location_id = l.id AND user_id = :current_user_id) AS has_liked
                FROM 
                    locations l
                WHERE 
                    l.embed_id = :embed_id
            "); 
         
            // Bind the parameter
            $statement->bindParam(':embed_id', $embed_id, PDO::PARAM_STR);
             $statement->bindParam(':current_user_id', $current_user_id, PDO::PARAM_STR);
            // Execute the statement
            $statement->execute();
            // Fetch all rows as associative arrays
            $locations = $statement->fetch(PDO::FETCH_ASSOC);
            // Check if any rows were found
            if($locations) {

                $user_id = $locations['user_id'];
                $this_location_id = $locations['id'];

                 // Get user info
                $statement = $pdo->prepare("SELECT id, username, email, thumbnail, coverimage, subscriber, registered FROM users WHERE id = :user_id");
                $statement->bindParam(':user_id', $user_id, PDO::PARAM_INT);
                $statement->execute();
                $user_array = $statement->fetch(PDO::FETCH_ASSOC);
                

                $location_details = $locations;

                if ($location_details) {

                        $location_id = $location_details['id'];

                         // Check if 'has_liked' exists and is not null
                        if (isset($location_details['has_liked']) && $location_details['has_liked'] !== null) {
                                // Convert the count to a boolean value: true if count is greater than 0, otherwise false
                                $has_liked_project = $location_details['has_liked'] > 0;
                            } else {
                                // If 'has_liked' doesn't exist or is null, set $has_liked_project to false
                                $has_liked_project = false;
                            }

                        $location_details['has_liked'] = $has_liked_project;
                        
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
                            $markers_statement = $pdo->prepare("SELECT id, marker_title, pos_x, pos_y, pos_z, info, link, sound, autoplay, customcss FROM markers WHERE location_id = :location_id");
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
                        

                    }
                
                // Store retrieved data into the response array
                $response = [
                    'user' => $current_userinfo,
                    'creator' => $user_array,
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
            $projects_statement = $pdo->prepare("
                SELECT 
                p.id, 
                p.embed_id, 
                p.user_id, 
                p.project_title, 
                p.project_description, 
                p.map_filename, 
                p.base_url, 
                p.custom_logo, 
                p.logo_link, 
                p.custom_css, 
                p.ispublic, 
                p.hasmusic, 
                p.haspass, 
                p.showlocations, 
                p.overide_location_password, 
                p.registered,
                (SELECT COUNT(*) FROM likes WHERE project_id = p.id) AS likes_count,
                (SELECT COUNT(DISTINCT visitor_ipadress) FROM views WHERE project_id = p.id) AS views_count
            FROM 
                projects p
            WHERE 
                p.embed_id = :embed_id
        ");
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
                // Retrieve data from the "project_sounds" and "sounds" tables using a JOIN
                $music_statement = $pdo->prepare("
                    SELECT s.id, s.fullpath, s.artist, s.album, s.duration
                    FROM project_sounds ps
                    INNER JOIN sounds s ON ps.sounds_id = s.id
                    WHERE ps.project_id = :project_id
                ");
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
            if(isset($_GET['loc']) && $_GET['loc'] !== '') {
                $start_location = $_GET['loc'];
                $projects['start_order_index'] = $start_location;
            }

            $response = [
                'user' => $current_userinfo,
                'creator' => $user_array,
                'project' => $projects,
                'locations' => [] // Initialize locations array here
            ];

            // Retrieve details from the "locations" table based on location_id from "project_list"
            foreach ($project_list as $project) {
                // Reset the $comments array for each location

                $location_id = $project['location_id'];
                $order_index = $project['order_index'];
                $location_statement = $pdo->prepare("
                    SELECT 
                        l.id, 
                        l.embed_id, 
                        l.user_id, 
                        l.location_title, 
                        l.location_description,
                        l.file_type, 
                        l.file_name, 
                        l.base_url, 
                        l.duration, 
                        l.captions, 
                        l.info, 
                        l.custom_logo, 
                        l.logo_link, 
                        l.custom_css, 
                        l.ispublic, 
                        l.allowcomments, 
                        l.hasmusic, 
                        l.haspass, 
                        l.registered,
                        (SELECT COUNT(*) FROM likes WHERE location_id = l.id) AS likes_count,
                        (SELECT COUNT(*) FROM comments WHERE location_id = l.id) AS total_comments,
                        (SELECT COUNT(DISTINCT visitor_ipadress) FROM views WHERE location_id = l.id) AS views_count,
                        (SELECT COUNT(*) FROM likes WHERE location_id = l.id AND user_id = :current_user_id) AS has_liked
                    FROM 
                        locations l
                    WHERE 
                        l.id = :location_id
                ");                
                $location_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
                $location_statement->bindParam(':current_user_id', $current_user_id, PDO::PARAM_INT);
                $location_statement->execute();
                $locations_data = $location_statement->fetchAll(PDO::FETCH_ASSOC);


                foreach ($locations_data as &$location_details) {
                    if ($location_details) {

                        // Check if 'has_liked' exists and is not null
                       if (isset($location_details['has_liked']) && $location_details['has_liked'] !== null) {
                            // Convert the count to a boolean value: true if count is greater than 0, otherwise false
                            $has_liked_project = $location_details['has_liked'] > 0;
                        } else {
                            // If 'has_liked' doesn't exist or is null, set $has_liked_project to false
                            $has_liked_project = false;
                        }

                        // Update the 'has_liked' value in the location_details array
                        $location_details['has_liked'] = $has_liked_project;
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
                            $music_statement = $pdo->prepare("
                                SELECT s.id, s.fullpath, s.artist, s.album, s.duration
                                FROM project_sounds ps
                                INNER JOIN sounds s ON ps.sounds_id = s.id
                                WHERE ps.location_id = :location_id
                            ");
                            $music_statement->bindParam(':location_id', $location_id, PDO::PARAM_INT);
                            $music_statement->execute();
                            $music = $music_statement->fetchAll(PDO::FETCH_ASSOC);

                            $projects['music_list'] = $music;
                        }
                                                   
                    }

             
                    $response['locations'][] = $location_details;
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

