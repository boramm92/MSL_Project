var audioTriteViewScript = (function() {
	var $mP;
	var mContextInfo;
	
	var $voiceHandler;
	var $object;
	
	var mTrimPointArray = [];
	var mRegionMap = new Map();
	
	var defaultJobType = "TW";
	var MAX_TRIM_CNT = 30;

	var mIsTemporaryData = false;
	var mFormIndex = 0;
	
	function init(projectId) {
		$mP = $("div.contents");
		$object = $mP.initVoiceProject({
			projectId: projectId,
			projectType: "S",
			jobType: defaultJobType,
			jobClassName: "trite",
			nextCallback: saveResult
		});
		
		bindEventHandler();
		getCurrentJob();
	}
	
	function bindEventHandler() {
		// about navi action
		$("button.btnPrev", $mP).on("click", goPrevJob);
		$("button.btnNext", $mP).on("click", saveAndGotoNext);
		$("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);
		
		$("button.btnHome", $mP).on("click", function() {
			$object.goHome("프로젝트 관리화면으로 이동합니다.<br>'OK'를 클릭하면 저장하지 않은 데이터는 사라집니다.<br>이동하시겠습니까?");
		});
		
		// 임시저장
		$("button.btnSave", $mP).on("click", saveSplitData);
		
		// about trim action
		$("button.btnClear", $mP).on("click", clearTrimData);

		$("textarea[name=context]", $mP).on("change", fillTemporaryData);

		// 속도 조절
		$("button.slow", $mP).on("click", slowly);
		$("button.normal", $mP).on("click", normal);
		$("button.fast", $mP).on("click", fast);
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
		// if(jobInfo.jobStatus == 'RJ') {
		// 	var param = {title: "Reasons for Reject", comment: jobInfo.rejectComment};
		// 	var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
		// 	$("div.reject_box", $mP).html(rejectCommentHtml);
		// 	$.alert("This context returned by inspector. Please check reason for correction.", null, "Alert");
		// }
		$object.getCurrentJobContext(displayContents, failCallback);

		// contents 를 새로 로드했을 때 isTemporary data = false
		emptyTemporaryData();
		mFormIndex = 0;
	}
	function selectTrimData() {
		$object.selectData(trimDataRender, failCallback);
	}
	function clearTrimData() {
		$.confirm(
			"계속하시면 저장한 내용이 모두 지워집니다. 초기화 하시겠습니까?"
			, function() {
				$voiceHandler.seekTo(0);
				$object.clearData(clearDisplay, failCallback);
				emptyTemporaryData();
			}
			, null
			, "경고"
			, "계속"
			, "취소"
		);
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
	function saveSplitData(bViewMessage) {
		$object.saveContentForWork($("form[name=form-work-data]", $mP), function() {
			emptyTemporaryData();
			if(bViewMessage) {
				$.alert("작업한 내용이 임시저장 됐습니다.", selectTrimData);
			} else {
				selectTrimData();
			}
		});
	}
	
	/** FOR DISPLAY CONTENTS **/
	function displayContents(context) {
		mContextInfo = context;
		/*// 1-1. split point를 초기화한다.
		clearDisplay();
		// 2. JOB과 PROJECT에 관한 정보를 불러온다.
		$("span.orgFileName", $mP).html(mContextInfo.orgFileName);
		// 3. 음성 플레이어에 표시할 음성파일과 파형데이터를 가져온다.
		if($.isEmpty(mContextInfo.atchFile)) {
			$.alert("원본 데이터 파일을 불러오지 못했습니다.");
			return;
		}*/

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
		selectTrimData();
		$("span.fileName", $mP).text(context.orgFileName);
	}
	function trimDataRender(renderData) {
		clearDisplay();
		$voiceHandler.displayScript(renderData.workData);
		// 스크립트
		if(renderData.script != null) {
			$("textarea[name=context]", $mP).val(renderData.script.context);
			$("input[name=contextId]", $mP).val(renderData.script.contextId);
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
		mTrimPointArray = [];
		mRegionMap = new Map();
		
		if($voiceHandler) {		
			$voiceHandler.clearTimeStamp();
			$voiceHandler.seekTo(0);
		}
		$("tbody.workInfo", $mP).html("");
		$("textarea[name=context]",$mP).val("");
		$("input[name=contextId]",$mP).val("");
		mFormIndex = 0;
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
			, isCreatable: true
			, waveHeight: 51
			, regionHandler: regionHandler		// 플레이어 region 에 대한 이벤트 핸들러를 연결한다.
			, action: {
				create: createdRegion,
				update: updatedRegion,
				dblclick: removeRegion
			}
		});
		return voiceHandler;
	}
	
	function createdRegion(region) {
		if(region == null) return;
		if(MAX_TRIM_CNT != 0 && mTrimPointArray.length < MAX_TRIM_CNT) {
			if($voiceHandler) {
				mTrimPointArray.push(region);
				mRegionMap.set(region.id, region);
				
				fillTemporaryData();
				
				region.index = ++mFormIndex;
				var infoTdHtml = $.templates("#voiceTrimIndex").render(region, { convertTime : function(time) { return convertTime(time); }});
				var $infoTr = $("tbody.workInfo", $mP).append(infoTdHtml);
				
				$infoTr.find("em.fa-window-close").off("click").on("click", function(){
					var $tr = $(this).parents("tr:first");
					var contextId = $tr.attr("ctnId");
					if(!$.isEmpty(contextId)) {
						var param = { contextId: contextId };//, workId: mJobInfo.workId };
						$object.removeItem(param, function() {
							var region = mRegionMap.get($tr.attr("class"));
							$tr.remove();
							region.remove();		
						});
						//MindsJS.loadJson(requestApi.removeData, param, function(result) {
						//	var region = mRegionMap.get($tr.attr("class"));
						//	$tr.remove();
						//	region.remove();							
						//});
					} else {
						var region = mRegionMap.get($tr.attr("class"));
						$tr.remove();
						region.remove();	
					}
				});
				$infoTr.find("div.play").off("click").on("click", function() {
					var $this = $(this).parents("tr:first");
					$voiceHandler.play($this.find("td.start").attr("offset"), $this.find("td.end").attr("offset"));
					$(this).hide();
					$this.find("div.pause").show();
				});
				$infoTr.find("div.pause").off("click").on("click", function() {
					var $this = $(this).parents("tr:first");
					$voiceHandler.play();
					$(this).hide();
					$this.find("div.play").show();
				});
			}
		} else {
			$.alert("잘라내기 영역은 " +MAX_TRIM_CNT+"개 이상 등록할 수 없습니다. (현재:"+mTrimPointArray.length+"개)");
		}
	}
	function updatedRegion(region) {
		var $tr = $("tr."+region.id, $mP);
		if($tr != null) {
			/*$tr.find("input[name=start]").val(VoiceJS.limitNumber(region.start));
			$tr.find("input[name=end]").val(VoiceJS.limitNumber(region.end));*/
			$tr.find("input[name=start]").val(region.start);
			$tr.find("input[name=end]").val(region.end);
			$tr.find("td.start").attr("offset", region.start);
			$tr.find("td.end").attr("offset", region.end);
			$tr.find("td.start").html(convertTime(region.start));
			$tr.find("td.end").html(convertTime(region.end));
		}
	}
	function removeRegion(region) {
		var $tr = $("tr."+region.id, $mP);
		var region = mRegionMap.get(region.id);
		
		var contextId = $tr.attr("ctnId");
		if(!$.isEmpty(contextId)) {
			var param = { contextId: contextId }; //, workId: mJobInfo.workId };
			$object.removeItem(param, function() {
				$tr.remove();
				region.remove();	
			});
		} else {
			$tr.remove();
			region.remove();	
		}
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
	function convertTime(longTime) {
		var min = "0";
		var sec = "00";
		
		if(longTime < 0) longTime = 0;
		min = longTime / 60;
		sec = longTime % 60;
		if (Math.floor(sec) <= 9) {
			sec = "0" + sec.toFixed(3);
		} else {
			sec = sec.toFixed(3);
		}
		return Math.floor(min) + ":" + sec;
	}
	
	return {
		init: init
	}
})();