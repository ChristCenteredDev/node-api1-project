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
      res.status(500).json({
        errorMessage: 'The users information could not be retrieved.'
      });
    });
});

server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;
  if (!name || !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  }
  db.insert({ name, bio })
    .then(({ id }) => {
      db.findById(id)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            errorMessage:
              'There was an error while retrieving the user to the database'
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errorMessage:
          'There was an error while inserting the user to the database'
      });
    });
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

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end();
      } else {
        res.status(404).json({
          errorMessage: 'The user with the specified ID does not exist.'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: 'The user could not be removed' });
    });
});

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  if (!name && !bio) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide name and bio for the user.' });
  }
  db.update(id, { name, bio })
    .then(updated => {
      if (updated) {
        db.findById(id)
          .then(user => res.status(200).json(user))
          .catch(err => {
            console.log(err);
            res
              .status(500)
              .json({
                errorMessage: 'The user information could not be modified.'
              });
          });
      } else {
        res
          .status(404)
          .json({
            errorMessage: 'The user with the specified ID does not exist.'
          });
      }
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ errorMessage: 'The user information could not be modified.' });
    });
});

server.listen(3000, () => console.log('Server on port 3000'));
