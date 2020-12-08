var registNewViewScript4Oper =  (function() {
	var $mP;
	var mProjectInfo = {};
	var mGuideDocInfo;
	var mSelectedDocInfo;
	var mProjectDepth;

	var MAX_ADD_DEPTH = 5;

	var mLastChooseRelJobMap = new Map();

	var requestCodes = {
		selectPjtTypeList: "/oper/codeutil/selectProjectTypeList.json",
		selectJobTypeList: "/oper/codeutil/selectJobTypeList.json",
		getCategoryList: "/oper/codeutil/selectCode.json",
		getSubCategoryList: "/oper/codeutil/selectSubCategoryList.json",
		getClientCodeList: "/oper/client/selectClientCode.json",
		selectPjtCategoryList: "/oper/codeutil/selectPjtCategoryList.json"
	}
	var requestApi = {
		selectProjectList: "/oper/project/selectProjectList.json",
		goDashboard: "/oper/project/projectList.do",

		getGuideDocument: "/oper/guide/getGuideDocumentContents.json",
		registGuideDocument: "/oper/guide/registGuideDocument.json",
		uploadGuideDocument: "/oper/guide/registGuideDocument.json",

		selectPjtTypeList: requestCodes.selectPjtTypeList,
		selectJobTypeList: requestCodes.selectJobTypeList,
		getCategoryList: requestCodes.getCategoryList,
		getSubCategoryList: requestCodes.getSubCategoryList,
		getClientCodeList: requestCodes.getClientCodeList,
		selectProjectCategoryList : requestCodes.selectPjtCategoryList,

		registNewProject: "/oper/project/registNewProject.json"
	};


	function init(projectId) {
		$mP = $("div#container");
		$(".page_loading").hide();
		mProjectDepth = 1;

		bindEventHandler();
		setMainProjectType();
		selectClientCodeList();
	}
	function bindEventHandler() {
		$("button.btnRegist", $mP).on("click", registProject);
		$("button.btnBack", $mP).on("click", function() {
			history.back();
		})
	}
	function setMainProjectType() {
		selectProjectTypeList();
	}

	// 프로젝트 타입을 가져온다.
	function selectProjectTypeList(prevJobType) {
		// function selectProjectTypeList(isMain) {
		if(mProjectDepth > MAX_ADD_DEPTH) {
			return;
		}
		// 연계 프로젝트가 있으면 다음 프로젝트 지정 가능
		MindsJS.loadJson(
			requestApi.selectPjtTypeList,
			{jobTypeCode: prevJobType},
			function(result) {
				var data = { jobTypeCode: prevJobType, typeList: result.data, depth: mProjectDepth };
				var $contSelect = $("div.cont_select").append($.templates("#projectSelectorTemplate").render(data));
				$contSelect.find("select").off("change").on("change", changeSelectBoxEventHandler);
				mProjectDepth++;
			}
		);
	}
	// 프로젝트 타입에 해당하는 세부 작업 타입을 가져온다.
	function selectJobTypeList(pjtType, parents) {
		var param = { pjtType : pjtType };
		if(parents.attr("depth") > 1) {
			param.jobTypeCode = $("select.sel_detail[depth="+(parents.attr("depth")*1-1)+"]").val();
		}
		MindsJS.loadJson(
			requestApi.selectJobTypeList,
			param,
			function(result) {
				result.data.forEach(function(v, i) {
					mLastChooseRelJobMap.set(v.code, v.subCodeList);
				});
				var html = $.templates("#selectCategoryOptionTemplate").render(result);
				var $jobTypeButtons = parents.parents(".select_group:first").find("select.sel_detail").html(html);
			}
		);
	}
	// 세부 작업 타입에 해당하는 프로젝트 카테고리 선택을 위한 목록을 가져온다
	function selectProjectCategory(jobType, parents) {
		MindsJS.loadJson(
			requestApi.selectProjectCategoryList,
			{jobTypeCode: jobType},
			function(result) {
				if(result.success) {
					if(result.data != null) {
						var html = $.templates("#selectCategoryOptionTemplate").render(result);
						var $jobTypeButtons = parents.parents(".select_group:first").find("select.sel_category").html(html);
						parents.parents(".select_group:first").find("select.sel_category").parents("div.select_box:first").css("display", "inline-block");
					} else {
						parents.parents(".select_group:first").find("select.sel_category").parents("div.select_box:first").css("display", "none");
					}
				}
			}
		);
	}

	function changeSelectBoxEventHandler() {
		if(this.className == "sel_upper") {
			var $selectedJob = $(this);
			var thisDepth = $selectedJob.attr("depth");
			if(thisDepth == mProjectDepth-1) {
				selectJobTypeList($selectedJob.val(), $selectedJob);
			} else {
				$.confirm("하위 작업을 초기화 하고 프로젝트 타입을 바꾸겠습니까?",
					function () {
						$("div.select_group", $mP).each(function(){
							var depth = $(this).attr("depth");
							if(depth > thisDepth) {
								$(this).remove();
							}
						});
						selectJobTypeList($selectedJob.val(), $selectedJob);
						mProjectDepth = (thisDepth*1)+1;
					}, null
				);
			}
		}
		if(this.className == "sel_detail") {
			var $selectedJob = $(this);
			var thisDepth = $selectedJob.attr("depth");
			var selectedCode = $selectedJob.find("option:selected").val();

			if(thisDepth == mProjectDepth-1) {
				if(mLastChooseRelJobMap.get(selectedCode) != null && mLastChooseRelJobMap.get(selectedCode).length > 0) {
					selectProjectTypeList($selectedJob.val());
				}
				selectProjectCategory($selectedJob.val(), $selectedJob);
			} else {
				$.confirm("하위 작업을 초기화 하고 프로젝트 타입을 바꾸겠습니까?",
					function () {
						$("div.select_group", $mP).each(function(){
							var depth = $(this).attr("depth");
							if(depth > thisDepth) {
								$(this).remove();
								mProjectDepth--;
							}
						});
						if(mLastChooseRelJobMap.get(selectedCode) != null && mLastChooseRelJobMap.get(selectedCode).length > 0) {
							selectProjectTypeList($selectedJob.val());
						}
						selectProjectCategory($selectedJob.val(), $selectedJob);
					}, null
				);
			}
		}
	}

	// 고객사 목록을 가져온다.
	function selectClientCodeList() {
		MindsJS.loadJson(
			requestApi.getClientCodeList,
			null,
			function(result) {
				if(result.success) {
					var html = $.templates("#selectOptionOnlyTemplate").render(result.data);
					$("select[name=clientId]", $mP).append(html);
				} else {
				}
			}
		);
	}

	function maxLengthCheck(object){
		if (object.value.length > object.maxLength){
			object.value = object.value.slice(0, object.maxLength);
		}
	}

	function registProject() {
		var param = $("form[name=projectRegistForm]", $mP).formJson();
		// project type, job type 가져와서 setting 필요
		param.projectType = $("select.sel_upper[depth=1]", $mP).val();
		param.jobType = $("select.sel_detail[depth=1]", $mP).val();
		param.projectCtg = $("select.sel_category[depth=1]", $mP).val();

		// param.projectType = $("select.sel_upper", $mP).formJson();//$("select.sel_upper", $mP).val();
		// param.jobType = $("select.sel_detail", $mP).formJson();
		// param.projectCtg = $("select.sel_category", $mP).formJson();
		// //
		// console.log(param);

		if(validateParam(param)) {
			// 충족
			MindsJS.loadJson(
				requestApi.registNewProject,
				param,
				function(result) {
					if(result.success) {
						var data = result.data;
						MindsJS.replacePage(data.REDIRECT);
					} else {
						$.alert("프로젝트 등록에 실패했습니다.", function() {
							init();
						});
					}
				}
			);
		}
		// 작업 등록할 때 projectCtg,
	}

	function validateParam(param) {
		var inputList = [];
		var rtn = true;

		$("input", $mP).css("background-color", "#fff");
		$("select", $mP).css("background-color", "#fff");
		if(param.projectNm == null || param.projectNm.length <=0) {
			rtn = false;
			inputList.push($("input[name=projectNm]", $mP));
		}
		if(param.projectType == null || param.projectType.length <=0) {
			rtn = false;
			inputList.push($("select[name=projectType]", $mP));
		}
		if(param.jobType == null || param.jobType.length <=0) {
			rtn = false;
			inputList.push($("select[name=jobType]", $mP));
		}
		if(param.clientId == null || param.clientId.length <=0) {
			rtn = false;
			inputList.push($("select[name=clientId]", $mP));
		}
		if(param.startDate == null || param.startDate.length <=0) {
			rtn = false;
			inputList.push($("input[name=startDate]", $mP));
		}
		if(param.endDate == null || param.endDate.length <=0) {
			rtn = false;
			inputList.push($("input[name=endDate]", $mP));
		}
		if(param.benefitPoint == null || param.benefitPoint.length <=0) {
			rtn = false;
			inputList.push($("input[name=benefitPoint]", $mP));
		}
		if(!rtn) {
			$.alert("필수 입력 및 형식을 확인해 주세요.", function() {
				var checkFocus = false;
				for(var i in inputList) {
					var $this = inputList[i];
					if(!checkFocus && $this.hasClass("param")) {
						$this.focus();
						checkFocus = true;
					}
					$this.css("background-color", "#ffeded");
				}
			});
		}
		return rtn;
	}

	return {
		init: init,
		maxLengthCheck: maxLengthCheck
	}
})();