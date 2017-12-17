import Game from './game';
import axios from 'axios';
window.addEventListener('DOMContentLoaded', () => {
    let game = new Game('renderCanvas','score_now','score_history');
    game.createScene();
    game.doRender();

    document.body.onkeydown = (e)=>{
        game.turn(e.keyCode);
    }

    document.getElementById('enter').onclick = ()=>{
        document.getElementById('welcome').style.display = 'none';
    }

    document.getElementById('Lt').onclick = ()=>{
        game.turn(65);
    }

    document.getElementById('Rt').onclick = ()=>{
        game.turn(68);
    }

    document.getElementById('Ft').onclick = ()=>{
        game.turn(87);
    }

    document.getElementById('Bk').onclick = ()=>{
        game.turn(83);
    }

    document.getElementById('Up').onclick = ()=>{
        game.turn(38);
    }

    document.getElementById('Dn').onclick = ()=>{
        game.turn(40);
    }

    document.getElementById('start').onclick = ()=>{
        game.start();
    }

    document.getElementById('reset').onclick = ()=>{
        game.reset();
        document.getElementById('gameover').style.display = 'none';
    }

    document.getElementById('login').onclick = ()=>{
        let username:string = (document.getElementById('usn') as HTMLInputElement).value,
            password:string = (document.getElementById('pwd') as HTMLInputElement).value,
            formData:FormData = new FormData();
        formData.append('username',username);
        formData.append('password',password);
        axios.post('http://47.94.137.47/snake1/dist/api/api.php?action=check',formData,{headers: {'Content-Type': 'multipart/form-data'}}).then((response)=>{
            console.log(response);
            let success = document.getElementById('check_successful'),
                failed = document.getElementById('check_failed');
            if (response.data.code == 0) {
                success.style.display = 'block';
                failed.style.display = 'none';
                document.getElementById('username').innerHTML = username;
            }else{
                success.style.display = 'none';
                failed.style.display = 'block';
                failed.innerHTML = response.data.msg;
            }
        }).catch((error)=>{
            console.log(error);
        });
    }
});