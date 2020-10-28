var textNewsViewScript = (function() {
	var $mP;		// document object model
	var $Object;	// script object model
	var $UI;		// document ui
	
	var defaultJobType = "NW";
	var jobClassName = "news";

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
	function selectNewsData() {
		$Object.selectData(newsDataRender, failCallback);
	}
	function saveAndGotoNext() {
		if(validateNewsData()) {
			var param = {};
			param.context = $("#script_box2 textarea", $mP).val().replace(/\n/gi, '\\n');
			param.contextId = $("#contextId").val();
			$.confirm("작업한 내용을 저장하고 검수요청 하시겠습니까?", function() {
				$Object.saveContentForWorkForNews(param, $Object.requestInspectForWork);
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
			var param = {};
			param.context = $("#script_box2 textarea", $mP).val().replace(/\n/gi, '\\n');
			param.contextId = $("#contextId").val();
			$Object.saveContentForWorkForNews(param, function () {
				if (bViewMessage) {
					$.alert("작업한 내용이 임시저장 됐습니다.", selectNewsData);
				} else {
					selectNewsData();
				}
			});
		}
	}
	// 수정된 문장 길이 체크
	function validateNewsData() {
		if($("#script_box2 textarea", $mP).val() != ''){
			return true;
		} else {
			$.alert("수정된 기사가 존재하지 않습니다.")
			return false;
		}
	}
	

	function displayContents(context) {
	}
	function displaySubContents(contents) {
		// 기계정제
		if($UI != null) {
			$UI.setNewsList(contents, selectNewsData);
		}
	}
	function newsDataRender(renderData) {
		if($UI != null) {
			$UI.setNewsEditingList(renderData);
		}
	}
	function displayRecoverSubContents(contents) {
		// 기계정제
		if($UI != null) {
			$UI.setNewsList(contents);
		}
	}
	function clearDisplay() {
		$(".script_box textarea", $mP).scrollTop(0);
		$("div.reject_box", $mP).html("");
	}
	
	/** 페이지 내 고유 작업 **/
	
	/** LOCAL FUNCTION AND UI **/
	function emptyTemporaryData() {
		// contents 를 새로 로드했을 때 isTemporary data = false
		mIsTemporaryData = false;
//		$("button.btnSave", $mP).removeClass("active");
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