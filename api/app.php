<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST');
header('Content-type: application/json');
require_once('../config/mysql_connect.php');
$request = $_GET['request'];

switch($request){
    case 'add_entry':
        require_once('add_entry.php');
        break;
    case 'get_entries':
        require_once('get_entries.php');
        break;
    case 'update_entry':
        require_once('update_entry.php');
        break;
    case 'delete_entry':
        require_once('delete_entry.php');
        break;
    default:
        $output['Errors'] = 'Request URL failed';
}

$output = json_encode($output);
echo $output;
?>