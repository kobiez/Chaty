import { useEffect, useState, useRef } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Image from 'react-bootstrap/Image'

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
        <div key={index} className="chat-bubble" >
            <span style={{ fontWeight: "bold", fontSize: '13px' }} >{message.user}</span><br></br>
            <span style={{ position: 'relative', left: 0 }}>{message.message}</span>
            <p className='message-time'>{message.time}</p>
        </div>)

    return (
        <Container className='chat-area justify-content-center'>
            <Row>
                <Col>
                    <h3 className='welcome-message text-muted' >Welcome {userName}</h3>
                </Col>
            </Row>
            <Row className='justify-content-center'>
                <Col>
                    <Image src={userPhoto}
                        className="rounded-circle pb-1"
                        alt="userphoto"
                    />
                </Col>
            </Row>
            <Row className='justify-content-center'>
                <Col className='view-chat rounded-2'
                    xxl={6} xl={7} lg={8} md={10} sm={10} xs={10}
                     ref={autoScroll}
                     >
                    {userMessageMap}
                </Col>
            </Row>
            <Form onSubmit={e => e.preventDefault()} >
                <Form.Group className='chat-box justify-content-center' >
                    <Row className='justify-content-center'>
                        <Col xxl={6} xl={7} lg={8} md={10} sm={10} xs={10}>
                            <FloatingLabel label="My message:" className='text-muted'>
                                <Form.Control className='chat-input mt-1'
                                    id="inputBox"
                                    type={'text'}
                                    onChange={(e) => saveMessage(e.target.value)}
                                    autoComplete='off'
                                    ref={clearInput}
                                    placeholder="Message"
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Row className='justify-content-center'>
                        <Col >
                            <Button
                                type='submit'
                                onClick={() => sendMessage(newMessage)}
                                size='lg'
                                style={{ width: '30%', marginTop: '5px' }}
                            > Send
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        </Container>
    )
}

export default ChatArea;