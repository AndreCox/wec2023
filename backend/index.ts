import { Server, Socket } from "socket.io";
import { GameMode, TurnRequest } from "./GameMode";
import { Player } from "./Player";
import * as Ships from "./Ships";
import { Direction, Vec2 } from "./Utils";

console.log("Starting server");

const gameMode = new GameMode();

const server = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const connections = new Map<Socket, Player>();

server.on("connection", (client) => {
  console.log(new Date().getUTCDate() + ": New connection");

  client.on("join", () => {
    console.log(new Date().getUTCDate() + ": Join");

    const plr = new Player(0);
    gameMode.addPlayer(plr);

    connections.set(client, plr);

    client.emit("init", {
      id: plr.getId(),
      team: plr.getTeam(),
    });

    client.on("disconnect", () => {
      console.log(new Date().getUTCDate() + ": Disconnect");
      connections.delete(client);
    });

    client.on("start", () => {
      console.log(new Date().getUTCDate() + ": Start");

      const res = gameMode.startGame();
      if (res == "success") {
        updateAllClients();
      } else if (res == "game-not-in-preround") {
        const map = new Map<Socket, Player>();
        map.set(client, plr);
        updateAllClients(map);
      } else {
        client.emit("start-error", res);
      }
    });

    client.on("move", (req: TurnRequest) => {
      console.log(
        new Date().getUTCDate() +
          `: Move x: ${req.shotVector.x}, y: ${req.shotVector.y}`
      );

      if (gameMode.useTurn(plr, req)) {
        gameMode.nextTurn();

        updateAllClients();
      } else {
        client.emit("turn-error", "not your turn");
      }
    });

    client.on(
      "set-ships",
      (
        ships: { type: string; x: number; y: number; direction: Direction }[]
      ) => {
        console.log(new Date().getUTCDate() + ": Set Ships");

        const teamId = plr.getTeam();
        const team = gameMode.teams.get(teamId)!;

        for (const ship_info of ships) {
          let ship: Ships.Ship;
          switch (ship_info.type) {
            case "AIRCRAFT":
              ship = new Ships.AircraftCarrier();
              break;

            default:
              break;
          }

          ship.setPosition(new Vec2(ship_info.x, ship_info.y));
          ship.setDirection(ship_info.direction);

          team.ships.add(ship);
        }
      }
    );

    client.on("refresh", () => {
      const map = new Map<Socket, Player>();
      map.set(client, plr);
      updateAllClients(map);
    });
  });
});

function updateAllClients(clients?: Map<Socket, Player>) {
  let views: { visible: boolean; hit: boolean; ship: string }[][][] = [];
  for (let teamId = 1; teamId <= 2; teamId++) {
    const team = gameMode.teams.get(3 - teamId)!;

    let view: { visible: boolean; hit: boolean; ship: string }[][] = new Array(
      team.visibilityMask.length
    );
    for (let ii = 0; ii < view.length; ii++) {
      view[ii] = new Array(team.visibilityMask[0].length);
    }

    for (let x = 0; x < team.visibilityMask.length; x++) {
      for (let y = 0; y < team.visibilityMask[0].length; y++) {
        if (team.visibilityMask[x][y]) {
          view[x][y] = {
            visible: true,
            hit: false,
            ship: "",
          };
        } else {
          view[x][y] = {
            visible: false,
            hit: false,
            ship: "",
          };
        }
      }
    }

    for (const ship of team.ships) {
      for (let ii = 0; ii < ship.getLength(); ii++) {
        let pos = ship.getPosition(ii);

        view[pos.x][pos.y].ship = ship.constructor.name;
        view[pos.x][pos.y].hit = ship.hitPoints[ii];
      }
    }

    views.push(view);
  }

  console.log(views);

  if (clients == undefined) {
    clients = connections;
  }

  for (const client of clients) {
    client[0].emit("refresh", views);
  }
}
