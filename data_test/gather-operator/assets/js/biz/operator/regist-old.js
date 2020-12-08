var registViewScript4Oper =  (function() {
	var $mP;
	var requestApi = {
		selectPjtTypeList: "/oper/codeutil/selectProjectTypeList.json",
		selectJobTypeList: "/oper/codeutil/selectJobTypeList.json",
		registNewProject: "/oper/project/registNewProject.json",
		getCategoryList: "/oper/codeutil/selectCode.json",
		getSubCategoryList: "/oper/codeutil/selectSubCategoryList.json",
		getClientCodeList: "/oper/client/selectClientCode.json"
	};

	function init() {
		$mP = $("div.container");

		bindEventHandler();
		setCondition();
	}
	function bindEventHandler() {
		$("button.btnRegist", $mP).on("click", requestRegist);
		$("button.btnClear", $mP).on("click", cleanParam);
	}

	function setCondition() {
		selectProjectTypeList();
		//selectCategoryList(); // 미리부터 불러올 필요 없음
		selectClientCodeList();
		$("input[name=projectNm]", $mP).focus();
	}

	// 프로젝트 타입을 가져온다
	function selectProjectTypeList() {
		MindsJS.loadJson(
			requestApi.selectPjtTypeList,
			null,
			function(result) {
				var data = result.data;
				var html = $.templates("#pjtTypeBtn").render(data);
				var $pjtTypeButtons = $("div.pjtType", $mP).html(html);
				$pjtTypeButtons.find("button").on("click", applyProjectType);
			}
		);
	}
	// 프로젝트 타입에 맞는 상세 작업을 가져온다.
	function applyProjectType() {
		// 선택한 프로젝트 타입정보로
		var $this = $(this);
		// 관련된 버튼 색 변경
		$this.siblings("button").removeClass("active");
		$this.addClass("active");

		var pjtType = $this.attr("code");
		var pjtTypeName = $this.text();

		// 프로젝트 타입을 프로젝트 생성 정보에 입력
		$("input[name=projectTypeName]", $mP).val(pjtTypeName);
		$("input[name=projectType]", $mP).val(pjtType);
		$("input[name=jobTypeName]", $mP).val("");
		$("input[name=jobType]", $mP).val("");

		// 프로젝트 타입으로 상세 작업 타입 목록을 가져온다.
		selectJobTypeList(pjtType);
	}
	function selectJobTypeList(pjtType) {
		var param = { pjtType : pjtType };
		MindsJS.loadJson(
			requestApi.selectJobTypeList,
			param,
			function(result) {
				var data = result.data;
				var html = $.templates("#jobTypeBtn").render(data);
				var $jobTypeButtons = $("div.jobType", $mP).html(html);
				$jobTypeButtons.find("button").on("click", applyJobType);
			}
		);
	}
	function applyJobType() {
		// 선택한 상세 타입정보로
		var $this = $(this);
		// 관련된 버튼 색 변경
		$this.siblings("button").removeClass("active");
		$this.addClass("active");

		var jobType = $this.attr("code");
		var jobTypeName = $this.text();

		if(jobType == 'XD') {	// XDC 일때
			selectCategoryListByWorkType("XDC_W_TYPE");
			$("select[name=projectCtg]", $mP).attr("disabled", false);
		}
		else if(jobType == 'TA' || jobType == 'TQ' || jobType == 'TC') {	// MRC 일때
			selectCategoryListByWorkType("MRC_W_TYPE");
			$("select[name=projectCtg]", $mP).attr("disabled", false);
		}
		else if(jobType == "RS") {	// 녹음일때
			selectCategoryList();
			$("select[name=projectCtg]", $mP).attr("disabled", false);
		}
		else if(jobType == "IC") {	// 음성의도분류 일때
			selectCategoryListByWorkType("CLS_W_TYPE");
			$("select[name=projectCtg]", $mP).attr("disabled", false);
		}
		else if(jobType == "MI") {	// 이미지 지우기
			selectCategoryListByWorkType("MASK_TYPE");
			$("select[name=projectCtg]", $mP).attr("disabled", false);
		}
		else if(jobType == "LR") { // 립리딩
			selectCategoryListByWorkType("AGEN_TYPE");
			$("select[name=projectCtg]", $mP).attr("disabled", false);
		}
		else if(jobType == "MS") { // 문장생성
			selectCategoryListByWorkType("MS_W_TYPE");
			$("select[name=projectCtg]", $mP).attr("disabled", false);
		}
		else {
			$("select[name=projectCtg]", $mP).attr("disabled", true);
		}
		// 프로젝트 타입을 프로젝트 생성 정보에 입력
		$("input[name=jobTypeName]", $mP).val(jobTypeName);
		$("input[name=jobType]", $mP).val(jobType);
	}
	// 프로젝트 카테고리를 가져온다.
	function selectCategoryList() {
		MindsJS.loadJson(
			requestApi.getCategoryList,
			{grpCode:"PJT_CTG"},
			function(result) {
				var html = $.templates("#selectOptionTemplate").render(result);
				$("select[name=projectCtg]", $mP).html(html);
			}
		);
	}
	// 작업 유형별 카테고리를 가져온다
	function selectCategoryListByWorkType(type) {
		var param = {upperGrpCode : type};
		MindsJS.loadJson(
			requestApi.getSubCategoryList,
			param,
			function(result) {
				var html = $.templates("#selectOptionTemplate").render(result);
				$("select[name=projectCtg]", $mP).html(html);
			}
		);
	}
	// 고객사 목록을 가져온다.
	function selectClientCodeList() {
		MindsJS.loadJson(
			requestApi.getClientCodeList,
			null,
			function(result) {
				if(result.success) {
					var html = $.templates("#clientOptTemplate").render(result);
					$("select[name=clientId]", $mP).html(html);
				} else {
				}
			}
		);
	}
	// 프로젝트 생성
	function requestRegist() {
		var param = $("form[name=form-project]", $mP).formJson();
		if(validateBatch(param)) {
			// 충족
			MindsJS.loadJson(
				requestApi.registNewProject,
				param,
				function(result) {
					if(result.success) {
						var data = result.data;
						MindsJS.movePage(data.REDIRECT);
					} else {
						$.alert("프로젝트 등록에 실패했습니다.", function() {
							init();
						});
					}
				}
			);
		} else {
		}
	}

	function validateBatch(param) {
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
			inputList.push($("input[name=projectTypeName]", $mP));
		}
		if(param.jobType == null || param.jobType.length <=0) {
			rtn = false;
			inputList.push($("input[name=jobTypeName]", $mP));
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
		if(param.projectGuide == null || param.projectGuide.length <=0) {
			rtn = false;
			inputList.push($("input[name=projectGuide]", $mP));
		}
		// XDC인 경우 projectCtg 가 필수임
		if(param.jobType == 'XD' && $.isEmpty($("select[name=projectCtg]",$mP).val())) {
			rtn = false;
			inputList.push($("select[name=projectCtg]",$mP));
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

	function cleanParam() {
		$("form[name=form-project]", $mP).find("input.param").val("");
	}

	return {
		init: init
	}
})();
$(function() {
	MindsJS.init();
	registViewScript4Oper.init();
});