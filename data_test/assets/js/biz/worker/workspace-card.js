var projectListCardViewScript = (function() {
	var $mP;
	var mSubMenuType;
	var $mGuidePopup;
	
	var requestApi = {
		selectPostingList: 	"/wspace/selectPostingList.json"
		,selectMyJobList: 	"/wspace/selectMyJobList.json"
		,getAndStartProject: "/work/getAndStartProject.json"
		,clipProject:		"/work/clipProjectIntoMyWorkList.json"
		//,getProjectState: 	"/wspace/getProjectState.json"
		,loadGuideDocContents : "/guide/getGuideDocumentContents.json"
	};
	
	function init(subMenuType) {
		$mP = $("div.container");
		mSubMenuType = subMenuType;
		if(!$.isEmpty(mSubMenuType)) {
			$(".snb li").removeClass("active");
			$(".snb li[menu-id="+mSubMenuType+"]").addClass("active");
		}

		bindEventHandler();
		loadMyWorkingJob();
		//loadMyFinishedJob();
		loadData();
	}
	function bindEventHandler() {
		$('.m_tab_btn > li').on('click', selectWorktype);
	}

	function selectWorktype() {
		var target = $(this);
		var index = target.index();

		$('.m_tab_btn > li').removeClass('active');
		target.addClass('active');
		$('.content > .work_space').css('display','none');
		$('.content > .work_space').eq(index).css('display','block');
	}

	function loadData() {
		var param = { title: "진행가능 작업", title_eng: "JOB WAITING LIST" };
		param.language = navigator.language || navigator.userLanguage;
		param.projectType = mSubMenuType;
		MindsJS.loadJson(
			requestApi.selectPostingList, param, function(result) { renderPostingList(result.data); }
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
					if(mySummary.doing > 0 || mySummary.assigned > 0 || mySummary.reject > 0) {
						// 1-1. 있다면 작업 GO
						moveJobPage(projectId, projectType, jobType);
					} else {
						// 1-2. 없다면
						// 2. 전체 프로젝트에서 가져올 내용이 있는지 확인
						if(totSummary.ready > 0) {
							// 2-1. 있다면 CLIP (찜)
							clipProject(projectId, projectType, jobType);
						} else {
							// 2-2. 없다면
							// 3. 검수 대기중 이라고 Alert
							if(mySummary.request > 0) {
								$.alert("검수 대기중입니다. 검수가 완료되면 완료된 목록에서 확인 가능합니다.");
							} else {
								$.alert("작업이 모두 완료 됐습니다. 다른 프로젝트를 선택해 주세요.");
							}							
						}
					}
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
		if(data == null) {
			// 가이드가 없는 경우
			// 팝업 띄우지 않고 이후 행동
			// 바로 작업으로 이동 하던지, 가이드 없다고 오류를 띄울지
			clipNewJobInProject(jobInfo);
		} else {
			if (data.docType == 'H') {
				// 0. 작업 가이드 POPUP을 생성한다.
				$mGuidePopup = $('<div class="pop_simple pop_custom" id="pop_work_guide" style="z-index:1020"></div>');
				// 1. 작업 가이드를 POP 한다
				$mGuidePopup.appendTo("body");
				// Document Type 이 HTML(H)이면 화면에 HTML을 표시
				if(data.guideContentsVoList != null && data.guideContentsVoList.length > 0) {
					var firstGuide = data.guideContentsVoList[0];
					firstGuide.projectId = data.projectId;
					firstGuide.docType = data.docType;
					var guideHtml = $.templates("#jobGuideTemplate").render(firstGuide);
					var $guideDialog = $mGuidePopup.html(guideHtml);
					$guideDialog.show();

					// 2-1. 작업 가이드에서 start 를 누르면
					$guideDialog.find(".btnStart").on("click", function () {
						if($guideDialog.find("input#work_guide_chk").eq(0).is(":checked")) {
							$guideDialog.remove();
							clipNewJobInProject(data);
						} else {
							// $guideDialog.find("input#work_guide_chk").siblings("label").css("font-style", "bold");
							$.alert("이용가이드 확인과 데이터소유권에 대한 동의를 체크해 주세요.");
						}
					});
					// 2-2. 작업 가이드에서 Back 을 누르면
					$guideDialog.find(".btnClose").on("click", function () {
						$guideDialog.remove();
					});
					$guideDialog.find(".ico_close").on("click", function() {
						$guideDialog.remove();
					});
				} else {
					// 실제 가이드 문서가 없는 경우
					//clipNewJobInProject(data);
				}
			} else {
				// Document Type 이 AttachFile(A) 이면
				// 다운로드 할 수 있는 팝업을 지원하고
				// 수락 팝업을 한번 더 띄운다.
			}
		}
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