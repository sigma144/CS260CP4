const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('dist'))

let quizNames = [];
let quizzes = [];
let id = 0;

// setup some random data
let doImport = true;
let importItems = [];
let importId = 0;

app.get('/api/quizzes', (req, res) => {
  res.send(quizNames);
});

app.get('/api/quiz/:id', (req, res) => {
  let itemsMap = quizNames.map(item => { return item.id; });
  let index = itemsMap.indexOf(id);
  let item = quizzes[index];
  res.send(item);
});

app.put('/api/quiz/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let itemsMap = items.map(item => { return item.id; });
  let index = itemsMap.indexOf(id);
  let item = items[index];
  item.title = req.title;
  item.personalities = req.personalities;
  item.questions = item.questions;
  res.send(item);
});

app.post('/api/quiz', (req, res) => {
  id = id + 1;
  let item = {id:id, title:req.body.title, personalities:req.body.personalities, questions:req.body.questions}
  //id = id + 1;
  //let item = {id:id, text:req.body.text, completed: req.body.completed};
  quizzes.push(item);
  res.send(item);
});

app.delete('/api/quiz/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = quizNames.map(item => { return item.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that item doesn't exist");
    return;
  }
  quizzes.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'))
