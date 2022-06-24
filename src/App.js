import './App.css';
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

let socket;

function App() {

  const [chatMessage, setChatMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("")
  const [username, setUsername] = useState("")

  
  useEffect(() => {
    socket = io("http://localhost:4000")
    socket.on("connect", () => {
      socket.emit("ready");
      console.log(`${socket.id} har anslutit till servern`)
    })
    socket.on("message", (data) => {
      console.log(data);
    })
    socket.on("message received", (data) => {
      setMessages((prevMessages) => {
        return [...prevMessages, data.chatMessage]
      })
    })
  /* const name = prompt("Vad heter du?");
   socket.emit("setUsername", name); */
   

  }, []);
  
  const handleMessage = (e) => {
    e.preventDefault();
    socket.emit("chat message", { chatMessage, roomName });
    setMessages((prevMessages) => {
      return [...prevMessages, chatMessage]

    });
  }

  const createRoom = (e) => {
    e.preventDefault();
    socket.emit("create_room", roomName)
    console.log(`Rummet ${roomName} skapades`)
  }

  const joinRoom = (e) => {
    e.preventDefault();
    socket.emit("join_room", roomName);
    console.log(`${socket.id} har anslutit till ${roomName}`)
  }

  const deleteRoom = (e) => {
    e.preventDefault();
    socket.emit("delete_room", roomName);
    console.log(`Rummet ${roomName} har tagits bort`)
  }

   const createUsername = (e) => {
    e.preventDefault()
    socket.emit("setUsername", username);
   console.log(username);
  }  

  return (

    <div className="background">
      <div></div>
      <div className="middle-div">
        <div className="left-mid">
        <form className="upper-form" onSubmit={createUsername}>
          
           <button className="cybr-btn" onClick={createRoom} type="submit" >Skapa rum<span aria-hidden>_</span>
  <span aria-hidden class="cybr-btn__glitch">Skapa rum</span>
  <span aria-hidden class="cybr-btn__tag">R25</span></button>

          <button onClick={joinRoom}  type="submit" className="cybr-btn">Gå med i rum<span aria-hidden>_</span>
  <span aria-hidden class="cybr-btn__glitch">Gå med i rum</span>
  <span aria-hidden class="cybr-btn__tag">R26</span></button>
          
          <button onClick={deleteRoom}  type="submit" className="cybr-btn">Ta bort rum<span aria-hidden>_</span>
  <span aria-hidden class="cybr-btn__glitch">Ta bort rum</span>
  <span aria-hidden class="cybr-btn__tag">R27</span></button>
          
           <button onClick={createUsername}  type="submit" className="cybr-btn">Skapa namn<span aria-hidden>_</span>
  <span aria-hidden class="cybr-btn__glitch">Skapa namn</span>
  <span aria-hidden class="cybr-btn__tag">R28</span></button>
  <input
            className="upper-inputField"
            autoComplete="off"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}

          />

        </form>
        
        </div>
        <div></div>
        <div></div>
      </div>
      <div className="textArea">
      
      
        <h1 className="h1an">Meddelanden:</h1>
        {messages.map((chatMessage) => {
          return <p className="chat-text">{username} - {chatMessage}</p>
        })}

        <form className="form" onSubmit={handleMessage}>
          <input
            className="inputField"
            autoComplete="off"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <button type="submit" className="button">Send</button>
        </form>

      </div>
    </div>

  );
}

export default App;
