var jobGuideViewScript = (function() {
    var $mP;
    var mDocInfo = {};

    var requestApi = {
        loadGuideDocContents : "/guide/getGuideDocumentContents.json"
    };

    function init(projectId, jobType) {
        $mP = $("div.container");
        setCondition(projectId, jobType);
        bindEventHandler();
    }
    function setCondition(projectId, jobType) {
        mDocInfo.mProjectId = projectId;
        mDocInfo.mJobType = jobType;
    }
    function bindEventHandler() {
        $("button.btnStart", $mP).on("click", startProject);
        $("button.btnBack", $mP).on("click", goToBack);
    }

    function selectGuideDocContents() {
        var param = mDocInfo;
        MindsJS.loadJson(
            requestApi.loadGuideDocContents
            ,param
            ,renderGuideDoc
        );
    }

    // 프로젝트 진행 Clip
    function startProject() {

    }
    // 프로젝트 선택화면으로 이동
    function goToBack() {

    }

    function renderGuideDoc(data) {

    }

    return {
        init: init
    }
})();