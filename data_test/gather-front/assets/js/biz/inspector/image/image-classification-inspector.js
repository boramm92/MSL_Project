var imageClassificationScript = (function() {
    var $mP;		// document object model
    var $Object;	// script object model
    var $UI;		// document ui

    var defaultJobType = "IF";
    var mIsTemporaryData = false;

    var subCategoryList;

    var $answerMap = new Map();

    var currentCatNum = 1;
    var firstCategoryNum = 1;
    var totalCategoryNum = 5;
    var categoryNames = new Array();

    function init(projectId) {
        $mP = $("div.contents");
        $Object = $mP.initImageProject({
            projectId: projectId,		//
            projectType: "P",
            jobType: defaultJobType,
            jobClassName: "classification",
            nextCallback: saveResult
        });

        renderCategory();
        bindEventHandler();
        getCurrentJob();
    }
    function bindEventHandler() {
        // about navi action
        $("button.btnNext", $mP).on("click", requestComplete);		// 승인
        $("button.btnReject", $mP).on("click", requestReject);		// 반려

        $("button.btnPrevCat", $mP).on("click", goPrevCategory); //이전 카테고리 작업
        $("button.btnNextCat", $mP).on("click", goNextCategory); //다음 카테고리 작업
    }

    /** FOR NAVIGATE **/
    function getCurrentJob() {
        $("textarea[name=comment]", $mP).val("");
        $Object.requestAssignJob(getContext, failCallback);
    }
    function getContext(jobInfo) {
        checkStatus(jobInfo);
        $Object.getCurrentJobContext(displayContents, failCallback);

        // template 초기화
        initTemplate();
        // contents 를 새로 로드했을 때 isTemporary data = false
        emptyTemporaryData();
    }
    function selectClassificationData() {		// 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.
        $Object.selectData(dataRender, failCallback);
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

    function goPrevCategory() {
        currentCatNum--;
        showCurrentCategory();

        if(currentCatNum == firstCategoryNum) $(".tbl_btm .btnPrevCat").toggleClass('disabled');
        $(".tbl_btm .btnNextCat").removeClass('disabled');

        $(".work_paging_num .current").text(currentCatNum);
        $(".tbl_top span strong").text(categoryNames[currentCatNum-1]);
        $('.tbl_top span').css('color','#000000');
    }

    function goNextCategory() {
        currentCatNum++;
        showCurrentCategory();

        if(currentCatNum == totalCategoryNum) $(".tbl_btm .btnNextCat").toggleClass('disabled');
        $(".tbl_btm .btnPrevCat").removeClass('disabled');

        $(".work_paging_num .current").text(currentCatNum);
        $(".tbl_top span strong").text(categoryNames[currentCatNum-1]);
        $('.tbl_top span').css('color','#000000');
    }

    function displayContents(context) {
        clearDisplay();

        var image64 = context.atchFile;
        if($.isEmpty(image64)) {
            $.alert("원본 데이터 파일을 불러오지 못했습니다."); // 원본 이미지를 불러오지 못했습니다.
            return;
        }

        var base64ImageContent = image64.replace(/^data:image\/(png|jpeg);base64,/, "");
        var extType = context.extName == ".png"? "image/png" : "image/jpeg";
        var blob = base64ToBlob(base64ImageContent, extType);

        var reader = new FileReader();
        reader.onload = function(e) {
            $(".work_img .to-display", $mP).attr("src", e.target.result);
            $(".work_img .to-display", $mP).attr("alt", context.orgFileName);

            // 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.
            selectClassificationData();
        }
        reader.readAsDataURL(blob);
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

    function clearDisplay() {
        resetSelectedOptions();
        resetCurrentCategoryNum();
        showCurrentCategory();

        $(".tbl_top span strong").text(categoryNames[currentCatNum-1]);
        $('.tbl_top span').css('color','#000000');
    }

    function showCurrentCategory(){
        for(var i=firstCategoryNum; i<=totalCategoryNum; i++){
            if(i==currentCatNum) $("#choose_feeling"+i).show();
            else $("#choose_feeling"+i).hide();
        }
    }

    function resetCurrentCategoryNum(){
        currentCatNum = firstCategoryNum;

        $(".tbl_btm .btnPrevCat").addClass('disabled');
        $(".tbl_btm .btnNextCat").removeClass('disabled');

        $(".work_paging_num .current").text(currentCatNum);
    }

    function resetSelectedOptions(){
        //selected, checked 없애기
        $('.color_palette li.selected').toggleClass('selected');
        $("input:checked[type='checkbox']").attr('checked', false);
    }

    /** 페이지 내 고유 작업 **/
    function dataRender(data) {
        if(data != null && data.length > 0) {
            // $this.find("#contextId").val(data[0].contextId);
            $("#contextId").val(data[0].contextId);
        } else {
            // $this.find("#contextId").val("");
            $("#contextId").val("");
        }

        //저장된 데이터가 없을 경우(방금 막 넘어온 job)
        if(data[0] == undefined) return;

        var jsonData = JSON.parse(data[0].context);
        // console.log(jsonData.items);

        for(var item of jsonData.items){
            if(item.startsWith('C')) {
                var colorCode = item.substring(2);
                $(`li:contains(${colorCode})`).addClass("selected");
            }
            else{
                var feelingTxt = item.substring(2);
                // $(`input[value="${feelingTxt}"]`).attr('checked', true);
                $(`input[value="${feelingTxt}"]`).prop('checked', true);
            }
        }
    }

    function initTemplate(){
        var param = { colspan: 3, message : "선택된 이미지가 없습니다." };
        var emptyItempHtml = $.templates("#contentsEmptyTemplate").render(param);
        $("tbody.tBaseCtnt", $mP).html(emptyItempHtml);
    }

    /** LOCAL FUNCTION AND UI **/
    function emptyTemporaryData() {
        // contents 를 새로 로드했을 때 isTemporary data = false
        mIsTemporaryData = false;
        // $("button.btnSave", $mP).removeClass("active");
    }

    function failCallback(result) {
        console.log(result);
    }

    function renderCategory(){
        MindsJS.loadJson(
            '/biz/comm/selectCode.json',
            { grpCode : 'IMG_FEEL' },
            function(result) {
                subCategoryList = result.data;
                renderDetailCategory();
            }
        );

    }

    function renderDetailCategory(){
        MindsJS.loadJson(
            '/biz/comm/selectCodeWithExData.json',
            {grpCode: 'IF_C_CTG'},
            function (result) {
                var html = "";
                html += $.templates("#colorPaletteTemplate").render(result.data);
                $(".tbl_box #choose_feeling1", $mP).html(html);
            }
        );

        MindsJS.loadJson(
            '/biz/comm/selectCodeWithExData.json',
            {grpCode: 'IF_M_CTG'},
            function (result) {
                var html = "";
                html += $.templates("#threeColsCheckboxTemplate").render(result.data);
                $(".tbl_box #choose_feeling2", $mP).html(html);
            }
        );

        MindsJS.loadJson(
            '/biz/comm/selectCodeWithExData.json',
            {grpCode: 'IF_T_CTG'},
            function (result) {
                var html = "";
                html += $.templates("#CheckboxTemplate").render(result.data);
                $(".tbl_box #choose_feeling3", $mP).html(html);
            }
        );

        MindsJS.loadJson(
            '/biz/comm/selectCodeWithExData.json',
            {grpCode: 'IF_W_CTG'},
            function (result) {
                var html = "";
                html += $.templates("#CheckboxTemplate").render(result.data);
                $(".tbl_box #choose_feeling4", $mP).html(html);
            }
        );

        MindsJS.loadJson(
            '/biz/comm/selectCodeWithExData.json',
            {grpCode: 'IF_S_CTG'},
            function (result) {
                var html = "";
                html += $.templates("#CheckboxTemplate").render(result.data);
                $(".tbl_box #choose_feeling5", $mP).html(html);
            }
        );

        MindsJS.loadJson(
            '/biz/comm/selectCodeWithExData.json',
            {grpCode: 'IF_CTG_NM'},
            function (result) {
                for(var i=0; i<result.data.length; i++){
                    categoryNames.push(result.data[i]["codeName"]);
                }
            }
        );
    }

    // PUBLIC FUNCTION
    return {
        init: init
    }
})();