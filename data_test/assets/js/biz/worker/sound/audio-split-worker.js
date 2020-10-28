var audioSplitViewScript = (function() {
	var $mP;
	var mContextInfo;
	
	var $voiceHandler;
	var $object;
	
	var mSplitPointArray = [];
	var isEndOfVoice = false;
	
	var defaultJobType = "SS";
	var MAX_SPLIT_CNT = 30;
	
	var mIsTemporaryData = false;
	var mFormIndex = 0;
	
	function init(projectId) {
		$mP = $("div.contents");
		$object = $mP.initVoiceProject({
			projectId: projectId,
			projectType: "S",
			jobType: defaultJobType,
			jobClassName: "split",
			nextCallback: saveResult
		});
		
		bindEventHandler();
		getCurrentJob();
		// $object.autoRefresh(saveSplitData);
	}
	
	function bindEventHandler() {
		// about navi action
		$("button.btnPrev", $mP).on("click", goPrevJob);
		$("button.btnNext", $mP).on("click", saveAndGotoNext);
		$("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);
		
		$("button.btnHome", $mP).on("click", function() {
			$object.goHome("프로젝트 관리화면으로 이동합니다.<br>'OK'를 클릭하면 저장하지 않은 데이터는 사라집니다.<br>이동하시겠습니까?");
		});

		// about split action
		$("button.btnPutStamp", $mP).on("click", setSplitPoint);
		$("button.btnClearStamp", $mP).on("click", clearSplitTimeStamp);
		
		$("button.btnUndo", $mP).on("click", undoSplit);
		$("button.btnRedo", $mP).on("click", redoSplit);
		
		// 임시저장
		$("button.btnSave", $mP).on("click", saveSplitData);
	}
	
	/** FOR NAVIGATE **/
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
		$object.selectCurrentContents(displaySubContents, failCallback);
		
		// contents 를 새로 로드했을 때 isTemporary data = false
		emptyTemporaryData();
		mFormIndex = 0;
	}
	function selectSplitData() {
		$object.selectData(splitDataRender, failCallback);
	}
	function clearSplitTimeStamp() {
		$.confirm(
			"계속하시면 저장한 내용이 모두 지워집니다. 초기화 하시겠습니까?"
			, function() {
				$voiceHandler.seekTo(0);
				$object.clearData(clearDisplay, failCallback);
				emptyTemporaryData();
				mFormIndex = 0;
			}
			, null
			, "경고"
			, "계속"
			, "취소"
		);
	}
	function saveAndGotoNext() {
		$.confirm("작업한 내용을 저장하고 검수요청 하시겠습니까?", function() {
			$object.saveContentForWork($("form[name=form-work-data]", $mP), $object.requestInspectForWork);
		});
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
				$.alert("작업한 내용이 임시저장 됐습니다.", selectSplitData);
			} else {
				selectSplitData();
			}
		});
	}
	
	/** FOR DISPLAY CONTENTS **/
	function displayContents(context) {
		mContextInfo = context;
		// 1-1. split point를 초기화한다.
		//clearDisplay();
		// 2. JOB과 PROJECT에 관한 정보를 불러온다.
		// $("span.orgFileName", $mP).html(mContextInfo.orgFileName);
		// 3. 음성 플레이어에 표시할 음성파일과 파형데이터를 가져온다.
		/*if($.isEmpty(mContextInfo.atchFile)) {
			$.alert("원본 데이터 파일을 불러오지 못했습니다.");
			return;
		}*/
		var blob = WaveJS.base64toBlob(mContextInfo.atchFile, "audio/x-wav");
		// 4. 음성 플레이어를 초기화 시키고
		$voiceHandler = setVoicePlayer(WaveJS.RegionEventHandler);
		// 4-1. 3의 데이터를 랜더링한다.
		$voiceHandler.display(blob);
		
		selectSplitData();
	}
	
	function displaySubContents(contents) {
		var contentsHtml = "";
		if(contents != null && contents.length > 0) {
			contentsHtml = $.templates("#voiceBaseContents").render(contents);
		} else {
			var emptyParam = { colspan : 2, message : "Empty Script" };
			contentsHtml = $.templates("#listEmptyTemplate").render(emptyParam);
		}
		$("div.script_list ul", $mP).html(contentsHtml);	
	}
	
	/** LOCAL FUNCTION AND UI **/
	function setSplitPoint() {
		if(isEndOfVoice) {
			$.alert("파일의 마지막까지 분류 됐습니다.");
			return;
		}
		//if(MAX_SPLIT_CNT != 0 && mSplitPointArray.length < MAX_SPLIT_CNT) {
			if($voiceHandler) {
				var currentTime = $voiceHandler.drawSplitPoint();
				if(currentTime.end > currentTime.start) {
					mSplitPointArray.push(currentTime);
					
					currentTime.index = ++mFormIndex;
					var infoTdHtml = $.templates("#voiceSplitSingle").render(currentTime, { convertTime : function(time) { return convertTime(time); }});
					fillTemporaryData();
					
					var $infoTr = $("tbody.workInfo", $mP).append(infoTdHtml);
					$infoTr.find("em.fa-window-close").off("click").on("click", function(){
						var $localTr = $(this).parents("tr:first")
						var regionId = $localTr.attr("class");
						
						$localTr.remove();
						// Region에서 제거하기
						$voiceHandler.removeRegion(regionId, true);
					});
					$infoTr.find("div.play").off("click").on("click", function() {
						var $this = $(this).parents("tr:first");
						$("tbody.workInfo", $mP).find("div.pause").hide();
						$("tbody.workInfo", $mP).find("div.play").show();

						$(this).hide();
						$this.find("div.pause").show();

						$voiceHandler.play($this.find("td.start").attr("offset"), $this.find("td.end").attr("offset"));
					});
					$infoTr.find("div.pause").off("click").on("click", function() {
						var $this = $(this).parents("tr:first");
						$voiceHandler.play();
						$(this).hide();
						$this.find("div.play").show();
					});
				} else {
					console.log("추가할 수 없는 경우, 시간이 마지막 보다 작거나 같은 경우");
				}
			}
		//} else {
		//	$.alert("원본 음성은 "+MAX_SPLIT_CNT+"개 이상으로 나눌 수 없습니다.");
		//}
		// 스크롤을 최신 항목에 맞추기
		$("tbody.workInfo", $mP).parents(".content:first").scrollTop($("tbody.workInfo", $mP).height());
	}
	function splitDataRender(renderData) {
		clearDisplay();
		// player에 region을 표시할 데이터가 있는 경우에만 실행
		$voiceHandler.displayScript(renderData.workData);
		
		if(renderData.rejectComment != null) {
			$("textarea[name=comment]", $mP).val(renderData.rejectComment);
		}
		
		var infoTdHtml = $.templates("#voiceSplitIndex").render(renderData.workData, { convertTime : function(time) { return convertTime(time); }});
		var $infoTr = $("tbody.workInfo", $mP).html(infoTdHtml);
		// button event Handler
		$infoTr.find("em.fa-window-close").off("click").on("click", function(){
			var contentId = $(this).parents("tr").attr("ctnId");
			var param = { contextId: contentId };
			var $this = $(this);
			// API 한번 더 태운다 (wave와 표 데이터가 일치 된다.)
			$object.removeItem(param, selectSplitData, failCallback);
		});
		$infoTr.find("div.play").off("click").on("click", function() {
			var $this = $(this).parents("tr:first");
			$("tbody.workInfo", $mP).find("div.pause").hide();
			$("tbody.workInfo", $mP).find("div.play").show();

			$(this).hide();
			$this.find("div.pause").show();

			$voiceHandler.play($this.find("td.start").attr("offset"), $this.find("td.end").attr("offset"));
		});
		$infoTr.find("div.pause").off("click").on("click", function() {
			var $this = $(this).parents("tr:first");
			$voiceHandler.play();
			$(this).hide();
			$this.find("div.play").show();
		});
		mSplitPointArray = renderData.workData;
	}
	
	/** LOCAL AUDIO PLAYER **/
	function setVoicePlayer(regionHandler) {
		// form 초기화
		$("#waveform", $mP).html("");
		// player handler 작성
		var voiceHandler = $("#waveform", $mP).regWavePlayer({
			controller: 'div.btnArea'	// player를 제어하는 버튼 elements
			, controlType: 1
			, timeliner: "#wave-timeline"
			, isMinimap: false
			, isRegion: true
			, waveHeight: 51
			, regionHandler: regionHandler		// 플레이어 region 에 대한 이벤트 핸들러를 연결한다.
		});
		return voiceHandler;
	}
	function clearDisplay() {
		mSplitPointArray = [];
		isEndOfVoice = false;
		
		if($voiceHandler) {
			//$voiceHandler.seekTo(0);
			$voiceHandler.clearTimeStamp();
		}
		$("tbody.workInfo", $mP).html("");
	}
	
	/** JOB SUPPORT **/
	var bUndo = false;
	var undoMemory = null;
	function undoSplit() {
		if(mSplitPointArray == null || mSplitPointArray.length <= 0) {
			$.alert("작업을 시작하지 않았습니다.");
			return;
		} else {
			var timeStamp = mSplitPointArray[mSplitPointArray.length-1];
			var index = mSplitPointArray.indexOf(timeStamp);
			if(index > -1) {
				bUndo = true;
				undoMemory = timeStamp;
				mSplitPointArray.splice(index, 1);
				$voiceHandler.removeRegion(timeStamp.regionId);
				
				if(mSplitPointArray != null && mSplitPointArray.length > 0) {
					var prevTimeStamp = mSplitPointArray[mSplitPointArray.length-1];
					$voiceHandler.seekTo(prevTimeStamp.end);
				} else {
					$voiceHandler.seekTo(0);
				}
				$("tbody.workInfo", $mP).find("tr."+timeStamp.regionId).remove();
			}
			fillTemporaryData();
		}
	}
	function redoSplit() {
		if(bUndo && undoMemory != null) {
			bUndo = false;
			
			mSplitPointArray.push(undoMemory);
			
			var tempList = {};
			tempList.workData = mSplitPointArray;
			splitDataRender(tempList);
			
			undoMemory = null;
			fillTemporaryData();
		} else {
			$.alert("취소한 작업이 없습니다.");
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