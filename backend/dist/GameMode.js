"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameMode = void 0;
const Team_1 = require("./Team");
const Utils_1 = require("./Utils");
class GameMode {
    constructor() {
        this.players = [];
        this.teamToAddNextPlayerTo = 1;
        this.turnId = 1;
        this.gameState = "preround";
        this.teams = new Map();
        this.teams.set(1, new Team_1.Team());
        this.teams.set(2, new Team_1.Team());
    }
    startGame() {
        if (this.gameState != "preround")
            return "game-not-in-preround";
        if (this.players.length % 2 != 0)
            return "odd-number-of-players";
        this.gameState = "started";
        return "success";
    }
    nextTurn() {
        this.turnId = 3 - this.turnId;
    }
    useTurn(player, req) {
        console.log(`Use turn: playerId: ${player.getId()}, turnid: ${this.turnId}`);
        if (this.turnId != player.getId()) {
            return false;
        }
        switch (req.turnType) {
            case "normal-shot":
                const friendlyTeam = this.teams.get(player.getTeam());
                const enemyTeamId = 3 - player.getTeam();
                const enemyTeam = this.teams.get(enemyTeamId);
                let res = enemyTeam.shootAtPos(new Utils_1.Vec2(req.shotVector.x, req.shotVector.y));
                friendlyTeam.visibilityMask[req.shotVector.x][req.shotVector.y] = true;
                return true;
                break;
            case "ability":
                break;
            default:
                return false;
        }
    }
    addPlayer(plr) {
        if (plr.getTeam() == 0) {
            plr.setTeam(this.teamToAddNextPlayerTo);
            this.teamToAddNextPlayerTo = 3 - this.teamToAddNextPlayerTo;
        }
        this.players.push(plr);
    }
}
exports.GameMode = GameMode;
