// 프로젝트 타입에 맞게 class명 지정
// view 파일(jsp)에서 init할 때 사용하는 클래스 명
var classificateScriptView = (function() {
    var $mP;
    var mContextInfo;

    var $voiceHandler;
    var $object;

    var mTrimPointArray = [];
    var mRegionMap = new Map();

    var defaultJobType = "IC";
    var jobClassName = "classificate";

    var MAX_CONTENT_CNT = 500;

    var mIsTemporaryData = false;
    var mFormIndex = 0;

    var mLanguage = "ko";

    function init(projectId) {
        $mP = $("div.contents");
        $object = $mP.initVoiceProject({
            projectId: projectId,
            projectType: "S",
            jobType: defaultJobType,
            jobClassName: jobClassName,
            nextCallback: saveResult
        });

        bindEventHandler();
        getCurrentJob();
    }

    function bindEventHandler() {
        $("button.btnNext", $mP).on("click", requestComplete);
        $("button.btnReject", $mP).on("click", requestReject);
    }

    /** FOR NAVIGATE **/
    function getCurrentJob() {
        $object.requestAssignJob(getContext, failCallback);
    }
    function getContext(jobInfo) {
        checkStatus(jobInfo);
        $object.getCurrentJobContext(displayContents, failCallback);
        $object.selectCurrentContents(displaySubContents, failCallback);
    }
    function selectWorkData() {
        $object.selectData(dataRender, failCallback);
    }
    function requestComplete() {
        $object.requestComplete();
    }
    function requestReject() {
        // 반려사유 입력을 추가
        var rejectComment = $("textarea.rejectText", $mP).val();
        $object.requestReject(rejectComment);
    }
    function saveResult() {
        getCurrentJob();
    }

    /** FOR DISPLAY CONTENTS **/
    function checkStatus(jobInfo) {
        $("tbody.workInfo", $mP).html("");
        $("textarea.rejectText", $mP).val("");
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

        // 작업자명 표시
        $("span.fileName", $mP).html("workerId : "+jobInfo.workerId);
    }
    function displayContents(context) {
        // 0. 화면 표시 데이터를 초기화한다.
        clearDisplay();
        // 1. context info를 local에 임시 저장한다.
        mContextInfo = context;
        // 2. JOB과 PROJECT에 관한 정보를 불러온다.
        //$("span.fileName", $mP).html(mContextInfo.orgFileName);
        // 3. 음성 플레이어에 표시할 음성파일과 파형데이터를 가져온다.
        if($.isEmpty(mContextInfo.atchFile)) {
            $.alert("원본 데이터 파일을 불러오지 못했습니다.");
            return;
        }
        var blob = WaveJS.base64toBlob(mContextInfo.atchFile, "audio/x-wav");
        // 4. 음성 플레이어를 초기화 시키고
        $voiceHandler = setVoicePlayer(WaveJS.RegionEventHandler);
        // 4-1. 3의 데이터를 랜더링한다.
        if($voiceHandler) {
            $voiceHandler.display(blob);
        }
        selectWorkData();
    }
    function displaySubContents(contents) {
        var contentsHtml = "";
        if(contents != null && contents.length > 0) {
            contentsHtml = $.templates("#voiceBaseContents").render(contents);
        } else {
            var emptyParam = { colspan : 2, message : "Empty Script" };
            contentsHtml = $.templates("#listEmptyTemplate").render(emptyParam);
        }
        $("div.script_list ul", $mP).html(contentsHtml);
        selectSubCodeTypeList();

        // selectWorkData();
    }
    function selectSubCodeTypeList() {
        $object.selectProjectCategorySubList(renderClassifyType);
    }
    function renderClassifyType(data) {
        var html = "<option value=''>-- SELECT --</option>";

        if(!$.isEmpty(data)) {
            html += $.templates("#selectOptionOnlyTemplate").render(data);
        }
        var $categorySelecteBox = $("select[name=categoryType]", $mP).html(html);
        $categorySelecteBox.on("change", function() {
            var selectedRegionId = $("tr.active").attr("regionId");
            var selectRegion = mRegionMap.get(selectedRegionId);
            selectRegion.classificate = $(this).val();
            mRegionMap.set(selectedRegionId, selectRegion);
        });
    }

    function dataRender(renderData) {
        // player에 region을 표시할 데이터가 있는 경우에만 실행
        $voiceHandler.displayScript(renderData.workData);

        // To do: 검수요청 된 데이터를 화면에 표시한다. (표 데이터)
        // 세부 데이터를 임시저장소에 저장
        renderData.workData.forEach(function(v,i) {
            var regionId = v.regionId;
            var region = mRegionMap.get(regionId);

            region.writeText = v.context;
            region.classificate = v.contentKind;

            if(!$.isEmpty(region.writeText)) {
                $("tbody tr[regionid='"+regionId+"']", $mP).find("td:eq(1) span").addClass("fa-check write_chk");
            }
            mRegionMap.set(regionId, region);
        });

        if(!$.isEmpty(renderData.rejectComment)) {
            $("textarea.rejectText", $mP).val(renderData.rejectComment);
        }
    }
    function clearDisplay() {
        // To do:여기에서 로컬 변수를 초기화 한다.
        mTrimPointArray = [];
        mRegionMap = new Map();
        mFormIndex = 0;

        if($voiceHandler) {
            $voiceHandler.clearTimeStamp();
            $voiceHandler.seekTo(0);
        }
    }

    /** LOCAL AUDIO PLAYER **/
    function setVoicePlayer(regionHandler) {
        // form 초기화
        $("#waveform", $mP).html("");
        // player handler 작성
        var voiceHandler = $("#waveform", $mP).regWavePlayer({
            timeliner: "#wave-timeline"
            , controller: 'div.button_box'	// player를 제어하는 버튼 elements
            , isMinimap: false
            , isRegion: true
            , isCreatable: true
            , waveHeight: 51
            , regionHandler: regionHandler		// 플레이어 region 에 대한 이벤트 핸들러를 연결한다.
            , action: {
                create: createdRegion
            }
        });
        return voiceHandler;
    }

    function createdRegion(region) {
        if(region == null) return;
        if(MAX_CONTENT_CNT != 0 && mTrimPointArray.length < MAX_CONTENT_CNT) {
            if($voiceHandler) {
                mTrimPointArray.push(region);
                mRegionMap.set(region.id, region);

                region.index = ++mFormIndex;
                var infoTdHtml = $.templates("#frequencyTemplate").render(region, { convertTime : function(time) { return convertTime(time); }});
                var $infoBody = $("tbody.workInfo", $mP).append(infoTdHtml);

                $infoBody.find("div.play").off("click").on("click", function() {
                    var $this = $(this).parents("tr:first");
                    $("tbody.workInfo", $mP).find("div.pause").hide();
                    $("tbody.workInfo", $mP).find("div.play").show();

                    $(this).hide();
                    $this.find("div.pause").show();

                    $voiceHandler.play($this.find("td.start").attr("offset"), $this.find("td.end").attr("offset"));
                });
                $infoBody.find("div.pause").off("click").on("click", function() {
                    var $this = $(this).parents("tr:first");
                    $(this).hide();
                    $this.find("div.play").show();
                    $voiceHandler.play();
                });

                /***
                 * Results 항목 클릭했을 때
                 */
                $infoBody.find("tr").off("click").on("click", function() {
                    $(this).siblings("tr").removeClass("active");
                    $(this).addClass("active");
                    // write down 과 classification 활성화
                    //$("select[name=categoryType] option:eq(0)", $mP).prop("selected", true);
                    $("textarea.actInsert", $mP).attr("disabled", false);
                    var region = mRegionMap.get($(this).attr("regionId"));
                    $("textarea.actInsert", $mP).val(region.writeText ? region.writeText : "");
                    $("select.actInsert", $mP).val(region.classificate ? region.classificate : "");
                });
            }
        } else {
            $.alert("잘라내기 영역은 " +MAX_CONTENT_CNT+"개 이상 등록할 수 없습니다. (현재:"+mTrimPointArray.length+"개)");
        }
    }

    function failCallback(result) {
        console.log(result);
    }

    function convertTime(longTime) {
        var min = "0";
        var sec = "00";

        min = longTime / 60;
        sec = longTime % 60;
        if (Math.floor(sec) <= 9) {
            sec = "0" + sec.toFixed(3);
        } else {
            sec = sec.toFixed(3);
        }
        return Math.floor(min) + ":" + sec;
    }

    return {
        init: init
    }
})();