	
	
jQuery.event.add(window,"load",function(){

	$(document).ready(function (){

		$('.demobox_mrc .mrc_box .step02').show();


		$('input[type=radio][name=radio]').on('click',function(){
			var chk = $("input[type=radio][name=radio]:checked").val();
			if(chk == 'kor'){
				$('#id_input_text').val('인공지능(AI) 전문기업 마인즈랩이 캐나다 3대 인공지능 연구기관 에이미(AMII: Alberta Machine Intelligence Institute)에 합류하고, 구글 딥마인드를 비롯한 세계 최고 수준의 AI 연구진과 함께 딥러닝 분야의 연구를 함께한다. 마인즈랩은 에이미의 회원사로서 에이미 소속의 연구진들과 함께 공동 연구를 추진한다. 인공지능 강국으로 평가받는 캐나다에서 엘리먼트AI(Element AI), 벡터 연구소(Vector Institute)와 함께 3대 인공지능 연구기관 중 하나로 꼽히는 에이미는 강화학습의 창시자 리차드 서튼 교수의 주도 아래 알파고를 개발한 구글 딥마인드와 앨버타 대학 등이 모여 각 분야에서의 딥러닝 연구를 활발하게 이끌고 있다.');
				$('#id_input_question').val('마인즈랩은 어디에 합류했나요?').trigger("keyup");
			}else{
				$('#id_input_text').val('Born in Hungary in 1913 as Friedmann Endre Ernő, Capa was forced to leave his native country after his involvement in anti government protests. Capa had originally wanted to become a writer, but after his arrival in Berlin had first found work as a photographer. He later left Germany and moved to France due to the rise in Nazism. He tried to find work as a freelance journalist and it was here that he changed his name to Robert Capa, mainly because he thought it would sound more American.');
				$('#id_input_question').val('Why did Capa changed his name?').trigger("keyup");
			}
		});


		// step01 > step02
		$('.mrc_box .step01 textarea').on('input keyup paste', function() {
			let txtValLth = $(this).val().length;

			if ( txtValLth > 0) {
				$('.demobox_mrc .mrc_box .step02').show();

			} else {
				$('.demobox_mrc .mrc_box .step02').hide();
				$('.demobox_mrc .mrc_box .step03').hide();
				$('.mrc_box .step02 textarea').val("").trigger('keyup');
			}
		});

		 //step02 input --> button active
		$('.mrc_box .step02 textarea').on('input keyup paste', function() {
			let txtValLth = $(this).val().length;
			
			if ( txtValLth > 0) {
				$('.mrc_box .step02 .btn_area button').removeClass('disable');
				$('.mrc_box .step02 .btn_area button').removeAttr('disabled');
				$('.mrc_box .step02 .btn_area .disBox').remove();
			} else {
				$('.mrc_box .step02 .btn_area button').addClass('disable');
				$('.mrc_box .step02 .btn_area button').attr('disabled', true)
				$('.mrc_box .step02 .btn_area').append('<span class="disBox"></span>');
			}
		});

		// step03 > step01
		$('.mrc_box .step03 .btn_reset').on('click',function(){
			$('.mrc_box .step01').show();
			$('.mrc_box .step02').show();
			$('.mrc_box .step03').hide();
		});

		$('.mrc_box .step03 .btn_another').on('click',function(){
			$('.mrc_box .step02 textarea').val("").trigger('keyup');
			$('.mrc_box .step01').show();
			$('.mrc_box .step02').show();
			$('.mrc_box .step03').hide();
		});


	//============== 기사 검색 ==================//

		//검색(search_button)
		$('#search_input').keydown(function(e){
			if(e.keyCode==13)
				$('#search_button').trigger('click');
		});


		$(".article_item").click(function(){
			$(".article_item").removeClass('chosen');
			$(this).addClass('chosen');
		});


		//선택버튼
		$("#insert_selected_content").click(function() {
			let $id_input_text = $("#id_input_text");
			let $selected_article_item = $('.chosen').attr('value');
			if($id_input_text.val() !== $selected_article_item){
				$("#id_input_question").val("").trigger('keyup');
			}
			$id_input_text.val($selected_article_item);
			$id_input_text.trigger('keyup');

			clickTap($('#defaultOpen2').get(0), 'example');

		});


	});
});

//API 탭  	
function openTap(targetObj, menu) {
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
	targetObj.currentTarget.className += " active";
}	
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();	

	
//mrc Demo tab	
function clickTap(evt, tapName) {

	if(tapName === 'article'){
		$('.mrc_box .step02').hide();
		$('.mrc_box .step03').hide();
	}else if(tapName === 'example'){
		$('#id_input_text').trigger('keyup');
	}

	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablink");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tapName).style.display = "block";
	evt.className += " active";
}	
document.getElementById("defaultOpen2").click();		
	