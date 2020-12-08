var imageCroppingViewScript4Oper = (function() {
	// 	프로젝트 기본정보는 mProjectInfo 객체에서 전역으로 사용한다.
	var $mP;
	
	var requestApi = {
		getCurrProjectInfo: "/oper/project/getProjectDetail.json",
		goDashboard: "/oper/project/projectList.do"
	};
	var mProjectInfo = {}; 
	
	function init(projectId) {
		// loading indicator 지우기
		$(".page_loading").addClass("pageldg_hide").delay(300).queue(function() {
			$(this).remove();
		});

		$mP = $("div.container");
		mProjectInfo.projectId = projectId;

		mSelectedDocInfo = null;

		bindEventHandler();
		loadData();
	}
	function bindEventHandler() {
		// 파일 업로드 (Job 생성)
		$("button.btnUpload", $mP).on("click", fileUpload);

		$("button.btnBack", $mP).on("click", moveProjectListPage);  // 뒤로가기 버튼
		$("button.btnPost", $mP).on("click", moveProjectState);     // 프로젝트 상태화면으로 이동 (게시하거나 가이드 등록)
	}

	function loadData() {
		var param = {};
		param.projectId = mProjectInfo.projectId;

		MindsJS.loadJson(
			requestApi.getCurrProjectInfo,
			param,
			function(result) {
				if(result.success) {
					if(!$.isEmptyObject(result.data)) {
						mProjectInfo = result.data;
						selectUploadFileList();

						$("input[name=findFile]", $mP).findFile({
							filelist : $(".showUploadBox", $mP)		// 업로드한 파일을 표시해줄 오브젝트
							,fileCount: $(".fileCount", $mP)
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
	function selectUploadFileList() {
		var param =  {projectId: mProjectInfo.projectId};
		ImageJS.selectUploadFileList(param, uploadResult);
	}
	function uploadResult(data) {
		if(data.data != null && data.data.length > 0) {
			var fileList = data.data;
			fileList.status = mProjectInfo.status;
			var html = $.templates("#uploadedFileListTemplate").render(fileList);
			var $selectedFileList = $(".uploadFileList", $mP).append(html);
			$selectedFileList.find("button").on("click", deleteAtchFile);

			var totCount = $(".uploadedFileCount", $mP).attr("count")*1 + fileList.length;
			$(".uploadedFileCount", $mP).html("(총 " + totCount + "개)").attr("count", totCount);

			$("button.btnAppendJob", $mP).css("display", "none");
			$(".showUploadBox", $mP).html("<tr><td colspan='3'>프로젝트에 등록할 파일을 찾아서 업로드 하세요.</td></tr>");
			$(".fileCount", $mP).html("(총 0개)");
		} else {
			$("button.btnAppendJob", $mP).css("display", "block");
		}
	}
	function fileUpload() {
		var param = mProjectInfo;
		var extraParam = $("form[name=form-extra]", $mP).formJson();
		if(extraParam != null && extraParam.extraJobType != null) {
			param.extraJobCount = extraParam.extraJobType.length;
			param.extraJobType = extraParam.extraJobType;
			param.extraBenefitPoint = extraParam.extraBenefitPoint;
		}
		ImageJS.jobFileUpload(param, $("input[name=findFile]"), uploadResult);
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
						$(".uploadFileList", $mP).html("");
						selectUploadFileList();
					}
				);
			}
			, null
			, "JOB 삭제"
		);
	}
	// 프로젝트 상세페이지로 이동
	function moveProjectState() {
		MindsJS.movePage("/oper/image/"+mProjectInfo.projectId+"/showProjectStateView.do");
	}
	// 뒤로가기 버튼 눌렀을 때
	function moveProjectListPage() {
		MindsJS.movePage("/oper/project/projectList.do");
	}
	return {
		init: init
	}
})();