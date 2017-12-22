import * as BABYLON from '../babylon';
import Cube from './cube';
import Snake from './snake';

class Food extends Cube{
    public score:number = 0;

    constructor(name:string,
        scene:BABYLON.Scene,
        posi:BABYLON.Vector3,
        size:number,
        scaling:number,
        type:string
    ){
        super(name,scene,posi,size,scaling,type);
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
    private _foods:Array<Food> = [];
    private _count:number = 0;
    private _score:number = 0;

    constructor(scene:BABYLON.Scene,gdSize:number){
        this._scene = scene;
        this._gdSize = gdSize;
    }

    createFood():void{
        let ranX = (Math.random()*this._gdSize-this._gdSize/2)*0.75,
            ranZ = (Math.random()*this._gdSize-this._gdSize/2)*0.75,
            Y = 1,
            food:Food,
            type:string = 'food_1';
        if (this._score+1 % 3 ==0) {
            Y = Math.random()*3+2;
            type = 'food_2';
        }
        food = new Food(
            'food_'+ this._count,
            this._scene,
            new BABYLON.Vector3(ranX,Y,ranZ),
            2,
            0.9,
            type
        );
        this._foods.push(food);
    }

    eaten(index:number):void{
        this._score += this._foods[index].score;
        this._foods[index].remove();
        this._foods.splice(index,1);
        this.createFood();
    }

    check(point:BABYLON.Vector3,sk:Snake):void{
        let score = 0;
        for(let i=0;i<this._foods.length;i++) 
            if(this._foods[i].getDis(point)<1.5) {
                this.eaten(i);
                if (localStorage.maxScore) {
                    if (this._score>localStorage.maxScore) {
                        localStorage.maxScore = this._score;
                    }
                }else{
                    localStorage.maxScore = 0;
                }
                sk.grow();
            }
    }

    getScore():number{return this._score;}

    clean():void{
        for (let i = 0; i < this._foods.length; i++) {
            this._foods[i].remove();
        }
        this._score = 0;
        this._foods = [];
    }
}
export default Foods;