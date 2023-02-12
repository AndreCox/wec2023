"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vec2 = void 0;
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    add(v2) {
        return new Vec2(this.x + v2.x, this.y + v2.y);
    }
    sub(v2) {
        return new Vec2(this.x - v2.x, this.y - v2.y);
    }
    dot(v2) {
        return this.x * v2.x + this.y * v2.y;
    }
}
exports.Vec2 = Vec2;
