var TextJS = (function() {
	function init() {
	}
	
	function selectUploadFileList(param, callback) {
		if(param == null || param.projectId == null) {
			return false;
		}
		MindsJS.loadJson(
			"/oper/text/selectFileList.json",
			param,
			function(result) {
				//var data = result.data;
				if(result.success) {
					if(typeof callback === 'function') {
						callback(result);
					}
				} else {
					$.alert("업로드 파일 목록을 가져올 수 없습니다.");
				}
			}	
		);
	}
	
	function jobFileUpload(param, filesElement, callback) {
		if(param == null || param.projectId == null) {
			return false;
		}
		if(filesElement == null || callback == null) {
			return false;
		}
		$.confirm(
			"파일을 업로드 하면 JOB이 생성됩니다. 파일을 업로드 하시겠습니까?"
			, function() {
				filesElement.uploadFile({
					uri : "/oper/text/fileUpload.json",
					callback : callback,
					projectType : "T",
					showBodyObj : null,
					param : param
				});
			}
			, null
			, "JOB 생성"
		);
	}

	function saveProjectInfo(param) {
		if(param == null || param.projectId == null) {
			return false;
		}
		MindsJS.loadJson(
			"/oper/project/updateProjectInfo.json",
			param,
			function(result) {
				if(result.success) {
					$.alert(
						"수정됐습니다."
					);
				} else {
				}
			}	
		);
	}
	
	function postProject(param, moveNextPage) {
		if(param == null || param.projectId == null) {
			return false;
		}
		$.confirm(
			"프로젝트를 게시하면, 사용자에게 프로젝트가 노출됩니다.<br>"
			+"게시하시겠습니까?"
			, function() {
				MindsJS.loadJson(
					"/oper/project/postingProject.json",
					param,
					function(result) {
						//var data = result.data;
						if(result.success) {
							$.alert(
								"프로젝트가 게시됐습니다."
								, function() {
									if(typeof moveNextPage === 'function') {
										moveNextPage();
									}
								}
							);
						} else {
						}
					}	
				);
			}
			, null
			, "프로젝트 게시"
		);
	}
	
	function pauseProject(param, moveNextPage) {
		if(param == null || param.projectId == null) {
			return false;
		}
		$.confirm(
			"프로젝트를 일시정지하면, 사용자에게 노출되지 않습니다.<br>"
			+"이미 배정된 JOB이 있다면 일시정지를 할 수 없습니다.<br>"
			+"프로젝트를 일시정지 하시겠습니까?"
			, function() {
				MindsJS.loadJson(
					"/oper/project/pauseProject.json",
					param,
					function(result) {
						//var data = result.data;
						if(result.success) {
							$.alert(
								"프로젝트가 일시정지 됐습니다."
								, function() {
									if(typeof moveNextPage === 'function') {
										moveNextPage();
									}
								}
							);
						} else {
						}
					}	
				);
			}
			, null
			, "프로젝트 일시정지"
		);
	}
	
	function stopProject(param, moveNextPage) {
		if(param == null || param.projectId == null) {
			return false;
		}
		$.confirm(
			"데이터 수집을 중지하고 프로젝트를 종료 하시겠습니까?"
			, function() {
				MindsJS.loadJson(
					"/oper/project/stopProject.json",
					param,
					function(result) {
						//var data = result.data;
						if(result.success) {
							$.alert(
								"프로젝트가 일시정지 됐습니다."
								, function() {
									if(typeof moveNextPage === 'function') {
										moveNextPage();
									}
								}
							);
						} else {
						}
					}	
				);
			}
			, null
			, "프로젝트 일시정지"
		);
	}
	
	return {
		init: init,
		selectUploadFileList: selectUploadFileList,
		saveProjectInfo: saveProjectInfo,
		postProject: postProject,
		pauseProject: pauseProject,
		stopProject: stopProject,
		jobFileUpload: jobFileUpload
	}
})();