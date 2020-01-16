// implement your API here
const express = require('express');
const db = require('./data/db.js');
const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: 'The users information could not be retrieved.' });
    });
});

server.post('/api/users', (req, res) => {
  const user = req.body;
  // Not finished..have to do pull request for todays form
});

server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res
          .status(404)
          .json({ error: 'The user with the specified ID does not exist.' });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: 'The user information could not be retrieved.' });
    });
});

server.listen(3000, () => console.log('Server on port 3000'));
