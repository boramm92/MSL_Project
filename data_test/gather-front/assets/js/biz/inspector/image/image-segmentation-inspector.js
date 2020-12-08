// 프로젝트 타입에 맞게 class명 지정
// view 파일(jsp)에서 init할 때 사용하는 클래스 명
var imageSegmentationScriptView = (function() {
    // 프로젝트 공통 관리 객체
    var $mP;		// document object model
    var $Object;	// script object model
    var $UI;		// document ui

    var mContextInfo = { orgFileName : null, atchFile : null, extName : null };		// Main Contents

    var projectType = "P";					// Sound:S, Text:T, Image:P, Video:V
    var defaultJobType = "IS";			 			// xxxJobTypeEnum.java 참고
    var jobClassName = "segmentation";		// 쌍으로 생성할 jsp 파일 id, file name format : audio-{jobClassName}-worker.jsp

    // 전역변수
    var offsetIndex = -1;
    var mCategory = [];
    var mItemIndex = 0;
    var gSelectedWorkType = "Segmentation";
    var gUndoItem = { Segmentation: [], Keypoint: [] };

    // POLYGON 관련 전역변수
    var itemStorage = new Map();
    var polygonTemplate = [];
    var itemTemplate = {
        Segmentation:[]		// poligon1,poligon2,...,poligonN
        ,Keypoint:[]		// poligon
        ,category_id:'', category_name:'', contextId:null, status:null
    };
    var polygonCount = 0;

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
            strokeColor: '#FFCC01',
            checkPoint: generatePolygonAtPoint
        });

        bindEventHandler();
        getCurrentJob();
    }
    function bindEventHandler() {
        // about navi action
        $("button.btnNext", $mP).on("click", requestComplete);		// 전체적 승인 버튼
        $("button.btnReject", $mP).on("click", requestReject);		// 전체적 반려 버튼

        $(document).on("click", "button.btn_confirm", smallComplete);   // 부분적 승인 버튼
        $(document).on("click", "button.btn_reject", smallReject);      // 부분적 반려 버튼

        // $("button.btnNext").addClass('disabled'); //모든 케이스 검수 하면 disabled 풀림
        // $("button.btnReject").addClass('disabled'); //모든 케이스 검수 하면 disabled 풀림

        //승인 건에 대해서도 segmentation, keypoint 볼 수 있게
        $(document).on("click","tr", function(){
            $("tr").attr("style", "pointer-events:auto");
        });
    }

    // 공통 인터페이스 구현 함수
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

    function requestComplete() {
        if($("div.faild_box h4").length == 1) { //작업 불가 사유가 타당하면 검수 완료 버튼 눌려야함.
            $Object.saveSubInspectionResult(itemStorage, $Object.requestComplete);
        }
        else if(!$("button.btnNext").hasClass("disabled")) {
            // $Object.requestComplete();
            if(isAllSmallConfirmBtnSelected()) { //모든 케이스 검수 완료
                $Object.saveSubInspectionResult(itemStorage, $Object.requestComplete);
            } else $.alert("반려된 데이터가 있습니다.<br>반려 버튼을 눌러주세요.");
        }
        else {
            $.alert("검수되지 않은 데이터가 있습니다.<br>모든 데이터를 검수해야 다음 파일로 넘어갈 수 있습니다.");
        }
    }
    function requestReject() {
        if($("button.btnNext").hasClass("disabled")) $.alert("검수되지 않은 데이터가 있습니다.<br>모든 데이터를 검수해야 다음 파일로 넘어갈 수 있습니다.");
        else{
            /*if(isAllSmallConfirmBtnSelected()) $.alert("모든 데이터가 승인되었습니다.<br>검수 버튼을 눌러주세요.");
            else{

            }*/
            //부분 승인, 반려 결과 reserve2에 반영
            $Object.saveSubInspectionResult(
                itemStorage
                , function() {
                    // emptyTemplateData();
                    // selectWorkData();
                    // $.alert("데이터가 임시저장 됐습니다.");
                }
            );

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
    }

    function smallComplete() {
        var contextid = $(this).attr('contextid');

        //사용자가 이미 선택된 반려 버튼을 다시 눌러 반려를 취소시키려는 행동을 취하는 케이스
        /*if($(`button.btn_confirm[contextid=${contextid}]`).hasClass("on") && !$(`button.btn_reject[contextid=${contextid}]`).hasClass("on")) {
            $(`button.btn_reject[contextid=${contextid}]`).addClass("on");
            $(`button.btn_confirm[contextid=${contextid}]`).addClass("on");

            if(isAllSmallBtnSelected()) $("button.btnNext").removeClass('disabled');
            else $("button.btnNext").addClass('disabled');

            return;
        }*/

        $(`button.btn_reject[contextid=${contextid}]`).removeClass("on");
        $(`button.btn_confirm[contextid=${contextid}]`).addClass("on");

        //activate next button
        if(isAllSmallBtnSelected()){
            $("button.btnNext").removeClass('disabled');
            $("button.btnReject").removeClass('disabled');
        }

        // var idx = $(this).parents("tr").find("input[name=clothes_slt]").attr("offset");
        $(this).parents("tr").find("input[name=clothes_slt]").click();
        saveSmallInspection(makeSubItemTemplate("CM"));
        itemTemplate.status = "CM";
    }

    function smallReject() {
        var contextid = $(this).attr('contextid');

        //사용자가 이미 선택된 반려 버튼을 다시 눌러 반려를 취소시키려는 행동을 취하는 케이스
        /*if($(`button.btn_reject[contextid=${contextid}]`).hasClass("on") && !$(`button.btn_confirm[contextid=${contextid}]`).hasClass("on")) {
            $(`button.btn_confirm[contextid=${contextid}]`).addClass("on");
            $(`button.btn_reject[contextid=${contextid}]`).addClass("on");

            if(isAllSmallBtnSelected()) $("button.btnNext").removeClass('disabled');
            else $("button.btnNext").addClass('disabled');

            return;
        }*/

        $(`button.btn_confirm[contextid=${contextid}]`).removeClass("on");
        $(`button.btn_reject[contextid=${contextid}]`).addClass("on");

        //activate next button
        if(isAllSmallBtnSelected()){
            $("button.btnNext").removeClass('disabled');
            $("button.btnReject").removeClass('disabled');
        }

        // var idx = $(this).parents("tr").find("input[name=clothes_slt]").attr("offset");
        $(this).parents("tr").find("input[name=clothes_slt]").click();
        saveSmallInspection(makeSubItemTemplate("RJ"));
        itemTemplate.status = "RJ";
    }

    function makeSubItemTemplate(statusValue){
        //작은 반려, 승인 버튼 여러번 선택 시 생성된 items 값 반영하지 않기 위함.
        var newItemTemplate = {
            Segmentation:[],
            Keypoint:[],
            category_id:'', category_name:'', contextId:null, status:null
        };

        Object.keys(newItemTemplate).forEach(function(key){
            newItemTemplate[key] = itemTemplate[key];
        });
        newItemTemplate.status = statusValue;

        return newItemTemplate;
    }

    function saveSmallInspection(subItemTemplate){
        $Object.saveContentForSubInspection(
            // itemStorage.get(idx)
            subItemTemplate
            , function() {
                // emptyTemplateData();
                // selectWorkData();
                // $.alert("데이터가 임시저장 됐습니다.");
            }
        );
    }

    function isAllSmallConfirmBtnSelected(){
        //반려버튼 0개 선택, 승인버튼 n개 선택이어야 모든 버튼이 승인으로 눌린 케이스
        var rejectNum = $("button.btn_reject.on").length;
        var confirmNum = $("button.btn_confirm.on").length;
        var totalSubBtnNum = rejectNum + confirmNum;
        var totalConfirmBtnNum = $("button.btn_confirm").length;

        //totalConfirmBtnNum > 0: 데이터 없이 작업 불가 사유로 올라온 경우 true 반환 방지
        if(rejectNum == 0 && confirmNum == totalSubBtnNum && totalConfirmBtnNum > 0) return true;
        return false;
    }

    function isAllSmallBtnSelected(){
        //버튼 중 on 된것의 개수가 [모든 버튼/2]개여야 모두 선택된 케이스
        var rejectNum = $("button.btn_reject.on").length;
        var confirmNum = $("button.btn_confirm.on").length;

        var totalBtnNum = $("button.btn_reject").length + $("button.btn_confirm").length;   //전체 반려, 승인 버튼 개수
        var disabledRejectNum = $("button.btn_reject").filter("[disabled]").length;         //disabled된 반려 버튼 개수
        var disabledConfirmNum = $("button.btn_confirm").filter("[disabled]").length;       //disabled된 승인 버튼 개수
        var remainedBtnNum = totalBtnNum - (disabledConfirmNum + disabledRejectNum);

        if(rejectNum + confirmNum == remainedBtnNum / 2) return true;
        return false;
    }

    // 작업내용을 저장 한 후에 자동으로 실행할 함수 (변경이 필요하면 함수 내에 구현, 함수명은 변경하지 마세요.)
    function saveResult() {
        $UI.clearUI();
        getCurrentJob();
    }

    function checkStatus(jobInfo) {
        $(".faild_box", $mP).html("");
        $(".reject_box", $mP).html("");
        // 작업불가 체크
        if(jobInfo.jobStatus == 'IM') {
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

        if(isAllSmallBtnSelected()){
            $("button.btnNext").removeClass('disabled');
            $("button.btnReject").removeClass('disabled');
        }
    }

    ///////////////////////////////////// 단독 화면 기능
    $.fn.bindEventItem = function(){
        $(this).find("div.selected_item").off("click").on("click", showCategory);
        $(this).find("button.btn_segment").off("click").on("click", drawSegmentData);
        $(this).find("button.btn_keypoint").off("click").on("click", drawKeyPointData);
        // $(this).find("div.drop_slt_item .radio_box input").off("click").on("click", setCategory);
        $(this).find("div.drop_slt_item .radio_box input").off("click").on("click", function() {
            var $this = $(this);
            var categoryId = $(this).val();
            if(categoryId > 13) {
                if(!$.isEmptyObject(itemTemplate.Keypoint[0])) {

                    var categoryName = $(this).siblings('label').text();
                    $.confirm("[" + categoryName + "] 이 카테고리로 변경하면, Keypoint 데이터가 제거됩니다.<br>카테고리를 바꾸시겠습니까?"
                        , function() {
                            itemTemplate.Keypoint = [];
                            $this.parents("tr").find(".keypoint").hide();
                            setCategory($this);
                        }, null, '경고');
                } else {
                    $this.parents("tr").find(".keypoint").hide();
                    setCategory($this);
                }
            } else {
                $this.parents("tr").find(".keypoint").css("display", "inline-block");
                setCategory($this);
            }
        });
        $(this).find("input[name=clothes_slt]").off("click").on("click", selectItem);

    };
    function fullTemplateDate() {
        $(".btnSave", $mP).addClass("active");
    }
    function emptyTemplateData() {
        $(".btnSave", $mP).removeClass("active");
    }

    //////////////////////////////// CANVAS 동작
    function generatePolygonAtPoint(point) {
        if($(".btnCanvMove", $mP).hasClass("active")) { return; }
        // 선택된 라디오가 있다면.
        if(!$.isEmptyObject($("input:radio[name=clothes_slt]:checked"))) {
            fullTemplateDate();
            gUndoItem[gSelectedWorkType] = [];
            if($.isEmptyObject(itemTemplate)) {
                itemTemplate = {};
                // itemTemplate[$("ul.tab_title li.on", $mP).attr("name")] = [];
            }
            if($.isEmptyObject(polygonTemplate)) polygonTemplate = [];
            if($.isEmptyObject(itemTemplate[gSelectedWorkType])) {
                itemTemplate[gSelectedWorkType] = [];
            }

            //주석처리 안하면 canvas 클릭 시 영역이 선택됨.
            // polygonTemplate.push(point.x);
            // polygonTemplate.push(point.y);

            var iTemplate = itemTemplate[gSelectedWorkType];
            iTemplate[polygonCount+offsetIndex] = polygonTemplate;

            var offsetKey = $("input:radio[name=clothes_slt]:checked").attr("offset");
            itemStorage.set("_"+offsetKey, itemTemplate);

            if(gSelectedWorkType == 'Keypoint') {
                $UI.drawPointPath(iTemplate);
            } else {
                $UI.drawClosingPath(iTemplate);
            }
        }
    }

    //////////////////////////////// ITEM EVENT
    function showCategory() {
        fullTemplateDate();
        var $this = $(this).siblings('.drop_slt_item');
        $this.parents("tr").find("input[name=clothes_slt]").click();

        var selectedItemOffset = $(this).attr("offset");
        $(".drop_slt_item").each(function(i, v) {
            if($(v).siblings(".selected_item").attr("offset") == selectedItemOffset) {
                return;
            }
            if($(v).css("display") == 'block') {
                $(v).hide();
            }
        });
        $(this).siblings('.drop_slt_item').slideDown(200);
    }
    function drawSegmentData() {
        // if(gSelectedWorkType == 'Keypoint') {
        // } else {
        //     appendPolygon();
        // }
        gSelectedWorkType = "Segmentation";
        $UI.setDrawType(gSelectedWorkType);
        $("input:radio[name=clothes_slt]:checked").parents("tr:first").find("span.keypoint_num").html(1);
        $(this).parents("tr").find("input[name=clothes_slt]").click();
    }
    function drawKeyPointData() {
        gSelectedWorkType = "Keypoint";
        $UI.setDrawType(gSelectedWorkType);
        $("input:radio[name=clothes_slt]:checked").parents("tr:first").find("span.keypoint_num").html(1);
        $(this).parents("tr").find("input[name=clothes_slt]").click();
    }
    function setCategory($target) {
        var categoryName = $target.siblings('label').text();
        $target.parents('.drop_slt_item:first').siblings('.selected_item').html(categoryName);
        $target.parents('.drop_slt_item:first').slideUp(200);

        itemTemplate.category_id = $target.val();
        itemTemplate.category_name = categoryName;
    }
    function selectItem() {
        initTemplateData();

        // 현재 선택된 ITEM 의 작업데이터를 가져오고
        itemTemplate = itemStorage.get("_"+$(this).attr("offset"));
        var currentDrawItem = itemTemplate[gSelectedWorkType];
        polygonCount = currentDrawItem.length;

        if(polygonCount == 0) {
            currentDrawItem[0] = [];
            polygonCount++;
        }
        polygonTemplate = currentDrawItem[polygonCount+offsetIndex];
        if(gSelectedWorkType == "Keypoint") {
            $UI.drawPointPath(currentDrawItem);
            $('.tbl td button.btn_plus').removeClass('on');
            $(this).parents("tr:first").find(".btn_keypoint").addClass("on");
        } else {
            $UI.drawClosingPath(currentDrawItem);
            $('.tbl td button.btn_plus').removeClass('on');
            $(this).parents("tr:first").find(".btn_segment").addClass("on");
        }
    }

    //////////////////////////////// DEFINE CALLBACK
    // 기본 JOB Data 출력
    function displayContents(context) {
        // 0. 화면 표시 데이터를 초기화한다.
        clearDisplay();
        // 1. context info를 local에 임시저장한다.
        mContextInfo = context;
        // 2. JOB과 PROJECT에 관한 정로블 화면에 보여준다.
        $("em.orgFileName", $mP).html(mContextInfo.orgFileName);
        // 3. 원본데이터를 보여줄 필요가 있으면 보여준다.
        if($.isEmptyObject(mContextInfo.atchFile)) {
            $.alert("원본 데이터 파일을 불러오지 못했습니다.");
            return;
        } else {
            // MEDIA 파일을 콘트롤러에 표시한다
            let image64 = mContextInfo.atchFile;
            let base64ImageContent = image64.replace(/^data:image\/(png|jpeg);base64,/, "");
            let extType = mContextInfo.extName == ".png"? "image/png" : "image/jpeg";
            $("img#dataSource").attr("src", URL.createObjectURL(ImageJS.base64ToBlob(base64ImageContent, extType)));
        }
        getSegmentationCategory();
    }
    function dataRender(renderData) {
        itemStorage = new Map();
        gSelectedWorkType = "Segmentation";
        $UI.setDrawType(gSelectedWorkType);

        clearDisplay();
        if(!$.isEmptyObject(renderData)) {
            var arrayItems = renderData['itemStorage'];
            if(!$.isEmptyObject(arrayItems)) {
                $.each(arrayItems, function (idx, item) {
                    if(item != null && !$.isEmptyObject(item.context)) {
                        var dataTemplate = JSON.parse(item.context);
                        // 카테고리 그리기
                        item.itemIndex = mItemIndex;
                        item.category_name = dataTemplate.category_name;
                        item.categoryHtml = drawCategoryListToHtml(mItemIndex++, dataTemplate.category_id);
                        item.category_id = dataTemplate.category_id;
                        item.status = dataTemplate.status;

                        item.segmentCount = dataTemplate.Segmentation.length;
                        item.keypointCount = dataTemplate.Keypoint.length;

                        // item 그리기
                        var itemHtml = $.templates("#segment_dataTemplate").render(item);
                        var $clotheItem = $("tbody.workInfo", $mP).append(itemHtml);
                        $clotheItem.bindEventItem();

                        dataTemplate.contextId = item.contextId;
                        itemStorage.set("_"+item.itemIndex, dataTemplate);
                    }
                });
                // 아이템 다 그렸으면 첫번째 꺼 선택
                // if(!$.isEmptyObject($("input[type=radio][name=clothes_slt]", $mP).get(0))) {
                //     $("input[type=radio][name=clothes_slt]", $mP).get(0).click();
                // }
                if(!$.isEmptyObject($("label.clothes_slt", $mP).get(0))) {
                    $("label.clothes_slt", $mP).get(0).click();
                }
            } else {
                // itemStorage가 없다.
            }
        } else {
            // 표시할 데이터가 없습니다.
        }

        //초기 반려, 검수 버튼 막아두기
        $("button.btnNext").addClass('disabled'); //모든 케이스 검수 하면 disabled 풀림
        $("button.btnReject").addClass('disabled'); //모든 케이스 검수 하면 disabled 풀림

        //decide activate button
        if(isAllSmallBtnSelected()){
            $("button.btnNext").removeClass('disabled');
            $("button.btnReject").removeClass('disabled');
        }
    }
    function drawCategoryListToHtml(index, selectedId) {
        var categoryList = { data : mCategory };            // jsrender에서 category를 좌우로 정렬하기 위해 Wrapping 해준다.
        categoryList.itemIndex = index;
        categoryList.selCategoryId = selectedId;
        return $.templates("#category_mapTemplate").render(categoryList);
    }
    function clearDisplay() {
        initTemplateData();
        $("tbody.workInfo tr", $mP).remove();        // workInfo table을 지울 때 안내 메시지를 보호하기 위한 조치
        // $UI.clearUI();
        mItemIndex = 0;
        gSelectedWorkType = "Segmentation";
    }

    function getSegmentationCategory() {
        mCategory = [];
        // segmentation 카테고리만 가져오는 것으로 수정
        $Object.selectProjectCategorySubList(function(result) {
            result.forEach(function(item) {
                mCategory.push(item);
            });
            // 데이터를 불러 왔지만 Category를 불러오기 전에 worked data를 표시하지 못하는 문제 수정을 위해 첫 로드시에  selectWorkData 는 비동기로 처리
            selectWorkData();
        });
    }

    function initTemplateData() {
        fullTemplateDate();
        polygonTemplate = [];
        itemTemplate = {
            Segmentation:[]		// poligon1,poligon2,...,poligonN
            ,Keypoint:[]		// poligon
            ,category_id:'', category_name:'', status:null
        };
        polygonCount = 0;
        // gSelectedWorkType = "Segmentation";
        gUndoItem = { Segmentation: [], Keypoint: [] };
    }

    function failCallback() {}
    return {
        init: init
    }
})();