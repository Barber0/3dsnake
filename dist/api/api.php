<?php
// header("Access-Control-Allow-Origin: *");
require_once "./config.php";
require_once "./Controller.php";
$ctl = new Controller($config);
if (isset($_GET['action'])) {
    $action = $_GET['action'];

    if ($action=='getrank') {
        $lvl = isset($_POST['lvl'])? $_POST['lvl'] : 3; 
        echo json_encode($ctl->getRank($lvl));
    }elseif ($action=='check') {
        if (isset($_POST['username'],$_POST['password'])) {
            $result = $ctl->check($_POST['username'],$_POST['password']);
            echo json_encode($result);
        }else{
            echo json_encode(array(
                'code'  =>  -1,
                'msg'   =>  '信息不足'
            ));
        }
    }elseif ($action=='updaterank') {
        if (isset($_POST['username'],$_POST['score'],$_POST['lvl'])) {
            $result = $ctl->updateRank($_POST['username'],$_POST['score'],$_POST['lvl']);
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
    }
}
?>