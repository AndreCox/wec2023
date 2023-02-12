"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const GameMode_1 = require("./GameMode");
const Player_1 = require("./Player");
const Ships = require("./Ships");
const Utils_1 = require("./Utils");
console.log("Starting server");
const gameMode = new GameMode_1.GameMode();
const server = new socket_io_1.Server(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
const connections = new Map();
server.on("connection", (client) => {
    console.log(new Date().getUTCDate() + ": New connection");
    client.on("join", () => {
        console.log(new Date().getUTCDate() + ": Join");
        const plr = new Player_1.Player(0);
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
            }
            else if (res == "game-not-in-preround") {
                const map = new Map();
                map.set(client, plr);
                updateAllClients(map);
            }
            else {
                client.emit("start-error", res);
            }
        });
        client.on("move", (req) => {
            console.log(new Date().getUTCDate() +
                `: Move x: ${req.shotVector.x}, y: ${req.shotVector.y}`);
            if (gameMode.useTurn(plr, req)) {
                gameMode.nextTurn();
                updateAllClients();
            }
            else {
                client.emit("turn-error", "not your turn");
            }
        });
        client.on("set-ships", (ships) => {
            console.log(new Date().getUTCDate() + ": Set Ships");
            const teamId = plr.getTeam();
            const team = gameMode.teams.get(teamId);
            for (const ship_info of ships) {
                let ship;
                switch (ship_info.type) {
                    case "AIRCRAFT":
                        ship = new Ships.AircraftCarrier();
                        break;
                    default:
                        break;
                }
                ship.setPosition(new Utils_1.Vec2(ship_info.x, ship_info.y));
                ship.setDirection(ship_info.direction);
                team.ships.add(ship);
            }
        });
        client.on("refresh", () => {
            const map = new Map();
            map.set(client, plr);
            updateAllClients(map);
        });
    });
});
function updateAllClients(clients) {
    let views = [];
    for (let teamId = 1; teamId <= 2; teamId++) {
        const team = gameMode.teams.get(3 - teamId);
        let view = new Array(team.visibilityMask.length);
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
                }
                else {
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
