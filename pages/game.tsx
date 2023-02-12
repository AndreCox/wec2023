import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import background from "../assets/images/back.jpg";
import HealthBar from "../components/HealthBar";
import { store } from "../stores/Store";
import { redirect } from "next/dist/server/api-utils";
import { observer } from "mobx-react-lite";

const Game = observer(() => {
  const [enemyGrid, setEnemyGrid] = useState([
    [
      {
        visible: false,
        hit: false,
        ship: null,
      },
      {
        visible: false,
        hit: false,
        ship: null,
      },
      {
        visible: false,
        hit: false,
        ship: null,
      },
    ],
    [
      {
        visible: false,
        hit: false,
        ship: null,
      },
      {
        visible: false,
        hit: false,
        ship: null,
      },
      {
        visible: false,
        hit: false,
        ship: null,
      },
    ],
    [
      {
        visible: false,
        hit: false,
        ship: null,
      },
      {
        visible: false,
        hit: false,
        ship: null,
      },
      {
        visible: false,
        hit: false,
        ship: null,
      },
    ],
  ]);

  const [playerGrid, setPlayerGrid] = useState([
    [
      {
        hit: false,
        ship: null,
      },
      {
        hit: false,
        ship: null,
      },
      {
        hit: false,
        ship: null,
      },
    ],
    [
      {
        hit: false,
        ship: null,
      },
      {
        hit: false,
        ship: null,
      },
      {
        hit: false,
        ship: null,
      },
    ],
    [
      {
        hit: false,
        ship: null,
      },
      {
        hit: false,
        ship: null,
      },
      {
        hit: false,
        ship: null,
      },
    ],
  ]);

  const [availableShips, setAvailableShips] = useState([
    {
      name: "Carrier",
      size: 5,
      available: [
        {
          health: 5,
        },
      ],
    },
    {
      name: "Battleship",
      size: 4,
      available: [
        {
          health: 4,
        },
        {
          health: 4,
        },
      ],
    },
    {
      name: "Cruiser",
      size: 3,
      available: [
        {
          health: 3,
        },
      ],
    },
    {
      name: "Submarine",
      size: 3,
      available: [
        {
          health: 3,
        },
      ],
    },
    {
      name: "Tug",
      size: 2,
      available: [
        {
          health: 2,
        },
      ],
    },
  ]);

  useEffect(() => {
    store.socket.emit("start");
    store.socket.on("refresh", (e) => {
      console.log(e);
      setEnemyGrid(e[3 - store.teamID - 1]);
      setPlayerGrid(e[store.teamID - 1]);
    });
    store.socket.on("turn-error", (e) => {
      console.log(e);
      alert(e);
    });
    store.socket.on("disconnect", () => {
      // redirect to home page
      window.location.href = "/";
    });
  }, []);

  return (
    <div className="">
      <Head>
        <title>Battle Ship</title>
        <meta name="description" content="A redesign of battleship " />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" text-lg">
        <div
          className="h1 pb-8 text-white drop-shadow-2xl text-center text-6xl mt-12"
          style={{
            fontFamily: "TitleFont",
          }}
        >
          Battle ShIP
        </div>
        <div className="flex flex-col space-y-4 justify-center ">
          <h2 className="self-center text-2xl drop-shadow-lg text-white">
            Axis Waters
          </h2>
          <div className="bg-blue-800 shadow bg-opacity-50 rounded-lg self-center">
            <div>
              {enemyGrid.map((row, i) => {
                return (
                  <div key={i} className="flex">
                    {row.map((col, j) => {
                      return (
                        <button
                          key={j}
                          onClick={() => {
                            store.socket.emit("move", {
                              turnType: "normal-shot",
                              shipId: 0,
                              shotVector: {
                                x: i,
                                y: j,
                              },
                            });
                          }}
                          className="bg-blue-500 hover:bg-blue-700 transition-colors w-8 h-8 rounded-md text-center m-0.5 flex flex-col justify-center text-xl"
                        >
                          {col.visible
                            ? col.ship.length > 0
                              ? "💥"
                              : "💦"
                            : "🌊"}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <hr />
          <h2 className="self-center text-xl drop-shadow-lg text-white">
            Allie Waters
          </h2>
          <div className="bg-blue-800 shadow bg-opacity-50 rounded-lg self-center">
            <div>
              {playerGrid.map((row, i) => {
                return (
                  <div key={i} className="flex">
                    {row.map((col, j) => {
                      return (
                        <div
                          key={j}
                          className="bg-blue-500 w-8 h-8 rounded-md m-0.5 text-center text-xl flex-col justify-center flex"
                        >
                          {col.hit
                            ? col.ship
                              ? "💥"
                              : "💦"
                            : col.ship
                            ? "🚢"
                            : "🌊"}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>{" "}
          <div className="w-full p-4 bg-opacity-50 rounded-t-xl bg-blue-900">
            <div className="flex flex-row space-x-4 justify-center">
              {availableShips.map((ship, i) => {
                return (
                  <div
                    key={i}
                    className="bg-blue-500 text-center rounded-md m-0.5 p-2"
                  >
                    {ship.name}
                    <div className="flex flex-row justify-center space-x-2 mt-4">
                      {ship.available.map((ships, i) => {
                        return (
                          <div key={i} className="flex flex-col space-y-4">
                            <HealthBar
                              percent={(ships.health / ship.size) * 100}
                            />
                            <div className="w-12 h-12 rounded-full bg-red-500 shadow-xl"></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <div className="absolute top-0 left-0 -z-50 overflow-clip">
        <Image
          src={background}
          alt="background"
          className="brightness-75 object-cover w-screen h-screen blur-sm scale-110"
        />
      </div>
    </div>
  );
});

export default Game;
