jQuery.event.add(window,"load",function(){
	$(document).ready(function (){		
		
		// product layer popup     
		$('.btn_lyrWrap_close, .lyr_bg').on('click', function () {
		
			$('.lyr_popup').fadeOut(300);
			$('body').css({
				'overflow': '',
			});
		});
			 
		 //add layer popup
		$('.btn_close').on('click', function () {
			$('.lyr_popup').fadeIn(300);              
			$('body').css({
				'overflow': 'hidden',
			});
			
		});	  	
	});	
});	
	
	$('.step02').hide();
	$('.step03').hide();
	$('.btn_next').hide();
	$('.btn_prev').hide();
	$('.btn_close').hide();
	$('.btn_mike').on('click',function(){	
		$('.step01').hide();
		$(this).parent().next('.step02').fadeIn(300);		
	});
	$('.btn_stop').on('click',function(){	
		$('.step02').hide();
		$(this).parent().next('.step03').fadeIn(300);
		$('.btn_next').fadeIn(300);
		$('.btn_prev').fadeIn(300);
		$('.btn_close').fadeIn(300);
		
	});
	$('.btn_reset').on('click',function(){	
		$('.step02').hide();
		$('.step03').hide();
		$('.btn_next').hide();
		$('.btn_prev').hide();
		$('.btn_close').hide();
		$('.step01').fadeIn(300);		
	});
	$('.btn_next').on('click',function(){
		$(this).hide();		
		$('.btn_prev').hide();
		$('.btn_close').hide();
		$('.demo_box').hide();	
		$('.percentage').text('100%');
		$('.graph_clr').css('width', '100%');
		$('.complete').fadeIn(300);
	});
	