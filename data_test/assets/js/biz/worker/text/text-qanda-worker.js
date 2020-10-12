var textQandAViewScript = (function() {
	var $mP;		// document object model
	var $Object;	// script object model
	var $UI;		// document ui

	var defaultJobType = "TA";
	var mQuestionCategoryList = [];

	var $answerMap = new Map();		// 본문에 따른 질문 목록
	
	function init(projectId) {
		$mP = $("div.contents");
		$Object = $mP.initTextProject({
			projectId: projectId,
			projectType: "T",
			jobType: defaultJobType,
			jobClassName: "qanda",
			modalCallback: saveModalData,
			nextCallback: saveResult
		});
		
		bindEventHandler();
		getCurrentJob();
	}
	function bindEventHandler() {
		// about navi action
		$("button.btnHome", $mP).on("click", function() {
			$Object.goHome();
		});
		$("button.btnPrev", $mP).on("click", goPrevJob);
		$("button.btnNext", $mP).on("click", saveAndGotoNext);
		$("button.btnSave", $mP).on("click", saveQuestionData);			// 임시저장
		$("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);

		// 고유 버튼 액션
		$(".question_add_btn", $mP).on("click", showModalAddQuestion);
	}
	
	/** FOR NAVIGATE **/
	function goPrevJob() {
	}
	function getCurrentJob() {
		$Object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		// if(jobInfo.jobStatus == 'RJ') {
		// 	var param = {title: "Reasons for Reject", comment: jobInfo.rejectComment};
		// 	var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
		// 	$("div.reject_box", $mP).html(rejectCommentHtml);
		// 	$.alert("This context returned by inspector. Please check reason for correction.", null, "Alert");
		// 	//$.alert("검수자에 의해 반려된 항목입니다. 반려사유를 확인 후 수정해 주세요.");
		// }
		$Object.getCurrentJobContext(displayContents, failCallback);
		$Object.selectCurrentContents(displaySubContents, failCallback);
		$Object.selectProjectCategorySubList(setQuestionCategoryList);			// 질문 카테고리 가져오기
		// contents 를 새로 로드했을 때 isTemporary data = false
		emptyTemporaryData();
	}
	function setQuestionCategoryList(result) {
		mQuestionCategoryList = result;
	}
	function selectQuestionData() {
		$Object.selectData(questionDataRender, failCallback);
	}
	function saveAndGotoNext() {
		$.confirm("작업한 내용을 저장하고 검수요청 하시겠습니까?", function() {
			$Object.saveContentForWork($answerMap, $Object.requestInspectForWork);			
		});
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
	// 임시저장
	function saveQuestionData(bViewMessage) {
		$Object.saveContentForWork($answerMap, function() {
			if(bViewMessage) {
				emptyTemporaryData();
				$.alert("작업한 내용이 임시저장 됐습니다.", selectQuestionData);
			} else {
				selectQuestionData();
			}
		});
	}
	
	function saveModalData(formData) {
		$Object.saveQuestionForWork(formData, function() {
			selectQuestionData();
		});
	}
	function displayContents(context) {
		clearDisplay();
		selectQuestionData();
	}
	function displaySubContents(contents) {
		$("span.fileName", $mP).text(contents.atchOrgFileName);
		var settings = { 
			getValue: chooseSentenceEventHandler
			,answer: $("div.minibox2", $mP)
		};
		$UI = $mP.regContextUi(settings);
		$UI.setArticle(TextJS.parseContext(contents.context));
	}
	function questionDataRender(renderData) {
		if($UI != null) {
			$answerMap = $UI.setQuestionList(renderData, questionBtnEventHandler);
		}
	}
	function clearDisplay() {
		$answerMap = new Map();	
		if(typeof $UI != 'undefined') {
			$UI.clearAnswer();
		}
	}
	function questionBtnEventHandler() {
		var emTypeName = $(this).attr("type");
		var $parents = $(this).parents("li:first");
		if(emTypeName == 'question_edit_btn') {
			var contentId = $parents.attr("qaid");
			$Object.selectDetailData(contentId, function(result) {
				var settings = {
					projectId: result.projectId
					, jobClassName: "qanda"
					, fnSave: saveModalData
					, qaId: contentId
					, qaCtg: $parents.attr("qaCtg")
					, qaCtgList: mQuestionCategoryList
				};
				var $modal = $mP.regQuestModal(settings);
				$modal.show(result);
			});
		} else if(emTypeName == 'question_del_btn') {
			var $this = $(this);
			$.confirm("삭제한 질문은 복구할 수 없습니다.<br>선택하신 질문 항목을 삭제 하시겠습니까?", function() {
				var contentId = $this.parents("li:first").attr("qaId");
				$Object.removeItem(contentId, function() {
					// map 데이터도 삭제
					if($answerMap != null) {
						$answerMap.delete(contentId);
					}
					selectQuestionData();
				});
			});
			
		} else {}
	}
	
	/** 페이지 내 고유 작업 **/
	function showModalAddQuestion() {
		var settings = {
			jobClassName: "qanda"
			, fnSave: saveModalData
			, qaCtgList: mQuestionCategoryList
		};
		var $modal = $mP.regQuestModal(settings);
		$modal.show();
	}

	function chooseSentenceEventHandler(contentId, param) {
		if($answerMap == null) {
			return;
		}
		fillTemporaryData();
		var qaTemp = $answerMap.get(contentId);
		qaTemp.start_index 	= param.start_index ? param.start_index : qaTemp.start_index;
		qaTemp.end_index	= param.end_index ? param.end_index : qaTemp.end_index;
		qaTemp.answer	 	= param.answer ? param.answer : qaTemp.answer;

		$answerMap.set(contentId, qaTemp);
	}
	
	/** LOCAL FUNCTION AND UI **/
	function failCallback(result) {
		console.log(result);
	}

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
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();