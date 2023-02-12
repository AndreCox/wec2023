"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = void 0;
let lastId = 0;
function generateId() {
    return ++lastId;
}
exports.generateId = generateId;
