var projectListViewScript = (function() {
	var $mP;

	var requestApi = {
		// 프로젝트 목록(왼쪽)
		selectProjectList:"/project/selectProjectList.json",
		// 완료 된 프로젝트 목록(왼쪽)
		selectCompletedProjectList:"/project/selectCompletedProjectList.json",
		// 내가 찜한 프로젝트 목록 (할당 및 작업중인 프로젝트가 하나라도 있어야 목록에 조회 됨)
		selectMyWorkingList:"/project/selectMyWorkingList.json",
		// 내가 완료한 프로젝트 목록
		selectMyCompletedList: "/project/selectMyCompletedList.json",

		selectPjtTypeList: "/biz/comm/selectProjectTypeList.json",
		selectJobTypeList: "/biz/comm/selectJobTypeList.json",
	};
	
	function init() {
		$mP = $("div.container");
		
		bindEventHandler();
		loadData();
		
		$(".page_loading").addClass("pageldg_hide").delay(300).queue(function() {
			$(this).remove();
		});
		
		selectProjectTypeList();
	}
	function bindEventHandler() {
		$("button.btnTab", $mP).on("click", loadData);
		$("input[name=chk_type]", $mP).on("change", filtering);
		$("select[name=projectType]", $mP).on("change", selectJobType);
		$("select[name=jobType]", $mP).on("change", loadMyJobList);
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
	
	/** 프로젝트 상태나 타입으로 목록을 조회해 오는 UX **/
	function filtering() {
		var selectType = $("button.btnTab.active:first", $mP).attr("form");
		selectType == "btnStandby" ? loadStandbyJobList() : loadComplateJobList();
	}
	
	function selectProjectTypeList() {
		MindsJS.loadJson(
			requestApi.selectPjtTypeList,
			null,
			function(result) {
				var data = result.data;
				var html = $.templates("#selectOptionTemplate").render(result);
				var $pjtTypeSelector = $("#sel_pjtType", $mP).html(html);
				$pjtTypeSelector.on("change", selectJobTypeList);
			}	
		);
	}
	function selectJobTypeList() {
		var $this = $(this);
		var param = { pjtType : $this.val() };
		MindsJS.loadJson(
			requestApi.selectJobTypeList,
			param,
			function(result) {
				var data = result.data;
				var html = $.templates("#selectOptionTemplate").render(result);
				var $jobTypeSelector = $("#sel_jobType", $mP).html(html);
				$jobTypeSelector.on("change", selectJobType);
			}	
		);
	}
	
	function selectJobType() {
		// select box 에 job Type 을 불러와 랜더링한다.
		
		// 새로 불러온다.
		loadMyJobList();
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
		var param = {
			projectType: $("select[name=projectType]", $mP).val()
			,jobType: $("select[name=jobType]", $mP).val()
		};
		MindsJS.loadJson(
			requestApi.selectMyWorkingList,
			param,
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
			//"/biz/"+prjType+"/getCurrentJob.json"
			"/biz/"+prjType+"/getWorkingJobInfo.json"
			, param
			, function(result) {
				if(result.success) {
					var data = result.data;
					// 2. 진행중인 JOB이 있다면 JOB INFO를 이용해 이동
					if(data != null) {
						moveJobPage(data.projectId, prjType, data.jobType)
					}
					else {
						// 3. 진행중인 JOB이 없다면 
						// 3-1. 현재 진행 가능한 JOB TYPE을 조회하고
						// 3-2. JOB TYPE 선택 창 POPUP
						MindsJS.loadJson(
							"/biz/"+prjType+"/selectAvailableList.json"
							, param
							, function(result) {
								if(result.success) {
									var data = result.data;
									if(data != null && data.length > 0) {
										data.prjid = prjid;
										data.prjType = prjType;
										modalJobSelectViewScript.showModal(data, "projectListViewScript.clip");	
									} else {
										$.alert("진행중인 작업이 없습니다.");
									}
								}
							}
						);
					}
				}
			}
			, function() {
			}
		);
		
		// 3. 진행중인 JOB이 없다면 현재 진행 가능한 JOB TYPE을 조회하고
		// 3-1. 진행 가능한 JOB이 있다면 JOB TYPE 선택 창 POPUP
//		var data = [];
//		var param = { name:"음성문장단위분리", type:"SS", remainCnt:"5", totCnt:"10" };
//		
//		data.push(param);
//		data.push(param);
//		data.push(param);
//		modalJobSelectViewScript.showModal(data, "projectListViewScript.clip");
		// 3-2. 진행 가능한 JOB이 없다면 알림창 띄우고 종료
	}
	function clipNewJobInProject(param) {
		// 찜하고
		if(param == null) return;
		MindsJS.loadJson(
			"/biz/"+param.pjtType+"/getCurrentJob.json"
			, param
			, function(result) {
				var data = result.data;
				if(data != null) {
					moveJobPage(data.projectId, param.pjtType, data.jobType)
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
		reload: loadData,
		clip: clipNewJobInProject
	}
})();
$(function() {
	//MindsJS.init();
	projectListViewScript.init();
});