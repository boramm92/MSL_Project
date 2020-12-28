// MINDsLab. UX/UI Team. mrc

$(document).ready(function() {	
	
//		이미지 파일 선택할 때
//		$('.pattern_1 .img_box').on('click', function () {			
//			$(this).hide(); 
//			$('.pattern_2').show(); 
//			$('.progress li:nth-child(2)').addClass('active'); 	
//		});

	$('#targetFile').on('change', function() {
      	if (this.files && this.files[0]) {
      		if (this.files[0].type.match(/image.*/)){
	      		//var img = $('#previewImg');  // $('img')[0]
	          	$('.pattern_1').hide();
	          	console.log(this.files[0]);
	          	var url = URL.createObjectURL(this.files[0]);
	          	$('#previewImg').attr('src', url); // set src to file url
	          	$('.pattern_2').show(); 
				$('.progress li:nth-child(2)').addClass('active');
				activateCroppie();
            }
      		else{
      			alert('이미지 파일을 업로드하세요.');
      		}
      	}
  	});
});

function activateCroppie(){
    var $cropper;
	$cropper = $('#previewImg').croppie({
		showZoomer: true,
		enableExif: true,
		enforceBoundary: false,
		viewport: {
			width: 480,
			height: 250,
			type: 'square'
		},
		boundary: {
			width:600,
			height: 330
		}
	});
	$('#recogButton').on('click', function () {
        $cropper.croppie('result',{
            type: 'blob',
            size: 'original' //original or viewport
        }).then(function(blob){
            //sendRequest(blob);
            console.log(blob);
            var url = URL.createObjectURL(blob);
            console.log(url);
            $('.progress li:nth-child(3)').addClass('active');
            $('#resultImg').attr('src', url);
            filename = Date.now() + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            filename += '.' + blob.type.split('/').pop();
            console.log(filename);
            var file = new File([blob], filename, { type: blob.type, lastModified: Date.now() });
            $('#loading_img').show(function(){
                sendRequest(file);
            });
        });
//        $cropper.croppie('result',{
//            type: 'base64',
//            size: 'original' //original or viewport
//        }).then(function(imgData){
//            sendRequest(imgData);
//            //console.log(blob);
//            var url = URL.createObjectURL(blob);
//            $('.pattern_2').hide();
//            $('.pattern_3').fadeIn();
//            $('.progress li:nth-child(3)').addClass('active');
//            $('#resultImg').attr('src', url);
//            sendRequest(blob);
//        });
    });
}

function sendRequest(file){
    var formData = new FormData();
    formData.append('file', file);
    console.log(file);
    $.ajax({
        type: "POST",
        async: false,
        url: "/call_recog",
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log(data);
            console.log(data["image_class"]);
            console.log(data["meta"]["amount"]);
            $('.pattern_2').hide();
            $('.pattern_3').fadeIn();
            if (data["image_class"] == "NOTE"){
                $('#bill_table').hide();
                $('#note_table').show();
                showNote(data["meta"]);
            }
            else{
                $('#note_table').hide();
                $('#bill_table').show();
                showBill(data["meta"]);
            }
            $('#loading_img').hide();
        },
        error: function(error){
            $('.pattern_2').hide();
            $('.pattern_3').fadeIn();
			$('.pattern_3 .resultBox_fail').fadeIn();
			$('.resultBox').hide();
            $('#bill_table').hide();
            $('#note_table').hide();
			
            alert("Error");
            $('#loading_img').hide();
        }
    });0
}

function showNote(metaData){
    $('#country').text(metaData['currency']);
    $('#currency').text(metaData['currency']);
    $('#amount').text(metaData['amount']);
}

function showBill(metaData){
    $('#bill_type').text(metaData['type']);
    $('#bill_code').text(metaData['code']);
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
