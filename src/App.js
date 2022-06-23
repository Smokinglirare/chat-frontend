import './App.css';
import {io} from "socket.io-client";
import {useEffect, useState} from "react";

let socket;

function App() {

  const [chatMessage, setChatMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [messages, setMessages] = useState([]);
  

  useEffect(() => {
    socket = io("http://localhost:4000")

    socket.on("connect", () => {
      socket.emit("ready");
      console.log("Ansluten till server")
    })

    socket.on("message", (data) => {
      console.log(data);

    })
    socket.on("message received", (data) => {
      setMessages( (prevMessages) => {
        return [...prevMessages, data.chatMessage]
        
      });

    })
  
  }, []);

 
  
  const handleMessage = (e) => {
    e.preventDefault();
    socket.emit("chat message", { chatMessage });
    setMessages( (prevMessages) => {
      return [...prevMessages, chatMessage]
      
    });
  }




  

  return (
    
      <div className="background">
        <div></div>
          <div className="textArea">
            <h1>Message:</h1>
            {messages.map((chatMessage) => {
              return <p>{chatMessage}</p>

              
            })}


            
            

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
