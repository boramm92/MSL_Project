//=== MINDsLab. UX/UI Team. mrs
//=== MINDsLab. API Service Team. YGE edit - 2019.08.11

var req;
var $cropper = null;
function activateCroppie(){

    $cropper = $('#previewImg').croppie({
        showZoomer: true,
        enableExif: true,
        enforceBoundary: false,
        enableOrientation: true,
        viewport: {
            width: 420,
            height: 180,
            type: 'square'
        },
        boundary: {
            width:600,
            height: 300
        }

    });
    $cropper.croppie('bind', {
        url: sample1SrcUrl,

    });

}
function activateCroppie2(){

    $cropper = $('#previewImg').croppie({
        showZoomer: true,
        enableExif: true,
        enforceBoundary: false,
        enableOrientation: true,
        viewport: {
            width: 420,
            height: 180,
            type: 'square'
        },
        boundary: {
            width:600,
            height: 300
        }
    });
    $cropper.croppie('bind', {
        url: sample2SrcUrl,
        points: [118,60,458,370]
    });


}

//진료비 영수증 추가 2019-12-23
// function activateCroppie3(){
//     $cropper = $('#previewImg').croppie({
//         showZoomer: true,
//         enableExif: true,
//         enforceBoundary: false,
//         enableOrientation: true,
//         viewport: {
//             width: 560,
//             height: 760,
//             type: 'square'
//         },
//         boundary: {
//             width:600,
//             height: 850
//         }
//
//     });
//     $cropper.croppie('bind', {
//         url: sample3SrcUrl
//     });
// }

function popCroppie(){
    $cropper = $('#previewImg').croppie({
        showZoomer: true,
        enableExif: true,
        enforceBoundary: false,
        enableOrientation: true,
        viewport: {
            width: 420,
            height: 180,
            type: 'square'
        },
        boundary: {
            width:600,
            height: 300
        }
    });
}

// function popCroppie2(){
//     $cropper = $('#previewImg').croppie({
//         showZoomer: true,
//         enableExif: true,
//         enforceBoundary: false,
//         enableOrientation: true,
//         viewport: {
//             width: 560,
//             height: 760,
//             type: 'square'
//         },
//         boundary: {
//             width:600,
//             height: 850
//         }
//
//     });
// }
$("#rotate_left").on('click', function() {
    $cropper.croppie('rotate', 90);
});

$('#recogButton').on('click', function () {
    $("html").scrollTop(0);
    $cropper.croppie('result',{
        type: 'blob',
        size: 'original' //original or viewport
    }).then(function(blob){
        var url = URL.createObjectURL(blob);
        //console.log(url);
        $('#resultImg').attr('src', url);
        var filename = Date.now() + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        filename += '.' + blob.type.split('/').pop();
        // console.log(filename);
        var file = new File([blob], filename, { type: blob.type, lastModified: Date.now() });

        $('.pattern_2').hide();
        $('.loding_area').fadeIn(300);


        sendRequest(file);

    });
});


