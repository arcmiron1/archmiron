"use strict";
var GameObjectType;
(function (GameObjectType) {
    GameObjectType[GameObjectType["image"] = 0] = "image";
    GameObjectType[GameObjectType["color"] = 1] = "color";
})(GameObjectType || (GameObjectType = {}));
class GameObject {
    constructor(context, width, height, data, x, y, type) {
        this.translateX = 0;
        this.translateY = 0;
        this.isUpdated = false;
        this.autoUpdate = true;
        this.width = width;
        this.height = height;
        this.data = data;
        this.x = x;
        this.y = y;
        this.type = type;
        this.context = context;
        this.AnalyzeType();
    }
    // getter & setter
    get width() { return this._width; }
    get height() { return this._height; }
    get data() { return this._data; }
    get x() { return this._x; }
    get y() { return this._y; }
    get vx() { var _a; return (_a = this._vx) !== null && _a !== void 0 ? _a : 0; }
    get vy() { var _a; return (_a = this._vy) !== null && _a !== void 0 ? _a : 0; }
    get type() { return this._type; }
    // what is the use of setter? if data has been updated, then it will only update that specifc object, this is to avoid updating the whole canvas thus resulting to slower speed.
    set width(value) { var _a; if (typeof this._width == 'undefined' || this._width != value) {
        this.isUpdated = (this.autoUpdate || this.isUpdated);
        this._old_width = (_a = this._width) !== null && _a !== void 0 ? _a : value;
        this._width = value;
    } }
    set height(value) { var _a; if (typeof this._height == 'undefined' || this._height != value) {
        this.isUpdated = (this.autoUpdate || this.isUpdated);
        this._old_height = (_a = this._height) !== null && _a !== void 0 ? _a : value;
        this._height = value;
    } }
    set data(value) { if (typeof this._data == 'undefined' || this._data != value) {
        this.isUpdated = (this.autoUpdate || this.isUpdated);
        this._data = value;
    } }
    set x(value) { var _a; if (typeof this._x == 'undefined' || this._x != value) {
        this.isUpdated = (this.autoUpdate || this.isUpdated);
        this._old_x = (_a = this.x) !== null && _a !== void 0 ? _a : value;
        this._x = value;
    } }
    set y(value) { var _a; if (typeof this._y == 'undefined' || this._y != value) {
        this.isUpdated = (this.autoUpdate || this.isUpdated);
        this._old_y = (_a = this.y) !== null && _a !== void 0 ? _a : value;
        this._y = value;
    } }
    set vx(value) { if (typeof this._vx == 'undefined' || this._vx != value) {
        this.isUpdated = (this.autoUpdate || this.isUpdated);
        this._vx = value;
    } }
    set vy(value) { if (typeof this._vy == 'undefined' || this._vy != value) {
        this.isUpdated = (this.autoUpdate || this.isUpdated);
        this._vy = value;
    } }
    set type(value) { if (typeof this._type == 'undefined' || this._type != value) {
        this.isUpdated = (this.autoUpdate || this.isUpdated);
        this._type = value;
        this.AnalyzeType();
    } }
    // The Player class has it own update so try to check that out first
    Update(force = false) {
        if (this.isUpdated == true || force == true) {
            this.context.clearRect(this._old_x + this.translateX, this._old_y + this.translateY, this._old_width, this._old_height);
            // this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            if (this.image != null) {
                this.context.imageSmoothingEnabled = false;
                this.context.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            else {
                this.context.fillStyle = this.data;
                this.context.fillRect(this.x + this.translateX, this.y + this.translateY, this.width, this.height);
            }
            this.isUpdated = false;
        }
    }
    AnalyzeType() {
        let self = this;
        switch (this.type) {
            case GameObjectType.image:
                if (typeof this.data == 'string') {
                    this.image = new Image();
                    this.image.src = this.data;
                    this.image.onload = function () { self.isUpdated = true; };
                }
                else if (typeof this.data == 'object') {
                    this.image = this.data;
                }
                // image takes time to load...
                // it will be more appropriate to create a loading screen
                // this.image.onload = function() {self.isUpdated = true;} // To be Uncomment
                break;
            default:
                break;
        }
    }
    Collision(obj) {
        if (this.x < obj.x + obj.width &&
            this.x + this.width > obj.x &&
            this.y < obj.y + obj.height &&
            this.y + this.height > obj.y) {
            // this.data = 'green';
            return true;
        }
        return false;
    }
    toString() {
        return 'x: ' + Math.floor(this.x) + ', y: ' + Math.floor(this.y) + ', w: ' + Math.floor(this.width) + ', h: ' + Math.floor(this.height);
    }
    clone() {
        return new GameObject(this.context, this.width, this.height, this.data, this.x, this.y, this.type);
    }
}
