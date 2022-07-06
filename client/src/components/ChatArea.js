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
            setShowMessages([...showMessages, ...[{
                user: message.user,
                message: message.message,
                time: currentTime
            }]])
        })
    }, [showMessages])

    useEffect(() => {
        autoScroll.current.autoFocus = true
        autoScroll.current.scrollTop = autoScroll.current.scrollHeight;
    }, [showMessages])

    const userMessageMap = showMessages.map((message, index) =>
        <div key={index} className="chat-bubble">
            <span style={{ fontWeight: "bold", fontSize: '13px' }} >{message.user}</span><br></br>
            <span style={{ position: 'relative', left: 0 }}>{message.message}</span>
            <p className='message-time '>{message.time}</p>
        </div>)

    return (
        <Container fluid className='justify-content-center main-chat-container' >
            <Row >
                <Col >
                    <h3 className='welcome-message text-primary bg-light mb-0' >Welcome {userName}</h3>
                </Col>
            </Row>
            <Row>
                <Col className="bg-light">
                    <Image src={userPhoto}
                        className="rounded-circle pb-1"
                        alt="userphoto"
                    />
                </Col>
            </Row>
            <Row className='d-flex flex-nowrap align-items-start justify-content-between'>
                <Col className='ms-4 me-2 my-2 rounded-2 rooms-area' xxl={2} xl={2} lg={2} md={3} sm={3} xs={2}>
                    rooms\online-users
                </Col>
                <Col className='ms-4'
                    xxl={4} xl={5} lg={5} md={5} sm={5} xs={6}
                    style={{ marginRight: "35%" }}
                >
                    <Row>
                        <Col className='view-chat rounded-2 my-2'
                            ref={autoScroll}
                        >
                            {userMessageMap}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="p-0">
                            <Form onSubmit={e => e.preventDefault()} >
                                <Form.Group className='chat-box' >
                                    <FloatingLabel label="My message:" className='text-muted'>
                                        <Form.Control className='chat-input '
                                            id="inputBox"
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
        </Container>
    )
}

export default ChatArea;