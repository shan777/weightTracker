<?php
require_once('../config/mysql_connect.php');
$entry_id = $_POST['entryID'];
$entry_date = $_POST['entryDate'];
$entry_weight = $_POST['entryWeight'];
$entry_note = $_POST['entryNote'];
$change = $_POST['change'];
$browser_id = $_POST['browserId'];
$updateEntryQuery = "UPDATE `entries` 
    SET `entry_date` = '{$entry_date}', 
    `entry_weight` = '{$entry_weight}', 
    `entry_note` = '{$entry_note}', 
    `change` = '{$change}' 
    WHERE `entries`.`id` = '{$entry_id}' 
    AND browser_id = '{$browser_id}' 
    ";
// print($updateEntryQuery);
// exit();
mysqli_query($conn, $updateEntryQuery);
$query = "SELECT DISTINCT * 
          FROM entries 
          WHERE id = '$entry_id'
          AND entry_date = '$entry_date'
          AND entry_weight = '$entry_weight'
          AND entry_note = '$entry_note'
          AND change = '$change'
          AND browser_id = '$browser_id'
          ";
$result = mysqli_query($conn, $query);
$output=[];
if(mysqli_num_rows($result) > 0) {
    $output['success'] = true;
    $output['message'] = 'Data was updated successfully';
} else {
    $output['success'] = false;
    $output['message'] = 'There was an error trying to update the data. Please try again';
}
// $output = json_encode($output);
?>