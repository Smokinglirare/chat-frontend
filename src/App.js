import './App.css';
import {io} from "socket.io-client";
import {useEffect, useState} from "react";

let socket;

function App() {

  const [chatMessage, setChatMessage] = useState("");

  

  useEffect(() => {
    socket = io("http://localhost:4000")

    socket.on("connect", () => {
      socket.emit("ready");
      console.log("Ansluten till server")
    })

    socket.on("message", (data) => {
      console.log(data);
    })
  }, []);

 
  
  function handleMessage() {
    socket.emit("chat message", JSON.stringify({ chatMessage }));
  }

  
  return (
    
      <div className="background">
        <div></div>
          <div className="textArea">
            
  {function MessageList() {
    const messages = chatMessage;
    const listOfMessages = messages.map((message) =>
      <li>{message}</li>
      );
  return (
    <ul>{listOfMessages}</ul>
     );
}}
            
            

          <form className="form" onSubmit={handleMessage}>
      <input 
      className="inputField"
       autoComplete="off"
       value={chatMessage}
       onChange={(e) => setChatMessage(e.target.value)}
        />
      <button  type="submit" className="button">Send</button>
    </form>

          </div>
      </div>
   
  );
}

export default App;
