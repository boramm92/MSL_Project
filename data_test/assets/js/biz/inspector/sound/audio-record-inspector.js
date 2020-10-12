var audioRecordViewScript = (function() {
	var $mP;
	var mProjectId;
	var mWorkInfo;
	
	var $voiceHandler;
	var $workVoiceHandler;
	
	var defaultJobType = "RS";
	
	var requestApi = {
		getCurrentJob: "/biz/sound/getCurrentJob.json",
		getContents: "/biz/sound/record/getContents.json",
		rejectJob: "/biz/sound/record/rejectJob.json",			// Record Type 예외 interface
		confirmJob: "/biz/sound/record/confirmJob.json"	// Record Type 예외 interface
	};
	
	function init(projectId) {
		$mP = $("div.contents");
		mProjectId = projectId;
		
		bindEventHandler();
		getCurrentJob();
	}
	function bindEventHandler() {
		$("button.btnComp", $mP).on("click", requestComplete);
		$("button.btnReject", $mP).on("click", requestReject);
	}
	
	/**
	 * 현재 JOB에 BASE정보를 가져온다.
	 */
	function getCurrentJob() {
		// 1. 녹음된 음성 파일 불러오기
		displayContents();
	}
	function getPreviousJob() {
	}
	function getNextJob() {
		getCurrentJob();
	}

	function requestComplete() {
		var param = {};
		param.projectId = mWorkInfo.projectId;
		param.checkId = mWorkInfo.checkId;
		param.contextId = mWorkInfo.contextId;

		// 승인요청
		MindsJS.loadJson(requestApi.confirmJob, param, function(result) {
			if(result.success) {
				$.alert("프로젝트를 검수 완료 했습니다.", getNextJob);
			}
		});
	}
	function requestReject() {
		var param = {};
		param.projectId = mWorkInfo.projectId;
		param.checkId = mWorkInfo.checkId;
		param.comment = $("textarea[name=comment]", $mP).val();
		param.contextId = mWorkInfo.contextId;
		
		// 반려요청
		MindsJS.loadJson(requestApi.rejectJob, param, function(result) {
			if(result.success) {
				$.alert("프로젝트를 반려 했습니다.", getNextJob);
			}
		});
	}
	
	/***** WAVE SURFER DISPLAY UTIL *****/
	function displayContents() {
		var param = {
			"projectId": mProjectId
			, "jobType": defaultJobType
		}
		// 1. 원본 JOB 정보를 가져온다.
		MindsJS.loadJson(requestApi.getCurrentJob, param, function(result) {
			if(result.success) {
				var data = result.data;
				mWorkInfo = data;

				var jobParam = { jobId: mWorkInfo.jobId };
				// 2. jobId로 원본 음성파일을 요청한다.
				MindsJS.loadJson(requestApi.getContents, jobParam, function(jobResult) {
					if(jobResult.success) {
						var context = jobResult.data;
						// 3. 음성 플레이어에 표시할 음성 데이터를 가져온다.
						if(context != null) {
							mWorkInfo.contextId = context.contextId;
						}
						if(!$.isEmpty(context.atchFile)) {
							var blob = WaveJS.base64toBlob(context.atchFile, "audio/x-wav");
							// 4. 음성플레이어를 초기화 하고
							$voiceHandler = setSourceVoicePlayer(RegionEventHandler);
							// 4-1. 녹음된 음성 데이터를 PLAYER에 Load한다.
							$voiceHandler.display(blob);
						} else {
							$.alert("원본 파일이 존재하지 않습니다.");
						}
						// 5. work contents 정보를 가져온다.
						$("span.workCtx", $mP).html(context.context);
					}
				});
			} else {
				
			}
		});
	}
	
	function setSourceVoicePlayer(regionCallback) {
		// form 초기화
		$("#waveformS", $mP).html("");
		// player handler 작성
		var voiceHandler = $("#waveformS", $mP).regWavePlayer({
			timeliner: "#wave-timelineS"
			, controller: 'div.btnAreaS'	// player를 제어하는 버튼 elements
			, isMinimap: false
			, isRegion: true
			, regionHandler: regionCallback		// 플레이어 region 에 대한 이벤트 핸들러를 연결한다.
		});
		return voiceHandler;
	}
	
	function RegionEventHandler(region, e) {
		if(e == "region-play") {
		} 
		else if(e == "region-click") {
		}
		else if(e == "out") {
		}
		else if(e == "region-in") {
		} else {
			console.log("undefined event:" + e);
		}
	}
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();