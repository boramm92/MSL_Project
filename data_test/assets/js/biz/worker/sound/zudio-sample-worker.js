// 프로젝트 타입에 맞게 class명 지정
// view 파일(jsp)에서 init할 때 사용하는 클래스 명
var audio_xxxxx_ScriptView = (function() {
	var $mP;		// document object model
	var $Object;	// script object model
	var $UI;		// document ui

	var mContextInfo;		// Main Contents

	var projectType = "P";					// Sound:S, Text:T, Image:P, Video:V
	var defaultJobType = "IS";			 			// xxxJobTypeEnum.java 참고
	var jobClassName = "segmentation";		// 쌍으로 생성할 jsp 파일 id, file name format : audio-{jobClassName}-worker.jsp

	// UI Option
	var $voiceHandler;		// 음성 콘트롤러 객체

	// 전역변수 (데이터관련)

	// 전역상수 (Option)

	////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////* 공통 함수 *////////////////////////////////
	////////////////////////////////////////////////////////////////////////////
	function init() {
		$mP = $("div.contents");
		$Object = $mP.initImageProject({
			projectId: gProjectId,
			projectType: projectType,
			jobType: defaultJobType,
			jobClassName: jobClassName,
			nextCallback: saveResult
		});

		bindEventHandler();
		getCurrentJob();
	}

	function bindEventHandler() {
		// about navi action
		$("button.btnNext", $mP).on("click", saveAndGotoNext);
		$("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);

		// save data
		$("button.btnSave", $mP).on("click", saveAnnotation);

		// about specific action
	}

	/** FOR NAVIAGTE **/
	function goPrevJob() {
	}
	function getCurrentJob() {
		$Object.requestAssignJob(getContext, failCallback);
	}
	function getContext() {
		$Object.getCurrentJobContext(displayContents, failCallback);
	}
	function selectWorkData() {
		$Object.selectData(dataRender, failCallback);
	}
	function clearWorkData() {
		$Object.clearData(clearDisplay, failCallback);
	}
	function removeItem(contextId) {
		!$.isEmpty(contextId) ? $Object.removeItem(contextId) : null;
	}
	function saveAnnotation(bViewMessage) {
		var $this = $(this);
		if($this.hasClass("active")) {
			$Object.saveContentForWork($("form[name=form-work-data]", $mP)
				, function() {
					$this.removeClass("active");
					if(bViewMessage) {
						$.alert("작업한 내용이 임시저장 됐습니다.", selectWorkData);
					} else {
						selectWorkData();
					}
				}
			);
		}
	}
	function saveAndGotoNext() {
		$Object.saveContentForWork($("form[name=form-work-data]", $mP), $Object.requestInspectForWork);
	}
	function ignoreAndGotoNext() {
		$.commentAll(
			"작업불가 사유를 입력하면 작업불가 항목으로 지정됩니다.<br>작업불가 항목으로 지정하시겠습니까?"	// messages
			, function(data) {
				$Object.requestIgnoreForWork(data.comment);
			}					// ok Function
			, null				// cancel Function
			, "작업불가 지정"		// Title
			, "작업불가"				// OK Title
			, "취소"				// Cancel Title
			, [{label:"Comment :", lbl_type:"text", name:"comment", lbl_ph:"작업불가 사유를 입력해 주세요." }]			// label list
		);
	}
	// 작업내용을 저장 한 후에 자동으로 실행할 함수 (변경이 필요하면 함수 내에 구현, 함수명은 변경하지 마세요.)
	function saveResult() {
		getCurrentJob();
	}

	/** FOR DISPLAY CONTENTS **/
	function displayContents(context) {
		// 0. 화면 표시 데이터를 초기화한다.
		clearDisplay();
		// 1. context info를 local에 임시저장한다.
		mContextInfo = context;
		// 2. JOB과 PROJECT에 관한 정보를 입력한다.
		$("span.orgFileName", $mP).html(mContextInfo.orgFileName);
		// 3. 음성 플레이어에 표시할 음성파일과 파형 데이터를 가져온다.
		if($.isEmptyObject(mContextInfo.atchFile)) {
			$.alert("원본 데이터 파일을 불러오지 못했습니다.");
			return;
		}
		// Media 파일을 콘트롤러에 표시한다
		var blob = WaveJS.base64toBlob(mContextInfo.atchFile, "audio/x-wav");
		// 4. 음성 플레이어를 초기화 하고
		$voiceHandler = setVoicePlayer(WaveJS.RegionEventHandler);
		// 4-1. 3의 데이터를 랜더링한다.
		if($voiceHandler) {
			$voiceHandler.display(blob);
		}
		selectWorkData();
	}

	/** TO DO : **/
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
			, controller: 'div.btnArea'	// player를 제어하는 버튼 elements
			, isMinimap: false
			, isRegion: true
			, isCreatable: true
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