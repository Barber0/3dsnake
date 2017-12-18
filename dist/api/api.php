<?php
header("Access-Control-Allow-Origin: *");
require_once "./config.php";
require_once "./Controller.php";
$ctl = new Controller($config);
if (isset($_GET['action'])) {
    $action = $_GET['action'];
    switch ($action) {
        case 'check':
            if (isset($_POST['username'],$_POST['password'])) {
                $result = $ctl->check($_POST['username'],$_POST['password']);
                echo json_encode($result);
            }else{
                echo json_encode(array(
                    'code'  =>  -1,
                    'msg'   =>  '信息不足'
                ));
            }
            break;
        case 'getrank':
            $lvl = isset($_GET['lvl'])? $_GET['lvl'] : 3; 
            echo json_encode($ctl->getRank($lvl));
            break;
        case 'updaterank':
            if (isset($_GET['username'],$_GET['score'],$_GET['lvl'])) {
                $result = $ctl->updateRank($_GET['username'],$_GET['score'],$_GET['lvl']);
                echo json_encode(array(
                    'code'  =>  0,
                    'rows'  =>  $result
                ));
            }else{
                echo json_encode(array(
                    'code'  =>  -1,
                    'msg'   =>  '信息不足'
                ));
            }
            break;
        default:break;
    }
}
?>