var imageCroppingScript = (function() {
	var $mP;		// document object model
	var $Object;	// script object model
	var $UI;		// document ui

	var defaultJobType = "MI";
	var mIsTemporaryData = false;

	var $answerMap = new Map();

	function init(projectId) {
		$mP = $("div.contents");
		$Object = $mP.initImageProject({
			projectId: projectId,		//
			projectType: "P",
			jobType: defaultJobType,
			jobClassName: "mask",
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
		if(jobInfo.jobStatus == "RJ") {
			var param = {title: "Reasons for Reject", comment: jobInfo.rejectComment};
			var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
			$("div.reject_box", $mP).html(rejectCommentHtml);
			$.alert("This context returned by inspector. Please check reason for correction.", null, "Alert");
		}
		$Object.getCurrentJobContext(displayContents, failCallback);
		$Object.selectProjectCategorySubList(setImageCategoryList);

		// template 초기화
		initTemplate();

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
			// ...
//			$image.selectAreas("reset");
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
//			 console.log($answerMap);
//			 $Object.saveContentForWork($answerMap, function () {
			var param = $("form[name=work-data]", $mP).formJson();

			$Object.saveContentForWorkForCrop(param, function () {
				emptyTemporaryData();
				initTemplate();
				$image.selectAreas("reset");
				if (bViewMessage) {
					$.alert("작업한 내용이 임시저장 됐습니다.", selectCropData);
				} else {
					selectCropData();
				}
			});

		}
	}

	function displayContents(context) {
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
				$(".to-crop", $mP).attr("src", e.target.result);
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
			// 임시 저장한 크롭박스 보여주기
			drawCropImage(renderData.contentList);
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
	/** selectareas.js : https://www.jqueryscript.net/other/jQuery-Plugin-For-Selecting-Multiple-Areas-of-An-Image-Select-Areas.html **/
	/** panzoom.js : https://www.jqueryscript.net/zoom/jQuery-Plugin-For-Panning-Zooming-Any-Elements-panzoom.html **/
	/** panzoom.js : https://www.tea.se/ICA/test/ **/
	var $image = $(".to-crop", $mP);
	function startCropper(){
		var $section = $(".common_box");

		$image.selectAreas({
			minSize: [10, 10],
			onChanged:onChangedCropBox,
			onChanging: onChangingCropBox
		});

		$section.find(".div_img").panzoom({
			$zoomIn: $section.find(".btn_plus"),
			$zoomOut: $section.find(".btn_minus"),
			increment: 0.1,
			animate: false,
			disablePan: true
		});

		// 이미지 이동 활성화
		$(".arrowsAlt").click(function(){
			$section.find(".div_img").panzoom("option", "disablePan", false);
			$section.find(".select-areas-overlay").next().css("cursor","move");
		});

		// 이미지 이동 비활성화
		$(".vectorSquare").click(function(){
			$section.find(".div_img").panzoom("option", "disablePan", true);
			$section.find(".select-areas-overlay").next().css("cursor","crosshair");
		});
	}

	function drawCropImage(crpData, paramIdentity){
		for(var i=0; i < crpData.length; i++){
			$("input:radio[name='masking_type']:radio[id='"+crpData[i].context+"']").prop('checked', true);

			var areaOption = {
				x: crpData[i].location_x,
				y: crpData[i].location_y,
				width: crpData[i].location_width,
				height: crpData[i].location_height,
			};
			$image.selectAreas("add", [areaOption]);
			$("form[name=work-data]", $mP).find("div[idx="+ i +"]").find("input[name=contextId]").val(crpData[i].contextId);
			$("form[name=work-data]", $mP).find("div[idx="+ i +"]").attr("ctxId", crpData[i].contextId);
		}
	}

	// 라디오버튼 그리기
	function setImageCategoryList(data) {
		var html = "";
		html += $.templates("#radioButtonTemplate").render(data);
		$(".select_group", $mP).html(html);
	}

	function getCropImageData() {
		return $("form[name=work-data]", $mP).formJson();
	}

	function onChangedCropBox(event, id, areas){
		var $selectedArea = $(".select-areas-outline");

		// 선택영역이 0이라면 임시저장 비활성화
		if($image.selectAreas("areas").length == 0){
			$("button.btnSave", $mP).removeClass("active");
		} else {
			$("button.btnSave", $mP).addClass("active");
		}

		if($(".common_box").find(".select-areas-overlay").next().css("cursor")!="move"){
			if(!$("input:radio[name=masking_type]").is(":checked")){
				$.alert("라디오버튼에 체크하세요.");
				$image.selectAreas("reset");
				false;
			}else{
				var $curDiv = $("form[name=work-data]", $mP).find("div[idx="+ id +"]");
				var thisLength = $curDiv.length;
				var checkEvent = "delete";
				var index;

				for(var i=0; i<areas.length; i++){
					if(areas[i].id == id){
						checkEvent = "change";
						index = i;
					}
				}

				if(checkEvent == "change"){	//생성 및 수정
					if($curDiv.length == 0) {
						//input 생성
						createInputTemplate(id, areas);

					}else {	//input데이터 수정
						$curDiv.find("input[name=location_x]").val(areas[index].x);
						$curDiv.find("input[name=location_y]").val(areas[index].y);
						$curDiv.find("input[name=location_width]").val(areas[index].width);
						$curDiv.find("input[name=location_height]").val(areas[index].height);
					}
				}else{	//삭제(input제거)
					removeSentence(id);
				}
			}
		}
	}

	function onChangingCropBox(event, id, areas){ // arguments
		var $selectedArea = $(".select-areas-outline");
		var html = "";

		if($(".common_box").find(".select-areas-overlay").next().css("cursor")!="move"){
			if(!$("input:radio[name=masking_type]").is(":checked")){
				$.alert("라디오버튼에 체크하세요.");
				$image.selectAreas("reset");
				false;
			}else{
				if($("div[idx="+ id +"]").length == 0) {
					// input 생성
					createInputTemplate(id, areas);
				}
			}
		}
	}

	function createInputTemplate(id, areas) {
		var $selectedArea = $(".select-areas-outline");
		var $selectedAreaBack = $(".select-areas-background-area");
		var index = areas.length - 1;
		if($selectedArea.first().attr("radioCode") == undefined || $selectedArea.first().attr("radioCode") == ""){
			var color = $("input:radio[name=masking_type]:checked").val();
			var radioCode = $("input:radio[name=masking_type]:checked").attr("id");
			$selectedArea.first().css("background", color);
			$selectedArea.first().css("opacity", "0.3");
			$selectedArea.first().attr("radioCode",radioCode);
			$selectedAreaBack.first().css("background", ""); // 크롭시 그려지는 이미지 제거
		}

		var param = new Map();
		param.identity = id;
		param.location_x = areas[index].x;
		param.location_y = areas[index].y;
		param.location_width = areas[index].width;
		param.location_height = areas[index].height;
		param.context = $selectedArea.first().attr("radioCode");

		html = $.templates("#multiCropDataTemplate").render(param);
		$("form[name=work-data]", $mP).append(html);
	}

	function removeSentence(id) {
		var $curDiv = $("form[name=work-data]", $mP).find("div[idx="+ id +"]");

		if(!$.isEmpty($curDiv.attr("ctxid"))) {
			$Object.removeItem($curDiv.attr("ctxId"), null);
		}
		$curDiv.remove();
	}

	function initTemplate(){
		$("form[name=work-data]", $mP).html("");
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