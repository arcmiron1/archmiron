var mapKeys = {};

var noise = [];
var noise_com = [];

function createNoise(w,h) {
    for (let i = 0; i < w; i++) {
        noise[i] = [];
        for (let j = 0; j < h; j++) {
            noise[i][j] = Math.round(Math.sin(i*Math.random()*10) * Math.cos(j*Math.random()*10));
        }
    }
}


function startGame() {
    arch.start();
    myGamePiece = new component(10, 10, "rgba(0, 0, 255, 1)", 1, 1);
    console.log('shet');
    createNoise(260, 146);
    updateGameArea();;
}

var arch = {
    change_occur: false,
    scale: 5,
    framerate: 1,
    friction: 0.90,
    canvas: document.getElementById("game"),
    start: function () {
        console.log(this.canvas.width, ', ', this.canvas.height);
        this.canvas.width = 1300;
        this.canvas.height = 1300 * 0.5625;
        this.context = this.canvas.getContext("2d");
        requestAnimationFrame(updateGameArea);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    movements: {'top' : [38, 87], 'right': [39, 68], 'bottom': [40, 83], 'left': [37, 65]},
    _framerate: 0
}

var hello = false;
function updateGameArea() {
    // console.log('updateGameArea');
    // arch.clear();

    // if (hello == false) {
        for (let i = 0; i < 260; i++) {
            
            // if not yet initialized
            if (!Array.isArray(noise_com[i])) noise_com[i] = [];

            for (let j = 0; j < 146; j++) {
                if (noise_com[i][j] == undefined) {
                    // if not yet created, create it
                    const p_color = (noise[i][j] * 255);
                    const pixel = new component(5, 5, "rgb(" + p_color + ', ' + p_color + ', ' + p_color + ")", i * 5, j*5);
                    noise_com[i][j] = pixel;
                    pixel.updated = true;
                    pixel.update();
                }else {
                    // created but check if has been changed
                    if (noise_com[i][j].updated) {
                        noise_com[i][j].update();
                    }
                }
            }
        } hello = true;
    // }

    if (arch._framerate++ > arch.framerate) {
        if (myGamePiece.updated) console.log(myGamePiece.updated);
        const sx = Math.max(Math.floor(myGamePiece.x/5), 0);
        const sy = Math.max(Math.floor(myGamePiece.y/5), 0);
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
            if (noise_com != undefined && noise_com[sx] != undefined && noise_com[sx][sy] != undefined)
                noise_com[sx+i][sy+j].updated = true;
            }
        }
        myGamePiece.update();
        controller();
        arch._framerate = 0;
    } 
    requestAnimationFrame(updateGameArea);
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.oldx = x;
    this.oldy = y;
    this.updated = false;
    this.applyBoundary = function() {
        this.x = Math.max(Math.min(this.x, arch.canvas.width - this.width), 0);
        this.y = Math.max(Math.min(this.y, arch.canvas.height - this.height), 0);
    };
    this.update = function () {
        if (this.updated) {
            // console.log('updated');
            this.applyBoundary();
            ctx = arch.context;
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            this.oldx = this.x;
            this.oldy = this.y;
            this.updated = false;
        }
        
        if (this.oldx != this.x || this.oldy != this.y) {
            this.updated = true;
        }else {
            this.updated = false;
        }

    };
}


onkeydown = onkeyup = function(e){
    e = e || event;
    mapKeys[e.keyCode] = e.type == 'keydown';
}

function controller() {
    for (var key in mapKeys) {
        if (Object.hasOwnProperty.call(mapKeys, key)) {
            const value = mapKeys[key];
            if (value == true) {
                key = parseInt(key);
                if (arch.movements.top.includes(key)) {
                    myGamePiece.vy -= 1 ;
                }
                if (arch.movements.right.includes(key)) {
                    myGamePiece.vx += 1 ;
                }
                if (arch.movements.bottom.includes(key)) {
                    myGamePiece.vy += 1 ;
                }
                if (arch.movements.left.includes(key)) {
                    myGamePiece.vx -= 1 ;
                }
            }
        }
    }
    myGamePiece.vx *= arch.friction;
    myGamePiece.vy *= arch.friction;
    myGamePiece.x += myGamePiece.vx;
    myGamePiece.y += myGamePiece.vy;
    myGamePiece.x = Math.round(myGamePiece.x);
    myGamePiece.y = Math.round(myGamePiece.y);
}

// document.addEventListener('keydown', function (event) {
    // console.log(event);
    // right = 39, 68
    // down = 40, 83
    // left = 37, 65
    // top = 38, 87


// });


startGame();