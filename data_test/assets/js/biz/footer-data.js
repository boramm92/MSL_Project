var footerViewScript = (function() {
	var $mP;
	var termContents = {};

	var requestApi = {
		getTermContent : "/term/getTermContent.json"
	};

	function init() {
		$mP = $("div#footer");
		loadTerm();
		bindEventHandler();
	}
	function bindEventHandler() {
		$("a.popupTerm, a.footer_terms", $mP).on("click", popTerm);
		$("a.popupPrivacy, a.footer_conditions", $mP).on("click", popupPrivacy);
	}
	function loadTerm() {
		MindsJS.loadJson(
			requestApi.getTermContent, null, function(result) {
				if(result.success) {
					var data = result.data;
					if(data != null) {
						data.forEach(function (v, i) {
							if (v.contentType == 'P') {
								termContents.privacy = v.content;
								termContents.pTitle = "개인정보 처리방침";
								termContents.pVer = v.version;
							} else if (v.contentType == 'T') {
								termContents.term = v.content;
								termContents.tTitle = "이용약관";
								termContents.tVer = v.version;
							}
						});
					}
				}
			}
		);
	}
	function popTerm() {
		var data = { title : termContents.tTitle, contents : termContents.term };
		var $popup = $($.templates("#popupTermTemplate").render(data));
		$popup.appendTo("body").show().find(".ico_close").on("click", function() {
			$popup.drop();
		});
	}
	function popupPrivacy() {
		var data = { title : termContents.pTitle, contents : termContents.privacy };
		var $popup = $($.templates("#popupTermTemplate").render(data));
		$popup.appendTo("body").show().find(".ico_close").on("click", function() {
			$popup.drop();
		});
	}
	return {
		init: init
	}
})();