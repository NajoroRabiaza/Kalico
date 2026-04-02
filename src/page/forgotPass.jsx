import API_URL from "../api";
import React, { useEffect } from "react";
import { useState } from "react";
import "./forgotPassword.css";
import { Link, useNavigate } from "react-router-dom";
import ChangePassword from "./forgotPassword2";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [data, setData] = useState([]);
    const show = false;

    //Eto no mi naviger ny olona a
    const naviger = useNavigate()
    const navigate = (path) => {
        naviger(path)
    }

    

    useEffect(() => {
        const findPass = async () => {
            try {
                const findUpdating = await fetch(`${API_URL}/dataUser`, {
                    method: 'GET'
                })
                const donneFetcher = await findUpdating.json();

                setData(donneFetcher);
                /* console.log(data); */

            } catch (error) {
                console.log(error);

            }
        }
        findPass();

    }, [email]);

    //Condition andefasana an' le olona makany @ le fanovana pswd
    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulación de envío de correo
        if (email == "") {
            setMessage(`Entrer votre email`); 
            setEmail("");


        } 
        else if (email !== "") {
        for (let index = 0; index < data.length; index++) {
            console.log(index);

            if (data[index].email !== email) {
                console.log("Votre email est introuvable");
            }
            else {
                console.log("Votre email est correcte");
                let idData = data[index]._id;
                /* console.log(idData); */
               /*  <ChangePassword dataId={idData} /> */

                navigate(`/ChangePassword/${idData}`);
                break;
            }
        }


    }
    };
    

    return (
        <>
            
                    <div className="ContainerForgot">
                        <div style={{
                            maxWidth: "400px", margin: "0 auto", height: "400px",
                            width: "500px", border: "0.3px solid black", display: "flex",
                            alignItems: "center", justifyContent: "center", boxShadow: "0px 0px 1px black",
                            backgroundColor: ""
                        }}>
                            <div style={{ height: "200px" }}>


                                <h2 style={{ color: "white", position: "relative", bottom: "30px" }}>Mot de passe oubllier ?</h2>
                                <br />
                                {/* <form onSubmit={handleSubmit}> */}
                                    <div style={{ marginBottom: "15px" }}>
                                        {/* <label htmlFor="email">Correo Electrónico:</label> */}
                                        <input
                                            type="email"
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
                                                /*   border:"none", */
                                                borderBottomColor: "black",
                                                background: "white",

                                            }}
                                        />
                                    </div>
                                    <button
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
                                    <p></p><Link to={"/login"} style={{ color: "white" }}>⬅️Retour</Link>
                                {/* </form> */}
                                {message && <p style={{ marginTop: "15px", color: "green" }}>{message}</p>}
                            </div>
                        </div>


                    </div>
            

        </>
    );
};

export default ForgotPassword;



