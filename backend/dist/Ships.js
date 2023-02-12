"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tug = exports.Submarine = exports.Destroyer = exports.AircraftCarrier = exports.Ship = void 0;
const Utils_1 = require("./Utils");
const Id_1 = require("./Id");
class Ship {
    constructor() {
        this.position = new Utils_1.Vec2(0, 0);
        this.direction = "N";
        this.length = 1;
        /**How many turns have to pass before the ability can be used again. */
        this.abilityRechargeTurns = 1;
        this.turnsTillCanRecharge = 0;
        this.id = (0, Id_1.generateId)();
        this.hitPoints = new Array(this.length).fill(false);
    }
    serialize() {
        return JSON.stringify({
            id: this.id,
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            direction: this.direction,
            length: this.length,
            hitPoints: this.hitPoints,
            abilityRechargeTurns: this.abilityRechargeTurns,
            turnsTillCanRecharge: this.turnsTillCanRecharge,
        });
    }
    getLength() {
        return this.length;
    }
    getPosition(linearPosition = 0) {
        let x = this.position.x;
        let y = this.position.y;
        switch (this.direction) {
            case "N":
                y += linearPosition;
                break;
            case "S":
                y -= linearPosition;
                break;
            case "E":
                x += linearPosition;
                break;
            case "W":
                x += linearPosition;
                break;
            default:
                break;
        }
        return new Utils_1.Vec2(x, y);
    }
    getDirection() {
        return this.direction;
    }
    canUseAbility() {
        return this.turnsTillCanRecharge <= 0;
    }
    setPosition(pos) {
        this.position = pos;
    }
    setDirection(d) {
        this.direction = d;
    }
    hit(linearPositionOnShip) {
        if (this.hitPoints[linearPositionOnShip])
            return "already-hit";
        this.hitPoints[linearPositionOnShip] = true;
        return "hit";
    }
}
exports.Ship = Ship;
class AircraftCarrier extends Ship {
    constructor() {
        super(...arguments);
        this.length = 5;
    }
}
exports.AircraftCarrier = AircraftCarrier;
class Destroyer extends Ship {
    constructor() {
        super(...arguments);
        this.length = 3;
    }
}
exports.Destroyer = Destroyer;
class Submarine extends Ship {
    constructor() {
        super(...arguments);
        this.length = 3;
    }
}
exports.Submarine = Submarine;
class Tug extends Ship {
    constructor() {
        super(...arguments);
        this.length = 2;
    }
}
exports.Tug = Tug;
