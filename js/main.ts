abstract class GameScene {
    gameObjectPool: Array<GameObject> = [];
    context: CanvasRenderingContext2D;

    name           : string = 'Archmiron';
    canvas         : HTMLCanvasElement;
    scale          : number;
    framerate      : number;
    friction       : number;
    self           : GameScene = this;
    isInitialized  : boolean = false;


    constructor(canvas: HTMLCanvasElement | null, name: string | null = null) {

        if (canvas == null) 
            throw new Error('Canvas is undefined.');

        this.canvas     = canvas;
        this.context    = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.scale    = 64;
        this.framerate = 1;
        this.friction = 0.9;

        // additional options
        // this.context.imageSmoothingEnabled = false;
        // this.canvas.width = 1300;
        // this.canvas.height = 1300 * 0.5625;

        if (typeof name == 'string') this.name = name;

        if (this.context == null) 
            throw new Error('Canvas Context is undefined.');
        
    }
    ClearScene() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    abstract createGameObjects(): void;
    abstract Logic(): void;

    Draw() {
        for (const gameobj of this.gameObjectPool) {
            gameobj.Update();
        }
    }
    Loop = () => {
        if (!this.isInitialized) { this.createGameObjects(); this.isInitialized = true; }
        this.Logic();
        this.Draw();
        requestAnimationFrame(this.Loop);
    }
    Start() {
        console.log(this.name);
        this.Loop();
    }
    toString() { return this.name; }

}

// class Camera {
    
// }

enum GameObjectType {
    image,
    color
}

class GameObject {
    private _width!: number;
    private _height!: number;
    private _data!: string | CanvasImageSource | CanvasPattern | CanvasGradient;
    private _x!: number;
    private _y!: number;

    translateX: number = 0;
    translateY: number = 0;

    _old_x!: number;
    _old_y!: number;

    _old_width!: number;
    _old_height!: number;

    private _vx!: number;
    private _vy!: number;
    private _type!: GameObjectType;
    image!: HTMLImageElement;
    context!: CanvasRenderingContext2D;

    isUpdated:boolean = false;

    // getter & setter
    
    public get width() : number { return this._width; }
    public get height(): number { return this._height; }
    public get data(): string | CanvasImageSource | CanvasPattern | CanvasGradient { return this._data; }
    public get x(): number { return this._x; }
    public get y(): number { return this._y; }
    public get vx(): number { return this._vx ?? 0; }
    public get vy(): number { return this._vy ?? 0; }
    public get type(): GameObjectType { return this._type; }
    
    // what is the use of setter? if data has been updated, then it will only update that specifc object, this is to avoid updating the whole canvas thus resulting to slower speed.
    public set width(value:  number) { if (typeof this._width == 'undefined' || this._width != value) { this.isUpdated = true; this._old_width = this._width ?? value; this._width = value; } }
    public set height(value: number) { if (typeof this._height == 'undefined' || this._height != value) { this.isUpdated = true; this._old_height = this._height ?? value; this._height = value; } }
    public set data(value: string | CanvasImageSource | CanvasPattern | CanvasGradient) { if (typeof this._data == 'undefined' || this._data != value) { this.isUpdated = true; this._data = value; } }
    public set x(value: number) { if (typeof this._x == 'undefined' || this._x != value) { this.isUpdated = true; this._old_x = this.x ?? value; this._x = value; } }
    public set y(value: number) { if (typeof this._y == 'undefined' || this._y != value) { this.isUpdated = true; this._old_y = this.y ?? value; this._y = value; } }
    public set vx(value: number) { if (typeof this._vx == 'undefined' || this._vx != value) { this.isUpdated = true; this._vx = value; } }
    public set vy(value: number) { if (typeof this._vy == 'undefined' || this._vy != value) { this.isUpdated = true; this._vy = value; } }
    public set type(value: GameObjectType) { if (typeof this._type == 'undefined' || this._type != value) { this.isUpdated = true; this._type = value; } }


