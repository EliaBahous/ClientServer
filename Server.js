let port = process.env.PORT || 3000;
const express = require('express');
const session = require('express-session');
const app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer'); 
const url = require('url');
const {Pool, Client} = require('pg');
const e = require('express');
var CryptoJS = require("crypto-js");
const { Console } = require('console');
const { exit } = require('process');
const connectionString = 'postgressql://postgres:wasap@localhost:5432/Store';
const connectionStringHeroku='postgres://uubzjqksqoflsl:9ce6707d7298107631ecd7317272126ef4300640aa7bee47266e5a55176a5777@ec2-34-236-215-156.compute-1.amazonaws.com:5432/d7b1q1fidadk2k';

const client = new Client(connectionStringHeroku);
client
  .connect()
  .then(() => console.log('connected'))
  .catch(err => console.error('connection error', err.stack));
var sessions = [];
var insertRequests = {} // empty Object
insertRequests['Requests'] = []; // empty Array, which you can push() values into

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(port, function(){
  console.log("Listening on port "+port);
});

/************************Functions for request************************/

app.use(express.static(__dirname+'/Website'));

app.post('/login', function(req, res) {
    console.log("LOGIN-POST-current request: " +req.session.email);
    checkClient(req,res);
});

app.get('/insertSuccess',function(req,res){

  const urlReq = new URL("http:localhost//:"+port+req.url);
  reqEmail = Decrypt(urlReq.searchParams.getAll("email")[0]);
  for(var i=0;i< insertRequests['Requests'].length;i++){
    if(insertRequests['Requests'][i].email == reqEmail)
        console.log(reqEmail);
        getID(i,res,req);
        break;
  }
});

app.post('/addUser', function(req, res) {
  console.log("Add User-POST-current request: " +req.session.email);
  let reqFirstName = req.body.firstname + "";
  let reqLastName = req.body.lastname + "";
  let reqEmail = req.body.email+"";
  let reqPassword = req.body.password1+"";
  let reqPromoCode = req.body.promocode +"";

    insertRequests['Requests'].push({
      email: reqEmail,
      password:reqPassword,
      firstname:reqFirstName,
      lastname:reqLastName,
      promocode:reqPromoCode
    });
    
    message = "https://eliabahous.herokuapp.com/insertSuccess?email="+Encrypt(reqEmail);
    sendEmail(reqEmail+"",message);
    res.redirect("/register?mode=t");
 


});

app.post('/forgetPassword', function(req, res) {
  console.log("FORGET-PASSWORD-current request: " +req.session.email);
  checkEmail(req.body.id,req,res);
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
  let reqEmail = req.body.email+"";
  let reqPassword = req.body.pass1+"";

  let email =Decrypt(reqEmail);
 
  let pass = Encrypt(reqPassword+"");

  console.log("Update-password-POST-current request: " +email+"");
  updatePassword(email,pass,req,res);
});

app.get('/home', function(req, res) {
  console.log("HOME-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/buy.html");
});

app.get('/updatePassword',function(req,res){
  console.log("updatePassword-GET-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/update-password.html");

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
          res.sendFile(__dirname+ "/Website/buy.html");
          flag=1;
        }
      }
      if(flag==0){
        res.sendFile(__dirname+ "/Website/login.html");
      }
    }
});
app.get('/logout', function(req, res) {
  sess = req.session;
  var i=0;
  var flag = 0;
  console.log("LOGOUT-GET-current request: " +req.session.email);
  for(i=0;i<sessions.length;i++){
    console.log( " -- " +sessions[i].email );
    if(req.session && sessions[i].email == req.session.email){
      sessions.pop(sessions[i]);
      req.session.destroy();
      
    }
  }
  res.redirect('/login');
});

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

app.get('/updateSuccess',function(req,res){
  console.log("UpdateSucess-GET-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/PassUpdated.html");
});

