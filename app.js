const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const alert = require('alert');
// var swal = require('sweetalert');
// const popup = require('node-popup');
// const popup = require('node-popup/dist/cjs.js');
// var jsdom = require("jsdom");
// var JSDOM = jsdom.JSDOM;
// global.document = new JSDOM(html).window.document;

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

mongoose.set("strictQuery", false);
mongoose.connect('mongodb://127.0.0.1/userDB');

const usersSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User',usersSchema);

app.get('/register', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/register', (req, res) => {
  User.findOne({email: req.body.email}, (err, userAlready) => {
    if(userAlready){
      res.redirect('/register');
    }
    else{
      const user = new User({
        email: req.body.email,
        password: req.body.password
      });
      user.save()
        .then(() => {
          res.status(201).json({ message: 'User created successfully!' });
        })
        .catch(error => {
          res.status(400).json({ error });
        });
    }
  });
});

app.get('/signin', function(req, res){
  res.sendFile(__dirname + '/signin.html');
});

app.post('/signin', function(req, res){
  User.findOne({ $and: [{ email: req.body.email }, { password: req.body.password }] }, (err, foundedUser) => {
  if (err) throw err;
  if (foundedUser) {
    res.sendFile(__dirname + '/home.html')
  } else {
    res.redirect('/signin')
  }
});
});

app.listen(3000, () => {
  console.log('Server started on port 3000!');
});
