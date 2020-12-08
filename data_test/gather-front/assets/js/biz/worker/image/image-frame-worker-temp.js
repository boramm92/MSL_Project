var imageCroppingScript = (function() {
    var $mP;		// document object model
    var $Object;	// script object model
    var $UI;		// document ui

    var defaultJobType = "FS";
    var mIsTemporaryData = false;
    var workContext;

    var totalFrame = 0;
    var checkObj = {};
    var jobInfomation;


    var prefixUri = "/biz/image/";
    var requestApi = {
        requestAssignJob:	prefixUri+"/getCurrentJob.json",				// job을 할당받는다.
        requestInspect:		prefixUri+"/requestInspect.json",				// 검수요청
        requestIgnore:		prefixUri+"/requestIgnore.json",				// 작업불가 요청
        requestGiveupTask:	prefixUri+"/requestGiveup.json",									// GIVE UP

        uploadFile:			prefixUri+'frame'+"/fileUpload.json",
        getContext:			prefixUri+'frame'+"/getContext.json",	// job의 내용을 가져온다.
        getContents:		prefixUri+'frame'+"/getContents.json",	// job 내에 등록된 세부 기준 콘텐츠를 가져온다
        saveQuestionData:	prefixUri+'frame'+"/saveQuestionData.json",	// quest modal 에서 저장되는 내용
        saveWorkData:		prefixUri+'frame'+"/saveWorkData.json",		// quest에 대응하는 질문과 Clue를 저장하는 내용
        selectWorkData:		prefixUri+'frame'+"/selectWorkData.json",	// 작업한 데이터를 가져온다.
        clearData:			prefixUri+'frame'+"/clearWorkData.json",		// 작업한 데이터를 모두 지운다 (초기화)
        removeItem:			prefixUri+'frame'+"/removeWorkItem.json",

        selectProjectCategorySubList:	"/biz/comm/selectCodeWithExData.json"
    };

    // selectarea.js work data listener
    var currentWorkData = {
        workData: {},
        set data(val) {
            if(val == null){
                this.workData = {};
            }else if(val.contextId){
                if(val.context){
                    delete val.context;
                    if(!this.workData['contextId']){
                        this.workData['contextId'] = [];
                    }
                    if(val.contextId == 'null' || val.contextId == null || val.contextId == undefined){
                        val.contextId = null;
                    }
                    this.workData['contextId'].push(val);
                }
            }else {
                if(!this.workData[val.priority]){
                    this.workData[val.priority] = [];
                }
                this.workData[val.priority].forEach(function(v, i, o){
                    if(v.id === val.id){
                        o.splice(i, 1);
                        return;
                    }
                });
                var ctx = this.workData[val.priority].find(function(v, i){
                    return v.workContextId != null;
                });
                if(ctx && val.workContextId == null){
                    val.workContextId = ctx.workContextId;
                    /*this.workData[val.priority].splice(0, 1);*/
                }
                this.workData[val.priority].push(val);
                this.workData[val.priority] = this.workData[val.priority].filter(function(v){
                    return v.selected != undefined && v.selected != null;
                });
            }
        },
        get data() {
            return this.workData;
        }
    };

    var subCategoryList = {
        subCategory: {},
        set data(val) {
            $('.type_slt_box .select_group').remove();
            $('.emptyAreas').remove();
            var templateStr = '';
            templateStr += '<div class="select_group">';
            val.forEach(function(v, i){
                templateStr +=
                    '<div class="radio_box">' +
                    '    <input type="radio" id="IM_S_TYPE_'+v.code+'_'+i+'" name="IM_S_TYPE" value="'+v.code+'" '+(i === 0 ? "checked" : "")+ '>'+
                    '        <label for="IM_S_TYPE_'+v.code+'_'+i+'"' +'>'+v.codeName+'</label>' +
                    '</div>';
            });
            templateStr += '</div>';
            if(val.length === 0){
                templateStr = '<div class="radio_box emptyAreas" style="top: 30%;">실내/실외 및 장소 구분을 선택해주세요.</div>';
            }
            $('.type_slt_box').append(templateStr);
            this.subCategory = val;
        },
        get data() {
            return this.subCategory;
        }
    }

    // current frame listener
    var currentFrame = {
        frameInternal: 0,
        frameListener: function(val) {
            $('.current').text(val);
            $('.currentF').text(val);
        },
        set frame(val) {
            this.frameInternal = val;
            this.frameListener(val);
        },
        get frame() {
            return this.frameInternal;
        }
    };

    var $answerMap = new Map();

    function init(projectId) {
        $mP = $("div.contents");
        $Object = $mP.initImageProject({
            projectId: projectId,		//
            projectType: "P",
            jobType: defaultJobType,
            jobClassName: "frame",
            nextCallback: saveResult
        });

//		$UI = $mP.regContextUi({
//			getValue: chooseSentenceEventHandler
//			,expression: $("tbody.tBaseCtnt", $mP)
//		});

        bindEventHandler();
        getCurrentJob();
    }

    function bindEventHandler() {
        // about navi action
        $("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);		// 작업불가
        $("button.btnNext", $mP).on("click", saveAndGotoNext);			// 저장 다음파일
        $("button.btnTemp", $mP).on("click", saveFixedData);			// 임시저장

        // createTemplate
//		$(".cropBtn", $mP).on("click", createTemplate);
    }

    /** FOR NAVIGATE **/
    function getCurrentJob() {
        $Object.requestAssignJob(getContext, failCallback);
    }
    function getContext(jobInfo) {
        if(jobInfo.jobStatus == "RJ") {
            var param = {title: "반려사유", comment: jobInfo.rejectComment};
            var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
            $("div.reject_box", $mP).html(rejectCommentHtml);
            $.alert("반려된 작업 입니다.<br/>반려사유를 확인하고 해당 작업을 수정해주세요.", null, "Alert");
        }
        jobInfomation = jobInfo;
        MindsJS.loadJson(
            requestApi.getContext
            , {
                projectId : jobInfomation.projectId
                ,jobId : jobInfomation.jobId
            }
            , function(result) {
                if(result.success) {
                    selectMaskData(result.data, displayContents);
                    //callback(result.data);
                } else {
                    // 서버에서의 오류 응답
                    if(typeof failCallback === 'function') {
                        failCallback(result);
                    }
                }
            }
        );
        /*$Object.getCurrentJobContext(, failCallback);*/

        // contents 를 새로 로드했을 때 isTemporary data = false
        emptyTemporaryData();

    }
    function selectMaskData(resData, callback) {		// 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.
        if($.isEmpty(jobInfomation) || $.isEmpty(jobInfomation.workId)) {
            // 서버에서의 오류 응답
            if(typeof failCallback === 'function') {
                failCallback();
            }
            return;
        }
        var param = { projectId: jobInfomation.projectId, workId : jobInfomation.workId };
        //if(jobInfo.jobType != 'XD') {
        if(jobInfomation.jobType == 'TA' || jobInfomation.jobType == 'TQ' || jobInfomation.jobType == 'TC') {
            param.contentKind = "MQ";
        }

        MindsJS.loadJson(requestApi.selectWorkData, param, function(result) {
            if(result.success) {
                var contentList = result.data;
//					result.projectId = that._projectId;
//					result.status = jobInfo.jobStatus;
                if(contentList.length > 0) {
                    contentList.status = jobInfomation.jobStatus;
                }
                maskRender(contentList, resData, callback);
            } else {
                // 서버에서의 오류 응답
                if(typeof failCallback === 'function') {
                    failCallback(result);
                }
            }
        });
    }

    function saveAndGotoNext() {	// 저장 다음파일
        // 문자입력란 체크
        if(!checkContext()){
            return false;
        }
        $.confirm("작업한 내용을 저장하고 검수요청 하시겠습니까?", function() {
            saveProc('mp');
            $Object.saveContentForWork($("form[name=work-data]", $mP), $Object.requestInspectForWork);
        });
    }

    function scaleUpdate(){
        /*Object.keys(currentWorkData.data).filter(function(v, i){
            return !isNaN(Number(v));
        }).forEach(function(v, i){
            Object.keys(currentWorkData.data[v]).forEach(function(sv, si){
                currentWorkData.data[v][sv].x = currentWorkData.data[v][sv].x * 3.248730964467005;
                currentWorkData.data[v][sv].y = currentWorkData.data[v][sv].y * 3.253012048192771
                currentWorkData.data[v][sv].height = currentWorkData.data[v][sv].height * 3.253012048192771
                currentWorkData.data[v][sv].width = currentWorkData.data[v][sv].width * 3.248730964467005;
            });
        });*/
    }

    function saveProc(flag){
        $("form[name=work-data]", $mP).empty();
        scaleUpdate();
        if(jobInfomation.jobStatus !== 'RJ'){
            $("form[name=work-data]", $mP).append('<input type="hidden" name="l1" value="'+$('[name=inOutCtg]').val()+'"/>');
            $("form[name=work-data]", $mP).append('<input type="hidden" name="l2" value="'+$('[name=areaCtg]').val()+'"/>');
            for(var i = 1; i <= totalFrame; i++){
                $("form[name=work-data]", $mP).append('<input type="hidden" name="priority" value="'+i+'"/>');
                if(currentWorkData.data[i]){
                    var findContextId = currentWorkData.data[i].find(function(v){
                        return v.workContextId;
                    });
                    var findContext = currentWorkData.data[i].find(function(v){
                        return v.subDepth != undefined;
                    });
                    if(findContext){
                        $("form[name=work-data]", $mP).append("<input type='hidden' name='context' value='"+JSON.stringify(currentWorkData.data[i])+"'/>");
                    }else{
                        $("form[name=work-data]", $mP).append("<input type='hidden' name='context' value=''/>");
                    }
                    if(findContextId){
                        $("form[name=work-data]", $mP).append('<input type="hidden" name="contextId" value="'+findContextId.workContextId+'"/>');
                    }else{
                        $("form[name=work-data]", $mP).append('<input type="hidden" name="contextId" value=""/>');
                    }
                }else{
                    $("form[name=work-data]", $mP).append("<input type='hidden' name='context' value=''/>");
                    $("form[name=work-data]", $mP).append('<input type="hidden" name="contextId" value=""/>');
                }
                $("form[name=work-data]", $mP).append('<input type="hidden" name="atchFileId" value="'+$('[data-frame-number="'+i+'"]').attr('atchFileId')+'"/>');
            }

            if(currentWorkData.data.removeContextId){
                currentWorkData.data.removeContextId.forEach(function(sv){
                    $("form[name=work-data]", $mP).append('<input type="hidden" name="removeContextId" value="'+sv+'"/>');
                });
            }
        }else if(jobInfomation.jobStatus === 'RJ'){
            Object.keys(currentWorkData.data).forEach(function(v, i){
                if(v != 'removeContextId' && checkObj[v] != 'RJ' && checkObj[v] != 'RQ' && checkObj[v] != 'HD'){
                    var deleteRejectData = currentWorkData.data;
                    delete deleteRejectData[v];
                    currentWorkData.data = deleteRejectData;
                }
            });
            Object.keys(currentWorkData.data).forEach(function(v){
                if(!isNaN(Number(v))){
                    var findContext = currentWorkData.data[v].find(function(sv){
                        return sv.subDepth != undefined;
                    });
                    if(findContext){
                        $("form[name=work-data]", $mP).append("<input type='hidden' name='context' value='"+JSON.stringify(currentWorkData.data[v])+"'/>");
                    }else{
                        $("form[name=work-data]", $mP).append("<input type='hidden' name='context' value=''/>");
                    }
                    if(currentWorkData.data[v].find(function(sv){return sv.workContextId !== ''}).workContextId == null){
                        $("form[name=work-data]", $mP).append('<input type="hidden" name="contextId" value=""/>');
                    }else{
                        $("form[name=work-data]", $mP).append('<input type="hidden" name="contextId" value="'+currentWorkData.data[v].find(function(sv){return sv.workContextId !== ''}).workContextId+'"/>');
                    }
                    $("form[name=work-data]", $mP).append('<input type="hidden" name="priority" value="'+v+'"/>');
                    $("form[name=work-data]", $mP).append('<input type="hidden" name="atchFileId" value="'+$('[data-frame-number="'+v+'"]').attr('atchFileId')+'"/>');
                }
            });
            if(currentWorkData.data.removeContextId){
                currentWorkData.data.removeContextId.forEach(function(sv){
                    $("form[name=work-data]", $mP).append('<input type="hidden" name="removeContextId" value="'+sv+'"/>');
                });
            }
            $("form[name=work-data]", $mP).append('<input type="hidden" name="jobStatus" value="'+jobInfomation.jobStatus+'"/>');
        }
        if(flag){
            $("form[name=work-data]", $mP).append('<input type="hidden" name="flag" value="mp"/>');
        }
    }

    function checkContext(){
        var check = true;
        var data = Object.keys(currentWorkData.data);
        var dataLenghth = 0;

        data.forEach(function(v,i){
            if(Number(v)){
                dataLenghth+=1;
            }
        });

        if($('[name=inOutCtg]').val() == null || $('[name=inOutCtg]').val() == undefined || $('[name=inOutCtg]').val() === ''){
            $.alert("실내/실외 구분을 선택해주세요.");
            check = false;
        }else if($('[name=areaCtg]').val() == null || $('[name=areaCtg]').val() == undefined || $('[name=areaCtg]').val() === ''){
            $.alert("장소 구분을 선택해주세요.");
            check = false;
        }else if(dataLenghth == 0){
            $.alert("저장을 위해 최소 한개 이상의 프레임에 대한 작업이 필요합니다. 작업을 진행해주세요.");
            check = false;
        }
        return check;
    }
    function ignoreAndGotoNext() {	// 작업불가
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
    function saveResult() {
        subCategoryList.data = [];
        currentWorkData.data = null;
        // FIXME 초기화 처리 필요
        getCurrentJob();
    }
    // Temporary Save
    function saveFixedData(bViewMessage) {
        if($(this).hasClass("btnTemp")) {
            saveProc();
            //console.log($("form[name=work-data]", $mP).formJson());
            /*JSON.parse($("form[name=work-data]", $mP).formJson().context).forEach(function(v, i){
               console.log(v);
            });*/
            $Object.saveContentForWork($("form[name=work-data]", $mP), function () {
                if (bViewMessage) {
                    $.alert("작업한 내용이 임시저장 됐습니다.", selectMaskData);
                } else {
                    selectMaskData();
                }
            });
        }
    }

    function displayContents(context) {
        if(context instanceof Array){
            if(context.length > 0){
                $(".work_img .to-crop", $mP).on("load", getSize);
                workContext = context.filter(function(v, i){return v.extName.toLowerCase() !== '.mp4'});
                totalFrame = workContext.length;
                $('.totalFrame').text(totalFrame);
                $('.totalFrameF').text(totalFrame);
                var loadFlag = false;
                $('.thumbList').empty();
                context.forEach(function(v, i){
                    if(v.extName.toLowerCase() !== '.mp4'){
                        $('.thumbList').append('<li class="imgFrame'+v.priority+'" data-block-yn="N" data-frame-number="'+v.priority+'" atchFileId="'+v.atchFileId+'"></li>');
                        var image64 = v.atchFile;
                        if($.isEmpty(image64)) {
                            $.alert("원본 데이터 파일을 불러오지 못했습니다."); // 원본 이미지를 불러오지 못했습니다.
                            return;
                        }
                        var base64ImageContent = image64.replace(/^data:image\/(png|jpeg);base64,/, "");
                        var extType = v.extName == ".png"? "image/png" : "image/jpeg";
                        var blob = base64ToBlob(base64ImageContent, extType);

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            $('.imgFrame'+v.priority).append('<img class="imgContent'+v.priority+'" src="'+e.target.result+'" alt="'+v.orgFileName+'">');
                            // 기존에 작업한 내용 또는 검수하기 위한 내용을 조회해 온다.

                            // FIXME 최초 진입시 first frame을 선택하도록함. 이는 기획에 따라 변경 될 수 있음 (현재상태를 저장시 해당 프레임을 바라보도록 변경 될 수 있음) 201012 최재민
                            // 프레임 선택 시 활성화 효과
                            function bindClickEvent(){
                                $('.imgFrame'+v.priority).on('click', function(){
                                    if($(this).attr('data-block-yn') == 'N'){
                                        /*$(".work_img").addClass("loadingImg");*/
                                        currentFrame.frame = v.priority;
                                        // selectAreas & panzoom destory.
                                        destroyArea();
                                        $('.frame_box li').removeClass('selected')
                                        $(this).addClass('selected');
                                        var param = {
                                            jobId : jobInfomation.jobId,
                                            atchFileId : $(this).attr("atchFileId")
                                        };
                                        MindsJS.loadJson(
                                            "/biz/image/frame/getSelectedImage.json",
                                            param,
                                            function(result) {
                                                var resource = result.data.atchFile;
                                                if($.isEmpty(resource)) {
                                                    $.alert("원본 데이터 파일을 불러오지 못했습니다."); // 원본 이미지를 불러오지 못했습니다.
                                                    return;
                                                }
                                                var base64ImageContent = resource.replace(/^data:image\/(png|jpeg);base64,/, "");
                                                var extType = result.data.extName == ".png"? "image/png" : "image/jpeg";
                                                var resourceBlob = base64ToBlob(base64ImageContent, extType);
                                                var blobUrl = URL.createObjectURL(resourceBlob);
                                                $(".to-crop", $mP).attr("src", blobUrl);
                                                startMask(v.priority, currentWorkData.data[v.priority]);
                                                $(".work_img .to-crop", $mP).attr("alt", v.orgFileName);
                                                /*$(".work_img").removeClass("loadingImg");*/
                                            }, false
                                        );
                                    }
                                });
                            }

                            if(Object.keys(checkObj).length > 0){
                                if(checkObj[v.priority] === 'CM' || checkObj[v.priority] === 'HD'){
                                    $('.imgContent'+v.priority).css({
                                        background: '#00263e',
                                        opacity: 0.5,
                                    });
                                    $('.imgContent'+v.priority).parent().addClass('rejectFrame');
                                    $('.imgContent'+v.priority).parent().attr('data-block-yn', 'Y');
                                }
                            }
                            bindClickEvent();
                            if(!loadFlag){
                                if(Object.keys(currentWorkData.data).filter(function(v){return !isNaN(Number(v));}).length == 0){
                                    $('.thumbList').find('li').not('.rejectFrame').first().click();
                                    loadFlag = true;
                                }

                            }
                        }
                        reader.readAsDataURL(blob);
                    }else{
                        $('.imgName').text(v.orgFileName);
                    }
                });
            }else{
                $.alert("이미지 프레임 정보가 없습니다.");
                return;
            }
        }else{
            $.alert("잘못된 데이터 형식입니다. (이미지 마스킹 작업에서 context는 Array여야 합니다.)");
            return;
        }
    }

    function getSize(){
        //FIXME 여기서 리사이즈 스케일 계산처리
        console.log(1920/$(".to-crop").width());
        console.log(1080/$(".to-crop").height());
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

    /**
     * maskRender
     * @param renderData
     */
    function maskRender(renderData, result, callback) {
        currentWorkData.data = null;
        if(renderData != null && renderData.contentList) {
            var l1;
            var l2;

            renderData.contentList.forEach(function(v, i){
                if(jobInfomation.jobStatus === 'RJ'){
                    if(v.priority != null){
                        checkObj[v.priority] = v.cfrmStatus;
                        if(v.cfrmStatus === 'RJ' || v.cfrmStatus === 'RQ') {
                        } else {
                            $('.imgContent'+v.priority).css({
                                background: "#00263e", opacity: 0.5
                            });
                            $('.imageContent'+v.priority).parent().addClass('rejectFrame');
                            $('.imgFrame'+v.priority).off("click");
                        }
                    }
                }

                if(v.contentKind){
                    switch (v.contentKind) {
                        case "l1":
                            l1 = v.reserve1;
                            break;
                        case "l2":
                            l2 = v.reserve1;
                            break;
                    }
                }else{
                    var context = v.context;
                    currentWorkData.data = v;
                    if(context){
                        JSON.parse(context).forEach(function(sv, si){
                            sv['workContextId'] = v.contextId;
                            currentWorkData.data = sv;
                        });
                    }else{
                        currentWorkData.data[v.priority] = [{
                            workContextId : v.contextId
                        }];
                    }
                }
            });

            /* 최초 진입 */
            //3depth목록 설정
            renderCategory(l2);
            //실내/실외
            $('[name=inOutCtg]').val(l1);
            //장소
            renderAreaCategory(function(){
                $('[name=areaCtg]').val(l2);
            });

            var preVal = '';
            //실내/외
            $('[name=inOutCtg]').off('change').focus(function(){
                preVal = $(this).val();
            }).on('change', function(){
                changeReserve(this, preVal, 'l1');
            });

            //장소
            preVal = '';
            $('[name=areaCtg]').off('change').focus(function(){
                preVal = $(this).val();
            }).on('change', function(){
                changeReserve(this, preVal, 'l2');
            });

            // 반려시에도 select 선택 가능하도록 변경
            /*if(jobInfomation.jobStatus === 'RJ'){
                $('[name=inOutCtg]').attr('disabled', true);
                $('[name=areaCtg]').attr('disabled', true);
            }*/

        }
        if(typeof callback === 'function') {
            callback(result);
        }
    }
    function clearDisplay() {
        $answerMap = new Map();
        if(typeof $UI != 'undefined') {
            $UI.clearAnswer();
        }
    }

    function destroyArea() {
        $section.find(".div_img").attr('style', ''); // style empty
        $section.find(".div_img").panzoom('destroy');
        $image.selectAreas('destroy');
    }

    /** 카테고리 목록 변경 */
    function render(obj, type) {
        if(type == 'l1') {
            renderAreaCategory(function(){
                $('[name=areaCtg]').val('');
            });
        } else {
            renderCategory($(obj).val());
        }
    }

    /**
     * reserve 변경 시 call되는 함수
     * obj : 변경 객체
     * preVal : 변경 전 value
     * type : l1=실내/실외 & l2=장소
     */
    function changeReserve(obj, preVal, type){
        var workData = currentWorkData.data;

        //작업 영역 유무 확인
        var keys = Object.keys(workData);
        var check = false;
        keys.forEach(function(v,i){
            if(Number(v)){
                check = true;
                return;
            };
        });

        if(check) {
            $.confirm("모든 이미지의 영역 지정 데이터가 삭제됩니다. 변경하시겠습니까?", function() {
                var tempArr = [];

                //기존 데이터가 있을 경우 삭제를 하기 위해 check

                Object.keys(workData).filter(function(v, i){
                    return !isNaN(Number(v));
                }).forEach(function(v, i){
                    var workContext = workData[v].find(function(v, i){
                        return v.workContextId !== undefined && v.workContextId !== null && v.workContextId !== '';
                    });
                    if(workContext){
                        tempArr.push(workContext.workContextId);
                    }
                });

                //영역 ui 삭제
                currentWorkData.data = null;

                if(tempArr.length > 0){
                    currentWorkData.data['removeContextId'] = tempArr;
                    if(jobInfomation.jobStatus === 'RJ'){
                        jobInfomation.jobStatus = 'AS';
                        $('.rejectFrame').each(function(i, v){
                            $(v).children('img').removeAttr("style");
                            $(v).attr('data-block-yn', 'N');
                            $(v).removeClass('rejectFrame');
                        });
                        destroyArea();
                        render(obj, type);
                    }
                }

                //$('.type_slt_box').hide();
                $('.select_group').html();
            },function(){
                $(obj).val(preVal);
            });
        } else {
            //$('.type_slt_box').hide();
            $('.select_group').html();
            render(obj, type);
        }
    }

    /** 페이지 내 고유 작업 **/
    /** 참고자료 **/
    /** selectareas.js : https://www.jqueryscript.net/other/jQuery-Plugin-For-Selecting-Multiple-Areas-of-An-Image-Select-Areas.html **/
    /** panzoom.js : https://www.jqueryscript.net/zoom/jQuery-Plugin-For-Panning-Zooming-Any-Elements-panzoom.html **/
    /** panzoom.js : https://www.tea.se/ICA/test/ **/
    var $image = $(".to-crop", $mP);
    var $section = $(".common_box");
    function startMask(priority, areas){
        console.log('startMask');
        $image.selectAreas({
            minSize: [10, 10],
            onChanged:onChangedCropBox,
            objArray: subCategoryList.data,
            priority : priority,
            workData : currentWorkData,
            allowDelete: false,
            allowNudge: false,
            minSize: [48, 48],
            areas : areas ? areas : [],
        });

        $section.find(".div_img").panzoom({
            $zoomIn: $section.find(".btn_plus"),
            $zoomOut: $section.find(".btn_minus"),
            increment: 0.1,
            animate: false,
            disablePan: true
        });

    }

    function onChangedCropBox(event, id, areas){
        // 선택영역이 0이라면 임시저장 비활성화
        if($image.selectAreas("areas").length == 0){
            $("button.btnSave", $mP).removeClass("active");
        } else {
            $("button.btnSave", $mP).addClass("active");
        }

        if($(".common_box").find(".select-areas-overlay").next().css("cursor")!="move"){

            var $curDiv = $("form[name=work-data]", $mP).find("div[idx="+ id +"]");
            var checkEvent = "delete";
            var index;

            for(var i=0; i<areas.length; i++){
                if(areas[i].id == id){
                    checkEvent = "change";
                    index = i;
                }
            }

            if(checkEvent == "change"){	//생성 및 수정
                if($curDiv.length == 0) {
                    //input 생성
                    createInputTemplate(id, areas);

                }else {	//input데이터 수정
                    $curDiv.find("input[name=location_x]").val(areas[index].x);
                    $curDiv.find("input[name=location_y]").val(areas[index].y);
                    $curDiv.find("input[name=location_width]").val(areas[index].width);
                    $curDiv.find("input[name=location_height]").val(areas[index].height);
                }
            }else{	//삭제(input제거)
                removeSentence(id);
            }
        }
    }

    function createInputTemplate(id, areas) {
        var $selectedArea = $(".select-areas-outline");
        var index = areas.length - 1;
        if($selectedArea.first().attr("radioCode") == undefined || $selectedArea.first().attr("radioCode") == ""){
            var color = $("input:radio[name=masking_type]:checked").val();
            var radioCode = $("input:radio[name=masking_type]:checked").attr("id");
            // TODO 새로운 요소를 만드는게 아니라 기존 요소를 수정할때 색상이 덮어씌워지는 문제가 있음
            /*$selectedArea.first().css("background", color);*/
            $selectedArea.first().attr("radioCode",radioCode);
            $selectedArea.first().css("opacity", "0.3");
        }
    }

    function removeSentence(id) {
        var $curDiv = $("form[name=work-data]", $mP).find("div[idx="+ id +"]");

        if(!$.isEmpty($curDiv.attr("ctxid"))) {
            $Object.removeItem($curDiv.attr("ctxId"), null);
        }
        $curDiv.remove();
    }

    /** LOCAL FUNCTION AND UI **/
    function emptyTemporaryData() {
        // contents 를 새로 로드했을 때 isTemporary data = false
        mIsTemporaryData = false;
        $("button.btnSave", $mP).removeClass("active");
    }
    function fillTemporaryData() {
        mIsTemporaryData = true;
        $("button.btnSave", $mP).addClass("active");
    }

    function failCallback(result) {

    }

    function renderCategory(upperGrpCode){
        if( upperGrpCode ) {
            MindsJS.loadJson(
                '/biz/comm/selectCode.json',
                { grpCode : upperGrpCode },//레이어노출 카테고리
                function(result) {
                    subCategoryList.data = result.data;
                    $('.thumbList').find('li').not('.rejectFrame').first().click();
                }
            );
        }
    }

    function renderAreaCategory(callback){
        var flag = $('[name=inOutCtg]').val();
        if(flag === 'I' || flag === 'O'){
            MindsJS.loadJson(
                '/biz/comm/selectCode.json',
                {upperGrpCode: 'IM_'+flag+'_TYPE'},
                function (result) {
                    var html = "<option value=''>Select your option</option>";
                    if (!$.isEmpty(result.data)) {
                        html += $.templates("#selectOptionOnlyTemplate").render(result.data);
                    }
                    $("select[name=areaCtg]", $mP).html(html);
                    if(callback){
                        callback();
                    }
                }
            );
        }else{
            $('select[name=areaCtg]').val('');
            if($('select[name=areaCtg]').val() !== ''){
                $.alert("'장소'값이 초기화 됩니다.");
            }
        }
    }

    // 이미지 이동 활성화
    $(".arrowsAlt").click(function(){
        $section.find(".div_img").panzoom("option", "disablePan", false);
        $section.find(".select-areas-overlay").next().css("cursor","move");
    });

    // 이미지 이동 비활성화
    $(".vectorSquare").click(function(){
        $section.find(".div_img").panzoom("option", "disablePan", true);
        $section.find(".select-areas-overlay").next().css("cursor","crosshair");
    });

    // 마스킹 삭제
    $(".removeSquare").click(function(){
        $section.find(".div_img").panzoom("option", "disablePan", true);
        $section.find(".select-areas-overlay").next().css("cursor","crosshair");
        $image.selectAreas('areas').forEach(function(v, i){
            if(v.selected){
                var priority = v.priority;
                var workData = currentWorkData.data;
                if(workData[priority]){
                    if(jobInfomation.jobStatus == 'RJ'){
                        var workId = workData[priority].find(function(sv){
                            return sv.workContextId != undefined && sv.workContextId != null && sv.workContextId != '';
                        }).workContextId;
                        if(workData[priority].length > 1){
                            workData[priority] = workData[priority].filter(function(sv){
                                return sv.id !== v.id;
                            });
                        }else{
                            if(workId != undefined && workId != null && workId != ''){
                                delete workData[priority];
                                workData[priority] = [];
                                workData[priority].push({workContextId : workId});
                            }
                        }
                    }else{
                        workData[priority] = workData[priority].filter(function(sv){
                            return sv.id !== v.id;
                        });
                        if(workData[priority].length === 0){
                            if(!workData['removeContextId']){
                                workData['removeContextId'] = [];
                            }
                            if(workData['contextId'] && Array.isArray(workData['contextId'])){
                                workData['contextId'] = workData['contextId'].filter(function(sv){
                                    if(sv.priority === priority && sv.contextId != 'null'){
                                        workData['removeContextId'].push(sv.contextId);
                                    }
                                    return sv.priority !== priority;
                                });
                            }
                            delete workData[priority];
                        }
                    }
                }
                currentWorkData.data = workData;
                $image.selectAreas('remove', v.id);
            }
        });
    });


    function switchFrame(frame){
        $('.imgFrame'+frame).click();
    }

    $('.btn_prev').click(function(){
        var currentFrame = Number($('.current').text());
        var totalFrame = Number($('.totalFrame').text());
        if(jobInfomation.jobStatus === 'RJ'){
            var frameNumberArr = [];
            $('[class^=imgFrame]').not('.rejectFrame').each(function(i, v){
                frameNumberArr.push($(v).data('frame-number'));
            });
            var beforeFrame = frameNumberArr.indexOf(currentFrame) - 1;
            if(frameNumberArr[beforeFrame]){
                switchFrame(frameNumberArr[beforeFrame]);
            }
        }else{
            if(currentFrame !== 1){
                switchFrame(currentFrame-1);
            }
        }
    });

    $('.btn_next').click(function(){
        var currentFrame = Number($('.current').text());
        var totalFrame = Number($('.totalFrame').text());
        if(jobInfomation.jobStatus === 'RJ'){
            var frameNumberArr = [];
            $('[class^=imgFrame]').not('.rejectFrame').each(function(i, v){
                frameNumberArr.push($(v).data('frame-number'));
            });
            var nextFrame = frameNumberArr.indexOf(currentFrame)+1;
            if(frameNumberArr[nextFrame]){
                switchFrame(frameNumberArr[nextFrame]);
            }
        }else{
            if(currentFrame !== totalFrame){
                switchFrame(currentFrame+1);
            }
        }
    });

    // PUBLIC FUNCTION
    return {
        init: init
    }
})();