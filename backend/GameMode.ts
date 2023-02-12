import { Player } from "./Player";
import { Team } from "./Team";
import { Vec2 } from "./Utils";

export interface TurnRequest {
  turnType: "ability" | "normal-shot";
  shipId: number;
  shotVector: { x: number; y: number };
}

export class GameMode {
  constructor() {
    this.teams = new Map<number, Team>();
    this.teams.set(1, new Team());
    this.teams.set(2, new Team());
  }

  protected players: Player[] = [];
  protected teamToAddNextPlayerTo = 1;
  public teams: Map<number, Team>;
  protected turnId: number = 1;

  protected gameState: "preround" | "started" | "finished" = "preround";

  public startGame():
    | "game-not-in-preround"
    | "odd-number-of-players"
    | "success" {
    if (this.gameState != "preround") return "game-not-in-preround";
    if (this.players.length % 2 != 0) return "odd-number-of-players";

    this.gameState = "started";

    return "success";
  }

  public nextTurn() {
    this.turnId = 3 - this.turnId;
  }

  public useTurn(player: Player, req: TurnRequest): boolean {
    console.log(
      `Use turn: playerId: ${player.getId()}, turnid: ${this.turnId}`
    );

    if (this.turnId != player.getId()) {
      return false;
    }

    switch (req.turnType) {
      case "normal-shot":
        const friendlyTeam = this.teams.get(player.getTeam())!;
        const enemyTeamId = 3 - player.getTeam();
        const enemyTeam = this.teams.get(enemyTeamId)!;
        let res = enemyTeam.shootAtPos(
          new Vec2(req.shotVector.x, req.shotVector.y)
        );
        friendlyTeam.visibilityMask[req.shotVector.x][req.shotVector.y] = true;
        return true;
        break;

      case "ability":
        break;

      default:
        return false;
    }
  }

  public addPlayer(plr: Player) {
    if (plr.getTeam() == 0) {
      plr.setTeam(this.teamToAddNextPlayerTo);
      this.teamToAddNextPlayerTo = 3 - this.teamToAddNextPlayerTo;
    }
    this.players.push(plr);
  }
}
