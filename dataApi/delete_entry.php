<?php
require_once('../config/mysql_connect.php');
$entry_date = $_POST['entryDate'];
$entry_weight = $_POST['entryWeight'];
$entry_note = $_POST['entryNote'];
$browser_id = $_POST['browserID'];

$deleteEntryQuery = "DELETE FROM `weight_entry` 
                    WHERE entryDate = {$entry_date}
                      AND entryWeight = '{$entry_weight}' 
                      AND entryNote = '{$entry_note}'
                      AND browserID = '{$browser_id}'
";

mysqli_query($conn, $deleteEntryQuery);
$query = "SELECT DISTINCT * 
          FROM weight_entry 
          WHERE entryDate = {$entry_date}
            AND entryWeight = '{$entry_weight}' 
            AND entryNote = '{$entry_note}'
            AND browserID = '{$browser_id}'
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