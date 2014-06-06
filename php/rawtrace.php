<?php
header('Content-Type: text/html; charset=utf-8');
require "../passwd/db.php";
$con=mysqli_connect($loc,$user,$pass,$db) or die("Failed to connect to MySQL: " . mysqli_connect_error());
mysqli_set_charset($con,"utf8");

if ($stmt = $con->prepare("SELECT * FROM traces WHERE idx > ?")) {

    $stmt->bind_param("i", $_GET['LOW_IDX']);

    // Execute the statement.
    $result = $stmt->execute();
    $i = 0;
    $c = 0;
    $x = "";
    $y = "";
    $stmt->bind_result($i, $c, $x, $y);

    $return_arr = Array();
    while($stmt->fetch()) {
        array_push($return_arr, array("i" => $i,
                                        "c" => $c,
                                        "x" => $x,
                                        "y" => $y));
    }
    $stmt -> close();
}

echo json_encode($return_arr);

mysqli_close($con);
?>

