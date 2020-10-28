// 프로젝트 타입에 맞게 class명 지정
// view 파일(jsp)에서 init할 때 사용하는 클래스 명 
var classificateScriptView = (function() {
	var $mP;
	var mContextInfo;
	
	var $voiceHandler;
	var $object;

	var mTrimPointArray = [];
	var mRegionMap = new Map();
	
	var defaultJobType = "IC";
	var jobClassName = "classificate";		// 쌍으로 생성할 jsp 파일 id, file name format : audio-{id}-worker.jsp

	var MAX_CONTENT_CNT = 100;

	var mIsTemporaryData = false;
	var mFormIndex = 0;

	var mLanguage = "ko";

	var koMessage = {
		request : "작업한 내용을 저장하고 검수요청 하시겠습니까?",
		unabled : "작업불가 사유를 입력하면 작업불가 항목으로 지정됩니다.<br>작업불가 항목으로 지정하시겠습니까?",
		unabledLabel : "작업불가 사유를 입력해 주세요.",
		reject : ""
	};
	var enMessage = {
		request : "Would you like to save your work and request a review?",
		unabled : "If you enter a reason for not working, it is designated as an inoperable item. <br> Are you sure you want to specify an inoperative item?",
		unabledLabel : "Please enter the reason for not working.",
		reject : ""
	};
	
	function init(projectId, language) {
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

		mLanguage = language != null ? language : "ko";
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
		$("button.btnSave", $mP).on("click", saveWritenData);
		// about write down action
		$("textarea", $mP).on("change", writedown);
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
		$object.selectCurrentContents(displaySubContents, failCallback);

		// contents 를 새로 로드했을 때 isTemporary data = false
		emptyTemporaryData();
		mFormIndex = 0;
	}
	function selectWorkData() {
		$object.selectData(dataRender, failCallback);
	}
	function clearWorkData() {
		$object.clearData(clearDisplay, failCallback);
	}
	function saveAndGotoNext() {
		var message = "";
		if(mLanguage != "ko" && mLanguage != 'ko_KR') {
			message = enMessage.request;
		} else {
			message = koMessage.request;
		}
		$.confirm(message, function() {
			$object.saveContentForWorkByParameter(mRegionMap, $object.requestInspectForWork);
		}, null, "Confirm");
	}
	function ignoreAndGotoNext() {
		var labelList = [
			{
				label:"Comment :"
				, lbl_type:"text"
				, name:"comment"
				, lbl_ph: mLanguage != "ko" && mLanguage != 'ko_KR' ? enMessage.unabledLabel : koMessage.unabledLabel }
		];
		$.commentAll(
			mLanguage != "ko" && mLanguage != 'ko_KR' ? enMessage.unabled : koMessage.unabled
			, function(data) {
				$object.requestIgnoreForWork(data.comment);
			}					// ok Function
			, null				// cancel Function
			, mLanguage != "ko" && mLanguage != 'ko_KR' ? "Unable to work" : "작업불가 지정"		// Title
			, mLanguage != "ko" && mLanguage != 'ko_KR' ? "Unable to work" : "작업불가"				// OK Title
			, mLanguage != "ko" && mLanguage != 'ko_KR' ? "Cancel" : "취소"				// Cancel Title
			, labelList			// label list
		);
	}
	// 작업내용을 저장 한 후에 자동으로 실행할 함수 (변경이 필요하면 함수 내에 구현, 함수명은 변경하지 마세요.)
	function saveResult() {
		getCurrentJob();
	}
	// 임시저장
	function saveWritenData(bViewMessage) {
		$object.saveContentForWorkByParameter(mRegionMap, function() {
			emptyTemporaryData();
			if(bViewMessage) {
				$.alert("Done.", selectWorkData);
			} else {
				selectWorkData();
			}
		});
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
		if($.isEmpty(mContextInfo.atchFile)) {
			$.alert("원본 데이터 파일을 불러오지 못했습니다.");
			return;
		}
		var blob = WaveJS.base64toBlob(mContextInfo.atchFile, "audio/x-wav");
		// 4. 음성 플레이어를 초기화 하고
		$voiceHandler = setVoicePlayer(WaveJS.RegionEventHandler);
		// 4-1. 3의 데이터를 랜더링한다.
		if($voiceHandler) {
			$voiceHandler.display(blob);
		}
		selectWorkData();
		$("span.fileName", $mP).text(context.orgFileName);
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
		selectSubCodeTypeList();
	}
	
	/** TO DO : **/
	function dataRender(renderData) {
		clearDisplay();
		// player에 region을 표시할 데이터가 있는 경우에만 실행
		$voiceHandler.displayScript(renderData.workData);

		// 세부 데이터를 임시저장소에 저장
		renderData.workData.forEach(function(v,i) {
			var regionId = v.regionId;
			var region = mRegionMap.get(regionId);

			region.writeText = v.context;
			region.classificate = v.contentKind;

			if(!$.isEmpty(region.writeText)) {
				$("tbody tr[regionid='"+regionId+"']", $mP).find("td:eq(1) span").addClass("fa-check write_chk");
			}

			mRegionMap.set(regionId, region);
		});
	}
	function clearDisplay() {
		// To do:여기에서 로컬 변수를 초기화 한다.
		mTrimPointArray = [];
		mRegionMap = new Map();
		
		if($voiceHandler) {		
			$voiceHandler.clearTimeStamp();
			$voiceHandler.seekTo(0);
		}
		$("tbody.workInfo", $mP).html("");

		$(".actInsert", $mP).attr("disabled", true );
		$("textarea.actInsert", $mP).val("");			// Write Down 초기화
		$("select.actInsert", $mP).val("");				// Select 값 초기화
		mFormIndex = 0;
	}
	function selectSubCodeTypeList() {
		$object.selectProjectCategorySubList(renderClassifyType);
	}
	function renderClassifyType(data) {
		var html = "<option value=''>-- SELECT --</option>";

		if(!$.isEmpty(data)) {
			html += $.templates("#selectOptionOnlyTemplate").render(data);
		}
		var $categorySelecteBox = $("select[name=categoryType]", $mP).html(html);
		$categorySelecteBox.on("change", function() {
			var selectedRegionId = $("tr.active").attr("regionId");
			var selectRegion = mRegionMap.get(selectedRegionId);
			selectRegion.classificate = $(this).val();
			mRegionMap.set(selectedRegionId, selectRegion);
		});
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
		if(MAX_CONTENT_CNT != 0 && mTrimPointArray.length < MAX_CONTENT_CNT) {
			if($voiceHandler) {
				mTrimPointArray.push(region);
				mRegionMap.set(region.id, region);

				fillTemporaryData();

				region.index = ++mFormIndex;
				var infoTdHtml = $.templates("#frequencyTemplate").render(region, { convertTime : function(time) { return convertTime(time); }});
				var $infoTr = $("tbody.workInfo", $mP).append(infoTdHtml);

				$infoTr.find("em.fa-window-close").off("click").on("click", function(){
					var $tr = $(this).parents("tr:first").removeClass("active");
					var contextId = $tr.attr("ctnId");
					if(!$.isEmpty(contextId)) {
						var param = { contextId: contextId };//, workId: mJobInfo.workId };
						$object.removeItem(param, function() {
							var region = mRegionMap.get($tr.attr("regionId"));
							$tr.remove();
							region.remove();
						});
					} else {
						var region = mRegionMap.get($tr.attr("regionId"));
						$tr.remove();
						region.remove();
					}
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
					$(this).hide();
					$this.find("div.play").show();
					$voiceHandler.play();
				});

				/***
				 * Results 항목 클릭했을 때
				 */
				$infoTr.find("td").off("click").on("click", function() {
					var $this = $(this).parents("tr:first");
					$this.siblings("tr").removeClass("active");
					$this.addClass("active");

					// write down 과 classification 활성화
					//$("select[name=categoryType] option:eq(0)", $mP).prop("selected", true);
					$(".actInsert", $mP).attr("disabled", false);

					var region = mRegionMap.get($this.attr("regionId"));

					$("textarea.actInsert", $mP).val(region.writeText ? region.writeText : "");
					$("select.actInsert", $mP).val(region.classificate ? region.classificate : "");
				});
			}
		} else {
			$.alert("잘라내기 영역은 " +MAX_CONTENT_CNT+"개 이상 등록할 수 없습니다. (현재:"+mTrimPointArray.length+"개)");
		}
	}
	function updatedRegion(region) {
		var $tr = $("tr[regionId="+region.id+"]", $mP);
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
		var getRegion = region;
		$.confirm("Are you sure you want to remove the selected region?", function() {
			var $tr = $("tr[regionId="+getRegion.id+"]", $mP);
			var thisRegion = mRegionMap.get(getRegion.id);
			var contextId = $tr.attr("ctnId");
			if(!$.isEmpty(contextId)) {
				var param = { contextId: contextId }; //, workId: mJobInfo.workId };
				$object.removeItem(param, function() {
					$tr.remove();
					thisRegion.remove();
				});
			} else {
				$tr.remove();
				thisRegion.remove();
			}
		}, null, "Remove");
	}

	/****
	 * 페이지 고유액션
	 */
	function writedown() {
		var selectedRegionId = $("tr.active").attr("regionId");
		if(selectedRegionId != null) {
			var selectedRegion = mRegionMap.get(selectedRegionId);
			selectedRegion.writeText = $(this).val();
			mRegionMap.set(selectedRegionId, selectedRegion);

			if($(this).val().length > 0) {
				$("tr[regionId=" + selectedRegionId + "]").find("span.fas").addClass("fa-check").addClass("write_chk");
			} else {
				$("tr[regionId=" + selectedRegionId + "]").find("span.fas").removeClass("write_chk").removeClass("fa-check");
			}
		} else {
			$.alert("전사할 Audio Region을 선택해 주세요.")
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