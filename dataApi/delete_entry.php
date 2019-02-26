<?php
require_once('../config/mysql_connect.php');
$entry_id = $_POST['entryID'];
$browser_id = $_POST['browserID'];
$deleteEntryQuery = "DELETE FROM `weight_entry` 
                    WHERE entryID = '{$entry_id}'
                    AND browserID = '{$browser_id}' 
";
// exit();
mysqli_query($conn, $deleteEntryQuery);
$query = "SELECT DISTINCT * 
          FROM weight_entry 
          WHERE entryID = '$entry_id'
          AND browserID = '$browser_id' 
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