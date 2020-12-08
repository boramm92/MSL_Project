var projectStateViewScript = (function() {
    var $mP;
    var mProjectInfo = {};
    var mGuideDocInfo;
    var mSelectedDocInfo;

    var requestApi = {
        getCurrProjectInfo: "/oper/project/getProjectDetail.json",
        goDashboard: "/oper/project/projectList.do",
        getClientCodeList: "/oper/client/selectClientCode.json",

        selectJobTypeList: "",

        saveProjectInfo: "/oper/project/updateProjectInfo.json",
        postProject: "/oper/project/postingProject.json",
        expireProject: "/oper/project/expireProject.json",
        pauseProject: "/oper/project/pauseProject.json",

        // for learning data
        download: "",           // 생성된 학습 데이터를 다운로드 한다.
        selectConfirmList: "",
        selectPackedList: "",   // 생성된 학습데이터 목록을 가져온다
        requestPacking: "",     // 학습데이터 생성 요청

        // for job guide
        preview: "",
        getGuideDocument: "",
        registGuideDocument: "",
        uploadGuideDocument: ""
    };
    function init(projectId) {
        $mP = $("div#container");
        $(".page_loading").hide();

        mProjectInfo.projectId = projectId;

        bindEventHandler();
        loadData();
    }

    function bindEventHandler() {
        $("button.edit_complete", $mP).on("click", saveProjectInfo);
        $("button.confirm", $mP).on("click", confirm);
        $("button.btnExpire", $mP).on("click", expireProject);
        $("button.btnPause", $mP).on("click", pauseProject);
        $("button.btnBack", $mP).on("click", function() {
           history.back();
        });
    }
    // 고객사 목록을 가져온다.
    function selectClientCodeList() {
        MindsJS.loadJson(
            requestApi.getClientCodeList,
            null,
            function(result) {
                if(result.success) {
                    var html = $.templates("#selectOptionOnlyTemplate").render(result.data);
                    $("select[name=clientId]", $mP).append(html).val(mProjectInfo.clientId);
                } else {
                }
            }
        );
    }
    function loadData() {
        MindsJS.loadJson(
            requestApi.getCurrProjectInfo,
            mProjectInfo,
            function(result) {
                if(result.success) {
                    if(!$.isEmptyObject(result.data)) {
                        mProjectInfo = result.data;
                        getProjectDetailInfo();
                        selectClientCodeList();

                        $("input[name=findFile]", $mP).findFile({
                            filelist : $(".showUploadBox", $mP)		// 업로드한 파일을 표시해줄 오브젝트
                            ,fileCount: $(".fileCount", $mP)
                        });
                    } else {
                        $.alert("프로젝트를 불러오지 못했습니다.", function() {
                            MindsJS.movePage(requestApi.goDashboard);
                        });
                        return;
                    }
                } else {
                    $.alert("프로젝트를 불러오지 못했습니다.", function() {
                        MindsJS.movePage(requestApi.goDashboard);
                    });
                    return;
                }
            }
        );
    }
    function getProjectDetailInfo() {
        // 프로젝트가 게시중이면 내용을 변경할 수 없음
        var currStatus = mProjectInfo.status;
        if(currStatus == 'RDY' || currStatus == 'REQ' || currStatus == 'EGH' || currStatus == 'EXP') {
            // $("form[name=form-project]", $mP).find("input").attr("readonly", true);
        } else {
            // $("form[name=form-project]", $mP).find("input").removeAttr("readonly");
        }

        if(currStatus == 'REQ' || currStatus == 'EGH') {
            // loadConfirmData();
        }
    }
    function saveProjectInfo() {
        var param = $("form[name=projectRegistForm]", $mP).formJson();
        param.projectId = mProjectInfo.projectId;
        param.title = param.projectNm;
        MindsJS.loadJson(
            requestApi.saveProjectInfo,
            param,
            function(result) {
                if(result.success) {
                    $.alert(
                        "수정됐습니다."
                    );
                } else {
                }
            }
        );
    }

    function confirm() {
        if(mProjectInfo.status == 'CRE' || mProjectInfo.status == 'RPA' || mProjectInfo.status == 'EXP') {
            postProject();
        } else {
            moveProjectListPage();
        }
    }
    function moveProjectListPage() {
        MindsJS.replacePage(requestApi.goDashboard);
    }

    function expireProject() {
        var param = {};
        param.projectId = mProjectInfo.projectId;
        $.confirm(
            "프로젝트를 폐기하면 더이상 작업 및 검수를 할 수 없습니다.<br>폐기하시겠습니까?"
            , function() {
                MindsJS.loadJson(
                    requestApi.expireProject
                    , param
                    , function(result) {
                        if(result.success) {
                            $.alert(
                                "프로젝트가 폐기됐습니다."
                                , function() { moveProjectListPage(); }
                            );
                        }
                    }
                );
            }
            , null
            , "프로젝트 폐기"
        );
    }
    function pauseProject() {
        var param = {};
        param.projectId = mProjectInfo.projectId;
        $.confirm(
            "프로젝트를 일시중지하면 작업목록에 표시되지 않습니다.<br>일시중지 하시겠습니까?"
            , function() {
                MindsJS.loadJson(
                    requestApi.pauseProject
                    , param
                    , function(result) {
                        if(result.success) {
                            $.alert(
                                "프로젝트가 일시중지 됐습니다."
                                , function() { location.reload(); }
                            );
                        }
                    }
                );
            }
            , null
            , "프로젝트 게시"
        );
    }
    function postProject() {
        // 수정된 내용은 저장하지 않고 게시만 할 경우
        // var param =  {projectId: "${pjtInfo.projectId}"};
        // 수정된 내용까지 저장하면서 게시할 경우
        // var param =  $("form[name=form-project]", $mP).formJson();
        var param = {};
        param.projectId = mProjectInfo.projectId;

        if(param == null || param.projectId == null) {
            return false;
        }
        $.confirm(
            "프로젝트를 게시하면, 사용자에게 프로젝트가 노출 표시됩니다.<br>게시하시겠습니까?"
            , function() {
                MindsJS.loadJson(
                    requestApi.postProject
                    , param
                    , function(result) {
                        if(result.success) {
                            $.alert(
                                "프로젝트가 게시됐습니다."
                                , function() { moveProjectListPage(); }
                            );
                        }
                    }
                );
            }
            , null
            , "프로젝트 게시"
        );
    }

    return {
        init: init
    }
})();