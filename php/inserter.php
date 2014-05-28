<?php
require "../../conf/db.php";
$con=mysqli_connect($loc,$user,$pass,$db);
mysqli_set_charset($con,"utf8");
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}


if ($stmt = $con->prepare("INSERT INTO traces (charIdx, x, y) VALUES (?, ?, ?)")) {

    // Bind the variables to the parameter as strings.
    $stmt->bind_param("sss", $_POST['idx'], $_POST['x'], $_POST['y']);

    // Execute the statement.
    $stmt->execute();

    // Close the prepared statement.
    $stmt->close();

    echo "Inserted!";
}

mysqli_close($con);
?>