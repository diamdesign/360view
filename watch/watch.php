<?php 

require("../php/db360.php");
// Get the value of the 'i' parameter from the URL
if(isset($_GET["i"])) {


$embed_id = isset($_GET['i']) ? $_GET['i'] : null;

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
    <title>Watch</title>
</head>
<body>
        <?php 
            include("../components/header.php");
        ?>
    <div id="grid">
        <?php 
            include("../components/leftmenu.php");
        ?>
        <div id="center">
            <div class="center-content">
                <iframe src="https://snallapojkar.se/360/embed/?i=Pds343GXFfse32&loc=245" frameborder="0" width="100%" id="iframeroot"></iframe>
                <div id="profile">
                    <div class="info">
                        <div class="thumb">
                            <img src="<?php echo $thumbnail ?>" alt="">
                        </div>
                        <div class="details">
                            <div class="user">
                                <a class="profilelink" href="https://snallapojkar.se/360/profile/<?php echo $username ?>" target="_blank"><?php echo $username ?></a>
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
</body>
</html>