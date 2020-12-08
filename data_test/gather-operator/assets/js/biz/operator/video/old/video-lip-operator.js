var videoRecordViewScript4Oper = (function() {
	// 프로젝트 기본정보는 mProjectInfo 객체에서 전역으로 사용한다.
	
	var $mP;
	var requestApi = {
		selectProjectList: "/oper/project/selectProjectList.json",
		selectConfirmList: "/oper/video/lip/selectConfirmWorkData.json",
		goDashboard: "/oper/project/projectList.do",
		preview: "/oper/video/lip/preview.json",
		download: "/oper/video/lip/downloadRecordData.json"
	};
	var mProjectInfo = {}; 

	var $voiceHandler;
	
	function init(projectId) {
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
	function bindEventHandler() {
		$("button.btnUpload", $mP).on("click", fileUpload);

		$("button.btnSave", $mP).on("click", saveData);
		$("button.btnPost", $mP).on("click", postProject);
		$("button.btnCancel", $mP).on("click", stopProject);
		$("button.btnPause", $mP).on("click", pauseProject);
		$("button.btnBack", $mP).on("click", moveProjectListPage);
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
		VideoJS.selectUploadFileList(param, uploadResult);
	}
	
	// 파일 업로드 + JOB 생성
	function fileUpload() {
		var param = mProjectInfo;
		param.fileEncoding = "utf-8";
		VideoJS.jobFileUpload(param, $("input[name=findFile]"), uploadResult);
	}
	
	// 저장
	function saveData() {
		var param =  $("form[name=form-project]", $mP).formJson();
		VideoJS.saveProjectInfo(param);
	}
	
	// 프로젝트 게시
	function postProject() {
		// 수정된 내용은 저장하지 않고 게시만 할 경우
		//var param =  {projectId: "${pjtInfo.projectId}"};
		// 수정된 내용까지 저장하면서 게시할 경우
		var param =  $("form[name=form-project]", $mP).formJson();	
		VideoJS.postProject(param, moveProjectListPage);
	}
	
	// 프로젝트 일시정지
	function pauseProject() {
		var param =  {projectId: mProjectInfo.projectId};
		VideoJS.pauseProject(param);
	}
	
	// 프로젝트 취소
	function stopProject() {
		var param =  {projectId: mProjectInfo.projectId};
		VideoJS.stopProject(param, moveProjectListPage);
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
			tableHtml = $.templates("#confirmList").render(data);
		} else {
			var emptyParam = { colspan : 6, message : "" };
			tableHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);
		}
		var $detailTable = $("tbody#detailList", $mP).html(tableHtml);
		$detailTable.find("button.btnPreview").on("click", preview);
		$detailTable.find("button.btnDownload").on("click", confirmDownload);
		$detailTable.find("button.btnPause").on("click", playOrPause);
	}
	function preview() {
		// $(this)는 preview button
		var $tr = $(this).parents("tr:first");
		var param = { 
			projectId : mProjectInfo.projectId
			, workId : $tr.find(".workId").attr("workId")
			, atchFileId : $tr.attr("atchFileId")
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
				, atchFileId : $tr.attr("atchFileId") 
				, contextId : $tr.attr("ctnId")
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
	
	//** UTILS **//
	function moveProjectListPage() {
		MindsJS.movePage("/oper/project/projectList.do");
	}
	
	function uploadResult(data) {
		if(data.data == null) {
			return;
		}
		var fileList = data.data;
		fileList.status = mProjectInfo.status;
		var html = $.templates("#uploadListTemplate").render(fileList);
		var $selectedFileList = $("div.uploadFileList", $mP).append(html);
		$selectedFileList.find("button").on("click", deleteAtchFile);
	}
	
	return {
		init: init
	}
})();