(function ($){
	$.fn.initImageProject = function(settings) {
		var $this = $(this);
		var _object = new ImageJS.createJobInfo($this, settings);
		return _object;
	}
	
	$.fn.regContextUi = function(setting) {
		var $this = $(this);
		var _ui = new ImageUI.CreateUiHandler($this, setting);
		return _ui;
	}
})(jQuery);

var ImageUI = (function() {
	// ABOUT UI
	var $ui_expression_part1;
	
	function CreateUiHandler($this, settings) {
		var that = this;
		if(settings != null) {
			that._getValue = settings.getValue;
			that._expression_part1 = settings.expression;
		}
		
		init();
		function init() {
			// 화면의 UI Frame을 객체화
//			$ui_parsed_article = $this.find(".parsed_article");
//			$ui_question_list = $this.find(".question_list");
//			$ui_job_comment_area = $this.find(".job_comment_area");
			//$ui_answer_part1 = $this.find(".answer_box.answer") || null;
			//$ui_answer_part2 = $this.find(".answer_box.reason") || null;
			$ui_expression_part1 = that._expression_part1 || null;
		}
		

		////////////////////////////////////////////////
		// Expressions (Category를 선택하게 된 근거 문장)
		////////////////////////////////////////////////
		function setExpressionList(data, uiHandler) {
			var exprHtml;
			if(data != null && data.length > 0) {
				exprHtml = $.templates("#cropDataTemplate").render(data);
			} else {
				var param = { colspan: 3, message : "선택된 이미지가 없습니다." };
				exprHtml = $.templates("#contentsEmptyTemplate").render(param);				
			}

			var $ui_expression_act = $ui_expression_part1.html(exprHtml);
			//$ui_expression_act.find("button").off("click").on("click", uiHandler);
			$ui_expression_act.find("em").off("click").on("click", uiHandler);
			
			var qaMap = new Map();
			for(var i in data) {
				if(data[i].contextId != null && qaMap.get(data[i].contextId) == null) {
					qaMap.set(data[i].contextId, data[i]);	
				}
				var startPoint = data[i].reserve1 *1;
				var endPoint = data[i].reserve2 *1;
				for(var j=startPoint*1; j<endPoint*1; j++) {
					var $that = $("span[si="+j+"]", $ui_parsed_article);
					$that.addClass("pupple");
				}
			}
			return qaMap;
		}
		
		return {
			init: init,
			setFixedList: setFixedList
		}
	}
	
	return {
		CreateUiHandler: CreateUiHandler
	}
})();

