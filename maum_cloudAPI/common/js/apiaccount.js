jQuery.event.add(window,"load",function(){
	$(document).ready(function (){		
		$('.detail_view').on('click', function(){	
			$('.lyr_detail_amount').fadeIn(300);
		});	
		$('.btn_lyrWrap_close, .lyr_detail_bg').on('click', function () {			
			$('.lyr_detail_amount').fadeOut(300);
			$('body').css({
				'overflow': '',
			});
		});
	});
});
