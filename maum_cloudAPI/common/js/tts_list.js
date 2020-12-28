jQuery.event.add(window,"load",function(){
	$(document).ready(function (){
				
		  //add layer popup
		$('#lyr_add').on('click', function () {
			$('.lyr_add').fadeIn(300);              
			$('body').css({
				'overflow': 'hidden',
			});
			
		});
		$('#lyr_my').on('click', function () {
			$('.lyr_my').fadeIn(300);              
			$('body').css({
				'overflow': 'hidden',
			});
			
		});
		// product layer popup     
		$('.btn_lyrWrap_close, .lyr_bg').on('click', function () {
			$('.lyr_add').fadeOut(300);
			$('.lyr_my').fadeOut(300);
			$('body').css({
				'overflow': '',
			});
		});
			   
            
          
			 
			
	});	
});	
	
$('.ui.dropdown')
  .dropdown()
;