var _game:   HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement, 
    _gameUI: HTMLCanvasElement = document.getElementById("gameUI") as HTMLCanvasElement, 
    _gameBG: HTMLCanvasElement = document.getElementById("gameBG") as HTMLCanvasElement;

var game: PlayerScene = new PlayerScene(_game, 'Game Start: Archmiron');
var gameUI: NormalScene = new NormalScene(_gameUI, 'Loaded: Game User Interface');
var gameBG: MapScene = new MapScene(_gameBG, 'Loaded: Game Background');

let screenRatio = 0.5625;
var KeyMaps: any = {};

onkeydown = onkeyup = function(e){ e = e || event; KeyMaps[e.keyCode] = e.type == 'keydown';}

game.canvas.width = 1300;
game.canvas.height = game.canvas.width * screenRatio;

gameBG.canvas.width = 1300;
gameBG.canvas.height = gameBG.canvas.width * screenRatio;

// bind
game.bindInput(KeyMaps);
game.bindMap(gameBG);

gameBG.Start();
// gameUI.Start();
game.Start();




// function walkLoop() {
//     game.ClearScene();
//     (game.gameObjectPool[0] as Player).currentFrame++;
//     if ((game.gameObjectPool[0] as Player).currentFrame>=4)
//         (game.gameObjectPool[0] as Player).currentFrame = 0;
//     (game.gameObjectPool[0] as Player).isUpdated = true;
//     // requestAnimationFrame(walkLoop);
//     setTimeout(walkLoop, 200);
// } walkLoop();