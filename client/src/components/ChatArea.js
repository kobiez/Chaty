import { useEffect, useState, useRef } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Image from 'react-bootstrap/Image';

const socket = io('http://localhost:9000');

function ChatArea() {

    const [userName, setUserName] = useState('')
    const [userPhoto, setUserPhoto] = useState('')
    const [isDisplayed, setIsDisplayed] = useState(true)
    const [roomToJoin, setRoomToJoin] = useState('')
    const [allRooms, setAllRooms] = useState([])
    const [newMessage, setNewMessage] = useState({
        socket: '',
        message: '',
        user: '',
        time: '',
        room: ''
    })
    const [showMessages, setShowMessages] = useState([])
    const clearInput = useRef()
    const clearInputRoom = useRef()
    const autoScroll = useRef()

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

    function userWillingRoom(room) {
        setRoomToJoin(room)
    }

    function joinToRoom(wantedRoom) {
        if (wantedRoom) {
            const findRoom = allRooms.find((room) => room === wantedRoom)
            if (!findRoom) {
                setAllRooms([...allRooms, wantedRoom])
                setNewMessage({ ...newMessage, room: roomToJoin })
            }
            setNewMessage({ ...newMessage, room: roomToJoin })
            setIsDisplayed(!isDisplayed)
            clearInputRoom.current.value = ''
            socket.emit('joinRoom', wantedRoom, userName)
        }
    }

    useEffect(() => {
        socket.on("messageFromServer", (message, currentTime) => {
            setShowMessages([...showMessages, ...[{
                user: message.user,
                message: message.message,
                time: currentTime,
                socket: message.socket
            }]])
        })

        autoScroll.current.autoFocus = true
        autoScroll.current.scrollTop = autoScroll.current.scrollHeight;
    }, [showMessages])

    const userMessageMap = showMessages.map((message, index) => {
        if (socket.id === message.socket) {
            return (
                < div key={index} className="chat-bubble-me my-1 me-5 rounded-5">
                    <span className='chat-bubble-span-user'>{message.user}
                        <span className='chat-bubble-span-time ms-3'>{message.time}</span>
                    </span><br></br>
                    <p className='chat-bubble-span-message'>{message.message}</p>
                </div >
            )
        }
        return (
            < div key={index} className="chat-bubble-other my-1 ms-5 rounded-5">
                <span className='chat-bubble-span-user'>{message.user}
                    <span className='chat-bubble-span-time ms-3'>{message.time}</span>
                </span><br></br>
                <span className='chat-bubble-span-message'>{message.message}</span>
            </div >
        )
    }

    )

    const roomsMap = allRooms.map((room, index) =>
        <p key={index}>
            <a href='#' className='text-decoration-none'>{room}</a>
        </p>
    )

    return (
        <Container fluid className='justify-content-center main-chat-container'>
            <Row >
                <Col >
                    <h3 className='welcome-message text-primary bg-light my-0'>Welcome {userName}</h3>
                </Col>
            </Row>
            <Row>
                <Col className="bg-light">
                    <Image src={userPhoto}
                        className="rounded-circle py-2"
                        alt="userphoto"
                    />
                </Col>
            </Row>
            <Container className='d-flex justify-content-center'>
                <Row className={isDisplayed ? '' : 'd-none'}>
                    <Col className='justify-content-center'>
                        <Form onSubmit={e => e.preventDefault()}>
                            <Form.Group>
                                <FloatingLabel className='text-muted'
                                    label="Join\Create room"
                                    style={{ fontSize: '15px' }}
                                >
                                    <Form.Control required className='room-input'
                                        type={'text'}
                                        placeholder="rooms"
                                        ref={clearInputRoom}
                                        name='room'
                                        onChange={e => userWillingRoom(e.target.value)}
                                    />
                                </FloatingLabel>
                                <Button style={{ marginTop: '5px', width: "20vw" }}
                                    type="submit"
                                    onClick={() => joinToRoom(roomToJoin)}
                                >
                                    Join\Create
                                </Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <Container className={isDisplayed ? 'd-none' : ''}>
                <Row className='d-flex flex-nowrap align-items-start justify-content-between'>
                    <Col className='ms-4 me-2 my-2 ' xxl={2} xl={2} lg={2} md={3} sm={3} xs={2}>
                        <Row>
                            <Col className='rooms-area rounded-2 mb-2'>
                                <Row>
                                    <h6 className="bg-light text-center text-primary pb-1">
                                        Rooms
                                    </h6>
                                </Row>
                                {roomsMap}
                            </Col>
                        </Row>

                    </Col>
                    <Col className='ms-4'
                        xxl={4} xl={5} lg={5} md={5} sm={5} xs={6}
                        style={{ marginRight: "35%" }}
                    >
                        <Row>
                            <Col className='view-chat rounded-2 my-2 p-0'
                                ref={autoScroll}
                            >
                                {userMessageMap}
                            </Col>
                        </Row>
                        <Row >
                            <Col className="p-0">
                                <Form onSubmit={e => e.preventDefault()} >
                                    <Form.Group className='chat-box' >
                                        <FloatingLabel label="My message:" className='text-muted' >
                                            <Form.Control className='chat-input'
                                                type={'text'}
                                                onChange={(e) => saveMessage(e.target.value)}
                                                autoComplete='off'
                                                ref={clearInput}
                                                placeholder="Message"
                                            />
                                        </FloatingLabel>
                                        <Button
                                            type='submit'
                                            onClick={() => sendMessage(newMessage)}
                                            style={{ width: '30%', marginTop: '5px' }}
                                            className="bi bi-send"
                                        > Send
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container >
        </Container >
    )
}

export default ChatArea;