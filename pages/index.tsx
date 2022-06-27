import type { NextPage } from "next";
import Head from "next/head";
import { v4 } from "uuid";
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import styles from "../styles/Home.module.css";
import { message } from "../types/message";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let socket: any;
const Home: NextPage = () => {
  const [messageToSocket, setMessageToSocket] = useState<message>({
    username: "",
    message: "",
  });
  const [dataFromSocket, setDataFromSocket] = useState<message[]>([]);
  const bottomView = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    socketInitializer();
    scrollBottom()
    return () =>{
      socketInitializer()
      
    }
  }, [dataFromSocket]);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket =io();
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("updateInput", (msg: any) => {
      setDataFromSocket([...dataFromSocket, msg]);
      
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
      
      setMessageToSocket({
        ...messageToSocket,
        message: ""
      })
    }
    
  };

  const scrollBottom = () =>{
    if(bottomView.current){
      bottomView.current.scroll({
        top: bottomView.current.scrollHeight,
        behavior:"smooth"
      })
    }
  }

  return (
    <div className={styles.container}>
       <ToastContainer />
      <Head>
        <title>Chat App</title>
      </Head>
      <section className={styles.chat} ref={bottomView}>
        { 
          dataFromSocket.map( (e, idx) =>{
            return (
              <div key={v4()} className={idx % 2 !== 0 ?  styles.messageContainerRight:styles.messageContainerLeft} >
                <div key={v4()} className={styles.Messagecontainer}>
                  <p key={v4()} className={styles.username}>{e.username || "unknown"}:</p>
                  <p key={v4()} className={styles.message} >{e.message} </p>
                </div>
              </div>
            )
          }
          )}
          
      </section>
      <div ref={bottomView}></div>
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
