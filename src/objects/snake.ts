import * as BABYLON from '../babylon';
import Item from './item';
class Snake{
    private _sk:Array<Item> = [];
    private _startPo:BABYLON.Vector3;
    private _scene:BABYLON.Scene;
    private _size:number = 2;
    private _scaling:number = 0.8;
    private _dir:string = 'F';
    private _hg:string = 'flat';    //up    down
    private _addAble:boolean = false;
    private _orbit:Array<BABYLON.Vector3> = [];
    private _actionLoop:any;
    private _stepTime:number = 180;
    private _stepSeg:number = 9;
    private _stepCount:number = 0;
    private _isRuning:boolean = true;
    private _roof:number = 18;
    private _gd:BABYLON.Mesh;

    constructor(scene:BABYLON.Scene,posi:BABYLON.Vector3,gd:BABYLON.Mesh){
        this._gd = gd;
        this._startPo = posi;
        for (let i = 0; i < 8; i++) {
            this._sk.push(new Item(
                'sk_'+i,
                this._scene,
                new BABYLON.Vector3(this._startPo.x,this._startPo.y,this._startPo.z-this._size*i),
                this._size,
                this._stepTime,
                this._stepSeg,
                this._scaling
            ));
            this._orbit.push(new BABYLON.Vector3(this._startPo.x,this._startPo.y,this._startPo.z-this._size*i));
        }
    }

    getDir():string{return this._dir};
    getHg():string{return this._hg};
    getPo():BABYLON.Vector3{return this._sk[0].getPo();}
    getUnitTime():number{return this._stepTime/this._stepSeg;}
    getStepSeg():number{return this._stepSeg;}
    getStepTime():number{return this._stepTime;}

    setOrbit(isTurn:boolean = false):void{
        let po = this.getPo();
        if (isTurn==true) {
            this._orbit.forEach((val,index)=>{
                val = this._sk[index].getPo();
            });
        }
        switch (this._hg) {
            case 'flat':
                this.setFlatOrb(po);
                break;
            case 'up':
                if (po.y < this._roof) {
                    this._orbit.unshift(new BABYLON.Vector3(po.x,po.y+this._size*1.5,po.z));
                    this._orbit.pop();
                }else{
                    this._hg = 'flat';
                    this.setFlatOrb(po);
                }
                break;
            case 'down':
                if (po.y > this._gd.position.y+2) {
                    this._orbit.unshift(new BABYLON.Vector3(po.x,po.y-this._size*1.5,po.z));
                    this._orbit.pop();
                }else{
                    this._hg = 'flat';
                    this.setFlatOrb(po);
                }
                break;
            default:
                break;
        }
    }

    setFlatOrb(po:BABYLON.Vector3):void{
        switch (this._dir) {
            case 'F':
                this._orbit.unshift(new BABYLON.Vector3(po.x,po.y,po.z+this._size*1.5));
                this._orbit.pop();
                break;
            case 'B':
                this._orbit.unshift(new BABYLON.Vector3(po.x,po.y,po.z-this._size*1.5));
                this._orbit.pop();
                break;
            case 'L':
                this._orbit.unshift(new BABYLON.Vector3(po.x-this._size*1.5,po.y,po.z));
                this._orbit.pop();
                break;
            case 'R':
                this._orbit.unshift(new BABYLON.Vector3(po.x+this._size*1.5,po.y,po.z));
                this._orbit.pop();
                break;
            default:
                break;
        }
    }

    action():void{
        if (this._isRuning==true) {
            this._stepCount++;
            if (this._stepCount>=this._stepSeg) {
                this.setOrbit();
                let len = this._sk.length;
                if (this._addAble==true) {
                    len++;
                }
                for (let i = 1; i < len; i++) {
                    if (this._addAble==true) {
                        this.grow();
                        this._addAble = false;
                    }
                }
            }
            this._orbit.forEach((val,index)=>{
                this._sk[index].follow(val);
            })
            if (this._stepCount>=this._stepSeg) this._stepCount = 0;
        }
    }

    turnUp():void{
        if (this._sk[0].getPo().y < this._roof) {
            switch (this._hg) {
                case 'flat':this._hg = 'up';break;
                case 'down':this._hg = 'flat';break;
                default:break;
            }
        }
    }
    turnDn():void{
        if (this._sk[0].getPo().y > 1) {
            switch (this._hg) {
                case 'flat':this._hg = 'down';break;
                case 'up':this._hg = 'flat';break;
                default:break;
            }
        }
    }
    turnLt():void{
        let po_0 = this._sk[0].getPo(),
            po_1 = this._sk[1].getPo(),
            isTurn:boolean = false;
        switch (this._dir) {
            case 'F':
                if (Math.abs(po_0.z-po_1.z) >= this._size*0.5) {
                    this._dir = 'L';
                    isTurn = true;
                }
                break;
            case 'L':
                if (Math.abs(po_0.x-po_1.x) >= this._size*0.5) {
                    this._dir = 'B';
                    isTurn = true;
                }
                break;
            case 'B':
                if (Math.abs(po_0.z-po_1.z) >= this._size*0.5) {
                    this._dir = 'R';
                    isTurn = true;
                }
                break;
            case 'R':
                if (Math.abs(po_0.x-po_1.x) >= this._size*0.5) {
                    this._dir = 'F';
                    isTurn = true;
                }
                break;
            default:break;
        }
        if (isTurn==true) this._sk[0].turnLt();
    }
    turnRt():void{
        let po_0 = this._sk[0].getPo(),
            po_1 = this._sk[1].getPo(),
            isTurn:boolean = false;
        switch (this._dir) {
            case 'F':
                if (Math.abs(po_0.z-po_1.z) >= this._size*0.5) {
                    this._dir = 'R';
                    isTurn = true;
                }
                break;
            case 'R':
                if (Math.abs(po_0.x-po_1.x) >= this._size*0.5) {
                    this._dir = 'B';
                    isTurn = true;
                }
                break;
            case 'B':
                if (Math.abs(po_0.z-po_1.z) >= this._size*0.5) {
                    this._dir = 'L';
                    isTurn = true;
                }
                break;
            case 'L':
                if (Math.abs(po_0.x-po_1.x) >= this._size*0.5) {
                    this._dir = 'F';
                    isTurn = true;
                }
                break;
            default:break;
        }
        if (isTurn==true) this._sk[0].turnRt();
    }

    grow():void{
        let last:number = this._sk.length,
            posi:BABYLON.Vector3 = this._sk[last-1].getPo(),
            newPo:BABYLON.Vector3;
        newPo = new BABYLON.Vector3(posi.x,posi.y,posi.z-this._size);
        this._sk.push(new Item(
            'sk_'+last,
            this._scene,
            newPo,
            this._size,
            this._stepTime,
            this._stepSeg,
            this._scaling
        ));
        this._orbit.push(newPo);
    }

    add():void{this._addAble = true;}

    check():boolean{
        let len = this._sk.length;
        for (let i = 2; i < len; i++) {
            if(this._sk[i].getDis(this.getPo())<=0.7) return true;
        }
        return false;
    }

    stop(score:number):void{
        this._isRuning = false;
    }

    getMesh():Array<BABYLON.Mesh>{
        let mesh:Array<BABYLON.Mesh> = [];
        for (let i = 0; i < this._sk.length; i++) {
            mesh.push(this._sk[i].getMesh());
        }
        return mesh;
    }
}
export default Snake;