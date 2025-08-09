import axios from 'axios'
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Signup.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Signup(){
    let username=useRef();
    let password1=useRef();
    let password2=useRef();
    let email=useRef();
    let [message,setMessage]=useState('');
    const navigate=useNavigate();
    const handleSubmit=async(event)=>{
        event.preventDefault();
        const payload = {
          username: username.current.value,
          email: email.current.value,
          password1: password1.current.value,
          password2: password2.current.value,
        };
       await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`,payload)
      .then((res) => {res.data.message==='Success'?navigate('/login'):setMessage(res.data.message)})
      .catch((err) => console.error(err));
    }
    return (<>
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2 className="signup-heading">Create an Account</h2>
                <input className="signup-input" type="text" ref={username} placeholder="Username" />
                <input className="signup-input" type="email" ref={email} placeholder="Email" />
                <input className="signup-input" type="password" ref={password1} placeholder="Password" />
                <input className="signup-input" type="password" ref={password2} placeholder="Re-enter Password" />
                <input className="signup-button" type="submit" value="Signup" />
                <p className="signup-link-text">
                    Already have an account? <Link className="signup-link" to="/login">Login</Link>
                </p>
                <h4 className="warning">{message}</h4>
            </form>
        </div>
    </>);
}
export default Signup;