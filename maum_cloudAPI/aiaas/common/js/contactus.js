// select design 
var selectTarget = $('.selectbox select'); 

selectTarget.change(function(){ 

var select_name = $(this).children('option:selected').text(); 
$(this).siblings('label').text(select_name); 
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
		
	