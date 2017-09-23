/**
 * Created by Administrator on 2016/10/31.
 */
//====================侧边菜单栏===========================
$( "li" ).hover(
    function() {
        /*$(this).find("a").css("color","#FFF");*/
        $(this).find("span").stop().animate({
            width:"100%",
            opacity:"1"
        },800,function () {

        })
    }, function() {
        /*$(this).find("a").css("color","#FFF");*/
        $(this).find("span").stop().animate({
            width:"0%",
            opacity:"0"
        }/*,100,function () {
        }*/)
    }
);