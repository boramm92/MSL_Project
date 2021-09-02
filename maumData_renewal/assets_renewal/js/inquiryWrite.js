$(document).ready(function(){
	// swiper - 이미지 미리 보기 클릭 시 상세 보기 팝업
	var swiper = new Swiper('#attachFileDetail .swiper-container', {
		slidesPerGroup: 1,
		slidesPerView: 1,
		spaceBetween: 50,
		touchRatio: 0,
		observer: true,
		observeParents: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.btn_slide_next',
			prevEl: '.btn_slide_prev',
		},
		on: {
			slideChange: function(){
				var currentSlide = $('#attachFileDetail .swiper-slide').eq(this.realIndex);
				var currentSlideImg = currentSlide.find('img');
				currentSlideImg = currentSlideImg.attr('alt');

				$('#attachFileDetail .lyr_top .tit').html(currentSlideImg);
			}
		}
	});

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
			// var fileValue = $("#attachImage").val().split("\\");
			// var fileName = fileValue[fileValue.length-1]; // 파일명
			// console.log(fileName)

			var files = e.target.files,
				filesLength = files.length;

			for(var i = 0; i < filesLength; i++){
				var f = files[i];
				var fileReader = new FileReader();

				console.log(f.name);

				fileReader.onload = (function(e){
					var file = e.target;

					console.log(e.target)

					$('.inquiry_detail.edit_mode .textarea').removeClass('default');

					// 이미지 미리보기 생성
					$("<div class=\"fileBox\">" +
						"<button type=\"button\" class=\"btn_delete_file\">" +
							"<span class=\"hide\">파일 삭제</span>" +
						"</button>" +
						"<img src=\"" + file.result + "\" / alt=\"" + file.name + "\">" +
						"</>").appendTo('.inquiry_detail.edit_mode .fileArea');

					// 이미지 미리보기 삭제 버튼
					$('.btn_delete_file').click(function(){
						if($(this).parents('.fileArea').find('.fileBox').length == 1){
							$('.inquiry_detail.edit_mode .textarea').addClass('default');
						}
						$(this).parent('.fileBox').remove();
					});
				});
				fileReader.readAsDataURL(f);
			}
		});
	}

	// '답변 등록' 버튼 클릭 시 댓글 목록 추가
	$('.btn_rgst_answer').on('click', function(){
		var today = getFormatDate(today);
		var commentVal = $('.inquiry_detail.edit_mode .textarea').html();
		var fileBox = $('.inquiry_detail.edit_mode .fileArea .fileBox');
		fileBox.addClass('btn_lyr_open').attr('data-lyr-name', 'attachFileDetail');


		if(!commentVal == ''){
			// [D] .writer 내 텍스트는 권한에 따라 넣어주세요. (관리자인 경우에만 .label 태그 추가 필요)
			// [D] .writer 가 관리자가 아닌경우는 button.btn_comment_delete 안들어감
			var commentListTemp = `
				<li>
					<div class="writer">관리자 <span class="label">관리자</span></div>  
					<div class="inquiry_detail">
						<div class="fileArea"></div>  
						<div class="textarea" contenteditable="false">${commentVal}</div>
					</div>
					<div class="date">${today}</div>
					<button type="button" class="btn_comment_delete">삭제</button>
				</li>
			`;
			
			$('.comment_list').append(commentListTemp);
			fileBox.clone().appendTo('.comment_list li:last-child .inquiry_detail .fileArea');
			$('.inquiry_detail.edit_mode .textarea').empty();
			$('.inquiry_detail.edit_mode .fileArea').empty();
			$('.inquiry_detail.edit_mode .textarea').addClass('default');
		}else{
			// [D] 입력한 댓글이 없을때 임시로 넣은 alert입니다.
			alert('댓글을 입력해 주세요.');
		}


		// 공통 layer popup 
		$('.btn_lyr_open').on('click',function(){	
			var btnLyrName = $(this).data('lyr-name'),
				popId = '#' + btnLyrName;
			
			// open
			$(popId).css('display', 'block');
			$(popId).find('.lyr_bg').remove();
			$(popId).prepend('<div class="lyr_bg"></div>');
			
			// close 
			$('.btn_lyr_close, .btn_confirm').on('click',function(){
				$(popId).css('display', 'none'); 
				$('.lyr_bg').remove(); 
			});	
		});	

		// 이미지 미리 보기 클릭 시 상세 이미지 넣어주기
        $('.fileBox').on('click', function(){
            var fileBoxImg = $(this).parents('.fileArea').find('.fileBox img');   
            var fileBoxImgIndex = $(this).index();
            var thisFileBoxImg = $(this).find('img');
            var thisFileBoxImgSrc = thisFileBoxImg.attr('src');
            thisFileBoxImgSrc = thisFileBoxImgSrc.replace(/^.*\//, '');

            $('#attachFileDetail .lyr_top .tit').html(thisFileBoxImgSrc);
            $('#attachFileDetail .view_list').empty();
            swiper.slideTo(fileBoxImgIndex);

            [].forEach.call(fileBoxImg, function(i){   
                var fileBoxImgSrc = i.src;
                var thisFileName = i.alt;
                var temp = `<li class="swiper-slide"><img src="${fileBoxImgSrc}" alt="${thisFileName}"></li>`;
                $('#attachFileDetail .view_list').append(temp);
            });
        });

		// 댓글 삭제 버튼 클릭 시
		$('.btn_comment_delete').on('click', function(){
			$(this).parent('li').remove();

			if($('.comment_list li').length == 0){
				$('.comment_list').empty();
			}
		});
	});
});
