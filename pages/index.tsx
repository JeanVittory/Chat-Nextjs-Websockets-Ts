import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { json } from "stream/consumers";
import styles from "../styles/Home.module.css";
import { message } from "../types/message";

let socket: any;
const Home: NextPage = () => {
  const [messageToSocket, setMessageToSocket] = useState({
    username: "",
    message: "",
  });
  const [dataFromSocket, setDataFromSocket] = useState<message | null>(null);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("updateInput", (msg: any) => {
      console.log(msg)
      setDataFromSocket(msg);
    });
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
    if (messageToSocket) {
      socket.emit("sendMessage", messageToSocket);
    }
  };

  

  return (
    <div className={styles.container}>
      <section>
        {dataFromSocket && (
          Object.entries(dataFromSocket as message).map((e, idx)=>{
            return <p key={idx}>{e}</p>
          })
        )}
      
      </section>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageToSocket.username}
          placeholder="Username"
          name="username"
          onChange={handleUsername}
        />
        <input
          type="text"
          value={messageToSocket.message}
          name= "message"
          placeholder="Message"
          onChange={handleMessage}
        />
        <button onClick={handleSendMessage}>Send</button>
      </form>
    </div>
  );
};

export default Home;
