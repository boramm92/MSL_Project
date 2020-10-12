// for worker
var modalJobSelectViewScript = (function() {
	var $mSelPopup;
	var mProjectInfo = {};
	var callbackParent = null;
	
	var requestApi = {
		checkJobTypeInProject: ""
	};
	
	function showModal(data, callback) {
		callbackParent = callback;
        
		$mSelPopup = $("div.jobType_modal");
		bindEventHandler();
		
		loadData(data);
	}
	
	function bindEventHandler() {
		$("button.close", $mSelPopup).on("click", function() { $mSelPopup.hide(); });
	}
	
	function loadData(data) {
		rendingDetail(data);
		$mSelPopup.show();
	}
	
	function rendingDetail(data) {
		var detailHtml = $.templates("#jobTypeBtnTemplate").render(data);
		var $availabeJobBtns = $("tbody.tbody_jobType", $mSelPopup).html(detailHtml);
		$availabeJobBtns.find("button").on("click", function() {
			var param = {
				projectId: data.prjid
				, pjtType: data.prjType
				, jobType: $(this).attr("data-type")
			};
			eval(callbackParent)(param);
			close();
		});
	}
	
	function close() {
		$(".close", $mSelPopup).click();
	}
	
	// PUBLIC FUNCTION
	return {
		showModal: showModal
	}
})();
$(function() {
	//MindsJS.init();
});