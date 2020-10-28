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
		that._qaCtgList = settings.qaCtgList;

		init();
		function init() {
			var data = {};
			data.inspect = true;
			data.qaCtgList = that._qaCtgList;
						
			var modalHtml = $.templates("#modalQuestionBox").render(data);
			$mQuestionModal = $this.append(modalHtml).find("#question_modal");
			
			bindEventHandler();
		}
		
		function bindEventHandler() {
			if($mQuestionModal != null) {
				$mQuestionModal.find(".close").on("click", close);
				$mQuestionModal.find("button.submit_btn").on("click", saveQuestion);
			}
		}
		/** UI HANDLER **/
		function show(data) {
			if(data != null) {
				data.isInspect = true;
				var questionHtml = $.templates("#addQuestionTemplate").render(data);
				$("div.question_set", $mQuestionModal).html(questionHtml);
			}
			
			fillSubQuestionListForEmpty();
			$mQuestionModal.css("display", "block");
			
			// focusing cursor
			if(data != null) {
				$("input[name=question]", $mQuestionModal).eq(data.length).focus();
			} else {
				$("#MQ_question_item", $mQuestionModal).focus();	
			}
		}
		function close() {
			$mQuestionModal.remove();
		}
		/** ##UI HANDLER **/
		
		/** DATA CONTROLLER **/
		// submit 버튼 눌렀을 때
		function saveQuestion() {
			var formData = $("form[name=form-question]", $mQuestionModal).formJson();
			if(that._fnSave != null && typeof that._fnSave === 'function') {
				formData.qaId = that._qaId;
				that._fnSave(formData);
				
				close();
			}
		}
		
		/** UTILITY **/
		function fillSubQuestionListForEmpty() {
			var inputArray = $("div.question_set", $mQuestionModal).find("input[type=text]");
			if(inputArray == null || inputArray.length < mQuestionListSize) {
				var nAddCount = mQuestionListSize-inputArray.length;
				var questionHtml = "";
				var param = {};
				for(var i=nAddCount; i>0; i--) {
					param.division = i < mQuestionListSize ? 'SQ' : 'MQ';
					param.isInspect = true;
					questionHtml = $.templates("#emptyQuestionTemplate").render(param);
					$("div.question_set", $mQuestionModal).append(questionHtml);
				}
			}
		}
		
		return {
			show: show,
			close: close
		}
	}

	return {
		CreateModal: CreateModal
	}
})();