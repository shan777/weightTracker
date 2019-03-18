<?php
require_once('../config/mysql_connect.php');
$browser_id = $_POST['browserID'];
$output=[];

$query = "SELECT entryID, entryDate, entryWeight, entryNote 
            FROM weight_entry 
            WHERE browserID = '$browser_id' 
            ";
$result = mysqli_query($conn, $query);

echo "entryID ". $_GET['entryID']. "<br />";
// if(mysqli_num_rows($result) > 0){
//     $output['success'] = true;
//     while($row = mysqli_fetch_assoc($result)){
//         $output['data'][] = $row;
//     }
// } else {
//     $output['success'] = false;
//     $output['error'] = 'Invalid search. No data available.';
// ;}

mysqli_close($conn);
?>