function sendReqHospitalReceipt(file){

    console.dir(file);

    var formData = new FormData();
    formData.append('file', file);
    formData.append($("#key").val(), $("#value").val());

    req = $.ajax({
        type : "POST",
        async: true,
        url : "/api/hospitalReceipt",
        data : formData,
        processData : false,
        contentType : false,
        timeout : 420000,
        success : function(result) {
            console.log(result);
            $('#item_result').empty();

            var tblStr = "";

            if (result[0] === undefined) {
                $('#save').hide();
                tblStr += '<tr><td colspan="3" class="bold_txt">인식 오류 : 다시 한 번 시도해 주세요.</td></tr>';


            }else {
                $('#save').show();
                var demoFileTxt = $('#demoFile').val();
                $('#hospital_origin').text("원본 이미지");

                if(demoFileTxt == ""){
                    console.log("샘플 원본 넣기");
                    $('#samplem_edical').attr('src', sample3SrcUrl);
                }else {
                    console.log("업로드 원본 넣기");
                    // $('#samplem_edical').attr('src', url);
                }


                var bodyArr = result[1].body;
                var maxCnt = 0;
                csvContent = "";

                for (var j in bodyArr){
                    var line = bodyArr[j].split(",");
                    var tmpCnt = line.length;
                    tmpCnt > maxCnt ? maxCnt = tmpCnt : false;
                    csvContent += line + "\n"; //csv저장용
                }

                for (j in bodyArr){
                    line = bodyArr[j].split(",");

                    if(bodyArr[j].search("합계") !== -1){ //합계
                        tblStr += '<tr class="sum">' +
                            '<td colspan="2" class="bold_txt">'+line[1]+'</td>';
                    }
                    else{
                        tblStr += '<tr class="">' +
                            '<td class="bold_txt">'+line[0]+'</td>' +
                            '<td class="align_left">'+line[1]+'</td>';
                    }
                    for(let k=2; k < maxCnt ; k++){
                        line[k] === "" ||line[k] === undefined ?
                            tblStr += '<td class="align_right">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>'
                            : tblStr += '<td class="align_right">'+line[k]+'</td>';
                    }
                    tblStr += '</tr>';
                }
            }
            $('.loding_area').hide();
            $('.img_box').hide();
            $('.resultBox').hide();
            $('.pattern_3').fadeIn(300);
            $('.result_hospital').fadeIn(300);
            $('#item_category th:nth-child(3)').attr('colspan', maxCnt-2);
            $('#item_result').append(tblStr);

        },
        error : function(req, err) {
            console.log("Error : " + err);
            // window.location.reload();
        }
    });
}
function sendRequest(file){
    // console.dir(file);

    var formData = new FormData();
    formData.append('file', file);
    formData.append($("#key").val(), $("#value").val());

    // console.dir(formData);
    req = $.ajax({
        type: "POST",
        async: true,
        url: "/idr/callRecog",
        data: formData,
        processData: false,
        contentType: false,
        success: function(stringData){
            var data = JSON.parse(stringData);
            //console.dir(data);
            //console.log(data.image_class);
            //console.log(data["meta"]["amount"]);
            $('.demo_layout ').css("border", "none");
            $('.loding_area').hide();
            $('.pattern_3').fadeIn(300);
            if (data["image_class"] === "NOTE"){

                $('#bill_table').hide();
                $('#note_table').fadeIn(300);
                showNote(data["meta"]);
            }
            else if (data["image_class"] === "BILL"){
                $('#note_table').hide();
                $('#bill_table').fadeIn(300);
                showBill(data["meta"]);
            }
            console.log("result cropper: " + $cropper);

        },
        error: function(error){
            if(error.statusText === "abort"){
                return;
            }
            $('.demo_layout ').css("border", "none");
            $('.loding_area').hide();
            $('.pattern_3').fadeIn(300);
            $('.pattern_3 .resultBox_fail').fadeIn(300);
            $('.resultBox').hide();
            $('#bill_table').hide();
            $('#note_table').hide();

            alert("Error");
            console.error(error);
            window.location.reload();
        }

    });

}

var csvContent = "";
function downloadResultImg(){
    var fileName = 'DIARL_result.csv';
    var mimeType = 'text/csv';
    var a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';
    if (navigator.msSaveBlob) { // IE10
        return navigator.msSaveBlob(new Blob(["\ufeff"+csvContent], {type: mimeType+";charset=utf-8;"}), fileName);
    } else if ('download' in a) { //html5 A[download]
        let blob = new Blob(["\ufeff"+csvContent], {type: mimeType+";charset=utf-8;"});
        a.href = URL.createObjectURL(blob);
        // a.href = 'data:' + mimeType + ',' + encodeURIComponent(csvContent);
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return true;
    } else { //do iframe dataURL download (old ch+FF):
        var f = document.createElement('iframe');
        document.body.appendChild(f);
        f.src = 'data:' + mimeType + ',' + encodeURIComponent(csvContent);

        setTimeout(function() {
            document.body.removeChild(f);
        }, 500);
        return true;
    }
}



$(document).ready(function () {

    // 크롭 취소
    $('#editCancel').on('click', function(){
        $('input[id="opt1"]').trigger("click");
        $('.pattern_2').hide();
        $('#previewImg').removeAttr('src');
        reset();
    });
    // 변환 중 취소
    $('#btn_back1').on('click', function () {
        req.abort();
        $('.loding_area').hide();
        $('#previewImg').removeAttr('src');
        reset();
    });
    // 완료 후 처음으로
    $('.btn_back2').on('click', function () {
        $('.pattern_3').hide();
        $('#sampleImg_1').trigger("click");
        $('input[id="opt1"]').trigger("click");
        $('.pattern_1').fadeIn(300);
        $('.fl_box').css('opacity', '1');
        $('.demo_layout ').css("border", "solid 1px #cfd5eb;");
        window.location.reload();
    });

});

function reset(){
    $cropper.croppie('destroy');
    $cropper = null;
    $('.pattern_1').fadeIn(300);
    $('.fl_box').css('opacity', '1');
    $('.demo_layout ').css("border", "solid 1px #cfd5eb;");
    // $('#demoFile').val('');
}

function showNote(metaData){
    $('#country').text(metaData['currency']);
    $('#currency').text(metaData['currency']);
    $('#amount').text(metaData['amount']);
}

function showBill(metaData){
    $('#bill_type').text(metaData['type']);
    $('#bill_code').text(metaData['code']);
    var numberCode =  $('#bill_code').text();
    var idx = numberCode.replace('01', '01 ');
    var result = idx.replace('10', '1 0')
    $('#bill_code').text(result);
}

//API 탭
function openTap(evt, menu) {
    var i, demobox, tablinks;
    demobox = document.getElementsByClassName("demobox");
    for (i = 0; i < demobox.length; i++) {
        demobox[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(menu).style.display = "block";
    evt.currentTarget.className += " active";
}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();