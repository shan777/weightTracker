<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST');
header('Content-type: application/json');
require_once('../config/mysql_connect.php');
$request = $_GET['request'];

switch($request){
    case 'add_entry':
        require_once('dataApi/add_entry.php');
        break;
    case 'get_entries':
        require_once('dataApi/get_entries.php');
        break;
    case 'update_entry':
        require_once('dataApi/update_entry.php');
        break;
    case 'delete_entry':
        require_once('dataApi/delete_entry.php');
        break;
    default:
        $output['Errors'] = 'Request URL failed';
}

//convert the $output variable to json, store the result in $outputJSON
$output = json_encode($output);
echo $output;
?>