    constructor(context: CanvasRenderingContext2D, width: number, height: number, data: string, x: number, y: number, type: GameObjectType) {
        this.width      = width;
        this.height     = height;
        this.data       = data;
        this.x          = x;
        this.y          = y;
        this.type       = type;
        this.context    = context;
        this.AnalyzeType();
    }
    // The Player class has it own update so try to check that out first
    Update(force = false) {
        if (this.isUpdated == true || force==true) {
            // this.context.clearRect(this._old_x + this.translateX+2, this._old_y + this.translateY+2, this._old_width-3, this._old_height-3);
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            if (this.image != null) {
                this.context.imageSmoothingEnabled = false;
                this.context.drawImage(this.image, this.x + this.translateX, this.y + this.translateY, this.width, this.height);
            }else {
                this.context.fillStyle = this.data as string;
                this.context.fillRect(this.x + this.translateX, this.y + this.translateY, this.width, this.height);
            } this.isUpdated = false;
        }
    }
    AnalyzeType() {
        let self = this;
        switch (this.type) {
            case GameObjectType.image:
                if ( typeof this.data == 'string' ) {
                    this.image = new Image();
                    this.image.src = this.data as string;
                }else if (typeof this.data == 'object') {
                    this.image = this.data as HTMLImageElement;
                }
                // image takes time to load...
                // it will be more appropriate to create a loading screen
                this.image.onload = function() {self.isUpdated = true;}
                break;
        
            default:
                break;
        }
    }
    Collision(obj: GameObject): boolean {

        // console.log(' ');
        // console.log('this.x: ', this.x);
        // console.log('obj.x: ', obj.x);
        
        // console.log('this.width: ', this.width);
        // console.log('obj.width: ', obj.width);


        // console.log('this.y: ', this.y);
        // console.log('obj.y: ', obj.y);
        
        // console.log('this.height: ', this.height);
        // console.log('obj.height: ', obj.height);



        // console.log('this.x < obj.x + obj.width: ', this.x < obj.x + obj.width);
        // console.log('this.x + this.width > obj.x: ', this.x + this.width > obj.x);
        // console.log('this.y < obj.y + obj.height: ', this.y < obj.y + obj.height);
        // console.log('this.y + this.height > obj.y: ', this.y + this.height > obj.y);
        // this.data = 'green';
        if (
            this.x < obj.x + obj.width &&
            this.x + this.width > obj.x &&
            this.y < obj.y + obj.height &&
            this.y + this.height > obj.y
        ) {
            // this.data = 'green';
            return true;
        } return false;
    }
    toString():string {
        return 'x: ' + Math.floor(this.x) + ', y: ' + Math.floor(this.y) + ', w: ' + Math.floor(this.width) + ', h: ' + Math.floor(this.height);
    }

    clone(): GameObject {
        return new GameObject(this.context, this.width, this.height, this.data as string, this.x, this.y, this.type);
    }

}

class Player extends GameObject {
    currentPosition:string = 'front';
    currentFrame: number = 0;
    frame: any = [];
    private movementFramerate: number = 0;

    constructor(context: CanvasRenderingContext2D, width: number, height: number, x: number, y: number) {
        super(context, width, height, 'sprite/player.png', x, y, GameObjectType.image);
        
        this.frame['front'] = [];
        this.frame['front'].push([9, 12, 14, 19]);
        this.frame['front'].push([41, 12, 14, 19]);
        this.frame['front'].push([73, 12, 14, 19]);
        this.frame['front'].push([105, 12, 14, 19]);
        
        this.frame['right'] = [];
        this.frame['right'].push([9, 44, 14, 19]);
        this.frame['right'].push([41, 44, 14, 19]);
        this.frame['right'].push([73, 44, 14, 19]);
        this.frame['right'].push([105, 44, 14, 19]);
        
        this.frame['back'] = [];
        this.frame['back'].push([9, 76, 14, 19]);
        this.frame['back'].push([41, 76, 14, 19]);
        this.frame['back'].push([73, 76, 14, 19]);
        this.frame['back'].push([105, 76, 14, 19]);
        
        this.frame['left'] = [];
        this.frame['left'].push([9, 108, 14, 19]);
        this.frame['left'].push([41, 108, 14, 19]);
        this.frame['left'].push([73, 108, 14, 19]);
        this.frame['left'].push([105, 108, 14, 19]);
        
    }

