const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql'); 
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
let port = process.env.PORT || 3000;
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: 'store'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
app.use(express.static('web')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/
app.get('/', function(req, res){
    return res.sendFile('index.html');
  }); 
app.use(express.static('web'));
app.post('/login', function(req, res) {
    var user_id = req.body.id;
    var pass = req.body.pass;
    con.query("SELECT idusers,name,familyname FROM users WHERE Email='"+user_id+"' AND Password='"+pass+"'", function (err, result, fields) {
      if (err) throw err;
      if(result.length > 0){
        res.sendFile(__dirname+ "/web/ContactUsPage.html");
        console.log("Successfully logged in , session wil start for : " +result[0].idusers);
      }
      else
        res.sendFile(__dirname+ "/web/SignUpPage.html");
        console.log("Bad Login");
    });
    
  });
app.post('/login', function(req, res) {
  var user_id = req.body.id;
  var pass = req.body.pass;
  //save data in database
  console.log(user_id + " " + pass);
    res.sendFile(__dirname+ "/web/ContactUsPage.html");
 
});

app.listen(port, function(){
  
  console.log("Listening on port 3000!")
});
