<?php
require "../../../conf/db.php";
$con=mysqli_connect($loc,$user,$pass,$db);
mysqli_set_charset($con,"utf8");
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$result = mysqli_query($con,"SELECT * FROM chars");

$return_arr = Array();
while($row = $result -> fetch_array(MYSQLI_ASSOC)) {
    array_push($return_arr, $row);
}

echo json_encode($return_arr);

mysqli_close($con);
?>