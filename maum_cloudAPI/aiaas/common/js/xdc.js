	
	
jQuery.event.add(window,"load",function(){
	$(document).ready(function (){		
		
		//XDC
		
		$('.xdc_result_wrap').hide();
		
		$('.btn_article').on('click', function () {
			$('.demobox_xdc .modal').fadeIn(200);
			$("#loading_gif").hide();	
		});
		
		$('#insert_selected_content').on('click', function () {
			$('.demobox_xdc .modal').fadeOut(300);	
			$('body').css({
				'overflow': '',
			});
			$('.xdc_box .btn_area button').removeClass('disable');
			$('.xdc_box .btn_area button').addClass('start_btn');
			$('.progress li:nth-child(2)').addClass('active'); 	
		});	
		
		$('.xdc_box .text_area textarea').on('input keyup paste', function() {			
			var txtValLth = $(this).val().length;			
			if ( txtValLth > 0) {
				$('.progress li:nth-child(2)').addClass('active'); 		
				$('.xdc_box .btn_area button').removeClass('disable');
				$('.xdc_box .btn_area button').removeAttr('disabled');
				$('.xdc_box .btn_area .disBox').remove();
			} else {
				$('.progress li:nth-child(2)').removeClass('active');
				$('.xdc_box .btn_area button').attr('disabled');
				$('.xdc_box .btn_area').append('<span class="disBox"></span>');
			}
		});

		
		// product layer popup     
		$('.close, .lyr_bg').on('click', function () {
			$('.demobox_xdc .modal').fadeOut(300);			
			$('body').css({
				'overflow': '',
			});
		});
		
		
		
//		step 2
		
		$('#classify_content').on('click', function () {
			$(this).parent().parent().hide();
			$('.xdc_result_wrap').show();
			$('.progress li:nth-child(3)').addClass('active'); 	
		});	
		
		
		$('.btn_goback').on('click', function () {
			$('.xdc_result_wrap').hide();
			$('.xdc_wrap').show(); 	
			$('.progress li:nth-child(1)').addClass('active'); 	
			$('.progress li:nth-child(2)').removeClass('active');
			$('.progress li:nth-child(3)').removeClass('active');
		});	
		
		//XDC
	});
});

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