var ImageJS = (function(){
	var prefixUri = "/biz/image/";
	
	function createJobInfo($this, settings) {
		var that = this;
		// properties
		this._projectId = settings.projectId;
		this._projectType = settings.projectType;
		this._jobType = settings.jobType;
		this._jobClassName = settings.jobClassName ? settings.jobClassName : "";
		this._errorHandler = settings.errorHandler;
		this._modalCallbak = settings.modalCallback;
		this._callback = settings.nextCallback;
		this._isInteraction = $this != null;
		
		var jobInfo = {};
		var movePageUri = {
			projectList: "/project/projectList.do"
		};
		var requestApi = {
			requestAssignJob:	prefixUri+"/getCurrentJob.json",				// job을 할당받는다.
			requestInspect:		prefixUri+"/requestInspect.json",				// 검수요청
			requestIgnore:		prefixUri+"/requestIgnore.json",				// 작업불가 요청
			requestGiveupTask:	prefixUri+"/requestGiveup.json",									// GIVE UP
			
			uploadFile:			prefixUri+that._jobClassName+"/fileUpload.json",
			getContext:			prefixUri+that._jobClassName+"/getContext.json",	// job의 내용을 가져온다.
			getContents:		prefixUri+that._jobClassName+"/getContents.json",	// job 내에 등록된 세부 기준 콘텐츠를 가져온다
			saveQuestionData:	prefixUri+that._jobClassName+"/saveQuestionData.json",	// quest modal 에서 저장되는 내용
			saveWorkData:		prefixUri+that._jobClassName+"/saveWorkData.json",		// quest에 대응하는 질문과 Clue를 저장하는 내용
			selectWorkData:		prefixUri+that._jobClassName+"/selectWorkData.json",	// 작업한 데이터를 가져온다.
			clearData:			prefixUri+that._jobClassName+"/clearWorkData.json",		// 작업한 데이터를 모두 지운다 (초기화)
			removeItem:			prefixUri+that._jobClassName+"/removeWorkItem.json",
			
			selectProjectCategorySubList:	"/biz/comm/selectCode.json"
		};
		
		init();
		function init() {}
		
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
		
		function saveQuestionForWork(parameter, callback, failCallback) {
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			
			MindsJS.loadJson(requestApi.saveQuestionData, parameter, function(result) {
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
			});
		}
		
		// 답변, clue 데이터를 json으로 변환 필요
		function saveContentForWork(parameter, callback, failCallback) {
			var param = convertMapToJson(parameter);
			
			param.projectId = that._projectId;
			param.jobId = jobInfo.jobId;
			param.workId = jobInfo.workId;
			
			MindsJS.loadJson(requestApi.saveWorkData, param, function(result) {
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
			});
		}
		function saveContentForWorkForXDC(parameter, callback, failCallback) {
			var param = convertMapToJsonForXDC(parameter);
			
			param.projectId = that._projectId;
			param.jobId = jobInfo.jobId;
			param.workId = jobInfo.workId;
			param.projectCtg = jobInfo.projectCtg;		// XDC_DISC
			param.classify = parameter.classify;
			
			MindsJS.loadJson(requestApi.saveWorkData, param, function(result) {
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
			});
		}
		function saveContentForWorkForCrop(parameter, callback, failCallback) {
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;

			MindsJS.loadJson(requestApi.saveWorkData, parameter, function(result) {
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
			});
		}
		function convertMapToJsonForGTP(parameter) {
			var param = {};

			var contextId = [];
			var reserve1 = [], reserve2 = [], context = [];

			parameter.forEach((value, key) => {
				if($.isEmpty(value.contextId)) {
					contextId.push("");
				} else {
					contextId.push(value.contextId);
				}
				reserve1.push(typeof value.reserve1 === "undefined" ? "" : value.reserve1);
				reserve2.push(typeof value.reserve2 === "undefined" ? "" : value.reserve2);
				context.push(typeof value.sentence === "undefined" ? "" : value.sentence);
			});

			param.contextId = contextId;
			param.reserve1 = reserve1;
			param.reserve2 = reserve2;
			param.context = context;

			return param;
		}
		function convertMapToJsonForXDC(parameter) {
			var param = {};
			// for xdc
			var contextId = [];
			var reserve1 = [], reserve2 = [], context = [];
			
			parameter.forEach((value, key) => {
				if($.isEmpty(value.contextId)) {
					contextId.push("");
				} else {
					contextId.push(value.contextId);
				}
				reserve1.push(typeof value.reserve1 === "undefined" ? "" : value.reserve1);
				reserve2.push(typeof value.reserve2 === "undefined" ? "" : value.reserve2);
				context.push(typeof value.context === "undefined" ? "" : value.context);
			});
			
			param.contextId = contextId;
			param.reserve1 = reserve1;
			param.reserve2 = reserve2;
			param.context = context;
			
			return param;
		}
		function convertMapToJson(parameter) {
			var param = {};
			
			// for mrc
			var qa_id = [], answer = [], startIdx = [], endIdx = [];
			var reason = [], reason_start_index = [], reason_end_index = [];
			var answer_contentId = [], reason_contentId = [];
			
			parameter.forEach((value, key) => {
				qa_id.push(value.qa_id);
				
				answer.push(typeof value.answer === "undefined" ? "" : value.answer);
				startIdx.push(typeof value.start_index === "undefined" ? "" : value.start_index);
				endIdx.push(typeof value.end_index === "undefined" ? "" : value.end_index);
				answer_contentId.push(typeof value.answer_contentId === "undefined" ? "" : value.answer_contentId);
				
				reason.push(typeof value.reason_morpheme === "undefined" ? "" : value.reason_morpheme);
				reason_start_index.push(typeof value.reason_start_index === "undefined" ? "" : value.reason_start_index);
				reason_end_index.push(typeof value.reason_end_index === "undefined" ? "" : value.reason_end_index);
				reason_contentId.push(typeof value.reason_contentId === "undefined" ? "" : value.reason_contentId);
			});

			param.qa_id = qa_id;
			param.answer = answer;
			param.start_index = startIdx;
			param.end_index = endIdx;
			param.answer_contentId = answer_contentId;
			
			param.reason = reason;
			param.reason_start_index = reason_start_index;
			param.reason_end_index = reason_end_index;
			param.reason_contentId = reason_contentId;
			
			return param;
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
		function selectDetailData(contentId, callback, failCallback) {
			if($.isEmpty(jobInfo) || $.isEmpty(jobInfo.workId)) {
				// 서버에서의 오류 응답
				if(typeof failCallback === 'function') {
					failCallback();
				}
				return;
			}
			var param = { projectId: that._projectId, workId : jobInfo.workId,  qa_id: contentId };
			MindsJS.loadJson(requestApi.selectWorkData, param, function(result) {
				if(result.success) {
					var contentList = result.data;
					contentList.projectId = that._projectId;
					contentList.status = jobInfo.jobStatus;
					callback(contentList);
				} else {
					// 서버에서의 오류 응답
					if(typeof failCallback === 'function') {
						failCallback(result);
					}
				}
			});
		}
		
		// 검수요청
		function requestInspectForWork() {
			var param = jobInfo;
			param.projectId = that._projectId;
			MindsJS.loadJson(requestApi.requestInspect, param, function(result){
				if(result.success) {
					if(typeof that._callback === 'function') {
						that._callback(result);
					}
				} else {
				}
			});
		}
		
		// 작업불가요청
		function requestIgnoreForWork(comment) {
			var param = jobInfo;
			param.projectId = that._projectId;
			
			if(comment != null) param.comment = comment;
			MindsJS.loadJson(requestApi.requestIgnore, param, function(result){
				if(result.success) {
					if(typeof that._callback === 'function') {
						that._callback(result);
					}
				} else {
				}
			});
		}
		
		// give up
		function requestGiveupTask() {
			var param = jobInfo;
			param.projectId = that._projectId;
			MindsJS.loadJson(requestApi.requestGiveupTask, param, function(result){
				if(result.success) {
					if(typeof that._callback === 'function') {
						that._callback(result);
					}
				} else {
				}
			});
		}
		
		function removeItem(contentId, callback) {
			var param = jobInfo;
			param.contentId = contentId;
			MindsJS.loadJson(requestApi.removeItem, param, function(result){
				if(result.success) {
					if(callback != null && typeof callback === 'function') {
						callback();
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
			//selectCurrentContents: selectCurrentContents,
			//selectProjectCategorySubList: selectProjectCategorySubList,
			//saveQuestionForWork: saveQuestionForWork,		// Modal에서 Question 저장 (Submit)
			//saveContentForWork: saveContentForWork,
			//saveContentForWorkForXDC: saveContentForWorkForXDC,
			saveContentForWorkForCrop: saveContentForWorkForCrop,
			selectData: selectData,
			//selectDetailData: selectDetailData,
			requestInspectForWork: requestInspectForWork,
			requestIgnoreForWork: requestIgnoreForWork,
			removeItem: removeItem
		}
	
	}
	function convertContextToWord(text) {
		if(text == null || text.length <= 0) return;
		
		var wordsList = text.split("");
		var parsedWordsList = [];
		var totLength = 0;
		var incr_offset = 0;
		
		var bInterrupt = false;
		$.each(wordsList, function() {
			var $this = this;

			var startIndex = totLength;
			var wordLength = $this.length;
			
			// 태그가 시작되는지 판단 (위치 변경 불가능)
			if($this == "<") {
				bInterrupt = true;
			}
			var item = {};
			if(!bInterrupt) {
				item.start = totLength;
				item.morps = $this;
				item.end = (startIndex*1)+(wordLength*1);
				totLength += wordLength;
			} else {
				item.morps = $this;
			}
			// appending 작업이 끝나고 상태 변경 해야함 (위치 변경 불가)
			if($this == ">") {
				bInterrupt = false;
			}
			parsedWordsList.push(item);
		});
		/*if(wordsList != null && wordsList.length > 0) {
			for(var i in wordsList) {
				var startIndex = totLength;
				var wordLength = wordsList[i].length;
				
				var item = {};
				item.start = totLength;
				item.morps = wordsList[i];
				item.end = (startIndex*1)+(wordLength*1);
				totLength += wordLength;
				
				parsedWordsList.push(item);
			}
		}*/
		return parsedWordsList;
	}
	function replaceAll(str, targetChar, replaceChar) {
		return str.split(targetChar).join(replaceChar);
	}
	
	return {
		createJobInfo:	createJobInfo,
		parseContext:	convertContextToWord
	}
})();