(function ($){
	$.fn.initImageProject = function(settings) {
		var $this = $(this);
		var _object = new ImageJS.createJobInfo($this, settings);
		return _object;
	}
})(jQuery);

var ImageJS = (function(){
		var prefixUri = "/biz/image/";		// '/' 지우면 안된다.
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
			this._isInteraction = $this != null;
			
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
		
		
		
		// ABOUT ACTION
		function goHome(message) {
			$.confirm(
				message != null ? message : "프로젝트 관리화면으로 이동합니다.<br>'OK'를 클릭하면 저장하지 않은 데이터는 사라집니다.<br>이동하시겠습니까?"
				, function() {
					MindsJS.movePage(movePageUri.projectList);
				}
			);
		}
		// 내가 찜 한, 또는 작업 가능한 프로젝트(JOB)을 가져온다.
		function requestAssignJob(callback, failCallback) {
			// 콘텐츠를 가져올 때 UI를 변경할 지 여부를 판단하기 위한
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
							if(typeof callback === 'function') {
								callback(jobInfo);
							} 
							else { $.alert("첫번째 파라미터에 CALLBACK 함수가 필요합니다."); }
						} else {
							MindsJS.movePage(prefixUri+that._projectId+"/projectDetail.do?jobType="+jobInfo.jobType);
						}
					} else {
						// 서버에서의 오류 응답 줄 때 (RestController에서 return fail()일 때)
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
		
		// 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.
		function selectData(callback, failCallback) {
			if($.isEmpty(jobInfo) || $.isEmpty(jobInfo.workId)) {
				// 서버에서의 오류 응답
				if(typeof failCallback === 'function') {
					failCallback();
				}
				return;
			}
			var param = { projectId: that._projectId, workId : jobInfo.workId };
			//if(jobInfo.jobType != 'XD') {
			if(jobInfo.jobType == 'TA' || jobInfo.jobType == 'TQ' || jobInfo.jobType == 'TC') {
				param.contentKind = "MQ";
			}
			MindsJS.loadJson(requestApi.selectWorkData, param, function(result) {
				if(result.success) {
					var contentList = result.data;
//					result.projectId = that._projectId;
//					result.status = jobInfo.jobStatus;
					if(contentList.length > 0) {
						contentList.status = jobInfo.jobStatus;
					}
					callback(contentList);
				} else {
					// 서버에서의 오류 응답
					if(typeof failCallback === 'function') {
						failCallback(result);
					}
				}
			});
		}
		
		function requestEvaluate($form) {
			var parameter = {};
			if($form != null) {
				parameter = $form.formJson();
			}
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			parameter.checkId = jobInfo.checkId;
			parameter.standJobId = jobInfo.standJobId;
			
			MindsJS.loadJson(requestApi.requestEvaluate, parameter, function(result){
				if(result.success) {
					if(typeof that._callback === 'function') {
						that._callback(result);
					}
				} else {
				}
			});
		}
		
		// 승인(검수&다음파일)
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
		
		// 반려
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
			requestAssignJob: requestAssignJob,
			getCurrentJobContext: getCurrentJobContext,
			selectData: selectData,
			requestEvaluate: requestEvaluate,
			requestComplete: requestComplete,
			requestReject: requestReject
		}
		
	}
	function replaceAll(str, targetChar, replaceChar) {
		return str.split(targetChar).join(replaceChar);
	}
	
	return {
		createJobInfo:	createJobInfo
	}
})();