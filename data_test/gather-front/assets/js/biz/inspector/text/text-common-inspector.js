(function ($) {
	$.fn.initTextProject = function(settings) {
		var $this = $(this);
		var _object = new TextJS.createJobInfo($this, settings);
		return _object;
	}
	$.initTextProject = function(settings) {
		var _object = new TextJS.createJobInfo(null, settings);
		return _object;
	}
	// MRC 기본 UI 객체화 
	$.fn.regContextUi = function(setting) {
		var $this = $(this);
		var _ui = new TextUI.CreateUiHandler($this, setting);
		return _ui;
	}
})(jQuery);

var TextUI = (function() {
	// ABOUT UI
	var $ui_parsed_article;
	var $ui_question_list;
	var $ui_job_comment_area;
	var $ui_answer_part1;
	var $ui_answer_part2;
	var $ui_expression_part1;

	function CreateUiHandler($this, settings) {
		var that = this;
		if(settings != null) {
			that._getValue = settings.getValue;
			that._mQaListSize = settings.qaListSize || 4;
			that._answer_part1 = settings.answer;
			that._answer_part2 = settings.clue;
			that._expression_part1 = settings.expression;
			that._usingShortcut = settings.shortcut;
			that._select_limit = settings.limit;
		}
		
		var _startPoint = 0;
		var _endPoint = 0;
		var $qaMap = new Map();
		
		init();
		function init() {
			// 화면의 UI Frame을 객체화
			$ui_parsed_article = $this.find(".parsed_article");
			$ui_question_list = $this.find(".question_list");
			$ui_job_comment_area = $this.find(".job_comment_area");
			//$ui_answer_part1 = $this.find(".answer_box.answer") || null;
			//$ui_answer_part2 = $this.find(".answer_box.reason") || null;
			$ui_answer_part1 = that._answer_part1 || null;
			$ui_answer_part2 = that._answer_part2 || null;
			$ui_expression_part1 = that._expression_part1 || null;
		}
		
		////////////////////////////////////////////////
		// 질문 (qustion_list)
		////////////////////////////////////////////////
		function setQuestionList(data, uiHandler) {
			/*if(data == null || data.length == 0) {
				// 빈공간 채우기
				fillQuestionListForEmpty(uiHandler);
				return;
			}*/
			
			data.inspect = true;
			var questionHtml = $.templates("#baseQaDataTemplate").render(data);
			$ui_question_list.html(questionHtml);
			
			for(var i in data) {
				if(data[i].division == 'MQ') {
					if($qaMap.get(data[i].contentId) == null) {
						$qaMap.set(data[i].contentId, data[i]);	
					}
				}
			}
			// 빈공간 채우기
			fillQuestionListForEmpty(uiHandler);
			
			// 리스트가 갱신될 때 (신규 생성이나 항목이 제거 됐을 때)
			if(data.length > 0) {
				$ui_question_list.find("li").eq(0).click();
			}
			return $qaMap;
		}
		function fillQuestionListForEmpty(uiHandler) {
			/*var li_list = $ui_question_list.find("li");
			if(li_list.length < that._mQaListSize) {
				var nAddCount = that._mQaListSize-li_list.length;
				// empty template
				var questionHtml = $.templates("#emptyQaTemplate").render();
				for(var i=0; i<nAddCount; i++) {
					$ui_question_list.append(questionHtml);
				}
			}*/

			$ui_question_list.find("li").off("click").on("click", showAnswer)// TR 이벤트
			$ui_question_list.find("button").off("click").on("click", uiHandler);	// 버튼 이벤트

			MindsMrcMarkup.loadMarkup();
		}
		function showAnswer() {
			$(this).siblings("li").removeClass("activate");
			$(this).addClass("activate");
			
			var mqContentId = $(this).attr("qaid");
			var $mainQuestion = {};
			if($qaMap != null) {
				$mainQuestion = $qaMap.get(mqContentId);
				if(typeof $mainQuestion === 'undefined') {
					$mainQuestion = {};
				}
			} else {
				return;
			}
			
			// 변경되면 답변 영역으로 하이라이드 이동
			if($ui_answer_part1 != null) {
				$ui_answer_part1.parents(".answer_whole:first").addClass("active");
				$ui_answer_part1.text(!$.isEmpty($mainQuestion.answer) ? $mainQuestion.answer : "");
				$ui_answer_part1.parents(".answer_whole:first").css("background-color", "#ededed");
			}
			if($ui_answer_part2 != null) {
				$ui_answer_part2.parents(".answer_whole:first").removeClass("active")
				$ui_answer_part2.text(!$.isEmpty($mainQuestion.reason_morpheme) ? $mainQuestion.reason_morpheme : "");
				$ui_answer_part2.parents(".answer_whole:first").css("background-color", "#ffffff");
			}

			$ui_parsed_article.find("span.pink").removeClass("pink");
			$ui_parsed_article.find("span.orange").removeClass("orange");
			
			// 본문 영역에 색상 표시
			if($mainQuestion != null) {
				var startPoint = $mainQuestion.start_index *1;
				var endPoint = $mainQuestion.end_index *1;
				for(var i=startPoint*1; i<endPoint*1; i++) {
					var $that = $("span[startindex="+i+"]");
					$that.addClass("pink");
				}
				
				var reasonStartPoint = $mainQuestion.reason_start_index *1;
				var reasonEndPoint = $mainQuestion.reason_end_index *1;
				for(var i=reasonStartPoint*1; i<reasonEndPoint*1; i++) {
					var $that = $("span[startindex="+i+"]");
					$that.addClass("orange");
				}
			}
		}
		function questionBtnEventHandler() {
			
		}
		
		////////////////////////////////////////////////
		// Expressions (Category를 선택하게 된 근거 문장)
		////////////////////////////////////////////////
		function setExpressionList(data, uiHandler) {
			var exprHtml;
			if(data != null && data.length > 0) {
				data.inspect = true; 
				exprHtml = $.templates("#sentenceDataListTemplate").render(data);
			} else {
				var param = { colspan: 3, message : "No item", inspect : true };
				exprHtml = $.templates("#contentsEmptyTemplate").render(param);
			}
			
			var $ui_expression_act = $ui_expression_part1.html(exprHtml);
			$ui_expression_act.find("button").off("click").on("click", uiHandler);
			
			// 불러온 리스트의 색깔 적용을 위해 본문 하이라이트 초기화
			$ui_parsed_article.find("span.pink").removeClass("pink");
			$ui_parsed_article.find("span.orange").removeClass("orange");
			
			var qaMap = new Map();
			for(var i in data) {
				if(data[i].contextId != null && qaMap.get(data[i].contextId) == null) {
					qaMap.set(data[i].contextId, data[i]);	
				}
				
				var startPoint = data[i].reserve1 *1;
				var endPoint = data[i].reserve2 *1;
				for(var i=startPoint*1; i<endPoint*1; i++) {
					var $that = $("span[startindex="+i+"]", $ui_parsed_article);
					$that.addClass("pink");
				}
			}
			
			return qaMap;
		}

		function setFixedList(data, uiHandler) {
			var exprHtml;
			if(data != null && data.length > 0) {
				exprHtml = $.templates("#gtpSentenceTemplate").render(data);
			} else {
				var param = { colspan: 4, message : "No item" };
				exprHtml = $.templates("#contentsEmptyTemplate").render(param);
			}

			var $ui_expression_act = $ui_expression_part1.html(exprHtml);
			$ui_expression_act.find("em").off("click").on("click", uiHandler);

			// 불러온 리스트의 색깔 적용을 위해 본문 하이라이트 초기화
			$ui_parsed_article.find("span.pupple").removeClass("pupple");
			$ui_parsed_article.find("span.pink").removeClass("pink");

			var qaMap = new Map();
			var index = 0;
			for(var i in data) {
				index++;
				if(data[i].contextId != null && qaMap.get(data[i].contextId) == null) {
					qaMap.set(data[i].contextId, data[i]);
				}
				var startPoint = data[i].reserve1 *1;
				var endPoint = data[i].reserve2 *1;
				for(var j=startPoint*1; j<endPoint*1; j++) {
					var $that = $("span[si="+j+"]", $ui_parsed_article);
					$that.addClass("pupple");

					var sentence = $that.html();
					var $tr = $ui_expression_act.find("tr").eq(index-1);
					$tr.find("td").eq(0).html(index);
					$tr.find("td").eq(1).html(sentence);

					$that.find("em").html(index);
				}
			}
			return qaMap;
		}
		// tracking pre-set list
		function setPresetList(data, uiHandler) {
			var exprHtml;
			if(data != null && data.length > 0) {
				exprHtml = $.templates("#trackingDataTemplates").render(data);
			} else {
				var param = { colspan: 7, message : "No item" };
				exprHtml = $.templates("#contentsEmptyTemplate").render(param);
			}
			var $ui_expression_act = $ui_expression_part1.html(exprHtml);
			$ui_expression_act.find("em").off("click").on("click", uiHandler);
			// 불러온 리스트의 색깔 적용을 위해 본문 하이라이트 초기화
			$ui_parsed_article.find("span.pupple").removeClass("pupple");
			$ui_parsed_article.find("span.pink").removeClass("pink");

			$ui_expression_act.find(".toDate").datepicker({
				prevText: '이전 달',
				nextText: '다음 달',
				dateFormat: 'mm-dd',
				onSelect: function (date) {
					var startDate = $(this).datepicker('getDate');
					startDate.setDate(startDate.getDate() + 365);
				}
			});
			$(".hasDatepicker").attr("autocomplete", "off");

			var qaMap = new Map();
			var index = 0;
			for(var i in data) {
				index++;
				// job pre-set 과 work data를 동시에 만족하기 위한 꼼수
				if(data[i].contextId != null && qaMap.get(data[i].contextId) == null) {
					qaMap.set(data[i].contextId, data[i]);
				}
				if(data[i].contentId != null && qaMap.get(data[i].contentId) == null) {
					qaMap.set(data[i].contentId, data[i]);
				}
				var startPoint = !$.isEmptyObject(data[i].reserve1) ? data[i].reserve1 *1 : data[i].startIndex *1;
				var endPoint = !$.isEmptyObject(data[i].reserve2) ? data[i].reserve2 *1 : data[i].endIndex *1;

				for(var j=startPoint*1; j<endPoint*1; j++) {
					var $that = $("span[si="+j+"]", $ui_parsed_article);
					$that.addClass("pupple");

					var $tr = $ui_expression_act.find("tr").eq(index-1);
					$tr.find("td").eq(0).html(index);
					$tr.find("td").eq(1).html(data[i].context);

					if(j==startPoint) {
						$that.find("em").html(index);
					}
				}
			}
			return qaMap;
		}
		
		////////////////////////////////////////////////
		// Article (본문 글)
		////////////////////////////////////////////////
		function setArticle(data) {
			$ui_parsed_article.html(morpToText(data));
			
			// span간 간격조정 (자연스럽게)
			$ui_parsed_article.contents().filter(
				function() {
					return this.nodeType===3;
				}
			).remove();
			
			bindArticleEventHandler();
			return $ui_parsed_article;
		}
		function bindArticleEventHandler() {
			$this.find(".answer_whole").on("click", answerBoxEventHandler);
		}
		function answerBoxEventHandler(e) {
			$this.find(".answer_whole").css("background-color", "#ffffff");
			$this.find(".answer_whole").removeClass("active");
			
			$(this).css("background-color", "#ededed");
			$(this).addClass("active");
		}
		function articleMouseEventHandler(e) {
			if($ui_question_list == null 
					|| $.isEmpty($ui_question_list.find("li.activate").attr("qaid"))
			) {
				return;
			}
			if(e.type == 'mousedown') {
				_startPoint = e.currentTarget.attributes.startindex.value;
				return;
			}
			if(e.type == 'mouseup') {
				_endPoint = e.currentTarget.attributes.endindex.value;
			}
			
			// 거꾸로 드래그 했을 때 Indexing 반전
			if(_startPoint*1 >= _endPoint*1) {
				var temp = (_startPoint*1)+1;
				_startPoint = (_endPoint*1)-1;
				_endPoint = temp;
			}
			
			// mouseup이 됐을 때 화면에 반영
			var $that;
			var selectedText = "";
			
			if($ui_answer_part2 != null) {
				// 초기화
				if($ui_answer_part2.parents(".answer_whole:first").hasClass("active")) {
					$ui_parsed_article.find("span.orange").removeClass("orange");
				}
			}
			if($ui_answer_part1 != null) {
				// 초기화
				if($ui_answer_part1.parents(".answer_whole:first").hasClass("active")) {
					$ui_parsed_article.find("span.pink").removeClass("pink");
				}
			} else {
				return;				// $ui_answer_part1 가 null 이면 화면에 답변을 표시할 UI가 없음을 의미
			}
			
			// 선택된 내용을 다시 표시
			for(var i=_startPoint*1; i<_endPoint*1; i++) {
				$that = $("span[startindex="+i+"]");
				// 색깔 변경과 선택한 문장 저장을 위한 구간
				if($ui_answer_part1 != null && $ui_answer_part1.parents(".answer_whole:first").hasClass("active")) {
					$that.addClass("pink");
				} else if($ui_answer_part2 != null && $ui_answer_part2.parents(".answer_whole:first").hasClass("active")){
					$that.addClass("orange")
				} else if($ui_expression_part1 != null) {
					$that.addClass("pink");
				}
				selectedText += $that.text();
				// !!색깔 변경을 위한 구간 끝
			}
			
			var rtnMap = new Map();
			if($ui_answer_part1 != null && $ui_answer_part1.parents(".answer_whole:first").hasClass("active")) {
				rtnMap.start_index = _startPoint;
				rtnMap.end_index = _endPoint;
				rtnMap.answer = selectedText;
				
				$ui_answer_part1.html(selectedText);
			}
			else if($ui_answer_part2 != null && $ui_answer_part2.parents(".answer_whole:first").hasClass("active")) {
				rtnMap.reason_start_index = _startPoint;
				rtnMap.reason_end_index = _endPoint;
				rtnMap.reason_morpheme = selectedText;

				$ui_answer_part2.html(selectedText);
			}
			else if($ui_expression_part1 != null) {
				rtnMap.reserve1 = _startPoint;
				rtnMap.reserve2 = _endPoint;
				rtnMap.context = selectedText;
			}
			
			if($.isEmpty(rtnMap.answer) && $.isEmpty(rtnMap.reason_morpheme) && $.isEmpty(rtnMap.context)) {
				return;
			} else {
				if(that._getValue != null && typeof that._getValue === 'function') {
					if($ui_question_list != null && typeof $ui_question_list != 'undefined') {
						that._getValue($ui_question_list.find("li.question.activate").attr("qaid"), rtnMap);	
					} else {
						that._getValue(null, rtnMap);
					}
				}
			}
		}
		function clearArticle() {
			if($ui_parsed_article != null) {
				$ui_parsed_article.find("span.source_text").removeClass("pink");
				$ui_parsed_article.find("span.source_text").removeClass("orange");
			}
		}
		function clearAnswer() {
			if($ui_answer_part1 != null)
				$ui_answer_part1.html("");
			if($ui_answer_part2 != null)
				$ui_answer_part2.html("");
		}
		
		// Utility
		function morpToText(morpheme) {
			var morphemeHtml = "";
			var specific = "";
			
			var bInterrupt = false;
			
			$.each(morpheme, function() {
				var $this = this;
				// 태그가 시작되는지 판단 (위치 변경 불가능)
				if($this.morps == "<") {
					bInterrupt = true;
				}
				if(!bInterrupt) {
					morphemeHtml += $.templates("#morphemeTemplate").render($this);
				} else {
					specific += $this.morps;
				}
				// appending 작업이 끝나고 상태 변경 해야함 (위치 변경 불가)
				if($this.morps == ">") {
					bInterrupt = false;
					morphemeHtml += specific;
					specific = "";
				}
			});
			return morphemeHtml;
		}
		
		function setNewsList(data, selectNewsData) {
			if(data != null) {
				var mainText = "";
				var newsList = data.contentsList;
				var projectStatistics = data.projectStatistics;
				var contentParagraph = newsList.oriContext.split('\\n');
				var editedText = "";
				if(newsList.context == null){
					editedText = newsList.oriContext.replace(/\\n/gi, '\r\n');
				} else {
					editedText = newsList.context.replace(/\\n/gi, '\r\n');
				}
				for(var i=0; i<contentParagraph.length; i++){
					if(contentParagraph[i] != ''){
						mainText += "<div>" + contentParagraph[i] + "</div>";
					}
				}
				if(mainText != null) {
					//mainText = mainText.replace(/관련기사/g, '<em>관련기사</em>');
					mainText = mainText.replace(/기사/g, '<em>기사</em>');
					mainText = mainText.replace(/그림/g, '<em>그림</em>');
					mainText = mainText.replace(/사진/g, '<em>사진</em>');
					mainText = mainText.replace(/기자/g, '<em>기자</em>');
					mainText = mainText.replace(/편집자/g, '<em>편집자</em>');
					mainText = mainText.replace(/캡션/g, '<em>캡션</em>');
					mainText = mainText.replace(/캡쳐/g, '<em>캡쳐</em>');
					mainText = mainText.replace(/캡처/g, '<em>캡처</em>');
					mainText = mainText.replace(/그래픽/g, '<em>그래픽</em>');
					mainText = mainText.replace(/표/g, '<em>표</em>');
					mainText = mainText.replace(/스틸/g, '<em>스틸</em>');
					mainText = mainText.replace(/제공/g, '<em>제공</em>');
					mainText = mainText.replace(/DB/g, '<em>DB</em>');
				}
				
				$this.find("#script_box1 .textarea").html(mainText);
				$this.find("#script_box2 textarea").val(editedText);
				
				$this.find(".progress_cases .done em").html(projectStatistics.completeCnt);
				$this.find(".progress_cases .remain em").html(projectStatistics.leftCnt);
				$this.find(".progress_cases .total em").html(projectStatistics.totalCnt);
				
				// 작성중인 데이터
				if(selectNewsData != null && selectNewsData != undefined){
					selectNewsData();
				}
			}
		}
		
		function setNewsEditingList(data) {
			if(data != null && data.length > 0) {
				var editedText = data[0].context.replace(/\\n/gi, '\r\n');
//				var editedText = data[0].context;
				$this.find("#script_box2 textarea").val(editedText);
				$this.find("#contextId").val(data[0].contextId);
			} else {
				$this.find("#contextId").val("");
			}
		}
		
		function setBasicSntcList(data){
			if(data != null){
				// category
				$this.find("div.topic_box").text(data.contentsList.ctgPath);
				// 기본 문장
				$this.find("#basicQuestion").val(data.contentsList.question);
				$this.find("#basicAnswer").val(data.contentsList.answer);
				
				// 통계
				var projectStatistics = data.projectStatistics;
				$this.find(".progress_cases .done em").html(projectStatistics.completeCnt);
				$this.find(".progress_cases .total em").html(projectStatistics.totalCnt);
				$this.find(".progress_cases .rejected em").html(projectStatistics.rejectedCnt);
			}
		}
		
		function setSentenceList(data) {
			if(data != null && data.length > 0) {
				for(var i=0; i<data.length; i++) {
					$this.find("input[name='contextId']").eq(i).val(data[i].contextId);
					$this.find("input[name='question']").eq(i).val(data[i].question);
					$this.find("input[name='answer']").eq(i).val(data[i].answer);
				}
			}
		}
		
		function clearSentenceData() {
			// 기존 데이터 삭제 및 클레스 원복
			$this.find("form[name=work-data] input").val("");
			$this.find("form[name=work-data] li").removeClass();
		}
		
		return {
			init: init,
			setArticle: setArticle,		// 본문 채우기
			setQuestionList: setQuestionList,		// for MRC
			setExpressionList: setExpressionList,	// for XDC
			setFixedList: setFixedList,                // for GTP
			setPresetList: setPresetList,				// for Tracking
			clearAnswer: clearAnswer,
			setNewsList: setNewsList,					// for News
			setNewsEditingList: setNewsEditingList,		// for News
			setBasicSntcList:setBasicSntcList,			// for Sentence
			setSentenceList: setSentenceList,			// for Sentence
			clearSentenceData: clearSentenceData		// for Sentence
		}
	}
	
	return {
		CreateUiHandler: CreateUiHandler
	}
})();

var TextJS = (function() {
	var prefixUri = "/biz/text/";		// '/' 지우면 안된다.
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
			if(jobInfo.jobType == 'TA' || jobInfo.jobType == 'TQ' || jobInfo.jobType == 'TC') {
				param.contentKind = "MQ";
			}
			MindsJS.loadJson(
				requestApi.selectWorkData
				, param
				, function(result) {
					if(result.success) {
						var contentList = result.data;
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
				}
				, true
			);
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
			selectProjectCategorySubList: selectProjectCategorySubList,
			selectData: selectData,
			selectDetailData: selectDetailData,
			requestEvaluate: requestEvaluate,
			requestComplete: requestComplete,
			requestReject: requestReject
		}
	}
	
	/********* UTILITY *********/
	function convertContextToWord(text) {
		if(text == null || text.length <= 0) return;
		var text = replaceAll(text, "\\n", "<br>");

		var wordsList = text.split("");
		var parsedWordsList = [];
		var totLength = 0;
		// var incr_offset = 0;

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

		return parsedWordsList;
	}
	function replaceAll(str, targetChar, replaceChar) {
		return str.split(targetChar).join(replaceChar);
	}
	
	return {
		createJobInfo: createJobInfo,
		parseContext:	convertContextToWord
	}
})();