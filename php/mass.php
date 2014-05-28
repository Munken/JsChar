<?php


ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);


require "../../conf/db.php";
$con=mysqli_connect($loc,$user,$pass,$db);
mysqli_set_charset($con,"utf8");
if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}


$arr = array(
                "z" => "𝔷",
                "y" => "𝔶",
                "x" => "𝔵",
                "w" => "𝔴",
                "v" => "𝔳",
                "u" => "𝔲",
                "t" => "𝔱",
                "s" => "𝔰",
                "r" => "𝔯",
                "q" => "𝔮",
                "p" => "𝔭",
                "o" => "𝔬",
                "n" => "𝔫",
                "m" => "𝔪",
                "l" => "𝔩",
                "k" => "𝔨",
                "j" => "𝔧",
                "i" => "𝔦",
                "h" => "𝔥",
                "g" => "𝔤",
                "f" => "𝔣",
                "e" => "𝔢",
                "d" => "𝔡",
                "c" => "𝔠",
                "b" => "𝔟",
                "a" => "𝔞",
                "Z" => "ℨ",
                "Y" => "𝔜",
                "X" => "𝔛",
                "W" => "𝔚",
                "V" => "𝔙",
                "U" => "𝔘",
                "T" => "𝔗",
                "S" => "𝔖",
                "R" => "ℜ",
                "Q" => "𝔔",
                "P" => "𝔓",
                "O" => "𝔒",
                "N" => "𝔑",
                "M" => "𝔐",
                "L" => "𝔏",
                "K" => "𝔎",
                "J" => "𝔍",
                "I" => "ℑ",
                "H" => "ℌ",
                "G" => "𝔊",
                "F" => "𝔉",
                "E" => "𝔈",
                "D" => "𝔇",
                "C" => "ℭ",
                "B" => "𝔅",
                "A" => "𝔄"

                 );

if ($stmt = $con->prepare("INSERT INTO `chars` ( `unicode` , `latex` , `package` , `mode` ) VALUES (?, ?, '', 1)")) {

//    $u = "∂";
//    $l = "\\partial";
foreach ($arr as $l => $u) {
    $a = "\\mathfrak{" . $l . "}";
    $stmt -> bind_param("ss", $u, $a);

    $stmt -> execute();
}


    $stmt -> close();
}

//if ($stmt = $con->prepare("INSERT INTO `chars` ( `unicode` , `latex` , `package` , `mode` ) VALUES (?, ?, '', 1)")) {
//
//    // Bind the variables to the parameter as strings.
//    $stmt->bind_param("ss", "a", "partial");
//
//    // Execute the statement.
//    $stmt->execute();
//
//    // Close the prepared statement.
//    $stmt->close();
//
//    echo "Inserted!";
//}

mysqli_close($con);
?>