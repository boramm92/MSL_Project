$(document).ready(function(){
	// 시간 생성 함수
	function getFormatDate(){
		now = new Date();
		year = '' + now.getFullYear();
		month = '' + (now.getMonth() + 1); if(month.length == 1) {month = '0' + month;}
		day = '' + now.getDate(); if(day.length == 1) {day = '0' + day;}
		hour = '' + now.getHours(); if(hour.length == 1) {hour = '0' + hour;}
		minute = '' + now.getMinutes(); if(minute.length == 1) {minute = '0' + minute;}
		return year + '.' + month + '.' + day + ' ' + hour + ':' + minute;
	}


	// 댓글 작성 영역 첨부 이미지 미리보기, 삭제 
	if(window.File && window.FileList && window.FileReader){
		$('#attachImage').on('change', function(e){
			var files = e.target.files,
				filesLength = files.length;

			for(var i = 0; i < filesLength; i++){
				var f = files[i];
				var fileReader = new FileReader();

				fileReader.onload = (function(e){
					var file = e.target;

					$('.inquiry_detail.edit_mode .textarea').removeClass('default');

					// 이미지 미리보기 생성
					$("<div class=\"fileBox\">" +
						"<button type=\"button\" class=\"btn_delete_file\">" +
							"<span class=\"hide\">파일 삭제</span>" +
						"</button>" +
						"<img src=\"" + e.target.result + "\" / alt=\"attach file\">" +
						"</>").appendTo('.inquiry_detail.edit_mode .fileArea');

					// 이미지 미리보기 삭제 버튼
					$('.btn_delete_file').click(function(){
						$(this).parent('.fileBox').remove();

						if($(this).parent('.fileBox').length == 1){
							$('.inquiry_detail.edit_mode .textarea').addClass('default');
						}
					});
				});
				fileReader.readAsDataURL(f);
			}
		});
	}


	// '답변 등록' 버튼 클릭 시 댓글 목록 추가
	$('.btn_rgst_answer').on('click', function(){
		var today = getFormatDate(today);
		var commentVal = $('.inquiry_detail.edit_mode .textarea').text();
		var fileBoxImg = $('.inquiry_detail.edit_mode .fileArea .fileBox img');

		for(var i = 0; i < fileBoxImg.length; i++){
			var fileBoxImgSrc = fileBoxImg[i];
			var fileBoxImgSrc = fileBoxImg.attr('src');

			console.log(fileBoxImgSrc)

			// 이미지 미리보기 생성
			$("<div class=\"fileBox\">" +
				"<img src=\"" + fileBoxImgSrc + "\" / alt=\"attach file\">" +
				"</>").appendTo('.comment_list .inquiry_detail .fileArea');
		}

		// [D] .writer 내 텍스트는 권한에 따라 넣어주세요.
		var commentListTemp = `
			<li>
				<div class="writer">관리자 <span class="label">관리자</span></div>  
				<div class="inquiry_detail">
					<div class="fileArea"></div>  
					<div class="textarea" contenteditable="false">${commentVal}</div>
				</div>
				<div class="date">${today}</div>
			</li>
		`;

		var attachFileBoxTemp = `
			<div class="fileBox">
				<img src="" alt="attach file">
			</div>
		`;

		$('.inquiry_detail.edit_mode .textarea').empty();
		$('.comment_list').append(commentListTemp);
		// $('.comment_list .inquiry_detail .fileArea').append(attachFileBoxTemp);
	});
});
