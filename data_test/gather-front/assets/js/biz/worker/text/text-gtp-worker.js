var textQuestionViewScript = (function() {
	var $mP;		// document object model
	var $Object;	// script object model
	var $UI;		// document ui
	
	var defaultJobType = "GP";
	var jobClassName = "gtp";

	var mIsTemporaryData = false;

	var $answerMap = new Map();
	var identity = 1;

	function init(projectId) {
		$mP = $("div.contents");
		$Object = $mP.initTextProject({
			projectId: projectId,
			projectType: "T",
			jobType: defaultJobType,
			jobClassName: jobClassName,
			nextCallback: saveResult
		});
		$UI = $mP.regContextUi({
			getValue: chooseSentenceEventHandler
			,expression: $("tbody.tBaseCtnt", $mP)
			// ,limit: 1
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
		$("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);
		$("button.btnSave", $mP).on("click", saveFixedData);			// 임시저장

		// 고유 액션 버튼
	}
	
	/** FOR NAVIGATE **/
	function goPrevJob() {
	}
	function getCurrentJob() {
		$Object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		// 1.화면의 내용을 지우고
		clearDisplay();
		// 2. Reject 이면 메시지 표시
		if(jobInfo.jobStatus == 'RJ') {
			var param = {title: "Reasons for reject", comment: jobInfo.rejectComment};
			var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
			$("div.reject_box", $mP).html(rejectCommentHtml);
			$.alert("This context returned by inspector. Please check reason for correction.", null, "Alert");
		}
		// 3.새로운 컨텐츠 화면에 적용하기
		$Object.getCurrentJobContext(displayContents, failCallback);
		$Object.selectCurrentContents(displaySubContents, failCallback);

		// contents 를 새로 로드했을 때 isTemporary data = false
		emptyTemporaryData();
	}
	function selectG2PData() {
		$Object.selectData(fixedDataRender, failCallback);
	}
	function saveAndGotoNext() {
		if(validateEditData()) {
			$.confirm("작업한 내용을 저장하고 검수요청 하시겠습니까?", function() {
				var param = $("form[name=work-data]", $mP).formJson();
				$Object.saveContentForWorkForGTP(param, $Object.requestInspectForWork);
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
	// Temporary Svae
	function saveFixedData(bViewMessage) {
		if($(this).hasClass("active")) {
			emptyTemporaryData();
			var param = $("form[name=work-data]", $mP).formJson();
			$Object.saveContentForWorkForGTP(param, function () {
				if (bViewMessage) {
					$.alert("작업한 내용이 임시저장 됐습니다.", selectG2PData);
				} else {
					selectG2PData();
				}
			});
		}
	}
	// 수정된 문장 길이 체크
	function validateEditData() {
		$("input[name=sentence]").css("border-color", "#cfd5eb");
		if($answerMap != null) {
			var invalidCount = 0;
			$answerMap.forEach(function(data) {
				var size = data.reserve2 - data.reserve1;
				var $itemObject = $("form[name=work-data]", $mP).find("tr[idx="+data.identity+"]").find("select[name=sentence]");
			});
			if(invalidCount > 0) {
				$.alert("수정할 글자수를 맞춰주세요. (띄어쓰기 주의)");
			} else {
				return true;
			}
		} else {
			return true;
		}
		return false;
	}

	function displayContents(context) {
		if(context.orgFileName != null) {
			$("span.fileName", $mP).text(context.orgFileName);
			displayAudioPlayerMarkII(context);
		}
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
		$UI.setArticle(TextJS.parseContext(contents.genText));
		$("div.original_article", $mP).html(contents.context);
		selectG2PData();
	}
	function fixedDataRender(renderData) {
		if($UI != null && renderData != null) {
			$answerMap = $UI.setFixedList(renderData.contentList, removeSentence);
			identity += renderData.contentList.length;
		}
	}
	function clearDisplay() {
		$answerMap = new Map();
		identity = 1;
		if(typeof $UI != 'undefined') {
			$UI.clearAnswer();
		}

	}
	
	/** 페이지 내 고유 작업 **/
	function chooseSentenceEventHandler(contentId, param) {
		var currSize = $("tbody.tBaseCtnt", $mP).find("tr[idx]").length;

		var ctxJungCode = ((param.context.charCodeAt(0) - 44032) / 28) % 21;
		// if(ctxJungCode == 19) {			// 'ㅢ'의 모음(중성)코드는 19
		// 	fillTemporaryData();
		//
		// 	param.idx = currSize + 1;
		// 	param.identity = identity++;
		//
		// 	var data = [];
		// 	var jungStr = ['에', '이', '의', '으'];
		// 	var choCode = parseInt(((param.context.charCodeAt(0) - 44032) / 28) / 21);
		// 	if(choCode > -1) {
		// 		for(var i = 0; i<jungStr.length; i++) {
		// 			var jungCode = ((jungStr[i].charCodeAt(0) - 44032) / 28) % 21;
		// 			var result = String.fromCharCode(44032+(choCode*588)+(jungCode*28));
		// 			data.push({name:result});
		// 		}
		// 	}
		// 	param.recomm = data;
		// } else {
		// 	// 선택하면 안됨
		// 	$(".parsed_article").find("span[si="+param.reserve1+"]").removeClass("pupple");
		// 	return;
		// }
		fillTemporaryData();

		param.idx = currSize + 1;
		param.identity = identity++;

		var sentenceHtml = $.templates("#gtpRadioSentenceTemplate").render(param);
		var $sentenceList;
		if(currSize == 0) {
			$sentenceList = $(".tBaseCtnt", $mP).html(sentenceHtml);
		} else {
			$sentenceList = $(".tBaseCtnt", $mP).append(sentenceHtml);
		}

		$answerMap.set(param.identity.toString(), param);
		$sentenceList.find("em.fa-window-close").off("click").on("click", removeSentence);
		$sentenceList.find("input").on("change", fillTemporaryData);

		// 스크롤을 최신 항목에 맞추기
		$("tbody.tBaseCtnt", $mP).parents(".content:first").scrollTop($("tbody.tBaseCtnt", $mP).height());
		$(".parsed_article").find("span[si="+param.reserve1+"] em").text(param.identity);
	}
	function removeSentence() {
		var $this = $(this);
		var $parentTr = $this.parents("tr:first");
		// var $trList = $("tbody.tBaseCtnt", $mP).find("tr");
		// var currIndex = $parentTr.find("td:first").attr("idx");

		/*for(var i=0; i<$trList.length; i++) {
			var idx = $trList.eq(i).find("td:first").attr("idx");
			if(idx*1 > currIndex*1) {
				$trList.eq(i).find("td:first").html(idx-1);
				$trList.eq(i).find("td:first").attr("idx", idx-1);
			}
		}*/

		var _startPoint = $parentTr.find("input[name=startIndex]").val();
		var _endPoint = $parentTr.find("input[name=endIndex]").val();
		for(var i=_startPoint*1; i<_endPoint*1; i++) {
			var $that = $(".parsed_article span[si="+i+"]");
			$that.removeClass("pupple");
			$that.find("em").html("");
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