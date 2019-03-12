<?php
require_once('../config/mysql_connect.php');
$entry_id = $_POST['entryID'];
$entry_date = $_POST['entryDate'];
$entry_weight = $_POST['entryWeight'];
$entry_note = $_POST['entryNote'];
$browser_id = $_POST['browserID'];
print_r ($entry_id);


$updateEntryQuery = "UPDATE `weight_entry` 
    SET `entryDate` = '{$entry_date}', 
        `entryWeight` = '{$entry_weight}', 
        `entryNote` = '{$entry_note}'
    WHERE `entryID` = {$entry_id}
    AND browserID = '{$browser_id}' 
    ";

mysqli_query($conn, $updateEntryQuery);

$query = "SELECT DISTINCT * 
          FROM weight_entry 
          WHERE entryID = $entry_id
          AND entryDate = '$entry_date'
          AND entryWeight = '$entry_weight'
          AND entryNote = '$entry_note'
          AND browserID = '$browser_id'
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
$output = json_encode($output);
?>