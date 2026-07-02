const mongoose = require("mongoose");
const student = require("../model/client");
const jwt = require("jsonwebtoken");

const signup = (req, res, next) => {
    //console.log(req.body);

    let Client = new student(
        {
            name: req.body.name,
            email: req.body.email,
            level: req.body.level,
            password: req.body.password
        }
    )

    Client.save()

        .then(response => {
            res.json({
                message: "Donne enregistrer avec succes !"
            })

        })

        .catch(error => {
            res.json({
                message: "Une erreur c' est produit durrant l' enregistrement de donne!"
            })
        })
    //console.log(Client);

}

const login = (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email;

    student.findOne({ $or: [{ name: name }, { email: email }] })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "Compte introuvable" });
            }

            if (user.password !== password) {
                return res.status(401).json({ message: "Mot de passe incorrect" });
            }

            const token = jwt.sign(
                { id: user._id, name: user.name, level: user.level },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({
                message: "Connexion réussie",
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    level: user.level,
                }
            });
        })
        .catch(error => {
            console.log("Erreur login:", error);
            res.status(500).json({ message: "Erreur de connexion" });
        });
};




const dataUser = (requete, response) => {
    student.find({})
        .then(user => {
            //console.log("Voici les donnes de l' utilisateur :",);
            response.send(user);

        })
        .catch(err => {
            console.log(err);

        })

}

const ChangePass = (requeste, response) => {
    console.log(requeste.body);
    const getid = requeste.params.id;
    console.log(getid);

    let passChange = requeste.body.passChange;

    student.findByIdAndUpdate(getid, { $set: { password: passChange } })
        .then(change => {
            response.json({
                message: "Password updating"
            })
            console.log("Password updating");

        }

        )
        .catch(err => {
            response.json(
                { message: "Une erreur c' est produit" }
            )
            console.log(err);

        }
            /* console.log("Une erreur c' est produit") */

        )

}
module.exports = {
    signup,
    login,
    dataUser,
    ChangePass,
};