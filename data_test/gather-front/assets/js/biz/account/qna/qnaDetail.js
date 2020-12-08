var qnaScript = (function() {
	var $mP;

	var extList = {
		'img' : ['JPG', 'JPEG', 'PNG'],
		'video' : ['MP4']
	};

	var prefix = '/profile';
	var requestApi = {
		selectQnA : prefix + "/selectQnA.json",
		checkQnAByPassword : prefix + "/checkQnAByPassword.json",
		deleteQnA : prefix + "/deleteQnA.json",

		registReply : prefix + "/insertReply.json",
		selectReplyList : prefix + "/selectReplyList.json",
		deleteReply : prefix + "/deleteReply.json",
		checkReplyState : prefix + "/checkReplyState.json",
		selectFileList : prefix + "/selectFileList.json",

		goQnAList : prefix + "/viewMyQnAList.do"
	};

	function init() {
		$mP = $("div.container");
		
		bindEventHandler();
		selectQnA();
	}
	function bindEventHandler() {
		$("button.btnRegist", $mP).off("click").on("click", replyRegist);
		$("button.btnModify", $mP).off("click").on("click", function (){
			checkQnAByPassword(modifyQnA)
		});
		$("button.btnDelete", $mP).off("click").on("click", function (){
			checkQnAByPassword(deleteQnA)
		});
		$("button.btnList", $mP).off("click").on("click", moveQnAListPage);

		$("input[name=atchfileImg]", $mP).off("change").on("change", function () {
			fileCheck(this, extList.img)
		});
		$("input[name=atchfileVideo]", $mP).off("change").on("change", function () {
			fileCheck(this, extList.video)
		});
		$("input[name=atchfileEtc]", $mP).off("change").on("change", function () {
			fileCheck(this)
		});
	}

	function selectQnA() {
		MindsJS.loadJson(
			requestApi.selectQnA
			, { qnaId : qnaId }
			, function(result) {
				if(result.success) {
					if(result.data != null) {
						var data = result.data;

						$('.qanDetail .title').text(data.title);
						$('.qanDetail .content').text(data.content);
						$('.qanDetail .projectNm').text(data.projectNm);
						$('.qanDetail .qnaType').text(data.qnaTypeNm);
						$('.qanDetail .reCount').text(data.reCount);
						$('.qanDetail .regDate').text(data.regDate);

						fileList($('.qanDetail .content'), data.qnaId);

						//답변 권한 체크
						if(data.regUserId == userInfo.userId || userInfo.userKindCd == 'O') {
							$('#replyForm').show();
						}
						selectReplyList();//답변 목록
					}
				} else {

				}
			}
			, true
		);
	}

	/**
	 * 답변 목록
	 */
	function selectReplyList() {
		MindsJS.loadJson(
			requestApi.selectReplyList
			, { qnaId : qnaId }
			, function(result) {
				if(result.success) {
					if(result.data != null && result.data.length > 0) {
						var dataList = result.data;

						// TODO data for문 돌려서 답변 영역 먼저 만들고,
						$.each(dataList, function(i, v) {
							replyAppend(v);
						});
					}
				} else {

				}
			}
			, true
		);
	}

	/**
	 * 첨부파일 FILE 목록 가져오기
	 * @param fileShowArea : 첨부파일 APPEND시킬 영역
	 * @param qnaRelatedId : 첨부파일 매핑 QNA||REPLY ID
	 */
	function fileList(fileShowArea, qnaRelatedId) {
		MindsJS.loadJson(
			requestApi.selectFileList
			, { qnaRelatedId : qnaRelatedId }
			, function(result) {
				if(result.success) {
					if(result.data != null && result.data.length > 0) {
						var dataList = result.data;

						$html = $('<div/>');
						$.each(dataList, function(i, v) {
							$imgHtml = $('<div/>');
							$img = $('<img/>');
							// TODO 수정 페이지에서 쓰임
							/*$imgDelBtn = $('<button class="btnDelFile">x</button>');*/

							var image64 = v.atchFile;
							if($.isEmpty(image64)) {
								$.alert("원본 데이터 파일을 불러오지 못했습니다."); // 원본 이미지를 불러오지 못했습니다.
								return;
							}

							var extTmp = v.atchFileName.split('.');
							var ext = extTmp[extTmp.length-1].toUpperCase();
							var imgUrl = '';

							if( extList.img.includes(ext) ) {
								var base64ImageContent = image64.replace(/^data:image\/(png|jpeg);base64,/, "");
								var extType = v.extName == ".png"? "image/png" : "image/jpeg";
								var thumbnailBlob = base64ToBlob(base64ImageContent, extType);
								imgUrl = URL.createObjectURL(thumbnailBlob);
							} else if( extList.video.includes(ext) ) {
								imgUrl = '/assets/images/logo_chatbot.png';
							} else {
								imgUrl = '/assets/images/ico_zip.png';
							}

							$img.width(100)
							$img.height(100)
							$img.attr("src", imgUrl);
							$img.attr('atchFileId', v.atchFileId);

							$img.on('click',function (){
								downloadFile($(this).attr('atchfileid'));
							});

							$imgHtml.append($img);
							$html.append($imgHtml);
						});

						fileShowArea.prepend($html);
					}
				} else {

				}
			}
			, true
		);
	}

	function downloadFile(atchFileId) {
		MindsJS.movePage(prefix + "/downloadAtchFile.do", {atchFileId: atchFileId});
	}

	// base64 -> blob 변환
	function base64ToBlob(base64, mime) {
		mime = mime || '';
		var sliceSize = 1024;
		var byteChars = window.atob(base64);
		var byteArrays = [];
		for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
			var slice = byteChars.slice(offset, offset + sliceSize);
			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}
			var byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}
		return new Blob(byteArrays, { type: mime });
	}

	/**
	 * 등록한 답변을 답변 목록 영역에 append
	 * @param data : 답변data
	 */
	function replyAppend(data) {
		$reply = $('<div/>'); // 답변 하나씩의 영역
		$reply.addClass(data.replyId);

		// TODO replyerType (작성자/관리자)
		if (data.replyerType == 'W') {
			$reply.append('작성자');
		} else {
			$reply.append('관리자');
		}
		$reply.append(data.regDate);

		$replyContent = $('<span/>'); //답변 내용 영역
		$replyContent.addClass('replyContent');
		$replyContent.text(data.content);
		$reply.append($replyContent);

		if(userInfo.userId == data.regUserId) {
			$replyDelBtn = $('<button/>');
			$replyDelBtn.attr('replyId', data.replyId);
			$replyDelBtn.addClass('btnDelReply').text('삭제');
			if (data.replyerType == 'W') {
				$reply.append($replyDelBtn);
			} else {
				$reply.append($replyDelBtn);
			}
			$replyDelBtn.on('click', deleteReply);
		}

		$('.replyList').append($reply);

		// TODO replyID에 해당하는 File리스트 가져와서 답변 영역(replyContent)에 prepend 시키기
		fileList($replyContent, data.replyId);
	}

	/**
	 * 첨부파일 삭제
	 * @param e : 버튼event
	 */
	/*function deleteFile(e) {
		e.preventDefault();
	}*/

	/*function moveRegist() {
		MindsJS.movePage(requestApi.moveRegistView);
	}*/

	/* 답변 관련 함수 */
	function replyRegist(e) {
		e.preventDefault();

		if( $.isEmpty($('textarea[name=content]').val()) ) {
			$.alert('답변 내용을 입력해 주세요.');
			return;
		}

		var formData = new FormData(document.replyForm);
		formData.append('qnaId', qnaId);

		// 서버에 파일 전송 및 저장
		$.ajax({
			type: 'POST',
			url : requestApi.registReply,
			processData: false,
			contentType: false,
			data: formData,
			timeout: 60*1000*10,		// 10분
			success: function(result){
				// callback 실행
				if(result.success) {
					$.alert("답변이 등록되었습니다.", function() {
						$('#replyForm')[0].reset();
						$('.fileArea').html('');

						replyAppend(result.data);
					});
				}
			},
			error: function(e){
				$.alert("저장에 실패하였습니다.");
				return false;
			}
		});
	}

	function fileCheck(inputFile, extList) {
		var fileList = $(inputFile);

		var fileTotSize = 0;
		var fileTotCount = 0;

		var fileListLng = fileList.length;
		for(var i=0; i<fileListLng; i++) {
			var f = fileList[i].files;
			if(f[0] == null) {
				$.alert("업로드 할 파일을 선택해 주세요.");
				return ;
			}

			var fileLength = fileList[i].files.length;
			for(var i=0; i<fileLength; i++) {
				var $file = f[i];

				fileTotSize += $file.size;
				// 확장자 체크
				var nameArray = $file.name.split(".");
				var fileExt = nameArray[nameArray.length-1].toUpperCase();

				if( !extList || extList.includes(fileExt) ) {
					fileTotCount++;

					//첨부파일 추가
					registFile(inputFile, $file);
				} else {
					// 지원하는 파일이 아니면 스킵
					$(inputFile).val('');
					$.alert('첨부 불가능한 확장자입니다.');
					continue;
				}
			}
			// 파일 사이즈 체크
			if(fileTotSize > 5097152000) {	// 토탈 10MB
				$.alert("1회에 업로드 가능한 용량은 모든 파일을 합쳐 5GB이하 입니다. 다시 확인해 주세요.");
				return;
			}
		}
	}

	/**
	 * 첨부파일
	 * @param inputFile : input file dom 객체
	 * @param file : upload file
	 */
	function registFile(inputFile, file) {
		$html = $('<div/>');
		$(".fileArea", $mP).append($html);

		if ($(inputFile)[0].files && $(inputFile)[0].files[0]) {
			var img = document.createElement("img");
			img.width = 100;
			img.height = 100;
			img.file = $(inputFile)[0].files[0];
			$html.append(img);

			var reader = new FileReader();
			reader.onloadend = (function (aImg) {
				return function (e) {
					if( file.type.indexOf('image') > -1 ) {
						aImg.src = e.target.result;
					} else if( file.type.indexOf('video') > -1 ) {
						aImg.src = '/assets/images/logo_chatbot.png';
					} else {
						aImg.src = '/assets/images/ico_zip.png';
					}
				};
			})(img);
			reader.readAsDataURL($(inputFile)[0].files[0]);
		}

		$clone = $(inputFile).clone();
		$clone.attr('name', 'file');
		$html.append($clone).append('<a class="atchDelete">x</a>');

		$('.fileArea', $mP).find('.atchDelete').off("click").on("click", deleteFile);

		$(inputFile).val('');
	}

	function deleteReply(e) {
		e.preventDefault();

		var replyId = $(this).attr('replyId');

		$.confirm('해당 답변을 삭제하시겠습니까?', function (){
			MindsJS.loadJson(
				requestApi.deleteReply
				, { replyId : replyId, qnaRelatedId : replyId }
				, function(result) {
					if(result.success) {
						if(result.data != null) {
							$('.'+replyId).remove();
						}
					} else {
						$.alert('삭제 실패하였습니다.');
					}
				}
				, true
			);
		})
	}

	function deleteFile(e) { // 첨부파일 삭제
		e.preventDefault();
		$(this).parent().remove();
	}
	/* //답변 관련 함수 */

	function checkQnAByPassword(callback) {
		MindsJS.loadJson(
			requestApi.checkQnAByPassword
			, { qnaId: qnaId, qnaPassword : $('input[name=qnaPassword]').val() }
			, function(result) {
				if(result.success) {
					callback(result.data)
				} else {
					$.alert('비밀번호 확인 시 오류가 발생하였습니다.');
				}
			}
			, true
		);
	}

	function modifyQnA(check) {
		if( check ) {
			MindsJS.loadJson(
				requestApi.checkReplyState
				, { qnaId: qnaId, replyerType: 'O' }
				, function(result) {
					if(result.success) {
						if(result.data) {
							$.alert('답변이 존재하여 수정이 불가합니다.');
							return;
						} else {
							MindsJS.movePage("/profile/registQnA.do", {qnaId: qnaId});
						}
					}
				}
				, true
			);
		} else {
			$.alert('비밀번호가 올바르지 않아 수정할 수 없습니다.');
		}
	}

	function deleteQnA(check) {
		if( check ) {
			$.confirm('삭제하시겠습니까?',function (){
				MindsJS.loadJson(
					requestApi.deleteQnA
					, { qnaId: qnaId }
					, function(result) {
						if(result.success) {
							MindsJS.movePage("/profile/viewMyQnAList.do");
						}
					}
					, true
				);
			});
		} else {
			$.alert('비밀번호가 올바르지 않아 삭제할 수 없습니다.');
		}
	}

	function moveQnAListPage() {
		MindsJS.replacePage(requestApi.goQnAList);
	}
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();