import axios from 'axios'
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css"
import { useState } from 'react';
import { useEffect } from 'react';

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
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`,payload)
        .then((res)=>{
            if(res.data.token)
            {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user",res.data.user);
                navigate('/todo')
            }
            else
                setMessage(res.data.errors?.[0]?.msg || res.data.message)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        email.current.focus();
    },[]);

    return(
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-heading">Login</h2>
                <input className="login-input" type="text" ref={email} placeholder="Email" />
                <input className="login-input" type="password" ref={password} placeholder="Password" />
                <input className="login-button" type="submit" value="Login" />
                <p className="login-link-text">
                    Don't have an account? <Link className="login-link" to="/signup">Signup</Link>
                </p>
                {message && (
                    <div className="error-message">
                        <span>{message}</span>
                        <button 
                            className="close-button"
                            onClick={() => setMessage('')}
                        >
                            x
                        </button>
                    </div>
                )}
            </form>
        </div>)
}
export default Login;
