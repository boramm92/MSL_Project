(function ($) {
	$.fn.initVoiceProject = function(settings) {
		var $this = $(this);
		var _object = new VoiceJS.createJobInfo($this, settings);
		return _object;
	};
	$.initVoiceProject = function(settings) {
		var _object = new VoiceJS.createJobInfo(null, settings);
		return _object;
	}
})(jQuery);

var VoiceJS = (function() {
	var prefixUri = "/biz/sound/";		// '/' 지우면 안된다.
	var moveApi = {
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
			,requestEvaluate: prefixUri+"/evaluateJob.json"
			,requestConfirm: prefixUri+"/confirmJob.json"
			,requestReject: prefixUri+"/rejectJob.json"
			
			,getContext: prefixUri+that._jobClassName+"/getContext.json"	// job의 내용을 가져온다.
			,getContents: prefixUri+that._jobClassName+"/getContents.json"	// job 내에 등록된 세부 기준 콘텐츠를 가져온다
			,selectWorkData: prefixUri+that._jobClassName+"/selectWorkData.json"// 작업한 데이터를 가져온다.

			,selectProjectCategorySubList:	"/biz/comm/selectCode.json"
		};

		init();
		function init() {
		}
		
		function goHome(message) {
			$.confirm(
				message != null ? message : "프로젝트 목록 화면으로 이동합니다.<br>'OK'를 클릭하면 저장하지 않은 데이터는 사라집니다.<br>이동하시겠습니까?"
				, function() {
					MindsJS.movePage(moveApi.projectList);
				}
			);
		}
		
		function requestAssignJob(callback, failCallback) {
			var preJobType = jobInfo.jobType;
			MindsJS.loadJson(
				requestApi.requestAssignJob
				, {
					projectId : that._projectId
				}
				, function(result) {
					if(result.success) {
						jobInfo = result.data;
						if($.isEmpty(preJobType) || preJobType == jobInfo.jobType) {
							callback(jobInfo);	
						} else {
							MindsJS.movePage(prefixUri+that._projectId+"/projectDetail.do?jobType="+jobInfo.jobType);
						}
					} else {
						// 서버에서의 오류 응답
						if(typeof failCallback === 'function') {
							failCallback(result);
						}
					}
				}
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
			MindsJS.loadJson(requestApi.selectWorkData, param, function(result) {
				if(result.success) {
					var contentList = result.data;
					callback(contentList);
				} else {
					// 서버에서의 오류 응답
					if(typeof failCallback === 'function') {
						failCallback(result);
					}
				}
			});
		}
		
		function requestEvaluate($form, rejectComment) {
			var parameter = {};
			if($form != null) {
				parameter = $form.formJson();
			}
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			parameter.checkId = jobInfo.checkId;
			parameter.standJobId = jobInfo.standJobId;
			
			if(rejectComment != null) {
				parameter.comment = rejectComment;
			}
			MindsJS.loadJson(requestApi.requestEvaluate, parameter, function(result){
				if(result.success) {
					if(typeof that._callback === 'function') {
						that._callback(result);
					}
				} else {
				}
			});
		}
		function requestComplete() {
			var parameter = {};
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			parameter.checkId = jobInfo.checkId;
			parameter.standJobId = jobInfo.standJobId;
			
			MindsJS.loadJson(requestApi.requestConfirm, parameter, function(result) {
				if(result.success) {
					if(typeof that._callback === 'function') {
						that._callback(result);
					}
				} else {
				}
			});
		}
		function requestReject(rejectComment) {
			var parameter = {};
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			parameter.checkId = jobInfo.checkId;
			
			if(rejectComment != null) {
				parameter.comment = rejectComment;
			}
			
			MindsJS.loadJson(requestApi.requestReject, parameter, function(result) {
				if(result.success) {
					if(typeof that._callback === 'function') {
						that._callback(result);
					}
				} else {
				}
			});
		}
		
		return {
			init: init,
			goHome: goHome,
			requestAssignJob : requestAssignJob,
			getCurrentJobContext: getCurrentJobContext,
			selectCurrentContents: selectCurrentContents,
			selectData: selectData,
			requestEvaluate: requestEvaluate,
			requestComplete: requestComplete,
			requestReject: requestReject,
			selectProjectCategorySubList: selectProjectCategorySubList
		}
	}
	
	return {
		createJobInfo: createJobInfo
	}
})();