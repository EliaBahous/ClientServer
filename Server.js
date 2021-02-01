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
const connectionString = 'postgressql://postgres:wasap@localhost:5432/postgres';
const connectionStringHeroku='postgres://uubzjqksqoflsl:9ce6707d7298107631ecd7317272126ef4300640aa7bee47266e5a55176a5777@ec2-34-236-215-156.compute-1.amazonaws.com:5432/d7b1q1fidadk2k';
var http = require('http');
var fs = require('fs');
//matih
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
app.get('/',function(req,res){
  res.redirect('/sign-in')
})
app.get('/about',function(req,res){
  console.log("About-GET-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/about.html");
})

app.post('/sign-in', function(req, res) {
    console.log("sign-in-POST-current request: " +req.session.email);
    checkClient(req,res);
});

app.get('/laptop', function(req, res) {
  console.log("laptop-GET-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/blanklaptop.html");
});


app.get('/pc', function(req, res) {
  console.log("laptop-GET-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/blankpc.html");
});

app.get('/lg', function(req, res) {
  console.log("laptop-GET-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/blanklg.html");
});

app.get('/iphone', function(req, res) {
  console.log("laptop-GET-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/blankphones.html");
});

app.get('/samsung', function(req, res) {
  console.log("laptop-GET-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/blanksamsung.html");
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

  var checkEmail = emailExist(reqEmail)
  checkEmail.then((x)=>{
      if(x==2){
        //matih
        console.log("Email exist! line 100");
        res.redirect("/sign-up?mode=f&email="+reqEmail);

      }else{
        if(reqPromoCode!=""){
          var checkPromo = checkPromoCode(reqPromoCode);
          checkPromo.then((y)=>{
              if(y==2){
                res.redirect("/sign-up?mode=f&email="+reqEmail+"&promoCode=undefiend");
              }else{
                insertRequests['Requests'].push({
                  email: reqEmail,
                  password:reqPassword,
                  firstname:reqFirstName,
                  lastname:reqLastName,
                  promocode:reqPromoCode
                });
                
                  message = "https://eliabahous.herokuapp.com/insertSuccess?email="+Encrypt(reqEmail);
                  sendEmail(reqEmail+"",message);
                  res.redirect("/sign-up?mode=t");
               
              
              }
          })
      }else{
          insertRequests['Requests'].push({
            email: reqEmail,
            password:reqPassword,
            firstname:reqFirstName,
            lastname:reqLastName,
            promocode:""
          });
          
            message = "https://eliabahous.herokuapp.com/insertSuccess?email="+Encrypt(reqEmail);
            sendEmail(reqEmail+"",message);
            res.redirect("/sign-up?mode=t");
        
        
      }
      }
  });
 

});

app.post('/reset-password', function(req, res) {
  console.log("FORGET-PASSWORD-current request: " +req.session.email);
  checkEmail(req.body.id,req,res);
});
app.get('/reset-password', function(req, res) {
  console.log("FORGET-PASSWORD-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/forgot-password.html");
});

app.get('/reset-password?mode=f', function(req, res) {
  console.log("FORGET-FALSE-PASSWORD-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/forgot-password.html");
});

app.get('/reset-password?mode=t', function(req, res) {
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

app.get('/soon', function(req, res) {
  console.log("HOME-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/blanksoon.html");
});

app.get('/dashboard', function(req, res) {
  console.log("HOME-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/buy.html");
});

app.get('/updatePassword',function(req,res){
  console.log("updatePassword-GET-current request: " +req.session.email);
  res.sendFile(__dirname+ "/Website/update-password.html");

});
app.get('/sign-up', function(req, res) {
  res.sendFile(__dirname+ "/Website/register.html");
});
app.get('/sign-in', function(req, res) {
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
  res.redirect('/sign-in');
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

app.get('/sign-in?mode=f',function detData(req,res){
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
        res.redirect('/dashboard');
      }else{
        res.redirect('/sign-in?mode=f');
      }
    });
  }
  
}

function checkSession(res,req){
  for(i=0;i<sessions.length;i++){
      if(req.session && sessions[i].email == req.session.email){
        res.redirect("/dashboard");
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
      res.redirect('/reset-password');
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
      res.redirect("/reset-password?mode=t")
    }else{
      res.redirect('/reset-password?mode=f');
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
      res.redirect("/sign-in");
    });
    insertRequests['Requests'].pop(insertRequests['Requests'][index]);
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
    client.query(text,(err, result)=>{
      if (err) return reject(err);
      if(result.rows.length>0){
        for(var i=0;i<result.rows.length;i++){
        if(result.rows[i]["PromoCode"]== promoCode){
          return resolve(0);
        }
      }
      
      }else{
       resolve(1);
      }
    });
  
  });


}

