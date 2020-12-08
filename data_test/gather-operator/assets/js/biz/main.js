var usersDashboardViewScript4Oper =  (function() {
	var $mP;
	var requestPage = {
		moveProjectList: "/oper/project/projectList.do",
		moveuserManager: "/oper/usermanage/userDashboard.do",
		moveClientManager: "/oper/management/clientDashboard.do"
	};
	
	function init() {
		$mP = $("div.container");
		
		bindEventHandler();
		
		$(".page_loading").addClass("pageldg_hide").delay(300).queue(function() {
			$(this).remove();
		});
	}
	function bindEventHandler() {
		$("button.btnGoPjt", $mP).on("click", function() {
			MindsJS.movePage(requestPage.moveProjectList);
		});
		$("button.btnGoUser", $mP).on("click", function() {
			MindsJS.movePage(requestPage.moveuserManager);
		});
		$("button.btnGoClt", $mP).on("click", function() {
			MindsJS.movePage(requestPage.moveClientManager);
		});
	}
	
	return {
		init: init
	}
})();
$(function() {
	//MindsJS.init();
	usersDashboardViewScript4Oper.init();
});