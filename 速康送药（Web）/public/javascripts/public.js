
$("#xifenye").click(function(a){
    $("#uljia").empty();
    $("#xab").toggle();
   
    var uljia=$("#uljia");
    var page=parseInt($("#xiye").html());
    var pages=parseInt($("#mo").html());
    for(var i=1;i<=pages;i++)
    {
        var H="<li  onclick='fl("+i+","+pages+")'>"+i+"</li>";

        uljia.append(H);
    }
    scrolltop(page);
})

function fl(p1,p2){
    //var p=p1;
    $("#xiye").empty();
    $("#xiye").html(p1);

}

function topclick(){
    var v=document.getElementById("xiye");
    var num=v.innerHTML;
    if(num>1)
    {
        num--;
        v.innerHTML=num;
        var hei=25*num-25;
        $("#xab").scrollTop(hei);
    }


}
function downclick(){
    var pages=parseInt($("#mo").html());
    var v=$("#xiye");
    var num=parseInt(v.html());
    if(num < pages){
        num = ++num;
        v.html(num);
        scrolltop(num);
    }
}

$("#first").bind("click",function(){
    var v=document.getElementById("xiye");
    v.innerHTML=1;
    scrolltop(v.innerHTML);
})
$("#last").bind("click",function(){
    var v=document.getElementById("xiye");
    var l=document.getElementById("mo");
    v.innerHTML=l.innerHTML;
    scrolltop(v.innerHTML);
})

function scrolltop(top){
    var hei=25*top-25;
    $("#xab").scrollTop(hei);
}