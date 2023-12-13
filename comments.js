//Create web server application
const express = require('express');
const app = express();
const port = 3000;  
//Create database connection
const connection = require('./conf');
//Create middleware to parse JSON
app.use(express.json());
//Start server
app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }
  console.log(`Server is listening on ${port}`);
});
//Get all comments
app.get('/comments', (req, res) => {
  connection.query('SELECT * from comments', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des commentaires');
    } else {
      res.json(results);
    }
  });
});
//Get comments by id
app.get('/comments/:id', (req, res) => {
  const idComment = req.params.id;
  connection.query(
    'SELECT * from comments WHERE id = ?',
    [idComment],
    (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération du commentaire');
      } else {
        if (results.length) {
          res.json(results[0]);
        } else {
          res.status(404).send('Commentaire non trouvé');
        }
      }
    }
  );
});
//Create new comment
app.post('/comments', (req, res) => {
  const formData = req.body;
  connection.query('INSERT INTO comments SET ?', formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Erreur lors de la sauvegarde du commentaire');
    } else {
      res.sendStatus(200);
    }
  });
});
//Update comment
app.put('/comments/:id', (req, res) => {
  const idComment = req.params.id;
  const formData = req.body;
  connection.query(
    'UPDATE comments SET ? WHERE id = ?',
    [formData, idComment],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Erreur lors de la modification du commentaire');
      } else {
        res.sendStatus(200);
      }
    }
  );
});
//Delete comment
app.delete('/comments/:id', (req, res) => {
  const idComment = req.params.id;
  connection.query('DELETE FROM comments WHERE id = ?', [idComment], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Erreur lors de la suppression du commentaire');
    } else {
      res.sendStatus(200);
    }
  });
});
//Get all comments with author
app.get('/comments/author', (req, res) => {
  connection.query(
    'SELECT comments.id, comments.content, comments.date, comments.author_id, author.name FROM comments JOIN author ON comments.author_id = author.id',
    (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des commentaires');
      } else {
        res.json(results);
      }
    }
  );
});