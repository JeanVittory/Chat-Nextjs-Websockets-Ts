import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import styles from "../styles/Home.module.css";
import { message } from "../types/message";

let socket: any;
const Home: NextPage = () => {
  const [messageToSocket, setMessageToSocket] = useState({
    username: "",
    message: "",
  });
  const [dataFromSocket, setDataFromSocket] = useState<message[]>([]);
  //const [socketConnection, setSocketConnection] = useState(false);

  useEffect(() => {
    socketInitializer();
  }, [dataFromSocket]);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket =io();
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("updateInput", (msg: any) => {
      setDataFromSocket([...dataFromSocket, msg]);
      console.log(dataFromSocket)
    });
    //setSocketConnection(false)
  };
  
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };
  
  const handleUsername = (e: React.FormEvent<HTMLInputElement>) => {
    setMessageToSocket({
      ...messageToSocket,
      username: e.currentTarget.value,
    });
  };
  const handleMessage = (e: React.FormEvent<HTMLInputElement>) => {
    setMessageToSocket({
      ...messageToSocket,
      message: e.currentTarget.value,
    });
  };
  
  const handleSendMessage = () => {
    //setSocketConnection(true);
    if (messageToSocket) {
      socket.emit("sendMessage", messageToSocket);
    }
  };

  console.log(dataFromSocket)
  return (
    <div className={styles.container}>
      <section>
        { 
          dataFromSocket.map((e, idx)=>{
            return <p key={idx}>{e.username}</p>
          }
        )}
      </section>
      <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          value={messageToSocket.username}
          placeholder="Username"
          name="username"
          onChange={handleUsername}
          autoComplete="off"
        />
        <input
          type="text"
          value={messageToSocket.message}
          name="message"
          placeholder="Message"
          onChange={handleMessage}
          autoComplete="off"
        />
        <button onClick={handleSendMessage}>Send</button>
      </form>
    </div>
  );
};

export default Home;
