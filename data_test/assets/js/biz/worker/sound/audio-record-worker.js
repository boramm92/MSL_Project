var audioRecordViewScript = (function() {
	var $mP;
	var mContextInfo;
	
	var $recordHandler;
	var $object;

	var defaultJobType = "RS";
	
	function init(projectId) {
		$mP = $("div.contents");
		$object = $mP.initVoiceProject({
			projectId: projectId,
			projectType: "S",
			jobType: defaultJobType,
			jobClassName: "record",
			nextCallback: uploadResult
		});
		
		bindEventHandler();
		getCurrentJob();
	}
	
	function bindEventHandler () {
		// for navi
		$("button.btnNext", $mP).on("click", saveAndGotoNext);
		$("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);
		$("button.go_workspace", $mP).on("click", goBack);
	}

	/** FOR NAVIAGTE **/
	function goPrevJob() {
	}
	function getCurrentJob() {
		$object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		// if(jobInfo.jobStatus == 'RJ') {
		// 	var param = {title: "Reasons for Reject", comment: jobInfo.rejectComment};
		// 	var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
		// 	$("div.reject_box", $mP).html(rejectCommentHtml).show();
		// 	$.alert("This context returned by inspector. Please check reason for correction.", null, "Alert");
		// } else {
		// 	$("div.reject_box", $mP).hide();
		// }
		$object.getCurrentJobContext(displayContents, failCallback);		
	}
	function selectWorkData() {
		$object.selectData(dataRender, failCallback);
	}
	function clearWorkData() {
		$object.clearData(clearDisplay, failCallback);
	}
	function saveResult() {
		getCurrentJob();
	}
	// 음성녹음의 경우 별도 처리 (일반 로직과 다르다)
	function saveAndGotoNext() {
		var message = "";

		if(!$.isEmpty($recordHandler.getAudioBlob())) {
			message = "It is recommended to transfer in a WI-FI environment.<br>Do you want to transfer your file and do the next?";
			if(!$recordHandler.isChecked()) {
				$.alert("Please review the recorded content and send it.");
				return;
			}
		} else {
			$.alert("There is no recorded content.");
			return;
		}
		$.confirm(message
			, function() {
				var param = {
					file : $recordHandler.getAudioBlob(),
					jobId : mContextInfo.jobId,
					contextId : mContextInfo.contextId
				};
				$object.uploadAttachFileForWork(param);
			}
			, null
			, "Send"
		);
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
	function uploadResult() {
		getCurrentJob();
	}
	
	function displayContents(context) {
		mContextInfo = context;
		if(mContextInfo != null) {
			//$("span.workCtx", $mP).html(mContextInfo.context);
			$("div.script_box .textarea", $mP).html(mContextInfo.context);
		} else {
			// 작업할 콘텍스트가 없을 경우 화면처리
			$("div.script_box .textarea", $mP).html("");
			$.alert("The project is complete.", function() { history.back(); });   //  -> 프로젝트 선택화면으로 이동
		}
		getUserMedia();
	}
	function getUserMedia() {
		var settings = {
			mimeType: "audio/webm\;codecs=opus",
			fileType: "audio/wav\;codecs=opus"
		};
		$recordHandler = $("div.recorder_box", $mP).regRecorder(settings);
	}
	
	function failCallback(result) {
		console.log(result);
	}

	// utility
	function goBack() {
		$.confirm("Do you want to stop the work and go to the main screen?", function() {
			history.back();
		}, null, "Exit")	;
	}
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();