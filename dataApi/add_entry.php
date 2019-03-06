<?php
require_once('../config/mysql_connect.php');
$entry_date = $_POST['entryDate'];
$entry_weight = $_POST['entryWeight'];
$entry_note = $_POST['entryNote'];
$browser_id = $_POST['browserID'];

echo "inside php file : entry_note is" . $entry_note;

// print($item_name);
$addEntryQuery = "INSERT INTO `weight_entry`
(`entryID`, `entryDate`, `entryWeight`, `entryNote`, `browserID`) 
VALUES (NULL, '{$entry_date}', {$entry_weight}, '{$entry_note}', {$browser_id});";
mysqli_query($conn, $addEntryQuery); //takes query and send to db
$entry_id = mysqli_insert_id($conn); //should return the last id of my insert
// print($addItemQuery);
// exit();
$query = "SELECT DISTINCT * 
          FROM weight_entry 
          WHERE entryDate = '$entry_date'
          AND entryWeight = '$entry_weight'
          AND entryNote = '$entry_note'
          AND entryID = $entry_id
          AND browserID = '$browser_id' 
          ";
// print($query);
// exit();
$result = mysqli_query($conn, $query);
$output=[];
if(mysqli_num_rows($result) > 0){
    $output['success'] = true;
    $output['message'] = 'Data was added successfully';
    while($row = mysqli_fetch_assoc($result)){
        $output['data'][] = $row;
    }
}else{
    $output['success'] = false;
    $output['message'] = 'There was an error trying to add the data. Please try again';
}
?>