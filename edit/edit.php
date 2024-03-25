<?php 

require("../php/db360.php");
// Get the value of the 'i' parameter from the URL
if(isset($_GET["i"])) {

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
        $current_user_id = null;
       
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
        $subscriber = 1;
       
    }


$embed_id = isset($_GET['i']) ? $_GET['i'] : null;
$loc = isset($_GET['loc']) ? $_GET['loc'] : null;

// Get the first letter of the 'embed_id' parameter and convert it to uppercase
$first_letter = strtoupper(substr($embed_id, 0, 1));

try {
    // Prepare a statement to select all rows from the "locations" table where "i" equals the provided "embed_id"
    if($first_letter === 'L') {
        $statement = $pdo->prepare("
        SELECT 
                user_id, location_title
            FROM 
                locations
            WHERE 
                embed_id = :embed_id
        ");
    } else {
        $statement = $pdo->prepare("
        SELECT 
                user_id, project_title
            FROM 
                projects
            WHERE 
                embed_id = :embed_id
        ");
    }
    // Bind the parameter
    $statement->bindParam(':embed_id', $embed_id, PDO::PARAM_STR);
    $statement->execute();
    $locations = $statement->fetch(PDO::FETCH_ASSOC);
    // Check if any rows were found
    if($locations) {

        $user_id = $locations['user_id'];
        if($first_letter === 'L') {
            $title = $locations['location_title'];
        } else {
            $title = $locations['project_title'];
        }

        $statement = $pdo->prepare("
        SELECT 
                username, thumbnail
            FROM 
                users
            WHERE 
                id = :user_id
        ");
        $statement->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $statement->execute();
        $user = $statement->fetch(PDO::FETCH_ASSOC);
    }

    if($user) {
        $username = $user["username"];
        $thumbnail = $user["thumbnail"];
    }

    } catch (PDOException $e) {
        // If an error occurs, add the error message to the response array
        $response = ['error' => $e->getMessage()];
    
}
} else {
       header("Location: ../");
    exit; 
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Archivo:wght@100;200;300;400;500;600;700;900&family=Bebas+Neue&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:wght@100;400;500;700;900&display=swap"
        rel="stylesheet"
    />
    <link rel="stylesheet" href="../css/platform.css">
    <title>360 -<?php echo $title . " by " . $username;?></title>
</head>
<body>
    <?php 
    if ($current_user_id !== null && is_numeric($current_user_id)) { ?>



    <div id="content-container">
        <div id="showmenu"></div>
        <?php 
            include("../components/header.php");
        ?>
    <div id="grid">
        <?php 
            include("../components/leftmenu.php");
        ?>
        <div id="center">
            <div class="center-content">
                <iframe src="http://localhost/360/embed/?i=<?php echo $embed_id ?>&loc=<?php echo $loc ?>" frameborder="0" width="100%" id="iframeroot"></iframe>
                <div id="profile">
                    <div class="info">
                        <a class="thumb" href="https://snallapojkar.se/360/profile/<?php echo $username ?>">
                            <img src="<?php echo $thumbnail ?>" alt="">
                        </a>
                        <div class="details">
                            <div class="user">
                                <a class="profilelink" href="https://snallapojkar.se/360/profile/<?php echo $username ?>"><?php echo $username ?></a>
                            </div>
                            <p class="title"><?php echo $title ?></p>
                        </div>
                    </div>
                    <div class="content">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est quasi ipsam quisquam provident repellat tenetur vitae ea qui facilis labore similique recusandae, incidunt voluptas iusto velit dicta deleniti porro nesciunt! .Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero maxime tempora hic, explicabo a quas laboriosam! Repudiandae vitae id consequatur nemo officiis ipsum, expedita, libero animi nesciunt numquam necessitatibus temporibus?
                    </div>
                </div>
            </div>
        </div>
        <?php 
            include("../components/rightmenu.php");
        ?>
    </div>
     </div>

          <?php } else { 
        
            $new_location = '../../360/watch/?i=' . $embed_id;
            header('Location: ' . $new_location);
            exit();
        
            } ?>
    <script src="../js/platform.min.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const iframe = document.getElementById("iframeroot");

            iframe.onload = function() {
                const identifier = "360";
                const message = {
                    identifier: identifier,
                    userid: <?php echo json_encode($current_user_id); ?>,
                    subscriber: <?php echo json_encode($subscriber); ?>,
                    editmode: true
                };
                const targetOrigin = window.location.origin;
                iframe.contentWindow.postMessage(message, targetOrigin);
            };
        });

    </script>
</body>
</html>