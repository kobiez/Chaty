import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImFacebook2 } from 'react-icons/im';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

function ChatyRegister() {
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: ''
    })

    function userNameRegister(name) {
        setRegisterData({ ...registerData, name })
    }
    function userEmailRegister(email) {
        setRegisterData({ ...registerData, email })
    }
    function userPasswordRegister(password) {
        setRegisterData({ ...registerData, password })
    }

    async function sendRegisterToServer(userDetails) {
        try {
            const response = await fetch("http://localhost:9000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userDetails),
            })
            const data = await response.json();
            if (data.error) {
                return navigate('/')
            }
            navigate(`/ChatArea/:${data._id}`)
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container className="justify-content-center border border-0 rounded-5 bg-light">
            <Row >
                <Col >
                    <h2 className='register-title text-muted my-3'>Register</h2>
                </Col >
            </Row>
            <Form.Group className="mb-3 lead text-muted">
                <Row className="justify-content-md-center mb-3" style={{ fontSize: '15px' }}>
                    <Col md={4}>
                        <FloatingLabel label="Your name" >
                            <Form.Control type={'text'}
                                className='register-input'
                                id='user-name'
                                placeholder='Your name'
                                onChange={(e) => userNameRegister(e.target.value)} />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mb-3" style={{ fontSize: '15px' }}>
                    <Col md={4}>
                        <FloatingLabel label="Your email">
                            <Form.Control type={'email'}
                                className='register-input'
                                id='user-email'
                                placeholder='Your email'
                                onChange={(e) => userEmailRegister(e.target.value)} />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mb-3" style={{ fontSize: '15px' }}>
                    <Col md={4}>
                        <FloatingLabel label="Your password">
                            <Form.Control type={'password'}
                                className='register-input'
                                id='user-password'
                                placeholder='Your password'
                                onChange={(e) => userPasswordRegister(e.target.value)} />
                        </FloatingLabel>
                    </Col>
                </Row>
                <Button className='mt-2'
                    type='submit'
                    onClick={() => sendRegisterToServer(registerData)}>
                    Submit
                </Button>
            </Form.Group>
            <p className='lead'>Already registered?
                <a href='http://localhost:3000/login'
                    style={{ textDecoration: "none", marginLeft: '5px' }}>
                    <b>Login</b>
                </a>
            </p>
            <p className='lead'>or</p>
            <Button className='mb-4'>
                <a className='facebookLoginBtn'
                    href='http://localhost:9000/facebook'
                    style={{ color: 'white', textDecoration: 'none' }} >
                    <ImFacebook2 size={25} /> &nbsp;&nbsp; Login with facebook
                </a>
            </Button>
        </Container >
    )
}

export default ChatyRegister;