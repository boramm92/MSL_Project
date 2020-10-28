// 프로젝트 타입에 맞게 class명 지정
// view 파일(jsp)에서 init할 때 사용하는 클래스 명
var audio_XXXXXXXX_ScriptView = (function() {
	// 전역변수 (화면오브젝트관련)
	var $mP;			// 화면 Dom 객체 Selecting 할 때 한정하기 위해
	var mContextInfo;	// 메인 콘텐츠

	var $voiceHandler;	// 음성 웨이브 박스 Object
	var $object;		// 작업에 대한 액션을 하기위한 Interface 객체

	var defaultJobType = "";
	var jobClassName = "";

	// 전역변수 (데이터관련)


	// 공통 함수
	function init(projectId) {
		$mP = $("div.contents");
		$object = $mP.initVoiceProject({
			projectId: projectId,
			projectType: "S",
			jobType: defaultJobType,
			jobClassName: jobClassName,
			nextCallback: saveResult			// ajax 호출 후에 실행할 함수 지정
		});

		bindEventHandler();
		getCurrentJob();
	}

	function bindEventHandler() {
		$("button.btnNext", $mP).on("click", requestComplete);		// 검수요청
		$("button.btnReject", $mP).on("click", requestReject);		// 반려요청
	}

	function getCurrentJob() {
		$object.requestAssignJob(getContext, failCallback);
	}

	// 작업에 할당된 콘텐츠 가져오기
	function getContext() {
		$object.getCurrentJobContext(displayContents, failCallback);		// 주 콘텐츠 가져오기
		$object.selectCurrentContents(displaySubContents, failCallback);	// 보조 콘텐츠 가져오기
	}

	// 작업자의 작업 데이터 가져오기
	function selectWorkData() {
		$object.selectData(dataRender, failCallback);
	}

	// 검수완료요청
	function requestComplete() {
		$object.requestEvaluate($("form[name=form-work-data]", $mP));
	}

	// 반려요청
	function requestReject() {
		var rejectComment = $("textarea.rejectText", $mP).val();
		$object.requestReject(rejectComment);
	}

	function saveResult() {
		getCurrentJob();
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
			, isCreatable: true
			, waveHeight: 51
			, regionHandler: regionHandler		// 플레이어 region 에 대한 이벤트 핸들러를 연결한다.
			, action: {
				create: createdRegion
			}
		});
		return voiceHandler;
	}

	function createdRegion(region) {
		// 여기에 WAVE Region 이 생성 됐을때 변화되는 화면 내용 구현
		console.log(region);
	}

	/** FOR DISPLAY CONTENTS **/
	function displayContents(context) {
		// 0. 화면을 클리어 한다.
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
		// 4. 음성 플레이어를 초기화 시키고
		$voiceHandler = setVoicePlayer(WaveJS.RegionEventHandler);
		var blob = WaveJS.base64toBlob(mContextInfo.atchFile, "audio/x-wav");
		// 4-1. 3의 데이터를 랜더링한다.
		if($voiceHandler) {
			$voiceHandler.display(blob);
		}
		selectWorkData();
	}

	function displaySubContents(contents) {
		// 여기에 보조 콘텐츠 그려주는 내용 구현
	}

	// 임시저장 데이터 화면에 그려주기
	function dataRender(renderData) {
		// 여기에 작업자 작업 내용 그려주는 내용 구현
	}

	function clearDisplay() {
		// 여기에 새로운 작업 데이터를 가져오기 전에 화면을 깨끗이 한다.
	}

	function failCallback(result) {
		console.log(result);
	}

	return {
		init: init
	}
})();