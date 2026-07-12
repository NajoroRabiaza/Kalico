const Client = require("../model/client");

const getClients = (req, res) => {
  Client.find()
    .then(clients => res.json(clients))
    .catch(error => res.status(500).json({ message: error.message }));
};

module.exports = { getClients };