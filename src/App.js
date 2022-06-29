import "./App.css";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

let socket = io("http://localhost:4000");
function App() {
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const [oldMessages, setOldMessages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("ready");
      console.log(`${socket.id} har anslutit till servern`);
    });
    socket.on("message", (data) => {
      console.log(data);
    });
    socket.on("message received", (data) => {
      setMessages((prevMessages) => {
        console.log(data.username);
       
        return [...prevMessages, `${data.username} - ${data.chatMessage}`];
      });
    });
    socket.on("allRooms", (rooms) => {
      setRooms(rooms);
      console.log(rooms);
    });

    socket.on("oldMessages", (messages) => {
      setOldMessages(messages);
      console.log(oldMessages);
    });

    
    /* const name = prompt("Vad heter du?");
   socket.emit("setUsername", name); */
  }, []);
  
  const handleMessage = (e) => {
    e.preventDefault();
    //  if (chatMessage !== ""){

    socket.emit("chat message", { chatMessage, roomName, username });
    setMessages((prevMessages) => {
      return [...prevMessages, chatMessage];
    });
    setChatMessage("");
    //}
  };

  const createRoom = (e) => {
    e.preventDefault();
    if (roomName !== "") {
      e.preventDefault();
      socket.emit("create_room", roomName);
      console.log(`Rummet ${roomName} skapades`);
      window.location.reload();
    }
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomName !== "") {
      e.preventDefault();
      socket.emit("join_room", roomName);
      console.log(`${username} har anslutit till ${roomName}`);
      setShowChat(true);
  
      
    } 
  };

  const clickBack = () => {
    setShowChat(false);
    window.location.reload();
  };

  const joinRoomButton = () => {
    socket.emit("join_room", rooms.room_name);
    console.log(`${username} har anslutit till ${rooms.room_name}`);
  };

  const deleteRoom = (e) => {
    e.preventDefault();
    socket.emit("delete_room", roomName);
    console.log(`Rummet ${roomName} har tagits bort`);
    window.location.reload();
  };

  const createUsername = (e) => {
    e.preventDefault();
    if (username !== "") {
      socket.emit("setUsername", username);
      console.log(username);
    }
  };

  return (
    <div className="background">
      <div className="top-title">
        <h1 className="title-h1">Chat</h1>
      </div>
      {!showChat ? (
        <div className="middle-div">
          <div className="left-mid">
            <h1 className="rum-title">Users</h1>
            <p className="room-p">Nej fan nu tar jag semester</p>
          </div>
          <div className="mid-mid">
            {" "}
            <form className="upper-form" onSubmit={createUsername}>
              <button className="cybr-btn" onClick={createRoom} type="submit">
                Create room<span aria-hidden>_</span>
                <span aria-hidden class="cybr-btn__glitch">
                  Create room
                </span>
                <span aria-hidden class="cybr-btn__tag">
                  R25
                </span>
              </button>

              <button onClick={joinRoom} type="submit" className="cybr-btn">
                Join room<span aria-hidden>_</span>
                <span aria-hidden class="cybr-btn__glitch">
                  Join room
                </span>
                <span aria-hidden class="cybr-btn__tag">
                  R26
                </span>
              </button>

              <button onClick={deleteRoom} type="submit" className="cybr-btn">
                Remove room<span aria-hidden>_</span>
                <span aria-hidden class="cybr-btn__glitch">
                  Remove room
                </span>
                <span aria-hidden class="cybr-btn__tag">
                  R27
                </span>
              </button>
              <input
                placeholder=" ...roomname"
                className="upper-inputField"
                autoComplete="off"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />

              <button
                onClick={createUsername}
                type="submit"
                className="cybr-btn"
              >
                Create name<span aria-hidden>_</span>
                <span aria-hidden class="cybr-btn__glitch">
                  Create name
                </span>
                <span aria-hidden class="cybr-btn__tag">
                  R28
                </span>
              </button>

              <input
                placeholder=" ...username"
                className="upper-inputField"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </form>
          </div>
          <div className="right-mid">
            <h1 className="rum-title">Rooms</h1>
            {rooms.map((room) => {
              return <p className="room-p">{room.room_name}</p>;
            })}
          </div>
        </div>
      ) : (
        <div className="textArea">
          <h1 className="current-room">{`Current room: ${roomName}`}</h1>
          <h1 className="current-room">{`Username: ${username}`}</h1>
          <button onClick={clickBack} className="cybr-btn">
            Back<span aria-hidden>_</span>
            <span aria-hidden class="cybr-btn__glitch">
              Back
            </span>
            <span aria-hidden class="cybr-btn__tag">
              R29
            </span>
          </button>
          <div className="overflowa-for-fan-inte">
            <h1 className="h1an">Messages:</h1>
            {oldMessages.map((oldMessage) => {
              return <p className="chat-text">{oldMessage.user_id} - {oldMessage.message}</p>;
            })}
            {messages.map((chatMessage) => {
              return <p className="chat-text">{chatMessage}</p>;
            })}
            
          </div>
          <div className="input-div">
            <form className="form" onSubmit={handleMessage}>
              <input
                className="inputField"
                autoComplete="off"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => {
                  e.key === "Enter" && handleMessage();
                }}
              />
              <button type="submit" className="button">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
      <div></div>
    </div>
  );
}

export default App;
