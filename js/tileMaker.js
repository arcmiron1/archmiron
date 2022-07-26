"use strict";
const sharp = require('sharp');
const fs = require('fs');
var edge = [8216, 8217, 8218, 8219, 8220, 12312, 12316, 16407, 16408, 16412, 20503, 20508, 24599, 24603, 24604, 28695, 28700, 32791, 32792, 32796, 36888, 36892, 36893, 40984, 40989, 45080, 45081, 45085, 49176, 49181, 53272, 53276, 53277, 57368, 57372, 61464, 61465, 61466, 61467, 61468];
var all = [4119, 4120, 4121, 4122, 4123, 4124, 4125, 8215, 8216, 8217, 8218, 8219, 8220, 8221, 12310, 12311, 12312, 12316, 12317, 16406, 16407, 16408, 16412, 16413, 20502, 20503, 20508, 20509, 24598, 24599, 24603, 24604, 24605, 28694, 28695, 28700, 28701, 32790, 32791, 32792, 32796, 32797, 32798, 36887, 36888, 36892, 36893, 36894, 40983, 40984, 40989, 40990, 45079, 45080, 45081, 45085, 45086, 49175, 49176, 49181, 49182, 53271, 53272, 53276, 53277, 53278, 57367, 57368, 57372, 57373, 57374, 61463, 61464, 61465, 61466, 61467, 61468, 61469, 65559, 65560, 65561, 65562, 65563, 65564, 65565];
var walkable = [12313, 12314, 12315, 16409, 16410, 16411, 20504, 20505, 20506, 24600, 24601, 24602, 28696, 28697, 28698, 32793, 32794, 32795, 36889, 36890, 36891, 40985, 40986, 40987, 45082, 45083, 45084, 49177, 49178, 49179, 53273, 53274, 53275, 57369, 57370, 57371];
var edge_walkable = edge.concat(walkable);
var dest = 'tiles/wall';
dest = 'tiles/walkable';
dest = 'tiles';
var mapsrc = './sprite/tilesetraw.png';
var items = [];
for (const e of edge_walkable) { // interchangable between edge & walkable
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
    items.push(name);
    continue;
    let num = 2;
    while (fs.existsSync('./sprite/' + dest + '/' + name + '.png')) {
        name = wallCounter + '_' + num++;
    }
    // crop and save the image
    sharp(mapsrc).extract({ width: 12, height: 12, left: 12 * x, top: 12 * y }).toFile('./sprite/' + dest + '/' + name + '.png')
        .then(function (new_file_info) {
        console.log("Image cropped and saved");
    })
        .catch(function (err) {
        console.log("An error occured", err);
    });
}
console.log(items);
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
// 
// // original image
// let originalImage = 'originalImage.jpg';
// // file name for cropped image
// let outputImage = 'croppedImage.jpg';
// sharp(originalImage).extract({ width: 12, height: 12, left: 60, top: 40 }).toFile(outputImage)
//     .then(function(new_file_info) {
//         console.log("Image cropped and saved");
//     })
//     .catch(function(err) {
//         console.log("An error occured");
//     });
