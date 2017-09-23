/**
 * Created by ybgong on 2016/9/12.
 */
var flag = false;
$(document).ready(function () {
    $("#myFile").change(function () {
        var filepath = $("input[name='files']").val();
        //alert(filepath)
        var extStart = filepath.lastIndexOf(".");
        var ext = filepath.substring(extStart, filepath.length).toUpperCase();
        if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
            //alert("图片限于bmp,png,gif,jpeg,jpg格式");
            $("#fileSize").html("图片限于bmp,png,gif,jpeg,jpg格式！");
            flag = false;
            return;
        } else {
            $("#fileType").text(ext);
            $("#fileSize").html("");
            $("#spanMessage").html("");
            flag = true;
        }
        var file_size = 0;
        file_size = this.files[0].size;
        //alert(file_size);
        var size = file_size / 1024;
        if (size > 1024) {
            //alert("上传的图片大小不能超过1M！");
            $("#fileSize").html("上传的图片大小不能超过1M！");
            flag = false;
            return;
        } else {
            var num01 = file_size / 1024;
            num02 = num01.toFixed(2);
            //$("#fileSize").text(num02 + " KB");
            $("#fileSize").html("");
            $("#spanMessage").html("");
            flag = true;
        }
        return true;
    });
});

function uploadFile() {
    //判断文件是否符合
    if (flag) {
        var formData = new FormData($("#frmUploadFile")[0]);
        $.ajax({
            url: 'UploadPic1',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (200 === data.code) {
                    //$("#imgShow").attr('src', data.msg.url);
                    $("#spanMessage").html("提交成功!");
                    //res.redirect("/users/queryAllgoods");
                    location.href='/users/queryAllgoods'
                } else {
                    $("#spanMessage").html("提交失败,请重新输入！");
                }
                console.log('imgUploader upload success, data:', data);
            },
            // success:function () {
            //     $("#spanMessage").html("成功！");
            // },
            error: function () {
                $("#spanMessage").html("与服务器通信发生错误");
            }
        });
    }
    else {
        $("#spanMessage").html("请选择正确的图片!");
    }
}