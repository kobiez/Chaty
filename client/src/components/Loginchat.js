import { useState } from 'react';

function ChatyLogin() {

    const [loginData, setLoginData] = useState({
        name: '',
        email: '',
        password: ''
    })

    function userNameLogin(name) {
        setLoginData({ ...loginData, name })
    }
    function userEmailLogin(email) {
        setLoginData({ ...loginData, email })
    }
    function userPasswordLogin(password) {
        setLoginData({ ...loginData, password })
    }

    async function sendLoginToServer(userDetails) {
        console.log('from client: ', loginData);
        try {
            const data = await fetch("http://localhost:9000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userDetails),
            })
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div className='login'>
                <label for='user-name' >Name: </label>
                <input type={'text'} id='user-name' placeholder='Your name' onChange={(e) => userNameLogin(e.target.value)} /> <br />
                <label for='user-email' >Email: </label>
                <input type={'text'} id='user-email' placeholder='Your email' onChange={(e) => userEmailLogin(e.target.value)} /><br />
                <label for='user-password' >Password: </label>
                <input type={'text'} id='user-password' placeholder='Your password' onChange={(e) => userPasswordLogin(e.target.value)} /><br />
                <button type='submit' onClick={() => sendLoginToServer(loginData)}>Submit</button><br/>
                <p>or</p>
                <a href='http://localhost:9000/facebook'>Login with facebook</a>
            </div>
        </div >
    )
}

export default ChatyLogin;