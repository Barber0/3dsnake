import * as BABYLON from '../babylon';

class Cube{
    protected _item:BABYLON.Mesh;
    protected _posi:BABYLON.Vector3;
    protected _rota:any;
    protected _size:number;
    public _scene:BABYLON.Scene;

    constructor(
        name:string,
        scene:BABYLON.Scene,
        posi:BABYLON.Vector3,
        size:number,
        scaling:number,
        type:string = 'snake'
    ){
        this._size = size;
        this._scene = scene;
        this._item = BABYLON.MeshBuilder.CreateBox(name,{
            height:this._size,width:this._size,depth:this._size,updatable:true,sideOrientation:BABYLON.Mesh.DOUBLESIDE
        },this._scene);
        this._posi = this._item.position;
        this._rota = this._item.rotation;

        this._posi.x = posi.x;
        this._posi.z = posi.z;
        this._posi.y = posi.y;
        this._item.scaling = new BABYLON.Vector3(scaling,scaling,scaling);
        let mt = new BABYLON.StandardMaterial('gdmt',this._scene);
        mt.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);
        if (type=='food_2') {
            mt.diffuseColor = new BABYLON.Color3(
                Math.random(), 
                Math.random(),
                Math.random()
            );
        }
        this._item.material = mt;
    }

    getPo():BABYLON.Vector3{return this._item.position;}
    getSize():number{return this._size;}
    getDis(point:BABYLON.Vector3):number{
        let posi:BABYLON.Vector3 = this.getPo(),
            vx:number = point.x-posi.x,
            vy:number = point.y-posi.y,
            vz:number = point.z-posi.z;
        return Math.sqrt(Math.pow(vx,2)+Math.pow(vy,2)+Math.pow(vz,2));
    }

    getMesh():BABYLON.Mesh{
        return this._item;
    }

    remove():void{
        this._scene.removeMesh(this._item);
    }
}
export default Cube;