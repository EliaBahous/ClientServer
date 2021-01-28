
function checkRecaptcha() {
  var response = grecaptcha.getResponse();
  if(response.length == 0) { 
  	return "You must Check reCaptcha<br>";
  }else{
	return "";
  }
}

function validateRegister(){
	emailStr = document.getElementById("email").value;
	passwordStr1 = document.getElementById("password1").value;
	passwordStr2 = document.getElementById("password2").value;
	firstNameStr = document.getElementById("firstname").value;
	lastNameStr = document.getElementById("lastname").value;
	var res= "";
	res += ValidateEmail(emailStr);
	res += ValidatePassword(passwordStr1);
	res += textEqual(passwordStr1,passwordStr2);
	res += validateName(firstNameStr);
	res += validateName(lastNameStr);
	return res;
}

function validateLogin(){
	emailStr = document.getElementById("email").value;
	passwordStr = document.getElementById("password").value;
	var res = ""
	res += ValidateEmail(emailStr)

	return res;
}

function ValidateEmail(email) 
{
	var res=""
	
	if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)))
	{
		res += "You have entered an invalid email address!<br>"
	}
	
	return res
}

function validateName(str){
	if (/^[a-zA-Z]+$/.test(str) && str.length>0) {
		return "";
	}
	return " Name or Last Name just letters<br>";
}

function ValidatePassword(password){
	 
	var res=""
	
	if(password.length <6 )
		res+= ("Password Length must be more than 6!<br>")
	
	var upperCaseLetters = /[A-Z]/g;
	if(password.match(upperCaseLetters) || password.match(/[a-z]/)){
		res+=""
	}else{
		res+= ("Password must include at least 1 upper case letters<br>")
	
	}

	var numLetters = /[0-9]/g;
	if(!password.match(numLetters)) 
		res+= ("Password must include at least 1 number<br>")
	

	
	return res
		
}
function textEqual(str1,str2){
	if(str1 != str2){
		return "\nPassword are not equals";
	}
	return "";
}

function sendData() {
	const XHR = new XMLHttpRequest();
	// Bind the FormData object and the form element
	const FD = new FormData(document.getElementById("userlogin"));
	// Define what happens on successful data submission
	XHR.addEventListener( 'load', function( event ) {
		alert( 'Yeah! Data sent and response loaded.' );
	});

	// Define what happens in case of error
	XHR.addEventListener("error", function(event) {
	alert('Oops! Something went wrong.');
	} );
	// Set up our request
	XHR.open("POST", "/login");
  
	// The data sent is what the user provided in the form
	XHR.send(FD);
}