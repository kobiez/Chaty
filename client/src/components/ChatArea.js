import { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import { Button, TextField, FormLabel } from '@mui/material';

function ChatArea() {

    const socket = io('http://localhost:9000');

    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState('');

    const [newMessage, setNewMessage] = useState({
        message: ' '
    });
    const [showMessages, setShowMessages] = useState([]);

    function saveMessage(messageText) {
        setNewMessage({ ...newMessage, message: messageText })
    }

    function sendMessage(msgSent) {
        socket.emit("message", msgSent);
    }

    useEffect(() => {
        async function fetchData() {
            const serchParam = queryString.parse(window.location.search);
            const response = await fetch('http://localhost:9000/user', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(serchParam),
            });
            const data = await response.json();
            setUserName(data.displayName);
            setUserPhoto(data.photo);
        }
        fetchData()
    }, []);

    useEffect(() => {
        socket.on("messageFromServer", (message) => {
            setShowMessages([...showMessages, message]);
        })
    }, [socket])

    return (
        <div className='chat-area' >
            <h3>Welcome {userName}</h3>
            <img src={userPhoto} alt="userphoto" ></img>
            <div className='view-chat' >{showMessages.map((message, index) => <p key={index}>{message}</p>)}</div>
            <form className='chat-box' onSubmit={e => e.preventDefault()}>
                <FormLabel for="inputBox" >Text:</FormLabel  >
                <TextField className='inputText' id="inputBox" type={'text'}
                    sx={{
                        width: '420px',
                        color: 'primary'
                    }}
                    onChange={(e) => saveMessage(e.target.value)}
                    variant="outlined"
                    autoComplete='off'
                    autoFocus
                    /* onFocus={(e) => { e.target.value = '' }} */
                />
                <Button
                    type='submit'
                    className='send-message-btn'
                    variant="contained"
                    onClick={() => sendMessage(newMessage)} > Send
                </Button>
            </form>
        </div>
    )
}

export default ChatArea;