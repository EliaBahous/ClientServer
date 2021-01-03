const express = require('express');
const session = require('express-session');
const app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer'); 
const {Pool, Client} = require('pg');
const e = require('express');

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
  console.log("Listening on port "+port);
});


/************************Functions for request************************/

app.use(express.static('WebSite'));

app.post('/login', function(req, res) {
    console.log("LOGIN-POST-current request: " +req.session.email);
    checkClient(req,res);
});

app.get('/forgetPassword', function(req, res) {
  console.log("FORGET-PASSWORD-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/forgot-password.html");
});

app.get('/forgetPassword?mode=f', function(req, res) {
  console.log("FORGET-FALSE-PASSWORD-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/forgot-password.html");
});

app.get('/forgetPassword?mode=t', function(req, res) {
  console.log("FORGET-TRUE-PASSWORD-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/forgot-password.html");
});

app.post('/updatePassword',function(req,res){
  checkEmail(req.body.id,req,res);
});
app.get('/home', function(req, res) {
  console.log("HOME-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/index.html");
});

app.get('/register', function(req, res) {
  res.sendFile(__dirname+ "/Website/register.html");
});
app.get('/login', function(req, res) {
    sess = req.session;
    var i=0;
    var flag = 0;
    console.log("LOGIN-GET-current request: " +req.session.email);
    if(sessions.length == 0){
      res.sendFile(__dirname+ "/Website/login.html");
    }else{
      for(i=0;i<sessions.length && flag==0;i++){
        console.log( " -- " +sessions[i].email );
        if(req.session && sessions[i].email == req.session.email){
          res.sendFile(__dirname+ "/Website/index.html");
          flag=1;
        }
      }
      if(flag==0){
        res.sendFile(__dirname+ "/Website/login.html");
      }
    }
});
app.get('/logout', function(req, res) {
  sess = req.session;;
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
  res.redirect('/login');
});
function insertClient(req,res){
    sess = req.session;
  pool.query("SELECT id,name,familyname FROM store.users WHERE Email='"+user_id+"' AND Password='"+pass+"'", (err, result)=>{
    if (err) throw err;
    if(result.length > 0){

      res.sendFile(__dirname+ "/Website/login.html");
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
  flag=0;
  console.log("GETDATA-current request: " +req.session.email);
  for(i=0;i<sessions.length && flag == 0;i++){
    console.log( " -- " +sessions[i].email );
    if(req.session && sessions[i].email == req.session.email){
      res.send(sessions[i].name + " " +sessions[i].familyname);
      flag=1;
    }
  }
  if(flag==0)
    res.send("");
});
app.get('/login?mode=f',function detData(req,res){
  console.log("LOGINFAILD-GET-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/login.html");
});

function checkClient(req,res) {
  sess = req.session;
  var user_id = req.body.id + '';
  var pass = req.body.pass + '';
  var i=0;
  var flag = 0;
  console.log("CHECKCLIENT-current request: " +req.session.email + " " + user_id + " " + pass);
  //pass = encrypt(pass);
  flag = checkSession(req);
  if(flag == 0){
    const text = 'SELECT id,name,familyname FROM Users WHERE Email=$1 AND password=$2';
    const values = [user_id,pass];
    client.query(text,values, (err, result)=>{
      if (err) throw err;
      if(result.rows.length >0){
        console.log("Checking username");
        sess.email = user_id;
        sess.pass = pass;
        const data = result.rows;
        console.log('all data');
        data.forEach(row => {
            sess.name = row.name;
            sess.familyname = row.familyname;
            console.log(` Hello Id: ${row.id} Name: ${row.name} familyname: ${row.familyname}`);
        });
        sessions.push(sess);
        res.session = sess;
        res.redirect('/home');
      }else{
        res.redirect('/login?mode=f');
      }
    });
  }
  
}

function checkSession(req){
  for(i=0;i<sessions.length;i++){
      if(req.session && sessions[i].email == req.session.email){
        res.redirect("/home");
        return 1;
      }
    }
  return 0;
}

function checkEmail(email,req,res){
  const text = 'SELECT id,email,name,familyname FROM Users WHERE Email=$1';
  const values = [email];
  client.query(text,values, (err, result)=>{
    if (err) throw err;
    if(result){
      console.log("Checking username");
      const data = result.rows;
      console.log('all data');
      data.forEach(row => {
          console.log(`Id: ${row.id} Name: ${row.name} familyname: ${row.familyname}`);
      });
      sendEmail(email);
      res.redirect("/forgetPassword?mode=t")
    }else{
      res.redirect('/forgetPassword?mode=f');
    }
  });

}

async function sendEmail(email){
  let testAccount = await nodemailer.createTestAccount();
  let mail = 'clientserver.ad1@gmail.com'
   // create reusable transporter object using the default SMTP transport
   let transporter = nodemailer.createTransport({
   // host: "smtp.ethereal.email",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'clientserver.ad1@gmail.com', // generated ethereal user
      pass: 'localhost12', // generated ethereal password
    },
  });
      try{
        // send mail with defined transport object
          let info = await transporter.sendMail({
          from: mail, // sender address
          to: email+"", // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "http://localhost:"+port+"/updatePassword?email="+email, // html body
      });
      }catch(error){
          console.log(error);
      }
}