var clientDashboardScript =  (function() {
	var $mP;
	var requestApi = {
			selectClientTotalCnt: "/oper/management/selectClientTotalCnt.json",
			selectClientList: "/oper/management/selectClientList.json"
		
	};
	var requestPage = {
			moveClientAuthorization: "/oper/management/clientAuthorization.do",
			moveClientRegistration: "/oper/management/clientRegistration.do"
	};
	
	function init() {
		$mP = $("div.container");
		
		bindEventHandler();
		
		// 진행중인 고객사 현황 totalCount
		getClientTotalCnt();
		
		// 진행중인 고객사 리스트
		getClientList();
		
		$(".page_loading").addClass("pageldg_hide").delay(300).queue(function() {
			$(this).remove();
		});
	}
	
	function bindEventHandler() {
		// 검색
		$(".btnSearch", $mP).on("click", getClientList);
		
		// 고객사 등록
		$(".add_company", $mP).on("click", goClientRegistrationPage);
	}
	
	function getClientTotalCnt(){
		MindsJS.loadJson(
			requestApi.selectClientTotalCnt,
			null,
			function(result) {
				if(result == null || result.length == 0 || result == undefined){
					$.alert("현재 진행중인 고객사 수를 불러오지 못했습니다.");
					return false;
				}
				$(".clientTotalCount", $mP).html(result.data);
			}
		);
	}
	
	function getClientList() {
		// 검색 validation check
		if(!checkSearchData()){
			return false;
		}
		var param = getParamData();
		$("tbody#detailList", $mP).paging({
			dataURI: requestApi.selectClientList,
			renderCallback: setClientList,
			param: param,
			pageBlock: 10,
			length: 10,
			pageNav: $("div.paging", $mP)
		});
	}
	
	function checkSearchData() {
		var startDate = $(".fromDate", $mP).val();
		var endDate = $(".toDate", $mP).val();
		var datatimeRegexp = /[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
		
		if(startDate != "" && startDate != undefined) {
			if (!datatimeRegexp.test(startDate)) {
				$.alert("인증기간(시작)은 yyyy-mm-dd 형식으로 입력해주세요.", null);
				return false;
			}
		}
		
		if(endDate != "" && endDate != undefined) {
			if (!datatimeRegexp.test(endDate)) {
				$.alert("인증기간(종료)은 yyyy-mm-dd 형식으로 입력해주세요.");
				return false;
			}
		}
		
		var searchType = $("select#srch_condition", $mP).val();
		var searchText = $("#search_work", $mP).val();
		if((searchType == "" || searchType == undefined) && (searchText != "" && searchText != undefined)){
			$.alert("검색조건을 선택해주세요.");
			return false;
		}
		
		return true;
	}
	
	function getParamData() {
		var searchData = {};
		searchData.startDate = $(".fromDate", $mP).val();
		searchData.endDate = $(".toDate", $mP).val();
		searchData.searchType = $("select#srch_condition", $mP).val();
		searchData.searchText = $("#search_work", $mP).val();
		return searchData;
	}
	
	function changeSrchOption() {
		var searchType = $("select#srch_condition", $mP).val();
		if(searchType == "" || searchType == undefined) {
			$("#search_work", $mP).attr("disabled", true);
		}else {
			$("#search_work", $mP).attr("disabled", false);
		}
	}
	
	function setClientList(data) {
		var tableHtml = "";
		// var idx = (data.curPage * data.block) - 9;
		if(data != null && data.length > 0) {
			tableHtml += $.templates("#cilentDataTemplate").render(data);
			$("tbody#detailList", $mP).html(tableHtml);
			// 고객사 관리화면
			$("#detailList", $mP).find("tr").click(function() {
				goClientDetailPage($(this));
			});
		} else {
			var emptyParam = { colspan : 8, message : "계약 진행중인 고객사가 없습니다." };
			tableHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);

			$("tbody#detailList", $mP).html(tableHtml);
		}
	}
	
	function goClientDetailPage(curTr) {
		var clientId = curTr.attr("clientId");
		var clientNm = curTr.find(".client_company_name").text();
		var paramMap = {clientId : clientId, clientNm : clientNm}
		MindsJS.movePage(requestPage.moveClientAuthorization, paramMap);
	}
	
	function goClientRegistrationPage(){
		MindsJS.movePage(requestPage.moveClientRegistration);
	}
	
	return {
		init: init
	}
})();
$(function() {
	//MindsJS.init();
	clientDashboardScript.init();
});