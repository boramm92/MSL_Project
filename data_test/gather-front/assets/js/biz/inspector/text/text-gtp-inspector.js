var textG2PScriptView = (function () {
    var $mP;
    var $object;
    var $UI;

    var defaultJobType = "GP";
    var jobClassName = "gtp";

    var $answerMap = new Map();
    var identity = 1;

    function init(projectId) {
        $mP = $("div.contents");
        $object = $mP.initTextProject({
            projectId: projectId,
            projectType: "T",
            jobType: defaultJobType,
            jobClassName: jobClassName,
            nextCallback: saveResult
        });
        $UI = $mP.regContextUi({
            expression: $("tbody.tBaseCtnt", $mP)
        });

        bindEventHandler();
        getCurrentJob();
    }

    function bindEventHandler() {
        $("button.btnNext", $mP).on("click", requestComplete);
        $("button.btnReject", $mP).on("click", requestReject);
    }

    function getCurrentJob() {
        $object.requestAssignJob(getContext, failCallback);
    }

    function getContext(jobInfo) {
        checkStatus(jobInfo);
        $object.getCurrentJobContext(displayContents, failCallback);
        $object.selectCurrentContents(displaySubContents, failCallback);
    }

    function requestComplete() {
        // ajax 호출 : 서버에 요청 (검수완료)
        $object.requestComplete();
    }

    function requestReject() {
        // 반려사유 입력을 추가
        var rejectComment = $("textarea[name=comment]", $mP).val();
        $.confirm(
            "반려하시겠습니까?",
            function() {
                $object.requestReject(rejectComment);
            },
            null,
            "Information"
        );
    }
    
    function saveResult() {
        getCurrentJob();
    }

    function checkStatus(jobInfo) {
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

        // 작업 진행 상황
        var processHtml = $.templates("#progressTemplate").render(jobInfo.processState);
        $("div.progress_cases", $mP).html(processHtml);
    }

    function displayContents(context) {
        if(context.orgFileName != null) {
            $("span.fileName", $mP).text(context.orgFileName);
            displayAudioPlayerMarkII(context);
        }
    }

    function displaySubContents(contents) {
        $UI.setArticle(TextJS.parseContext(contents.genText));
        $("div.original_article", $mP).html(contents.context);
        selectWorkData();
    }

    var $voiceHandler;
    function displayAudioPlayerMarkII(context) {
        var $audioUI = $("div.audiobox", $mP).regAudioPlayer();
        if($audioUI != null) {
            $voiceHandler = $audioUI.find("audio").get(0);

            var mime_type = "audio/x-wav";		// default
            if(context.mediaType == 'wav') {
                mime_type = "audio/x-wav";
            } else if(context.mediaType == 'mp3') {
                mime_type = "audio/mp3";
            }
            // 음성파일이 있으면 음성 플레이어를 표시
            if(context.atchFile != 'undefined' && context.atchFile != null) {
                var blob = WaveJS.base64toBlob(context.atchFile, mime_type);
                var blobUrl = URL.createObjectURL(blob);
                $audioUI.find("audio#music").attr("src", blobUrl);
            }
        }
    }

    function clearDisplay() {
        $answerMap = new Map();
        identity = 1;
        if(typeof $UI != 'undefined') {
            $UI.clearAnswer();
        }
    }

    function selectWorkData() {
        $object.selectData(fixedDataRender, failCallback);
    }

    function fixedDataRender(renderData) {
        if($UI != null && renderData != null) {
            $answerMap = $UI.setFixedList(renderData.contentList, removeSentence);
            identity += renderData.contentList.length;
        }
    }
    
    function removeSentence() {

    }

    function failCallback(result) {

    }

    return {
        init: init
    }
})();