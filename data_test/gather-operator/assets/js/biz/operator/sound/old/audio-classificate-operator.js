var audioClassificateViewScript4Oper = (function() {
	// 프로젝트 기본정보는 mProjectInfo 객체에서 전역으로 사용한다.
	var $mP;
	var mProjectInfo = {};
	var mSelectedDocInfo;
	
	var $voiceHandler;
	
	var requestApi = {
		selectProjectList: "/oper/project/selectProjectList.json",
		goDashboard: "/oper/project/projectList.do",
		
		selectJobTypeList: "/oper/sound/selectExtraJobPossiblity.json",
		preview: "/oper/sound/preview.json",
		
		//download: "/oper/sound/split/downloadSplitData.json",
		download: "/oper/sound/downloadData.json",
		selectConfirmList: "/oper/sound/split/selectConfirmWorkData.json",

		// For Job Guide
		getGuideDocument: "/oper/guide/getGuideDocumentContents.json",
		registGuideDocument: "/oper/guide/registGuideDocument.json",
		uploadGuideDocument: "/oper/guide/registGuideDocument.json"
	};
	
	function init(projectId) {
		initCKEditor();
		mSelectedDocInfo = null;

		var param = {};
		param.projectId = projectId;
		MindsJS.loadJson(
			requestApi.selectProjectList,
			param,
			function(result) {
				if(result.success) {
					if(result.data != null && result.data.length > 0) {
						mProjectInfo = result.data[0];

						$mP = $("div.container");
						bindEventHandler();
						loadData();

						// 가이드 문서 호출
						getGuideDocument();
						
						$(".page_loading").addClass("pageldg_hide").delay(300).queue(function() {
							$(this).remove();
						});

						$("input[name=findFile]", $mP).findFile({
							filelist : $(".showUploadBox", $mP)		// 업로드한 파일을 표시해줄 오브젝트
						});
					} else {
						$.alert("프로젝트를 불러오지 못했습니다.", function() {
							MindsJS.movePage(requestApi.goDashboard);
						});
						return;
					}
				} else {
					$.alert("프로젝트를 불러오지 못했습니다.", function() {
						MindsJS.movePage(requestApi.goDashboard);
					});
					return;
				}
			}	
		);
	}
	function initCKEditor() {
		CKEDITOR.replace('p_content', {height: 500});
	}
	function bindEventHandler() {
		$("button.btnUpload", $mP).on("click", fileUpload);

		$("button.btnSave", $mP).on("click", saveData);
		$("button.btnPost", $mP).on("click", postProject);
		$("button.btnCancel", $mP).on("click", stopProject);
		$("button.btnPause", $mP).on("click", pauseProject);
		$("button.btnBack", $mP).on("click", moveProjectListPage);
		$("button.btnBatchDown", $mP).on("click", downloadAll);
		
		// 2019.07.04 Added by juneyoung
		$("button.btnAppendJob", $mP).on("click", popExtraJobType);

		// 2020.02.20 Added by juneyoung
		$("button.btnGuideSave", $mP).on("click", saveHtml);
		$("button.btnPreview", $mP).on("click", showEditPreview);
	}
	
	function loadData() {
		getProjectDetailInfo();
		selectUploadFileList();
	}
	
	function getProjectDetailInfo() {
		// 프로젝트가 게시중이면 내용을 변경할 수 없음
		var currStatus = mProjectInfo.status;
		if(currStatus == 'RDY' || currStatus == 'REQ' || currStatus == 'EGH' || currStatus == 'EXP') {
			$("form[name=form-project]", $mP).find("input").attr("readonly", true);
		} else {
			$("form[name=form-project]", $mP).find("input").removeAttr("readonly");
		}
		
		if(currStatus == 'REQ' || currStatus == 'EGH') {
			loadConfirmData();
		}
	}
	
	function selectUploadFileList() {
		var param =  {projectId: mProjectInfo.projectId};
		VoiceJS.selectUploadFileList(param, uploadResult);
	}
	
	// 파일 업로드 + JOB 생성
	function fileUpload() {
		var param = mProjectInfo;
		VoiceJS.jobFileUpload(param, $("input[name=findFile]"), uploadResult);
	}
	
	// 저장
	function saveData() {
		var param =  $("form[name=form-project]", $mP).formJson();
		VoiceJS.saveProjectInfo(param);
	}
	
	// 프로젝트 게시
	function postProject() {
		// 수정된 내용은 저장하지 않고 게시만 할 경우
		//var param =  {projectId: "${pjtInfo.projectId}"};
		// 수정된 내용까지 저장하면서 게시할 경우
		var param =  $("form[name=form-project]", $mP).formJson();	
		VoiceJS.postProject(param, moveProjectListPage);
	}
	
	// 프로젝트 일시정지
	function pauseProject() {
		var param =  {projectId: mProjectInfo.projectId};
		VoiceJS.pauseProject(param);
	}
	
	// 프로젝트 취소
	function stopProject() {
		var param =  {projectId: mProjectInfo.projectId};
		VoiceJS.stopProject(param, moveProjectListPage);
	}
	
	// 서브 작업을 추가하기 위한 타입 선택 화면 Popup
	function popExtraJobType() {
		var param = {};
		param.jobType = "SS";
		MindsJS.loadJson(
			requestApi.selectJobTypeList
			, param
			, renderSelectExtraJob
		);
	}
	function renderSelectExtraJob(data) {
		if(data.success) {
			if(data.data.length > 0) {
				// 팝업 프레임을 만든다.
				var wrapperPopup = $($.templates("#popupFrameHtml").render());
				wrapperPopup.find("button.btnClose").on("click", function() { wrapperPopup.hide(); });
				wrapperPopup.appendTo("body");
				
				// 추가 작업 종류 데이터를 랜더링 후
				var object = data.data;
				var extraJobContent = $.templates("#popChoiceExtraJobType").render(object);
				
				wrapperPopup.find("div.modal_content").html(extraJobContent);
				wrapperPopup.find("button.btnJobType").on("click", appendExtraJobOnMainWindow);
				wrapperPopup.show();
			} else {
				$.alert("이 프로젝트에 연계할 수 있는 작업이 없습니다.");
			}
		}
	}
	function appendExtraJobOnMainWindow() {
		var dataMap = {
			code:$(this).attr("code"),
			codeName:$(this).text()
		};
		
		var selectedJobBlock = $.templates("#extraJobInputTemplate").render(dataMap);
		var $tblExtra = $("tbody.tblExtra", $mP).append(selectedJobBlock);
		$tblExtra.find("button.btnRemoveXtraJob").on("click", function() {
			var $this = $(this);
			$this.parents("tr:first").remove();
		});
	}
	
	// 파일삭제
	// 기능 필요한지 판단 필요, 생성된 JOB도 같이 제거
	function deleteAtchFile() {
		var param = mProjectInfo;
		
		var $this = $(this);
		param.atchFileId = $this.attr("btnId");
		param.jobId = $this.attr("jobId");
		$.confirm(
			"파일을 삭제하면 JOB도 함께 삭제 됩니다. 삭제하시겠습니까?"
			, function() {
				MindsJS.loadJson(
					"/oper/project/removeAttachFile.json"
					,param
					,function(result) {
						$("div.uploadFileList", $mP).html("");
						selectUploadFileList();
					}				
				);
			}
			, null
			, "JOB 삭제"
		);
	}

	////////////////////////////////////////
	// for Guide Document
	////////////////////////////////////////
	function getGuideDocument() {
		var param = {};
		param.projectId = mProjectInfo.projectId;
		MindsJS.loadJson(
			requestApi.getGuideDocument,
			param,
			function(result) {
				var data = result.data;
				if(data != null && data.guideContentsVoList != null && data.guideContentsVoList.length > 0) {
					CKEDITOR.instances.p_content.setData(data.guideContentsVoList[0].atchContents);
					mSelectedDocInfo = data.guideContentsVoList[0];
				}
				mGuideDocInfo = data;
			}
		);
	}
	function saveHtml() {
		var param = mGuideDocInfo;
		var writeUri = "";

		console.log(mProjectInfo);

		if(param != null) {
			writeUri = requestApi.uploadGuideDocument;
		} else {
			param = {};
			param.docType = "H";		// A:첨부파일, H:HTML텍스트
			writeUri = requestApi.registGuideDocument;
		}
		param.projectId = mProjectInfo.projectId;
		param.jobType = mProjectInfo.jobType;

		var html = CKEDITOR.instances.p_content.getData().trim();
		if(html.length > 0) {
			param.atchContents = html;
			if(mSelectedDocInfo != null) {
				param.contextId = mSelectedDocInfo.contextId;
			}
			MindsJS.loadJson(
				writeUri,
				param,
				function(result) {
					if(result.success) {
						$.alert("저장성공");
					}
				}
			);
		} else {
			$.alert("본문 넣으라 이미리야")	;
		}
	}

	function showEditPreview() {

	}
	
	/** CONFIRM LIST FOR DOWNLOAD FILE **/
	function loadConfirmData() {
		var param = { projectId : mProjectInfo.projectId };
		$("tbody#detailList", $mP).paging({
			dataURI: requestApi.selectConfirmList,
			renderCallback: renderConfirm,
			param: param,
			pageBlock: 10,
			length: 10,
			pageNav: $("div.confirmPagingBox", $mP)
		});
	}
	function renderConfirm(data) {
		var tableHtml = "";
		if(data != null && data.length > 0) {
			$("button.btnBatchDown", $mP).show();
			tableHtml = $.templates("#confirmList").render(data);
		} else {
			$("button.btnBatchDown", $mP).hide();
			var emptyParam = { colspan : 7, message : "" };
			tableHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);
		}
		var $detailTable = $("tbody#detailList", $mP).html(tableHtml);
		$detailTable.find("button.btnPreview").on("click", preview);
		$detailTable.find("button.btnPreviewOrgFile").on("click", orgPreview);
		$detailTable.find("button.btnDownload").on("click", confirmDownload);
		$detailTable.find("button.btnPause").on("click", playOrPause);
	}
	function preview() {
		// $(this)는 preview button
		var $tr = $(this).parents("tr:first");
		var param = { 
			projectId : mProjectInfo.projectId
			, workId : $tr.find(".workId").attr("workId")
			, contextId : $tr.attr("ctnId") 
			, jobType : $tr.find(".jobType").attr("jobType")
		};
		MindsJS.loadJson(
			requestApi.preview,
			param,
			function(result) {
				if(result.success) {
					var contents = result.data;
					var blob = VoiceMediaJS.base64toBlob(contents.atchFile, "audio/x-wav");
					if($voiceHandler != null) {
						$voiceHandler.seekTo(0);
						$voiceHandler = null;
					}
					$voiceHandler = setVoicePlayer();
					$voiceHandler.display(blob);
					
					$tr.find("button.btnPreview").hide();
					$tr.find("button.btnPause").show();
					
					$tr.siblings("tr").find("button.btnPause").hide();
					$tr.siblings("tr").find("button.btnPause").text("일시정지");
					$tr.siblings("tr").find("button.btnPreview").show();
				}
			}
		);
	}
	function orgPreview() {
		$.alert("원본파일 미리 듣기");
	}
	function setVoicePlayer() {
		// form 초기화
		$("#waveform", $mP).html("");
		
		// player handler 작성
		var voiceHandler = $("#waveform", $mP).regWavePlayer({
			timeliner: "#wave-timeline"
			, controller: 'div.btnArea'	// player를 제어하는 버튼 elements
			, isMinimap: false
			, isRegion: true
		});
		return voiceHandler;
	}
	function confirmDownload() {
		var $thisBtn = $(this);
		$.confirm("파일을 생성하는데 시간이 소요됩니다. 다운로드 하시겠습니까?", function() {
			var $tr = $thisBtn.parents("tr:first");
			var param = { 
				projectId : mProjectInfo.projectId
				, workId : $tr.find(".workId").attr("workId")
				, contextId : $tr.attr("ctnId") 
				, jobType: $tr.find(".jobType").attr("jobType")
			};
			MindsJS.movePage(
				requestApi.download,
				param
			);
		});
	}
	function playOrPause() {
		if($voiceHandler.play()) {
			$(this).text("일시정지");
		} else {
			$(this).text("재생");
		}
	}
	function downloadAll() {
		$.alert("프로젝트에서 승인된 데이터를 정제합니다. (구현중)");
	}
	
	//** UTILS **//
	function moveProjectListPage() {
		MindsJS.movePage("/oper/project/projectList.do");
	}
	
	function uploadResult(data) {
		if(data.data != null && data.data.length > 0) {
			var fileList = data.data;
			fileList.status = mProjectInfo.status;
			var html = $.templates("#uploadListTemplate").render(fileList);
			var $selectedFileList = $("div.uploadFileList", $mP).append(html);
			$selectedFileList.find("button").on("click", deleteAtchFile);
			
			$("button.btnAppendJob", $mP).css("display", "none");
		} else {
			$("button.btnAppendJob", $mP).css("display", "block");
		}
	}
	
	return {
		init: init
	}
})();