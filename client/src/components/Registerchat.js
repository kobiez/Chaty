import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImFacebook2 } from 'react-icons/im'
import { Button, FormLabel } from '@mui/material';

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
        <div>
            <h2 className='register-title' >Register</h2>
            <div className='register'>
                <FormLabel for='user-name' >Name: </FormLabel>
                <input type={'text'} id='user-name' placeholder='Your name' onChange={(e) => userNameRegister(e.target.value)} /> <br />
                <FormLabel for='user-email' >Email: </FormLabel>
                <input type={'text'} id='user-email' placeholder='Your email' onChange={(e) => userEmailRegister(e.target.value)} /><br />
                <FormLabel for='user-password' >Password: </FormLabel>
                <input type={'text'} id='user-password' placeholder='Your password' onChange={(e) => userPasswordRegister(e.target.value)} /><br />
                <Button type='submit' variant="contained" style={{ margin:'10px 0 10px 0' }} onClick={() => sendRegisterToServer(registerData)}>Submit</Button><br />
                <FormLabel>Already registered? <a href='http://localhost:3000/login' >Login</a></FormLabel> 
                <FormLabel><p>or</p></FormLabel>
                <Button variant="contained">
                    <a className='facebookLoginBtn' href='http://localhost:9000/facebook'  >
                        <ImFacebook2 size={25} /> &nbsp;&nbsp; Login with facebook
                    </a>
                </Button>
            </div>
        </div >
    )
}

export default ChatyRegister;