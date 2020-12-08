(function ($) {
	// UI SELECTOR가 기준이 될 때
	$.fn.initVideoProject = function(settings) {
		var $this = $(this);
		var _object = new VideoUI.createJobInfo($this, settings);
		return _object;
	};
	// UI가 없는 순수 OBJECT만 생성시
	$.initVideoProject = function(settings) {
		var _object = new VideoUI.createJobInfo(null, settings);
		return _object;
	};
})(jQuery);

var VideoUI = (function() {
	var prefixUri = "/biz/video/";		// '/' 지우면 안된다.
	var movePageUri = {
		projectList: "/project/projectList.do"
	}
	function createJobInfo($this, settings) {
		var that = this;
		this._projectId = settings.projectId;
		this._projectType = settings.projectType;
		this._jobType = settings.jobType;
		this._jobClassName = settings.jobClassName ? settings.jobClassName : "";
		this._errorHandler = settings.errorHandler;
		this._callback = settings.nextCallback;

		var jobInfo = {};

		var requestApi = {
			requestAssignJob: prefixUri+"/getCurrentJob.json"					// job을 할당받는다.
			,requestInspect : prefixUri+"/requestInspect.json"
			,requestIgnore: prefixUri+"/requestIgnore.json"

			,uploadFile: prefixUri+that._jobClassName+"/fileUpload.json"
			,getContext: prefixUri+that._jobClassName+"/getContext.json"	// job의 내용을 가져온다.
			,getVideo: prefixUri+that._jobClassName+"/getVideo.json"	// video 상세 내용을 가져온다.
			,getContents: prefixUri+that._jobClassName+"/getContents.json"	// job 내에 등록된 세부 기준 콘텐츠를 가져온다
			,saveWorkData: prefixUri+that._jobClassName+"/saveWorkData.json"
			,selectWorkData: prefixUri+that._jobClassName+"/selectWorkData.json"// 작업한 데이터를 가져온다.
			,clearData: prefixUri+that._jobClassName+"/clearWorkData.json"		// 작업한 데이터를 모두 지운다 (초기화)\
			,removeItem: prefixUri+that._jobClassName+"/removeWorkItem.json"

			,selectProjectCategorySubList:	"/biz/comm/selectCode.json"
			,loadGuideDocContents : "/guide/getGuideDocumentContents.json" //작업 가이드 팝업
		};

		init();
		function init() {
		}

		function goHome(message) {
			$.confirm(
				message != null ? message : "프로젝트 관리화면으로 이동합니다.<br>'OK'를 클릭하면 저장하지 않은 데이터는 사라집니다.<br>이동하시겠습니까?"
				, function() {
					MindsJS.movePage(movePageUri.projectList);
				}
			);
		}

		function requestAssignJob(callback, failCallback) {
			//var preJobType = jobInfo.jobType;
			MindsJS.loadJson(
				requestApi.requestAssignJob
				, {
					projectId : that._projectId
					,jobType : that._jobType
				}
				, function(result) {
					if(result.success) {
						$("div.reject_box", $this).html("");
						jobInfo = result.data;
						//if($.isEmpty(preJobType) || preJobType == jobInfo.jobType) {
						if(jobInfo != null) {
							// 상태가 반려일 때
							if(jobInfo.jobStatus == 'RJ') {
								var param = {title: "반려 사유 :", comment: jobInfo.rejectComment};
								$("div.reject_box", $this).html($.templates("#commentBoxTemplate").render(param));
								$.alert("검수자에 의해 반려된 항목입니다. 반려사유를 확인 후 수정해 주세요.",null,"확인");
							} else {
								$("div.reject_box", $this).hide();
							}
							if(typeof callback === 'function') {
								callback(jobInfo);
							}
							else { $.alert("첫번째 파라미터에 CALLBACK 함수가 필요합니다."); }
						} else {
							// JOB CARD 형태로 바뀌면서 제거
							//MindsJS.movePage(prefixUri+that._projectId+"/projectDetail.do?jobType="+jobInfo.jobType);
							$.alert("작업 가능한 프로젝트가 없습니다", function() {
								MindsJS.movePage("/project/projectList.do");
							});
						}
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback(result);
						}
					}
				}
				,true
			);
		}
		function selectProjectCategorySubList(callback) {
			MindsJS.loadJson(
				requestApi.selectProjectCategorySubList,
				{ grpCode : jobInfo.projectCtg },
				function(result) {
					var data = result.data;
					if(typeof callback === 'function') {
						callback(data);
					}
				}
				, true
			);
		}
		// job 기본정보, 파일정보나 포인트 정보
		function getCurrentJobContext(callback, failCallback) {
			MindsJS.loadJson(
				requestApi.getContext
				, {
					projectId : that._projectId
					,jobId : jobInfo.jobId
				}
				, function(result) {
					if(result.success) {
						callback(result.data);
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback(result);
						}
					}
				}
				,true
			);
		}

		// video 기본정보, 파일정보나 포인트 정보
		function getVideo(callback, failCallback) {
			MindsJS.loadJson(
				requestApi.getVideo
				, {
					projectId : that._projectId
					,jobId : jobInfo.jobId
				}
				, function(result) {
					if(result.success) {
						callback(result.data);
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback(result);
						}
					}
				}
				,true
			);
		}

		// job의 세부 contents 를 가져온다.
		function selectCurrentContents(callback, failCallback) {
			MindsJS.loadJson(
				requestApi.getContents
				, {
					projectId : that._projectId
					,jobId : jobInfo.jobId
					,standJobId : jobInfo.standJobId
				}
				, function(result) {
					if(result.success) {
						callback(result.data);
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback(result);
						}
					}
				}
				,true
			);
		}

		// 작업한 항목을 저장한다
		function saveContentForWork(parameter, callback, failCallback) {
			// var parameter = {};
			// if($form != null) {
			// 	parameter = $form.formJson();
			// }
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			MindsJS.loadJson(
				requestApi.saveWorkData
				, parameter
				, function(result) {
					if(result.success) {
						if(typeof callback === 'function') {
							callback(result.data);
						}
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback();
						}
					}
				}
				,true
			);
		}

		function saveContentForWorkByParameter(paramMap, callback, failCallback) {
			if(paramMap == null) return;

			// for stt-all
			var parameter = convertMapToJson(paramMap);

			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;

			MindsJS.loadJson(
				requestApi.saveWorkData
				, parameter
				, function(result) {
					if(result.success) {
						if(typeof callback === 'function') {
							callback(result.data);
						}
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback();
						}
					}
				}
				,true
			);
		}

		function uploadAttachFileForWork(param) {
			var blobFileData = param.file;
			var message = param.message != null ? param.message : "파일을 제출하시겠습니까?";
			$.confirm(
				message
				,function() {
					var formData = new FormData();
					formData.append("file", blobFileData);
					formData.append("projectId", that._projectId);
					formData.append("jobId", param.jobId);
					formData.append("contextId", param.contextId);
					formData.append("jobType", that._jobType);

					// 서버에 파일 전송 및 저장
					$.ajax({
						type: 'POST',
						url : requestApi.uploadFile,
						processData: false,
						contentType: false,
						data: formData,
						success: function(result){
							// callback 실행
							if(typeof that._callback === 'function') {
								that._callback(result);
							}
						},
						error: function(e){
							$.alert("파일 업로드 중 오류가 발생하였습니다. 다시 시도해 주세요.");
						}
					});
				}
				,null
				,"파일전송"
			);
		}
		function selectData(callback, failCallback) {
			if($.isEmpty(jobInfo) || $.isEmpty(jobInfo.workId)) {
				// 서버에서의 오류 응답
				if(typeof failCallback === 'function') {
					failCallback();
				}
				return;
			}
			var param = { projectId: that._projectId, workId : jobInfo.workId };
			MindsJS.loadJson(
				requestApi.selectWorkData
				, param
				, function(result) {
					if(result.success) {
						var contentList = result.data;
						callback(contentList);
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback(result);
						}
					}
				}
				,true
			);
		}

		function clearData(callback, failCallback) {
			if($.isEmpty(jobInfo) || $.isEmpty(jobInfo.workId)) {
				// 서버에서의 오류 응답
				if(typeof failCallback === 'function') {
					failCallback();
				}
				return;
			}
			var param = { workId : jobInfo.workId };
			MindsJS.loadJson(
				requestApi.clearData
				, param
				, function(result) {
					if(result.success) {
						callback();
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback(result);
						}
					}
				}
				,true
			);
		}

		function removeItem(param, callback, failCallback) {
			if($.isEmpty(jobInfo) || $.isEmpty(jobInfo.workId)) {
				// 서버에서의 오류 응답
				if(typeof failCallback === 'function') {
					failCallback();
				}
				return;
			}
			param.projectId = that._projectId;
			param.workId = jobInfo.workId;
			MindsJS.loadJson(
				requestApi.removeItem
				, param
				, function(result) {
					if(result.success) {
						//callback(result);
						callback();
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback();
						}
					}
				}
				,true
			);
		}

		function requestInspectForWork() {
			var param = jobInfo;
			param.projectId = that._projectId;
			MindsJS.loadJson(
				requestApi.requestInspect
				, param
				, function(result){
					if(result.success) {
						if(typeof that._callback === 'function') {
							that._callback(result);
						}
					} else {
					}
				}
				,true
			);
		}
		function requestIgnoreForWork(ignoreComment) {
			var param = jobInfo;
			param.projectId = that._projectId;
			param.comment = ignoreComment;

			MindsJS.loadJson(
				requestApi.requestIgnore
				, param
				, function(result){
					if(result.success) {
						if(typeof that._callback === 'function') {
							that._callback(result);
						}
					} else {
					}
				}
				,true
			);
		}
		function getJobGuide() {
			MindsJS.loadJson(
				requestApi.loadGuideDocContents
				,jobInfo
				,function(result) {
					popupGuide(jobInfo, result.data);
				}
			);
		}

		function popupGuide(jobInfo, data) {
			if(data != null) {
				if (data.docType == 'H') {
					// 0. 작업 가이드 POPUP을 생성한다.
					$mGuidePopup = $('<div class="pop_simple pop_custom" id="pop_work_guide" style="z-index:1020"></div>');
					// 1. 작업 가이드를 POP 한다
					$mGuidePopup.appendTo("body");
					// Document Type 이 HTML(H)이면 화면에 HTML을 표시
					if(data.guideContentsVoList != null && data.guideContentsVoList.length > 0) {
						var firstGuide = data.guideContentsVoList[0];
						firstGuide.projectId = data.projectId;
						firstGuide.docType = data.docType;
						var guideHtml = $.templates("#jobGuideTemplate").render(firstGuide);
						var $guideDialog = $mGuidePopup.html(guideHtml);
						$guideDialog.show();

						$guideDialog.find(".ico_close").on("click", function() {
							$guideDialog.remove();
						});
					} else {
						// 실제 가이드 문서가 없는 경우
						//clipNewJobInProject(data);
					}
				} else {
					// Document Type 이 AttachFile(A) 이면
					// 다운로드 할 수 있는 팝업을 지원하고
					// 수락 팝업을 한번 더 띄운다.
				}
			}
		}

		function autoRefresh(callback, millisecond) {
			if(millisecond == null) {
				millisecond = 60000;
			}
			setInterval(function(){
				if(callback != null && typeof callback === 'function') {
					callback(false);
				}
			}, millisecond);
		}

		return {
			init: init,
			goHome: goHome,
			requestAssignJob : requestAssignJob,
			getCurrentJobContext: getCurrentJobContext,
			getVideo: getVideo,
			selectCurrentContents: selectCurrentContents,
			selectProjectCategorySubList: selectProjectCategorySubList,
			saveContentForWork: saveContentForWork,
			saveContentForWorkByParameter: saveContentForWorkByParameter,
			uploadAttachFileForWork: uploadAttachFileForWork,
			selectData: selectData,
			clearData: clearData,
			removeItem: removeItem,
			requestInspectForWork: requestInspectForWork,
			requestIgnoreForWork: requestIgnoreForWork,
			autoRefresh: autoRefresh,
			getJobGuide: getJobGuide
		}
	}

	return {
		createJobInfo: createJobInfo
	}
})();