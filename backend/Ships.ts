import { Vec2, Direction } from "./Utils";
import { generateId } from "./Id";

export abstract class Ship {
  constructor() {
    this.id = generateId();
    this.hitPoints = new Array<boolean>(this.length).fill(false);
  }

  protected id: number;
  protected position: Vec2 = new Vec2(0, 0);
  protected direction: Direction = "N";
  protected length: number = 1;
  public hitPoints: boolean[]; // true if hit
  /**How many turns have to pass before the ability can be used again. */
  protected abilityRechargeTurns: number = 1;
  protected turnsTillCanRecharge: number = 0;

  public serialize() {
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

  public getLength() {
    return this.length;
  }

  public getPosition(linearPosition: number = 0) {
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

    return new Vec2(x, y);
  }

  public getDirection() {
    return this.direction;
  }

  public canUseAbility() {
    return this.turnsTillCanRecharge <= 0;
  }

  public setPosition(pos: Vec2) {
    this.position = pos;
  }

  public setDirection(d: Direction) {
    this.direction = d;
  }

  public hit(linearPositionOnShip: number): "hit" | "already-hit" {
    if (this.hitPoints[linearPositionOnShip]) return "already-hit";
    this.hitPoints[linearPositionOnShip] = true;

    return "hit";
  }
}

export class AircraftCarrier extends Ship {
  protected override length = 5;
}

export class Destroyer extends Ship {
  protected override length = 3;
}

export class Submarine extends Ship {
  protected override length = 3;
}

export class Tug extends Ship {
  protected override length = 2;
}
