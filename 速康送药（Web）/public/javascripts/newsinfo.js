/**
 * Created by ybgong on 2016/9/12.
 */
var flag = false;
// $(document).ready(function () {
//     var flag = true;
//     $("#addNews").click=addNews;
// });

function addNewsInfo() {
    //判断文件是否符合
    alert("addNewsInfo() ")
    //if (flag) {
        var formData = new FormData($("#frmUploadFile")[0]);
        alert(formData)
        $.ajax({
            url: 'addNews',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (200 === data.code) {
                    $("#spanMessage").html("添加成功!");
                } else {
                    $("#spanMessage").html("添加失败,请重新输入！");
                }
                console.log('imgUploader upload success, data:', data);
            },
            error: function () {
                $("#spanMessage").html("与服务器通信发生错误");
            }
        });
    // }
    // else {
    //     $("#spanMessage").html("必填!");
    // }
}