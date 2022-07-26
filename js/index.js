"use strict";
// variable initializations
var playerCanvas, mapCanvas, uiCanvas;
var player, map, ui;
var options = {
    frameRate: 60,
    friction: 0.9,
    scaling: 65,
    scale: 12,
    screenRatio: 0.5625,
    width: 1360,
    height: 1360 * 0.5625
};
var randomMap;
// initialize all the canvas object
playerCanvas = $('#game');
mapCanvas = $('#gameUI');
uiCanvas = $('#gameMap');
map = new MapScene(mapCanvas, 'Game Background Map', options);
randomMap = map.propagateNoise(map.generateNoise(16, 9), 5);
map.noiseMap = randomMap;
map.canvas.width = options.width;
map.canvas.height = options.height;
// Preload Images
var nums = [
    510, 502, 438, 439, 447, 508, 319, 510,
    496, 63, 508, 127, 504, 23, 191, 505,
    319, 443, 472, 63, 504, 55, 447, 505,
    319, 506, 464, 63, 508, 127, 504, 31,
    255, 505, 127, 507, 475, 219, 223, 255
];
// Preload Images
nums = [
    510, 502, 438, 439, 447, 508, 319, 510, 496, 63, 508, 127,
    504, 23, 191, 505, 319, 443, 472, 63, 504, 55, 447, 505,
    319, 506, 464, 63, 508, 127, 504, 31, 255, 505, 127, 507,
    475, 219, 223, 255, 484, 292, 295, 384, 0, 7, 480, 256,
    1, 448, 0, 2, 456, 64, 4, 192, 0, 7, 448, 0,
    6, 456, 64, 4, 128, 0, 7, 480, 256, 1, 448, 0,
    3, 457, 73, 79
];
var resources = {};
var areImagesLoaded = 0;
for (const n of nums) {
    // map.gamePool.push(new GameObject(map.context, 12, 12, './sprite/tiles/' + n + '.png', -20, -20, GameObjectType.image));
    var preImage = new Image();
    preImage.src = './sprite/tiles/' + n + '.png';
    resources[n] = preImage;
    preImage.onload = function () {
        areImagesLoaded++;
        if (areImagesLoaded == nums.length) {
            console.log(areImagesLoaded, nums.length);
            map.Start();
            map.displayMap();
        }
    };
}
// map.Start();
// map.displayMap()
// Map Focus
/**
 * Generate Random Noise √
 *  - this could be perlin noise
 *  - self noise
 *  - noise with density
 *
 * Cellular Automata √
 *  - requires an array for noise
 *
 * Display the map
 *  - we now have a map, but it is still not displayed yet
 *  - the use of scaling will be first shown in here
 *
 * Object Scaling on Map
 *  - we will use scroll to manipulate the map view
 *  - since the map tiles is dependent on the scale used, if it is even do a +1 so it will be odd and center can be get.
 *  - to center the canvas, [ (whole tile - whole canvas) / 2 ]: edge
 *    base on the result, x + edgeX, y + edgeY
 *
 *  */
// Create Abstract Scene
// Create Map
