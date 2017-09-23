// /**
//  * Created by Administrator on 2016/9/19.
//  */



$(function() {
    $("#userId").blur(function () {
        if ($("#userId").val() == "") {
            $("#moileMsg").html("<font color='red'>手机号码不能为空！</font>");
            $("userId").focus();
        }
       else if(!$(this).val().match(/^(1(([35][0-9])|(47)|[8][01236789]))\d{8}$/)) {
            $("#moileMsg").html("<font color='red'>手机号码格式不正确！请重新输入！</font>");
            $("userId").focus();
        }
        else {
            $("#moileMsg").html("");
            $("userId").focus();
            ok1=true;
        }
    })
    $(function() {
        $("#password").blur(function () {
            if($(this).val().length >= 6 && $(this).val().length <=20 && $(this).val()!=''){
                $(this).next().text('').removeClass('state1');
                $("password").focus();
                ok2=true;
            }else{
                $(this).next().text('密码应该为6-20位之间').addClass('state1');
                $("password").focus();
            }
        })
    });
    $(function() {
        $("#password1").blur(function () {
            if($(this).val().length >= 6 && $(this).val().length <=20 && $(this).val()!='' && $(this).val() == $('input[name="UserPassword"]').val()){
                $(this).next().text('').removeClass('state1');
                $("password1").focus();
                ok3=true;
            }else{
                $(this).next().text('输入的确认密码要和上面的密码一致,规则也要相同').addClass('state1');
                $("password1").focus();
            }
        })
    });
    
    $('#registerButton').click(function(){
        if(ok1 && ok2 && ok3){
            $('form').submit();
        }else{
            return false;
        }
    });
})
