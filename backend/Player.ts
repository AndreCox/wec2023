let lastId: number = 0;
function generateId() {
  return ++lastId;
}

export class Player {
  /**Player team 0 means unassigned. */
  constructor(team: number) {
    this.team = team;
    this.id = generateId();
  }

  protected team: number; // 0 is no team.
  protected id: number;

  public getTeam() {
    return this.team;
  }

  public setTeam(t: number) {
    this.team = t;
  }

  public getId() {
    return this.id;
  }
}
