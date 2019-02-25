<?php
require_once('../config/mysql_connect.php');
$entry_date = $_POST['entryDate'];
$entry_weight = $_POST['weight'];
$entry_note = $_POST['note'];
$change = $_POST['change'];
$browser_id = $_POST['browserId'];

echo "inside php file : entry_note is" . $entry_note;

// print($item_name);
$addEntryQuery = "INSERT INTO `entries` 
(`id`, `entry_date`, `entry_weight`, `entry_note`, `change`, `browser_id`) 
VALUES (NULL, '{$entry_date}', '{$entry_weight}', '{$entry_note}', '{$change}', '{$browser_id}');";
mysqli_query($conn, $addItemQuery);
// print($addItemQuery);
// exit();
$query = "SELECT DISTINCT * 
          FROM entries 
          WHERE entry_date = '$entry_date'
          AND entry_weight = '$entry_weight'
          AND entry_note = '$entry_note'
          AND change = '$change'
          AND browser_id = '$browser_id' 
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