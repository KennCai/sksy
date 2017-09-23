/**
 * Created by Administrator on 2016/9/19.
 */
function getClass(oParent,sClass){
    var oElem = document.getElementById(oParent).getElementsByTagName("*");
    var aClass=[];
    var i= 0;
    for(i;i<oElem.length;i++){
        if(oElem[i].className == sClass)aClass.push(oElem[i]);
    }
    return aClass;
}
window.onload = function(){
    var oSmall = getClass("div0","small")[0];
    var oMark = getClass("div0","mark")[0];
    var oFloatLeft = getClass("div0","floatLeft")[0];
    var oBig = getClass("div0","big")[0];
    var oDiv = document.getElementById("div0");
    var oImg = oBig.getElementsByTagName("img")[0];
    oMark.onmouseover = function(){
        oFloatLeft.style.display = "block";
        oBig.style.display = "block"
    };
    oMark.onmouseout = function(){
        oFloatLeft.style.display = "none";
        oBig.style.display = "none"
    };
    oMark.onmousemove = function(ev){
        var oEvent = ev || event;
        var l = oEvent.clientX - oDiv.offsetLeft - oSmall.offsetLeft - oFloatLeft.offsetWidth/2;
        var t = oEvent.clientY - oDiv.offsetTop - oSmall.offsetTop - oFloatLeft.offsetHeight/2;
        if(l<0){
            l=0;
        }else if(l> (oMark.offsetWidth- oFloatLeft.offsetWidth)){
            l=oMark.offsetWidth- oFloatLeft.offsetWidth ;

        }

        if(t<0){
            t=0;
        }else if(t> (oMark.offsetHeight- oFloatLeft.offsetHeight)){
            t=oMark.offsetHeight- oFloatLeft.offsetHeight;

        }

        oFloatLeft.style.left = l + "px";   //oSmall.offsetLeft的值是相对什么而言
        oFloatLeft.style.top = t + "px";
        var percentX = l/(oMark.offsetWidth-oFloatLeft.offsetWidth);
        var percentY = t/(oMark.offsetHeight-oFloatLeft.offsetHeight);
        oImg.style.left = - percentX * (oImg.offsetWidth - oBig.offsetWidth) +"px";
        oImg.style.top = -percentY * (oImg.offsetHeight - oBig.offsetHeight) +"px";
    }
}
