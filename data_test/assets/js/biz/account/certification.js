var certificationScript = (function() {
	var $mP;
	var mRtnCode;

	var requestApi = {
		certResult: "/account/mobile/cert_result.json"
	};

	function init(param) {
		$mP = $("div.certResult");

		mRtnCode = false;
		bindEventHandler();

		certification(param);
	}

	function bindEventHandler() {
	}

	function certification(param) {
		MindsJS.loadJson(
			requestApi.certResult
			,param
			,function(result) {
				if(result.success) {
					// success
					// 현재 창 닫고 부모창에 이벤트 전달
					mRtnCode = true;
					var htmlResult = $.templates("#cert_confirm").render(param);
					var $genUI = $mP.html(htmlResult);
					$genUI.find("button.btnClose").on("click", function() {
						// 부모창 새로고치기
						if(opener != null) {
							if(param.code == 'ba') {
								opener.parent.pointViewScript.resultForMobileCert();
							}
							else if(param.code == 'ja') {
								opener.parent.joinViewScript.mobileResult(param);
							}
							else {
								opener.parent.location.reload();
							}
						}
						window.close();
					});
				} else {
					// fault
					console.log("휴대폰 인증에 실패했습니다.");
				}
			}
		);
	}

	// PUBLIC FUNCTION
	return {
		init: init
	}
})();