    Update(force = false) {
        if (this.isUpdated == true || force==true) {
            if (this.image != null) {
                // this.context.clearRect(this._old_x, this._old_y, this._old_width, this._old_height);
                this.context.clearRect(((this.context.canvas.width / 2) - (this.width/2)), ((this.context.canvas.height / 2) - (this.height / 2)), this._old_width, this._old_height);
                // this.context.clearRect(((this.context.canvas.width / 2) - (this.width/2)), ((this.context.canvas.height / 2) - (this.height / 2)), this._old_width, this._old_height);
                this.context.imageSmoothingEnabled = false;
                // console.log(this.image, this.frame[this.currentPosition][this.currentFrame][0], this.frame[this.currentPosition][this.currentFrame][1], this.frame[this.currentPosition][this.currentFrame][2], this.frame[this.currentPosition][this.currentFrame][3], this.x, this.y, this.width, this.height);
                // this.context.drawImage(this.image, this.frame[this.currentPosition][this.currentFrame][0], this.frame[this.currentPosition][this.currentFrame][1], this.frame[this.currentPosition][this.currentFrame][2], this.frame[this.currentPosition][this.currentFrame][3], ((this.context.canvas.width / 2) - (this.width/2)), ((this.context.canvas.height / 2) - (this.height / 2)), this.width, this.height);
                this.context.drawImage(this.image, this.frame[this.currentPosition][this.currentFrame][0], this.frame[this.currentPosition][this.currentFrame][1], this.frame[this.currentPosition][this.currentFrame][2], this.frame[this.currentPosition][this.currentFrame][3], ((this.context.canvas.width / 2) - (this.width/2)), ((this.context.canvas.height / 2) - (this.height / 2)), this.width, this.height);
            } this.isUpdated = false;   
        }
    }
    
    nextFrame() {
        this.currentFrame = Math.ceil(this.movementFramerate / 10);
        if (this.currentFrame == 3) this.movementFramerate = 0;
        else this.movementFramerate++;
        // if (this.currentFrame == 3) this.currentFrame = 0;
        // else this.currentFrame++;
    }
    resetFrame() {
        this.currentFrame = 0;
    }

}

class MapScene extends GameScene  {
    noiseMap: any = [];
    noiseMapObj: GameObject[][] = [];
    camera: any = {
        x: 0,
        y: 0,
        xC: 0,
        yC: 0
    };

