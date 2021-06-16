//HMD
		
		$('.btn_float_l').on('click', function () {

		});
		
		$('.btn_blue').on('click', function () {
			$(this).parent().parent().hide();
			$('.posi_nega_area').fadeIn(300);

		});
		$('.btn_goback').on('click', function () {
			$(this).parent().parent().hide();
			$('form').fadeIn(300);

		});

		// step01 > step02
		$('.hmd_box .text_area textarea').on('input keyup paste', function() {			
			var txtValLth = $(this).val().length;			
			if ( txtValLth > 0) {

				$('.demobox_hmd .step_1btn .btn_type').removeClass('disable'); 	
				$('.demobox_hmd .step_1btn .btn_type').removeAttr('disabled');
				$('.demobox_hmd .btn_area .disable .disBox').remove();
				$('.demobox_hmd .step_1btn .disBox').remove();
			} else {

				$('.demobox_hmd .step_1btn .disable').attr('disabled');
				$('.demobox_hmd .step_1btn').append('<span class="disBox"></span>');
			}
		});
				
		
		//HMD_end