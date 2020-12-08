var audioExtractViewScript = (function() {
	var $mP;
	var mContextInfo;
	
	var $voiceHandler;
	var $object;
	
	var defaultJobType = "EX";
	var jobClassName = "extract";
	
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
		$("button.btnPrev", $mP).on("click", goPrevJob);
		$("button.btnNext", $mP).on("click", saveAndGotoNext);
		$("button.btnHome", $mP).on("click", function() {
			$object.goHome("프로젝트 관리화면으로 이동합니다.<br>'OK'를 클릭하면 저장하지 않은 데이터는 사라집니다.<br>이동하시겠습니까?");
		});
		$("button.btnSave", $mP).on("click", requestEvaluate);

		// about extract action
	}
	
	/** FOR NAVIGATE **/
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
	function requestEvaluate() {
		$object.requestEvaluate($("form[name=form-check-data]", $mP));
	}
	function requestComplete() {
		$object.requestComplete();
	}
	function requestReject() {
		// 반려사유 입력을 추가
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
		if($voiceHandler) {
			$voiceHandler.display(blob);
		}
		
		selectWorkData();
	}
	
	function dataRender(renderData) {
		// player에 region을 표시할 데이터가 있는 경우에만 실행
		$voiceHandler.displayScript(renderData);
		
		// To do: 검수요청 된 데이터를 화면에 표시한다. (표 데이터)
		var $voiceItems;
		if(renderData == null) { return; }
		renderData.forEach(function (item, index, array) {
			item.index = index;
			var html = $.templates("#voiceSplitIndex").render(item);
			$voiceItems = $("tbody.workInfo", $mP).append(html);
		});
		if($voiceItems != null) {
			// 승인 버튼 클릭시
			$voiceItems.find("button.btnConfirm").on("click", function() {
				var contextId = $(this).parents("tr:first").attr("contextId");
				$(this).siblings("input[name=eval]").val("CM");
				$(this).css("background", "#FFCC01");
				$(this).siblings("button.btnCheck").css("background", "#007eff");
				checkConfirmCount();
			});
			// 반려버튼 클릭시
			$voiceItems.find("button.btnCheck").on("click", function() {
				var contextId = $(this).parents("tr:first").attr("contextId");
				$(this).siblings("input[name=eval]").val("RJ");
				$(this).css("background", "#FFCC01");
				$(this).siblings("button.btnConfirm").css("background", "#007eff");
				checkConfirmCount();
			});
			$voiceItems.find("button.btnPlay").on("click", function() {
				var start = $(this).parents("tr:first").find("input[name=start]").val();
				var end = $(this).parents("tr:first").find("input[name=end]").val();
				$voiceHandler.play(start, end);
			});
			$voiceItems.find("button.btnPause").on("click", function() {
				$voiceHandler.play();
				var contextId = $(this).parents("tr:first").attr("contextId");
			});
		}
	}
	function clearDisplay() {
		// To do:여기에서 로컬 변수를 초기화 한다.
		
		if($voiceHandler) {
			$voiceHandler.clearTimeStamp();
			$voiceHandler.seekTo(0);
			$("tbody.workInfo", $mP).html("");
		}

		// 버튼 초기화
		$("button.btnSave", $mP).css("background", "#007EFF");
		$("button.btnSave", $mP).html("승인");
		$("textarea[name=comment]", $mP).val("");
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

	function failCallback(result) {
		console.log(result);
	}
	
	/**
	 * UTILITY
	 */
	function checkConfirmCount() {
		var rejectCount = $("input[name=eval]:input[value=RJ]", $mP).length;
		var color = "", text = "";
		
		var checkIndex = "";
		$("input[name=eval]:input[value=RJ]", $mP).each(function(index, item, array) {
			var index = $(this).parents("tr:first").attr("index");	
			checkIndex += index + "열 ";
		});
		
		if(rejectCount > 0) {
			color = "#FFCC01";
			text = "반려";
			$("textarea[name=comment]", $mP).val(checkIndex+"를 이유로 반려합니다.");
		} else {
			color = "#007eff";
			text = "승인";
			$("textarea[name=comment]", $mP).val("정상 승인합니다.");
		}
		$("button.btnSave", $mP).css("background", color);
		$("button.btnSave", $mP).html(text);
	}
	
	return {
		init: init
	}
})();