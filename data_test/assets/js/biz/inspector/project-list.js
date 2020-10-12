var projectListViewScript = (function() {
	var $mP;
	var $mModalBriefing;

	var requestApi = {
		selectProjectList:"/project/selectProjectList.json",
		selectCompletedProjectList:"/project/selectCompletedProjectList.json",
		selectMyWorkingList:"/project/selectMyWorkingList.json"
	};
	
	function init() {
		$mP = $("div.container");
		$mModalBriefing = $("div.briefing_modal");
		
		bindEventHandler();
		loadData();
		
		$(".page_loading").addClass("pageldg_hide").delay(300).queue(function() {
			$(this).remove();
		});
	}
	function bindEventHandler() {
		$("button.btnTab", $mP).on("click", loadData);
		$("input[name=chk_type]", $mP).on("change", filtering);
	}
	
	function loadData(e) {
		if(e != null) {
			var selectType = $(this).attr("form");
			selectType == "btnStandby" ? loadStandbyJobList() : loadComplateJobList();
			$(this).addClass("active").siblings("button").removeClass("active");
		} else {
			loadStandbyJobList();	
		}
		loadMyJobList();
	}
	
	function filtering() {
		var selectType = $("button.btnTab.active:first", $mP).attr("form");
		selectType == "btnStandby" ? loadStandbyJobList() : loadComplateJobList();
	}
	
	/** 작업가능목록 가져오기 **/
	function loadStandbyJobList() {
		var param = { projectType : $("input[name=chk_type]:checked").val() };
		MindsJS.loadJson(
			requestApi.selectProjectList,
			param,
			function(result) {
				var data = result.data;
				var html;
				if(data != null && data.length > 0) {
					html = $.templates("#standbyJobListTemplate").render(data);
				} else {
					html = $.templates("#emptyProjectTemplate").render();
				}
				var $readyProjectList = $("ul.project_list", $mP).html(html);
				$readyProjectList.find("li.active").on("dblclick", showBriefing);
			}	
		);
	}
	function showBriefing() {
        var pjtId = $(this).attr("prjid");
		modalProjectBriefingdViewScript.showModal(pjtId, "projectListViewScript.reload");
	}
	/** 작업완료목록 가져오기 **/
	function loadComplateJobList() {
		var param = { projectType : $("input[name=chk_type]:checked").val() };
		MindsJS.loadJson(
			requestApi.selectCompletedProjectList,
			param,
			function(result) {
				var data = result.data;
				var html;
				if(data != null && data.length > 0) {
					html = $.templates("#complateJobListTemplate").render(data);
				} else {
					html = $.templates("#emptyProjectTemplate").render();
				}
				$("ul.project_list", $mP).html(html);
			}	
		);
	}
	/** 내가 진행중인 작업목록 가져오기 **/
	function loadMyJobList() {
		MindsJS.loadJson(
			requestApi.selectMyWorkingList,
			null,
			function(result) {
				var data = result.data;
				var html;
				if(data != null && data.length > 0) {
					html = $.templates("#workingJobListTemplate").render(data);
				} else {
					html = $.templates("#emptyProjectTemplate").render();
				}
				var $myJobList = $("ul.my_job_list", $mP).html(html);
				$myJobList.find("li").on("dblclick", checkAvailableJob);
			}	
		);
	}
	function checkAvailableJob() {
		// 0. 찜한 프로젝트를 대상으로
		var prjid = $(this).attr("prjid");
		var prjType = $(this).attr("prjtype");

		// 1. 현재 진행중인 JOB 있는지 확인한다 (AS, DO, RJ)
		// 1-1. JOB INFO를 반환받는다.
		var param = { projectId: prjid };
		MindsJS.loadJson(
			"/biz/"+prjType+"/getCurrentJob.json"
			, param
			, function(result) {
				if(result.success) {
					var data = result.data;
					// 2. 진행중인 JOB이 있다면 JOB INFO를 이용해 이동
					if(data != null) {
						moveJobPage(data.projectId, prjType, data.jobType)
					}
				}
			}
		);
	}
	function moveJobPage(projectId, prjType, jobType) {
		if(projectId == null || projectId == 'undefined') {
			// alert 필요
			return;
		}
		if(prjType == null || prjType == 'undefined') {
			// alert 필요
			return;
		}
		if(jobType != null) {
			var param = { jobType: jobType };
			MindsJS.movePage("/biz/"+prjType+"/"+projectId+"/projectDetail.do", param);
		} else {
			MindsJS.movePage("/biz/"+prjType+"/"+projectId+"/projectDetail.do");
		}
	}

	// PUBLIC FUNCTION
	return {
		init: init,
		reload: loadData
	}
})();
$(function() {
	//MindsJS.init();
	projectListViewScript.init();
});