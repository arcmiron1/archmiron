
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

    tag!: any;

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
    autoUpdate:boolean = true;

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
    public set width(value:  number) { if (typeof this._width == 'undefined' || this._width != value) { this.isUpdated = (this.autoUpdate || this.isUpdated); this._old_width = this._width ?? value; this._width = value; } }
    public set height(value: number) { if (typeof this._height == 'undefined' || this._height != value) { this.isUpdated = (this.autoUpdate || this.isUpdated); this._old_height = this._height ?? value; this._height = value; } }
    public set data(value: string | CanvasImageSource | CanvasPattern | CanvasGradient) { if (typeof this._data == 'undefined' || this._data != value) { this.isUpdated = (this.autoUpdate || this.isUpdated); this._data = value; } }
    public set x(value: number) { if (typeof this._x == 'undefined' || this._x != value) { this.isUpdated = (this.autoUpdate || this.isUpdated); this._old_x = this.x ?? value; this._x = value; } }
    public set y(value: number) { if (typeof this._y == 'undefined' || this._y != value) { this.isUpdated = (this.autoUpdate || this.isUpdated); this._old_y = this.y ?? value; this._y = value; } }
    public set vx(value: number) { if (typeof this._vx == 'undefined' || this._vx != value) { this.isUpdated = (this.autoUpdate || this.isUpdated); this._vx = value; } }
    public set vy(value: number) { if (typeof this._vy == 'undefined' || this._vy != value) { this.isUpdated = (this.autoUpdate || this.isUpdated); this._vy = value; } }
    public set type(value: GameObjectType) { if (typeof this._type == 'undefined' || this._type != value) { this.isUpdated = (this.autoUpdate || this.isUpdated); this._type = value;this.AnalyzeType(); } }


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
            this.context.clearRect(this._old_x + this.translateX, this._old_y + this.translateY, this._old_width, this._old_height);
            // this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            if (this.image != null) {
                this.context.imageSmoothingEnabled = false;
                this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
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
                    this.image.onload = function() {self.isUpdated = true;}
                }else if (typeof this.data == 'object') {
                    this.image = this.data as HTMLImageElement;
                }
                // image takes time to load...
                // it will be more appropriate to create a loading screen
                // this.image.onload = function() {self.isUpdated = true;} // To be Uncomment
                break;
        
            default:
                break;
        }
    }
    Collision(obj: GameObject): boolean {
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