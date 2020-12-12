//<script>




    function SendMail(){
        window.open('mailto:test@example.com');


    }



    function myfunc3(){
        var format="!@#$%^&*()_+-=`~[]{}':;<,>.?/*\|";


       // var span =document.getElementById("passfail");
     //  var x =document.getElementById("pass").lengh;
     //  document.getElementById("pass").innerHTML = x;
      
 //    var len =document.getElementById("myForm").elements.item(0).value[0];
 //    document.getElementById("demo3").innerHTML = len;

 ////----------------------------------------------------------------------------------6characters//////////

 
 var len1 =document.getElementById("myForm").elements[0].value;
 var strEmail=len1.length;
   // document.getElementById("demo3").innerHTML = strEmail;

    var len2 =document.getElementById("myForm").elements[1].value;
    var strPass=len2.length;
      // document.getElementById("demo3").innerHTML = strPass;

       var NumbersCounts=0, NumbersCountsFormat=0, NumbersCountsLow=0, NumbersCountsUp=0,finalCounter=0;


           if(strPass<5)      //if(document.getElementById("myForm").elements[1].lenght == 1)
          document.getElementById("passfail5").innerHTML="should be more then 5 characters";
         else
          {
             document.getElementById("passfail5").innerHTML="";
              finalCounter++;
          }

////------------------------------------------------------------------------------------cnontains number-----------//



    for(i=0;i<strPass;i++)
        {
            if(len2.charAt(i)>=0 && len2.charAt(i)<=9)
            NumbersCounts++;
        }

        if(NumbersCounts==0)
        var noNumber =document.getElementById("noNumber1").innerHTML="should cnontain 1 number at least";
        else
        {
     //   var noNumber =document.getElementById("noNumber1").innerHTML=" cnontains number";
     var noNumber =document.getElementById("noNumber1").innerHTML="";
        finalCounter++;
        }


////----------------------------------------------------------------------------------------specail charaters--//
for(j=0;j<strPass;j++)
{
    for(i=0;i<format.length;i++)
        {
            if(len2.charAt(j)==format.charAt(i))
            NumbersCountsFormat++;
        }
    }

        if(NumbersCountsFormat==0)
        var noNumber =document.getElementById("noSecialNumber1").innerHTML="should cnontain specail charaters";
        else
        {
        var noNumber =document.getElementById("noSecialNumber1").innerHTML="";
        finalCounter++;
        }

////----------------------------------------------------------------------------------------lowercase--//

        for(i=0;i<strPass;i++)
        {
            if(len2.charAt(i)>='a' && len2.charAt(i)<='z')
            NumbersCountsLow++;
        }

        if(NumbersCountsLow==0)
        var noNumber =document.getElementById("noLowercase1").innerHTML="should cnontain Lowercase Character";
        else
        {
        var noNumber =document.getElementById("noLowercase1").innerHTML="";
        finalCounter++;
       }



        ////----------------------------------------------------------------------------------------uppercase--//

        for(i=0;i<strPass;i++)
        {
            if(len2.charAt(i)>='A' && len2.charAt(i)<='Z')
            NumbersCountsUp++;
        }

        if(NumbersCountsUp==0)
        var noNumber =document.getElementById("noUppercase1").innerHTML="should cnontain Uppercase Character";
        else
       {
        var noNumber =document.getElementById("noUppercase1").innerHTML="";
        finalCounter++;
        }


    if(finalCounter==5)
    {
    // var EmailAndPass =document.getElementById("EmailAndPass1").window.alert("done");
    window.alert( "The Email is: " +len1 +"\n" + "The Password is: " + len2);
   

    } 
    
    var EMAIL_REGEXP = new RegExp('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$', 'i');
    if(EMAIL_REGEXP.test(len1)==false)
    {
    alert("Email not found");
  

    }
  else
    document.getElementById("demo300").innerHTML = "the email is good";
    

}
//*********************************************************************************************************************************************** */
//********************************************************************************************************************************************** */
//---------------------------------------------------------------------------------------------------
//---------------------        S I G N      U P    P  A G E    -------------------------------------//



