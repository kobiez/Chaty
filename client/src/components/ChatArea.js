import { useEffect, useState, useRef } from 'react';
import queryString from 'query-string';
import { Button, FormLabel } from '@mui/material';
import io from 'socket.io-client';

const socket = io('http://localhost:9000');

function ChatArea() {

    const [userName, setUserName] = useState(''),
        [userPhoto, setUserPhoto] = useState(''),
        [newMessage, setNewMessage] = useState({
            message: '',
            user: '',
            time: ''
        }),
        [showMessages, setShowMessages] = useState([]),
        clearInput = useRef(),
        autoScroll = useRef();

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
            setNewMessage({ ...newMessage, user: data.displayName })
        }
        fetchData()
    }, []);

    function saveMessage(messageText) {
        setNewMessage({ ...newMessage, message: messageText })
    }

    function sendMessage(msgSent) {
        socket.emit("message", msgSent);
        clearInput.current.value = '';
    }

    useEffect(() => {
        socket.on("messageFromServer", (message, currentTime) => {
            setShowMessages([...showMessages, ...[{ user: message.user, message: message.message, time: currentTime }]])
        })
    }, [showMessages])

    useEffect(() => {
        autoScroll.current.autoFocus = true
        autoScroll.current.scrollTop = autoScroll.current.scrollHeight;
    }, [showMessages])

    const userMessageMap = showMessages.map((message, index) => <div key={index} className="chat-bubble" >
        <span style={{ fontWeight: "bold", fontSize: '13px' }} >{message.user}</span><br></br>
        <span style={{ position: 'relative', left: 0 }}>{message.message}</span>
        <p style={{ fontStyle: "italic", fontWeight: "lighter", color: 'gray', margin: "0px 0px 1px 410px", fontSize: '10px' }}>{message.time}</p>
    </div>)

    return (
        <div className='chat-area' >
            <h3 className='welcome-message' >Welcome {userName}</h3>
            <img src={userPhoto} alt="userphoto" style={{ borderRadius: '100%' }} />
            <div className='view-chat' ref={autoScroll} >
                {userMessageMap}
            </div>
            <form className='chat-box' onSubmit={e => e.preventDefault()}>
                <FormLabel for="inputBox" style={{ color: 'purple', fontSize: '18px', fontWeight: 'bold' }} >Message:</FormLabel  >
                <input className='chat-input' id="inputBox" type={'text'}
                    onChange={(e) => saveMessage(e.target.value)}
                    autoComplete='off'
                    ref={clearInput}
                />
                <Button
                    type='submit'
                    className='send-message-btn'
                    variant="contained"
                    onClick={() => sendMessage(newMessage)}
                    sx={{ color: 'purple', backgroundColor: 'orange', height: '42px' }}
                > Send
                </Button>
            </form>
        </div>
    )
}

export default ChatArea;