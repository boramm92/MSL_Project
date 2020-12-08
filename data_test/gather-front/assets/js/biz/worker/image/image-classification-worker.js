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
        // $("#contextId").val("WCID_000002279");

    }
    function bindEventHandler() {
        // about navi action
        $("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);		// 작업불가
        $("button.btnNext", $mP).on("click", saveAndGotoNext);			// 저장 다음파일
        $("button.btnSave", $mP).on("click", saveFixedData);			// 임시저장

        $("button.btnPrevCat", $mP).on("click", goPrevCategory); //이전 카테고리 작업
        $("button.btnNextCat", $mP).on("click", goNextCategory); //다음 카테고리 작업
    }

    /** FOR NAVIGATE **/
    function getCurrentJob() {
        $Object.requestAssignJob(getContext, failCallback);
    }
    function getContext(jobInfo) {
        $Object.getCurrentJobContext(displayContents, failCallback);

//		$Object.selectCurrentContents(displaySubContents, failCallback);

        // template 초기화
        initTemplate();

        // 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.
//		selectClassificationData();

        // contents 를 새로 로드했을 때 isTemporary data = false
        emptyTemporaryData();

    }
    function selectClassificationData() {		// 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.
        // $Object.selectData(fixedDataRender, failCallback);
        $Object.selectData(dataRender, failCallback);
    }

    function saveAndGotoNext() {	// 저장 다음파일
        /*$.confirm("작업한 내용을 저장하고 검수요청 하시겠습니까?", function() {
            if(!isAllCtgSelected()) { //선택되지 않은 카테고리가 있을 경우
                $.alert("아직 완료되지 않은 작업이 있습니다.<br>확인해 주십시오.");
            } else { //모두 제대로 선택되어 있을 때
                var param = createParam();
                $Object.saveContentForWorkForFeeling(param, $Object.requestInspectForWork);
            }
        });*/
        $.confirm("작업한 내용을 저장하고 검수요청 하시겠습니까?", function() {
            if(!isAllCtgSelected()) { //선택되지 않은 카테고리가 있을 경우
                $.alert("아직 완료되지 않은 작업이 있습니다.<br>확인해 주십시오.");
            } else { //모두 제대로 선택되어 있을 때
                var param = createParam();
                $Object.saveContentForWorkForFeeling(param, function(){
                    selectClassificationData();
                    $Object.requestInspectForWork();
                });
            }
        });
    }

    function ignoreAndGotoNext() {	// 작업불가
        var labelList = [
            {label:"Comment :", lbl_type:"text", name:"comment", lbl_ph:"작업불가 사유를 입력해 주세요." }
        ];
        $.commentAll(
            "작업불가 사유를 입력하면 작업불가 항목으로 지정됩니다.<br>작업불가 항목으로 지정하시겠습니까?"	// messages
            , function(data) {
                createParam();
                $Object.requestIgnoreForWork(data.comment);
            }					// ok Function
            , null				// cancel Function
            , "작업불가 지정"		// Title
            , "작업불가"				// OK Title
            , "취소"				// Cancel Title
            , labelList			// label list
        );
    }
    function saveResult() {
        getCurrentJob();
    }

    function createParam(){
        var param = $("form[name=work-data]", $mP).formJson();
        if(getSelectedLi() != null){
            param["IF_C_CTG"] = getSelectedLi();
        }

        var inputValues = [];
        for(var key of Object.keys(param)){
            if(param[key].length == 2 && typeof param[key] !== 'string'){ //요소가 2개이고, 단어 길이는 2개가 아니어야함.
                for(var value of param[key]) {
                    //key: IF_C_CTG
                    //key.substring(3,5): Mapper 대신에 쓸 prefix(i.e.> C_, M_, S_, W_, T_)
                    //C_#FF0000
                    inputValues.push(key.substring(3,5)+value);

                    // inputValues.push(setInputTemplate(key.substring(3,4), value));
                }
            }
            else {
                inputValues.push(key.substring(3,5)+param[key]);

                // inputValues.push(setInputTemplate(key.substring(3,4), param[key]));
            }
        }

        var newParam = {};
        newParam["items"] = inputValues;

        newParam.contextId = $("#contextId").val();

        return newParam;
    }

    // Temporary Save
    function saveFixedData(bViewMessage) {
        if($(this).hasClass("active")) {
            var param = createParam();
            $Object.saveContentForWorkForFeeling(param, function () {
                if (bViewMessage) {
                    emptyTemporaryData();
                    $.alert("작업한 내용이 임시저장 됐습니다.", selectClassificationData);
                } else {
                    selectClassificationData();
                }
            });
        }
    }

    function getSelectedLi() {
        var HexValWithBlank = $(".color_palette li.selected", $mP).text();

        var hexArr = new Array();
        while(HexValWithBlank.indexOf('#')>-1){
            hexArr.push(HexValWithBlank.substring(HexValWithBlank.indexOf('#'), HexValWithBlank.indexOf('#')+7));
            HexValWithBlank = HexValWithBlank.substring(HexValWithBlank.indexOf('#')+7);
        }

        if(hexArr.length == 0) return null;
        if(hexArr.length == 1) return hexArr[0];
        return hexArr;
    }

    function goPrevCategory() {
        currentCatNum--;
        showCurrentCategory();
        /*for(var i=firstCategoryNum; i<=totalCategoryNum; i++){
            if(i==currentCatNum) $("#choose_feeling"+i).show();
            else $("#choose_feeling"+i).hide();
        }*/

        if(currentCatNum == firstCategoryNum) $(".tbl_btm .btnPrevCat").toggleClass('disabled');
        $(".tbl_btm .btnNextCat").removeClass('disabled');

        $(".work_paging_num .current").text(currentCatNum);
        $(".tbl_top span strong").text(categoryNames[currentCatNum-1]);
        $('.tbl_top span').css('color','#000000');
    }

    function goNextCategory() {
        if(!isOptionSelected()){ //옵션이 선택되지 않았을 때
            $.alert("아직 완료되지 않은 작업이 있습니다.<br>확인해 주십시오.");
        } else{ //옵션이 1개 이상 선택됐을 때
            currentCatNum++;
            showCurrentCategory();
            /*for(var i=firstCategoryNum; i<=totalCategoryNum; i++){
                if(i==currentCatNum) $("#choose_feeling"+i).show();
                else $("#choose_feeling"+i).hide();
            }*/

            if(currentCatNum == totalCategoryNum) $(".tbl_btm .btnNextCat").toggleClass('disabled');
            $(".tbl_btm .btnPrevCat").removeClass('disabled');

            $(".work_paging_num .current").text(currentCatNum);
            $(".tbl_top span strong").text(categoryNames[currentCatNum-1]);
            $('.tbl_top span').css('color','#000000');
        }
    }

    function getNumberOfSelectedOption(categoryNum) {
        //categoryNum(현재 카테고리) 속에 있는 selected/checked 개수 확인
        var cnt = 0;
        if(categoryNum == 1){ //selected number
            cnt = $('.color_palette li.selected').length;
        } else{ //checked number
            cnt = $(`#choose_feeling${categoryNum} input:checked[type='checkbox']`).length;
        }
        return cnt;
    }

    function isOptionSelected() {
        if(getNumberOfSelectedOption(currentCatNum) > 0) return true;
        else return false;
    }

    function isAllCtgSelected() {
        for(var i = firstCategoryNum; i <= totalCategoryNum; i++){
            if(getNumberOfSelectedOption(i) < 1) return false;
        }
        return true;
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
        /*$answerMap = new Map();
        if(typeof $UI != 'undefined') {
            $UI.clearAnswer();
        }*/

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
    function fillTemporaryData() {
        mIsTemporaryData = true;
        $("button.btnSave", $mP).addClass("active");
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