    adjustCamera(x: number, y: number) {
        this.camera.x = (x - (x % this.scale)) / this.scale;
        this.camera.y = (y - (y % this.scale)) / this.scale;

        this.camera.x = (x / this.scale);
        this.camera.y = (y / this.scale);

        this.camera.xC = Math.floor(this.canvas.width / this.scale);
        this.camera.yC = Math.floor(this.canvas.height / this.scale);

        let x_sign = Math.floor(this.camera.x) - Math.floor((this.camera.xC / 2));
        let y_sign = Math.floor(this.camera.y) - Math.floor((this.camera.yC / 2));

        let xAdd = 0;
        let yAdd = 0;

        if (x_sign < 0) xAdd = xAdd - x_sign;
        if (y_sign < 0) yAdd = yAdd - y_sign;

        let x_final = Math.max(x_sign + xAdd, Math.floor(this.camera.x) + Math.floor(this.camera.xC / 2) + xAdd);
        let y_final = Math.max(y_sign + yAdd, Math.floor(this.camera.y) + Math.floor(this.camera.yC / 2) + yAdd);

        this.context.save();
        let translateX = (this.camera.x * this.scale * -1) + ((this.context.canvas.width / 2));
        let translateY = (this.camera.y * this.scale * -1) + ((this.context.canvas.height / 2));

        // if (translateX > 0) {
        //     this.context.clearRect(0,0,translateX, this.context.canvas.height);
        // }
        // if (translateY > 0) {
        //     this.context.clearRect(0,0,this.context.canvas.width, translateY);
        // }

        // this.context.translate(translateX, translateY);
        for (let i = Math.max(0, x_sign); i < (x_final + this.camera.xC); i++) {
            for (let j = (Math.max(0, y_sign)); j < (y_final + this.camera.yC); j++) {
                // this.noiseMapObj[i][j].translateX = -(this.camera.xC * this.scale);
                // this.noiseMapObj[i][j].translateY = -(this.camera.yC * this.scale);
                if (this.noiseMapObj[i] == undefined) continue;
                if (this.noiseMapObj[i][j] == undefined) continue;
                this.noiseMapObj[i][j].x -=3;
                this.noiseMapObj[i][j].isUpdated = true;
                this.noiseMapObj[i][j].Update(true);

            }
        }
        // this.context.restore();
        // console.log((this.camera.x * this.scale * -1), (this.camera.y * this.scale * -1));
        // console.log('x', this.camera.x);
        // console.log('y', this.camera.y);
        // console.log('xC', this.camera.xC);
        // console.log('yC', this.camera.yC);
        // console.log('x_sign', x_sign);
        // console.log('y_sign', y_sign);
        // console.log('x_final', x_final);
        // console.log('y_final', y_final);
        // console.log('xAdd', xAdd);
        // console.log('yAdd', yAdd);
        // console.log();
        // console.log();
        // console.log();
        // console.log();


        /*

            if xsign < 0
                added = 

            xC / 2;
            yC / 2;

            X_signifacant
            from x - (xC / 2)

            Y_significant
            from y - (yC / 2)

            only draw when inside X_significant and Y_significant
        */
    }