function emailExist(reqEmail){
  console.log("email exist check!");
  const text = 'SELECT * FROM Users WHERE Email=$1';
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
app.get('/profileDetails', function (req, res) {
 
   if(req.query.email)
   {
    console.log(req.query.email);
    const reqEmail = Decrypt(req.query.email);
    const reqId = req.query.id;

    UpdateUserEmail(reqEmail, reqId);
    res.redirect("/profileDetails");

  }
  else{
    res.sendFile(__dirname + "/Website/profile_details.html");
  }

});

//matih
app.get('/changeMail',function(req,res){

  console.log(req.query.email);
  const reqEmail = Decrypt(req.query.email);
  const reqId = req.query.id;

  UpdateUserEmail(newEmail, id);

  res.sendFile(__dirname + "/Website/profile_details.html");

});

app.get('*', function(req, res){
  res.sendFile(__dirname+ "/Website/404.html");
  })



app.post('/profileDetails', function (req, res) {
    
    var msgLog ="";

    switch (req.body.todo) {
        case '1':
          //Enter the screen  
          
           GetUserDataToClient(res,req.session.email);
           console.log('case 1');

           break;
        case '2':
            //Update profile details  
            console.log('case 2');
            UpdateUserData(req);
            sendEmail(req.session.email,"Data was change!")
            res.redirect("/profileDetails");

             break;
        case '3':
            //Change password  
            console.log('case 3');
            UpdateUserPassword(req);
            sendEmail(req.session.email,"Password was change!")
            res.redirect("/profileDetails");
             break;
        case '4':
            //Send an email Validation  
            console.log('case 4');
            
            ////check if email is already exist
            let em = emailExist(req.body.email);
            em.then((val)=> {
              if (val == 2) {
                var errText = "This email is already exist!";
                res.setHeader('errMsg', errText);
                res.end();
              }
              else
              {
                let message = "Confirm email in the link:  https://eliabahous.herokuapp.com/profileDetails?id="+req.body.id+"&email="+Encrypt(req.body.email);
                sendEmail(req.body.email,message);
                res.redirect("/profileDetails");
              }
            });

            break;
        default:
            console.log(`Sorry, we are out of ${req.body.todo}.`);
            break;

    }
    
});


async function GetUserDataToClient(response,emailToGet){
  const text = "SELECT id,name,familyname,phonenumber,country,email,city,street,zipcode,password FROM users WHERE email=$1";

  const values = [emailToGet];
  const res = await client.query(text, values);
  if (res.rowCount > 0) {
    SendUserDataToClient(response, res.rows[0].id, res.rows[0].name, res.rows[0].familyname, res.rows[0].phonenumber, res.rows[0].country, res.rows[0].email, res.rows[0].city, res.rows[0].street, res.rows[0].zipcode, Decrypt(res.rows[0].password))
  }
  else { 
    var errMsg = "Not data is found!";
    console.log(errMsg);
    res.setHeader('errMsg', errMsg);
    response.end();
   }

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

async function UpdateUserData(req)
{
  const text = "UPDATE Users SET name=$1,familyname=$2,phonenumber=$3,country=$4,city=$5,street=$6,zipcode=$7 WHERE email=$8 ;";
   const values = [req.body.firstname,req.body.lastname,req.body.phone,req.body.country,req.body.city,req.body.street,req.body.zipCode,req.body.email];
  const result = await client.query(text,values);
  console.log("\nUpdate Data!!!!!\n");
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
  const text = "UPDATE users SET email = $1 WHERE id = $2 ;";
   const values = [newemail,id];
  const result = await client.query(text,values);
  console.log("\n\nUpdate Email!!!!!\n\n");
}


