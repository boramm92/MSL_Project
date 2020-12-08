var audioListenViewScript = (function() {
	var $mP;
	var mContextInfo;
	
	var $voiceHandler;
	var $object;
	
	var defaultJobType = "LW";
	var jobClassName = "listen";
	
	function init(projectId) {
		$mP = $("div.contents");
		$object = $mP.initVoiceProject({
			projectId: projectId,
			projectType: "S",
			jobType: defaultJobType,
			jobClassName: jobClassName,
			nextCallback: saveResult
		});
		
		bindEventHandler();
		getCurrentJob();
	}
	
	function bindEventHandler() {
		$("button.btnNext", $mP).on("click", requestComplete);
		$("button.btnReject", $mP).on("click", requestReject);
		/*$("button.btnHome", $mP).on("click", function() {
			$object.goHome("프로젝트 관리화면으로 이동합니다.<br>'OK'를 클릭하면 저장하지 않은 데이터는 사라집니다.<br>이동하시겠습니까?");
		});*/
	}
	
	/** FOR NAVIGATE **/
	function goPrevJob() {
	}
	function getCurrentJob() {
		$("textarea[name=comment]", $mP).val("");
		$object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		checkStatus(jobInfo);
		$object.getCurrentJobContext(displayContents, failCallback);		
		$object.selectCurrentContents(displaySubContents, failCallback);
	}
	function selectWritenData() {
		$object.selectData(dataRender, failCallback);
	}
	function requestEvaluate() {
		$object.requestEvaluate($("form[name=form-check-data]", $mP));
	}
	function requestComplete() {
		$object.requestComplete();
	}
	function requestReject() {
		var rejectComment = $("textarea[name=comment]", $mP).val();
		$object.requestReject(rejectComment);
	}
	function saveResult() {
		getCurrentJob();
	}
	
	/** FOR DISPLAY CONTENTS **/
	function checkStatus(jobInfo) {
		// 작업불가 체크
		if(jobInfo.jobStatus == 'IM') {
			var rejectCommentHtml = $.templates("#commentBoxTemplate").render(
				{title: "Reasons for Impossible", comment: jobInfo.comment});
			$("div.faild_box", $mP).html(rejectCommentHtml).show();
			$.alert("작업자 '"+jobInfo.workerId + "'님이 작업불가로 지정한 항목입니다. 사유를 확인 후 검수를 결정해 주세요.");
		} else {
			$("div.faild_box", $mP).hide();
		}
		// 반려사유 체크
		var rejectCommentHtml = $.templates("#commentBoxTemplate").render(
			{writeMode:true, comment: jobInfo.rejectComment});
		var $rejectBox = $("div.reject_box", $mP).html(rejectCommentHtml).show();

		// 작업 진행 상황
		var processHtml = $.templates("#progressTemplate").render(jobInfo.processState);
		$("div.progress_cases", $mP).html(processHtml);
	}
	function displayContents(context) {
		// 0. 화면 표시 데이터를 초기화한다.
		clearDisplay();
		// 1. context info를 local에 임시 저장한다.
		mContextInfo = context;
		// 2. JOB과 PROJECT에 관한 정보를 불러온다.
		$("span.orgFileName", $mP).html(mContextInfo.orgFileName);
		// 3. 음성 플레이어에 표시할 음성파일과 파형데이터를 가져온다.
		if($.isEmpty(mContextInfo.atchFile)) {
			//$.alert("원본 데이터 파일을 불러오지 못했습니다.");
			//return;
		}
		var blob = WaveJS.base64toBlob(mContextInfo.atchFile, "audio/x-wav");
		// 4. 음성 플레이어를 초기화 시키고
		// $voiceHandler = setVoicePlayer(WaveJS.RegionEventHandler);
		// // 4-1. 3의 데이터를 랜더링한다.
		// if($voiceHandler) {
		// 	$voiceHandler.display(blob);
		// }
		var $audioUI = $("div.audiobox", $mP).regAudioPlayer();
		if($audioUI != null) {
			// $voiceHandler = $audioUI.find("audio").get(0);

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
		selectWritenData();
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
		// player에 region을 표시할 데이터가 있는 경우에만 실행
		if(renderData != null && renderData.workData != null && renderData.workData.length > 0) {
			$("textarea[name=context]", $mP).html(renderData.workData[0].context);
		} else {
			$("textarea[name=context]", $mP).html("");
		}
	}
	function clearDisplay() {
		// To do:여기에서 로컬 변수를 초기화 한다.
		if(!$.isEmptyObject($voiceHandler)) {
			$voiceHandler.clearTimeStamp();
			$voiceHandler.seekTo(0);
		}
		$("tbody.workInfo", $mP).html("");
	}
	
	/** LOCAL AUDIO PLAYER **/
	function setVoicePlayer(regionHandler) {
		// form 초기화
		$("#waveform", $mP).html("");
		// player handler 작성
		var voiceHandler = $("#waveform", $mP).regWavePlayer({
			timeliner: "#wave-timeline"
			, controller: 'div.button_box'	// player를 제어하는 버튼 elements
			, isMinimap: false
			, isRegion: true
			, waveHeight: 51
			, regionHandler: regionHandler		// 플레이어 region 에 대한 이벤트 핸들러를 연결한다.
		});
		return voiceHandler;
	}

	function failCallback(result) {
		console.log(result);
	}
	
	return {
		init: init
	}
})();