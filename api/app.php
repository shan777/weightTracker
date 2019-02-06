<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST');
header('Content-type: application/json');
require_once('../config/mysql_connect.php');
$request = $_GET['request'];
switch($request){
    case 'add_item':
        require_once('add_item.php');
        break;
    case 'get_items':
        require_once('get_items.php');
        break;
    case 'update_item':
        require_once('update_item.php');
        break;
    case 'delete_item':
        require_once('delete_item.php');
        break;
    default:
        $output['Errors'] = 'Request URL failed';
}
$output = json_encode($output);
echo $output;
?>