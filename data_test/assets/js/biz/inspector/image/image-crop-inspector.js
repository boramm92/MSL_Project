var imageCropViewScript = (function() {
	var $mP;		// document object model
	var $Object;	// script object model
	var $UI;		// document ui
	
	var defaultJobType = "IC";
	var mIsTemporaryData = false;

	var $answerMap = new Map();

	function init(projectId) {
		$mP = $("div.contents");
		$Object = $mP.initImageProject({
			projectId: projectId,		// 
			projectType: "P",
			jobType: defaultJobType,
			jobClassName: "crop",
			nextCallback: saveResult
		});
		
		bindEventHandler();
		getCurrentJob();
	}
	function bindEventHandler() {
		// about navi action
		$("button.btnNext", $mP).on("click", requestComplete);		// 승인
		
		// 임시저장
		$("button.btnReject", $mP).on("click", requestReject);		// 반려
	}
	
	/** FOR NAVIGATE **/
	function getCurrentJob() {
		$Object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		if(jobInfo.jobStatus == 'IM') {
			var param = {title: "Reasons for Impossible", comment: jobInfo.rejectComment};
			var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
			$("div.faild_box", $mP).html(rejectCommentHtml).show();
			$.alert("작성자 '"+jobInfo.workerId + "'님이 작업불가로 지정한 항목입니다. 사유를 확인 후 검수를 결정해 주세요.");
		} else {
			$("div.faild_box", $mP).hide();
		}
		$Object.getCurrentJobContext(displayContents, failCallback);

		// template 초기화
		initTemplate();
		
		// contents 를 새로 로드했을 때 isTemporary data = false
		emptyTemporaryData();
		
	}
	
	function selectCropData() {		// 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.
		$Object.selectData(fixedDataRender, failCallback);
	}
	// 승인
	function requestComplete() {
		$Object.requestComplete();
	}
	// 반려
	function requestReject() {
		var rejectComment = $("textarea[name=comment]", $mP).val();
		$Object.requestReject(rejectComment);
	}
	
	function saveResult() {
		getCurrentJob();
	}

	function displayContents(context) {
		clearDisplay();
		
		var image64 = context.atchFile;
		if($.isEmpty(image64)) {
			$.alert("원본 데이터 파일을 불러오지 못했습니다."); // 원본 이미지를 불러오지 못했습니다.
			return;
		}
		
		var base64ImageContent = image64.replace(/^data:image\/(png|jpeg);base64,/, "");
		var extType = context.extName == ".png"? "image/png" : "image/jpeg";
		var blob = base64ToBlob(base64ImageContent, extType);
		
		var reader = new FileReader();
		reader.onload = function(e) {
			if($(".work_img .cropper-bg", $mP).length > 0){ // 버튼의 다음작업
				$(".work_img .to-crop", $mP).cropper("replace", e.target.result);
			}else{ // 화면 진입 시 하는 작업
				$(".work_img .to-crop", $mP).attr("src", e.target.result);
				startCropper();
			}
			$(".work_img .to-crop", $mP).attr("alt", context.orgFileName);
			
			// 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.
			selectCropData();
		}
		reader.readAsDataURL(blob);
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
	
	function fixedDataRender(renderData) {
		console.log(renderData);
		if(renderData != null) {
			$answerMap = setFixedList(renderData.contentList);
		}
	}
	
	function clearDisplay() {
		$answerMap = new Map();
		if(typeof $UI != 'undefined') {
			$UI.clearAnswer();
		}
		$("textarea[name=comment]", $mP).val("");
	}
	
	/** 페이지 내 고유 작업 **/
	function startCropper(){
		var $image = $(".work_img .to-crop", $mP);
		$image.cropper({
			autoCrop: false,
			dragCrop: false,
			dragMode: "move"
		});

		$(".fa-plus").click(function(){
			$image.cropper("zoom", 0.1);
		});

		$(".fa-minus").click(function(){
			$image.cropper("zoom", -0.1);
		});
	}
	
	var identity = 1;
	function setFixedList(data) {
		var cropHtml;
		var crpMap = new Map();
		
		if(data != null && data.length > 0) {
			var idxNum = 1;
			$("tbody.tBaseCtnt", $mP).children().remove();
			
			for(var i in data) {
				if(data[i].contextId != null && crpMap.get(data[i].contextId) == null) {
					var cropData = new Map();
					data[i].idx = idxNum;
					data[i].identity = identity;
					
					crpMap.set(data[i].contextId, data[i]);
					cropHtml = $.templates("#cropSentenceTemplate").render(data[i]);
					
					if(idxNum == 1){
						$("tbody.tBaseCtnt", $mP).html(cropHtml);
					} else {
						$("tbody.tBaseCtnt", $mP).append(cropHtml);
					}
					fixedCropImage(data[i], data[i].identity);
					
					idxNum++;
					identity++;
				}
			}
		} else {
			var param = { colspan: 4, message : "선택된 이미지가 없습니다." };
			exprHtml = $.templates("#contentsEmptyTemplate").render(param);
		}
		
//		$("tbody.tBaseCtnt", $mP).find("em").off("click").on("click", uiHandler);

		return crpMap;
	}
	
	// 저장된 x, y, width, height으로 이미지 그리기.
	function fixedCropImage(crpData, paramIdentity){
		var imgUrl = $(".work_img .to-crop", $mP).attr("src");
		var canvas = document.getElementById("cropCanvas"+paramIdentity);
		var ctx = canvas.getContext("2d");
		var drawWidth = canvas.width;
		var drawHeight = canvas.height;
		
		// 우측 크롭이미지 너비 높이 구하기
		if(crpData.location_width > crpData.location_height){
			drawHeight = (drawWidth * crpData.location_height / crpData.location_width).toFixed(4);
		}else if(crpData.location_height > crpData.location_width){
			drawWidth = (drawHeight * crpData.location_width / crpData.location_height).toFixed(4);
		}
		
		var img = new Image();
		img.src = imgUrl;
		img.onload = function(){
			ctx.drawImage( img, crpData.location_x, crpData.location_y, crpData.location_width, crpData.location_height, 0, 0, drawWidth, drawHeight );
		}
	}
	
	function initTemplate(){
		var param = { colspan: 3, message : "선택된 이미지가 없습니다." };
		var emptyItempHtml = $.templates("#contentsEmptyTemplate").render(param);
		$("tbody.tBaseCtnt", $mP).html(emptyItempHtml);
	}
	
	/** LOCAL FUNCTION AND UI **/
	function emptyTemporaryData() {
		// contents 를 새로 로드했을 때 isTemporary data = false
		mIsTemporaryData = false;
		$("button.btnSave", $mP).removeClass("active");
	}
	function fillTemporaryData() {
		mIsTemporaryData = true;
		$("button.btnSave", $mP).addClass("active");
	}

	function failCallback(result) {
		console.log(result);
	}
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();