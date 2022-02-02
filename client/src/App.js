// First establish a connection with socket.io
// Install library socket.io-client
// It can be used by any front end to establish a connection with socket.io

import './App.css';
import io from 'socket.io-client'
import { useState } from 'react';
import Chat from "./Chats";

//                        Remember to add http instead of https otherwise it won't work
const socket = io.connect("http://localhost:3001");   //Connect frontend with backend


function App() { 
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () =>{
    if (username !== "" && room !== "") {           // we don't want empty strings as our usernames and room
        socket.emit("join_room", room)              // to make sure to send the room id as the "data" variable in BE
        setShowChat(true);
      }                                               // we will just emit for which that particular event with that particular "data" i.e. room id 

  }
  return ( 
    <div className="App"> 
      {!showChat? (
      <div className="joinChatContainer">
        <h2>Welcome to the Lambda Chat!</h2>
        <h3>Join a Chat</h3> 
        <input 
          type="text" 
          placeholder="Name" 
          onChange={(event) =>{
            setUsername(event.target.value);}} />        
        <input 
          type="text" 
          placeholder="Room id"
          onChange={(event) =>{
            setRoom(event.target.value)}} />   
        
        <button onClick={joinRoom}>Join a Room</button>   
      </div>
      )
      :  (
        <Chat socket = {socket} username = {username} room = {room}/>       
      )}
    </div>
  );
}
// the sentences in `` are template literals, to add sentences in an easier way
// A room in socket.io is a place where both the users talk to each other
// room has a specific id, so all the people in that room will get to see that mssg
export default App;
// we added if else statement only because we want to show the chat only after the user joins the room