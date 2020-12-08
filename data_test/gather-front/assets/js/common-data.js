//MINDsLab. UX/UI Team. mrs. 20191209
$(document).ready(function (){
	// var w_height = $(window).height();
	// if (w_height > 800){
	// 	var percent = w_height * 60/100;
	// 	$('.data_script').height(percent);
	// 	$('#container').css("height", "100%");
	// }

	var placeholderLabel = $('input[type="text"], input[type="number"], .inquiry_box input, .inquiry_box textarea');
	if(placeholderLabel) {
		placeholderLabel.on('focus', function () {
			$(this).siblings('label').hide();
		});
		placeholderLabel.on('focusout', function () {
			if ($(this).val() === '') {
				$(this).siblings('label').show();
			}
		});
	}

	var dates = $('.fromDate, .toDate').datepicker({
		prevText: '이전 달',
		nextText: '다음 달',
		dateFormat: 'yy-mm-dd',
		onSelect: function (date) {
			var endDate = $('.toDate');
			var startDate = $(this).datepicker('getDate');
			var minDate = $(this).datepicker('getDate');
			endDate.datepicker('setDate', minDate);
			startDate.setDate(startDate.getDate() + 365);
			endDate.datepicker('option', 'maxDate', startDate);
			endDate.datepicker('option', 'minDate', minDate);
		}
	});
	$(".hasDatepicker").attr("autocomplete", "off");
	
	// IE 브라우저 접속 시 크롬 최적화 안내
	var browse = navigator.userAgent.toLowerCase();

	if( (navigator.appName == 'Netscape' && browse.indexOf('trident') != -1) || (browse.indexOf("msie") != -1)) {
		window.location.href = "/html/markup/maum_data/error_ie.html";
	}
});

/** 여기에 markup script 화면별로 정의 **/
(function ($) {
	/** LOAD MRC Markup View Script **/
	$.fn.loadMrcViewScript = function(settings) {
		var $this = $(this);
		var _handler = $this.data("mrcMarkupHandler");
		_handler = new MindsMrcMarkup.loadMarkup($this, settings);
		$this.data("mrcMarkupHandler", _handler);
		return _handler;
	};
})(jQuery);

var MindsMrcMarkup = (function() {
	var $mWindow;

	function loadMarkup($this, settings) {
		$mWindow = $(window);
		if($this == null) {
			$this = $(document);
		}
		var w_height = $mWindow.height();
		if(w_height > 800) {
			var percent = w_height * 80/100;

			$('.data_script', $this).height(percent);
			$('#container', $this).css("height", "100%");
		}

		//리스트 버튼 옮기기
		var minibox_height = $('.minibox1', $this).height();
		var list_height = $('.q_list', $this).height();
		var padding = (minibox_height - list_height)/2 - 40;
		$('.addblock', $this).css('padding-top', padding);

		//minibox3 높이값 조절
		var text_height = $('.text_height', $this).height();
		var minibox3_height = $('.minibox3', $this);
		if (text_height>20){
			minibox3_height.css('height', 'calc(50% - 48px)');
		}else{
			minibox3_height.css('height', 'calc(50% - 28px');
		};

		//minibox 포커싱	
		$('.question ', $this).on('click', function(){
			if(!$(this).hasClass('disabled')) {
				$('.question', $this).removeClass('active');
				$(this).addClass('active');	
			}
		});

		// 공통 팝업창 열기		
		$('.pop_question', $this).on('click', function(){			
			$('#pop_question', $this).show();																   
		});
		// 공통 팝업창 닫기     
		$('.ico_close, .btn button').on('click', function () {		

			$('#pop_question', $this).hide();	
			$('body', $this).css({
				'overflow': '',
			});
		});

		$mWindow.resize(function() {
			var w_height = $mWindow.height();

			if (w_height > 800){
				var percent = w_height * 80/100;	

				$('.data_script', $this).height(percent);
				$('#container', $this).css("height", "100%");
			}

			//리스트 버튼 옮기기
			var minibox_height = $('.minibox1', $this).height();
			var list_height = $('.q_list', $this).height();
			var padding = (minibox_height - list_height)/2 - 40;
			$('.addblock', $this).css('padding-top', padding);

			//minibox3 높이값 조절
			var text_height = $('.text_height', $this).height();
			var minibox3_height = $('.minibox3', $this);
			if (text_height>20){
				minibox3_height.css('height', 'calc(50% - 48px)');
			}else{
				minibox3_height.css('height', 'calc(50% - 28px');
			};
		});
	}
	return {
		loadMarkup: loadMarkup
	}
})();