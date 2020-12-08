var imageCollectViewScript4Oper = (function() {
	// 	프로젝트 기본정보는 mProjectInfo 객체에서 전역으로 사용한다.
	var $mP;
	var nTopicMax = 5;
	var mParamRemoveList = [];
	
	var requestApi = {
		selectProjectList: "/oper/project/selectProjectList.json",
		goDashboard: "/oper/project/projectList.do"
	};
	var mProjectInfo = {}; 
	
	function init(projectId) {
		var param = {};
		param.projectId = projectId;
		MindsJS.loadJson(
			requestApi.selectProjectList,
			param,
			function(result) {
				if(result.success) {
					if(result.data != null && result.data.length > 0) {
						mProjectInfo = result.data[0];
						
						$mP = $("div.container");
						bindEventHandler();
						loadData();
						
						$(".page_loading").addClass("pageldg_hide").delay(300).queue(function() {
							$(this).remove();
						});

						$("input[name=findFile]", $mP).findFile({
							filelist : $(".showUploadBox", $mP)		// 업로드한 파일을 표시해줄 오브젝트
						});
					} else {
						$.alert("프로젝트를 불러오지 못했습니다.", function() {
							MindsJS.movePage(requestApi.goDashboard);
						});
						return;
					}
				} else {
					$.alert("프로젝트를 불러오지 못했습니다.", function() {
						MindsJS.movePage(requestApi.goDashboard);
					});
					return;
				}
			}	
		);
	}
	function bindEventHandler() {
		$("button.btnSave", $mP).on("click", saveData);					// 상세내용 수정
		$("button.btnPost", $mP).on("click", postProject);				// 프로젝트 게시
		$("button.btnCancel", $mP).on("click", stopProject);			// 프로젝트 종료
		$("button.btnPause", $mP).on("click", pauseProject);			// 프로젝트 일시정지
		$("button.btnBack", $mP).on("click", moveProjectListPage);		// 목록으로
		$("button.btnAddBlankTopic", $mP).on("click", addEmptyTopic);	// 빈 토픽입력폼 추가 (+)
		$("button.btnRegistTopic", $mP).on("click", registTopic);		// 토픽 저장
	}
	
	function loadData() {
		getProjectDetailInfo();
		selectTopicList();
	}
	
	function getProjectDetailInfo() {
		// 프로젝트가 게시중이면 내용을 변경할 수 없음
		var currStatus = mProjectInfo.status;
		if(currStatus == 'RDY' || currStatus == 'REQ' || currStatus == 'EGH' || currStatus == 'EXP') {
			$("form[name=form-project]", $mP).find("input").attr("readonly", true);
		} else {
			$("form[name=form-project]", $mP).find("input").removeAttr("readonly");
		}
	}
	
	function selectTopicList() {
		var param =  {projectId: mProjectInfo.projectId};
		mParamRemoveList = [];		// 삭제 리스트 초기화
		MindsJS.loadJson(
			"/oper/image/selectTopicList.json",
			param,
			function(result) {
				//var data = result.data;
				if(result.success) {
					var data = result.data;
					if(data != null && data.length > 0) {
						renderTopic(data);
						
						// 추가 입력란
						if(mProjectInfo.status == "CRE" || mProjectInfo.status == "RPA") {
							var rowCount = $("tbody.tbodyTheme", $mP).find("tr.topic").length;
							if(rowCount < nTopicMax) {
								addEmptyTopic();
							}
						}
					} else {
						//addEmptyTopic();
					}
				} else {
					$.alert("등록된 TOPIC 목록을 가져올 수 없습니다.");
				}
			}	
		);
	}
	
	// 저장
	function saveData() {
		var param =  $("form[name=form-project]", $mP).formJson();
		ImageJS.saveProjectInfo(param);
	}
	
	// 프로젝트 게시
	function postProject() {
		// 수정된 내용은 저장하지 않고 게시만 할 경우
		//var param =  {projectId: "${pjtInfo.projectId}"};
		// 수정된 내용까지 저장하면서 게시할 경우
		var param =  $("form[name=form-project]", $mP).formJson();	
		ImageJS.postProject(param, moveProjectListPage);
	}
	
	// 프로젝트 일시정지
	function pauseProject() {
		var param =  {projectId: mProjectInfo.projectId};
		ImageJS.pauseProject(param);
	}
	
	// 프로젝트 취소
	function stopProject() {
		var param =  {projectId: mProjectInfo.projectId};
		ImageJS.stopProject(param, moveProjectListPage);
	}
	
	// 이미지 수집 테마 등록
	function registTopic() {
		var param = $("form[name=form-topic]", $mP).formJson();
		
		param.projectId = mProjectInfo.projectId;
		param.pjtType = mProjectInfo.pjtType;
		param.jobType = mProjectInfo.jobType;
		param.benefitPoint = mProjectInfo.benefitPoint;
		param.removeTopic = mParamRemoveList;
		
		MindsJS.loadJson(
			"/oper/image/registTopicList.json",
			param,
			function(result) {
				if(result.success) {
					selectTopicList();
					$.alert("TOPIC 목록이 저장 됐습니다.", null, "확인");
				} else {
					$.alert("등록된 TOPIC 목록을 가져올 수 없습니다.");
				}
			}	
		);
	}
	
	//** UTILS **//
	function moveProjectListPage() {
		MindsJS.movePage("/oper/project/projectList.do");
	}
	
	function renderTopic(data) {
		data.status = mProjectInfo.status;
		// 목록 불러오기 전 초기화
		$("tbody.tbodyTheme", $mP).html("");
		var html = $.templates("#collectionThemeTemplate").render(data);
		var $topicBody = $("tbody.tbodyTheme", $mP).append(html);
		$topicBody.find("tr button").off("click").on("click", removeTopic);
	}
	function addEmptyTopic() {
		var rowCount = $("tbody.tbodyTheme", $mP).find("tr.topic").length;
		if(rowCount < nTopicMax) {
			var data = { status: mProjectInfo.status };
			var html = $.templates("#collectionThemeTemplate").render(data);
			var $topicBody = $("tbody.tbodyTheme", $mP).append(html);
			$topicBody.find("tr button").off("click").on("click", removeTopic);
		} else {
			$.alert("Topic 최대개수는 " + nTopicMax + "개 입니다.");
		}
	}
	function removeTopic() {
		var $parent = $(this).parents("tr:first").remove();
		// 기존 등록 목록에 포함됐다면
		if($parent.find("input[name=contextId]").val() != "") {
			// 삭제 목록에 등록
			mParamRemoveList.push($parent.find("input[name=contextId]").val());
		} else {
			// ui만 삭제
			$parent.remove();
		}
	}
	
	return {
		init: init
	}
})();