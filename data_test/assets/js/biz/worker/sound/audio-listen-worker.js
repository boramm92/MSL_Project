var audioListenViewScript = (function() {
	var $mP;
	var mContextInfo;
	
	var $voiceHandler;
	var $object;
	
	var defaultJobType = "LW";
	var className = "listen";

	var mIsTemporaryData = false;
	
	function init(projectId) {
		$mP = $("div.contents");
		$object = $mP.initVoiceProject({
			projectId: projectId,
			projectType: "S",
			jobType: defaultJobType,
			jobClassName: className,
			nextCallback: saveResult
		});
		
		bindEventHandler();
		getCurrentJob();
	}
	
	function bindEventHandler() {
		// about navi action
		$("button.btnNext", $mP).on("click", saveAndGotoNext);
		$("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);

		// about extract action
		$("button.btnClear", $mP).on("click", clearScript);
		// 임시저장
		$("button.btnSave", $mP).on("click", saveScript);
		// 속도 조절
		$("button.slow", $mP).on("click", slowly);
		$("button.normal", $mP).on("click", normal);
		$("button.fast", $mP).on("click", fast);
		
		$("textarea[name=context]", $mP).on("change", fillTemporaryData);
	}

	function slowly() {
		$voiceHandler.slowly();
	}
	function normal() {
		$voiceHandler.normalSpeed();
	}
	function fast() {
		$voiceHandler.fastest();
	}
	
	/** FOR NAVIAGTE **/
	function goPrevJob() {
	}
	function getCurrentJob() {
		$object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		$("textarea[name=context]", $mP).val("");
		// if(jobInfo.jobStatus == 'RJ') {
		// 	var param = {title: "Reasons for Reject", comment: jobInfo.rejectComment};
		// 	var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
		// 	$("div.reject_box", $mP).html(rejectCommentHtml).show();
		// 	$.alert("This context returned by inspector. Please check reason for correction.", null, "Alert");
		// } else {
		// 	$("div.reject_box", $mP).hide();
		// }
		$object.getCurrentJobContext(displayContents, failCallback);	
		$object.selectCurrentContents(displaySubContents, failCallback);	
		
		// contents 를 새로 로드했을 때 isTemporary data = false
		emptyTemporaryData();
	}
	function selectWorkData() {
		$object.selectData(dataRender, failCallback);
	}
	function clearScript() {
		//$object.clearData(clearDisplay, failCallback);
		clearDisplay();
		fillTemporaryData();
	}
	function saveAndGotoNext() {
		$object.saveContentForWork($("form[name=form-work-data]", $mP), $object.requestInspectForWork);
	}
	function ignoreAndGotoNext() {
		var labelList = [
			{label:"Comment :", lbl_type:"text", name:"comment", lbl_ph:"작업불가 사유를 입력해 주세요." }
		];
		$.commentAll(
			"작업불가 사유를 입력하면 작업불가 항목으로 지정됩니다.<br>작업불가 항목으로 지정하시겠습니까?"	// messages
			, function(data) {
				$object.requestIgnoreForWork(data.comment);
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
	function saveScript(bViewMessage) {
		var $this = $(this);
		if($this.hasClass("active")) {
			$object.saveContentForWork($("form[name=form-work-data]", $mP), function () {
				emptyTemporaryData();
				if (bViewMessage) {
					$.alert("작업한 내용이 임시저장 됐습니다.", selectWorkData);
				} else {
					selectWorkData();
				}
			});
		}
	}
	
	/** FOR DISPLAY CONTENTS **/
	function displayContents(context) {
		clearDisplay();
		mContextInfo = context;

		if($.isEmpty(mContextInfo.atchFile)) {
			// $.alert("원본 데이터 파일을 불러오지 못했습니다.");
			// return;
		}
		// var blob = WaveJS.base64toBlob(mContextInfo.atchFile, "audio/x-wav");
		// $voiceHandler = setVoicePlayer(WaveJS.RegionEventHandler);
		// if($voiceHandler) {
		// 	$voiceHandler.display(blob);
		// }
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
		selectWorkData();
	}
	function displaySubContents(contents) {
		var contentsHtml = "";
		if(contents != null && contents.length > 0) {
			contentsHtml = $.templates("#voiceBaseContents").render(contents);
		} else {
			var emptyParam = { colspan : 2, message : "" };
			contentsHtml = $.templates("#listEmptyTemplate").render(emptyParam);
		}
		$("div.script_list ul", $mP).html(contentsHtml);	
	}
	function dataRender(renderData) {
		// To do: 미리 작성한 작업을 화면에 표시한다.
		/*var contentsHtml = "";
		if(renderData != null && renderData.workData != null && renderData.workData.length > 0) {
			renderData.workData.editYn = 'N';
			contentsHtml = $.templates("#voiceWriteTemplate").render(renderData.workData);
			contentsHtml += $.templates("#voiceWriteTemplate").render({editYn: 'Y'});
			
		} else {
			var emptyData = {};
			emptyData.editYn = 'Y';
			contentsHtml = $.templates("#voiceWriteTemplate").render(emptyData);
		}
		
		$("textarea.context", $mP).text(contentsHtml);*/
		
		if(renderData.workData != null && renderData.workData.length > 0) {
			$("textarea[name=context]", $mP).val(renderData.workData[0].context);
			$("input[name=contextId]", $mP).val(renderData.workData[0].contextId);
		} else {
			$("textarea[name=context]", $mP).val("");
			$("input[name=contextId]", $mP).val("");
		}
		
		// 반려사유
		if(renderData.rejectComment != null) {
			$("textarea[name=comment]", $mP).html(renderData.rejectComment);
		}
	}
	function clearDisplay() {
		// To do:여기에서 로컬 변수를 초기화 한다.
		// if($voiceHandler) {
		// 	$voiceHandler.clearTimeStamp();
		// 	$voiceHandler.seekTo(0);
		// }
		//$("textarea[name=context]", $mP).val("");
	}
	
	/** LOCAL AUDIO PLAYER **/
	function setVoicePlayer(regionHandler) {
		$("#waveform", $mP).html("");
		// player handler 작성
		var voiceHandler = $("#waveform", $mP).regWavePlayer({
			timeliner: "#wave-timeline"
			, controller: 'div.button_box'	// player를 제어하는 버튼 elements
			, isMinimap: false
			, isRegion: true
			, waveHeight: 51
			, isCreatable: false
			, regionHandler: regionHandler		// 플레이어 region 에 대한 이벤트 핸들러를 연결한다.
		});
		return voiceHandler;
	}
	
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