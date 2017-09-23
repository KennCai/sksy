
window.onload=function () {
    var oName = document.getElementById("UserId");
    var pwd = document.getElementById("UserPassword");
    var pwd2 = document.getElementById("UserPassword2");
    var aP = document.getElementsByTagName("p");
    var name_msg = aP[0];
    var pwd_msg = aP[1];
    var pwd2_msg = aP[2];
    var aEm = document.getElementsByTagName("em");


    oName.onblur=checkUsername;
    pwd.onblur=checkPassword;
    pwd2.onblur=checkPassword2;

    function checkUsername() {
        var UsernameValue = oName.value;
        var UsernameRegex = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
        var UsernameRegex2 = /^.{3,20}$/;
        var msg ="&nbsp;<img src='/images/通过.png' style='margin-left: -7px'>";
        if(UsernameValue == null || UsernameValue == "")
            msg ="<font color='red' style='font-size: 14px'><br>&nbsp;用户名不能为空!</font>"
        else if(!UsernameRegex.test(UsernameValue))
            msg ="<font color='red' style='font-size: 14px'><br>&nbsp;用户名可以为汉字、字母、数字或下划线，字母区分大小写</font>";
        else if(!UsernameRegex2.test(UsernameValue))
            msg ="<font color='red' style='font-size: 14px'><br>&nbsp;长度只能为3-20个字符！</font>";

        var span = document.getElementById("UserIdSpan");
        span.innerHTML = msg;
        return (msg =="&nbsp;<img src='/images/通过.png' style='margin-left: -7px'>");
    }

    pwd.onkeyup=function () {
        if(pwd.value.length>7){
            aEm[1].className="active";
            pwd2.removeAttribute("disabled");
            pwd2_msg.style.display="block";
        }else {
            aEm[1].className=" ";
            pwd2.removeAttribute("disabled");
            pwd2_msg.style.display="none" +
                "";
        }if (pwd.value.length>11){
            aEm[2].className="active";
        }else{
            aEm[2].className="";
        }
    };
    function checkPassword() {

        var PasswordValue = pwd.value;
        var PasswordRegex = /^[a-zA-Z0-9_]+$/;
        var PasswordRegex2 = /^\w{6,20}$/;
        var msg ="&nbsp;<img src='/images/通过.png'>";

        if (!PasswordValue)
            msg = "<font color='red' style='font-size: 14px'><br>&nbsp;密码不能为空!</font>";
        else if(!PasswordRegex.test(PasswordValue))
            msg ="<font color='red' style='font-size: 14px'><br>&nbsp;密码必须为字母、数字或下划线，字母区分大小写</font>";
        else if (!PasswordRegex2.test(PasswordValue)) {
            msg = "<font color='red' style='font-size: 14px'><br>&nbsp;密码只能6-20位</font>";
        }
        var span = document.getElementById("UserPasswordSpan");
        span.innerHTML = msg;
        return (msg == "&nbsp;<img src='/images/通过.png'>");


    }
    function checkPassword2() {

        var PasswordValue = pwd.value;
        var Password2Value = pwd2.value;
        var msg ="&nbsp;<img src='/images/通过.png'>";
        if (!Password2Value)
            msg = "<font color='red' style='font-size: 14px'><br>&nbsp;确认密码不能为空!</font>";
        else if (Password2Value != PasswordValue)
            msg = "<font color='red' style='font-size: 14px'><br>&nbsp;两次密码不一致!</font>";
        var span = document.getElementById("UserPassword2Span");
        span.innerHTML = msg;
        return (msg == "&nbsp;<img src='/images/通过.png'>");

    }
    var form=document.getElementById("form");
    form.onsubmit = function(){
        var bUsername = checkUsername();
        var bPassword = checkPassword();
        var bConfirm = checkPassword2();
        return bUsername && bPassword && bConfirm ;
    }
};
