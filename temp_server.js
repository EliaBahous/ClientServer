//matih
var http = require('http');
var fs = require('fs');

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

app.use(express.static('WebSite'));

const connectionString = 'postgressql://postgres:wasap@localhost:5432/postgres';
const connectionStringHeroku='postgressql://uubzjqksqoflsl:9ce6707d7298107631ecd7317272126ef4300640aa7bee47266e5a55176a5777@ec2-34-236-215-156.compute-1.amazonaws.com:5432/d7b1q1fidadk2k';
var key = 'secret key 123';

const client = new Client(connectionString);
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

// ============================ Mati new =====================================

app.get('/profileDetails', function (req, res) {
  var newEmail = Decrypt(req.query.email);
  var id = req.query.id;
    if(newEmail)
    {
      UpdateUserEmail(newEmail,id);
    }
    let data = fs.readFileSync(__dirname + "/Website/profile_details.html", 'utf8');
    if(data)
    {
      // res.send(data.replace('param1Place',req.session.email));
      res.send(data.replace('param1Place',"mati7529992@gmail.com"));
    }
    res.send(__dirname + "/Website/profile_details.html", 'utf8');
});

app.post('/profileDetails', function (req, res) {
    
    // console.log(req);
    // console.log("this is one req!!!!!!!!!!!\n\n");
    var msgLog ="";
    switch (req.body.todo) {
        case '1':
          //Enter the screen  
           GetUserDataToClient(res,req.body.email);
           console.log('case 1');

           break;
        case '2':
            //Update profile details  
            console.log('case 2');
            UpdateUserData(req);
            sendEmail(req.body.email,"Data was change!")
            res.redirect("/profileDetails");

             break;
        case '3':
            //Change password  
            console.log('case 3');
            UpdateUserPassword(req);
            res.redirect("/profileDetails");
             break;
        case '4':
            //Send an email Validation  
            console.log('case 4');
            
            ////check if email is already exist
            let em = emailExist(req.body.email);
            em.then(function (val) {
              if (val == 2) {
                var errText = "This email is already exist!";
                res.setHeader('errMsg', errText);
                res.end();
              }
            });

            let message = "Confirm email in the link:  https://eliabahous.herokuapp.com/profileDetails?email="+Encrypt(req.body.email)+"&id="+req.body.id;
            sendEmail(req.body.email,message);
            res.redirect("/profileDetails");
            
            break;
        default:
            console.log(`Sorry, we are out of ${req.body.todo}.`);
            break;

    }
    
});




async function GetUserDataToClient(response,emailToGet){
  const text = "SELECT id,name,familyname,phonenumber,country,email,city,street,zipcode,password FROM Users WHERE email=$1";
  const values = [emailToGet];
  const res = await client.query(text,values);
  SendUserDataToClient(response,res.rows[0].id,res.rows[0].name,res.rows[0].familyname,res.rows[0].phonenumber,res.rows[0].country,res.rows[0].email,res.rows[0].city,res.rows[0].street,res.rows[0].zipcode,Decrypt(res.rows[0].password))

}

function SendUserDataToClient(res,id,firstname,lastname,phone,country,email,city,street,zipcode,password){
  
  var arr = new Array(firstname,lastname,phone,country,email,city,street,zipcode,password);
  for (const property in arr) {
    if(arr[property] ==null)
    arr[property]='';
  }
  
  res.setHeader('id', id);

  res.setHeader('firstname', arr[0]);
  res.setHeader('lastname', arr[1]);
  res.setHeader('phone', arr[2]);
  res.setHeader('country', arr[3]);
  res.setHeader('email', arr[4]);
  res.setHeader('city', arr[5]);
  res.setHeader('street',arr[6]);
  res.setHeader('zipcode', arr[7]);

  res.setHeader('password', arr[8]);
  res.end();

}

function emailExist(reqEmail){
  const text = 'SELECT id,email,name,familyname FROM Users WHERE Email=$1';
  const values = [reqEmail];
  return new Promise((resolve, reject) => {

    client.query(text,values,(err, result)=>{
      if (err) return reject(err);
      if(result.rows.length>0){
        
        return resolve(2);
      
      }
      return resolve(0);
    });
  
  });
}

async function UpdateUserData(req)
{
  const text = "UPDATE Users SET name=$1,familyname=$2,phonenumber=$3,country=$4,city=$5,street=$6,zipcode=$7 WHERE email=$8 ;";
   const values = [req.body.firstname,req.body.lastname,req.body.phone,req.body.country,req.body.city,req.body.street,req.body.zipcode,req.body.email];
  const result = await client.query(text,values);
  console.log("\n\nUpdate Data!!!!!\n\n");
}

async function UpdateUserPassword(req)
{
  var encryptPassword = Encrypt(req.body.newPassword);
  const text = "UPDATE Users SET password=$1 WHERE id=$2 ;";
   const values = [encryptPassword,req.body.id];
  const result = await client.query(text,values);
  console.log("\n\nUpdate PASSWORD!!!!!\n\n");
}

async function UpdateUserEmail(newemail,id)
{
  const text = "UPDATE Users SET email=$1 WHERE id=$2 ;";
   const values = [newemail,id];
  const result = await client.query(text,values);
  console.log("\n\nUpdate Email!!!!!\n\n");
}

//function for delete
function Encrypt(value)
{
  return value;
}


async function sendEmail(email, data) {
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
  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: mail, // sender address
      to: email + "", // list of receivers
      subject: "Technical Support- Please read the content", // Subject line
      text: "Hello Dear", // plain text body
      html: data + "", // html body
    });
  } catch (error) {
    console.log(error);
  }
}