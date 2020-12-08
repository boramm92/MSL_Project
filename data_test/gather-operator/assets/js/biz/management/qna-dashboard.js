var qnaScript = (function() {
	var $mP;

	var requestApi = {
		selectQnAList: "/oper/management/selectQnAList.json" ,
		selectProjectList: 	"/oper/project/selectProjectListForSearch.json" // 프로젝트 목록
	};

	function init() {
		$mP = $("div.container");

		selectQnAList();

		bindEventHandler();
		loadProjectList();
		loadQnaTypeList();
	}
	function bindEventHandler() {
		$("button.btnSearch", $mP).on("click", selectQnAList);
		$("button.btnRegist", $mP).on("click", moveRegist);
	}

	/**
	 * 프로젝트
	 */
	function loadProjectList() {
		var param = {};
		param.language = navigator.language || navigator.userLanguage;
		MindsJS.loadJson(
			requestApi.selectProjectList
			, param
			, function(result) {
				var html = "<option value=''>프로젝트 선택</option>";
				if (!$.isEmpty(result.data)) {
					html += $.templates("#projectList").render(result.data);
				}
				html += "<option value='ETC_000000000'>기타</option>";

				$("select[name=projectId]", $mP).html(html);
			}
		);
	}

	/**
	 * 질문 유형
	 */
	function loadQnaTypeList() {
		MindsJS.loadJson(
			'/oper/codeutil/selectCode.json',
			{grpCode: 'QNA_TYPE'},//레이어노출 카테고리
			function (result) {
				var html = "<option value=''>질문 유형 선택</option>";
				if (!$.isEmpty(result.data)) {
					html += $.templates("#selectOptionOnlyTemplate").render(result.data);
				}

				$("select[name=qnaType]", $mP).html(html);
			}

		);
	}

	function selectQnAList() {
		var param = { /*title: "진행중인 작업", title_eng: "WORKING LIST"*/ };
		param.language = navigator.language || navigator.userLanguage;
		param.projectId = $("select#projectId option:selected", $mP).val();
		param.qnaType = $("select#qnaType option:selected", $mP).val();
		param.reState = $("select#reState option:selected", $mP).val();
		param.searchKeyword = $("input[name=searchKeyword]", $mP).val();
		param.pagingYn = 'Y';
		$("#detailList", $mP).paging({
			dataURI: requestApi.selectQnAList,
			renderCallback: renderQnAList,
			param: param,
			pageBlock: 10,
			length: 10,
			pageNav: $("div.paging", $mP)
		});
	}

	function renderQnAList(data) {
		var myCardHtml = "";

		if(data != null && data.length > 0) {
			myCardHtml = $.templates("#qnaListTemplate").render(data);
		} else {
			var emptyParam = { colspan: 6};
			myCardHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);
		}

		var $list = $("#detailList", $mP).html(myCardHtml);
		if(data != null && data.length > 0) {
			$list.find("tr").on("click", showDetail);
		}
	}

	function moveRegist() {
		MindsJS.movePage(requestApi.moveRegistView);
	}

	function showDetail() {
		var qnaid = $(this).attr("qnaid");
		if(qnaid == null || qnaid == 'undefined') {
			return;
		}
		MindsJS.movePage("/oper/management/"+qnaid+"/qnADetail.do");
	}

	function failCallback(result) {
		console.log(result);
	}

	// PUBLIC FUNCTION
	return {
		init: init
	}
})();
$(function() {
	qnaScript.init();
});