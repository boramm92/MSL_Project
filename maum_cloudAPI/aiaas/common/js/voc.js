
jQuery.event.add(window,"load",function(){
	$(document).ready(function (){
		
		// product layer popup     
		$('.btn_lyrWrap_close, .lyr_bg').on('click', function () {
			$('.lyr_lack').fadeOut(300);
			$('.lyr_deduct').fadeOut(300);
			$('.lyr_event').fadeOut(300);
			$('.lyr_term_kr').fadeOut(300);
			$('.lyr_detail').fadeOut(300);
			$('body').css({
				'overflow': '',
			});
		});
		$('.btn_productWrap_close, .lyr_bg').on('click', function () {			
			$('.lyr_detail').fadeOut(300);
			$('.lyr_bg').fadeOut(300); 	
			$('body').css({
				'overflow': '',
			});
		});
		$('.mike_hole').hide();
		$('.mike_area').on('click', function () {			
			$('.mike_hole').fadeIn(300);              

		});
		$('.holeBox i').on('click', function () {			
			$('.lyr_detail').fadeIn(300); 
			$('.lyr_bg').fadeIn(300); 			
		});
		
//		voc
		$('.voc_step1 button.btn').on('click', function () {			
			$(this).parent().parent().hide(); 
			$('.voc_step2').fadeIn(300); 
			$('.progress li:nth-child(2)').addClass('active'); 	
		});
		
		$('.voc_step2 .analysis').on('click', function () {			
			$(this).parent().hide(); 
			$('.voc_recod').fadeIn(300); 		
			$('.voc_recod').fadeIn(300); 
		});
		
		$('.voc_recod').on('click', function () {			
			$(this).parent().hide(); 
			$('.voc_step4').fadeIn(300); 
			$('.progress li:nth-child(3)').addClass('active'); 		
		});
		
		$('.voc_step4 .btn_backstart').on('click', function () {			
			$(this).parent().hide(); 
			$('.voc_step1').fadeIn(300); 
			$('.progress li:nth-child(2)').removeClass('active'); 	
			$('.progress li:nth-child(3)').removeClass('active'); 	
		});
//		$('.my-image').croppie({ width: 100, height: 100, type: 'square' });
		
		// inject players to audio elements
		// if they have justwave class name only
		 $.justwave('justwave');
	});	
});	
	

jQuery.event.add(window,"load",function(){
	$(document).ready(function (){
	
		
//		voc
		$('.voc_step1 button.btn').on('click', function () {			
			$(this).parent().parent().hide(); 
			$('.voc_step2').fadeIn(300); 
			$('.progress li:nth-child(2)').addClass('active'); 	
		});
		
		$('.voc_step2 .analysis').on('click', function () {			
			$(this).parent().hide(); 
			$('.voc_recod').fadeIn(300); 		
			$('.voc_recod').fadeIn(300); 
		});
		
		$('.voc_recod').on('click', function () {			
			$(this).parent().hide(); 
			$('.voc_step4').fadeIn(300); 
			$('.progress li:nth-child(3)').addClass('active'); 		
		});
		
		$('.voc_step4 .btn_backstart').on('click', function () {			
			$(this).parent().hide(); 
			$('.voc_step1').fadeIn(300); 
			$('.progress li:nth-child(2)').removeClass('active'); 	
			$('.progress li:nth-child(3)').removeClass('active'); 	
		});
//		$('.my-image').croppie({ width: 100, height: 100, type: 'square' });
		
		// inject players to audio elements
		// if they have justwave class name only
		 $.justwave('justwave');
	});	
});	
	
