"use strict";
class MapScene extends GameScene {
    constructor() {
        super(...arguments);
        this.noiseMap = [];
        this.noiseMapObj = [];
    }
    adjustCamera(x, y) {
    }
    /**
     * How does this work?
     * @param cmap An array of x and y: cmap[x][y]
     * @param tries How many times it will propagate
     * @param densityPercent How likely it will retain its value after upscaling from 0 to 100
     * @returns An array just like cmap
     */
    propagateNoise(cmap, tries = 1, densityPercent = 80) {
        if (cmap == undefined)
            return false;
        if (cmap.length == 0)
            return false;
        if (cmap[0].length == 0)
            return false;
        // start of logic
        var rmap = [], ox, oy, nx, ny;
        ox = cmap.length;
        oy = cmap[0].length;
        for (let x = 0; x < ox; x++) {
            for (let y = 0; y < oy; y++) {
                // upscaling
                nx = x * 2;
                ny = y * 2;
                let cval = cmap[x][y];
                if (rmap[nx] == undefined)
                    rmap[nx] = [];
                if (rmap[nx + 1] == undefined)
                    rmap[nx + 1] = [];
                [
                    rmap[nx][ny],
                    rmap[nx + 1][ny],
                    rmap[nx][ny + 1],
                    rmap[nx + 1][ny + 1]
                ] = [
                    ((Math.floor(Math.random() * 101) > densityPercent) ? +!cval : cval),
                    ((Math.floor(Math.random() * 101) > densityPercent) ? +!cval : cval),
                    ((Math.floor(Math.random() * 101) > densityPercent) ? +!cval : cval),
                    ((Math.floor(Math.random() * 101) > densityPercent) ? +!cval : cval)
                ];
            }
        }
        // show logs
        // console.log(' w: ', rmap.length, "\n", 'h: ', rmap[0].length, "\n");
        tries -= 1;
        if (tries > 0)
            rmap = this.propagateNoise(rmap, tries);
        return rmap;
    }
    createGameObjects() {
        // var bg: GameObject = new GameObject(this.context, this.canvas.width, this.canvas.height, 'white', 0, 0, GameObjectType.color);
        // this.gamePool.push(bg);
        // console.log(this.gamePool.length);
        // throw new Error("Method not implemented.");
        // this.generateNoise((1300/2),(1300/2)*0.5625);
        this.cellularAutomata();
        // this.gamePool.push()
    }
    Logic() {
        // throw new Error("Method not implemented.");
    }
    generateNoise(w, h) {
        for (let i = 0; i < w; i++) {
            this.noiseMap[i] = [];
            for (let j = 0; j < h; j++) {
                // noiseMap[i][j] = Math.round(Math.sin(i*Math.random()*10) * Math.cos(j*Math.random()*10));
                // noiseMap[i][j] = Math.cos(j) * Math.sin(i);
                // let density = Math.round(Math.random()*10);
                this.noiseMap[i][j] = Math.random();
                this.noiseMap[i][j] = Math.round(this.noiseMap[i][j]);
                // this.noiseMap[i][j] = (density < 8) ? 1 : 0;
                // noiseMap[i][j] = Math.round(Math.random());//Math.round(Math.sin(i*Math.random()*10) * Math.cos(j*Math.random()*10));
            }
        }
        return this.noiseMap;
        // throw new Error("Method not implemented.");
    }
    getNeighbors(uX, uY) {
        var neighbor = [];
        neighbor[0] = this.getNoiseValue(uX, uY - 1);
        neighbor[1] = this.getNoiseValue(uX, uY + 1);
        neighbor[2] = this.getNoiseValue(uX - 1, uY);
        neighbor[3] = this.getNoiseValue(uX + 1, uY);
        neighbor[4] = this.getNoiseValue(uX - 1, uY - 1);
        neighbor[5] = this.getNoiseValue(uX - 1, uY + 1);
        neighbor[6] = this.getNoiseValue(uX + 1, uY - 1);
        neighbor[7] = this.getNoiseValue(uX + 1, uY + 1);
        return neighbor;
    }
    getStar(uX, uY) {
        let wallCounter = 0;
        var neighbor = [];
        neighbor[0] = this.getNoiseValue(uX, uY - 1); // Top
        neighbor[1] = this.getNoiseValue(uX, uY + 1); // Bottom
        neighbor[2] = this.getNoiseValue(uX - 1, uY); // Left
        neighbor[3] = this.getNoiseValue(uX + 1, uY); // Right
        neighbor[4] = this.getNoiseValue(uX - 1, uY - 1); // topLeft
        neighbor[5] = this.getNoiseValue(uX - 1, uY + 1); // bottomLeft
        neighbor[6] = this.getNoiseValue(uX + 1, uY - 1); // topRight
        neighbor[7] = this.getNoiseValue(uX + 1, uY + 1); //bottomRight
        // myself
        neighbor[8] = this.getNoiseValue(uX, uY); // Middle
        if (neighbor[4] == 0)
            wallCounter |= (1 << 8);
        if (neighbor[0] == 0)
            wallCounter |= (1 << 7);
        if (neighbor[6] == 0)
            wallCounter |= (1 << 6);
        if (neighbor[2] == 0)
            wallCounter |= (1 << 5);
        if (neighbor[8] == 0)
            wallCounter |= (1 << 4);
        if (neighbor[3] == 0)
            wallCounter |= (1 << 3);
        if (neighbor[5] == 0)
            wallCounter |= (1 << 2);
        if (neighbor[1] == 0)
            wallCounter |= (1 << 1);
        if (neighbor[7] == 0)
            wallCounter |= 1;
        return wallCounter;
    }
    getRandomWhiteTile() {
    }
    cellularAutomata(noiseLoop = 50, noiseThreshold = 4, noiseOpposite = 1, again = false) {
        var noiseLoop = 1;
        var noiseThreshold = 4;
        var noiseOpposite = 1;
        var w = this.noiseMap.length, h = this.noiseMap[this.noiseMap.length - 1].length;
        // if we just for loop from top-left until bottom-right, there will be a biased result that can be seen/notice by human eyes thus shuffling the x and y coordinates until running through all will make our cellular seems more natural.
        var unbiasedX = [...Array(w).keys()];
        var unbiasedY = [...Array(h).keys()];
        unbiasedX = unbiasedX.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
        unbiasedY = unbiasedY.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
        var uX, uY;
        var notEnough = 1;
        var skip_tiles = {};
        var skipped = 0;
        while (notEnough > 0) {
            notEnough = 0;
            for (let p = 0; p < noiseLoop; p++) {
                var currentTile = 0;
                var neighbor;
                var wallCounter = 0;
                var v = 0;
                for (let x = 0; x < w; x++) { // width
                    for (let y = 0; y < h; y++) { // height
                        uX = unbiasedX[x];
                        uY = unbiasedY[y];
                        if (skip_tiles[((uX << 12) | uY)] == true) {
                            skipped++;
                            continue;
                        }
                        wallCounter = 0;
                        currentTile = this.noiseMap[uX][uY];
                        // if (currentTile == 0) continue;
                        if (currentTile == 0)
                            wallCounter++;
                        neighbor = this.getNeighbors(uX, uY);
                        noiseThreshold = Math.ceil(neighbor.length / 2);
                        wallCounter += this.countWalls(neighbor);
                        if (wallCounter > noiseThreshold) {
                            v = Math.max(0, -noiseOpposite);
                        }
                        else {
                            v = Math.max(0, noiseOpposite);
                        }
                        if (this.noiseMap[uX][uY] != v) {
                            this.noiseMap[uX][uY] = v;
                            notEnough++;
                            // skip_tiles[((uX<<12)|uY)] = true;
                        }
                        else {
                            // if (currentTile == 0) {
                            //     // it is already black
                            //     // and nothing has changed
                            //     skip_tiles[((uX<<12)|uY)] = true;
                            // }
                        }
                    }
                }
            }
            console.log(notEnough);
        }
    }
    cellularAutomata_old(noiseLoop = 50, noiseThreshold = 4, noiseOpposite = 1, again = false) {
        var noiseLoop = 1;
        var noiseThreshold = 4;
        var noiseOpposite = 1;
        var w = this.noiseMap.length, h = this.noiseMap[this.noiseMap.length - 1].length;
        // if we just for loop from top-left until bottom-right, there will be a biased result that can be seen/notice by human eyes thus shuffling the x and y coordinates until running through all will make our cellular seems more natural.
        var unbiasedX = [...Array(w).keys()];
        var unbiasedY = [...Array(h).keys()];
        unbiasedX = unbiasedX.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
        unbiasedY = unbiasedY.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
        var uX, uY;
        var notEnough = 0;
        // this.options.scale = 64; 
        for (let p = 0; p < noiseLoop; p++) {
            var currentTile = 0;
            // var neighbor = [];
            var neighbor;
            var wallCounter = 0;
            for (let x = 0; x < w; x++) { // width
                for (let y = 0; y < h; y++) { // height
                    uX = unbiasedX[x];
                    uY = unbiasedY[y];
                    wallCounter = 0;
                    currentTile = this.noiseMap[uX][uY];
                    notEnough += currentTile;
                    // if (currentTile == 0) continue;
                    // if (currentTile == 0) wallCounter++;
                    neighbor = this.getNeighbors(uX, uY);
                    noiseThreshold = Math.ceil(neighbor.length / 2);
                    for (const n in neighbor) {
                        // console.log('each neighbor: ', n);
                        if (neighbor[n] == 0)
                            wallCounter++;
                    }
                    if (wallCounter > noiseThreshold) {
                        this.noiseMap[uX][uY] = Math.max(0, -noiseOpposite);
                    }
                    else {
                        this.noiseMap[uX][uY] = Math.max(0, noiseOpposite);
                    }
                    // console.log(noise_com[x][y]);
                    let p_color = this.noiseMap[uX][uY] * 255;
                    // this will skip all the white tile
                    if (this.noiseMap[uX][uY] == 1)
                        continue;
                    // all surroundings are black
                    if (wallCounter == 8) {
                        p_color = 20;
                        // continue;
                    }
                    else if (wallCounter >= 7) {
                        p_color = 20;
                    }
                    if (this.noiseMapObj[uX] == undefined) {
                        this.noiseMapObj[uX] = [];
                    }
                    if (this.noiseMapObj[uX][uY] == undefined) {
                        this.noiseMapObj[uX][uY] = new GameObject(this.context, 1 * this.options.scale, 1 * this.options.scale, ((uX + uY) % 2 == 0) ? 'gray' : 'black', uX * this.options.scale, uY * this.options.scale, GameObjectType.color);
                        // if (this.noiseMap[uX][uY] == 0) 
                        this.gamePool.push(this.noiseMapObj[uX][uY]);
                        // console.log('hell');
                    }
                    this.noiseMapObj[uX][uY].data = "rgb(" + p_color + ', ' + p_color + ', ' + p_color + ")";
                    // if (!this.noiseMapObj[uX][uY].isUpdated) 
                    // notEnough = true;
                    if (this.noiseMapObj[uX][uY].x > this.context.canvas.width || this.noiseMapObj[uX][uY].y > this.context.canvas.height) {
                        this.noiseMapObj[uX][uY].isUpdated = false;
                    }
                    // this.noiseMapObj[uX][uY].Update(true);
                    // console.log(neighbor);
                    // console.log('wallCounter: ', wallCounter);
                    // break;
                } // break;
            }
        }
        console.log('notenough: ', notEnough);
        // if (notEnough) this.cellularAutomata(noiseLoop, noiseThreshold, noiseOpposite, again);
        // requestAnimationFrame(cellularAutomata);
    }
    getNoiseValue(x, y) {
        var _a;
        try {
            return (_a = this.noiseMap[x][y]) !== null && _a !== void 0 ? _a : 0;
        }
        catch (error) {
            return 0;
        }
    }
    countWalls(neighbor) {
        let wallCounter = 0;
        for (const n in neighbor) {
            // console.log('each neighbor: ', n);
            if (neighbor[n] == 0)
                wallCounter++;
        }
        return wallCounter;
    }
    displayMap() {
        var w = this.noiseMap.length, h = this.noiseMap[this.noiseMap.length - 1].length;
        for (let x = 0; x < w; x++) { // width
            for (let y = 0; y < h; y++) { // height
                let neighbor = this.getNeighbors(x, y);
                let p_color = this.noiseMap[x][y] * 255;
                let wallCounter = this.countWalls(neighbor);
                // this will skip all the white tile
                if (this.noiseMap[x][y] == 1) {
                    // if (this.noiseMapObj[x] != undefined)
                    //     continue;
                    p_color = 255;
                }
                // all surroundings are black
                if (wallCounter >= 7) {
                    p_color = 20;
                }
                if (this.noiseMapObj[x] == undefined) {
                    this.noiseMapObj[x] = [];
                }
                if (this.noiseMapObj[x][y] == undefined) {
                    this.noiseMapObj[x][y] = new GameObject(this.context, 1 * this.options.scale, 1 * this.options.scale, ((x + y) % 2 == 0) ? 'gray' : 'white', x * this.options.scale, y * this.options.scale, GameObjectType.color);
                    this.gamePool.push(this.noiseMapObj[x][y]);
                }
                // this.noiseMapObj[x][y].data = "rgb(" + p_color + ', ' + p_color + ', ' + p_color + ")";
                let tag = this.getStar(x, y);
                this.noiseMapObj[x][y].tag = tag;
                if (resources[tag] != undefined) {
                    this.noiseMapObj[x][y].data = resources[tag]; // "rgb(" + p_color + ', ' + p_color + ', ' + p_color + ")";
                    this.noiseMapObj[x][y].type = GameObjectType.image;
                }
                else {
                    this.noiseMapObj[x][y].data = "rgb(" + p_color + ', ' + p_color + ', ' + p_color + ")";
                    this.noiseMapObj[x][y].type = GameObjectType.color;
                }
                if (this.noiseMapObj[x][y].x > this.context.canvas.width || this.noiseMapObj[x][y].y > this.context.canvas.height) {
                    this.noiseMapObj[x][y].isUpdated = false;
                }
                else {
                    this.noiseMapObj[x][y].isUpdated = true;
                }
            }
        }
    }
}
