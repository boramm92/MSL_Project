var walletViewScript = (function() {
	var $mP;

	var requestApi = {
		selectPointHistory: "/profile/selectPointHistory.json",
	};
	
	function init() {
		$mP = $("div.container");
		
		bindEventHandler();
		selectWalletInoutHistory();
	}
	function bindEventHandler() {
		$("button.btnSearch", $mP).on("click", selectWalletInoutHistory);
	}
	
	function selectWalletInoutHistory() {
		var param = { title: "진행중인 작업", title_eng: "WORKING LIST" };
		param.language = navigator.language || navigator.userLanguage;
		param.inoutType = $("select#work_type option:selected", $mP).val();
		param.startDate = $("input[name=startDate]", $mP).val();
		param.endDate = $("input[name=endDate]", $mP).val();
		$("#myList", $mP).paging({
			dataURI: requestApi.selectPointHistory,
			renderCallback: renderMyPoint,
			param: param,
			pageBlock: 10,
			length: 10,
			pageNav: $("div.confirmPagingBox", $mP)
		});
	}
	function renderMyPoint(data) {
		var myCardHtml = "";
		if(data != null && data.length > 0) {
			myCardHtml = $.templates("#myPointHistoryTemplate").render(data);
		} else {
			var emptyParam = { colspan: 5, message: "No point history." };
			myCardHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);
		}
		var $cardListTable = $("#myList", $mP).html(myCardHtml);
	}
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();