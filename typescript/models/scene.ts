abstract class GameScene {
    gamePool: Array<GameObject> = [];
    context: CanvasRenderingContext2D;

    name           : string = 'Archmiron';
    canvas         : HTMLCanvasElement;
    self           : GameScene = this;
    isInitialized  : boolean = false;

    options        : any;
    // scale: 64;    framerate: 1;    friction: 0.9;

    constructor(canvas: HTMLCanvasElement | null, name: string | null = null, options = {}) {

        if (canvas == null) 
            throw new Error('Canvas is undefined.');

        this.canvas     = canvas;
        this.context    = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.options    = options;

        if (typeof name == 'string') this.name = name;

        if (this.context == null) 
            throw new Error('Canvas Context is undefined.');
        
    }

    ClearScene() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * You will initialize all the objects here
     */
    abstract createGameObjects(): void;


    /**
     * Movement and Collision Logic? and some other hp and other status
     */
    abstract Logic(): void;


    Draw() {
        for (const gameobj of this.gamePool) {
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