function myfunc4()
{
    var format_1="!@#$%^&*()_+-=`~[]{}':;<,>.?/*\|";



   // document.getElementById("demo31").innerHTML = len;

////----------------------------------------------------------------------------------6characters//////////
var len1_1 =document.getElementById("myForm").elements[0].value;
var strEmail_1=len1_1.length;
//document.getElementById("demo31").innerHTML = strEmail_1;

var len2_1 =document.getElementById("myForm").elements[1].value;
var strPass_1=len2_1.length;
  // document.getElementById("demo41").innerHTML = strPass_1;

  var len3_1 =document.getElementById("myForm").elements[2].value;
   var strPassConf=len3_1.length;
     // document.getElementById("demo32").innerHTML = strPassConf;


      var NumbersCounts_1=0, NumbersCountsFormat_1=0, NumbersCountsLow_1=0, NumbersCountsUp=0,finalCounter_1=0;
      var PassConfirm_1=0;

       if(strPass_1<5)      //if(document.getElementById("myForm").elements[1].lenght == 1)
      document.getElementById("passfail51").innerHTML="should be more then 5 characters";
      else
      {
          document.getElementById("passfail51").innerHTML="";
          finalCounter_1++;
      }

////------------------------------------------------------------------------------------cnontains number-----------//



for(i=0;i<strPass_1;i++)
    {
        if(len2_1.charAt(i)>=0 && len2_1.charAt(i)<=9)
        NumbersCounts_1++;
    }

    if(NumbersCounts_1==0)
    var noNumber =document.getElementById("noNumber11").innerHTML="should cnontain 1 number at least";
    else
    {
    var noNumber =document.getElementById("noNumber11").innerHTML="";

    finalCounter_1++;
    }


////----------------------------------------------------------------------------------------specail charaters--//
for(j=0;j<strPass_1;j++)
{
for(i=0;i<format_1.length;i++)
    {
        if(len2_1.charAt(j)==format_1.charAt(i))
        NumbersCountsFormat_1++;
    }
}

    if(NumbersCountsFormat_1==0)
    var noNumber =document.getElementById("noSecialNumber11").innerHTML="should cnontain specail charaters";
    else
    {
    var noNumber =document.getElementById("noSecialNumber11").innerHTML="";
    finalCounter_1++;
    }

////----------------------------------------------------------------------------------------lowercase--//

    for(i=0;i<strPass_1;i++)
    {
        if(len2_1.charAt(i)>='a' && len2_1.charAt(i)<='z')
        NumbersCountsLow_1++;
    }

    if(NumbersCountsLow_1==0)
    var noNumber =document.getElementById("noLowercase11").innerHTML="should cnontain Lowercase Character";
    else
    {
    var noNumber =document.getElementById("noLowercase11").innerHTML="";
    finalCounter_1++;
    }



    ////----------------------------------------------------------------------------------------uppercase--//

    for(i=0;i<strPass_1;i++)
    {
        if(len2_1.charAt(i)>='A' && len2_1.charAt(i)<='Z')
        NumbersCountsUp++;
    }

    if(NumbersCountsUp==0)
    var noNumber =document.getElementById("noUppercase11").innerHTML="should cnontain Uppercase Character";
    else
    {
    var noNumber =document.getElementById("noUppercase11").innerHTML="";
    finalCounter_1++;
    }


   ////----------------------------------------------------------------------------------------pASSWORD mATCH--//


if(strPass_1==0)
PassConfirm_1++;


   for(i=0;i<strPass_1;i++)
   {
       if(len2_1.charAt(i)!=len3_1.charAt(i)  )
         PassConfirm_1++;
   }
   if(PassConfirm_1==0)
   {
   var ConfirmOK =document.getElementById("ConfirmOK1").innerHTML="Password match";
   finalCounter_1++;
   }
   else
   {
    var ConfirmOK =document.getElementById("ConfirmOK2").innerHTML="Password doesn't match";
   }

   //------------------------------------------------------------------------------------------------------------//

if(finalCounter_1==6)
{
// var EmailAndPass =document.getElementById("EmailAndPass1").window.alert("done");
alert("Successfull");
document.getElementById("demo3001").innerHTML = "Successfull";
window.alert( "The Emailis: " +len1_1 +"\n" + "The Password is: " + len2_1);


}

var EMAIL_REGEXP2 = new RegExp('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$', 'i');
if(EMAIL_REGEXP2.test(len1_1)==false)
{
    //document.getElementById("demo3000").innerHTML = "the email is not good";
    myfunc6();
alert("Email not found");
}
else

document.getElementById("demo3000").innerHTML = "the email is good";

}



function myfunc6(){
    document.getElementById("demo3000").innerHTML = "the email is not good";
 

}







//--------------------------------------------------------------------------------------------------------//

////*****test**********/



    





