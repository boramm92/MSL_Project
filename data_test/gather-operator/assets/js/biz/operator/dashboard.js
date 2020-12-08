var dashboardViewScript4Oper =  (function() {
	var $mP;
	var requestApi = {
		selectProjectList: "/oper/project/selectProjectListAndSummary.json",
		moveRegistView: "/oper/project/registProject.do"
	};

	function init() {
		$mP = $("div#container");
		$(".page_loading").hide();

		setCondition();
		bindEventHandler();
		loadData();
	}
	function setCondition() {
		MindsJS.loadJson(
			"/oper/codeutil/selectProjectTypeList.json",
			null,
			function(result) {
				var html = $.templates("#selectOptionTemplate").render(result);
				var $projectTypeFilter = $("select#srch_pjtType", $mP).html(html);
				$projectTypeFilter.on("change", loadData);
			}	
		);
		MindsJS.loadJson(
			"/oper/codeutil/selectProjectStatusList.json",
			null,
			function(result) {
				var html = $.templates("#selectOptionTemplate").render(result);
				var $projectTypeFilter = $("select#srch_pjtStatus", $mP).html(html);
				$projectTypeFilter.on("change", loadData);
			}	
		);
		MindsJS.loadJson(
			"/oper/client/selectClientCode.json",
			null,
			function(result) {
				var html = $.templates("#selectOptionTemplate").render(result);
				var $clientFilter = $("select[name=clientId]", $mP).html(html);
				$clientFilter.on("change", loadData);
			}
		);
	}
	function bindEventHandler() {
		$("a.btnRegist", $mP).on("click", moveRegist);
		$("select#srch_condition", $mP).on("change", changeCondition);
		$("button.btnSearch", $mP).on("click", loadData);
		$("input[name=searchText]", $mP).on("keyup", function(e) {
			if(e.keyCode === 27 || e.keyCode === 13) {
				loadData();
			}
		});
	}
	function changeCondition() {
		$("input[name=searchText]", $mP).siblings("label").text($(this).find(":selected").text());
	}
	function loadData(e) {
		// var param = {
		// 	projectType : $("input[name=chk_type]:checked").val()
		// 	, status : $("input[name=chk_stat]:checked").val()
		// };
		var param = $("form[name=search_condition]", $mP).formJson();
		$("tbody.project_list", $mP).paging({
			dataURI: requestApi.selectProjectList,
			renderCallback: renderProjectList,
			param: param,
			pageBlock: 10,
			length: 10,
			pageNav: $("div.paging", $mP)
		});
	}
	function renderProjectList(data) {
		// var data = result.data;
		var html;
		if(data != null && data.length > 0) {
			html = $.templates("#projectListTemplate").render(data);
		} else {
			data = {colspan: 9};
			html = $.templates("#emptyProjectTemplate").render(data);
		}
		var $readyProjectList = $("tbody.project_list", $mP).html(html);
		if(data != null && data.length > 0) {
			$readyProjectList.find("tr").on("click", showDetailContents);
		}
	}
	
	function showDetailContents() {
		var prjId = $(this).attr("prjid");
		var prjType = $(this).attr("prjtype");
		if(prjId == null || prjId == 'undefined') {
			// alert 필요
			return;
		}
		MindsJS.movePage("/oper/"+prjType+"/"+prjId+"/projectDetail.do");
	}

	function moveRegist() {
		MindsJS.movePage(requestApi.moveRegistView);
	}

	return {
		init: init,
		reload: loadData
	}
})();
$(function() {
	//MindsJS.init();
	dashboardViewScript4Oper.init();
});