//set up mobx store
import { makeAutoObservable, autorun, reaction } from "mobx";
import { Socket } from "socket.io-client";

class Store {
  playerID: number = NaN;
  teamID: number = NaN;
  socket: Socket;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.playerID,
      (playerID) => {
        console.log("playerID changed to", playerID);
      }
    );
    reaction(
      () => this.teamID,
      (teamID) => {
        console.log("teamID changed to", teamID);
      }
    );
  }
}

export const store = new Store();
