const express = require('express');
const client = require('./grpc/client'); 
const { v4: uuidv4 } = require('uuid'); 
const app = express();
app.use(express.json());

app.post('/todos', (req, res) => {
  const { title, description } = req.body;
  const id = uuidv4();
  client.AddTodo({ id, title, description }, (err, response) => {
    if (err) {
      console.error('Error adding todo:', err);
      return res.status(500).send(err);
    }
    res.status(201).send(response);
  });
});

app.get('/todos', (req, res) => {
  client.GetTodos({}, (err, response) => {
    if (err) {
      console.error('Error getting todos:', err);
      return res.status(500).send(err);
    }
    res.send(response.todos);
  });
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  client.DeleteTodo({ id }, (err, response) => {
    if (err) {
      console.error('Error deleting todo:', err);
      return res.status(500).send(err);
    }
    res.status(204).send();
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
