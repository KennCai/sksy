/**
 * Created by Administrator on 2016/9/12.
 */




//�Ƽ���Ʒ�ֲ�

function busHide(){
    for(b=1;b<5;b++){
        document.getElementById("btmLeftDownMin"+b).style.display="none";
        document.getElementById("color"+b).style.backgroundColor="#10a4de";
    }
}
function busChange(c) {
    busHide();
    document.getElementById("btmLeftDownMin"+c).style.display = "block";
    document.getElementById("color"+c).style.backgroundColor="#db0551";
}


//回到顶部效果
window.onload = function(){
    var obtn = document.getElementById("side3");
    var timer = null;
    var isTop = true;

    window.onscroll = function(){
        if (!isTop){
            clearInterval(timer);
        }
        isTop = false;
    };

    obtn.onclick = function(){
        timer = setInterval(function(){
            var osTop = document.documentElement.scrollTop || document.body.scrollTop;

            var ispeed = Math.floor(-osTop/8) ;
            document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;

            isTop = true;

            if(osTop==0){
                clearInterval(timer);
            }
        },30)


    }
}












