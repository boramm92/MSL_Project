
jQuery.event.add(window,"load",function(){	
	$(document).ready(function (){
		$('.pw_edit').on('click', function(){	
			$('.lyr_pw').fadeIn(300);
		});	
		// product layer popup     
		$('.btn_lyrWrap_close, .lyr_bg').on('click', function () {			
			$('.lyr_pw').fadeOut(300);
			$('body').css({
				'overflow': '',
			});
		});

	});	
});	
function readURL(input) {
 
    if (input.files && input.files[0]) {
        var reader = new FileReader();
 
        reader.onload = function (e) {
            $('#image_section').attr('src', e.target.result);
        }
 
        reader.readAsDataURL(input.files[0]);
    }
}
 
$("#imgInput").change(function(){
    readURL(this);
});	

//파일 업로드//-------------------------------------------
var fileTarget = $('.upload-hidden');

fileTarget.on('change', function(){
	if(window.FileReader){
		
		var filename = $(this)[0].files[0].name;
	} else {
		var filename = $(this).val().split('/').pop().split('\\').pop();
	}

	$(this).siblings('.upload-name').val(filename);
});	
//------------------------------------------------------

		