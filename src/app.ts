import Game from './game';
import axios from 'axios';
window.addEventListener('DOMContentLoaded', () => {
    let bgmPlayer = (document.getElementById('bgm') as HTMLAudioElement);
    bgmPlayer.loop = true;
    bgmPlayer.autoplay = true;
    bgmPlayer.play();
    let game = new Game('renderCanvas','score_now','score_history');
    game.createScene();
    game.doRender();

    // let scroll = (page:number):void=>{
    //     let hg:number = window.innerHeight,
    //         time:number = 1000,
    //         seg:number = 10,
    //         count:number = 0,
    //         loop = setInterval(()=>{
    //             document.getElementById('welcome').style.marginTop = parseInt(document.getElementById('welcome').style.marginTop)-hg/seg*page +"px";            
    //             count++;
    //             if (count>=seg) {
    //                 clearInterval(loop);
    //             }
    //         },time/seg);
    // }

    if (localStorage.username != undefined) {
        document.getElementById('bind_form').style.display = 'none';
        document.getElementById('check_successful').style.display = 'block';
        document.getElementById('check_failed').style.display = 'none';
        document.getElementById('username').innerHTML = localStorage.username;
        document.getElementById('score-board').style.fontSize = '20px';        
    }

    document.body.onkeydown = (e)=>{
        game.turn(e.keyCode);
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

    document.getElementById('enter').onclick = ()=>{
        document.getElementById('welcome').style.display = 'none';
        game.reset(true);      
    }

    document.getElementById('reset').onclick = ()=>{
        game.reset();
        document.getElementById('gameover').style.display = 'none';
    }

    document.getElementById('rank').onclick = ()=>{
        document.getElementById('rank_list').style.display = 'block';
        document.getElementById('gameover').style.display = 'none';
        let formData:FormData = new FormData();
        formData.append('lvl','3');
        axios.post('./dist/api/api.php?action=getrank',formData,{headers: {'Content-Type': 'multipart/form-data'}})
            .then((response)=>{
                console.log(response);
                let content = document.getElementById('rank_content'),
                    list = '',
                    data = response.data;
                data.forEach(element => {
                    list += "<tr><td>"+element.username+"</td><td>"+element.score+"</td></tr>";                    
                });
                content.innerHTML = list;
            }).catch((error)=>{
                console.log(error);
            });
    }

    document.getElementById('return').onclick = ()=>{
        document.getElementById('rank_list').style.display = 'none';
        document.getElementById('welcome').style.display = 'block';        
    }

    document.getElementById('login').onclick = ()=>{
        let username:string = (document.getElementById('usn') as HTMLInputElement).value,
            password:string = (document.getElementById('pwd') as HTMLInputElement).value,
            formData:FormData = new FormData();
        formData.append('username',username);
        formData.append('password',password);
        axios.post('./dist/api/api.php?action=check',formData,{headers: {'Content-Type': 'multipart/form-data'}}).then((response)=>{
            console.log(response);
            let success = document.getElementById('check_successful'),
                failed = document.getElementById('check_failed'),
                bindForm = document.getElementById('bind_form');
            if (response.data.code == 0) {
                bindForm.style.display = 'none';
                success.style.display = 'block';
                failed.style.display = 'none';
                document.getElementById('username').innerHTML = username;
                localStorage.username = username;
            }else{
                success.style.display = 'none';
                failed.style.display = 'block';
                failed.innerHTML = response.data.msg;
            }
        }).catch((error)=>{
            console.log(error);
        });
    }

    document.getElementById('release').onclick = ()=>{
        localStorage.removeItem('username');
        localStorage.removeItem('maxScore');
        document.getElementById('check_successful').style.display = 'none';
        document.getElementById('bind_form').style.display = 'block';
    }
});