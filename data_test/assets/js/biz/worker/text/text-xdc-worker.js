var textXdcViewScript = (function() {
	var $mP;			// document object model
	var $Object;		// script object model
	var $UI;			// script object model
	var $voiceHandler;
	
	var defaultJobType = "XD";
	var maxContentCount = 20;

	var mIsTemporaryData = false;
	
	var $answerMap = new Map();
	
	function init(projectId) {
		$mP = $("div.contents");
		$Object = $mP.initTextProject({
			projectId: projectId,
			projectType: "T",
			jobType: defaultJobType,
			jobClassName: "xdc",
			nextCallback: saveResult
		});
		$UI = $mP.regContextUi({ 
			getValue: chooseSentenceEventHandler
			,expression: $(".tBaseCtnt", $mP)
		});
		
		bindEventHandler();
		getCurrentJob();
	}
	function bindEventHandler() {
		// about navi action
		$("button.btnNext", $mP).on("click", saveAndGotoNext);
		$("button.btnSave", $mP).on("click", temporaryStorage);			// 임시저장
		$("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);
		
		$("select[name=categoryType]", $mP).on("change", fillTemporaryData);
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
		// }
		$Object.getCurrentJobContext(displayContents, failCallback);
		$Object.selectCurrentContents(displaySubContents, failCallback);

		// contents 를 새로 로드했을 때 isTemporary data = false
		emptyTemporaryData();
	}
	function selectExpressionData() {
		$Object.selectData(expressionDataRender, failCallback);
	}
	function saveAndGotoNext() {
		$.confirm("Do you want to save your work and request a review?", function() {
			if($.isEmpty($("select[name=categoryType]", $mP).val()))
			{
				$.alert("Class type is required.", function() {
					$("select[name=categoryType]", $mP).focus();
				}, "Information");
			} else {
				$answerMap.classify = $("select[name=categoryType]",$mP).val();
				$Object.saveContentForWorkForXDC($answerMap, $Object.requestInspectForWork);	
			}			
		}, null, "Confirm");
	}
	function ignoreAndGotoNext() {
		$.confirm(
			"Do you want to make this a unable to work?"
			, function() {
				$Object.requestIgnoreForWork();			
			}
			, null
			, "Make Ignore"
		);
	}
	function saveResult() {
		getCurrentJob();
	}
	// 임시저장
	function temporaryStorage(bViewMessage) {
		if($(this).hasClass("active")) {
			emptyTemporaryData();
			$answerMap.classify = $("select[name=categoryType]",$mP).val();
			$Object.saveContentForWorkForXDC($answerMap, function() {
				if(bViewMessage) {
					$.alert("Your work has been saved.", selectExpressionData);
				} else {
					selectExpressionData();
				}
			});
		}
	}
	
	/** DISPLAY RENDERING **/
	function displayContents(context) {
		clearDisplay();
		//displayAudioPlayer(context);
		displayAudioPlayerMarkII(context);
		//$Object.selectProjectCategorySubList(displayClassifyItems);		// 프로젝트 별 카테고리에 맞는 분별 항목을 가져온다.
	}
	
	var $voiceHandler;
	function displayAudioPlayerMarkII(context) {
		var $audioUI = $("div.audiobox", $mP).regAudioPlayer();
		if($audioUI != null) {
			$voiceHandler = $audioUI.find("audio").get(0);
			
			var mime_type = "audio/x-wav";		// default
			if(context.mediaType == 'wav') {
				mime_type = "audio/x-wav";
			} else if(context.mediaType == 'mp3') {
				mime_type = "audio/mp3";
			}
			// 음성파일이 있으면 음성 플레이어를 표시
			if(context.atchFile != 'undefined' && context.atchFile != null) {
				var blob = WaveJS.base64toBlob(context.atchFile, mime_type);
				var blobUrl = URL.createObjectURL(blob);
				$audioUI.find("audio#music").attr("src", blobUrl);
			}			
		} 
	}
	function displaySubContents(contents) {
		$UI.setArticle(TextJS.parseContext(contents.context));
		selectSubCodeTypeList();
		selectExpressionData();
	}
	function expressionDataRender(renderData) {
		// 임시저장 된 데이터를 불러온 경우
		$answerMap = $UI.setExpressionList(renderData.contentList, removeSentence);
		// 설정해 놓은 Classify 표시
		$("select[name=categoryType]", $mP).val(renderData.classifyType)
	}
	function clearDisplay() {
		$answerMap = new Map();	
		if(typeof $UI != 'undefined') {
			$UI.clearAnswer();
		}
	}
	// Classification 세부 항목을 가져온다
	function selectSubCodeTypeList() {
		$Object.selectProjectCategorySubList(renderClassifyType);
	}
	function renderClassifyType(data) {
		var html = "<option value=''>-- SELECT --</option>";
		html += $.templates("#selectOptionOnlyTemplate").render(data);
		$("select[name=categoryType]", $mP).html(html);
	}
	
	/** 페이지 내 고유 작업 **/
	var identity = 1;	// 등록되지 않은 항목의 고유값
	function chooseSentenceEventHandler(contentId, param) {
		var currSize = $("tbody.tBaseCtnt", $mP).find("tr[idx]").length;
		
		if(currSize >= maxContentCount) {
			$.alert("Can't add anymore sentence.<br>(Max : "+maxContentCount+")");
			return;
		}
		
		fillTemporaryData();

		param.idx = currSize+1;
		param.identity = identity++;
		
		//param.context = param.context.split("<").join("&lt;");
		//param.context = param.context.split(">").join("&gt;");
		
		var sentenceHtml = $.templates("#sentenceTemplate").render(param);
		var $sentenceList;
		if(currSize == 0) {
			$sentenceList = $(".tBaseCtnt", $mP).html(sentenceHtml);	
		} else {
			$sentenceList = $(".tBaseCtnt", $mP).append(sentenceHtml);
		}
		
		$answerMap.set(param.identity.toString(), param);
		$sentenceList.find("em").off("click").on("click", removeSentence);
		
		// 스크롤을 최신 항목에 맞추기
		$("tbody.tBaseCtnt", $mP).parents(".content:first").scrollTop($("tbody.tBaseCtnt", $mP).height());
	}
	
	function removeSentence() {
		var $this = $(this);
		var $parentTr = $this.parents("tr:first");
		var $trList = $("tbody.tBaseCtnt", $mP).find("tr");
		var currIndex = $parentTr.find("td:first").attr("idx");
		
		for(var i=0; i<$trList.length; i++) {
			var idx = $trList.eq(i).find("td:first").attr("idx");
			if(idx*1 > currIndex*1) {
				$trList.eq(i).find("td:first").html(idx-1);
				$trList.eq(i).find("td:first").attr("idx", idx-1);
			}
		}
		
		var _startPoint = $parentTr.find("input[name=startIndex]").val();
		var _endPoint = $parentTr.find("input[name=endIndex]").val();
		for(var i=_startPoint*1; i<_endPoint*1; i++) {
			var $that = $("span[si="+i+"]");
			$that.removeClass("bg-orange");
		}
		
		if(!$.isEmpty($parentTr.attr("ctxid"))) {
			$Object.removeItem($parentTr.attr("ctxId"), null);
		}
		
		$answerMap.delete($parentTr.attr("idx").toString());
		$parentTr.remove();
		
		var currSize = $("tbody.tBaseCtnt", $mP).find("tr[idx]").length;
		if(currSize == 0) {
			var param = { colspan: 3, message : "No item" };
			var emptyItempHtml = $.templates("#contentsEmptyTemplate").render(param);
			$("tbody.tBaseCtnt", $mP).html(emptyItempHtml);
		}
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
	
	return {
		init: init
	}
})();