var textTrackingViewScript = (function () {
    var $mP;		// document object model
    var $Object;	// script object model
    var $UI;		// document ui

    var defaultJobType = "TR";
    var jobClassName = "tracking";

    var mIsTemporaryData = false;

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
            getValue: chooseSentenceEventHandler
            ,expression: $("tbody.tBaseCtnt", $mP)
        });

        bindEventHandler();
        getCurrentJob();        // 할당돼 있는 job 이 있는지 확인하고, 없으면 새로운 job을 가져온다.
    }
    function bindEventHandler() {
        // about navi action
        $("button.btnNext", $mP).on("click", saveAndGotoNext);
        $("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);
        // 고유 액션 버튼
        $("button.btnExecGPS", $mP).on("click", loadGiometrix);	// 위도, 경도 불러오기 & Temporary Save
    }

    /** FOR NAVIGATE **/
    function getCurrentJob() {
        $Object.requestAssignJob(getContext, failCallback);
    }
    function getContext(jobInfo) {
        // 1.화면의 내용을 지우고
        clearDisplay();
        // 2. Reject 이면 메시지 표시
        // if(jobInfo.jobStatus == 'RJ') {
        //     var param = {title: "Reasons for reject", comment: jobInfo.rejectComment};
        //     var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
        //     $("div.reject_box", $mP).html(rejectCommentHtml);
        //     $.alert("This context returned by inspector. Please check reason for correction.", null, "Alert");
        // }
        // 3.새로운 컨텐츠 화면에 적용하기
        $Object.getCurrentJobContext(displayContents, failCallback);   // attach file 가져오기
        $Object.selectCurrentContents(displaySubContents, failCallback);  // attach contents 가져오기

        // contents 를 새로 로드했을 때 isTemporary data = false
        emptyTemporaryData();
    }
    function selectWorkingData() {
        $Object.selectData(workDataRender, failCallback);
    }
    function saveAndGotoNext() {
        $.confirm("검수요청 전에 위경도 불러오기 작업을 확인하세요.<br>작업한 내용을 저장하고 검수요청 하시겠습니까?", function() {
            var param = $("form[name=work-data]", $mP).formJson();
            var locations = [];
            var category = [];
            if(!$.isEmpty(param.content)) {
                // 선택한 목록이 한개이면
                if(typeof param.content == 'string') {
                    param.category = $("form[name=work-data]", $mP).find("select[name=locate]").eq(0).find("option:selected").attr("category");
                }
                // 선택한 항목이 배열이면
                else {
                    for(var index in param.content) {
                        if (param['category'] == null) {
                            param['category'] = [];
                        }
                        param['category'][index] = $("form[name=work-data]", $mP).find("select[name=locate]").eq(index).find("option:selected").attr("category")
                    }
                }
            }
            $Object.saveContentForWorkForTracking(param, $Object.requestInspectForWork);
        });
    }
    function ignoreAndGotoNext() {
        var labelList = [
            {label:"Comment :", lbl_type:"text", name:"comment", lbl_ph:"작업불가 사유를 입력해 주세요." }
        ];
        $.commentAll(
            "작업불가 사유를 입력하면 작업불가 항목으로 지정됩니다.<br>작업불가 항목으로 지정하시겠습니까?"	// messages
            , function(data) {
                $Object.requestIgnoreForWork(data.comment);
            }					// ok Function
            , null				// cancel Function
            , "작업불가 지정"		// Title
            , "작업불가"				// OK Title
            , "취소"				// Cancel Title
            , labelList			// label list
        );
    }
    // 위도, 경도 불러오기
    function loadGiometrix() {
        var param = $("form[name=work-data]", $mP).formJson();
        var locations = [];
        var category = [];
        if(!$.isEmpty(param.content)) {
            // 선택한 목록이 한개이면
            if(typeof param.content == 'string') {
                locations.push(param.content) ;
                category.push($("form[name=work-data]", $mP).find("select[name=locate]").eq(0).find("option:selected").attr("category"));
            }
            // 선택한 항목이 배열이면
            else {
                for(var index in param.content) {
                    locations.push(param.content[index]);
                    category.push($("form[name=work-data]", $mP).find("select[name=locate]").eq(index).find("option:selected").attr("category"));
                }
            }
        }
        if(locations.length <= 0) {
            $.alert("GPS 위치를 요청할 장소가 선택되지 않았습니다.");
            return;
        }
        callscript(locations, function(locationData) {
            var location = {};
            locationData.forEach(function(value,idx) {
                Object.keys(value).forEach(function(key, i) {
                    if(key != 'userVo') {
                        if (location[key] == null) {
                            location[key] = [];
                        }
                        location[key][idx] = value[key];
                    }
                });
                if (location['category'] == null) {
                    location['category'] = [];
                }
                location['category'][idx] = category[idx];
            });
            // GPS 불러오는게 끝나면 저장
           $Object.saveContentForWorkForTracking(location, function () {
                selectWorkingData();
           });
        });
    }

    /** 페이지 내 고유 작업 **/
    function clearDisplay() {
        $answerMap = new Map();
        identity = 0;
        if(typeof $UI != 'undefined') {
            $UI.clearAnswer();
        }
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
    function presetDataRender(renderData) {
        if($UI != null && renderData != null) {
            $answerMap = $UI.setPresetList(renderData.workData, removeSentence);
            if(renderData.workData != null)
                identity = renderData.workData.length;
        }
    }
    function workDataRender(renderData) {
        if($UI != null && renderData != null && renderData.workData.length > 0) {
            $answerMap = $UI.setPresetList(renderData.workData, removeSentence);
            identity = renderData.workData.length;
        } else {
            presetDataRender(presetData);
        }
    }

    function removeSentence() {
        var $this = $(this);
        var $parentTr = $this.parents("tr:first");

        var _startPoint = $parentTr.find("input[name=startIndex]").val();
        var _endPoint = $parentTr.find("input[name=endIndex]").val();
        for(var i=_startPoint*1; i<_endPoint*1; i++) {
            var $that = $(".parsed_article span[si="+i+"]");
            if(i>_startPoint*1) {
                if($that.find("em").html().length > 0) {
                    break;
                }
            }
            $that.removeClass("pupple");
            $that.find("em").html("");
        }

        if(!$.isEmpty($parentTr.attr("ctxid"))) {
            $Object.removeItem($parentTr.attr("ctxId"), null);
        }

        $answerMap.delete($parentTr.attr("idx").toString());
        $parentTr.remove();

        var currSize = $("tbody.tBaseCtnt", $mP).find("tr[idx]").length;
        if(currSize == 0) {
            var param = { colspan: 6, message : "No item" };
            var emptyItempHtml = $.templates("#contentsEmptyTemplate").render(param);
            $("tbody.tBaseCtnt", $mP).html(emptyItempHtml);
        }
    }

    function chooseSentenceEventHandler(contentId, param) {
        var currSize = $("tbody.tBaseCtnt", $mP).find("tr[idx]").length;
        param.idx = currSize + 1;
        param.identity = ++identity;

        var datatimeRegexp = /(0?[1-9]|1[012])월 (0?[1-9]|[12][0-9]|3[01])일/g;
        var paragraph = param.paragraph;
        if(!$.isEmpty(paragraph) && datatimeRegexp.test(param.paragraph)) {
            var exportValue = param.paragraph.match(datatimeRegexp);
            if(exportValue != null && exportValue.length > 0) {
                var date = exportValue[0].split("월 ");
                var month = /(0?[1-9]|1[012])/.test(parseInt(date[0])) ? parseInt(date[0]) : 1;
                var day = /(0?[1-9]|[123][0-9])/.test(parseInt(date[1])) ? parseInt(date[1]) : 1;
                param.actDate = (month < 10 ? "0"+month : month) + (day < 10 ? "0"+day : day);
            } else {}
        } else {}

        var sentenceHtml = $.templates("#trackingDataEmptyTemplates").render(param);
        var $sentenceList;
        if(currSize == 0) {
            $sentenceList = $(".tBaseCtnt", $mP).html(sentenceHtml);
        } else {
            $sentenceList = $(".tBaseCtnt", $mP).append(sentenceHtml);
        }
        $answerMap.set(param.identity.toString(), param);
        $sentenceList.find("em.fa-window-close").off("click").on("click", removeSentence);
        $sentenceList.find(".toDate").datepicker({
            prevText: '이전 달',
            nextText: '다음 달',
            dateFormat: 'mm-dd',
            onSelect: function (date) {
                var startDate = $(this).datepicker('getDate');
                startDate.setDate(startDate.getDate() + 365);
            }
        });
        $(".hasDatepicker").attr("autocomplete", "off");

        // 스크롤을 최신 항목에 맞추기
        $("tbody.tBaseCtnt", $mP).parents(".content:first").scrollTop($("tbody.tBaseCtnt", $mP).height());
        $(".parsed_article").find("span[si="+param.reserve1+"] em").text(param.identity);
    }

    function emptyTemporaryData() {
        mIsTemporaryData = false;
    }

    function callscript(locations, callback) {
        // $("form[name=work-data]", $mP).loadGPS(callback);
        $("form[name=work-data]", $mP).loadKakaoLoc(callback);
    }

    function saveResult() {
        getCurrentJob();
    }

    function failCallback(result) {
        console.log(result);
    }

    // PUBLIC FUNCTION
    return {
        init: init
    }
})();