    createGameObjects(): void {
        // var bg: GameObject = new GameObject(this.context, this.canvas.width, this.canvas.height, 'white', 0, 0, GameObjectType.color);
        // this.gameObjectPool.push(bg);
        // console.log(this.gameObjectPool.length);
        // throw new Error("Method not implemented.");
        this.generateNoise((1300/2),(1300/2)*0.5625);
        this.cellularAutomata();
        // this.gameObjectPool.push()
    }
    Logic(): void { 
        
        // throw new Error("Method not implemented.");
    }
    generateNoise(w: number, h: number) {
        for (let i = 0; i < w; i++) {
            this.noiseMap[i] = [];
            for (let j = 0; j < h; j++) {
                // noiseMap[i][j] = Math.round(Math.sin(i*Math.random()*10) * Math.cos(j*Math.random()*10));
                // noiseMap[i][j] = Math.cos(j) * Math.sin(i);
                // let density = Math.round(Math.random()*10);
                
                this.noiseMap[i][j] = Math.random();
                this.noiseMap[i][j] = Math.round(this.noiseMap[i][j]);
                // this.noiseMap[i][j] = (density < 8) ? 1 : 0;
                // noiseMap[i][j] = Math.round(Math.random());//Math.round(Math.sin(i*Math.random()*10) * Math.cos(j*Math.random()*10));
            }   
        } return this.noiseMap;
        // throw new Error("Method not implemented.");
    }
    cellularAutomata(noiseLoop = 50, noiseThreshold = 4, noiseOpposite = 1, again = false) {
        
        var noiseLoop = 1;
        var noiseThreshold = 4;
        var noiseOpposite = 1;
        var w = this.noiseMap.length, h = this.noiseMap[this.noiseMap.length - 1].length;
    
        var unbiasedX = [...Array(w).keys()];
        var unbiasedY = [...Array(h).keys()];
    
        unbiasedX = unbiasedX.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)
        unbiasedY = unbiasedY.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value)
    
        var uX, uY;
        this.scale = 64; 

        for (let p = 0; p < noiseLoop; p++) {
            var currentTile = 0;
            var neighbor = [];
            var wallCounter = 0;
            for (let x = 0; x < w; x++) { // width
                for (let y = 0; y < h; y++) { // height
    
                    uX = unbiasedX[x];
                    uY = unbiasedY[y];
    
                    wallCounter = 0;
                    
                    currentTile = this.noiseMap[uX][uY];
    
                    // if (currentTile == 0) continue;
                    if (currentTile == 0) wallCounter++;
    
                    neighbor[0]   = this.getNoiseValue(uX, uY-1);
                    neighbor[1]   = this.getNoiseValue(uX, uY+1);
                    neighbor[2]  = this.getNoiseValue(uX-1, uY);
                    neighbor[3] = this.getNoiseValue(uX+1, uY);
                    
                    neighbor[4] = this.getNoiseValue(uX-1, uY-1);
                    neighbor[5] = this.getNoiseValue(uX-1, uY+1);
                    
                    neighbor[6] = this.getNoiseValue(uX+1, uY-1);
                    neighbor[7] = this.getNoiseValue(uX+1, uY+1);
                    noiseThreshold = Math.ceil(neighbor.length / 2)
    
    
                    for (const n in neighbor) {
                        // console.log('each neighbor: ', n);
                        if (neighbor[n] == 0) wallCounter++;
                    }
    
                    
                    if (wallCounter > noiseThreshold) {
                        this.noiseMap[uX][uY] = Math.max(0, -noiseOpposite);
                    }else {
                        this.noiseMap[uX][uY] = Math.max(0, noiseOpposite);
                    }
                    // console.log(noise_com[x][y]);
    
                    const p_color = this.noiseMap[uX][uY] * 255;
    
                    if (this.noiseMapObj[uX] == undefined) {
                        this.noiseMapObj[uX] = [];
                    }
    
                    if (this.noiseMapObj[uX][uY] == undefined) {
                        this.noiseMapObj[uX][uY] = new GameObject(this.context, 1*this.scale, 1*this.scale, ((uX+uY) % 2 == 0) ? 'gray' : 'black', uX*this.scale, uY*this.scale, GameObjectType.color);
                        // if (this.noiseMap[uX][uY] == 0) 
                        this.gameObjectPool.push(this.noiseMapObj[uX][uY]);
                        // console.log('hell');
                    }
                    this.noiseMapObj[uX][uY].data = "rgb(" + p_color + ', ' + p_color + ', ' + p_color + ")";
                    this.noiseMapObj[uX][uY].Update(true);
                    
                    // console.log(neighbor);
                    // console.log('wallCounter: ', wallCounter);
                    // break;
    
                } // break;
            } 
        }
        // requestAnimationFrame(cellularAutomata);
    }
    getNoiseValue(x: number,y: number) {
        try { return this.noiseMap[x][y] ?? 0; }
        catch (error) { return 0; }
    }
    

    
}


class PlayerScene extends GameScene  {
    private keyMaps: object | undefined | any;
    private player!: Player;
    private backgroundMap!: MapScene;
    private lastCollision!: GameObject;

    private starMovement: {top: [number, number], right: [number, number], bottom: [number, number], left: [number, number]} = {
        top       : [38, 87],
        right     : [39, 68],
        bottom    : [40, 83],
        left      : [37, 65],
    };

    bindInput(keyMaps: object) { this.keyMaps = keyMaps; }
    bindMap(backgroundMap: MapScene) { this.backgroundMap = backgroundMap; }

