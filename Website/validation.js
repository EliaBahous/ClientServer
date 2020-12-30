
function checkRecaptcha() {
  var response = grecaptcha.getResponse();
  if(response.length == 0) { 
    //reCaptcha not verified
    alert("You must Check reCaptcha"); 
  }else{
	return 1;
  }
}

// implement on the backend
// function backend_API_challenge() {
//     var response = grecaptcha.getResponse();
//     $.ajax({
//         type: "POST",
//         url: 'https://www.google.com/recaptcha/api/siteverify',
//         data: {"secret" : "6LdZEOUZAAAAABOhim6Lc8XSEb34nczBkgB2LeOe", "response" : response, "remoteip":"localhost"},
//         contentType: 'application/x-www-form-urlencoded',
//         success: function(data) { console.log(data); }
//     });
// }

function validateLogin(){
	emailStr = document.getElementById("email").value;
	passwordStr = document.getElementById("password").value;
	var res = ""
	//res += ValidateEmail(emailStr)
	//res += ValidatePassword(passwordStr)
	if(res!=""){
		alert("Check the parameters"); 
	}else{
		return "";
	}
}
function ValidateEmail(email) 
{
	var res=""
	
	if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)))
	{
		res += "You have entered an invalid email address!\n"
	}
	
	return res
}
function ValidatePassword(password){
	 
	var res=""
	
	if(password.length <6 )
		res+= ("Password Length must be more than 6!\n")
	
	var upperCaseLetters = /[A-Z]/g;
	if(!password.match(upperCaseLetters)) 
		res+= ("Password must include at least 1 upper case letters\n")
	
	var lowerCaseLetters = /[a-z]/g;
	if(!password.match(lowerCaseLetters)) 
		res+= ("Password must include at least 1 lower case letters\n")
	
	var numLetters = /[0-9]/g;
	if(!password.match(numLetters)) 
		res+= ("Password must include at least 1 number\n")
	
	var specialLetters = /^[!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?]/;
	if(!password.match(specialLetters)) 
		res+= ("Password must include at least 1 special letter\n")
	
	
	return res
		
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