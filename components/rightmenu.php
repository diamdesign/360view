<div id="rightmenu">
    <div id="toggle-rightpanel"></div>


    <?php 
        require("../php/db360.php");

        try {
        
            // SQL query to fetch data from locations and projects tables
            $sql = "SELECT * FROM locations";

            // Prepare and execute the statement
            $stmt = $pdo->prepare($sql);
            $stmt->execute();

            // Fetch all rows as an associative array
            $locations_result = $stmt->fetchAll(PDO::FETCH_ASSOC);


            $sql = "SELECT * FROM projects";

            // Prepare and execute the statement
            $stmt = $pdo->prepare($sql);
            $stmt->execute();

            // Fetch all rows as an associative array
            $projects_result = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo '<div id="listitems">';
            foreach ($projects_result as $project) {
                    echo '<div class="listitem">
                    <h2 class="project_title">' . $project['project_title'] . '</h2>
                    </div>';
                }

                // Render locations
            foreach ($locations_result as $location) {
                echo '<div class="listitem">
                    <div class="listimage">
                        <img src="../img/' . $location['file_name'] . '" alt="" />
                    </div>
                    <h2 class="location_title">' . $location['location_title'] . '</h2>
                </div>';
            }

             echo '</div>';

        } catch(PDOException $e) {
            // Handle errors
            echo "Connection failed: " . $e->getMessage();
        }
    ?>
</div>