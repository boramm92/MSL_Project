var clientMonitorViewScript = (function() {
    var $mP;

    var requestApi = {
        selectMonitoringData: "/client/selectProjectMonitoring.json"
    };

    function init() {
        $mP = $("div.container");
        bindEventHandler();
        selectProjectMonitoring();
    }

    function bindEventHandler() {
        $("button.btnSearch", $mP).on("click", selectProjectMonitoring);
    }

    function selectProjectMonitoring() {
        var param = { title: "진행중인 작업", title_eng: "WORKING LIST" };
        param.language = navigator.language || navigator.userLanguage;
        // param.projectType = $("select.projectType", $mP).val();
        param.startDate = $("input[name=startDate]", $mP).val();
        param.endDate = $("input[name=startDate]", $mP).val();
        param.searchText = $("input[name=searchText]", $mP).val();
        param.dateCond = $("select[name=dateCond]", $mP).val();
        $("#myList", $mP).paging({
            dataURI: requestApi.selectMonitoringData,
            renderCallback: renderMonitoringData,
            param: param,
            pageBlock: 10,
            length: 10,
            pageNav: $("div.confirmPagingBox", $mP)
        });
    }

    function renderMonitoringData(data) {
        console.log(data);
        var analyticsHtml = "";
        if(data != null && data.length > 0) {
            analyticsHtml = $.templates("#monitoringTemplate").render(data);
        } else {
            var emptyParam = { colspan: 13, message: "No working project." };
            analyticsHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);
        }
        var $cardListTable = $("#myList", $mP).html(analyticsHtml);
    }

    return {
        init: init
    }
})();