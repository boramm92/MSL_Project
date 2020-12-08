var textNewsViewScript = (function() {
	var $mP;
	var $Object;
	var $UI;
	
	var defaultJobType = "NW";
	var jobClassName = "news";

	var mIsTemporaryData = false;

	function init(projectId) {
		$mP = $("div.contents");
		$Object = $mP.initTextProject({
			projectId: projectId,
			projectType: "T",
			jobType: defaultJobType,
			jobClassName: jobClassName,
			nextCallback: saveResult
		});
		$UI = $mP.regContextUi({});
		
		bindEventHandler();
		getCurrentJob();
	}
	function bindEventHandler() {
		$("button.btnNext", $mP).on("click", requestComplete);		// 승인
		$("button.btnHome", $mP).on("click", function() {
			$Object.goHome("프로젝트 관리화면으로 이동합니다.<br>'OK'를 클릭하면 저장하지 않은 데이터는 사라집니다.<br>이동하시겠습니까?");
		});
		
		// 임시저장
		$("button.btnReject", $mP).on("click", requestReject);		// 반려
	}
	/** FOR NAVIGATE **/
	function goPrevJob() {
	}
	function getCurrentJob() {
		$("textarea[name=comment]", $mP).val("");
		$Object.requestAssignJob(getContext, failCallback);
	}
	function getContext(jobInfo) {
		clearDisplay();
		checkStatus(jobInfo);
		$Object.getCurrentJobContext(displayContents, failCallback);		
		$Object.selectCurrentContents(displaySubContents, failCallback);
	}
	function selectNewsData() {
		$Object.selectData(newsDataRender, failCallback);
	}
	function requestComplete() {
		$Object.requestComplete();
	}
	
	function requestReject() {
        // 반려사유 입력을 추가
        var rejectComment = $("textarea[name=comment]", $mP).val();
        $.confirm(
            "반려하시겠습니까?",
            function() {
            	$Object.requestReject(rejectComment);
            },
            null,
            "Information"
        );
    }
	
	function saveResult() {
		getCurrentJob();
	}
	
	function checkStatus(jobInfo) {
		$(".faild_box", $mP).html("");
		$(".reject_box", $mP).html("");
        // 작업불가 체크
        if(jobInfo.jobStatus == 'IM') {
            var rejectCommentHtml = $.templates("#commentBoxTemplate").render(
                {title: "Reasons for Impossible", comment: jobInfo.comment});
            $("div.faild_box", $mP).html(rejectCommentHtml).show();
            $.alert("작업자 '"+jobInfo.workerId + "'님이 작업불가로 지정한 항목입니다. 사유를 확인 후 검수를 결정해 주세요.");
        } else {
            $("div.faild_box", $mP).hide();
        }
        // 반려사유 체크
        var rejectCommentHtml = $.templates("#commentBoxTemplate").render(
            {writeMode:true, comment: jobInfo.rejectComment});
        $("div.reject_box", $mP).html(rejectCommentHtml).show();
        $("div.reject_box", $mP).find("textarea").val(jobInfo.rejectComment);
    }
	
	/** FOR DISPLAY CONTEXT **/
	function displayContents(context) {
	}
	function displaySubContents(contents) {
		// 기계정제
		if($UI != null) {
			$UI.setNewsList(contents, selectNewsData);
		}
	}
	function newsDataRender(renderData) {
		if($UI != null) {
			$UI.setNewsEditingList(renderData);
		}
	}
	function displayRecoverSubContents(contents) {
		// 기계정제
		if($UI != null) {
			$UI.setNewsList(contents);
		}
	}
	function clearDisplay() {
		$(".script_box textarea", $mP).scrollTop(0);
		$(".script_box div.textarea", $mP).scrollTop(0);
	}

	/** LOCAL FUNCTION AND UI **/
	function failCallback(result) {
		console.log(result);
	}
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();