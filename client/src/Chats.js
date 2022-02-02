//Chat componenet is where we will be sending and receiving messages through socket.io
// We are gonna use react-scroll-tobottom for adding a scroll
import React, {useEffect, useState} from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({socket, username, room}) {             // For that we need to send the socket variable that we created in App.js
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    
    const sendMessage = async () =>{
        if (currentMessage !== ""){
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" +
                new Date(Date.now()).getMinutes(),
            }

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData])
            setCurrentMessage("");
        };
    };

    useEffect(() => {

        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        })

    }, [socket]);



    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                {messageList.map((messageContent) => {
                    return (
                        <div className="message" id={username === messageContent.author ? "you" : "other"}>
                            <div>
                                <div className="message-content">
                                    <p>{messageContent.message}</p>
                                </div>
                                <div className="message-meta">
                                    <p id="time">{messageContent.time}</p>
                                    <p id="author">{messageContent.author}</p>
                                </div>

                            </div>
                        </div>)
                })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input 
                type="text" 
                value={currentMessage}
                placeholder="Hey.."  
                onChange={(event) =>{
                    setCurrentMessage(event.target.value)
                    }}
                onKeyPress={(event) => {
                    event.key === "Enter" && sendMessage();
                }} 
           /> 
                <button onClick={sendMessage}>&#9658;</button>
            </div>

        </div>
    )
}

export default Chat;

// we need to keep track of the value of our input since we need to know what's the message 
// whenever the input changes we need to change the value
//And we need a function as a trigger to change it  
// We will keep that function async so that we cn actually wait for user to type and update the object 
// Uptill now we are just sending our text from front end to back end (send_Message)
// Now we will listen for an event in front end and we will emit thhose messages from backend
// useEffect is goin to listen in front end and check if there is any changes made in socket.io
// socket.on is to listen event and [socket] is the server and useEffect will run if there is any change
// we need a State inside our Chat to show the messages in the box i.e. messageList
//setMessageList is goin to set append the new message to the list