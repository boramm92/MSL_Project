
jQuery.event.add(window,"load",function(){
	$(document).ready(function (){
			
		// product layer popup     
		$('.btn_lyrWrap_close, .lyr_bg').on('click', function () {
		
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
		
		$('.viewDetail').on('click', function () {			
			$('.lyr_detail').fadeIn(300);   
		}); 
		
		
		
	});	
});	
	
	
$(function() {
			$('ul.tab li').click(function() {
				var activeTab = $(this).attr('data-tab');
				$('ul.tab li').removeClass('current');
				$('.tabcontent').removeClass('current');
				$(this).addClass('current');
				$('#' + activeTab).addClass('current');
				
			})
		});