jQuery.event.add(window,"load",function(){
	$(document).ready(function (){
		
		//gpt 
		
		
		//step1->step2
		$('.btn_start').on('click', function () {		
			$('.step01').hide();
			$('.mrclang_select').hide();
			$('.step02').fadeIn(300);			
		});	
		
		//직접 입력할 때 예문 흐리게하기
		$('.start_input').on('click', function () {		
			$('.step01 .first_top').css('opacity', '.5');
			$('.step01 .ift_topbox').css('opacity', '.5');
		});	
		//다시 예문 클릭하면 선명하게 하기
		$('.ift_topbox').on('click', function () {		
			$('.step01 .first_top').css('opacity', '1');
			$('.step01 .ift_topbox').css('opacity', '1');
		});		
		
		
		//step 2 ->step3
		//임시로 처음으로 버튼 누를때 다음 페이지로 이동
		$('.btn_back1').on('click', function () {
			$('.step02').hide();
			$('.step03').fadeIn(300);
			
		});	
		
		//step3 문장 생성된 페이지	
		$('.btn_add').on('click', function () {	
			if($('.add_area').is(':visible')){								
				$('.add_area').hide();
				$('.add_lording').fadeIn(300);
				$('.btn_area').hide();
			}else{				
				$('.add_area').fadeIn(300);
				$(this).html('문장생성');
			}
		});	
		
		//로딩 영역 누르면 문장 생성된 곳 추가 (임시)
		$('#lording_temp').on('click', function () {
			$('.add_lording').hide();
			$('.step03_2').fadeIn(300);
			$('.btn_area').fadeIn(300);
			$('.btn_add').html('새 문장<span>추가 하기</span>');
		});
		
		//처음으로 가기 버튼 
		$('.btn_back2').on('click', function () {			
			$('.step01').fadeIn(300);
			$('.mrclang_select').fadeIn(300);
			$('.step03').hide();
			$('.add_area').hide();
			$('.step01 .first_top').css('opacity', '1');
			$('.step01 .ift_topbox').css('opacity', '1');
			$('.gpt_box .text_area textarea').val('');
		});	
		
		//gpt 끝
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
