"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const Ship = require("./Ships");
const Utils_1 = require("./Utils");
const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;
class Team {
    constructor() {
        this.ships = new Set();
        this.visibilityMask = new Array(GRID_WIDTH);
        for (let ii = 0; ii < this.visibilityMask.length; ii++) {
            this.visibilityMask[ii] = new Array(GRID_HEIGHT);
            this.visibilityMask[ii].fill(false);
        }
        let vals = [];
        for (let ii = 0; ii < 4; ii++) {
            const val = Math.floor(Math.random() * 1000) % 9;
            if (vals.includes(val)) {
                --ii;
                continue;
            }
            vals.push(val);
        }
        const ships = [
            new Ship.AircraftCarrier(),
            new Ship.Destroyer(),
            new Ship.Submarine(),
            new Ship.Tug(),
        ];
        for (let ii = 0; ii < ships.length; ii++) {
            const ship = ships[ii];
            ship.setPosition(new Utils_1.Vec2(vals[ii], Math.floor(Math.random() * 5)));
            ship.setDirection("N");
            this.ships.add(ship);
        }
    }
    shootAtPos(pos) {
        for (const ship of this.ships.values()) {
            for (let ii = 0; ii < ship.getLength(); ii++) {
                let x = ship.getPosition().x;
                let y = ship.getPosition().y;
                switch (ship.getDirection()) {
                    case "N":
                        y += ii;
                        break;
                    case "S":
                        y -= ii;
                        break;
                    case "E":
                        x += ii;
                        break;
                    case "W":
                        x += ii;
                        break;
                    default:
                        break;
                }
                if (pos.x == x && pos.y == y) {
                    // Ship hit
                    return ship.hit(ii);
                }
            }
        }
        return "miss";
    }
}
exports.Team = Team;
