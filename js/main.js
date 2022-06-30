function startGame() {
    myGameArea.start();
    myGamePiece = new component(20, 20, "rgba(0, 0, 255, 0.5)", 1, 1);
}

var myGameArea = {
    canvas: document.getElementById("game"),
    start: function () {
        console.log(this.canvas.width, ', ', this.canvas.height);
        this.canvas.width = 1300;
        this.canvas.height = 1300 * 0.5625;
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function updateGameArea() {
    console.log('updateGameArea');
    myGameArea.clear();
    // myGamePiece.x += 1;
    myGamePiece.update();
}

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function controller {
    
}

startGame();