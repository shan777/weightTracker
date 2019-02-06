<?php
require_once('../config/mysql_connect.php');
$entry_id = $_POST['entryID'];
$browser_id = $_POST['browserId'];
$deleteEntryQuery = "DELETE FROM `entries` 
WHERE `entries`.`id` = '{$entry_id}'
AND browser_id = '{$browser_id}' 
";
// exit();
mysqli_query($conn, $deleteEntryQuery);
$query = "SELECT DISTINCT * 
          FROM entries 
          WHERE id = '$entry_id'
          AND browser_id = '$browser_id' 
          ";
$result = mysqli_query($conn, $query);
$output=[];
if(mysqli_num_rows($result) > 0) {
    $output['success'] = false;
    $output['message'] = 'There was an error trying to delete the data. Please try again';
} else {
    $output['success'] = true;
    $output['message'] = 'Data was deleted successfully';
}
// $output = json_encode($output);
?>