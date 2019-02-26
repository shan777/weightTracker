<?php
require_once('../config/mysql_connect.php');
$entry_date = $_POST['entryDate'];
$entry_weight = $_POST['weight'];
$entry_note = $_POST['note'];
$entry_id = $_POST['entryID'];
$browser_id = $_POST['browserId'];

echo "inside php file : entry_note is" . $entry_note;

// print($item_name);
$addEntryQuery = "INSERT INTO `weight_entry`
(`entryID`, `entryDate`, `entryWeight`, `entryNote`, `browseID`) 
VALUES (NULL, '{$entry_date}', '{$entry_weight}', '{$entry_note}', '{$entry_id}', '{$browser_id}');";
mysqli_query($conn, $addItemQuery);
// print($addItemQuery);
// exit();
$query = "SELECT DISTINCT * 
          FROM weight_entry 
          WHERE entryDate = '$entry_date'
          AND entryWeight = '$entry_weight'
          AND entryNote = '$entry_note'
          AND entryID = '$entry_id'
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