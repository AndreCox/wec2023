import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import background from "../assets/images/back.jpg";
import HealthBar from "../components/HealthBar";
import { io } from "socket.io-client";
import { Button } from "@material-tailwind/react";
import { HiRefresh } from "react-icons/hi";
import { observer } from "mobx-react-lite";
import { store } from "../stores/Store";

const Home = observer(() => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    store.socket = io("ws://localhost:3001", {
      reconnectionDelayMax: 5000,
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: 10,

      auth: {
        token: "123",
      },
      query: {
        "my-key": "my-value",
      },
    });

    store.socket.on("init", (e) => {
      store.playerID = e.id;
      store.teamID = e.team;
      console.log(e);
    });

    store.socket.on("connect", () => {
      console.log("connected");
      if (!connected && isNaN(store.playerID) && isNaN(store.teamID)) {
        store.socket.emit("join");
      }
      setConnected(true);
    });

    store.socket.on("disconnect", () => {
      console.log("disconnected");
      setConnected(false);
      store.playerID = NaN;
      store.teamID = NaN;
    });
  }, []);

  return (
    <div className="">
      <Head>
        <title>Battle Ship</title>
        <meta name="description" content="A redesign of battleship " />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" text-lg flex flex-col justify-center h-screen pb-16">
        <div
          className="h1 pb-8 text-white drop-shadow-2xl text-center text-6xl mt-12"
          style={{
            fontFamily: "TitleFont",
          }}
        >
          Battle ShIP
        </div>

        <div className="flex justify-center text-2xl text-white drop-shadow-2xl">
          <div className="flex flex-row space-x-4">
            <h2
              style={{
                color: connected ? "#00ff00" : "0000ff",
              }}
            >
              {connected ? "Connected" : "Disconnected"}{" "}
            </h2>
            <Button
              className="rounded-full p-2"
              hidden={connected}
              onClick={() => {
                store.socket.connect();
                // try to update the ui
              }}
            >
              <HiRefresh className="text-2xl" />
            </Button>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Button disabled={!connected}>
            <Link
              href={{
                pathname: "/game",
              }}
            >
              Start Game{" "}
            </Link>
          </Button>
        </div>
      </main>
      <div className="absolute top-0 left-0 -z-50 overflow-clip">
        <Image
          src={background}
          alt="background"
          className="object-cover w-screen h-screen blur-sm scale-110 brightness-75"
        />
      </div>
    </div>
  );
});

export default Home;
