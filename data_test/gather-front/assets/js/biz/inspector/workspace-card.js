var inspectorCardViewScript = (function() {
	var $mP;
	var mSubMenuType;
	var $mGuidePopup;
	
	var requestApi = {
		selectPostingList: 	"/wspace/selectPostingList.json"
		,selectMyJobList: 	"/wspace/selectMyJobList.json"

		// ,getAndStartProject: "/check/getAndStartProject.json"
		,clipProject:		"/check/clipProjectIntoMyCheckList.json"
		,loadGuideDocContents : "/guide/getGuideDocumentContents.json"
	};
	
	function init(subMenuType) {
		$mP = $("div.container");
		mSubMenuType = subMenuType;
		if(!$.isEmpty(mSubMenuType)) {
			$(".snb li").removeClass("active");
			$(".snb li[menu-id="+mSubMenuType+"]").addClass("active");
		}

		// 0. 작업 가이드 POPUP을 생성한다.
		$mGuidePopup = $('<div class="pop_simple" id="pop_job_guide"></div>');
		// 1. 작업 가이드를 POP 한다
		$mGuidePopup.appendTo("body");

		bindEventHandler();
		loadMyWorkingJob();
		loadData();
	}
	function bindEventHandler() {
	//	$("div.snb .nav li", $mP).on("click", setNav);
	}
	
	// 좌측 SNB 메뉴 클릭시
//	function setNav() {
//		var $this = $(this);
//		var menu_id = $this.attr("menu-id");
//		if(typeof menu_id === 'undefined') {
//			// home 화면
//			mSubMenuType = "";
//		} else {
//			mSubMenuType = menu_id;
//		}
//		
//		$this.siblings("li").removeClass("active");
//		$this.addClass("active");
//		
//		loadMyWorkingJob();
//		loadData();
//	}
	function loadData() {
		var param = { title: "진행가능 작업", title_eng: "JOB WAITING LIST" };
		param.language = navigator.language || navigator.userLanguage;
		param.projectType = mSubMenuType;
		MindsJS.loadJson(
			requestApi.selectPostingList
			, param
			, function(result) {
				renderPostingList(result.data);
			}
		);
	}
	
	function loadMyWorkingJob() {
		var param = { title: "진행중인 작업", title_eng: "WORKING LIST" };
		param.language = navigator.language || navigator.userLanguage;
		param.filter = "DO";
		param.projectType = mSubMenuType;
		$("ul.myJobList", $mP).paging({
			dataURI: requestApi.selectMyJobList,
			renderCallback: renderMyList,
			param: param,
			pageBlock: 1,
			length: 5,
			pageNav: $("div.paging", $mP),
			viewType: "card"
		});
	}
	
	function loadMyFinishedJob() {
		var param = { title: "완료한 작업", title_eng: "COMPLETE LIST" };
		param.language = navigator.language || navigator.userLanguage;
		param.filter = "CM";
		param.projectType = mSubMenuType;
		$("ul.myJobList", $mP).paging({
			dataURI: requestApi.selectMyJobList,
			renderCallback: renderMyList,
			param: param,
			pageBlock: 1,
			length: 5,
			pageNav: $("div.paging", $mP),
			viewType: "card"
		});
	}
	
	function renderMyList(data) {
		var myCardHtml = "";
		if(data != null && data.length > 0) {
			$("span.myCnt", $mP).html(data.totCount);
			myCardHtml = $.templates("#jobcardTemplate").render(data);
		} else {
			var emptyParam = { message: "작업중인 프로젝트가 없습니다." };
			$("span.myCnt", $mP).html(0);
			myCardHtml = $.templates("#contentsEmptyCardTemplate").render(emptyParam);
		}
		var $cardListTable = $("ul.myJobList", $mP).html(myCardHtml);
		$cardListTable.find("li").on("click", startWorking);
	}
	
	function renderPostingList(data) {
		var myCardHtml = "";
		if(data != null && data.length > 0) {
			$("span.postCtn", $mP).html(data.length);
			myCardHtml = $.templates("#jobcardTemplate").render(data);
		} else {
			$("span.postCtn", $mP).html(0);
			var emptyParam = { message: "작업 가능한 프로젝트가 없습니다." };
			myCardHtml = $.templates("#contentsEmptyCardTemplate").render(emptyParam);
		}
		var $cardListTable = $("ul.postingJobList", $mP).html(myCardHtml);
		$cardListTable.find("li").on("click", getJobGuide);
	}

	function startChecking() {

	}
	
	function startWorking() {
		var $this = $(this);
		var projectId = $this.attr("pjtId");
		var projectType = $this.attr("pjtType");
		var jobType = $this.attr("jobType");
		
		// Assigned 된게 있으면 이동
		var param = {projectId: projectId, jobType: jobType, pagingYn: 'N'};
		MindsJS.loadJson(
			requestApi.selectMyJobList,
			param,
			function(result) {
				if(result.data.length > 0) {
					var mySummary = result.data[0].myJobSummary;
					var totSummary = result.data[0].totJobSummary;
					// 1. 내 진행중인 작업이 있는지 확인 (DO, AS, RJ)
					if(mySummary.request > 0 || mySummary.reRequest > 0 || mySummary.impossible > 0) {
						// assigned 된 검수 작업이 있다면 GO
						moveJobPage(projectId, projectType, jobType);
					}
					else {
						// assigned 된 검수 작업이 없다면 GET
						// 전체 프로젝트에서 가져올 내용이 있는지 확인
						if(totSummary.request > 0 || mySummary.reRequest > 0 || totSummary.impossible > 0) {
							// 2-1. 있다면 CLIP (찜)
							clipProject(projectId, projectType, jobType);
						} else {
							// 2-2. 없다면
							// 3. 대기중인 작업이 없다고 Alert
							if(totSummary.ready <= 0) {
								$.alert("검수 작업이 모두 완료 됐습니다. 다른 프로젝트를 선택해 주세요.");
							} else {
								$.alert("작업자가 작업중입니다. 검수요청이 발생하면 검수 가능합니다.");
							}
						}
					}
					// if(mySummary.request > 0 || mySummary.reRequest > 0 || mySummary.impossible > 0 || mySummary.notUse > 0) {
					// 	$.alert("여기는 조건을 잘 생각해서 다시 작업하자!! 1111");
					//  	// 1-1. 있다면 작업 GO
					// 	moveJobPage(projectId, projectType, jobType);
					// } else {
					//  	// 1-2. 없다면
					//  	// 2. 전체 프로젝트에서 가져올 내용이 있는지 확인
					// 	$.alert("여기는 조건을 잘 생각해서 다시 작업하자!! 22222");
					//  	// if(totSummary.request > 0 || totSummary.impossible > 0 || totSummary.notUse > 0) {
					//  	// 	// 2-1. 있다면 CLIP (찜)
					//  	// 	clipProject(projectId, projectType, jobType);
					//  	// } else {
					//  	// 	// 2-2. 없다면
					//  	// 	// 3. 검수 대기중 이라고 Alert
					//  	// 	if(totSummary.assigned > 0) {
					//  	// 		$.alert("작업자가 작업중입니다. 검수요청이 발생하면 검수 가능합니다.");
					//  	// 	} else {
					//  	// 		$.alert("검수 작업이 모두 완료 됐습니다. 다른 프로젝트를 선택해 주세요.");
					//  	// 	}
					//  	// }
					// }
				} else {
					// 조회가 안된 것과 매한가지
					$.alert("잘못 된 프로젝트 정보입니다.");
				}
			}
		);
	}

	function getJobGuide() {
		var $this = $(this);
		var jobInfo = {
			projectId: $this.attr("pjtId")
			,projectType: $this.attr("pjtType")
			,jobType: $this.attr("jobType")
		};
		MindsJS.loadJson(
			requestApi.loadGuideDocContents
			,jobInfo
			,function(result) {
				popupGuide(jobInfo, result.data);
			}
		);
	}

	function clipNewJobInProject(data) {
		// 찜하고
		clipProject(data.projectId, data.projectType, data.jobType);
	}

	function popupGuide(jobInfo, data) {
		clipNewJobInProject(jobInfo);
		// if(data == null) {
		// 	// 가이드가 없는 경우
		// 	// 팝업 띄우지 않고 이후 행동
		// 	// 바로 작업으로 이동 하던지, 가이드 없다고 오류를 띄울지
		// 	clipNewJobInProject(jobInfo);
		// } else {
		// 	if (data.docType == 'H') {
		// 		// Document Type 이 HTML(H)이면 화면에 HTML을 표시
		// 		if(data.guideContentsVoList != null && data.guideContentsVoList.length > 0) {
		// 			var firstGuide = data.guideContentsVoList[0];
		// 			firstGuide.projectId = data.projectId;
		// 			firstGuide.docType = data.docType;
		// 			var guideHtml = $.templates("#jobGuideTemplate").render(firstGuide);
		// 			var $guideDialog = $mGuidePopup.html(guideHtml);
		// 			$guideDialog.show();
		//
		// 			// 2-1. 작업 가이드에서 start 를 누르면
		// 			$guideDialog.find("em.fa-check").on("click", function () {
		// 				clipNewJobInProject(jobInfo);
		// 			});
		// 			// 2-2. 작업 가이드에서 Back 을 누르면
		// 			$guideDialog.find("em.fa-times").on("click", function () {
		// 				$guideDialog.hide();
		// 			});
		// 		} else {
		// 			// 실제 가이드 문서가 없는 경우
		// 			//clipNewJobInProject(data);
		// 		}
		// 	} else {
		// 		// Document Type 이 AttachFile(A) 이면
		// 		// 다운로드 할 수 있는 팝업을 지원하고
		// 		// 수락 팝업을 한번 더 띄운다.
		// 	}
		// }
	}
	
	function clipProject(projectId, pjtType, jobType) {
		var param = {projectId : projectId, jobType: jobType, pjtType:pjtType};
		MindsJS.loadJson(requestApi.clipProject 
			, param
			, function(result) {

				if(result.success) {
					// 프로젝트 CLIP 성공
					moveJobPage(projectId, pjtType, jobType);
				} else {
					// 프로젝트 CLIP 실패
					$.alert("작업이 모두 완료 됐습니다. 다른 프로젝트를 선택해 주세요.");
				}
			}
		);
	}
	function moveJobPage(projectId, pjtType, jobType) {
		if(projectId == null || projectId == 'undefined') {
			// alert 필요
			return;
		}
		if(pjtType == null || pjtType == 'undefined') {
			// alert 필요
			return;
		}
		if(jobType != null) {
			var param = { jobType: jobType };
			MindsJS.movePage("/biz/"+pjtType+"/"+projectId+"/projectDetail.do", param);
		} else {
			MindsJS.movePage("/biz/"+pjtType+"/"+projectId+"/projectDetail.do");
		}
	}
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();