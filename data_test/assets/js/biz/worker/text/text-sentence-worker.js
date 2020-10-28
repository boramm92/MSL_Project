var textSentenceViewScript = (function() {
	var $mP;		// document object model
	var $Object;	// script object model
	var $UI;		// document ui
	
	var defaultJobType = "ST";
	var jobClassName = "sentence";

	var mIsTemporaryData = false;

	function init(projectId) {
		$mP = $("div.contents");
		$Object = $mP.initTextProject({
			projectId: projectId,
			projectType: "T",
			jobType: defaultJobType,
			jobClassName: jobClassName,
			nextCallback: saveResult
		});
		$UI = $mP.regContextUi({});
		
		bindEventHandler();
		getCurrentJob();
	}
	function bindEventHandler() {
		// about navi action
		$("button.btnHome", $mP).on("click", function() {
			$Object.goHome();
		});
		$("button.btnRecover", $mP).on("click", goRecover);
		$("button.btnNext", $mP).on("click", saveAndGotoNext);
		$("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);
		$("button.btnSave", $mP).on("click", saveFixedData);			// 임시저장

		// 고유 액션 버튼
		$("input[name='question']").on("change keyup paste", checkData);
		$("input[name='answer']").on("change keyup paste", checkData);
	}
	
	/** FOR NAVIGATE **/
	function goRecover() {
		$Object.selectCurrentContents(displayRecoverSubContents, failCallback);
	}
	function getCurrentJob() {
		$Object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		// 1.화면의 내용을 지우고
		clearDisplay();
		// 2. Reject 이면 메시지 표시
		// $("div.reject_box", $mP).html("");
		// if(jobInfo.jobStatus == 'RJ') {
		// 	var param = {title: "Reasons for reject", comment: jobInfo.rejectComment};
		// 	var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
		// 	$("div.reject_box", $mP).html(rejectCommentHtml);
		// 	$.alert("This context returned by inspector. Please check reason for correction.", null, "Alert");
		// }
		// 3.새로운 컨텐츠 화면에 적용하기
		$Object.getCurrentJobContext(displayContents, failCallback);
		$Object.selectCurrentContents(displaySubContents, failCallback);

		// contents 를 새로 로드했을 때 isTemporary data = false
		emptyTemporaryData();
	}
	function selectSentenceData() {
		$Object.selectData(sentenceDataRender, failCallback);
	}
	function saveAndGotoNext() {
		if(validateNewsData()) {
			var param = $("form[name=work-data]", $mP).formJson();
			$.confirm("작업한 내용을 저장하고 검수요청 하시겠습니까?", function() {
				$Object.saveContentForWorkForSentence(param, checkDuplicateSentence);
			});
		}
	}
	function ignoreAndGotoNext() {
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
	// Temporary Save
	function saveFixedData(bViewMessage) {
		if($(this).hasClass("active")) {
			emptyTemporaryData();
			var param = $("form[name=work-data]", $mP).formJson();
			$Object.saveContentForWorkForSentence(param, function () {
				if (bViewMessage) {
					$.alert("작업한 내용이 임시저장 됐습니다.", selectSentenceData);
				} else {
					selectSentenceData();
				}
			});
		}
	}
	// 수정된 문장 길이 체크
	function validateNewsData() {
		var sentenceInput = $("form[name=work-data] input", $mP).not("input[name='contextId']");
		for(var i=0; i<sentenceInput.length; i++) {
			if(sentenceInput.eq(i).val().length == 0){
				var inputTitle = sentenceInput.eq(i).siblings('span').text();
				$.alert(inputTitle + "에 문장을 넣어주세요.");
				return false;
			}
		}
		return true;
	}
	
	function checkDuplicateSentence() {
		$Object.selectData(sentenceDataRenderCheck, failCallback);
	}

	function displayContents(context) {
		clearDisplay();
		selectSentenceData();
	}
	function displaySubContents(contents) {
		if($UI != null) {
			$UI.setBasicSntcList(contents);
		}
	}
	function sentenceDataRender(renderData) {
		if($UI != null) {
			clearDisplay();
			$UI.setSentenceList(renderData);
		}
	}
	function sentenceDataRenderCheck(renderData) {
		if($UI != null) {
			clearDisplay();
			$UI.setSentenceList(renderData, "check", $Object.requestInspectForWork);
		}
	}
	
	function clearDisplay() {
		if(typeof $UI != 'undefined') {
			$UI.clearSentenceData();
		}
	}
	
	/** 페이지 내 고유 작업 **/
	function checkData(){
		fillTemporaryData();
	}
	
	function chooseSentenceEventHandler(contentId, param) {
	}
	function removeSentence() {
	}
	
	/** LOCAL FUNCTION AND UI **/
	function emptyTemporaryData() {
		// contents 를 새로 로드했을 때 isTemporary data = false
		mIsTemporaryData = false;
		$("button.btnSave", $mP).removeClass("active");
	}
	function fillTemporaryData() {
		// contents 를 새로 로드했을 때 isTemporary data = false
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