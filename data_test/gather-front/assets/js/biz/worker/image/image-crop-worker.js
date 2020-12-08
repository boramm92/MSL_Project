var imageCroppingScript = (function() {
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
		
//		$UI = $mP.regContextUi({
//			getValue: chooseSentenceEventHandler
//			,expression: $("tbody.tBaseCtnt", $mP)
//		});
		
		bindEventHandler();
		getCurrentJob();
	}
	function bindEventHandler() {
		// about navi action
		$("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);		// 작업불가
		$("button.btnNext", $mP).on("click", saveAndGotoNext);			// 저장 다음파일
		$("button.btnSave", $mP).on("click", saveFixedData);			// 임시저장

		// createTemplate
//		$(".cropBtn", $mP).on("click", createTemplate);
	}
	
	/** FOR NAVIGATE **/
	function getCurrentJob() {
		$Object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		// if(jobInfo.jobStatus == 'RJ') {
		// 	var param = {title: "Reasons for Reject", comment: jobInfo.rejectComment};
		// 	var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
		// 	$("div.reject_box", $mP).html(rejectCommentHtml);
		// 	$.alert("This context returned by inspector. Please check reason for correction.", null, "Alert");
		// }
		$Object.getCurrentJobContext(displayContents, failCallback);
//		$Object.selectCurrentContents(displaySubContents, failCallback);

		// template 초기화
		initTemplate();
		
		// 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.
//		selectCropData();
		
		// contents 를 새로 로드했을 때 isTemporary data = false
		emptyTemporaryData();
		
	}
	function selectCropData() {		// 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.
		$Object.selectData(fixedDataRender, failCallback);
	}
	function saveAndGotoNext() {	// 저장 다음파일
		// 문자입력란 체크
		if(!checkContext()){ 
			return false;
		}
		$.confirm("작업한 내용을 저장하고 검수요청 하시겠습니까?", function() {
			//$Object.requestInspectForWork();
			var param = $("form[name=work-data]", $mP).formJson();
			$Object.saveContentForWorkForCrop(param, $Object.requestInspectForWork);
		});
	}
	
	function checkContext(){
		var check = true;
		var contextInput = $("tbody.tBaseCtnt tr td input[name=context]");
		var contextLength = contextInput.length;
		for(var i = 0; i < contextLength; i++){
			if(contextInput[i].value == ""){
				$.alert("문자를 입력해주세요.");
				check = false;
			}
		}
		return check;
	}
	function ignoreAndGotoNext() {	// 작업불가
		var labelList = [
			{label:"Comment :", lbl_type:"text", name:"comment", lbl_ph:"작업불가 사유를 입력해 주세요." }
		];
		$.commentAll(
			"작업불가 사유를 입력하면 작업불가 항목으로 지정됩니다.<br>작업불가 항목으로 지정하시겠습니까?"	// messages
			, function(data) {
				$Object.requestIgnoreForWork(data.comment);
			}					// ok Function
			, null				// cancel Function
			, "작업불가 지정"		// Title
			, "작업불가"				// OK Title
			, "취소"				// Cancel Title
			, labelList			// label list
		);
	}
	function saveResult() {
		getCurrentJob();
	}
	// Temporary Svae
	function saveFixedData(bViewMessage) {
		if($(this).hasClass("active")) {
			// console.log($answerMap);
			// $Object.saveContentForWork($answerMap, function () {
			var param = $("form[name=work-data]", $mP).formJson();
			$Object.saveContentForWorkForCrop(param, function () {
				emptyTemporaryData();
				if (bViewMessage) {
					$.alert("작업한 내용이 임시저장 됐습니다.", selectCropData);
				} else {
					selectCropData();
				}
			});
		}
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
			$answerMap = setFixedList(renderData.contentList, removeSentence);
		}
	}
	function clearDisplay() {
		$answerMap = new Map();
		if(typeof $UI != 'undefined') {
			$UI.clearAnswer();
		}
	}
	
	/** 페이지 내 고유 작업 **/
	/** 참고자료 **/
	/** cropper.js : https://www.jqueryscript.net/zoom/jQuery-Plugin-For-Panning-Zooming-Any-Elements-panzoom.html **/
	var $image = $(".work_img .to-crop", $mP);
	var newCropStart = false;	// 신규크롭이미지 생성여부
	function startCropper(){
		$image.cropper({
			aspectRatio: NaN,
			autoCropArea: 0.75,
			autoCrop: false,
			ready: function (e) {
			},
			cropstart: function (e) {
				if(e.detail.action == "crop" && e.type == "cropstart"){
					newCropStart = true;
				}
			},
			crop: function (e) {
				// 템플릿만들기.(신규 템플릿에 preview class부여)
				if(newCropStart){
					createTemplate();
					newCropStart = false;
				}
				
				$("input[name=location_x]").last().val(e.detail.x);
				$("input[name=location_y]").last().val(e.detail.y);
				$("input[name=location_height]").last().val(e.detail.height);
				$("input[name=location_width]").last().val(e.detail.width);
				
				var cropData = new Map();
				cropData.location_x = e.detail.x;
				cropData.location_y = e.detail.y;
				cropData.location_width = e.detail.width;
				cropData.location_height = e.detail.height;
				
				// 우측에 크롭한 이미지 보여주기
				if(cropData.location_x != 0 && cropData.location_y != 0){
					cropImage(cropData);
				}
			}
		});
		
		$(".fa-arrows-alt").click(function(){
			$image.cropper("setDragMode", "move");
		});

		$(".fa-crop").click(function(){
			$image.cropper("setDragMode", "crop");
		});
		
		$(".btn_plus").click(function(){
			$image.cropper("zoom", 0.1);
		});

		$(".btn_minus").click(function(){
			$image.cropper("zoom", -0.1);
		});
	}
	
	var identity = 1;
	function createTemplate(){
		var currSize = $("tbody.tBaseCtnt", $mP).find("tr[idx]").length;
		fillTemporaryData();
		
		var param = new Map();
		param.idx = currSize + 1;
		param.identity = identity++;
		
		var cropHtml = $.templates("#cropDataTemplate").render(param);
		var $cropList;
		if(currSize == 0) {
			$cropList = $(".tBaseCtnt", $mP).html(cropHtml);
		} else {
			$cropList = $(".tBaseCtnt", $mP).append(cropHtml);
		}
		
		$cropList.find("em").off("click").on("click", removeSentence);
		$cropList.find("input").on("change", fillTemporaryData);
		
		// 스크롤을 최신 항목에 맞추기
		$("tbody.tBaseCtnt", $mP).parents(".content:first").scrollTop($("tbody.tBaseCtnt", $mP).height());
	}
	
	function setFixedList(data, uiHandler) {
		var cropHtml;
		var crpMap = new Map();
		
		if(data != null && data.length > 0) {
			var idxNum = 1;
			$("tbody.tBaseCtnt", $mP).children().remove();
			
			for(var i in data) {
				if(data[i].contextId != null && crpMap.get(data[i].contextId) == null) {
					var cropData = new Map();
					data[i].idx = idxNum++;
					data[i].identity = identity++;
					
					crpMap.set(data[i].contextId, data[i]);
					cropHtml = $.templates("#cropDataTemplate").render(data[i]);
					var $cropList;
					if(idxNum == 1){
						$cropList = $("tbody.tBaseCtnt", $mP).html(cropHtml);
					} else {
						$cropList = $("tbody.tBaseCtnt", $mP).append(cropHtml);
					}
					
					$cropList.find("em").off("click").on("click", removeSentence);
					$cropList.find("input").on("change keyup paste", fillTemporaryData);
					
					cropImage(data[i]);
				}
			}
		} else {
			var param = { colspan: 4, message : "선택된 이미지가 없습니다." };
			exprHtml = $.templates("#contentsEmptyTemplate").render(param);
		}
		
		$("tbody.tBaseCtnt", $mP).find("em").off("click").on("click", uiHandler);

		return crpMap;
	}
	
	function cropImage(crpData){
		var imgUrl = $(".work_img .to-crop", $mP).attr("src");
		var canvasIdentity = identity -1;
		var canvas = document.getElementById("cropCanvas"+canvasIdentity);
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
			ctx.clearRect(0, 0, canvas.width, canvas.height);	//cavas 그리기전 지우기
			ctx.drawImage(img, crpData.location_x, crpData.location_y, crpData.location_width, crpData.location_height, 0, 0, drawWidth, drawHeight);
		}
	}
	
	function removeSentence() {
		var $this = $(this);
		var $parentTr = $this.parents("tr:first");
		var $trList = $("tbody.tBaseCtnt", $mP).find("tr");
		var currIndex = $parentTr.find("td:first").attr("idx");
		
		// 마지막 tr일 경우 현재 크롭 clear
		var trListLength = $trList.length;
		var currTrNum = $parentTr.prevAll().length + 1
		if(trListLength == currTrNum){
			$image.cropper("clear");
		}

		for(var i=0; i<$trList.length; i++) {
			var idx = $trList.eq(i).find("td:first").attr("idx");
			if(idx*1 > currIndex*1) {
				$trList.eq(i).find("td:first").html(idx-1);
				$trList.eq(i).find("td:first").attr("idx", idx-1);
			}
		}

		if(!$.isEmpty($parentTr.attr("ctxid"))) {
			$Object.removeItem($parentTr.attr("ctxId"), null);
		}

		$answerMap.delete($parentTr.attr("idx").toString());
		$parentTr.remove();

		// template check
		var currSize = $("tbody.tBaseCtnt", $mP).find("tr[idx]").length;
		if(currSize == 0) {
			initTemplate();
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