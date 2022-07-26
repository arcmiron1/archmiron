"use strict";
// variable initializations
var gameMap, gameCollision;
var ui, map, grid;
var ctxMap, ctxCollision, ctxGrid, collisions = {}, collisionsObj = [];
var tileSize = {
    width: 12,
    height: 12
};
var options = {
    frameRate: 60,
    friction: 0.9,
    scaling: 65,
    scale: 10,
    screenRatio: 0.5625,
    width: 12 * 32,
    height: 12 * 32
};
// initialize all the canvas object
map = $('#gameMap');
ui = $('#gameCollision');
grid = $('#gameGrid');
map.width = options.width;
map.height = options.height;
ui.width = options.width;
ui.height = options.height;
grid.width = options.width;
grid.height = options.height;
ctxMap = map.getContext('2d');
ctxGrid = grid.getContext('2d');
ctxCollision = ui.getContext('2d');
// Initialize Collision Map
// for (let i = 0; i < 32; i++) {
//     for (let j = 0; j < 32; j++) {
//         if (collisions == undefined) collisions = [];
//         if (collisions[i] == undefined) collisions[i] = [];
//         if (collisions[i][j] == undefined) collisions[i][j] = 0;
//         ctxMap.imageSmoothingEnabled = true;
//         ctxCollision.fillStyle = '#dddddd33'
//         ctxCollision.strokeRect(i*12,j*12,12,12);
//     }
// }
var mapRaw = new Image();
mapRaw.src = "./sprite/tilesetraw.png";
mapRaw.onload = function () {
    ctxMap.imageSmoothingEnabled = false;
    // ctxMap.drawImage(mapRaw, 3*12, 24*12, 12, 12, 0, 0, 12, 12);
    ctxMap.drawImage(mapRaw, 0, 0);
    startImage(mapRaw);
};
var isDown = false;
ui.onmousedown = function (ev) { isDown = true; down(ev); };
ui.onmousemove = down;
ui.onmouseup = function () { isDown = false; };
function down(ev) {
    if (!isDown)
        return;
    var x, y, rect;
    rect = ui.getBoundingClientRect();
    // x = (ev.clientX - rect.left);
    // y = (ev.clientY - rect.top);
    x = (ev.offsetX);
    y = (ev.offsetY);
    x = Math.floor(x / (rect.width / 32));
    y = Math.floor(y / (rect.height / 32));
    // ctxCollision.imageSmoothingEnabled = false;
    // ctxCollision.fillStyle = '#dd3333aa'
    // ctxCollision.fillRect(x*12,y*12,12,12);
    // x << 12 | y
    // z & 0xfff || z >>>  12 get y
    // get x: z >> 12
    collisions[x << 12 | y] = 1;
    drawCollisions();
    console.log(x, ',', y);
    // console.log(ev.clientX, ',',ev.clientY);
    // console.log(ev.offsetX, ',',ev.offsetY);
    // console.log(rect);
}
function drawCollisions() {
    ctxCollision.clearRect(0, 0, ctxCollision.canvas.width, ctxCollision.canvas.height);
    for (const key in collisions) {
        let nkey, x, y;
        nkey = parseInt(key);
        x = nkey >> 12;
        y = nkey & 0xfff;
        ctxCollision.imageSmoothingEnabled = false;
        ctxCollision.fillStyle = '#dd3333aa';
        ctxCollision.fillRect(x * 12, y * 12, 12, 12);
    }
}
var edge = [8216, 8217, 8218, 8219, 8220, 12312, 12316, 16407, 16408, 16412, 20503, 20508, 24599, 24603, 24604, 28695, 28700, 32791, 32792, 32796, 36888, 36892, 36893, 40984, 40989, 45080, 45081, 45085, 49176, 49181, 53272, 53276, 53277, 57368, 57372, 61464, 61465, 61466, 61467, 61468];
var all = [4119, 4120, 4121, 4122, 4123, 4124, 4125, 8215, 8216, 8217, 8218, 8219, 8220, 8221, 12310, 12311, 12312, 12316, 12317, 16406, 16407, 16408, 16412, 16413, 20502, 20503, 20508, 20509, 24598, 24599, 24603, 24604, 24605, 28694, 28695, 28700, 28701, 32790, 32791, 32792, 32796, 32797, 32798, 36887, 36888, 36892, 36893, 36894, 40983, 40984, 40989, 40990, 45079, 45080, 45081, 45085, 45086, 49175, 49176, 49181, 49182, 53271, 53272, 53276, 53277, 53278, 57367, 57368, 57372, 57373, 57374, 61463, 61464, 61465, 61466, 61467, 61468, 61469, 65559, 65560, 65561, 65562, 65563, 65564, 65565];
var c = document.createElement('canvas');
document.body.appendChild(c);
var cctx = c.getContext('2d');
// var mapRaw = new Image();
// mapRaw.src = "./sprite/tilesetraw.png";
// mapRaw.crossOrigin="anonymous";
function startImage(theImage) {
    // ###
    c.width = 12;
    c.height = 12;
    for (const e of edge) {
        let name = 0;
        let wallCounter = 0;
        let x, y;
        x = e >> 12;
        y = e & 0xfff;
        const left = x - 1, center = x, right = x + 1;
        const top = y - 1, mid = y, bottom = y + 1;
        if (all.includes(left << 12 | top))
            wallCounter |= (1 << 8);
        if (all.includes(center << 12 | top))
            wallCounter |= (1 << 7);
        if (all.includes(right << 12 | top))
            wallCounter |= (1 << 6);
        if (all.includes(left << 12 | mid))
            wallCounter |= (1 << 5);
        if (all.includes(center << 12 | mid))
            wallCounter |= (1 << 4);
        if (all.includes(right << 12 | mid))
            wallCounter |= (1 << 3);
        if (all.includes(left << 12 | bottom))
            wallCounter |= (1 << 2);
        if (all.includes(center << 12 | bottom))
            wallCounter |= (1 << 1);
        if (all.includes(right << 12 | bottom))
            wallCounter |= 1;
        name = wallCounter;
        console.log(x, ',', y, ': ', wallCounter);
        // console.log(toList(wallCounter));
        if (cctx != null)
            cctx.imageSmoothingEnabled = false;
        cctx === null || cctx === void 0 ? void 0 : cctx.clearRect(0, 0, 12, 12);
        // console.log(cctx?.canvas);
        // (cctx as CanvasRenderingContext2D).drawImage(mapRaw,x*12,y*12, 12, 12);
        cctx === null || cctx === void 0 ? void 0 : cctx.drawImage(theImage, x * 12, y * 12, 12, 12, 0, 0, 12, 12);
        console.log(c.toDataURL());
        // break;
    }
    // ###
}
;
function toList(num) {
    var r = [];
    if (((num & (1 << 8)) > 0))
        r.push(1);
    else
        r.push(0);
    if (((num & (1 << 7)) > 0))
        r.push(1);
    else
        r.push(0);
    if (((num & (1 << 6)) > 0))
        r.push(1);
    else
        r.push(0);
    if (((num & (1 << 5)) > 0))
        r.push(1);
    else
        r.push(0);
    if (((num & (1 << 4)) > 0))
        r.push(1);
    else
        r.push(0);
    if (((num & (1 << 3)) > 0))
        r.push(1);
    else
        r.push(0);
    if (((num & (1 << 2)) > 0))
        r.push(1);
    else
        r.push(0);
    if (((num & (1 << 1)) > 0))
        r.push(1);
    else
        r.push(0);
    if (((num & 1) > 0))
        r.push(1);
    else
        r.push(0);
    return r;
}