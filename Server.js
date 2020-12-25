const express = require('express');
const session = require('express-session');
const app = express();
var bodyParser = require('body-parser');
const {Pool, Client} = require('pg')

const connectionString = 'postgressql://postgres:wasap@localhost:5432/Store';

const client = new Client(connectionString);
client
  .connect()
  .then(() => console.log('connected'))
  .catch(err => console.error('connection error', err.stack));
var sessions = [];
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
let port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on port 3000!");
});


/************************Functions for request************************/

app.use(express.static('Website'));


app.post('/login', function(req, res) {
  checkClient(req,res);
});

app.get('/login', function(req, res) {
  sess = req.session;
  var user_id = req.body.id;
  var pass = req.body.pass;
  var i=0;
  var flag = 0;
  console.log("current request: " +req.session.email);
  for(i=0;i<sessions.length;i++){
    console.log( " -- " +sessions[i].email );
    if(req.session && sessions[i].email == req.session.email){
      res.sendFile(__dirname+ "/Website/index.html");
      flag=1;
    }
  }
  res.sendFile(__dirname+ "/Website/login.html");
  console.log("Bad Login");
});
app.get('/logout', function(req, res) {
  sess = req.session;
  var user_id = req.body.id;
  var pass = req.body.pass;
  var i=0;
  var flag = 0;

  console.log("current request: " +req.session.email);
  for(i=0;i<sessions.length;i++){
    console.log( " -- " +sessions[i].email );
    if(req.session && sessions[i].email == req.session.email){
      var j;
      for(j =i ;j<sessions.length-1;j++)sessions[j] = sessions[j+1];
      sessions.length = sessions.length -1;
      flag=1;
      req.session.destroy();
    }
  }
  res.sendFile(__dirname+ "/Website/login.html");
});
function insertClient(req,res){
  pool.query("SELECT id,name,familyname FROM store.users WHERE Email='"+user_id+"' AND Password='"+pass+"'", (err, result)=>{
    if (err) throw err;
    if(result.length > 0){

      res.sendFile(__dirname+ "/Website/index.html");
      sess.email = req.body.id;
      sess.pass = req.body.pass;
      sess.name = result[0].name;
      sess.lname = result[0].familyname;
      sessions.push(sess);
      res.session = sess;
      console.log("Successfully logged in , session wil start for : " +result[0].idusers + " Name:" + result[0].name + " "+ result[0].familyname);
    }
  });
}
app.get('/getdata',function detData(req,res){
  sess = req.session;
  var i=0;
  var flag = 0;
  console.log("current request: " +req.session.email);
  for(i=0;i<sessions.length && flag == 0;i++){
    console.log( " -- " +sessions[i].email );
    if(req.session && sessions[i].email == req.session.email){
      res.send(sessions[i].name + " " +sessions[i].familyname);
      flag=1;
    }
  }
});

function checkClient(req,res) {
  sess = req.session;
  var user_id = req.body.id + '';
  var pass = req.body.pass + '';
  var i=0;
  var flag = 0;
  console.log("current request: " +req.session.email);
  for(i=0;i<sessions.length;i++){
    console.log( " -- " +sessions[i].email );
    if(req.session && sessions[i].email == req.session.email){
      res.sendFile(__dirname+ "/Website/index.html");
      flag=1;
    }
  }
  if(flag == 0){
    const text = 'SELECT id,name,familyname FROM store."Users" WHERE Email=$1 AND password=$2';
    const values = [user_id,pass];
    client.query(text,values, (err, result)=>{
      if (err) throw err;
      if(result != null ){
        res.sendFile(__dirname+ "/Website/index.html");
        console.log(result);
        sess.email = user_id;
        sess.pass = pass;
        const data = result.rows;
        console.log('all data');
        data.forEach(row => {
            sess.name = row.name;
            sess.familyname = row.familyname;
            console.log(` Hello Id: ${row.id} Name: ${row.name} familyname: ${row.familyname}`);
        })
        sessions.push(sess);
        res.session = sess;
      }
      else{
        res.sendFile(__dirname+ "/Website/login.html");
        console.log("Bad Login");
      }
    });
  }
}