function checkClient(req,res) {
  var user_id = req.body.id + '';
  var pass = req.body.pass + '';
  var i=0;
  var flag = 0;
  console.log("CHECKCLIENT-current request: " +req.session.email + " " + user_id + " " + pass);
  pass = Encrypt(pass);
  flag = checkSession(res,req);
  if(flag == 0){
    const text = 'SELECT id,name,familyname FROM Users WHERE Email=$1 AND password=$2';
    const values = [user_id,pass];
    client.query(text,values, (err, result)=>{
      if (err) throw err;
      if(result.rows.length >0){
        sess = req.session;
        console.log("Checking username");
        sess.email = user_id;
        sess.pass = Decrypt(pass);
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

function checkSession(res,req){
  for(i=0;i<sessions.length;i++){
      if(req.session && sessions[i].email == req.session.email){
        res.redirect("/home");
        return 1;
      }
    }
  return 0;
}

function updatePassword(email,password,req,res){
  const text = 'UPDATE Users SET password=$2 WHERE email=$1;';
  const values = [email,password];
  client.query(text,values, (err, result)=>{
    if (err){
      res.redirect('/forgetPassword');
      throw err;
    }
    console.log(result + " " + values);
    console.log("Checking username:\n"+result);
    sendEmail(email,"the password updated successfuly !!email: " + email + " password: "+Decrypt(password));
      res.sendFile(__dirname+ "/Website/PassUpdated.html");

  });
}
function checkEmail(email,req,res){
  const text = 'SELECT id,email,name,familyname FROM Users WHERE Email=$1';
  const values = [email];
  client.query(text,values, (err, result)=>{
    if (err) throw err;
    if(result.rows.length>0){
      console.log("Checking username");
      const data = result.rows;
      console.log('all data');
      data.forEach(row => {
          console.log(`Id: ${row.id} Name: ${row.name} familyname: ${row.familyname}`);
      });
      let message = "https://eliabahous.herokuapp.com/updatePassword?email="+Encrypt(email);
      sendEmail(email,message);
      res.redirect("/forgetPassword?mode=t")
    }else{
      res.redirect('/forgetPassword?mode=f');
    }
  });

}

async function sendEmail(email,data){
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
          subject: "Technical Support- Please read the content", // Subject line
          text: "Hello Dear", // plain text body
          html: data+"", // html body
      });
      }catch(error){
          console.log(error);
      }
}

function Encrypt(word) {

  return Buffer.from(word).toString('base64') +"";
}

function Decrypt(word) {
  return Buffer.from(word, 'base64').toString() + ""
}

function insertData(index,res,req,id){
  
  id = parseInt(id)+13
  console.log("New ID = "+(id));
  var reqFirstName =insertRequests['Requests'][index].firstname;
  var reqLastName = insertRequests['Requests'][index].lastname + "";
  var reqEmail = insertRequests['Requests'][index].email+"";
  var reqPassword = insertRequests['Requests'][index].password+"";
  var reqPromoCode = insertRequests['Requests'][index].promocode +"";

  var text = "INSERT INTO Users( email, familyname, id, name, password, promocode) "+
    "VALUES ($1, $2, $3, $4, $5, $6);";
  let values = [reqEmail,reqLastName,BigInt(id),reqFirstName,Encrypt(reqPassword),reqPromoCode];
  console.log(values)
    client.query(text,values, (err, result)=>{
      if (err){
         throw err;
      }
      sendEmail(reqEmail,"You have created account successfully : email = " +reqEmail + " Password = "+reqPassword);
      res.redirect("/login");
    });
}

async function getID(index,result,req){
  const text = 'SELECT max(id) as maxid FROM Users';
  const res = await client.query(text);
  console.log(res.rows[0].maxid); 
  insertData(index,result,req, res.rows[0].maxid);

}

function checkPromoCode(promoCode){

  return new Promise((resolve, reject) => {
    const text = 'SELECT * FROM promocode';
    const values = [promoCode];
    client.query(text,(err, result)=>{
      if (err) return reject(err);
      if(result.rows.length>0){
        for(var i=0;i<result.rows.length;i++){
        if(result.rows[i]["PromoCode"]== promoCode){
          return resolve({x:0});
        }
      }
      
      }else{
       resolve({x:1});
      }
    });
  
  });


}

function emailExist(reqEmail){
  const text = 'SELECT id,email,name,familyname FROM Users WHERE Email=$1';
  const values = [reqEmail];
  return new Promise((resolve, reject) => {

    client.query(text,values,(err, result)=>{
      if (err) return reject(err);
      if(result.rows.length>0){
        
         resolve(2);
      
      }else{
       resolve(0);
      }
    });
  
  });


}