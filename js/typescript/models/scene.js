"use strict";
class GameScene {
    // scale: 64;    framerate: 1;    friction: 0.9;
    constructor(canvas, name = null, options = {}) {
        this.gamePool = [];
        this.name = 'Archmiron';
        this.self = this;
        this.isInitialized = false;
        this.Loop = () => {
            if (!this.isInitialized) {
                this.createGameObjects();
                this.isInitialized = true;
            }
            this.Logic();
            this.Draw();
            requestAnimationFrame(this.Loop);
        };
        if (canvas == null)
            throw new Error('Canvas is undefined.');
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.options = options;
        if (typeof name == 'string')
            this.name = name;
        if (this.context == null)
            throw new Error('Canvas Context is undefined.');
    }
    ClearScene() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    Draw() {
        for (const gameobj of this.gamePool) {
            gameobj.Update();
        }
    }
    Start() {
        console.log(this.name);
        this.Loop();
    }
    toString() { return this.name; }
}
