// for inspector
var modalProjectBriefingdViewScript = (function() {
	var $mPopup;
	var mProjectInfo = {};
	var callbackParent = null;
	
	var requestApi = {
		getProjectDetail: "/project/getProjectDetailForInspector.json",
		clipProject: "/check/clipProjectIntoMyCheckList.json",
		getAndStartProject: "/check/getAndStartProject.json"
	};
	
	function showModal(projectId, callback) {
		callbackParent = callback;
		mProjectInfo.projectId = projectId;
        
		$mPopup = $("div.briefing_modal");
		bindEventHandler();
		loadData(projectId);
	}
	
	function bindEventHandler() {
		$("button.close", $mPopup).on("click", function() { $mPopup.hide(); });
		$("button.favi_btn", $mPopup).on("click", function() {
			$.confirm("이 프로젝트를 찜하시겠습니까?", cliping, null, "찜하기");
		});
		$("button.start_btn", $mPopup).on("click", function() {
			$.confirm("이 프로젝트를 찜하고 바로 작성 하시겠습니까?", startProject, null, "프로젝트 시작하기");
		});
	}
	
	function loadData(projectId) {
		var param = {projectId : projectId};
		MindsJS.loadJson(requestApi.getProjectDetail 
			, param
			, function(result) {
				if(result.success) {
					mProjectInfo = result.data;
					if(result.data != 'undefined') {
						rendingDetail(result.data);
						$mPopup.show();
					} else {
						$.alert("");
					}
				} else {
					// 프로젝트 GET 실패
					$.alert("해당 프로젝트를 가져오는데 실패했습니다.");
				}
			}
		);
	}
	
	function rendingDetail(data) {
		var detailHtml = $.templates("#projectDetail").render(data);
		$("div.detailArea", $mPopup).html(detailHtml);
	}
	
	function cliping() {
		var param = {projectId : mProjectInfo.projectId};
		MindsJS.loadJson(requestApi.clipProject 
			, param
			, function(result) {
				if(result.success) {
					// 프로젝트 CLIP 성공
					if(callbackParent != null) {
						eval(callbackParent)();
						close();
					}
				} else {
					// 프로젝트 CLIP 실패
				}
			}
		);
	}
	
	function startProject() {
        var param = {projectId : mProjectInfo.projectId};
		MindsJS.loadJson(requestApi.getAndStartProject
			, param
			, function(result) {
				if(result.success) {
					// 프로젝트를 할당받을 조건이 됨
					// move page to working board
					moveJobPage();
				} else {
					// 프로젝트를 할당받을 조건이 안됨 (할당 개수 초과 등의 사유)
				}
			}	
		);
	}
	function moveJobPage() {
		MindsJS.movePage("/biz"
				+"/"+mProjectInfo.projectTypeName
				+"/"+mProjectInfo.projectId
				+"/projectDetail.do");
	}
	
	function close() {
		$(".close", $mPopup).click();
	}
	
	// PUBLIC FUNCTION
	return {
		showModal: showModal
	}
})();
$(function() {
	MindsJS.init();
});