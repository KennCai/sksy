

function uploadFile() {
    //判断文件是否符合，是否有文件？？？
   
        var formData = new FormData($("#frmUploadFile")[0]);
        $.ajax({
            url: '/users/UPassword',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (200 === data.code) {
                    $("#imgShow").attr('src', data.msg.url);
                    $("#spanMessage").html("上传成功!");
                } else {
                    $("#spanMessage").html("上传失败,请重新输入！");
                }
                console.log('imgUploader upload success, data:', data);
            },
            error: function () {
                $("#spanMessage").html("与服务器通信发生错误");
            }
        });
  
  
}