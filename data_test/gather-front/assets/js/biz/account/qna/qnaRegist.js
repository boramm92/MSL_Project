var qnaScript = (function() {
	var $mP;
	var extList = {
		'img' : ['JPG', 'JPEG', 'PNG'],
		'video' : ['MP4']
	};

	var requestApi = {
		registQnA : "/profile/mergeQnA.json",
		selectQnA : "/profile/selectQnA.json",
		selectFileList : "/profile/selectFileList.json",

		selectPostingList: 	"/wspace/selectPostingList.json", // 프로젝트 목록
		goQnAList : "/profile/viewMyQnAList.do"
	};

	var removeAtchIdList = new Array();

	var type = 'W'; // 작성/수정 확인 변수

	function init() {
		$mP = $("div.container");
		
		bindEventHandler();
		loadProjectList();
	}
	function bindEventHandler() {
		$("button.btnRegist", $mP).off("click").on("click", qnaRegist);

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
						type = 'M';
						var data = result.data;

						$('[name=projectId]').val(data.projectId);
						$('[name=qnaType]').val(data.qnaType);
						$('[name=title]').val(data.title);
						$('[name=content]').val(data.content);

						fileList($('.fileArea'), data.qnaId);
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

							$imgDelBtn = $('<button class="atchDelete">x</button>');
							$imgDelBtn.attr('atchFileId', v.atchFileId);

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

							$imgHtml.append($img).append($imgDelBtn);
							$html.append($imgHtml);

							$html.find('.atchDelete').off('click').on('click', deleteFile);
						});

						fileShowArea.prepend($html);
					}
				} else {

				}
			}
			, true
		);
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
	 * 프로젝트 목록
	 * 프로젝트 목록을 가져온 후 loadQnaTypeList() 호출,
	 * loadQnaTypeList안에서 selectQnA를 호출하면서 값 세팅.
	 */
	function loadProjectList() {
		var param = {};
		param.language = navigator.language || navigator.userLanguage;
		MindsJS.loadJson(
			requestApi.selectPostingList
			, param
			, function(result) {
				var html = "<option value=''>프로젝트 선택</option>";
				if (!$.isEmpty(result.data)) {
					html += $.templates("#projectList").render(result.data);
				}
				html += "<option value='ETC_000000000'>기타</option>";

				$("select[name=projectId]", $mP).html(html);

				loadQnaTypeList();//질문유형
			}
		);
	}

	/**
	 * 질문 유형
	 */
	function loadQnaTypeList() {
		MindsJS.loadJson(
			'/biz/comm/selectCode.json',
			{grpCode: 'QNA_TYPE'},//레이어노출 카테고리
			function (result) {
				var html = "<option value=''>질문 유형 선택</option>";
				if (!$.isEmpty(result.data)) {
					html += $.templates("#selectOptionOnlyTemplate").render(result.data);
				}

				$("select[name=qnaType]", $mP).html(html);

				selectQnA();
			}

		);
	}

	function qnaRegist() {
		var formData = new FormData(document.qnaRegistForm);
		formData.append("qnaId", qnaId);

		$.each(removeAtchIdList, function(i, v) { // 첨부파일 삭제
			formData.append('removeFileId', v);
		});

		if( $.isEmpty($('select[name=projectId]').val()) || $.isEmpty($('select[name=qnaType]').val()) ) {
			$.alert('프로젝트 또는 질문 유형을 선택해 주세요.');
			return;
		}
		if( $.isEmpty($('input[name=title]').val()) ) {
			$.alert('제목을 입력해 주세요.');
			return;
		}
		if( type != 'M' ) {
			if( $.isEmpty($('input[name=qnaPassword]').val()) ) {
				$.alert('비밀번호를 설정해 주세요. 글 수정 및 삭제 시 필요합니다.');
				return;
			}
			if( $('input[name=qnaPassword]').val().length < 4 ) {
				$.alert('비밀번호를 4자 이상 입력해 주세요.');
				return;
			}
		}

		// 서버에 파일 전송 및 저장
		$.ajax({
			type: 'POST',
			url : requestApi.registQnA,
			processData: false,
			contentType: false,
			data: formData,
			timeout: 60*1000*10,		// 10분
			success: function(result){
				// callback 실행
				$.alert("작업한 내용이 저장되었습니다.", moveQnAListPage);
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

	function deleteFile(e) { // 첨부파일 삭제
		e.preventDefault();

		removeAtchIdList.push($(this).attr('atchFileId'));
		$(this).parent().remove();
	}


	function moveQnAListPage() {
		MindsJS.replacePage(requestApi.goQnAList);
	}
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();