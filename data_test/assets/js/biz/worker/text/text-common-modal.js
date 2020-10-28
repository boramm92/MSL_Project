(function ($) {
	$.fn.regQuestModal = function(settings) {
		var $this = $(this);
		var _handler = $this.data("modalHandler");
		_handler = new QuestModal.CreateModal($this, settings);
		$this.data("modalHandler", _handler);
		return _handler;
	};
})(jQuery);

var QuestModal = (function() {
	var $mQuestionModal;
	var mQuestionListSize = 5;
	
	function CreateModal($this, settings) {
		var that = this;
		that._projectId = settings.projectId;
		that._jobId = settings.jobId;
		that._workId = settings.workId;
		that._callback = settings.callback;
		that._qaId = settings.qaId;
		that._fnSave = settings.fnSave;
		that._qaCtg = settings.qaCtg;
		that._qaCtgList = settings.qaCtgList;

		init();
		function init() {
			var data = { 
				qaCtg: that._qaCtg
				,qaCtgList: that._qaCtgList
			};

			var modalHtml = $.templates("#modalDataQuestionBox").render(data);
			$mQuestionModal = $this.append(modalHtml).find("#pop_question");
			
			if(that._qaCtg == null) {
				$mQuestionModal.find("select[name=class_type] option:eq(0)").prop("selected", true);
				var text = $mQuestionModal.find("select[name=class_type]").find("option:selected").text();
				$(".MQ_question_item", $mQuestionModal).val(text);
			} else {
				$mQuestionModal.find("select[name=class_type]").val(that._qaCtg);
			}
			bindEventHandler();
		}
		
		function bindEventHandler() {
			if($mQuestionModal != null) {
				$mQuestionModal.find(".ico_close").on("click", close);
				$mQuestionModal.find("button.save").on("click", saveQuestion);
				$mQuestionModal.find("select[name=class_type]").on("change", setDefaultQuestion);
			}
		}
		/** UI HANDLER **/
		function show(data) {
			if(data != null) {
				data.isInspect = false;
				var questionHtml = $.templates("#addQuestionDataTemplate").render(data);
				$("form[name=form-question]", $mQuestionModal).append(questionHtml);
			}
			
			fillSubQuestionListForEmpty();
			$mQuestionModal.css("display", "block");
			
			// focusing cursor
			if(data != null) {
				$("input[name=question]", $mQuestionModal).eq(data.length).focus();
			} else {
				$(".MQ_question_item", $mQuestionModal).focus();
			}
		}
		function close() {
			$mQuestionModal.remove();
		}
		function setDefaultQuestion() {
			var text = $(this).find("option:selected").text();
			$(".MQ_question_item", $mQuestionModal).val(text);
		}
		/** ##UI HANDLER **/
		
		/** DATA CONTROLLER **/
		// submit 버튼 눌렀을 때
		function saveQuestion() {
			if($.isEmpty($(".MQ_question_item", $mQuestionModal).val())) {
				$.alert("메인 질문을 작성해야 합니다."
					, function() {
						$(".MQ_question_item", $mQuestionModal).focus();	
					}
				);
			} else {
				var formData = $("form[name=form-question]", $mQuestionModal).formJson();
				if(that._fnSave != null && typeof that._fnSave === 'function') {
					formData.qaId = that._qaId;
					that._fnSave(formData);
					
					close();
				}
			}
		}
		
		/** UTILITY **/
		function fillSubQuestionListForEmpty() {
			var inputArray = $("form[name=form-question]", $mQuestionModal).find("input[type=text]");
			if(inputArray == null || inputArray.length < mQuestionListSize) {
				var nAddCount = mQuestionListSize-inputArray.length;
				var questionHtml = "";
				var param = {};
				for(var i=nAddCount; i>0; i--) {
					param.division = i < mQuestionListSize ? 'SQ' : 'MQ';
					questionHtml = $.templates("#emptyQuestionDataTemplate").render(param);
					//$("div.question_set", $mQuestionModal).append(questionHtml);
					$("form[name=form-question]", $mQuestionModal).append(questionHtml);
				}
			}
		}
		
		return {
			show: show,
			close: close,
			saveQuestion: saveQuestion
		}
	}

	return {
		CreateModal: CreateModal
	}
})();