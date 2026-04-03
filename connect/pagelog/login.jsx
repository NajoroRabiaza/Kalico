import { useState } from "react";
import React from 'react';
import "./login.css"; 



function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => { e.preventDefault() };

    console.log('Email', email);
    console.log('Password', password);

    return (
        <div className="log-cont">
            <form onSubmit={handleSubmit}>
                <div>
                    <img className="image" src="src/image/chef.jpg"/>
                </div>
                <div>
                    <input
                        placeholder="Email"
                        className="email-cage"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div>
                    <input
                        placeholder="Password"
                        className="pass-cage"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <input 
                    placeholder="code à 6 chiffre"
                    className="pass-cage"
                    type="code" />
                </div>
                <button type="next" className="next-cage">Cofirmer</button>
            </form>
        </div>
    );
}

export default Login;