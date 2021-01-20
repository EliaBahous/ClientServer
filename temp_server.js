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

app.use(express.static('WebSite'));

const connectionString = 'postgressql://postgres:wasap@localhost:5432/postgres';
const connectionStringHeroku='postgressql://uubzjqksqoflsl:9ce6707d7298107631ecd7317272126ef4300640aa7bee47266e5a55176a5777@ec2-34-236-215-156.compute-1.amazonaws.com:5432/d7b1q1fidadk2k';
var key = 'secret key 123';

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

// ============================ Mati new =====================================

app.get('/profileDetails', function (req, res) {
    console.log(" get to profileDetails : " + req.url);  

    res.sendFile(__dirname + "/Website/profile_details.html");
});

app.post('/profileDetails', function (req, res) {
    
    // console.log(req);
    // console.log("this is one req!!!!!!!!!!!\n\n");
    var msgLog ="";
    switch (req.body.todo) {
        case '1':
            //Enter the screen  
            res.setHeader('firstname', 'Mati');
            res.setHeader('lastname', 'Halfa');
            res.setHeader('phone', '0523747340');
            res.setHeader('country', 'Israel');
            res.setHeader('email', 'Mati@mati.com');
            res.setHeader('city', 'Mati_city');
            res.setHeader('street', 'Mati_street');
            res.setHeader('zipcode', '123');

            res.setHeader('password', '123456');

            console.log('case 1');
            res.end();
            break;
        case '2':
            //Update profile details  
            console.log('case 2');
            let em = emailExist();
            em.then((val) => console.log(val));
             res.redirect("/profileDetails");
             break;
        case '3':
            //Change password  
            console.log('case 3');
            res.redirect("/profileDetails");

             break;
        case '4':
            //Send an email Validation  
            console.log('case 4');
            res.redirect("/profileDetails");
            
            break;
        default:
            console.log(`Sorry, we are out of ${req.body.todo}.`);
            break;

    }
    

    // res.end();

});



function emailExist(reqEmail){
//   const text = 'SELECT id,email,name,familyname FROM Users WHERE Email=$1';
//   const values = [reqEmail];
  return new Promise((resolve, reject) => {
        resolve(123);
  });
}