"use strict";
var _game = document.getElementById("game"), _gameUI = document.getElementById("gameUI"), _gameBG = document.getElementById("gameBG");
var game = new PlayerScene(_game, 'Game Start: Archmiron');
var gameUI = new NormalScene(_gameUI, 'Loaded: Game User Interface');
var gameBG = new MapScene(_gameBG, 'Loaded: Game Background');
let screenRatio = 0.5625;
var KeyMaps = {};
onkeydown = onkeyup = function (e) { e = e || event; KeyMaps[e.keyCode] = e.type == 'keydown'; };
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
