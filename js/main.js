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
    },
    movements: {'top' : [38, 87], 'right': [39, 68], 'bottom': [40, 83], 'left': [37, 65]}
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

function controller() {

}

document.addEventListener('keydown', function (event) {
    console.log(event);
    // right = 39, 68
    // down = 40, 83
    // left = 37, 65
    // top = 38, 87

    if (myGameArea.movements.top.includes(event.keyCode)) {
        myGamePiece.y -=1;
    }
    if (myGameArea.movements.right.includes(event.keyCode)) {
        myGamePiece.x +=1;
    }
    if (myGameArea.movements.bottom.includes(event.keyCode)) {
        myGamePiece.y +=1;
    }
    if (myGameArea.movements.left.includes(event.keyCode)) {
        myGamePiece.x -=1;
    }

});


startGame();