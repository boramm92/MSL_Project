var workingBoardViewScript = (function() {
	var $mP;

	var requestApi = {
		moveProfile: "/profile/viewMyProfile.do",
		selectMyJobList: "/profile/selectMyAllJobList.json",
		getMyWorkReport: "/profile/getMyWorkReport.json",
		getMyWallet: "/profile/getMyWallet.json",
	};
	
	function init() {
		$mP = $("div.container");
		
		bindEventHandler();
		getMyWorkReport();
		getMyWallet();
		
		selectWorkList();
	}
	function bindEventHandler() {
		$("select.projectType", $mP).on("change", selectWorkList);
		$("button.btnSearch", $mP).on("click", selectWorkList);
		$("li.profile", $mP).on("click", moveProfile);

		$("input[name=searchText]", $mP).on("keydown", conditionSearch);
	}
	
	function conditionSearch(e) {
		if(e.keyCode == '13') {
			// enter key down
			selectWorkList();
		}
	}
	// 작업내역 가져오기
	function selectWorkList() {
		var param = { title: "진행중인 작업", title_eng: "WORKING LIST" };
		param.language = navigator.language || navigator.userLanguage;
		param.projectType = $("select#work_type option:selected", $mP).val();
		param.startDate = $("input[name=startDate]", $mP).val();
		param.endDate = $("input[name=endDate]", $mP).val();
		param.searchText = $("input[name=searchText]", $mP).val();

		console.log(param);
		$("#myList", $mP).paging({
			dataURI: requestApi.selectMyJobList,
			renderCallback: renderMyList,
			param: param,
			pageBlock: 10,
			length: 10,
			pageNav: $("div.confirmPagingBox", $mP)
		});
	}
	function renderMyList(data) {
		var myCardHtml = "";
		if(data != null && data.length > 0) {
			myCardHtml = $.templates("#workStatusList").render(data);
		} else {
			var emptyParam = { colspan: 10, message: "No working project." };
			myCardHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);
		}
		var $cardListTable = $("#myList", $mP).html(myCardHtml);
	}
	
	// work report 가져오기
	function getMyWorkReport() {
		MindsJS.loadJson(
			requestApi.getMyWorkReport,
			null,
			function(result) {
				if(result.success) {
					var data = result.data;
					var myReportHtml = $.templates("#myWorkReportTemplate").render(data);
					$("div.common_box.history", $mP).html(myReportHtml);
				}
			}
		);
	}
	
	// 수익금 관련 내용 가져오기
	function getMyWallet() {
		MindsJS.loadJson(
			requestApi.getMyWallet,
			null,
			function(result) {
				if(result.success) {
					var data = result.data;
					var myWalletHtml = $.templates("#myWalletTemplate").render(data);
					$("div.common_box.point", $mP).html(myWalletHtml);
				}
			}
		);
	}
	
	// 개인정보 수정 페이지로 이동하기
	function moveProfile() {
		MindsJS.movePage(requestApi.moveProfile);
	}
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();