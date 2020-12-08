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

    // 전역변수 (데이터관련)
    var gCategory = {};
    // Box 관련 전역변수
    var frameStorage = new Map();

    var isInitialize = true;
    var isImpossible = false;

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
            // checkPoint: generateBoxingAndDrag,
            redraw: dataRedraw
        });
        $("canvas#dataSourceCanvas",$mP).css("transform", 'translate(-50%, -50%)');
        $("canvas#dataSourceCanvas",$mP).css("top", '50%');

        bindEventHandler();
        getCurrentJob();
    }

    function bindEventHandler() {
        // about navi action
        $("button.btnNext", $mP).on("click", requestComplete);		// 전체적 승인 버튼
        $("button.btnReject", $mP).on("click", requestReject);		// 전체적 반려 버튼
        $("button.btnSave", $mP).on("click", saveAnnotation);       // 임시저장
        // image navigator
        $("button.btn_prev", $mP).on("click", getPrevFrame);
        $("button.btn_next", $mP).on("click", getNextFrame);

        // 프레임 개별 승인 버튼
        $("button.btn_frame_rjct", $mP).on("click", rejectByFrame);
        $("button.btn_frame_hold", $mP).on("click", holdOnFrame);
        $("button.btn_frame_cfrm", $mP).on("click", confirmByFrame);
    }

    function getCurrentJob() {
        $Object.requestAssignJob(getContext, failCallback);
    }
    function getContext(jobInfo) {
        checkStatus(jobInfo);
        $Object.getCurrentJobContext(displayContents, failCallback);
    }
    function selectWorkData() {
        $Object.selectData(dataRender, failCallback);
    }
    function clearWorkData() {
        $Object.clearData(clearDisplay, failCallback);
    }
    function clearDisplay() {
        // 이미지 작업창 지우기
        $UI.clearUI();
        // 프레임 이미지들 지우기
        $("ul.thumbList", $mP).find("img").remove();
        $("ul.thumbList", $mP).find("li").removeClass("confirmed frame_cfrm frame_rjct frame_hold");

        $("select[name=inOutCtg] option:eq(0)", $mP).prop("selected", true);
        $("select[name=areaCtg]",$mP).html('<option value="">장소 선택</option>');

        // To do:여기에서 로컬 변수를 초기화 한다.
        $("div.reject_box", $mP).html("");
        frameStorage = new Map();
        isInitialize = true;
        isImpossible = false;
    }

    function checkInspectCount() {
        var frameCount = !$.isEmptyObject(mContextInfo["subContext"]) ? mContextInfo["subContext"].length : 0;
        // var inspectCount = 0;
        var count = {
            confirmCount: 0, rejectCount: 0, holdCount: 0
        };
        frameStorage.forEach(function(v) {
            // inspectCount++;
            count.confirmCount += v.status == 'CM';
            count.holdCount += v.status == 'HD';
            count.rejectCount += v.status == 'RJ';
        });

        if(count.confirmCount+count.rejectCount < frameCount) {
            $.alert("검수할 프레임이 남아 있습니다.");
            return false;
        }
        if(count.holdCount > 0) {
            $.alert("보류한 프레임이 남아 있어서 검수완료 할 수 없습니다.");
            return false;
        }
        return count;
    }

    function requestComplete() {
        if(isImpossible) {
            $.confirm("작업을 승인하고 검수를 완료 하시겠습니까?", function() {
                $Object.saveContentForWorkByParameter(frameStorage, $Object.requestComplete);
            });
            return;
        }
        var count = checkInspectCount();
        if(count) {
            if(count.rejectCount == 0) {
                $Object.saveContentForWorkByParameter(frameStorage, $Object.requestComplete);
            } else {
                $.alert("반려된 항목이 있습니다. <br>반려 사유를 작성하고 [반려건 있음 & 다음파일]을 눌러 반려해 주세요.");
            }
        }
    }
    function requestReject() {
        // 반려사유 입력을 추가
        var rejectComment = $("textarea[name=comment]", $mP).val();
        var message = $.isEmpty(rejectComment) ? '반려사유를 입력하지 않으면 재작업에 지장이 있습니다. 반려사유 없이 ' : '';
        $.confirm(
            message+"반려하시겠습니까?",
            function() {
                $Object.saveContentForWorkByParameter(frameStorage, function() { $Object.requestReject(rejectComment); });
            },
            null,
            "Information"
        );
    }

    function getPrevFrame() {
        var $currentSelectedFrame = $("ul.thumbList", $mP).find(".selected");
        var $targetFrame = $currentSelectedFrame.prevAll("li").eq(0);
        $targetFrame.click();
    }
    function getNextFrame() {
        var $currentSelectedFrame = $("ul.thumbList", $mP).find(".selected");
        var $targetFrame = $currentSelectedFrame.nextAll("li").eq(0);
        $targetFrame.click();
    }
    function dataRender(renderData) {
        $("ul.thumbList li", $mP).removeClass("tag");
        if(!$.isEmptyObject(renderData)) {
            $.each(renderData.contentList, function(i,item) {
                if($.isEmptyObject(item.contextId)) {
                    // job contents 연결이 안돼 있는 항목
                    gCategory.ctgContextId = item.workContextId;
                    gCategory.inOutCtg = item.inOutCtg;
                    gCategory.areaCtg = item.areaCtg;

                    $("select[name=inOutCtg]", $mP).html("<option>"+item.inOutCtgNm+"</option>");
                    $("select[name=areaCtg]", $mP).html("<option>"+item.areaCtgNm+"</option>");
                    // selectPlaceCodes();
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
                    if(item.status != null) {
                        $("ul.thumbList", $mP).find("li[contextId=" + item.contextId + "]").removeClass("frame_cfrm frame_rjct frame_hold")
                            .addClass(item.status == 'CM' ? 'confirmed frame_cfrm' : item.status == 'RJ' ? 'confirmed frame_rjct' : item.status == 'HD' ? 'confirmed frame_hold' : '');
                    }

                } else {
                }
                delete item.context;
                setFrameInfo(item);
            });
            if(isInitialize) {
                if($("ul.thumbList", $mP).find("li").not(".frame_cfrm").size > 0) {
                    $("ul.thumbList", $mP).find("li").not(".frame_cfrm").eq(0).click();
                } else {
                    $("ul.thumbList", $mP).find("li").eq(0).click();
                }
                isInitialize = false;

                if(gCategory.inOutCtg == null) {
                    $("select[name=inOutCtg]", $mP).html('<option value="">선택 안함</option>');
                }
                if(gCategory.areaCtg == null) {
                    $("select[name=areaCtg]",$mP).html('<option value="">선택 안함</option>');
                    $("div.select_group", $mP).html("");
                }
            }
        } else {
            $("select[name=inOutCtg]", $mP).html('<option value="">선택 안함</option>');
            $("select[name=areaCtg]",$mP).html('<option value="">선택 안함</option>');
        }
        // To do: 작업한 내용을 화면에 표시한다. (표 데이터)
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
        $thumbList.find("li").on("click", function() {
            getChoicedImage($(this).attr("atchFileId"));
            // $("div.progress_cases.common_box em.current", $mP).html($(this).find("img").attr("ownframe"));  //.padStart(4, "0")
            $("div.progress_cases.common_box em.current", $mP).html(($(this).attr("offset")*1)+1);  //.padStart(4, "0")
            $("div.frame_info span.currentF", $mP).html(($(this).attr("offset")*1)+1);

            $(this).siblings("li").removeClass("selected");
            $(this).addClass("selected");

            // var scrollPosition = $(this).offset().top - $(this).parents(".frame_box.thumbList").offset().top;
            // console.log(scrollPosition);
            // $(this).parents(".frame_box.thumbList").scrollTop(scrollPosition-19);

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

    function setFrameInfo(frameInfo) {
        if($.isEmptyObject(frameStorage)) {
            frameStorage = new Map();
        }
        frameStorage.set(frameInfo.contextId, frameInfo);
    }

    function checkStatus(jobInfo) {
        $(".faild_box", $mP).html("");
        $(".reject_box", $mP).html("");

        $("span.workerId", $mP).html(jobInfo.workerId);
        // 작업불가 체크
        if(jobInfo.jobStatus == 'IM') {
            isImpossible = true;
            var rejectCommentHtml = $.templates("#commentBoxTemplate").render(
                {title: "작업 불가 사유 :", comment: jobInfo.comment});
            $("div.faild_box", $mP).html(rejectCommentHtml).show();
            $.alert("작업자 '"+jobInfo.workerId + "'님이 작업불가로 지정한 항목입니다. 사유를 확인 후 검수를 결정해 주세요.");
        } else {
            $("div.faild_box", $mP).hide();
        }
        // 반려사유 체크
        var rejectCommentHtml = $.templates("#commentBoxTemplate").render(
            {title: "반려 사유를 입력해 주세요 :", writeMode:true, comment: jobInfo.rejectComment});
        $("div.reject_box", $mP).html(rejectCommentHtml).show();
        $("div.reject_box", $mP).find("textarea").val(jobInfo.rejectComment);
    }

    function rejectByFrame() {
        var contextId = $("ul.thumbList", $mP).find("li.selected").attr("contextId");
        var currentFrame = frameStorage.get(contextId);
        if($.isEmptyObject(currentFrame)) {
            var atchFileId = $("ul.thumbList", $mP).find("li.selected").attr("atchfileid");
            currentFrame = {
                boxes:[],       // boxTemplates
                boxCount:0,
                isNotObject:false,
                atchFileId:atchFileId, contextId:contextId, status:null
            };
        }
        currentFrame.status = 'RJ';
        $("ul.thumbList", $mP).find("li.selected").removeClass("frame_hold frame_cfrm").addClass("confirmed").addClass("frame_rjct");
        frameStorage.set(contextId, currentFrame);
        getNextFrame();
    }
    function holdOnFrame() {
        var contextId = $("ul.thumbList", $mP).find("li.selected").attr("contextId");
        var currentFrame = frameStorage.get(contextId);
        if($.isEmptyObject(currentFrame)) {
            var atchFileId = $("ul.thumbList", $mP).find("li.selected").attr("atchfileid");
            currentFrame = {
                boxes:[],       // boxTemplates
                boxCount:0,
                isNotObject:false,
                atchFileId:atchFileId, contextId:contextId, status:null
            };
        }
        currentFrame.status = 'HD';
        $("ul.thumbList", $mP).find("li.selected").removeClass("frame_cfrm frame_rjct").addClass("confirmed").addClass("frame_hold");
        frameStorage.set(contextId, currentFrame);
        getNextFrame();
    }
    function confirmByFrame() {
        var contextId = $("ul.thumbList", $mP).find("li.selected").attr("contextId");
        var currentFrame = frameStorage.get(contextId);
        if($.isEmptyObject(currentFrame)) {
            var atchFileId = $("ul.thumbList", $mP).find("li.selected").attr("atchfileid");
            currentFrame = {
                boxes:[],       // boxTemplates
                boxCount:0,
                isNotObject:false,
                atchFileId:atchFileId, contextId:contextId, status:null
            };
        }
        if((currentFrame.boxes != null &&currentFrame.boxes.length > 0) || currentFrame.isNotObject) {
            currentFrame.status = 'CM';
            $("ul.thumbList", $mP).find("li.selected").removeClass("frame_rjct frame_hold").addClass("confirmed").addClass("frame_cfrm");
            frameStorage.set(contextId, currentFrame);
            getNextFrame();
        } else {
            $.alert("승인요건을 충족하지 못했습니다.<br>승인요건은 최소 1개이상의 방해물이 있거나, [방해물 없음]으로 지정돼야 합니다.");
        }
    }

    function saveAnnotation(bViewMessage) {
        $Object.saveContentForWorkByParameter(
            frameStorage
            , function() {
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

    function saveResult() {
        clearDisplay();
        getCurrentJob();
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

    function failCallback(result) {
        console.log(result);
    }

    return {
        init: init
    }
})();