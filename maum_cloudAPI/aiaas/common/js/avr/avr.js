// MINDsLab. UX/UI Team. mrs


var $cropper = null;
var request = null;

function activateCroppie(){

    $cropper = $('#previewImg').croppie({
        showZoomer: true,
        enableExif: true,
        enforceBoundary: false,
        viewport: {
            width: 480,
            height: 250,
            type: 'square',
        },
        boundary: {
            width:500,
            height: 330
        }
    });

}
$(document).ready(function () {

    $('#recogButton').on('click', function (){
        $cropper.croppie('result', {
            type: 'blob',
            size: 'original' //original or viewport
        }).then(function (blob) {
            console.log(blob);
            let url = URL.createObjectURL(blob);

            $('#resultImg').attr('src', url);
            let filename = Date.now() + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            filename += '.' + blob.type.split('/').pop();
            console.log(filename);
            let avr_option = document.querySelector('input[name="avr_option"]:checked').value;

            let file = new File([blob], filename, {type: blob.type, lastModified: Date.now()});

            $('.edit_box').hide();
            $('.avr_2').fadeIn(300);

            console.log('avr',avr_option)

            if(avr_option == 'plate') {
                sendMultiRequest(file, "/avr/multiAvr");
            }else {
                sendRequest(avr_option, file, "/avr/runAvr");
            }
        });
    });

});

function sendRequest(avr_option, file, url){
    let formData = new FormData();
    formData.append('file', file);
    formData.append('option', avr_option);
    formData.append($("#key").val(), $("#value").val());

    request = new XMLHttpRequest();
    request.responseType ="blob";
    request.onreadystatechange = function(){

        if (request.readyState === 4){

            console.log(request.response);

            if(request.status === 200){
                if(request.response == null || request.response.size === 0){
                    alert("서버에서 응답을 받지 못했습니다.\n 다시 시도해 주세요.");
                    window.location.reload();
                }

                let blob = request.response;
                let imgUrl = URL.createObjectURL(blob);

                $('#resultImg').attr('src',  imgUrl);
                $('.avr_2').hide();
                $('.avr_3').fadeIn(300);
            }

            // Response error
            else{
                if(request.status === 0){  // abort
                    // $('.avr_2').hide();
                    // $('.avr_1').show();
                    return;
                }
                alert("Response error : "+ request.status +" \n서버에서 응답을 받지 못했습니다. 다시 시도해 주세요.");
                window.location.reload();
            }
        }

    };

    request.open('POST', url);
    request.send(formData);
    request.timeout = 60000;

    request.ontimeout = function() {
        alert('응답 시간이 초과되었습니다.\n 다시 시도해 주세요.');
        window.location.reload();
    };

    /*$.ajax({
        type: "POST",
        async: true,
        url: url,
        data: formData,
        processData: false,
        contentType: false,
        success: function(imgBase64){
            $('.avr_2').hide();
            $('.avr_3').fadeIn(300);
            console.log("imgBase64 :: "+ imgBase64);
            $('#resultImg').attr('src', "data:image/jpeg;base64," + imgBase64);

        },
        error: function(error){
            alert("Error");
            console.dir(error);
            window.location.reload();
        }
    });*/
}

function sendMultiRequest(file, url){
    let formData = new FormData();
    formData.append('file', file);
    formData.append($("#key").val(), $("#value").val());
    $.ajax({
        type: "POST",
        async: true,
        url: url,
        data: formData,
        processData: false,
        contentType: false,
        timeout: 30000,
        success: function(result){

            console.dir(result);

            let resultJson;
            if(result === null || result === ""){
                alert("서버에서 응답을 받지 못했습니다. 다시 시도해 주세요.");
                window.location.reload();
            }else{
                resultJson = JSON.parse(result);
            }

            document.getElementById('recogbox').style.display = "block";
            let resultAvrImg = resultJson.plt_boxed_img;
            let resultAvrText = resultJson.plt_num;

            console.log(resultAvrText);

            if (resultAvrImg == "" || resultAvrText == "" || resultAvrText.length < 7){
                $('.carnumber').hide();
                $('.carnumber_txt').hide();
                $('#save').hide();
                $(".errortxt").fadeIn();
            } else{
                $('#resultImg').attr('src', "data:image/jpeg;base64," + resultAvrImg);
                $('#carnumber').attr('src', "data:image/jpeg;base64," + resultJson.plt_img);
                $('.carnumber_txt').text(resultAvrText);
            }

            $('.avr_2').hide();
            $('.avr_3').fadeIn(300);
        },
        error: function(error){
            console.dir(error);
            alert("Response error : "+ error.status +" \n서버에서 응답을 받지 못했습니다. 다시 시도해 주세요.");
            window.location.reload();
        }
    });
}

