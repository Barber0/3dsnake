import * as BABYLON from './babylon';
import Snake from './objects/snake';
import Foods from './objects/foods';
class Game{
    private _canvas:any;
    private _scoreNow:any;
    private _scoreHis:any;
    private _engine:BABYLON.Engine;
    private _scene:BABYLON.Scene;
    private _camera:BABYLON.Camera;
    private _light:BABYLON.Light;
    private _sk:Snake;
    private _ground:BABYLON.Mesh;
    private _plane:BABYLON.Mesh;
    private _foods:Foods;
    private _gdSize:number = 50;
    private _cameraLoop:any;

    private _turnAg:number = Math.asin(1);
    private _unitAg:number;
    private _stepSeg:number;
    private _agGroup:Array<{vx:number,vz:number}> = [];

    private _turnAble:boolean = true;
    private _status:string = 'welcome';

    constructor(canvasID:string,scoreNowID:string,scoreHisID:string){
        this._canvas = document.getElementById(canvasID);
        this._scoreNow = document.getElementById(scoreNowID);
        this._scoreHis = document.getElementById(scoreHisID);
        this._engine = new BABYLON.Engine(this._canvas,true);
    }

    createScene():void{
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.FreeCamera('camera',new BABYLON.Vector3(0,15,-30),this._scene);
        this._camera.attachControl(this._canvas,false);
        this._light = new BABYLON.HemisphericLight('light',new BABYLON.Vector3(0,5,0),this._scene);

        this.createSky();        

        let gdmt = new BABYLON.StandardMaterial('gdmt',this._scene);
        gdmt.diffuseTexture = new BABYLON.Texture('./dist/baw.jpg',this._scene);
        gdmt.diffuseColor = new BABYLON.Color3(0.9, 0.9, 0.9);

        this._ground = BABYLON.MeshBuilder.CreateGround('gr',
            {width:this._gdSize,height:this._gdSize,subdivisions:2},this._scene);
        this._ground.material = gdmt;

        this._sk = new Snake(this._scene,new BABYLON.Vector3(0,1,0));
        this._camera.setTarget(this._sk.getPo());
        this._foods = new Foods(this._scene,this._gdSize);
        
        this._stepSeg = this._sk.getStepSeg();
        this._unitAg = this._turnAg/this._stepSeg;

        this.createAg(30);

        this.start();
        this.reset();
    }
    
    createAg(radius:number):void{
        for (let i = 0; i < this._stepSeg; i++) {
            this._agGroup.push({
                vx:radius*(Math.sin((i+1)*this._unitAg)-Math.sin(i*this._unitAg)),
                vz:radius*(Math.cos((i+1)*this._unitAg)-Math.cos(i*this._unitAg))
            });
        }
    }

    createSky():void{
        let skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, this._scene);
        let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this._scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./dist/sky/skybox", this._scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
    }

    doRender():void{
        this._engine.runRenderLoop(()=>{
            this._scene.render();
        });

        window.addEventListener('resize',()=>{
            this._engine.resize();
        });
    }

    turn(keyCode:number):void{
        switch (keyCode) {
            case 87:    //w
                if (this._sk.getDir()=='L') this._sk.turnRt();
                    else if (this._sk.getDir()=='R') this._sk.turnLt();
                break;
            case 83:    //s
                if (this._sk.getDir()=='L') this._sk.turnLt();
                    else if (this._sk.getDir()=='R') this._sk.turnRt();
                break;
            case 65:    //a
                if (this._sk.getDir()=='F') this._sk.turnLt();
                    else if (this._sk.getDir()=='B') this._sk.turnRt();
                break;
            case 68:    //d
                if (this._sk.getDir()=='F') this._sk.turnRt();
                    else if (this._sk.getDir()=='B') this._sk.turnLt();
                break;
            case 38:
                this._sk.turnUp();
                break;
            case 40:
                this._sk.turnDn();
                break;
            default:break;
        }
    }

    start():void{
            let unitTime = this._sk.getUnitTime();
            if (this._status=='welcome') this._status = 'playing';
            this._sk.action();
            this._scene.registerBeforeRender(()=>{
                this._scoreNow.innerHTML = 'score：'+this._foods.getScore();
                this._scoreHis.innerHTML = 'max：'+ (localStorage.maxScore==undefined?0:localStorage.maxScore);
                this._camera.setTarget(this._sk.getPo());
                this._camera.position.x = this._sk.getPo().x;
                this._camera.position.z = this._sk.getPo().z - 30;
                this._foods.check(this._sk.getPo(),this._sk);
                this.judge();
            });
    }

    stop():void{
        this._sk.stop(this._foods.getScore());
        clearInterval(this._cameraLoop);
        if (this._status=='playing') {
            this._status = 'gameover';
            setTimeout(() => {
                document.getElementById('gameover').style.display = 'block';        
            }, 600);   
        }
    }

    grow():void{this._sk.add();}

    addFood():void{
        this._foods.createFood();
    }

    judge():void{
        let po = this._sk.getPo();
        if (po.x > 25 || po.x < -25 ||
            po.z > 25 || po.z < -25 ||
            this._sk.check()==true) {
            this.stop();
        }
    }

    reset():void{
        let skSeg:Array<BABYLON.Mesh> = this._sk.getMesh();
        this._status = 'playing';
        for (let i = 0; i < skSeg.length; i++) {
            this._scene.removeMesh(skSeg[i]);
        }
        this._sk.stop(this._foods.getScore());
        this._foods.clean();
        this._sk = new Snake(this._scene,new BABYLON.Vector3(0,1,0));
        this._foods = new Foods(this._scene,this._gdSize);
        for (let i = 0; i < 3; i++) this.addFood();
    }

    cameraFollow():void{
        // let po = this._sk.getPo();
        this._camera.setTarget(this._sk.getPo());
        this._camera.position.x = this._sk.getPo().x;
        this._camera.position.z = this._sk.getPo().z - 30;
    }
}
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
});