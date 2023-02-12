export type Direction = "N" | "E" | "S" | "W";

export class Vec2 {
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public x: number;
  public y: number;

  public length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  public add(v2: Vec2) {
    return new Vec2(this.x + v2.x, this.y + v2.y);
  }

  public sub(v2: Vec2) {
    return new Vec2(this.x - v2.x, this.y - v2.y);
  }

  public dot(v2: Vec2) {
    return this.x * v2.x + this.y * v2.y;
  }
}
