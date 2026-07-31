import axios from 'axios'
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css"
import { useState } from 'react';

function Login(){
    let email=useRef();
    let password=useRef();
    let [message,setMessage]=useState('');
    const navigate=useNavigate();
    const handleSubmit=(event)=>{
        event.preventDefault();
        const payload={
            email:email.current.value,
            password:password.current.value
        };
        axios.post(`https://todoapp-q6s4.onrender.com/login`,payload)
        .then((res)=>{
            console.log(res)
            localStorage.setItem("token", res.data.token);
            res.data.message==='Success'?navigate('/todo'):setMessage(res.data.message)
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    return(
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-heading">Login</h2>
                <input className="login-input" type="email" ref={email} placeholder="Email" />
                <input className="login-input" type="password" ref={password} placeholder="Password" />
                <input className="login-button" type="submit" value="Login" />
                <p className="login-link-text">
                    Don't have an account? <Link className="login-link" to="/signup">Signup</Link>
                </p>
                <h4 className="warning">{message}</h4>
            </form>
        </div>)
}
export default Login;
