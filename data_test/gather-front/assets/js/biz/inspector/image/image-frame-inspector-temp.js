var imageCroppingScript = (function() {
    var $mP;		// document object model
    var $Object;	// script object model
    var $UI;		// document ui

    var defaultJobType = "FS";
    var mIsTemporaryData = false;

    var totalFrame = 0;
    var jobInfomation;

    var prefixUri = "/biz/image/frame";

    var requestApi = {
        setFrameInspectStatus: prefixUri+"/updateFrameInspectStatus.json",
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
                    this.workData[val.priority].splice(0, 1);
                }
                this.workData[val.priority].push(val);
            }
        },
        get data() {
            return this.workData;
        }
    };

    var subCategoryList = {
        subCategory: {},
        set data(val) {
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
        $("button.btnReject", $mP).on("click", rejectAndGotoNext);		// ?????? & ????????????
        $("button.btnNext", $mP).on("click", requestCompleteAndGotoNext);			// ???????????? & ????????????

        // createTemplate
//		$(".cropBtn", $mP).on("click", createTemplate);
    }

    /** FOR NAVIGATE **/
    function getCurrentJob() {
        $Object.requestAssignJob(getContext, failCallback);
    }
    function getContext(jobInfo) {
        checkStatus(jobInfo);
        if(jobInfo.jobStatus == "RJ") {
            var param = {title: "Reasons for Reject", comment: jobInfo.rejectComment};
            var rejectCommentHtml = $.templates("#commentBoxTemplate").render(param);
            $("div.reject_box", $mP).html(rejectCommentHtml);
            $.alert("This context returned by inspector. Please check reason for correction.", null, "Alert");
        }
        jobInfomation = jobInfo;
        $('.inspectorId').text('');
        $('.inspectorId').append(jobInfomation.workerId);
        $Object.getCurrentJobContext(displayContents, failCallback);

        // contents ??? ?????? ???????????? ??? isTemporary data = false
        emptyTemporaryData();

    }
    function selectMaskData() {		// ????????? ????????? ?????? ?????? ???????????? ?????? ????????? ????????? ??????.
        $Object.selectData(maskRender, failCallback);
    }

    function saveAndGotoNext() {	// ?????? ????????????
        // ??????????????? ??????
        if(!checkContext()){
            return false;
        }
        $.confirm("????????? ????????? ???????????? ???????????? ???????????????????", function() {
            saveProc('mp');
            $Object.saveContentForWork($("form[name=work-data]", $mP), $Object.requestInspectForWork);
        });
    }

    function saveProc(flag){
        $("form[name=work-data]", $mP).empty();
        //$Object.requestInspectForWork();
        // ...
        $("form[name=work-data]", $mP).append('<input type="hidden" name="l1" value="'+$('[name=inOutCtg]').val()+'"/>');
        $("form[name=work-data]", $mP).append('<input type="hidden" name="l2" value="'+$('[name=areaCtg]').val()+'"/>');

        Object.keys(currentWorkData.data).forEach(function(v, i){
            if(v !== 'contextId' && v !== 'removeContextId'){
                $("form[name=work-data]", $mP).append('<input type="hidden" name="priority" value="'+v+'"/>');
            }else if(v !== 'removeContextId'){
                currentWorkData.data[v].forEach(function(sv, si){
                    if(!Array.isArray(sv.contextId) && sv.contextId){
                        $("form[name=work-data]", $mP).append('<input type="hidden" name="contextId" value="'+sv.contextId+'"/>');
                    }
                });
            }else{
                currentWorkData.data[v].forEach(function(sv, si){
                    $("form[name=work-data]", $mP).append('<input type="hidden" name="removeContextId" value="'+sv+'"/>');
                });
            }
            var selectAreasData = [];
            currentWorkData.data[v].forEach(function(sv, si){
                if(sv.subDepth){
                    selectAreasData.push(sv);
                }
            });
            if(selectAreasData.length > 0){
                $("form[name=work-data]", $mP).append("<input type='hidden' name='context' value='"+JSON.stringify(selectAreasData)+"'/>");
            }
        });
        if($('[name=priority]').length > $('[name=contextId]').length){
            var size = $('[name=priority]').length - $('[name=contextId]').length;
            for(var i = 0 ; i < size ; i++){
                $("form[name=work-data]", $mP).append('<input type="hidden" name="contextId" value=""/>');
            }
        }
        var parameter = $("form[name=work-data]", $mP).formJson();
        // contextId ?????????
        var workIdCheckIdx = [];
        if(Array.isArray(parameter.priority)){
            parameter.priority.forEach(function(v, i){
                parameter.context.forEach(function(sv, si){
                    JSON.parse(sv).forEach(function(ssv, ssi){
                        if(ssv.workContextId === null){
                            workIdCheckIdx.push(si);
                            return;
                        }
                    });
                });
            });
        }else{
            JSON.parse(parameter.context).forEach(function(sv, si){
                if(sv.workContextId === null){
                    workIdCheckIdx.push(si);
                    return;
                }
            });
        }
        workIdCheckIdx = workIdCheckIdx.filter(function(v, i){
            return workIdCheckIdx.indexOf(v) === i;
        });
        if(Array.isArray(parameter.contextId)){
            parameter.contextId = parameter.contextId.filter(function(v){
                return v !== '';
            });
        }
        workIdCheckIdx.forEach(function(v, i){
            if(Array.isArray(parameter.contextId)){
                parameter.contextId.splice(v, 0, '');
            }
        });
        $("form[name=work-data]", $mP).find('[name=contextId]').remove();
        if(Array.isArray(parameter.contextId)){
            parameter.contextId.forEach(function(v){
                $("form[name=work-data]", $mP).append('<input type="hidden" name="contextId" value="'+v+'"/>');
            });
        }else{
            $("form[name=work-data]", $mP).append('<input type="hidden" name="contextId" value="'+parameter.contextId+'"/>');
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
            $.alert("??????/?????? ????????? ??????????????????.");
            check = false;
        }else if($('[name=areaCtg]').val() == null || $('[name=areaCtg]').val() == undefined || $('[name=areaCtg]').val() === ''){
            $.alert("?????? ????????? ??????????????????.");
            check = false;
        }else if(totalFrame != dataLenghth){
            $.alert("?????? ???????????? ?????? ????????? ????????????. ?????????????????????.");
            check = false;
        }
        return check;
    }

    function checkStatus(jobInfo) {
        $(".faild_box", $mP).html("");
        $(".reject_box", $mP).html("");
        // ???????????? ??????
        if(jobInfo.jobStatus == 'IM') {
            var rejectCommentHtml = $.templates("#commentBoxTemplate").render(
                {title: "?????? ?????? ?????? :", comment: jobInfo.comment});
            $("div.faild_box", $mP).html(rejectCommentHtml).show();
            $.alert("????????? '"+jobInfo.workerId + "'?????? ??????????????? ????????? ???????????????. ????????? ?????? ??? ????????? ????????? ?????????.");
        } else {
            $("div.faild_box", $mP).hide();
        }
        // ???????????? ??????
        var rejectCommentHtml = $.templates("#commentBoxTemplate").render(
            {title: "?????? ????????? ????????? ????????? :", writeMode:true, comment: jobInfo.rejectComment});
        $("div.reject_box", $mP).html(rejectCommentHtml).show();
        $("div.reject_box", $mP).find("textarea").val(jobInfo.rejectComment);
    }

    // ??????
    function requestCompleteAndGotoNext() {
        var numArr;
        var checkArr = [];
        for(var i = 1; i <= totalFrame; i++){
            if(!numArr){
                numArr = [];
            }
            if(!currentWorkData.data[i] || currentWorkData.data[i].check == undefined || currentWorkData.data[i].check == null || currentWorkData.data[i].check === 'HD' || currentWorkData.data[i].check === 'RJ' || currentWorkData.data[i].check === 'RQ'){
                numArr.push(i);
            }else{
                checkArr.push(i);
            }
        }
        if(jobInfomation.jobStatus == 'IM' || checkArr.length == totalFrame){
            $Object.requestComplete();
        }else{
            $.alert(numArr.join(', ')+"??? ???????????? ?????? ????????? ???????????????. ?????????????????????.");
        }
    }

    function rejectAndGotoNext() {	// ??????
        var numArr;
        for(var i = 1; i <= totalFrame; i++){
            if(!numArr){
                numArr = [];
            }
            if(!currentWorkData.data[i] || currentWorkData.data[i].check == undefined || currentWorkData.data[i].check == null || currentWorkData.data[i].check === 'HD' || currentWorkData.data[i].check === 'RQ'){
                numArr.push(i);
                var workContextId = currentWorkData.data[i].find(function(v){return v.workContextId != undefined && v.workContextId != null && v.workContextId !== ''}).workContextId;
                if(workContextId && workContextId != null && workContextId != ''){
                    MindsJS.loadJson(
                        requestApi.setFrameInspectStatus,
                        {
                            workContextId : workContextId,
                            workId : jobInfomation.workId,
                            jobId : jobInfomation.jobId,
                            cfrmStatus : 'RJ',
                        },
                        function(result) {
                            if(result.success){

                            }
                        },
                    );
                }
            }
        }
        var rejectComment = $("textarea[name=comment]", $mP).val();
        $Object.requestReject(rejectComment);
    }

    function offButtionEvents(flag, msg){
        if(flag){
            $(".holdSquare").off('click').click(function(){
                setFrameInspectStatus('HD');
            });
            $(".rejectSquare").off('click').click(function(){
                setFrameInspectStatus('RJ');
            });
            $(".completeSquare").off('click').click(function(){
                setFrameInspectStatus('CM');
            });
        }else{
            $(".holdSquare").off('click').click(function(){
                $.alert(msg)
            });
            $(".rejectSquare").off('click').click(function(){
                $.alert(msg)
            });
            $(".completeSquare").off('click').click(function(){
                $.alert(msg)
            });
        }
    }

    /*
        ASSIGN("AS")		// ????????????
        DOING("DO")		// ?????????
        REQUEST("RQ")		// ????????????
        REREQUEST("RR")	// ???????????????
        REJECT("RJ")		// ??????
        IMPOSSIBLE("IM")	// ????????????
        COMPLETE("CM")		// ????????????
        NOTUSE("NU")		// ???????????? (????????????-????????????)
    */
    function setFrameInspectStatus(status){
        var frame = $('.common_box.frame_box.thumbList').find('.selected');
        var priority = frame.data('priority');

        var workContextId = currentWorkData.data[priority].find(function(v, i){
            return i === 0;
        }).workContextId;

        MindsJS.loadJson(
            requestApi.setFrameInspectStatus,
            {
                workContextId : workContextId,
                workId : jobInfomation.workId,
                jobId : jobInfomation.jobId,
                cfrmStatus : status,
            },
            function(result) {
                if(result.success){
                    var cfrmStatus = '';
                    frame.removeClass('frame_hold').removeClass('frame_rjct').removeClass('frame_cfrm');
                    switch(status){
                        case 'HD' :
                            cfrmStatus = 'frame_hold';
                            break;
                        case 'RJ' :
                            cfrmStatus = 'frame_rjct';
                            break;
                        case 'CM' :
                            cfrmStatus = 'frame_cfrm';
                            break;
                        default :
                            cfrmStatus = '';
                            break;
                    }
                    if(cfrmStatus !== ''){
                        frame.addClass(cfrmStatus).addClass('confirmed');
                    }
                    if(currentWorkData.data[priority]){
                        currentWorkData.data[priority].check = status;
                    }else{
                        currentWorkData.data[priority] = {
                            check : status
                        }
                    }
                    changeCurrentFrame('n');
                }
            },
        );
    }

    function saveResult() {
        getCurrentJob();
    }

    // Temporary Save
    function saveFixedData(bViewMessage) {
        if($(this).hasClass("active")) {
            saveProc();
            $Object.saveContentForWork($("form[name=work-data]", $mP), function () {
                if (bViewMessage) {
                    $.alert("????????? ????????? ???????????? ????????????.", selectMaskData);
                } else {
                    selectMaskData();
                }
            });
        }
    }

    function displayContents(context) {
        if(context instanceof Array){
            if(context.length > 0){
                totalFrame = context.filter(function(v, i){return v.extName.toLowerCase() !== '.mp4'}).length;
                $('.totalFrame').text(totalFrame);
                $('.totalFrameF').text(totalFrame);
                var loadFlag = false;
                selectMaskData();
                $('.thumbList').empty();
                context.forEach(function(v, i){
                    if(v.extName.toLowerCase() !== '.mp4'){
                        $('.thumbList').append('<li class="imgFrame'+v.priority+'" data-priority="'+v.priority+'" atchFileId="'+v.atchFileId+'"></li>');
                        var image64 = v.atchFile;
                        if($.isEmpty(image64)) {
                            $.alert("?????? ????????? ????????? ???????????? ???????????????."); // ?????? ???????????? ???????????? ???????????????.
                            return;
                        }
                        var base64ImageContent = image64.replace(/^data:image\/(png|jpeg);base64,/, "");
                        var extType = v.extName == ".png"? "image/png" : "image/jpeg";
                        var blob = base64ToBlob(base64ImageContent, extType);

                        var reader = new FileReader();
                        reader.onload = function(e) {
                            $('.imgFrame'+v.priority).append('<a><img class="imgContent'+v.priority+'" src="'+e.target.result+'" alt="'+context.orgFileName+'"></a>');
                            // ????????? ????????? ?????? ?????? ???????????? ?????? ????????? ????????? ??????.

                            // FIXME ?????? ????????? first frame??? ??????????????????. ?????? ????????? ?????? ?????? ??? ??? ?????? (??????????????? ????????? ?????? ???????????? ??????????????? ?????? ??? ??? ??????) 201012 ?????????
                            // ????????? ?????? ??? ????????? ??????
                            $('.imgFrame'+v.priority).on('click', function(){
                                $(".work_img").addClass("loadingImg");
                                //$section.find(".div_img").panzoom('reset');
                                //$('.imgName').text(v.orgFileName);
                                currentFrame.frame = v.priority;
                                // selectAreas & panzoom destory.
                                destroyArea();
                                $('.frame_box li').removeClass('selected')
                                $(this).addClass('selected');
                                // $(".to-crop", $mP).attr("src", e.target.result);
                                // startMask(v.priority, currentWorkData.data[v.priority]);
                                // $(".work_img .to-crop", $mP).attr("alt", v.orgFileName);
                                // $(".work_img").removeClass("loadingImg");
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
                                            $.alert("?????? ????????? ????????? ???????????? ???????????????."); // ?????? ???????????? ???????????? ???????????????.
                                            return;
                                        }
                                        $(".work_img").removeClass("loadingImg");
                                        var base64ImageContent = resource.replace(/^data:image\/(png|jpeg);base64,/, "");
                                        var extType = result.data.extName == ".png"? "image/png" : "image/jpeg";
                                        var resourceBlob = base64ToBlob(base64ImageContent, extType);
                                        var blobUrl = URL.createObjectURL(resourceBlob);

                                        $(".to-crop", $mP).attr("src", blobUrl);
                                        startMask(v.priority, currentWorkData.data[v.priority]);
                                        $(".work_img .to-crop", $mP).attr("alt", v.orgFileName);
                                    }, false
                                );
                            });
                            /*if(!loadFlag){
                                loadFlag = true;
                                if(Object.keys(currentWorkData.data).filter(function(v){return !isNaN(Number(v));}).length == 0){
                                    $('.thumbList').find('li').first().click();
                                }

                            }*/
                        }
                        reader.readAsDataURL(blob);
                    }else{
                        $('.imgName').text(v.orgFileName);
                    }
                });
            }else{
                $.alert("????????? ????????? ????????? ????????????.");
                return;
            }
        }else{
            $.alert("????????? ????????? ???????????????. (????????? ????????? ???????????? context??? Array?????? ?????????.)");
            return;
        }
    }

    // base64 -> blob ??????
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
    function maskRender(renderData) {
        currentWorkData.data = null;
        if(renderData != null && renderData.contentList) {
            var l1;
            var l2;
            renderData.contentList.forEach(function(v, i){
                if(v.contentKind){
                    switch (v.contentKind) {
                        case "l1":
                            l1 = v.reserve1;
                            $('[name=inOutCtg]').attr('data-work-context-id', v.contextId);
                            break;
                        case "l2":
                            l2 = v.reserve1;
                            $('[name=areaCtg]').attr('data-work-context-id', v.contextId);
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
                            workContextId : v.contextId,
                        }];
                    }
                    currentWorkData.data[v.priority]['check'] = v.cfrmStatus;

                    var cfrmStatus = currentWorkData.data[v.priority]['check'] == undefined ? '' : currentWorkData.data[v.priority]['check'];
                    switch(cfrmStatus){
                        case 'HD' :
                            cfrmStatus = 'frame_hold';
                            break;
                        case 'RJ' :
                            cfrmStatus = 'frame_rjct';
                            break;
                        case 'CM' :
                            cfrmStatus = 'frame_cfrm';
                            break;
                        default :
                            cfrmStatus = '';
                            break;
                    }
                    if(cfrmStatus !== ''){
                        $('.imgFrame'+v.priority).addClass(cfrmStatus).addClass('confirmed');
                    }
                }
            });

            /* ?????? ?????? */
            //3depth?????? ??????
            renderCategory(l2);
            //??????/??????
            $('[name=inOutCtg]').val(l1);
            //??????
            renderAreaCategory(function(){
                $('[name=areaCtg]').val(l2);
            });

            var preVal = '';
            //??????/???
            $('[name=inOutCtg]').off('change').focus(function(){
                preVal = $(this).val();
            }).on('change', function(){
                changeReserve(this, preVal, 'l1');
            });

            //??????
            preVal = '';
            $('[name=areaCtg]').off('change').focus(function(){
                preVal = $(this).val();
            }).on('change', function(){
                changeReserve(this, preVal, 'l2');
            });

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

    /** ???????????? ?????? ?????? */
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
     * reserve ?????? ??? call?????? ??????
     * obj : ?????? ??????
     * preVal : ?????? ??? value
     * type : l1=??????/?????? & l2=??????
     */
    function changeReserve(obj, preVal, type){
        var workData = currentWorkData.data;

        //?????? ?????? ?????? ??????
        var keys = Object.keys(workData);
        var check = false;
        keys.forEach(function(v,i){
            if(Number(v)){
                check = true;
                return;
            };
        });

        if(check) {
            $.confirm("?????? ???????????? ?????? ?????? ???????????? ???????????????. ?????????????????????????", function() {
                let tempArr = [];

                //?????? ???????????? ?????? ?????? ????????? ?????? ?????? check
                if(workData['contextId']) {
                    var arr = Object.values(workData['contextId']);
                    arr.forEach(function (v, i) {
                        tempArr.push(arr[i].contextId);
                    });
                }
                render(obj, type);

                //?????? ui ??????
                destroyArea();
                currentWorkData.data = null;

                if(tempArr.length > 0) currentWorkData.data['removeContextId'] = tempArr;
                $('.type_slt_box').hide();
                $('.select_group').html();
            },function(){
                $(obj).val(preVal);
            });
        } else {
            $('.type_slt_box').hide();
            $('.select_group').html();
            render(obj, type);
        }
    }

    /** ????????? ??? ?????? ?????? **/
    /** ???????????? **/
    /** selectareas.js : https://www.jqueryscript.net/other/jQuery-Plugin-For-Selecting-Multiple-Areas-of-An-Image-Select-Areas.html **/
    /** panzoom.js : https://www.jqueryscript.net/zoom/jQuery-Plugin-For-Panning-Zooming-Any-Elements-panzoom.html **/
    /** panzoom.js : https://www.tea.se/ICA/test/ **/
    var $image = $(".to-crop", $mP);
    var $section = $(".common_box");
    function startMask(priority, areas){

        $image.selectAreas({
            minSize: [10, 10],
            onChanged:onChangedCropBox,
            objArray: subCategoryList.data,
            priority : priority,
            workData : currentWorkData,
            allowEdit: false,
            allowMove: false,
            allowResize: false,
            allowSelect: false,
            allowDelete: false,
            allowNudge: false,
            areas : areas ? areas : []
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
        // ??????????????? 0????????? ???????????? ????????????
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

            if(checkEvent == "change"){	//?????? ??? ??????
                if($curDiv.length == 0) {
                    //input ??????
                    createInputTemplate(id, areas);

                }else {	//input????????? ??????
                    $curDiv.find("input[name=location_x]").val(areas[index].x);
                    $curDiv.find("input[name=location_y]").val(areas[index].y);
                    $curDiv.find("input[name=location_width]").val(areas[index].width);
                    $curDiv.find("input[name=location_height]").val(areas[index].height);
                }
            }else{	//??????(input??????)
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
            // TODO ????????? ????????? ???????????? ????????? ?????? ????????? ???????????? ????????? ?????????????????? ????????? ??????
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
        // contents ??? ?????? ???????????? ??? isTemporary data = false
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
                { grpCode : upperGrpCode },//??????????????? ????????????
                function(result) {
                    subCategoryList.data = result.data;
                    $('.thumbList').find('li').first().click();
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
                $.alert("'??????'?????? ????????? ?????????.");
            }
        }
    }

    // ????????? ?????? ?????????
    $(".arrowsAlt").click(function(){
        $section.find(".div_img").panzoom("option", "disablePan", false);
        $section.find(".select-areas-overlay").next().css("cursor","move");
    });

    // ????????? ?????? ????????????
    $(".vectorSquare").click(function(){
        $section.find(".div_img").panzoom("option", "disablePan", true);
        $section.find(".select-areas-overlay").next().css("cursor","crosshair");
    });

    // ????????? ??????
    $(".holdSquare").click(function(){
        setFrameInspectStatus('HD');
    });

    // ????????? ??????
    $(".rejectSquare").click(function(){
        setFrameInspectStatus('RJ');
    });

    // ????????? ??????
    $(".completeSquare").click(function(){
        setFrameInspectStatus('CM');
    });

    function changeCurrentFrame(flag){
        var currentFrame = Number($('.current').text());
        var totalFrame = Number($('.totalFrame').text());
        if(flag === 'n'){
            if(currentFrame !== totalFrame){
                switchFrame(currentFrame+1);
            }
        }else if(flag === 'p'){
            if(currentFrame !== 1){
                switchFrame(currentFrame-1);
            }
        }
    }

    function switchFrame(frame){
        $('.imgFrame'+frame).click();
    }

    $('.btn_prev').click(function(){
        changeCurrentFrame('p');
    });

    $('.btn_next').click(function(){
        changeCurrentFrame('n');
    });

    // PUBLIC FUNCTION
    return {
        init: init
    }
})();