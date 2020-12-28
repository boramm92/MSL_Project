jQuery.event.add(window,"load",function(){
	$(document).ready(function (){
		
		
		// 전송 버튼	
		$('.answer_area button').on('click',function(){
			$(this).parent().hide();
			$('.answer_complete').fadeIn(300);	
		});
	
		//이미지 닫기
		$('.layer_close, #myModal').on('click',function(){
			$('.modal').fadeOut(300);

		});
		
		// live chat 플로팅
		$('#btn_flt_cb').on('click', function() {
			$.ajax({
				url: 'chatbot/bot_sully_floating.html',
				//url: '/kr/maumbot',
				type: 'GET',
				dataType: 'html',
				async: false,
				success:function(data){
					$('#livechatWrap').html(data);
				},
				error:function(){
					console.log("hi");
				}
			});
		});
		
	});	
});	

		



//notice 리스트	
var coll = document.getElementsByClassName("noticetit");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var noticetxt = this.nextElementSibling;
    if (noticetxt.style.maxHeight){
      noticetxt.style.maxHeight = null;
    } else {
      noticetxt.style.maxHeight = noticetxt.scrollHeight + "px";
    } 
  });
}
		
	
// 이미지 모달
var modal = document.getElementById('myModal');
// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
}

var modal = document.getElementById('myModal2');
var img = document.getElementById('myImg2');
var modalImg = document.getElementById("img02");
img.onclick = function(){
  modal.style.display = "block";
  modalImg.src = this.src;
}

// Get the <span> element that closes the modal
//var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
//span.onclick = function() { 
//  modal.style.display = "none";
//}	