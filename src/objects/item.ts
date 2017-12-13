import * as BABYLON from '../babylon';
import Cube from './cube';
class Item extends Cube{
    private _turnAg:number = Math.asin(1);
    private _stepSize:number;
    private _stepTime:number;
    private _stepSeg:number;

    public dir:string;
    public hg:string;

    constructor(
        name:string,
        scene:BABYLON.Scene,
        posi:BABYLON.Vector3,
        size:number,
        stepTime:number,
        stepSeg:number,
        scaling:number
    ){
        super(name,scene,posi,size,scaling);        
        this._stepSize = size;
        this._stepTime = stepTime;
        this._stepSeg = stepSeg;
    }

    // turnUp():void{
    //     if (this._posi.y < 14) {
    //         switch (this.hg) {
    //             case 'flat':this.hg = 'up';break;
    //             case 'down':this.hg = 'flat';break;
    //             default:break;
    //         }
    //     }
    // }

    // turnDn():void{
    //     if (this._posi.y > 1) {
    //         switch (this.hg) {
    //             case 'flat':this.hg = 'down';break;
    //             case 'up':this.hg = 'flat';break;
    //             default:break;
    //         }
    //     }
    // }

    turnLt():void{
        let count:number = this._stepSeg,
            unitAg:number = this._turnAg/this._stepSeg,
            actionLoop = setInterval(()=>{
            this._rota.y -= unitAg;
            if (count<2) clearInterval(actionLoop); else count--;
        },this._stepTime/this._stepSeg);
    }

    turnRt():void{
        let count:number = this._stepSeg,
            unitAg:number = this._turnAg/this._stepSeg,
            actionLoop = setInterval(()=>{
                this._rota.y += unitAg;
                if (count<2) clearInterval(actionLoop); else count--;
            },this._stepTime/this._stepSeg);
    }

    follow(posi:BABYLON.Vector3):void{
        let unitTime:number = (this._stepTime/this._stepSeg),
            vx:number = posi.x-this._posi.x,
            vy:number = posi.y-this._posi.y,
            vz:number = posi.z-this._posi.z,
            unitSize_x:number = vx/this._stepSeg,
            unitSize_y:number = vy/this._stepSeg,
            unitSize_z:number = vz/this._stepSeg;
        this._posi.x += unitSize_x;
        this._posi.y += unitSize_y;
        this._posi.z += unitSize_z;
    }
}
export default Item;