<?php
header('Content-Type: text/html; charset=utf-8');

$cont = file_get_contents("dump.json");
header('Content-Encoding: gzip');
header( 'Content-Length: ' . strlen( $cont ) );
header('Vary: Accept-Encoding');
echo $cont;

//echo "Pest";
?>