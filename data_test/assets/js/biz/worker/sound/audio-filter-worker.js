var audioFilterViewScript = (function() {
	var $mP;
	var mContextInfo;
	
	var $voiceHandler;
	var $object;
	
	var defaultJobType = "PF";
	var MAX_EXTRACT_CNT = 30;
	
	function init(projectId) {
		$mP = $("div.contents");
		$object = $mP.initVoiceProject({
			projectId: projectId,
			projectType: "S",
			jobType: defaultJobType,
			jobClassName: "filter",
			nextCallback: saveResult
		});
		
		bindEventHandler();
		getCurrentJob();
	}
	
	function bindEventHandler() {
		// about navi action
		$("button.btnPrev", $mP).on("click", goPrevJob);
		$("button.btnNext", $mP).on("click", saveAndGotoNext);
		$("button.btnHome", $mP).on("click", function() {
			$object.goHome("프로젝트 관리화면으로 이동합니다.<br>'OK'를 클릭하면 저장하지 않은 데이터는 사라집니다.<br>이동하시겠습니까?");
		});
		
		// about extract action
	}
	
	/** FOR NAVIAGTE **/
	function goPrevJob() {
	}
	function getCurrentJob() {
		$object.requestAssignJob(getContext, failCallback);
	}
	function getContext() {
		$object.getCurrentJobContext(displayContents, failCallback);		
	}
	function selectWorkData() {
		$object.selectData(dataRender, failCallback);
	}
	function clearWorkData() {
		$object.clearData(clearDisplay, failCallback);
	}
	function saveAndGotoNext() {
		$object.saveContentForWork($("form[name=form-work-data]", $mP), $object.requestInspectForWork);
	}
	function saveResult() {
		getCurrentJob();
	}
	
	/** FOR DISPLAY CONTENTS **/
	function displayContents(context) {
		clearDisplay();
		mContextInfo = context;
		$("span.orgFileName", $mP).html(mContextInfo.orgFileName);
		if($.isEmpty(mContextInfo.atchFile)) {
			$.alert("원본 데이터 파일을 불러오지 못했습니다.");
			return;
		}
		var blob = WaveJS.base64toBlob(mContextInfo.atchFile, "audio/x-wav");
		$voiceHandler = setVoicePlayer(WaveJS.RegionEventHandler);
		if($voiceHandler) {
			$voiceHandler.display(blob);
		}
		selectWorkData();
	}
	function dataRender(renderData) {
		// player에 region을 표시할 데이터가 있는 경우에만 실행
		$voiceHandler.displayScript(renderData);
		
		// To do: 작업한 내용을 화면에 표시한다. (표 데이터)
		
	}
	function clearDisplay() {
		// To do:여기에서 로컬 변수를 초기화 한다.

		
		if($voiceHandler) {		
			$voiceHandler.clearTimeStamp();
			$voiceHandler.seekTo(0);
			$("tbody.workInfo", $mP).html("");
		}
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
			, isCreatable: false
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