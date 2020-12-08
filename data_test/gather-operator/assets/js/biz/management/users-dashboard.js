var usersDashboardViewScript4Oper = (function() {
	var $mP;
	var requestApi = {
		selectUserList: "/oper/user/selectUserList.json",
		updateState: "/oper/user/updateUsersInfo.json"
	};
	
	function init() {
		$mP = $("div.container");
		loadUserList();

		bindEventHandler();
	}
	function bindEventHandler() {
		$("button.btnSearch", $mP).on("click", loadUserList);
		$(".character", $mP).find("li").on("click", function() {
			$(this).addClass("active").siblings("li").removeClass("active");
			loadUserList();
		});
		$("input[name=searchText]", $mP).on("keydown", function(e) {
			if(e.keyCode === 13) {
				loadUserList();
			}
		})
	}
	function loadUserList() {
		var param = {};
		param.searchType = $("select#srch_condition", $mP).val();
		param.searchText = $("input[name=searchText]", $mP).val();
		param.userKind = $(".character", $mP).find(".active").prop("type");
		$("#userList", $mP).paging({
			dataURI: requestApi.selectUserList,
			renderCallback: renderUserList,
			param: param,
			pageBlock: 5,
			length: 10,
			pageNav: $("div.btm_info", $mP)
		});
	}
	function renderUserList(data) {
		var userListHtml = "";
		if(data != null && data.length > 0) {
			userListHtml = $.templates("#userInfoTemplate").render(data);
		} else {
			var emptyParam = { colspan: 10, message: "No User." };
			userListHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);
		}
		var $userList = $("tbody#userList", $mP).html(userListHtml);
		$userList.find("select[name=level]").on("change", function () {
			var param = {};
			var $this = $(this);
			var userId = $this.parents("tr:first").find("td.user_id").attr("userId");
			// save user level
			var param = { userId : userId, userLevel : $this.val() };
			MindsJS.loadJson(
				requestApi.updateState,
				param,
				function(result) {
				}
			);
		});
		$userList.find("select[name=userKind]").on("change", function () {
			var $this = $(this);
			var userId = $this.parents("tr:first").find("td.user_id").attr("userId");
			// save user Kind
			var param = { userId : userId, userKind : $this.val() };
			MindsJS.loadJson(
				requestApi.updateState,
				param,
				null
			);
		});
	}
	return {
		init: init
	}
})();