import { useEffect, useState } from 'react';
import queryString from 'query-string';

function ChatArea() {
    const socketUrl = 'ws://localhost:7000';

    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState('');

    const [newMessage, setNewMessage] = useState({
        message: ' '
    });
    const [showMessages, setShowMessages] = useState([]);
    const [ws, setWs] = useState(new WebSocket(socketUrl));

    function saveMessage(messageText) {
        setNewMessage({ ...newMessage, message: messageText })
    }

    function sendMessage(msgSent) {
        ws.send(JSON.stringify(msgSent));
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
            setUserName(data.displayName)
            setUserPhoto(data.photo)
        }
        fetchData()
    }, []);

    useEffect(() => {
        ws.onopen = () => {
            console.log('WebSocket Connected');
        };

        ws.onmessage = (event) => {
            setShowMessages([event.data, ...showMessages]);
        };

        return () => {
            ws.onclose = () => {
                console.log('WebSocket Disconnected');
                setWs(new WebSocket(socketUrl));
            }
        }
    }, [ws, ws.onopen, ws.onmessage, ws.onclose, showMessages])

    return (
        <div className='chat-area' >
            <h3>Welcome {userName}</h3>
            <img src={userPhoto} alt="userphoto" ></img>
            <div className='view-chat'>{showMessages.map((message, index) => <p key={index}><em>{userName}</em>:&emsp;{message}</p>)}</div>
            <div className='chat-box' >
                <input className='inputText' type={'text'} onChange={(e) => saveMessage(e.target.value)} />
                <button type='submit' className='send-message-btn' onClick={() => sendMessage(newMessage)} >Send</button>
            </div>
        </div>
    )
}

export default ChatArea;