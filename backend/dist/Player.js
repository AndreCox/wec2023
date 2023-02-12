"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
let lastId = 0;
function generateId() {
    return ++lastId;
}
class Player {
    /**Player team 0 means unassigned. */
    constructor(team) {
        this.team = team;
        this.id = generateId();
    }
    getTeam() {
        return this.team;
    }
    setTeam(t) {
        this.team = t;
    }
    getId() {
        return this.id;
    }
}
exports.Player = Player;
