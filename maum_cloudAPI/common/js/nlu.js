	
jQuery.event.add(window,"load",function(){
	$(document).ready(function (){		
		
		
		//nlu
		
		$('.nlu_box .step01 textarea').on('input keyup paste', function() {			
			var txtValLth = $(this).val().length;
			
			if ( txtValLth > 0) {				
				$('.nlu_box .step01 .btn_area button').removeAttr('disabled');	
				$('.nlu_box .step01 .btn_area .disBox').remove();
			} else {			
				$('.nlu_box .step01 .btn_area button').attr('disabled');
				$('.nlu_box .step01 .btn_area').append('<span class="disBox"></span>');
				$('.nlu_box .step02').fadeOut();
				$('.progress li:nth-child(2)').removeClass('active'); 	
			}
		});
		
		$('.nlu_box .step01 .btn_search').on('click',function(){	
			$('.nlu_box .step02').fadeIn();
			$('.progress li:nth-child(2)').addClass('active'); 	 	
		});
		
		//nlu
	});
});

