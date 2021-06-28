// MINDsLab UX/UI팀. YMJ. 20200910

$(document).ready(function (){	
	//문의하기(인풋 라벨)
	var contactLabel = $('#lyr_contact_us input,#lyr_contact_us textarea');
	
	contactLabel.on('focus', function () {
		$(this).siblings('label').hide();
	});
	
	contactLabel.on('focusout', function () {
		if ($(this).val() === '') {
			$(this).siblings('label').show();
		}
	});
	
	//문의하기(focus이동)
	$('#btn_contact').on('click',function(){
		$('#lyr_contact_us').find('#user_name').delay(300).queue(function() {
			$(this).focus(); 
		});
	});
	//문의하기(완료메세지)
	$('#btn_sendMail').on('click',function(){	
		var userTxtLength = $('.contact_form #user_txt').val().length;
        
		if ( userTxtLength > 1) {
			//문의하기 close
			$('body').find('#lyr_contact_model').unwrap();
			$('.lyr_bg').remove(); 
			
			//완료메세지
			$('body').append(' \
                <div class="lyrWrap moment"> \
                    <div class="lyr_bg"></div> \
                    <div class="lyrBox" >\
						<div class="lyr_mid"> \
							<div class="ani_icoBox"> \
								<img src="resources/images/ani_email_send.gif" alt="접수완료"> \
							</div> \
							<p class="massage">문의가 접수되었습니다.<br>담당자 확인 후 연락드리겠습니다.</p> \
						</div> \
					</div> \
				</div> \
			');
			
			//문의하기 초기화
			$('.contact_form .ipt_txt').val('');
			$('.contact_form .textArea').val('')
			$('.contact_form label').css('display','block');
			
			$('.moment, .moment .lyrBox').show();
			setTimeout(function() {
				$('.moment').addClass('lyr_hide').delay(300).queue(function() {
					$(this).remove(); 
				});
			}, 2000);
			$('body').css('overflow',''); 
		}
	});   
    
    //이미지 위치
    // $('.svc_visual .bg_img').each(function(){
    //     var bgPstion = $('.svc_visual .bg_img').height()/2;
        
	// 	$('.svc_visual .bg_img').css({
	// 		'top': -bgPstion+70
	// 	});
    // }); 
}); 

$(window).scroll(function(){
	var winTop = $(window).scrollTop(),
        imgPstion = winTop;
    
	if( winTop > 10) {
		$('.svc_visual .bg_img').css({
			'transform': 'matrix(1,0,0,1,0, -'+imgPstion+')',
		});
				
	} else {
		$('.svc_visual .bg_img').css({
			'transform': 'matrix(1,0,0,1, 0, 0)',
		});						
	}
	
});

