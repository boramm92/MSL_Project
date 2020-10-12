var clientAnalyticsViewScript = (function() {
    var $mP;

    var requestApi = {
        selectAnalytics: "/client/selectProjectAnalytics.json"
    };

    function init() {
        $mP = $("div.container");
        bindEventHandler();
        selectProjectAnalytics();
    }

    function bindEventHandler() {
        $("button.btnSearch", $mP).on("click", selectProjectAnalytics);
    }

    function selectProjectAnalytics() {
        var param = { title: "진행중인 작업", title_eng: "WORKING LIST" };
        param.language = navigator.language || navigator.userLanguage;
        // param.projectType = $("select.projectType", $mP).val();
        param.startDate = $("input[name=startDate]", $mP).val();
        param.endDate = $("input[name=endDate]", $mP).val();
        param.searchText = $("input[name=searchText]", $mP).val();
        param.dateCond = $("select[name=dateCond]", $mP).val();
        $("#myList", $mP).paging({
            dataURI: requestApi.selectAnalytics,
            renderCallback: renderAnalytics,
            param: param,
            pageBlock: 10,
            length: 10,
            pageNav: $("div.confirmPagingBox", $mP)
        });
    }

    function renderAnalytics(data) {
        var analyticsHtml = "";
        if(data != null && data.length > 0) {
            analyticsHtml = $.templates("#analyticsTemplate").render(data);
        } else {
            var emptyParam = { colspan: 14, message: "No working project." };
            analyticsHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);
        }
        var $cardListTable = $("#myList", $mP).html(analyticsHtml);
    }

    return {
        init: init
    }
})();