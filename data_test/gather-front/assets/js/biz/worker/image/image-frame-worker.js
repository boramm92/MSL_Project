// 프로젝트 타입에 맞게 class명 지정
// view 파일(jsp)에서 init할 때 사용하는 클래스 명
var imageFrameScriptView = (function() {
    var $mP;		// document object model
    var $Object;	// script object model
    var $UI;		// document ui

    var mContextInfo = { orgFileName : null, atchFile : null, extName : null };		// Main Contents

    var projectType = "P";					// Sound:S, Text:T, Image:P, Video:V
    var defaultJobType = "FS";			 			// xxxJobTypeEnum.java 참고
    var jobClassName = "frame";		// 쌍으로 생성할 jsp 파일 id, file name format : audio-{jobClassName}-worker.jsp

    // UI 콘트롤러

    // 전역변수 (데이터관련)
    var gCategory = {};

    // Box 관련 전역변수
    var frameStorage = new Map();
    var boxTemplate = {
        x:0, y:0, w:30, h:30
    };
    var boxInfoTemplate = {
        Box:{},       // boxing, polygon
        category_id:null, category_name:null
    };
    var frameTemplate = {
        boxes:[],       // boxTemplates
        boxCount:0,
        isNotObject:false,
        atchFileId:null, contextId:null, status:null
    };

    var isInitialize = true;

    ////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////* 공통 함수 *////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    function init() {
        $mP = $("div.contents");
        $Object = $mP.initImageProject({
            projectId: gProjectId,
            projectType: projectType,
            jobType: defaultJobType,
            jobClassName: jobClassName,
            nextCallback: saveResult
        });
        $UI = $mP.regContextUi({
            strokeColor: '',
            operateType: 'boxing',
            checkPoint: generateBoxingAndDrag,
            redraw: dataRedraw
        });
        $("canvas#dataSourceCanvas",$mP).css("transform", 'translate(-50%, -50%)');
        $("canvas#dataSourceCanvas",$mP).css("top", '50%');

        bindEventHandler();
        getCurrentJob();

        // setTestData();
    }

    function bindEventHandler() {
        // about navi action
        $("button.btnNext", $mP).on("click", saveAndGotoNext);
        $("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);

        $("button.noObject", $mP).on("click", function(event) {
            event.stopPropagation();
            if($.isEmpty(gCategory.areaCtg)) {
                $.alert("먼저 장소를 선택해야 합니다.");
            } else {
                emptyFrameCheck(event, $(this));
            }
        });
        $("button.removeSquare", $mP).on("click", removeBox);

        // save data
        $("button.btnSave", $mP).on("click", saveAnnotation);

        // image navigator
        $("button.btn_prev", $mP).on("click", getPrevFrame);
        $("button.btn_next", $mP).on("click", getNextFrame);

        // about specific action
        $("select[name=inOutCtg]", $mP).on("focus", function() { gCategory.inOutCtg = $(this).val(); }).on("change", confirmResetData);
    }

    /** FOR NAVIAGTE **/
    function goPrevJob() {
    }
    function getCurrentJob() {
        $Object.requestAssignJob(getContext, failCallback);
    }
    function getContext() {
        $Object.getCurrentJobContext(displayContents, failCallback);
    }
    function selectWorkData() {
        $Object.selectData(dataRender, failCallback);
    }
    function clearWorkData() {
        // 이코드는 신중하게
        frameStorage = new Map();
        $Object.setGParameter(gCategory);
        $UI.drawItems(null);
        // 확정시 살린다.
        // $Object.clearData(getContext, failCallback);
        $Object.clearData(selectWorkData, failCallback);
    }
    function saveAnnotation(bViewMessage) {
        var $this = $(this);
        if($this.hasClass("active")) {
            $Object.saveContentForWorkByParameter(
                frameStorage
                , function() {
                    $this.removeClass("active");
                    if(bViewMessage) {
                        $.alert("작업한 내용이 임시저장 됐습니다.", function() {
                            selectWorkData();
                        });
                    } else {
                        selectWorkData();
                    }
                }
            );
        }
    }
    function saveAndGotoNext() {
        var frameCount = !$.isEmptyObject(mContextInfo["subContext"]) ? mContextInfo["subContext"].length : 0;
        var workingCount = 0;
        var count = {
            confirmCount: 0, rejectCount: 0, holdCount: 0
        };
        frameStorage.forEach(function(v) {
            if(v.boxes.length > 0 || v.isNotObject) {
                workingCount++;
            }
        });

        if($.isEmptyObject(gCategory) || $.isEmpty(gCategory.inOutCtg) || $.isEmpty(gCategory.areaCtg)) {
            $.alert("실/내외, 장소를 지정해 주세요.");
            return;
        }
        if(workingCount < frameCount) {
            $.alert("작업할 프레임이 남아 있습니다.");
            return false;
        }

        $.confirm("작업내용을 검수요청하고 다음 파일로 이동합니다.<br>검수요청 하시겠습니까?",
            function() {
                $Object.saveContentForWorkByParameter(frameStorage, $Object.requestInspectForWork);
            });
    }
    function ignoreAndGotoNext() {
        $.commentAll(
            "작업불가 사유를 입력하면 작업불가 항목으로 지정됩니다.<br>작업불가 항목으로 지정하시겠습니까?"	// messages
            , function(data) {
                $Object.requestIgnoreForWork(data.comment);
            }					// ok Function
            , null				// cancel Function
            , "작업불가 지정"		// Title
            , "작업불가"				// OK Title
            , "취소"				// Cancel Title
            , [{label:"Comment :", lbl_type:"text", name:"comment", lbl_ph:"작업불가 사유를 입력해 주세요." }]			// label list
        );
    }
    // 작업내용을 저장 한 후에 자동으로 실행할 함수 (변경이 필요하면 함수 내에 구현, 함수명은 변경하지 마세요.)
    function saveResult() {
        clearDisplay();
        emptyTemplateData();
        getCurrentJob();
    }

    /** FOR DISPLAY CONTENTS **/
    function confirmResetData() {
        var $this = $(this);
        var selectCateogy;
        if($this.attr("name") == 'inOutCtg') {
            selectCateogy = selectPlaceCodes;
        } else {
            selectCateogy = selectObjectCodes;
        }

        // 작업을 한 프레임이 있으면 묻는다.
        if(frameStorage.size > 0) {
            if($(".frame_cfrm").length > 0) {
                $.alert("승인 항목 있으면 장소 변경을 할 수 없습니다.");
                $("select[name=inOutCtg]", $mP).val(gCategory.inOutCtg).prop("selected", true);
                $("select[name=areaCtg]", $mP).val(gCategory.areaCtg).prop("selected", true);
            } else {
                $.confirm(
                    "장소를 변경하면 작업한 모든 데이터가 초기화 됩니다. 신중하게 선택하세요.<br>그래도 변경하시겠습니까?"
                    , function () {
                        $.confirm("정말 초기화 하시겠습니까?"
                            , function () {
                                gCategory.inOutCtg = $("select[name=inOutCtg]", $mP).val();
                                if($this.attr("name") == 'inOutCtg') {
                                    if(gCategory.inOutCtg == 'IM_I_TYPE') {
                                        gCategory.areaCtg = "FRAME_I_1";
                                    } else if(gCategory.inOutCtg == 'IM_O_TYPE') {
                                        gCategory.areaCtg = "FRAME_O_1";
                                    } else {
                                        gCategory.areaCtg = "";
                                    }
                                } else {
                                    gCategory.areaCtg = $("select[name=areaCtg]", $mP).val();
                                }
                                selectCateogy();
                                clearWorkData();
                            }, function () {
                                $("select[name=inOutCtg]", $mP).val(gCategory.inOutCtg).prop("selected", true);
                                $("select[name=areaCtg]", $mP).val(gCategory.areaCtg).prop("selected", true);
                            }
                        );
                    }
                    , function () {
                        $("select[name=inOutCtg]", $mP).val(gCategory.inOutCtg).prop("selected", true);
                        $("select[name=areaCtg]", $mP).val(gCategory.areaCtg).prop("selected", true);
                    }
                );
            }
        }
        // 작업한 프레임이 없으면 묻지 않고 변경한다
        else {
            if(typeof selectCateogy === 'function') {
                gCategory.inOutCtg = $("select[name=inOutCtg]", $mP).val();
                if($this.attr("name") == 'inOutCtg') {
                    if(gCategory.inOutCtg == 'IM_I_TYPE') {
                        gCategory.areaCtg = "FRAME_I_1";
                    } else {
                        gCategory.areaCtg = "FRAME_O_1";
                    }
                } else {
                    gCategory.areaCtg = $("select[name=areaCtg]", $mP).val();
                }
                selectCateogy();
                clearWorkData();
            }
        }
    }
    function selectPlaceCodes() {
        fillTemplateDate();
        if($.isEmpty($("select[name=inOutCtg]", $mP).val())) {
            $("select[name=areaCtg]",$mP).html('<option value="">장소 선택</option>');
            $("div.select_group", $mP).html("");
        } else {
            $Object.selectPlaceCodeList($("select[name=inOutCtg]", $mP).val(), function (data) {
                var html = $.templates("#selectOptionOnlyTemplate").render(data);
                var $placeTypeSelector = $("select[name=areaCtg]", $mP).html(html);
                $placeTypeSelector.on("focus", function() { gCategory.areaCtg = $(this).val(); }).on("change", confirmResetData);
                if(!$.isEmpty(gCategory.areaCtg)) {
                    $("select[name=areaCtg]", $mP).val(gCategory.areaCtg).prop("selected", true);
                    selectObjectCodes();
                } else {
                    $("select[name=areaCtg] option:eq(0)", $mP).prop("selected", true);
                    selectObjectCodes();
                }
            });
        }
        gCategory.inOutCtg = $("select[name=inOutCtg]", $mP).val();
        // set global parameter
        $Object.setGParameter(gCategory);
    }
    function selectObjectCodes() {
        fillTemplateDate();
        gCategory.areaCtg = $("select[name=areaCtg]", $mP).val();
        if(!$.isEmpty(gCategory.areaCtg)) {
            MindsJS.loadJson(
                '/biz/comm/selectCodeWithExData.json',
                {grpCode: $("select[name=areaCtg] option:selected", $mP).val()},
                function (result) {
                    var html = "";
                    html += $.templates("#objSelectionTemplate").render(result.data);
                    $("div.select_group", $mP).html(html);
                }
            );
            gCategory.areaCtg = $("select[name=areaCtg]", $mP).val();
            // set global parameter
            $Object.setGParameter(gCategory);
        }
    }
    function displayContents(context) {
        // 0. 화면 표시 데이터를 초기화한다.
        // clearDisplay();
        // 1. context info를 local에 임시저장한다.
        mContextInfo = context;
        // 2. 원본데이터를 보여줄 필요가 있으면 보여준다.
        if($.isEmptyObject(mContextInfo) || $.isEmptyObject(mContextInfo["mainContext"].orgFileName)) {
            $("span.file_name", $mP).html("원본 데이터 파일을 불러오지 못했습니다.");
            $.alert("원본 데이터 파일을 불러오지 못했습니다.");
            return;
        }
        // 3. JOB과 PROJECT에 관한 정보를 입력한다.
        $("span.file_name", $mP).html(mContextInfo["mainContext"].orgFileName);
        drawThumbnailList(mContextInfo["subContext"]);

        selectWorkData();
    }

    function drawThumbnailList(jobSubFileList) {
        if(jobSubFileList == null) return;
        $("div.frame_info span.totalFrameF", $mP).html(jobSubFileList.length);
        // $("div.progress_cases.common_box em.totalFrame", $mP).html(jobSubFileList[0]["reserve2"]);
        $("div.progress_cases.common_box em.totalFrame", $mP).html(jobSubFileList.length);

        // Media 파일을 콘트롤러에 표시한다
        $.each(jobSubFileList, function(i, v) {
            var image64 = v.atchFile;
            if($.isEmpty(image64)) {
                $.alert("원본 데이터 파일을 불러오지 못했습니다."); // 원본 이미지를 불러오지 못했습니다.
                return;
            }
            var base64ImageContent = image64.replace(/^data:image\/(png|jpeg);base64,/, "");
            var extType = v.extName == ".png"? "image/png" : "image/jpeg";
            var thumbnailBlob = base64ToBlob(base64ImageContent, extType);

            var blobUrl = URL.createObjectURL(thumbnailBlob);
            v["thumbSourceBlob"] = blobUrl;
        });
        var thumbListHtml = $.templates("#thumbnailView").render(mContextInfo["subContext"]);
        var $thumbList = $("ul.thumbList", $mP).html(thumbListHtml);
        $thumbList.find("li").not(".frame_cfrm").on("click", function() {
            getChoicedImage($(this).attr("atchFileId"));
            // $("div.progress_cases.common_box em.current", $mP).html($(this).find("img").attr("ownframe"));  //.padStart(4, "0")
            $("div.progress_cases.common_box em.current", $mP).html(($(this).attr("offset")*1)+1);  //.padStart(4, "0")
            $("div.frame_info span.currentF", $mP).html(($(this).attr("offset")*1)+1);

            $(this).siblings("li").removeClass("selected");
            $(this).addClass("selected");

            // 방해물 없음으로 체크한 프레임은 '방해물 없음 버튼을 활성화 시킨다.
            var selectItemData = frameStorage.get($(this).attr("contextId"));
            if(!$.isEmptyObject(selectItemData)) {
                selectItemData.isNotObject ? $("button.noObject", $mP).addClass("active") : $("button.noObject", $mP).removeClass("active");
            } else {
                $("button.noObject", $mP).removeClass("active");
            }
        });
    }
    function getChoicedImage(atchFileId) {
        $Object.selectCurrentContents(atchFileId, function(data) {
            var resource = data.atchFile;
            if($.isEmpty(resource)) {
                $.alert("원본 데이터 파일을 불러오지 못했습니다."); // 원본 이미지를 불러오지 못했습니다.
                return;
            }
            var base64ImageContent = resource.replace(/^data:image\/(png|jpeg);base64,/, "");
            var extType = data.extName == ".png"? "image/png" : "image/jpeg";
            var resourceBlob = base64ToBlob(base64ImageContent, extType);
            var blobUrl = URL.createObjectURL(resourceBlob);

            $("img#dataSource", $mP).attr("src", blobUrl);
            $(".work_img").removeClass("loadingImg");
            // 불러온 workdata를 표시한다

        });
    }

    function dataRedraw(boxes) {
        var contextId = $("ul.thumbList", $mP).find("li.selected").attr("contextId");
        var currentFrame = frameStorage.get(contextId);
        if($.isEmptyObject(currentFrame)) {
            $UI.drawItems(null);
            return;
        } else {
            if(boxes != null) {
                currentFrame.boxes = [];
                currentFrame.boxCount = 0;
                boxes.forEach(function(v, i) {
                    var BoxTemplate = {
                        Box: { x: v.x, y: v.y, w: v.width, h: v.height}
                        , category_id: v.ctg
                        , category_name : v.text
                    };
                    currentFrame.boxes.push(BoxTemplate);
                });
                currentFrame.boxCount = boxes.length;
                frameStorage.set(contextId, currentFrame);
                if(currentFrame.boxCount <= 0) {
                    $("ul.thumbList", $mP).find("li.selected").removeClass("tag");
                } else {
                    $("ul.thumbList", $mP).find("li.selected").addClass("tag");
                }
            } else {
                $UI.drawItems(currentFrame.boxes);
            }
        }
    }

    // base64 -> blob 변환
    function base64ToBlob(base64, mime) {
        mime = mime || '';
        var sliceSize = 1024;
        var byteChars = window.atob(base64);
        var byteArrays = [];
        for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
            var slice = byteChars.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: mime });
    }

    function getPrevFrame() {
        var $currentSelectedFrame = $("ul.thumbList", $mP).find(".selected");
        var $targetFrame = $currentSelectedFrame.prevAll("li").not("li.frame_cfrm").eq(0);
        $targetFrame.click();
    }
    function getNextFrame() {
        var $currentSelectedFrame = $("ul.thumbList", $mP).find(".selected");
        var $targetFrame = $currentSelectedFrame.nextAll("li").not("li.frame_cfrm").eq(0);
        $targetFrame.click();
    }
    /** TO DO : **/
    function dataRender(renderData) {
        // player에 region을 표시할 데이터가 있는 경우에만 실행
        $("ul.thumbList li", $mP).removeClass("tag");
        if(!$.isEmptyObject(renderData)) {
            $.each(renderData.contentList, function(i,item) {
                if($.isEmptyObject(item.contextId)) {
                    // job contents 연결이 안돼 있는 항목
                    gCategory.ctgContextId = item.workContextId;
                    gCategory.inOutCtg = item.inOutCtg;
                    gCategory.areaCtg = item.areaCtg;
                    $Object.setGParameter(gCategory);

                    $("select[name=inOutCtg]", $mP).val(gCategory.inOutCtg).prop("selected", true);
                    selectPlaceCodes();
                    return;
                }
                if(!$.isEmptyObject(item.context)) {
                    item.boxes = JSON.parse(item.context);
                } else {
                    item.boxes = [];
                }
                if(!$.isEmptyObject(item.contextId)) {
                    if(item.boxes.length > 0) {
                        $("ul.thumbList", $mP).find("li[contextId=" + item.contextId + "]").addClass("tag");
                    } else {
                        $("ul.thumbList", $mP).find("li[contextId=" + item.contextId + "]").removeClass("tag");
                    }
                } else {
                }
                delete item.context;
                setFrameInfo(item);
            });
            if(isInitialize) {
                $("ul.thumbList", $mP).find("li").not(".frame_cfrm").eq(0).click();
                isInitialize = false;

                if(gCategory.inOutCtg == null) {
                    $("select[name=inOutCtg] option:eq(0)", $mP).eq(0).prop("selected", true);
                }
                if(gCategory.areaCtg == null) {
                    $("select[name=areaCtg]",$mP).html('<option value="">장소 선택</option>');
                    $("div.select_group", $mP).html("");
                }
            }
        }
        // To do: 작업한 내용을 화면에 표시한다. (표 데이터)
    }
    function setFrameInfo(frameInfo) {
        if($.isEmptyObject(frameStorage)) {
            frameStorage = new Map();
        }
        frameStorage.set(frameInfo.contextId, frameInfo);
    }
    function emptyFrameCheck(event, $this) {
        // 현재 프레임은 방해물이 없습니다.
        var contextId = $("ul.thumbList", $mP).find("li.selected").attr("contextId");
        var atchFileId = $("ul.thumbList", $mP).find("li.selected").attr("atchFileId");

        var currentFrame = frameStorage.get(contextId);
        if($.isEmptyObject(currentFrame)) {
            currentFrame = {
                boxes:[],       // boxTemplates
                boxCount:0,
                isNotObject:false,
                atchFileId:atchFileId, contextId:contextId, status:null
            };
        }
        if(!currentFrame.isNotObject) {
            $.confirm(
                "이 프레임을 방해물 없음으로 지정 하시겠습니까?",
                function() {
                    currentFrame.isNotObject = true;
                    currentFrame.boxes = [];
                    frameStorage.set(contextId, currentFrame);
                    $("ul.thumbList", $mP).find("li[contextId="+contextId+"]").removeClass("tag");
                    $UI.drawItems(currentFrame.boxes);

                    $this.addClass("active");
                    // getNextFrame();
                }
            );
        } else {
            $.confirm(
                "이 프레임을 방해물 없음에서 해제 하시겠습니까?",
                function() {
                    currentFrame.isNotObject = false;
                    frameStorage.set(contextId, currentFrame);
                    $this.removeClass("active");
                }
            );
        }
    }
    function removeBox() {
        $UI.removeSelectCell();
    }
    function clearDisplay() {
        // 이미지 작업창 지우기
        $UI.clearUI();
        // 프레임 이미지들 지우기
        $("ul.thumbList", $mP).find("img").remove();
        $("ul.thumbList", $mP).find("li").removeClass("confirmed frame_cfrm frame_rjct frame_hold");

        gCategory = {};
        $Object.setGParameter(gCategory);
        $("select[name=inOutCtg] option:eq(0)", $mP).prop("selected", true);
        $("select[name=areaCtg]",$mP).html('<option value="">장소 선택</option>');
        $("div.select_group", $mP).html("");

        // To do:여기에서 로컬 변수를 초기화 한다.
        $("div.reject_box", $mP).html("");
        frameStorage = new Map();

        isInitialize = true;
    }
    function fillTemplateDate() {
        $(".btnSave", $mP).addClass("active");
    }
    function emptyTemplateData() {
        $(".btnSave", $mP).removeClass("active");
    }

    function generateBoxingAndDrag(point) {
        if($.isEmptyObject($("div.select_group", $mP).find("input:checked"))) {
            $.alert("방해물 유형을 선택해 주세요.");
            return;
        }

        var contextId = $("ul.thumbList", $mP).find("li.selected").attr("contextId");
        var atchFileId = $("ul.thumbList", $mP).find("li.selected").attr("atchFileId");
        var currentFrame = frameStorage.get(contextId);
        if($.isEmptyObject(currentFrame)) {
            currentFrame = {
                boxes:[],
                boxCount:0,
                isNotObject:false,
                atchFileId:atchFileId, contextId:contextId, status:null
            };
        }

        if(currentFrame.isNotObject) {
            $.alert("이 프레임은 [방해물 없음]으로 지정돼 있습니다.<br>먼저 [방해물 없음]을 해지해 주세요.");
            return;
        }
        fillTemplateDate();

        var boxInfo = {};
        var boxTemplate = {
            x: point.x, y: point.y, w: ImageUI.MINIMUM_SIZE, h: ImageUI.MINIMUM_SIZE
        };
        boxInfo.Box = boxTemplate;
        boxInfo.category_id = $("div.select_group", $mP).find("input:checked").val();
        boxInfo.category_name = $("div.select_group", $mP).find("input:checked").siblings("label").text();

        currentFrame.boxes.push(boxInfo);
        currentFrame.boxCount = currentFrame.boxes.length;

        if(currentFrame.boxCount <= 0) {
            $("ul.thumbList", $mP).find("li.selected").removeClass("tag");
        } else {
            $("ul.thumbList", $mP).find("li.selected").addClass("tag");
        }

        frameStorage.set(contextId, currentFrame);

        $UI.drawItems(currentFrame.boxes);
    }

    function failCallback(result) {
        console.log(result);
    }

    return {
        init: init
    }
})();