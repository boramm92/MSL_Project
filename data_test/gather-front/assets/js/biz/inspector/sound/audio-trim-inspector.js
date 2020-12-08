var audioTrimViewScript = (function() {
	var $mP;
	var mContextInfo;
	
	var $voiceHandler;
	var $object;
	
	var defaultJobType = "TS";
	var jobClassName = "trim";
	
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
		$("button.btnComp", $mP).on("click", requestComplete);
		$("button.btnReject", $mP).on("click", requestReject);
		$("button.btnHome", $mP).on("click", function() {
			$object.goHome("프로젝트 관리화면으로 이동합니다.<br>'OK'를 클릭하면 저장하지 않은 데이터는 사라집니다.<br>이동하시겠습니까?");
		});
	}
	
	/** FOR NAVIGATE **/
	function goPrevJob() {
	}
	function getCurrentJob() {
		$object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobStatus) {
		if(jobStatus == 'IM') {
			$("button.jobStatus", $mP).css("display", "block");
		} else {
			$("button.jobStatus", $mP).remove();
		}
		$object.getCurrentJobContext(displayContents, failCallback);		
	}
	function selectTrimData() {
		$object.selectData(trimDataRender, failCallback);
	}
	function requestEvaluate() {
		$object.requestEvaluate($("form[name=form-check-data]", $mP));
	}
	function requestComplete() {
		// standard job id 를 전달할 방법 필요
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
	function displayContents(context) {
		// 0. 화면 표시 데이터를 초기화한다.
		clearDisplay();
		// 1. context info를 local에 임시 저장한다.
		mContextInfo = context;
		// 2. JOB과 PROJECT에 관한 정보를 불러온다.
		$("span.orgFileName", $mP).html(mContextInfo.orgFileName);
		// 3. 음성 플레이어에 표시할 음성파일과 파형데이터를 가져온다.
		if($.isEmpty(mContextInfo.atchFile)) {
			$.alert("원본 데이터 파일을 불러오지 못했습니다.");
			return;
		}
		var blob = WaveJS.base64toBlob(mContextInfo.atchFile, "audio/x-wav");
		// 4. 음성 플레이어를 초기화 시키고
		$voiceHandler = setVoicePlayer(WaveJS.RegionEventHandler);
		// 4-1. 3의 데이터를 랜더링한다.
		$voiceHandler.display(blob);
		
		selectTrimData();
	}
	
	function trimDataRender(renderData) {
		$voiceHandler.displayScript(renderData.workData);
		
		// To do: 검수요청 된 데이터를 화면에 표시한다. (표 데이터)
		// trim 데이터는 rendering 할 내용이 없다.
		
		// 반려사유
		if(renderData.rejectComment != null) {
			$("textarea[name=comment]", $mP).val(renderData.rejectComment);
		}
	}
	
	/** LOCAL AUDIO PLAYER **/
	function setVoicePlayer(regionHandler) {
		// form 초기화
		$("#waveform", $mP).html("");
		// player handler 작성
		var voiceHandler = $("#waveform", $mP).regWavePlayer({
			timeliner: "#wave-timeline"
			, controller: 'div.btnArea'	// player를 제어하는 버튼 elements
			, isMinimap: false
			, isRegion: true
			, regionHandler: regionHandler		// 플레이어 region 에 대한 이벤트 핸들러를 연결한다.
		});
		return voiceHandler;
	}
	function clearDisplay() {
		// To do:여기에서 로컬 변수를 초기화 한다.
		
		if($voiceHandler) {
			$voiceHandler.clearTimeStamp();
			$voiceHandler.seekTo(0);
			$("tbody.workInfo", $mP).html("");
		}
		$("textarea[name=comment]", $mP).val("");
	}

	function failCallback(result) {
		console.log(result);
	}
	
	return {
		init: init
	}
})();