    createGameObjects(): void {
        var w = 64;
        this.player = new Player(this.context, w, w, ((this.context.canvas.width / 2) - (w)), ((this.context.canvas.height / 2) - (w)));
        this.gameObjectPool.push(this.player);

        // throw new Error("Method not implemented.");
    }
    Logic(): void {
        if (this.Movements()) {
            if (this.backgroundMap != undefined) {
                // let nx = Math.floor(this.player.x / this.scale),ny = Math.floor(this.player.y / this.scale);

                // if (this.backgroundMap.noiseMapObj[nx] != undefined && this.backgroundMap.noiseMapObj[nx][ny])
                //     this.backgroundMap.noiseMapObj[nx][ny].Collision(this.player);
                // this.backgroundMap.noiseMapObj[nx-1][ny].Collision(this.player);
                
                // this.player.Collision(this.backgroundMap.noiseMapObj[nx][ny]);

                // this.backgroundMap.adjustCamera(this.player.x, this.player.y);
            }
        }
        // throw new Error("Method not implemented.");
    }
    Movements():boolean {
        let isMove = false;
        let movementSpeed = 1.5;
        this.friction = 0.8;    
        let movementDown = {
            top: false,
            left: false,
            right: false,
            bottom: false
        };
        let movementCross = {
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false
        }
        for (var key in this.keyMaps) {
            if (Object.hasOwnProperty.call(this.keyMaps, key)) {
                const value = this.keyMaps[key];
                if (value == true) {
                    let keyNum: number = parseInt(key);
                    if (this.starMovement .top.includes(keyNum)) {
                        movementDown.top = true;
                    }
                    if (this.starMovement.right.includes(keyNum)) {
                        movementDown.right = true;
                    }
                    if (this.starMovement.bottom.includes(keyNum)) {
                        movementDown.bottom = true;
                    }
                    if (this.starMovement.left.includes(keyNum)) {
                        movementDown.left = true;
                    }
                }
            }
        }
        movementCross.topLeft = (movementDown.top && movementDown.left);
        movementCross.topRight = (movementDown.top && movementDown.right);
        movementCross.bottomLeft = (movementDown.bottom && movementDown.left);
        movementCross.bottomRight = (movementDown.bottom && movementDown.right);

        isMove = true;
        switch (true) {
            case movementCross.topLeft:
                this.player.vx -= movementSpeed*.7 ;
                this.player.vy -= movementSpeed*.7 ;
                this.player.currentPosition = 'left';
                break;
            case movementCross.topRight:
                this.player.vx += movementSpeed*.7 ;
                this.player.vy -= movementSpeed*.7 ;
                this.player.currentPosition = 'right';
                break;

            case movementCross.bottomLeft:
                this.player.vx -= movementSpeed*.7 ;
                this.player.vy += movementSpeed*.7 ;
                this.player.currentPosition = 'left';
                break;

            case movementCross.bottomRight:
                this.player.vx += movementSpeed*.7 ;
                this.player.vy += movementSpeed*.7 ;
                this.player.currentPosition = 'right';
                break;
                    



            case movementDown.top:
                this.player.vy -= movementSpeed ;
                this.player.currentPosition = 'back';
                break;
            case movementDown.right:
                this.player.vx += movementSpeed ;
                this.player.currentPosition = 'right';
                break;

            case movementDown.left:
                this.player.vx -= movementSpeed ;
                this.player.currentPosition = 'left';
                break;

            case movementDown.bottom:
                this.player.vy += movementSpeed ;
                this.player.currentPosition = 'front';
                break;
                    
            default:
                isMove = false;
                break;
        }


        this.player.vx *= this.friction;
        this.player.vy *= this.friction;

    
        this.backgroundMap.camera.x = (this.player.x - (this.player.x % this.backgroundMap.scale)) / this.backgroundMap.scale;
        this.backgroundMap.camera.y = (this.player.y - (this.player.y % this.backgroundMap.scale)) / this.backgroundMap.scale;

        this.backgroundMap.camera.x = (this.player.x / this.backgroundMap.scale);
        this.backgroundMap.camera.y = (this.player.y / this.backgroundMap.scale);

        this.backgroundMap.camera.xC = Math.floor(this.backgroundMap.canvas.width / this.backgroundMap.scale);
        this.backgroundMap.camera.yC = Math.floor(this.backgroundMap.canvas.height / this.backgroundMap.scale);

        let x_sign = Math.floor(this.backgroundMap.camera.x) - Math.floor((this.backgroundMap.camera.xC / 2));
        let y_sign = Math.floor(this.backgroundMap.camera.y) - Math.floor((this.backgroundMap.camera.yC / 2));

        let xAdd = 0;
        let yAdd = 0;

        if (x_sign < 0) xAdd = xAdd - x_sign;
        if (y_sign < 0) yAdd = yAdd - y_sign;

        let x_final = Math.max(x_sign + xAdd, Math.floor(this.backgroundMap.camera.x) + Math.floor(this.backgroundMap.camera.xC / 2) + xAdd);
        let y_final = Math.max(y_sign + yAdd, Math.floor(this.backgroundMap.camera.y) + Math.floor(this.backgroundMap.camera.yC / 2) + yAdd);

        // let translateX = (this.backgroundMap.camera.x * this.scale * -1) + ((this.context.canvas.width / 2));
        // let translateY = (this.backgroundMap.camera.y * this.scale * -1) + ((this.context.canvas.height / 2));


        // if (translateX > 0) {
        //     this.context.clearRect(0,0,translateX, this.context.canvas.height);
        // }
        
        

        // if (this.backgroundMap.camera.x < 0) {
        //     this.backgroundMap.context.clearRect(0,0, Math.floor(this.backgroundMap.camera.x * this.backgroundMap.scale * -1), this.backgroundMap.context.canvas.height);
        //     // console.log(Math.floor(this.backgroundMap.camera.x * this.backgroundMap.scale * -1));
        // }
        // if (this.backgroundMap.camera.y < 0) {
        //     this.backgroundMap.context.clearRect(0, 0, this.backgroundMap.context.canvas.width, Math.floor(this.backgroundMap.camera.y * this.backgroundMap.scale * -1));
        //     // console.log(Math.floor(this.backgroundMap.camera.y * this.backgroundMap.scale * -1));
        //     // console.log(0, 0, this.context.canvas.width, Math.floor(this.backgroundMap.camera.y * this.backgroundMap.scale * -1));
        // }


        let stopper = false;
        this.backgroundMap.gameObjectPool.forEach((value) => {
            // value.x -= this.player.vx;
            // value.y -= this.player.vy;
            value.x -= this.player.vx;
            value.y -= this.player.vy;
            value.isUpdated = false;
            // let clonePlayer = this.player.clone();
            

            if ((
                value.x >= (0 - value.width) &&
                value.x <= this.canvas.width &&
                value.y >= (0 - value.height) &&
                value.y <= this.canvas.height 
                )) {
                    
                    if (
                        
                        this.player.Collision(value)
                        // value.Collision(this.player)
                    
                    && value.data == "rgb(0, 0, 0)") {
                        // if (this.lastCollision != value) {
                            // value.data = 'green';
                            value.x += this.player.vx;
                            value.y += this.player.vy;
                            this.player.vx = 0;
                            this.player.vy = 0;
                            // value.isUpdated = false;
                            // console.log('Collision Player with: ', value.x, ', ', value.y, ': ', value.data);
                        // }
                        // this.lastCollision = value;
                    }
                    
                    value.Update(true);
                    // console.log('');
                    // console.log('Player: ', "\n", this.player.toString(), "\n", 'Other: ', "\n", value.toString());
                    // console.log('Other: ', value.toString());    



                }else {
                    value.isUpdated = false;
                }

        });

        // this.player.x += this.player.vx;
        // this.player.y += this.player.vy;

        // for (let i = Math.max(0, x_sign); i < (x_final + this.backgroundMap.camera.xC); i++) {
        //     for (let j = (Math.max(0, y_sign)); j < (y_final + this.backgroundMap.camera.yC); j++) {
        //         if (this.backgroundMap.noiseMapObj[i] == undefined) continue;
        //         if (this.backgroundMap.noiseMapObj[i][j] == undefined) continue;

        //         // this.backgroundMap.noiseMapObj[i][j].x -= this.player.vx;
        //         // this.backgroundMap.noiseMapObj[i][j].y -= this.player.vy;
        //         this.backgroundMap.noiseMapObj[i][j].isUpdated = true;
        //         this.backgroundMap.noiseMapObj[i][j].Update(true);

        //     }
        // }



    /*
        this.context.save();
        let translateX = (this.backgroundMap.camera.x * this.scale * -1) + ((this.context.canvas.width / 2));
        let translateY = (this.backgroundMap.camera.y * this.scale * -1) + ((this.context.canvas.height / 2));

        // if (translateX > 0) {
        //     this.context.clearRect(0,0,translateX, this.context.canvas.height);
        // }
        // if (translateY > 0) {
        //     this.context.clearRect(0,0,this.context.canvas.width, translateY);
        // }

        // this.context.translate(translateX, translateY);
        for (let i = Math.max(0, x_sign); i < (x_final + this.camera.xC); i++) {
            for (let j = (Math.max(0, y_sign)); j < (y_final + this.camera.yC); j++) {
                // this.noiseMapObj[i][j].translateX = -(this.camera.xC * this.scale);
                // this.noiseMapObj[i][j].translateY = -(this.camera.yC * this.scale);
                if (this.noiseMapObj[i] == undefined) continue;
                if (this.noiseMapObj[i][j] == undefined) continue;
                this.noiseMapObj[i][j].x -=3;
                this.noiseMapObj[i][j].isUpdated = true;
                this.noiseMapObj[i][j].Update(true);

            }
        }
    */



        
        
        // let nx = Math.floor(this.player.x / this.scale),ny = Math.floor(this.player.y / this.scale);

        // if (this.backgroundMap.noiseMapObj[nx-1] != undefined && this.backgroundMap.noiseMapObj[nx-1][ny]) {
        //     // this.backgroundMap.noiseMapObj[nx-1][ny].Collision(this.player);
        //     if (this.backgroundMap.noiseMap[nx][ny] == 0) {
        //         this.player.x = Math.max(this.player.x, Math.ceil(this.backgroundMap.noiseMapObj[nx][ny].x + (this.backgroundMap.noiseMapObj[nx][ny].width)));
        //         this.player.y = Math.max(this.player.y, Math.ceil(this.backgroundMap.noiseMapObj[nx][ny].y + (this.backgroundMap.noiseMapObj[nx][ny].height) ));

        //         // this.player.x = Math.min(this.player.x, Math.ceil(this.backgroundMap.noiseMapObj[nx][ny].x + (this.backgroundMap.noiseMapObj[nx][ny].width) ));
        //         // this.player.y = Math.min(this.player.y, Math.ceil(this.backgroundMap.noiseMapObj[nx][ny].y + (this.backgroundMap.noiseMapObj[nx][ny].height)));
        //     }
        // }

        // this.player.isUpdated = false;
        // isMove = false;

        if (!isMove) {
            this.player.resetFrame();
            this.player.Update(true);
        }else {
            this.player.nextFrame();
        }
        return isMove;
    }
    
}


class NormalScene extends GameScene  {
    createGameObjects(): void {
        // throw new Error("Method not implemented.");
    }
    Logic(): void {
        // throw new Error("Method not implemented.");
    }
}

