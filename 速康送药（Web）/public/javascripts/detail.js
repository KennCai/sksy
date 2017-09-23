/**
 * Created by Administrator on 2016/9/13.
 */
function setTab(name,cursel,n){   //n为菜单个数
    for(var i=1;i<=n;i++){
        var menu=document.getElementById(name+i);
        var con=document.getElementById("con_"+name+"_"+i);
        menu.className=i==cursel?"hover":"";
        con.style.display=i==cursel?"block":"none";
    }
}

function setTab2(name2,cursel2,n){   //n为菜单个数
    for(var i=1;i<=n;i++){
        var menu2=document.getElementById(name2+i);
        var con2=document.getElementById("con2_"+name2+"_"+i);
        menu2.className=i==cursel2?"hover":"";
        con2.style.display=i==cursel2?"block":"none";
    }
}
function seeBig(_this) {
    document.all.view_img.src=_this.getElementsByTagName("img")[0].src;
}

/*============活动专区================*/

    $(document).ready(function(){
        var ali=$('#lunbonum li');
        var aPage=$('.lunhuan p');

        var iNow=0;
        ali.each(function(index){
            $(this).mouseover(function(){
                slide(index);
            })
        });
        function slide(index){
            iNow=index;
            ali.eq(index).addClass('lunboone').siblings().removeClass();
            aPage.eq(index).siblings().stop().animate({opacity:0},600);
            aPage.eq(index).stop().animate({opacity:1},600);
        }
        function autoRun(){
            iNow++;
            if(iNow==ali.length){
                iNow=0;
            }
            slide(iNow);
        }
        var timer=setInterval(autoRun,4000);
        ali.hover(function(){
            clearInterval(timer);
        },function(){
            timer=setInterval(autoRun,4000);
        });
    })


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





