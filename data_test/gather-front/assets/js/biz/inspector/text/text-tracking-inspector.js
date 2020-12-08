var textTrackingScriptView = (function () {
    var $mP;
    var $Object;
    var $UI;

    var defaultJobType = "TR";
    var jobClassName = "tracking";

    var $answerMap = new Map();
    var identity = 0;

    function init(projectId) {
        $mP = $("div.contents");
        $Object = $mP.initTextProject({
            projectId: projectId,
            projectType: "T",
            jobType: defaultJobType,
            jobClassName: jobClassName,
            nextCallback: saveResult
        });
        $UI = $mP.regContextUi({
            getValue: null
            ,expression: $("tbody.tBaseCtnt", $mP)
        });

        bindEventHandler();
        getCurrentJob();        // 할당돼 있는 job 이 있는지 확인하고, 없으면 새로운 job을 가져온다.
    }

    function bindEventHandler() {
        $("button.btnNext", $mP).on("click", requestComplete);
        $("button.btnReject", $mP).on("click", requestReject);
    }

    function getCurrentJob() {
        $Object.requestAssignJob(getContext, failCallback);
    }

    function getContext(jobInfo) {
        checkStatus(jobInfo);
        $Object.getCurrentJobContext(displayContents, failCallback);
        $Object.selectCurrentContents(displaySubContents, failCallback);
    }

    function requestComplete() {
        // ajax 호출 : 서버에 요청 (검수완료)
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
        }
    }

    var presetData = {};
    function displaySubContents(context) {
        if(context != null && context.sentence != null) {
            // 본문 텍스트 표시
            $UI.setArticle(TextJS.parseContext(context.sentence.context));
            if(context.preset != null && context.preset.length > 0) {
                // 전처리 데이터 임시저장
                presetData.workData = context.preset;
            }
        }
        selectWorkingData();
    }
    // function presetDataRender(renderData) {
    //     if($UI != null && renderData != null) {
    //         $answerMap = $UI.setPresetList(renderData.workData, removeSentence);
    //         if(renderData.workData != null)
    //             identity = renderData.workData.length;
    //     }
    // }
    function workDataRender(renderData) {
        if($UI != null && renderData != null && renderData.workData != null && renderData.workData.length > 0) {
            $answerMap = $UI.setPresetList(renderData.workData, removeSentence);
            identity = renderData.workData.length;
        } else {
            //presetDataRender(presetData);
        }
    }
    function clearDisplay() {
        $answerMap = new Map();
        identity = 0;
        if(typeof $UI != 'undefined') {
            $UI.clearAnswer();
        }
    }

    function selectWorkingData() {
        $Object.selectData(workDataRender, failCallback);
    }

    function removeSentence() {

    }

    function failCallback(result) {

    }

    return {
        init: init
    }
})();