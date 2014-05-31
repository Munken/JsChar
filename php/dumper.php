<?php
header('Content-Type: text/html; charset=utf-8');
require "../../conf/db.php";
$con=mysqli_connect($loc,$user,$pass,$db);
mysqli_set_charset($con,"utf8");
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$result = mysqli_query($con,"SELECT * FROM chars");
//
$return_arr = Array();
while($row = $result -> fetch_array(MYSQLI_ASSOC)) {

    $samples = Array();
    $rSam = mysqli_query($con, "SELECT * FROM traces WHERE charIdx = " . $row['idx']);
    while ($r = $rSam -> fetch_array(MYSQLI_ASSOC)) {
        array_push($samples, array("x"=>$r["x"], "y"=>$r["y"]));
    }
    $array = array(
        "i" => $row['idx'],
        "u" => $row['unicode'],
        "L" => $row['latex'],
        "p" => $row['package'],
        "m" => $row['mode'],
        "s" => $samples,
    );
    array_push($return_arr, $array);
}

echo json_encode($return_arr);


mysqli_close($con);
?>

