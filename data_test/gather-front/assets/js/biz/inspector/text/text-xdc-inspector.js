var textXdcViewScript = (function() {
	var $mP;			// document object model
	var $Object;		// script object model
	var $UI;			// script object model
	var $voiceHandler;
	
	var defaultJobType = "XD";
	var maxContentCount = 20;
	
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
			expression: $(".tBaseCtnt", $mP)
		});
		
		bindEventHandler();
		getCurrentJob();
	}
	function bindEventHandler() {
		// about navi action
		$("button.btnNext", $mP).on("click", saveAndGotoNext);
		$("button.btnReject", $mP).on("click", rejectAndGotoNext);
	}
	
	/** FOR NAVIGATE **/
	function goPrevJob() {
	}
	function getCurrentJob() {
		$Object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		if(jobInfo.jobStatus == 'IM') {
			$.alert("This item has been disabled by '"+jobInfo.workerId+"'. Please check the reason and decide the inspection.")
		}
		$("textarea", $mP).html(jobInfo.rejectComment);
		$Object.getCurrentJobContext(displayContents, failCallback);
		$Object.selectCurrentContents(displaySubContents, failCallback);
	}
	function selectExpressionData() {
		$Object.selectData(expressionDataRender, failCallback);
	}
	function saveAndGotoNext() {
		$.confirm("Do you accept the inspection?", function() {
			$Object.requestComplete();	
		});
	}
	function requestComplete() {
		$Object.requestComplete();
	}
	function rejectAndGotoNext() {
		var rejectComment = $("textarea[name=comment]", $mP).val();
		$Object.requestReject(rejectComment);
	}
	function saveResult() {
		getCurrentJob();
	}
	
	/** DISPLAY RENDERING **/
	function displayContents(context) {
		clearDisplay();
		displayAudioPlayerMarkII(context);
		//displayAudioPlayer(context);
		//$Object.selectProjectCategorySubList(displayClassifyItems);		// 프로젝트 별 카테고리에 맞는 분별 항목을 가져온다.
	}
	/*function displayAudioPlayer(context) {
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
			$(".audio-resource", $mP).attr("src", blobUrl);			
			$voiceHandler.addEventListener('pause', function(e) { 
				$voiceHandler.playbackRate = 1.0;
				$("span.lblSpeed", $mP).html($voiceHandler.playbackRate);
			}, false);
		}
	}*/
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
		$answerMap = $UI.setExpressionList(renderData.contentList);
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
		var html = "<option value=''>== SELECT CLASS ==</option>";
		html += $.templates("#selectOptionOnlyTemplate").render(data);
		$("select[name=categoryType]", $mP).html(html);
	}
	
	/** 페이지 내 고유 작업 **/
	var identity = 1;	// 등록되지 않은 항목의 고유값
	/*function chooseSentenceEventHandler(contentId, param) {
		var currSize = $("tbody.tBaseCtnt", $mP).find("tr").length;
		
		if(currSize >= maxContentCount) {
			$.alert("Can't add anymore sentence.<br>(Max : "+maxContentCount+")");
			return;
		}

		param.idx = currSize+1;
		param.identity = identity++;
		param.inspect = true;
		var sentenceHtml = $.templates("#sentenceTemplate").render(param);
		var $sentenceList = $(".tBaseCtnt", $mP).append(sentenceHtml);
		
		$answerMap.set(param.identity.toString(), param);
		//$sentenceList.find("button:last").off("click").on("click", removeSentence);
		
		// 스크롤을 최신 항목에 맞추기
		$("tbody.tBaseCtnt", $mP).parents(".content:first").scrollTop($("tbody.tBaseCtnt", $mP).height());
	}*/
	
	/** LOCAL FUNCTION AND UI **/
	function failCallback(result) {
		console.log(result);
	}
	
	return {
		init: init
	}
})();