//*********************************************************************************************************************************************** */
//********************************************************************************************************************************************** */
//---------------------------------------------------------------------------------------------------
//---------------------        C  O  N  T  A  C  T         U  S    -------------------------------------//


    function myfunc5(){
       // var format="!@#$%^&*()_+-=`~[]{}':;<,>.?/*\|";
var mailCheck3=0;


 ////----------------------------------------------------------------------------------6characters//////////

 var len4_2 =document.getElementById("myForm").elements[3].value;
 var strEmail_3=len4_2.length;
   // document.getElementById("demo3122").innerHTML = strEmail_3+"teaxt area";


 var len1_2 =document.getElementById("myForm").elements[1].value;
 var strEmail_2=len1_2.length;
   // document.getElementById("demo311").innerHTML = strEmail_2+" mail ok";


   var EMAIL_REGEXP3 = new RegExp('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$', 'i');
   if(EMAIL_REGEXP3.test(len1_2)==false)
   {
   alert("Email not found");
   mailCheck3++;

   }
    var len2_2 =document.getElementById("myForm").elements[2].value;
    var strPass_2=len2_2.length;
    //  document.getElementById("demo411").innerHTML = strPass_2;



       var len3_2 =document.getElementById("myForm").elements[0].value;
       var strPassConf_2=len3_2.length , finalCounter_2_2=0;
        // document.getElementById("demo322").innerHTML = strPassConf_2+" name";



          if(strEmail_2>0 && strPass_2>0 && strPassConf_2>0 && strEmail_3>0 && mailCheck3==0)
          {
            window.alert( "The information was sent");
           
            document.getElementById("demo311").innerHTML = "The mail is: "+len1_2;
            document.getElementById("demo411").innerHTML = "You selected: "+len2_2;
            document.getElementById("demo322").innerHTML = "The name is: "+len3_2;
           document.getElementById("demo422").innerHTML = "All informastio are good";
           document.getElementById("demo3122").innerHTML ="The subject is: "+len4_2 ;
 
            

          }
          if(strPassConf_2==0) 
          {
         // document.getElementById("demo322").innerHTML = "wrong name";
          window.alert( "wrong name");
          }
          if(strEmail_2==0 || mailCheck3==1)
          {
         document.getElementById("demo311").innerHTML = "wrong Email";
         // window.alert( "wrong Email");
          }
           if(strEmail_3==0)
           {
           //document.getElementById("demo3122").innerHTML = "empty subject";
           window.alert( "wrong subject");
           }

      




       var NumbersCounts_2=0, NumbersCountsFormat_2=0, NumbersCountsLow_2=0, NumbersCountsUp_2=0,finalCounter_2=0;
/*

           if(strPass_2<5)      //if(document.getElementById("myForm").elements[1].lenght == 1)
          document.getElementById("passfail5").innerHTML="should be more then 5 characters";
          else
          {
              document.getElementById("passfail5").innerHTML="its more then 5 characters";
              finalCounter_2++;
          }

////------------------------------------------------------------------------------------cnontains number-----------//



    for(i=0;i<strPass_2;i++)
        {
            if(len2_2.charAt(i)>=0 && len2_2.charAt(i)<=9)
            NumbersCounts_2++;
        }

        if(NumbersCounts_2==0)
        var noNumber =document.getElementById("noNumber1").innerHTML="should cnontain 1 number at least";
        else
        {
        var noNumber =document.getElementById("noNumber1").innerHTML=" cnontains number";

        finalCounter_2++;
        }


////----------------------------------------------------------------------------------------specail charaters--//
for(j=0;j<strPass_2;j++)
{
    for(i=0;i<format.length;i++)
        {
            if(len2_2.charAt(j)==format.charAt(i))
            NumbersCountsFormat_2++;
        }
    }

        if(NumbersCountsFormat_2==0)
        var noNumber =document.getElementById("noSecialNumber1").innerHTML="should cnontain specail charaters";
        else
        {
        var noNumber =document.getElementById("noSecialNumber1").innerHTML=" cnontains specail charaters";
        finalCounter_2++;
        }

////----------------------------------------------------------------------------------------lowercase--//

        for(i=0;i<strPass_2;i++)
        {
            if(len2_2.charAt(i)>='a' && len2_2.charAt(i)<='z')
            NumbersCountsLow_2++;
        }

        if(NumbersCountsLow_2==0)
        var noNumber =document.getElementById("noLowercase1").innerHTML="should cnontain Lowercase Character";
        else
        {
        var noNumber =document.getElementById("noLowercase1").innerHTML=" cnontains Lowercase Character";
        finalCounter_2++;
        }



        ////----------------------------------------------------------------------------------------uppercase--//

        for(i=0;i<strPass_2;i++)
        {
            if(len2_2.charAt(i)>='A' && len2_2.charAt(i)<='Z')
            NumbersCountsUp_2++;
        }

        if(NumbersCountsUp_2==0)
        var noNumber =document.getElementById("noUppercase1").innerHTML="should cnontain Uppercase Character";
        else
        {
        var noNumber =document.getElementById("noUppercase1").innerHTML=" cnontains Uppercase Character";
        finalCounter_2++;
        }



        /************ */

      
       
        
    
    
           
          
/*
        
    if(finalCounter_2_2==3)
    {
    // var EmailAndPass =document.getElementById("EmailAndPass1").window.alert("done");
    window.alert( "The Email is: " +len1_2 +"\n" + "The Password is: " + len2_2);
   

    }
    */   
}













/********************************************************************** */

    function myfunc2(){
        // var span =document.getElementById("passfail");
        var x =document.getElementById("myForm").elements[0].value;
        document.getElementById("demo3").innerHTML = x;

        var y =document.getElementById("myForm").elements[1].value;
        document.getElementById("demo4").innerHTML = y;

    } 


   /* 
    function myfunc2342(){
       // document.getElementById("demo2").window.alert(Its && changed);
      // window.alert(Itschanged0000);
       window.alert("asd");
    }
//</script> -->

function changeText() {
	var span = document.getElementById("output");
	var textBox = document.getElementById("textbox");
	
	textbox.style.color = "red";	
}
*/