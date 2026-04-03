import API_URL from "../api";
import React, { useEffect } from "react";
import { useState } from "react";
import "./forgotPassword.css";
import { Link, useParams ,useNavigate } from "react-router-dom";


const ChangePassword = (props) => {
    const [email, setEmail] = useState("");
    const [takeemail, setTakeemail] = useState("");
    const [message, setMessage] = useState("");
    const [updateSucces, setUpdateSucces] = useState(false);
    const { id } = useParams();
    /* console.log(id); */

    const naviger = useNavigate()
    const navigate = (path) => {
        naviger(path)
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulación de envío de correo
        if (email) {
            /* setMessage("Entrer votre email"); */
            setTakeemail(email);
            navigate("/login");

            // Limpia el campo de correo
        } else {
            setMessage("Entrer votre email");
        }
    };
    useEffect(() => {
        async function PasswordUpdate() {
            try {
                const UpdadateFetching = await fetch(`${API_URL}/ChangePass/${id}`, {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            passChange: takeemail,
                        }
                    )
                })
                    .then(
                        setUpdateSucces(true)
                    )
                UpdadateFetching.json();
            } catch (err) {
                console.log(err);

            }
        }
        PasswordUpdate();
    }, [takeemail])

    /* setEmail(""); */
    return (
        <div className="ContainerForgot">
            {
                (updateSucces == true) ? <p className="SuccesConnexion">Mot de passe enregitrer</p> : <p className="compte_introuvable">Impossible!</p>
            }
            <div style={{
                maxWidth: "400px", margin: "0 auto", height: "400px",
                width: "500px", border: "0.3px solid black", display: "flex",
                alignItems: "center", justifyContent: "center", boxShadow: "0px 0px 1px black",
                backgroundColor: ""
            }}>
                <div style={{ height: "200px" }}>


                    <h2 style={{ color: "white", position: "relative", bottom: "30px", textAlign: "center" }}>New Password</h2>
                    <br />
                    {/* <form onSubmit={handleSubmit}> */}
                    <div style={{ marginBottom: "15px" }}>
                        {/* <label htmlFor="email">Correo Electrónico:</label> */}
                        <input

                            type="password"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Entrer votre email"
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                                outline: "none",
                                borderBottomColor: "black",
                                background: "white",

                            }}
                        />

                    </div>

                    <button
                        /*  type="submit" */
                        onClick={handleSubmit}
                        style={{

                            backgroundColor: "rgb(149, 11, 255, 1)",
                            color: "white",
                            padding: "10px 20px",
                            marginTop: "20px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            width: "100%"
                        }}
                    >
                        Submite
                    </button>
                    <p></p><Link to={"/forgotPassword"} style={{ color: "white" }}>⬅️Retour</Link>
                    {/* </form> */}
                    {message && <p style={{ marginTop: "15px", color: "green" }}>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;



