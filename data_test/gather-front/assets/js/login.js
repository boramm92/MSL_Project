// MINDsLab. UX/UI Team. YMJ. 20180825

jQuery.event.add(window,"load",function(){
	$(document).ready(function (){
		// input 초기화
		$('.ipt_id, ipt_pw').each(function(){					
			$(this).val('');
		});		
		
		// opening
		$('#pageldg').delay(1200).queue(function() { 
			$(this).addClass('pageldg_hide').delay(1700).remove(); 
		});
		
		$('.parkBox').delay(1200).animate({	
			'opacity': 1.0,
		},1000);
		$('.parkBox_cont').append('<span class="disBox"></span>');
						
		// 입력값 체크 (요청버튼 활성화)
		$('.ipt_txt').on('change keyup paste click', function(e) {
			var myNameValLth = $('#myName').val().length;
			var gstNameValLth = $('#gstName').val().length;
			var carNumValLth = $('#carNum').val().length;
			var whyTxtValLth = $('#whyTxt').val().length;
			
			if ( myNameValLth > 0 && gstNameValLth > 0 && carNumValLth > 0 && whyTxtValLth > 0) {
				$('.btn_add').removeClass('disabled');	
				$('.btn_add').removeAttr('disabled');
				$('.disBox').remove();
			} else {
				$('.btn_add').addClass('disabled');	
				$('.btn_add').attr('disabled');
			}
		});
	});
});