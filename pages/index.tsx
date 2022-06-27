import type { NextPage } from "next";
import Head from "next/head";
import { v4 } from "uuid";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import styles from "../styles/Home.module.css";
import { message } from "../types/message";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let socket: any;
const Home: NextPage = () => {
  const [messageToSocket, setMessageToSocket] = useState({
    username: "",
    message: "",
  });
  const [dataFromSocket, setDataFromSocket] = useState<message[]>([]);


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
    if(!messageToSocket.username){
      toast('username field must be filled', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return
    }
    if (messageToSocket) {
      socket.emit("sendMessage", messageToSocket);
    }
  };

  return (
    <div className={styles.container}>
       <ToastContainer />
      <Head>
        <title>Chat App</title>
      </Head>
      <section className={styles.chat}>
        { 
          dataFromSocket.map( (e, idx) =>{
            return (
              <div key={v4()} className={idx % 2 !== 0 ?  styles.messageContainerRight:styles.messageContainerLeft}>
                <div key={v4()}>
                  <p key={v4()} className={styles.username}>{e.username || "unknown"}:</p>
                  <p key={v4()} className={styles.message}>{e.message}</p>
                </div>
              </div>
            )
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
