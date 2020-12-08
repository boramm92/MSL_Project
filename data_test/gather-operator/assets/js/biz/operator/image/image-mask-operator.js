var imageMaskViewScript4Oper = (function() {
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

/**
 * 지우지 마시오
 */

// var imageMaskViewScript4Oper = (function() {
// 	// 	프로젝트 기본정보는 mProjectInfo 객체에서 전역으로 사용한다.
// 	var $mP;
// 	var nTopicMax = 5;
// 	var mParamRemoveList = [];
//
// 	var requestApi = {
// 		selectProjectList: "/oper/project/selectProjectList.json",
// 		goDashboard: "/oper/project/projectList.do"
// 	};
// 	var mProjectInfo = {};
//
// 	function init(projectId) {
// 		var param = {};
// 		param.projectId = projectId;
// 		param.pagingYn = 'N';
// 		MindsJS.loadJson(
// 			requestApi.selectProjectList,
// 			param,
// 			function(result) {
// 				if(result.success) {
// 					if(result.data != null && result.data.length > 0) {
// 						mProjectInfo = result.data[0];
//
// 						$mP = $("div.container");
// 						bindEventHandler();
// 						loadData();
//
// 						$(".page_loading").addClass("pageldg_hide").delay(300).queue(function() {
// 							$(this).remove();
// 						});
//
// 						$("input[name=findFile]", $mP).findFile({
// 							filelist : $(".showUploadBox", $mP)		// 업로드한 파일을 표시해줄 오브젝트
// 						});
// 					} else {
// 						$.alert("프로젝트를 불러오지 못했습니다.", function() {
// 							MindsJS.movePage(requestApi.goDashboard);
// 						});
// 						return;
// 					}
// 				} else {
// 					$.alert("프로젝트를 불러오지 못했습니다.", function() {
// 						MindsJS.movePage(requestApi.goDashboard);
// 					});
// 					return;
// 				}
// 			}
// 		);
// 	}
// 	function bindEventHandler() {
// 		$("button.btnUpload", $mP).on("click", fileUpload);
//
// 		$("button.btnSave", $mP).on("click", saveData);
// 		$("button.btnPost", $mP).on("click", postProject);
// 		$("button.btnCancel", $mP).on("click", stopProject);
// 		$("button.btnPause", $mP).on("click", pauseProject);
// 		$("button.btnBack", $mP).on("click", moveProjectListPage);
// 		$("button.btnAddBlankTopic", $mP).on("click", addEmptyTopic);	// 빈 토픽입력폼 추가 (+)
// 		$("button.btnRegistTopic", $mP).on("click", registTopic);		// 토픽 저장
// 	}
//
// 	function loadData() {
// 		getProjectDetailInfo();
// 		selectUploadFileList();
// 		selectMaskingTopicList();
// 	}
//
// 	// 프로젝트 기본정보 가져오기
// 	function getProjectDetailInfo() {
// 		// 프로젝트가 게시중이면 내용을 변경할 수 없음
// 		var currStatus = mProjectInfo.status;
// 		if(currStatus == 'RDY' || currStatus == 'REQ' || currStatus == 'EGH' || currStatus == 'EXP') {
// 			$("form[name=form-project]", $mP).find("input").attr("readonly", true);
// 		} else {
// 			$("form[name=form-project]", $mP).find("input").removeAttr("readonly");
// 		}
// 	}
//
// 	// 프로젝트에 첨부된 파일목록 가져오기
// 	function selectUploadFileList() {
// 		var param =  {projectId: mProjectInfo.projectId};
// 		ImageJS.selectUploadFileList(param, uploadResult);
// 	}
//
// 	// 프로젝트의 목적인 이미지에서 지우기 할 내용목록 가져오기 (pjt_master 의 title에 임시저장)
// 	function selectMaskingTopicList() {
// 		var title = mProjectInfo.title;
// 		if(title == null) {
// 			// split 할 내용이 없다면 리턴
// 			return;
// 		}
// 		var list = title.split(",");
// 		var data = [];
// 		for(var i in list) {
// 			var temp = list[i];
// 			if(temp != null && temp.length > 0) {
// 				var map = {};
// 				map.context = temp;
// 				data.push(map);
// 			}
// 		}
// 		if(data.length > 0) {
// 			renderTopic(data);
// 		} else {
// 			addEmptyTopic();
// 		}
// 	}
//
// 	// 파일 업로드 + JOB 생성
// 	function fileUpload() {
// 		var param = mProjectInfo;
// 		param.fileEncoding = "utf-8";
// 		ImageJS.jobFileUpload(param, $("input[name=findFile]"), uploadResult);
// 	}
//
// 	// 프로젝트 기본정보 저장
// 	function saveData() {
// 		var param =  $("form[name=form-project]", $mP).formJson();
// 		ImageJS.saveProjectInfo(param);
// 	}
//
// 	// 프로젝트 게시
// 	function postProject() {
// 		// 수정된 내용은 저장하지 않고 게시만 할 경우
// 		//var param =  {projectId: "${pjtInfo.projectId}"};
// 		// 수정된 내용까지 저장하면서 게시할 경우
// 		var param =  $("form[name=form-project]", $mP).formJson();
// 		ImageJS.postProject(param, moveProjectListPage);
// 	}
//
// 	// 프로젝트 일시정지
// 	function pauseProject() {
// 		var param =  {projectId: mProjectInfo.projectId};
// 		ImageJS.pauseProject(param);
// 	}
//
// 	// 프로젝트 취소
// 	function stopProject() {
// 		var param =  {projectId: mProjectInfo.projectId};
// 		ImageJS.stopProject(param, moveProjectListPage);
// 	}
//
// 	// 이미지에서 지우기 할 토픽 등록
// 	function registTopic() {
// 		var param = $("form[name=form-topic]", $mP).formJson();
// 		param.projectId = mProjectInfo.projectId;
//
// 		var topicNames = param.topicName;
// 		if(typeof topicNames === 'object') {
// 			var title = "";
// 			for(var i in topicNames) {
// 				if(title.length > 0) {
// 					title += ",";
// 				}
// 				title += topicNames[i];
// 			}
// 			param.title = title;
// 		} else {
// 			param.title = topicNames;
// 		}
// 		MindsJS.loadJson(
// 			"/oper/image/registMaskList.json",
// 			param,
// 			function(result) {
// 				if(result.success) {
// 					var data = result.data;
// 					renderTopic(data);
// 					$.alert("저장했습니다.");
// 				} else {
// 					$.alert("등록된 TOPIC 목록을 가져올 수 없습니다.");
// 				}
// 			}
// 		);
// 	}
//
// 	// 파일삭제, 생성된 JOB도 같이 제거
// 	function deleteAtchFile() {
// 		var param = mProjectInfo;
//
// 		var $this = $(this);
// 		param.atchFileId = $this.attr("btnId");
// 		param.jobId = $this.attr("jobId");
// 		$.confirm(
// 			"파일을 삭제하면 JOB도 함께 삭제 됩니다. 삭제하시겠습니까?"
// 			, function() {
// 				MindsJS.loadJson(
// 					"/oper/project/removeAttachFile.json"
// 					,param
// 					,function(result) {
// 						selectUploadFileList();
// 					}
// 				);
// 			}
// 			, null
// 			, "JOB 삭제"
// 		);
// 	}
//
// 	//** UTILS **//
// 	function moveProjectListPage() {
// 		MindsJS.movePage("/oper/project/projectList.do");
// 	}
//
// 	function uploadResult(data) {
// 		if(data.data == null) {
// 			return;
// 		}
// 		var fileList = data.data;
// 		fileList.status = mProjectInfo.status;
// 		var html = $.templates("#uploadListTemplate").render(fileList);
// 		var $selectedFileList = $("div.uploadFileList", $mP).append(html);
// 		$selectedFileList.find("button").on("click", deleteAtchFile);
// 	}
//
// 	function renderTopic(data) {
// 		data.status = mProjectInfo.status;
// 		var html = $.templates("#imageMaskTopicTemplate").render(data);
// 		var $topicBody = $("tbody.tbodyTheme", $mP).html(html);
// 		$topicBody.find("tr button").off("click").on("click", removeTopic);
// 	}
// 	function addEmptyTopic() {
// 		var rowCount = $("tbody.tbodyTheme", $mP).find("tr.topic").length;
// 		if(rowCount < nTopicMax) {
// 			var data = { status: mProjectInfo.status };
// 			var html = $.templates("#imageMaskTopicTemplate").render(data);
// 			var $topicBody = $("tbody.tbodyTheme", $mP).append(html);
// 			$topicBody.find("tr button").off("click").on("click", removeTopic);
// 		} else {
// 			$.alert("Topic 최대개수는 " + nTopicMax + "개 입니다.");
// 		}
// 	}
// 	function removeTopic() {
// 		var $parent = $(this).parents("tr:first").remove();
// 		// 기존 등록 목록에 포함됐다면
// 		if($parent.find("input[name=contextId]").val() != "") {
// 			// 삭제 목록에 등록
// 			mParamRemoveList.push($parent.find("input[name=contextId]").val());
// 		} else {
// 			// ui만 삭제
// 			$parent.remove();
// 		}
// 	}
//
// 	return {
// 		init: init
// 	}
// })();