

jQuery.event.add(window,"load",function(){
	$(document).ready(function (){


		//	pricing 더 알아보기 버튼


		$('.tbl_lst .basic').on('click',function(){
			$('.lyrBox').hide();
			$('.lyrmore').fadeIn(300);
			$('#lyr_more_basic').show();
		});
		$('.tbl_lst .premium').on('click',function(){
			$('.lyrBox').hide();
			$('.lyrmore').fadeIn(300);
			$('#lyr_more_premium').show();
		});
		// layer popup(닫기)
		$('.btn_lyr_close, .btn_lyr_cancel, .lyr_bg').on('click',function(){
			$('.lyrmore').fadeOut(300);

		});
		//		모바일버튼
		$('.tbl_lst_m .basic_m').on('click',function(){
			$('.lyrBox').hide();
			$('.lyrmore').fadeIn(300);
			$('#lyr_more_basic_m').show();
		});
		$('.tbl_lst_m .premium_m').on('click',function(){
			$('.lyrBox').hide();
			$('.lyrmore').fadeIn(300);
			$('#lyr_more_premium_m').show();
		});
		// layer popup(닫기)
		$('.btn_lyr_close, .btn_lyr_cancel, .lyr_bg').on('click',function(){
			$('.lyrmore').fadeOut(300);

		});

		// pricing section move
		$('.tbl_lst .price_1 a[href^="#"]').on('click', function (e) {
			e.preventDefault();

			var target = this.hash;
			var $target = $(target);

			$('html, body').animate({
				'scrollTop': $target.offset().top
			}, 700, 'swing');

		});

		$('.folder').click( function() {
			if ( $('.folder em').hasClass('fa-chevron-up')) {
				$('.folder em').removeClass('fa-chevron-up');
				$('.folder em').addClass('fa-chevron-down');
				$('#folder_box').fadeIn();
				$('.one_row').css("border-bottom", "none");
				$('.one_row td:nth-child(4)').css("background", "#eff6fb");
			}else {
				$('.folder em').addClass('fa-chevron-up');
				$('.folder em').removeClass('fa-chevron-down');
				$('#folder_box').hide();
				$('.one_row td:nth-child(4)').css("background", "#fff");
				$('.one_row').css("border-bottom", "2px solid #979797");
			}

		});

	});
});




//pricing 모바일 탭 
function  openPrice(evt, priceName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(priceName).style.display = "block";
	evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();	