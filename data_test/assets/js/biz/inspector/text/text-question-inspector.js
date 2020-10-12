var textQuestionViewScript = (function() {
	var $mP;
	var $Object;
	var $UI;
	
	var defaultJobType = "TQ";
	var jobClassName = "question";
	var mQuestionCategoryList = [];
	
	var $answerMap = new Map();
	
	function init(projectId) {
		$mP = $("div.contents");
		$Object = $mP.initTextProject({
			projectId: projectId,
			projectType: "T",
			jobType: defaultJobType,
			jobClassName: jobClassName,
			nextCallback: saveResult
		});
		var settings = { 
			/*answer: $(".answer_part1", $mP)
			,clue: $(".answer_part2", $mP)*/
		};
		$UI = $mP.regContextUi(settings);
		
		bindEventHandler();
		getCurrentJob();
	}
	function bindEventHandler() {
		$("button.btnNext", $mP).on("click", requestComplete);		// 승인
		$("button.btnHome", $mP).on("click", function() {
			$Object.goHome("프로젝트 관리화면으로 이동합니다.<br>'OK'를 클릭하면 저장하지 않은 데이터는 사라집니다.<br>이동하시겠습니까?");
		});
		
		// 임시저장
		$("button.btnReject", $mP).on("click", requestReject);		// 반려
	}
	/** FOR NAVIGATE **/
	function goPrevJob() {
	}
	function getCurrentJob() {
		$Object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		if(jobInfo.jobStatus == 'IM') {
			$.alert("작성자 '"+jobInfo.workerId + "'님이 작업불가로 지정한 항목입니다. 사유를 확인 후 검수를 결정해 주세요.");
		}
		$Object.getCurrentJobContext(displayContents, failCallback);		
		$Object.selectCurrentContents(displaySubContents, failCallback);
		$Object.selectProjectCategorySubList(setQuestionCategoryList);			// 질문 카테고리 가져오기
	}
	function setQuestionCategoryList(result) {
		mQuestionCategoryList = result;
	}
	function selectQuestionData() {
		$Object.selectData(questionDataRender, failCallback);
	}
	function requestComplete() {
		$Object.requestComplete();
	}
	function requestComplete() {
		$Object.requestComplete();
	}
	function requestReject() {
		var rejectComment = $("textarea[name=comment]", $mP).val();
		$Object.requestReject(rejectComment);
	}
	function saveResult() {
		getCurrentJob();
	}
	
	/** FOR DISPLAY CONTEXT **/

	function displayContents(context) {
		clearDisplay();
		selectQuestionData();
	}
	function displaySubContents(contents) {
		$UI.setArticle(TextJS.parseContext(contents.context));
	}
	function questionDataRender(renderData) {
		$answerMap = $UI.setQuestionList(renderData, questionBtnEventHandler);
	}
	function clearDisplay() {
		$answerMap = new Map();	
		if(typeof $UI != 'undefined') {
			$UI.clearAnswer();
		}
		$("textarea[name=comment]", $mP).val("");
	}
	function questionBtnEventHandler() {
		var btnClassName = $(this).attr("class");
		if(btnClassName == 'question_edit_btn') {
			var contentId = $(this).parents("li:first").attr("qaid");
			$Object.selectDetailData(contentId, function(result) {
				var settings = {
					projectId: result.projectId
					, jobClassName: "clue"
					, qaId: contentId
					, qaCtgList: mQuestionCategoryList
				};
				var $modal = $mP.regQuestModal(settings);
				$modal.show(result);
			});
		} else {}
	}

	/** LOCAL FUNCTION AND UI **/
	function failCallback(result) {
		console.log(result);
	}
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();