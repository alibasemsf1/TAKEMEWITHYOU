function login(){
    if(loginValidation()==true){ 
        var xhttp= new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200 ){ 
                var res=JSON.parse(this.responseText)
                if(res.status == true){ 
                    toastr('success', res.message);
                    setTimeout(function(){
                        window.location.href = '/admin/dashboard'
                    },500)
                }else{
                    toastr('error', res.message);
                }
            }
        }

        var remember_me = null; 
        var inputElements = document.getElementsByName('_remember_me');
        for(var i=0; inputElements[i]; ++i){
            if(inputElements[i].checked){
                remember_me = inputElements[i].value;
                break;
            }
        }
        var requestData = `email=${hd_login_email.value}&&password=${hd_login_password.value}&&remember_me=${remember_me}`
        
        xhttp.open('post', "/admin/", true)
        xhttp.setRequestHeader('content-type','application/x-www-form-urlencoded')
        xhttp.send(requestData);
    }else{
        loginValidation();
    }
}

function loginValidation(){
    var name = 0; var password1=0;
    //email validation
    if (hd_login_email.value == ''){ 
        var text = "Please fill all the fields.";
            hd_login_email.focus();
            hd_login_email_error.innerHTML=text;
            hd_login_email_error.classList.add('ad_error');
            name=0;
    }else if(hd_login_email.value != ''){
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (hd_login_email.value == '' || !filter.test(hd_login_email.value)) {
            var text = "Please fill valid email.";
            hd_login_email_error.innerHTML=text;
            hd_login_email_error.classList.add('ad_error');
            hd_login_email.focus();
            name=0;
        }else{
            name=1;
            hd_login_email_error.innerHTML='';
            hd_login_email_error.classList.remove('ad_error');
        }
    }

    //password validation
    if (hd_login_password.value == '') { 
        var text = "Please fill all the fields.";
        //showPopup('error', text);
        hd_login_password.focus();
        hd_login_password_error.innerHTML=text;
        hd_login_password_error.classList.add('ad_error');
        password1 = 0;
    }else if(hd_login_password.value != ''){ 
        if(hd_login_password.value.length < 6) {
            var text = "Password is too short."
            //showPopup('error', text);
            hd_login_password.focus();
            hd_login_password_error.innerHTML=text;
            hd_login_password_error.classList.add('ad_error');
            password1 = 0;
        }else{
            hd_login_password_error.innerHTML='';
            hd_login_password_error.classList.remove('ad_error');
            password1 = 1;
        }
    }

    if(name==1 && password1==1){
        return true;
    }else{
        return false;
    }
}

$('.admin_login input, .admin_fp input').keypress(function(event){
    if(event.keyCode === 13){
        $('.login_btn').click();
        $('.fp_btn').click();
    }
});

function forgot(){
    if(forgotPassword()==true){ 
        var pass = ''; 
        var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +  
                'abcdefghijklmnopqrstuvwxyz0123456789@#$'; 
            
        for (i = 1; i <= 8; i++) { 
            var char = Math.floor(Math.random() 
                        * str.length + 1); 
                
            pass += str.charAt(char) 
        } 

        var xhttp= new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200 ){ 
                    var res=JSON.parse(this.responseText)
                    if(res.status == true){ 
                        toastr('success', res.message);
                        setTimeout(function(){
                            window.location.href = '/admin/'
                        },1500)
                    }else{
                        toastr('error', res.message);
                    }
                }
            }
        
        var requestData = `email=${hd_ad_fp_email.value}&&newPassword=${pass}`
            
        xhttp.open('post',"/admin/forgot-password", true)
        xhttp.setRequestHeader('content-type','application/x-www-form-urlencoded')
        xhttp.send(requestData);
    }else{
        forgotPassword();
    }
}

function forgotPassword() {
    if (hd_ad_fp_email.value == ''){ 
        var text = "Please fill all the fields.";
        hd_ad_fp_email.focus();
        hd_ad_forget_email_error.innerHTML=text;
        hd_ad_forget_email_error.classList.add('ad_error');
        return false;
    }else if(hd_ad_fp_email.value != ''){
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (hd_ad_fp_email.value == '' || !filter.test(hd_ad_fp_email.value)) {
            var text = "Please fill valid email.";
            hd_ad_fp_email.focus();
            hd_ad_forget_email_error.innerHTML=text;
            hd_ad_forget_email_error.classList.add('ad_error');
            return false;
        }else{
            return true;
        }
    }
}
