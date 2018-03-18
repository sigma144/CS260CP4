const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

let quizNames = [];
let quizzes = [];
let users = [];
let id = 0;

app.put('/api/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let itemsMap = users.map(item => { return item.username; });
  let index = itemsMap.indexOf(username);
  if (index === -1)
  {
    users.push({username:username, password:password});
    res.send({msg: "Success"});
  }
  else {
    let user = users[index];
    if (password === user.password) {
      res.send({msg: "Success"});
    }
    else res.send({msg: "Username already in use/password incorrect. Please try again."});
  }
});

app.get('/api/quizzes', (req, res) => {
  res.send(quizNames);
});

app.get('/api/quiz/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let itemsMap = quizNames.map(item => { return item.id; });
  let index = itemsMap.indexOf(id);
  let item = quizzes[index];
  res.send(item);
});

app.put('/api/quiz/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let itemsMap = quizNames.map(item => { return item.id; });
  let index = itemsMap.indexOf(id);
  let item = quizzes[index];
  item.title = req.body.title;
  item.desc = req.body.desc;
  item.resultdesc = req.body.resultdesc;
  item.personalities = req.body.personalities;
  item.questions = req.body.questions;
  let name = quizNames[index];
  name.title = req.body.title;
  res.send(item);
});

app.post('/api/quiz', (req, res) => {
  id++;
  let item = {id:id, creator:req.body.creator, title:req.body.title,
desc:req.body.desc, resultdesc:req.body.resultdesc,
personalities:req.body.personalities, questions:req.body.questions}
  quizzes.push(item);
  let name = {id:id, title:req.body.title, creator:req.body.creator};
  quizNames.push(name);
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
  quizNames.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'))
