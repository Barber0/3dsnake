import * as BABYLON from '../babylon';
import Cube from './cube';
import Snake from './snake';

class Food extends Cube{
    public score:number = 0;
    public type:string;

    constructor(name:string,
        scene:BABYLON.Scene,
        posi:BABYLON.Vector3,
        size:number,
        scaling:number,
        type:string
    ){
        super(name,scene,posi,size,scaling,type);
        this.type = type;
        if (type=='food_1') {
            this.score = 1;
        }else if(type=='food_2'){
            this.score = 2;
        }
    }
}

class Foods{
    private _scene:BABYLON.Scene;
    private _gdSize:number;
    private _eaten:number;
    private _foods_1:Array<Food> = [];
    private _foods_2:Array<Food> = [];
    private _count:number = 0;
    private _score:number = 0;

    constructor(scene:BABYLON.Scene,gdSize:number){
        this._scene = scene;
        this._gdSize = gdSize;
    }

    createFood(isFloat:boolean = false):void{
        let ranX = (Math.random()*this._gdSize-this._gdSize/2)*0.75,
            ranZ = (Math.random()*this._gdSize-this._gdSize/2)*0.75,
            Y = 1,
            food:Food,
            type:string = 'food_1';
        if (isFloat==true) {
            Y = Math.random()*3+2;
            food = new Food(
                'food_'+ this._count,
                this._scene,
                new BABYLON.Vector3(ranX,Y,ranZ),
                2,
                0.9,
                'food_2'
            );
            this._foods_2.push(food);
        }else{
            food = new Food(
                'food_'+ this._count,
                this._scene,
                new BABYLON.Vector3(ranX,Y,ranZ),
                2,
                0.9,
                'food_1'
            );
            this._foods_1.push(food);            
        }
11    }

    eaten_1(index:number):void{
        this._score += this._foods_1[index].score;
        this._foods_1[index].remove();
        this._foods_1.splice(index,1);
        this.createFood(false);
    }

    eaten_2(index:number):void{
        this._score += this._foods_2[index].score;
        this._foods_2[index].remove();
        this._foods_2.splice(index,1);
        this.createFood(true);
    }

    check(point:BABYLON.Vector3,sk:Snake):void{
        let score = 0;
        this._foods_1.forEach((val,idx) => {
            if (val.getDis(point)<1.5) {
                this.eaten_1(idx);
                if (localStorage.maxScore) {
                    if (this._score>localStorage.maxScore) {
                        localStorage.maxScore = this._score;
                    }
                }else{
                    localStorage.maxScore = 0;
                }
                sk.grow();
            }
        });
        this._foods_2.forEach((val,idx) => {
            if (val.getDis(point)<1.5) {
                this.eaten_2(idx);
                if (localStorage.maxScore) {
                    if (this._score>localStorage.maxScore) {
                        localStorage.maxScore = this._score;
                    }
                }else{
                    localStorage.maxScore = 0;
                }
                sk.grow();
            }
        });
    }

    getScore():number{return this._score;}

    clean():void{
        this._foods_1.forEach((val,idx) => {
            this._foods_1[idx].remove();
        });
        this._foods_2.forEach((val,idx)=>{
            this._foods_2[idx].remove();
        })
        this._score = 0;
        this._foods_1=[];   this._foods_2=[];
    }
}
export default Foods;