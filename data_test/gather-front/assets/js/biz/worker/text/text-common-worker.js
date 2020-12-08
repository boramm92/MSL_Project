(function ($) {
	// UI SELECTOR가 기준이 될 때
	$.fn.initTextProject = function(settings) {
		var $this = $(this);
		var _object = new TextJS.createJobInfo($this, settings);
		return _object;
	};
	// UI가 없는 순수 OBJECT만 생성시
	$.initTextProject = function(settings) {
		var _object = new TextJS.createJobInfo(null, settings);
		return _object;
	};
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
			}
			*/
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
			//if(data.length > 0) {
				$ui_question_list.find("li").eq(0).click();
				if($ui_answer_part1 != null) {
					$ui_answer_part1.click();
				}
			//}
			return $qaMap;
		}
		function fillQuestionListForEmpty(uiHandler) {
			$ui_question_list.find("li").off("click").on("click", showAnswer)// TR 이벤트
			$ui_question_list.find("em").off("click").on("click", uiHandler);	// 제거,수정 버튼 이벤트
			
			MindsMrcMarkup.loadMarkup();
		}
		function showAnswer() {
			$(this).siblings("li").removeClass("active");
			$(this).addClass("active");
			
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
				$ui_answer_part1.addClass("active");
				$ui_answer_part1.find("span.tagging").html("# "+$mainQuestion.qa_ctg);
				$ui_answer_part1.find("span.tagging").next().html(!$.isEmpty($mainQuestion.answer) ? $mainQuestion.answer : "");
			}
			if($ui_answer_part2 != null) {
				$ui_answer_part2.removeClass("active")
				$ui_answer_part2.find("span.tagging").html("# "+$mainQuestion.qa_ctg);
				$ui_answer_part2.find("span.tagging").next().html(!$.isEmpty($mainQuestion.reason_morpheme) ? $mainQuestion.reason_morpheme : "");
			}

			$ui_parsed_article.find("span.pupple").removeClass("pupple");
			$ui_parsed_article.find("span.pink").removeClass("pink");
			
			// 본문 영역에 색상 표시
			if($mainQuestion != null) {
				var startPoint = $mainQuestion.start_index *1;
				var endPoint = $mainQuestion.end_index *1;
				for(var i=startPoint*1; i<endPoint*1; i++) {
					var $that = $("span[si="+i+"]");
					$that.addClass("pupple");
				}
				
				var reasonStartPoint = $mainQuestion.reason_start_index *1;
				var reasonEndPoint = $mainQuestion.reason_end_index *1;
				for(var i=reasonStartPoint*1; i<reasonEndPoint*1; i++) {
					var $that = $("span[si="+i+"]");
					$that.addClass("pink");
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
				exprHtml = $.templates("#sentenceDataListTemplate").render(data);
			} else {
				var param = { colspan: 3, message : "No item" };
				exprHtml = $.templates("#contentsEmptyTemplate").render(param);
			}

			var $ui_expression_act = $ui_expression_part1.html(exprHtml);
			//$ui_expression_act.find("button").off("click").on("click", uiHandler);
			$ui_expression_act.find("em").off("click").on("click", uiHandler);
			
			// 불러온 리스트의 색깔 적용을 위해 본문 하이라이트 초기화
			$ui_parsed_article.find("span.pupple").removeClass("pupple");
			$ui_parsed_article.find("span.pink").removeClass("pink");
			
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
			if($ui_parsed_article != null) {
				$ui_parsed_article.find("span.source_text")
					.on("mousedown", articleMouseEventHandler)
					.on("mouseup", articleMouseEventHandler);
			}
			//$this.find(".answer_whole").on("click", answerBoxEventHandler);
		}
		function answerBoxEventHandler(e) {
			$this.find(".answer_whole").css("background-color", "#ffffff");
			$this.find(".answer_whole").removeClass("active");
			
			$(this).css("background-color", "#ededed");
			$(this).addClass("active");
		}
		function articleMouseEventHandler(e) {
			if(e.button != 0) return;
			// $ui_question_list 가 null 인 것은 XDC, XDC 는 아래 로직에서 영향을 구분
			if($ui_question_list != null && $ui_question_list.html() != undefined && $.isEmpty($ui_question_list.find("li.active").attr("qaid"))) 
			{
				return;
			}
			if(e.type == 'mousedown') {
				_startPoint = e.currentTarget.attributes.si.value;	//si: startindex
				return;
			}
			if(e.type == 'mouseup') {
				_endPoint = e.currentTarget.attributes.ei.value;	// ei: endindex
			}
			// 거꾸로 드래그 했을 때 Indexing 반전
			if(_startPoint*1 >= _endPoint*1) {
				var temp = (_startPoint*1)+1;
				_startPoint = (_endPoint*1)-1;
				_endPoint = temp;
			}

			if(that._select_limit != null && _endPoint*1-_startPoint*1 > that._select_limit) {
				_startPoint = _startPoint*1 + (_endPoint*1-_startPoint*1)-that._select_limit;
			}
			
			// mouseup이 됐을 때 화면에 반영
			var $that;
			var selectedText = "";
			var selectedParagraph = "";
			
			if($ui_answer_part2 != null) {
				// 초기화
				if($ui_answer_part2.hasClass("active")) {
					$ui_parsed_article.find("span.pink").removeClass("pink");
				}
			}
			if($ui_answer_part1 != null) {
				// 초기화
				if($ui_answer_part1.hasClass("active")) {
					$ui_parsed_article.find("span.pupple").removeClass("pupple");
				}
			}
			/*if($ui_expression_part1 != null) {
			} else {
				return;				// $ui_answer_part1 가 null 이면 화면에 답변을 표시할 UI가 없음을 의미
			}*/

			// 선택된 내용을 다시 표시
			for(var i=_startPoint*1; i<_endPoint*1; i++) {
				$that = $("span[si="+i+"]");

				// 색깔 변경과 선택한 문장 저장을 위한 구간
				if($ui_answer_part1 != null && $ui_answer_part1.hasClass("active")) {
					$that.addClass("pupple");
				} else if($ui_answer_part2 != null && $ui_answer_part2.hasClass("active")){
					$that.addClass("pink")
				} else if($ui_expression_part1 != null) {
					$that.addClass("pupple");
				}

				// 2020.06.09 : Tracking 개발중 제거 : 선택된 문장을 넘어선 문장도 선택 가능하게 하기 위해
				if(!$.isEmpty($that.find("em").html())) {
					if($that.text().length > 0) {
						selectedText += $that.text().substring($that.text().length - 1);
					}
				} else {
					selectedText += $that.text();
				}
				// !!색깔 변경을 위한 구간 끝
			}

			// 선택된 문장이 속한 문단 내용을 가져온다 (날짜 파싱을 위한)
			var pargIndex = $("span[si="+_startPoint*1+"]").attr("parg");
			var list = $("span[parg="+pargIndex+"]");

			for(var i=0; i<list.length; i++) {
				selectedParagraph += list[i].innerText.substring(list[i].innerText.length - 1);
			}

			var rtnMap = new Map();
			if($ui_answer_part1 != null && $ui_answer_part1.hasClass("active")) {
				rtnMap.start_index = _startPoint;
				rtnMap.end_index = _endPoint;
				rtnMap.answer = selectedText;
				
				$ui_answer_part1.find("span.tagging").next().html(selectedText);
			}
			else if($ui_answer_part2 != null && $ui_answer_part2.hasClass("active")) {
				rtnMap.reason_start_index = _startPoint;
				rtnMap.reason_end_index = _endPoint;
				rtnMap.reason_morpheme = selectedText;

				$ui_answer_part2.find("span.tagging").next().html(selectedText);
			}
			else if($ui_expression_part1 != null) {
				rtnMap.reserve1 = _startPoint;
				rtnMap.reserve2 = _endPoint;
				rtnMap.context = selectedText;
				rtnMap.paragraph = selectedParagraph;
			}
			
			if($.isEmpty(rtnMap.answer) && $.isEmpty(rtnMap.reason_morpheme) && $.isEmpty(rtnMap.context)) {
				return;
			} else {
				if(that._getValue != null && typeof that._getValue === 'function') {
					if($ui_question_list != null && typeof $ui_question_list != 'undefined') {
						that._getValue($ui_question_list.find("li.active").attr("qaid"), rtnMap);	
					} else {
						that._getValue(null, rtnMap);
					}
				}
			}
		}
		function clearArticle() {
			if($ui_parsed_article != null) {
				$ui_parsed_article.find("span.source_text").removeClass("pupple");
				$ui_parsed_article.find("span.source_text").removeClass("pink");
			}
		}
		function clearAnswer() {
			if($ui_answer_part1 != null)
				$ui_answer_part1.find("span").next().html("");
			if($ui_answer_part2 != null)
				$ui_answer_part2.find("span").next().html("");
		}
		
		// Utility
		/*function morpToText(morpheme) {
			var morphemeHtml = "";
			$.each(morpheme, function() {
				var $this = this;
				if($this.morps == "<br>") {
					morphemeHtml += $this.morps;
				} else {
					morphemeHtml += $.templates("#morphemeTemplate").render($this);	
				}
			});
			return morphemeHtml;
		}*/
		function morpToText(morpheme) {
			var morphemeHtml = "";
			var specific = "";
			
			var bInterrupt = false;
			var nParagraphIndex = 1;
			$.each(morpheme, function() {
				var $this = this;
				// 태그가 시작되는지 판단 (위치 변경 불가능)
				if($this.morps == "<") {
					bInterrupt = true;
				}
				if(!bInterrupt) {
					$this.paragraph = nParagraphIndex;
					morphemeHtml += $.templates("#morphemeTemplate").render($this);
				} else {
					specific += $this.morps;
				}
				// appending 작업이 끝나고 상태 변경 해야함 (위치 변경 불가)
				if($this.morps == ">") {
					bInterrupt = false;
					morphemeHtml += specific;
					specific = "";
					nParagraphIndex++;
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
					editedText = newsList.oriContext.replace(/\\n/gi, '\n');
				} else {
					editedText = newsList.context.replace(/\\n/gi, '\n');
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
				$this.find("#script_box1 .textarea").scrollTop(0);
			}
		}
		
		function setNewsEditingList(data) {
			if(data != null && data.length > 0) {
				var editedText = data[0].context.replace(/\\n/gi, '\r\n');
				$this.find("#script_box2 textarea").val(editedText);
				$this.find("#contextId").val(data[0].contextId);
			} else {
				$this.find("#contextId").val("");
			}
			$this.find("#script_box2 textarea").scrollTop(0);
		}
		
		function setBasicSntcList(data){
			if(data != null){
				// category
				$this.find("div.topic_box").text(data.contentsList.ctgPath);
				// 기본 문장
				$this.find("#basicQuestion").val(data.contentsList.question);
				$this.find("#basicAnswer").val(data.contentsList.answer);
			}
		}
		
		function setSentenceList(data, type, callback) {
			if(data != null && data.length > 0) {
				for(var i=0; i<data.length; i++) {
					// class="overlap_txt" li태그 
					if(parseInt(data[i].questionCheck) > 0) {
						$this.find("input[name='question']").eq(i).parents("li").addClass("overlap_txt");
					}
					if(parseInt(data[i].answerCheck) > 0) {
						$this.find("input[name='answer']").eq(i).parents("li").addClass("overlap_txt");
					}
					
					$this.find("input[name='contextId']").eq(i).val(data[i].contextId);
					$this.find("input[name='question']").eq(i).val(data[i].question);
					$this.find("input[name='answer']").eq(i).val(data[i].answer);
				}
				
				if(type == 'check') {
					if($this.find("form[name=work-data] li.overlap_txt").length > 0) {
						$.alert("중복된 문장이 존재하여 다음파일로 넘어갈 수 없습니다.");
					} else {
						callback();
					}
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
								var param = {title: "반려사유", comment: jobInfo.rejectComment};
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
							// MindsJS.movePage(prefixUri+that._projectId+"/projectDetail.do?jobType="+jobInfo.jobType);
							$.alert("작업 가능한 프로젝트가 없습니다", function() {
								MindsJS.movePage("/project/projectList.do");
							});
						}
					} else {
						// 서버에서의 오류 응답 줄 때 (RestController에서 return fail()일 때)
						if(typeof failCallback === 'function') {
							failCallback(result);
						}
					}
				}
				, true
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
				, true
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
				, true
			);
		}
		
		function saveQuestionForWork(parameter, callback, failCallback) {
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;
			
			MindsJS.loadJson(
				requestApi.saveQuestionData
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
				, true
			);
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
			}, true);
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
			}, true);
		}
		function saveContentForWorkForGTP(parameter, callback, failCallback) {
			parameter.projectId = that._projectId;
			parameter.jobId = jobInfo.jobId;
			parameter.workId = jobInfo.workId;

			MindsJS.loadJson(requestApi.saveWorkData
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
				, true
			);
		}
		function saveContentForWorkForTracking(parameter, callback) {
			var param = parameter;

			if(param.content != null) {
				param.projectId = that._projectId;
				param.jobId = jobInfo.jobId;
				param.workId = jobInfo.workId;

				if(param.actDate != null) {
					for(var i=0; i<param.actDate.length; i++) {
						if(param.actDate[i] != '') {
							var regDate = /(^0?[1-9]|1[0-2])-?(0?[1-9]|[12][0-9]|[3][01])$/;
							if(!regDate.test(param.actDate[i])) {
								$.alert("입력 형식을 확인해 주세요. [MM-dd]", function() {
									var $invalidInput = $("input[name=actDate]").eq(i);
									$invalidInput.focus();
									$invalidInput.css("background-color", "#ffe9c7");
								});
								return;
							}
						}
					}
				}
				if(param.time != null) {
					for(var i=0; i<param.time.length; i++) {
						if(param.time[i] != '') {
							var regTime = /(0?[0-9]|[1][0-9]|[2][0-3]):(0?[0-9]|[1-5][0-9])/;
							if (!regTime.exec(param.time[i])) {
								$.alert("입력 형식을 확인해 주세요. [HH-mm]", function() {
									var $invalidInput = $("input[name=time]").eq(i);
									$invalidInput.focus();
									$invalidInput.css("background-color", "#ffe9c7");
								});
								return;
							}
						}
					}
				}

				MindsJS.loadJson(requestApi.saveWorkData, param, function (result) {
					if (result.success) {
						if (typeof callback === 'function') {
							callback(result.data);
						}
					} else {
						// 서버에서의 오류 응답
						if (typeof failCallback === 'function') {
							failCallback();
						}
					}
				}, true);
			} else {
				if (typeof callback === 'function') {
					callback();
				}
			}
		}
		function saveContentForWorkForNews(parameter, callback) {
			var param = parameter;
			
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
			}, true);
		}
		function saveContentForWorkForSentence(parameter, callback) {
			var param = parameter;
			
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
			}, true);
		}
		function convertMapToJsonForGTP(parameter) {
			var param = {};

			var contextId = [];
			var reserve1 = [], reserve2 = [], context = [];

			parameter.forEach(function(value) {
				if($.isEmpty(value.contextId)) {
					contextId.push("");
				} else {
					contextId.push(value.contextId);
				}

				reserve1.push(typeof value.reserve1 === "undefined" ? "" : value.reserve1);
				reserve2.push(typeof value.reserve2 === "undefined" ? "" : value.reserve2);
				context.push(typeof value.sentence === "undefined" ? "" : value.sentence);
			});
			// parameter.forEach((value, key) => {
			// 	if($.isEmpty(value.contextId)) {
			// 		contextId.push("");
			// 	} else {
			// 		contextId.push(value.contextId);
			// 	}
			// 	reserve1.push(typeof value.reserve1 === "undefined" ? "" : value.reserve1);
			// 	reserve2.push(typeof value.reserve2 === "undefined" ? "" : value.reserve2);
			// 	context.push(typeof value.sentence === "undefined" ? "" : value.sentence);
			// });

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

			parameter.forEach(function(value) {
				if($.isEmpty(value.contextId)) {
					contextId.push("");
				} else {
					contextId.push(value.contextId);
				}
				reserve1.push(typeof value.reserve1 === "undefined" ? "" : value.reserve1);
				reserve2.push(typeof value.reserve2 === "undefined" ? "" : value.reserve2);
				context.push(typeof value.context === "undefined" ? "" : value.context);
			});
			// parameter.forEach((value, key) => {
			// 	if($.isEmpty(value.contextId)) {
			// 		contextId.push("");
			// 	} else {
			// 		contextId.push(value.contextId);
			// 	}
			// 	reserve1.push(typeof value.reserve1 === "undefined" ? "" : value.reserve1);
			// 	reserve2.push(typeof value.reserve2 === "undefined" ? "" : value.reserve2);
			// 	context.push(typeof value.context === "undefined" ? "" : value.context);
			// });
			
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

			parameter.forEach(function(value) {
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

			/*parameter.forEach((value, key) => {
				qa_id.push(value.qa_id);
				
				answer.push(typeof value.answer === "undefined" ? "" : value.answer);
				startIdx.push(typeof value.start_index === "undefined" ? "" : value.start_index);
				endIdx.push(typeof value.end_index === "undefined" ? "" : value.end_index);
				answer_contentId.push(typeof value.answer_contentId === "undefined" ? "" : value.answer_contentId);
				
				reason.push(typeof value.reason_morpheme === "undefined" ? "" : value.reason_morpheme);
				reason_start_index.push(typeof value.reason_start_index === "undefined" ? "" : value.reason_start_index);
				reason_end_index.push(typeof value.reason_end_index === "undefined" ? "" : value.reason_end_index);
				reason_contentId.push(typeof value.reason_contentId === "undefined" ? "" : value.reason_contentId);
			});*/

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
			MindsJS.loadJson(
				requestApi.selectWorkData
				, param
				, function(result) {
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
				}
				, true
			);
		}
		
		// 검수요청
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
				, true
			);
		}
		
		// 작업불가요청
		function requestIgnoreForWork(comment) {
			var param = jobInfo;
			param.projectId = that._projectId;
			
			if(comment != null) param.comment = comment;
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
				, true
			);
		}
		
		// give up
		function requestGiveupTask() {
			var param = jobInfo;
			param.projectId = that._projectId;
			MindsJS.loadJson(
				requestApi.requestGiveupTask
				, param
				, function(result){
					if(result.success) {
						if(typeof that._callback === 'function') {
							that._callback(result);
						}
					} else {
					}
				}
				, true
			);
		}
		
		function removeItem(contentId, callback) {
			var param = jobInfo;
			param.contentId = contentId;
			MindsJS.loadJson(
				requestApi.removeItem
				, param
				, function(result){
					if(result.success) {
						if(callback != null && typeof callback === 'function') {
							callback();
						}
					} else {
					}
				}
				, true
			);
		}
		
		return {
			init: init,
			goHome: goHome,
			requestAssignJob: requestAssignJob,
			getCurrentJobContext: getCurrentJobContext,
			selectCurrentContents: selectCurrentContents,
			selectProjectCategorySubList: selectProjectCategorySubList,
			saveQuestionForWork: saveQuestionForWork,		// Modal에서 Question 저장 (Submit)
			saveContentForWork: saveContentForWork,
			saveContentForWorkForXDC: saveContentForWorkForXDC,
			saveContentForWorkForGTP: saveContentForWorkForGTP,
			saveContentForWorkForTracking: saveContentForWorkForTracking,
			saveContentForWorkForNews: saveContentForWorkForNews,
			saveContentForWorkForSentence: saveContentForWorkForSentence,
			selectData: selectData,
			selectDetailData: selectDetailData,
			requestInspectForWork: requestInspectForWork,
			requestIgnoreForWork: requestIgnoreForWork,
			removeItem: removeItem
		}
	}
	
	/********* UTILITY *********/
	/*function convertContextToWord(text) {
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
			if($this == "\n") {
				bInterrupt = true;
			}
			var item = {};
			if(!bInterrupt) {
				item.start = totLength;
				item.morps = $this;
				item.end = (startIndex*1)+(wordLength*1);
				totLength += wordLength;
			} else {
				//item.morps = $this;
				item.morps = "<br>";
				bInterrupt = false;
			}
			parsedWordsList.push(item);
		});
		return parsedWordsList;
	}*/
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