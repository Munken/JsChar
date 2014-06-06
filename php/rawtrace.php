<?php
header('Content-Type: text/html; charset=utf-8');
require "../passwd/db.php";
$con=mysqli_connect($loc,$user,$pass,$db) or die("Failed to connect to MySQL: " . mysqli_connect_error());
mysqli_set_charset($con,"utf8");

$result = mysqli_query($con,"SELECT idx as i, charIdx as c, x, y FROM traces");
//
$return_arr = Array();
while($row = $result -> fetch_array(MYSQLI_ASSOC)) {
    array_push($return_arr, $row);
}

echo json_encode($return_arr);

mysqli_close($con);
?>

