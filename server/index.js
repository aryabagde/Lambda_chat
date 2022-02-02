// Beauty of socket.io is when we make any kind of request from front end(FE) to back end(BE), nthg apppears on networks tab 
const express = require("express");
const app = express();
const http = require("http");        // native module of node 
const cors = require("cors");
const {Server} = require("socket.io");  // server class from socket.io

app.use(cors());

const server = http.createServer(app); 
//       Add http instead of https coz it's not secured
const io = new Server(server, {    //connecting socket.io with express, Conencting backend with frontend 
    cors: {                             // we can solve cors issue here 
        origin:"http://localhost:3000",  // credentials or services that we need to connect to socket.io server
        methods: ["GET", "POST"],            // origin is which url is gooing to be calling socket.io (socket.io communication with this URL)
    },                                       // it will only accept those kinds of methods
}) ;

io.on("connection", (socket) =>{           //scoket.io works based on events, you emit a vent and you detect and listen for an event
    console.log(`User Connected: ${socket.id}`);                 //connection event is bilt in event which detects if someone connected to socket.io 

    socket.on("join_room", (data) =>{     // we need to create a event in socket.io which determines when someone wants to join a room based on the id they netered
        socket.join(data);                 // we will declare an event by on
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });                                    // we can pass the room id from front id using data variable    
    
    socket.on("send_message", (data) => {   // only want to emit the message who is in that room
        socket.to(data.room).emit("receive_message", data); // that is why .to(data.room) which is the room id from data we are sending
    })                                         
    
    socket.on("disconnect", () =>{         // when the user disconnects like closses the tab or smthg

        console.log("User Disconnected", socket.id);
    });




});                                          // every user gets a id when they connect to socket.io

server.listen(3001, () => {
    console.log("Server Running");
});