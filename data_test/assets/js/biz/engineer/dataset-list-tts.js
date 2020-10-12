var datasetViewerScript = (function() {
	var $mP;
	var mSelectedCategory;

	var requestApi = {
		getCategory: "/dataset/getDatasetTTSCategoryList.json",
		selectDataSet: "/dataset/selectDataSetList.json",
		contentDownload : "/dataset/contentDownload.json"
	};

	function init() {
		//$mP = $("div.container");
		$mP = $("div#wrap");
		mSelectedCategory = "";

		bindEventHandler();
		searchCondition();
		getCategory();
	}

	function bindEventHandler() {
		$("button.btnSearch", $mP).on("click", function() {
			searchCondition();
		});
		/*$("button.btnNoCond", $mP).on("click", function() {
			$("input[name=searchText]", $mP).val("");
			searchCondition("");
		});*/
		$("input[name=searchText]", $mP).on("keyup", function(e) {
			if(e.keyCode === 27 || e.keyCode === 13) {
				// return key
				$("button.btnSearch", $mP).click();
				e.preventDefault();
			}
		});
	}

	function getCategory() {
		MindsJS.loadJson(
			requestApi.getCategory
			,null
			, function(result){
				var data = result.data;

				var categoryHtml = $.templates("#categoryCardTemplate").render(data);
				var $categoryCard = $("ul.ai-category-list", $mP).html(categoryHtml);
				$categoryCard.find("li").on("click", function() {
					var $this = $(this);
					// set category
					searchCondition($this.attr("type"));
				});
				$categoryCard.find("p.title").on("click", function() {
					var $this = $(this).parents("li:first");
					// set category
					searchCondition($this.attr("type"));
				});
				$categoryCard.find("a").on("click", function(event) {
					var $this = $(this);
					searchCondition(null, $this.attr("code"));
					event.stopPropagation();
				});
			}
		);
	}

	function searchCondition(category, engine) {
		var searchText = $("input[name=searchText]", $mP).val();
		// category = category == null ? mSelectedCategory : category;
		mSelectedCategory = category;
		if(!$.isEmpty(searchText))	{
			searchText = searchText.trim();
			selectDatasetList(mSelectedCategory, searchText, engine);
		} else {
			selectDatasetList(mSelectedCategory, searchText, engine);
		}
	}

	function selectDatasetList(category, searchText, engine) {
		var param = {};
		if(category != null) {
			param.category = category;
		}
		if(searchText != null && searchText.length > 0) {
			param.searchText = searchText;
		}
		//if(category != null) {
			param.egType = engine;
		//}
		$("div#datasetList", $mP).paging({
			dataURI: requestApi.selectDataSet
			,renderCallback: renderMyList
			,param: param
			,pageBlock: 1
			,length: 10
			,pageNav: $("div.datasetPagingBox", $mP)
			,viewType: "card"
		});
	}

	var datasetMap = new Map();

	function renderMyList(data) {
		var datasetHtml = "";

		if(!$.isEmpty(data)) {
			data.forEach(function(v, i) {
				datasetMap.set(data[i].dataDetail.detailId, data[i]);
			});
			datasetHtml = $.templates("#datasetListTemplate").render(data);
			var $dataSetList = $("tbody#datasetList", $mP).html(datasetHtml);
			$dataSetList.find("tr").on("click", function() {
				var $this = $(this);

				var param = datasetMap.get($this.find("input[name=detailId]").val());
				var popupHtml = $.templates("#datasetDetailPopupTemplate").render(param);
				var $popup = $("div.popup_wrapper").html(popupHtml);
				$popup.find("div.pop_simple.dataset_pop").fadeIn();
				$popup.find(".ico_close").on("click", function() {
					$(this).parents("div.pop_simple.dataset_pop").remove();
				});
				$popup.find("button.download").on("click", function() {
					confirmDownload($this.find("input[name=detailId]").val());
				});
			});
		} else {
			var emptyParam = { colspan: 5, message: "No DataSet." };
			datasetHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);
			var $dataSetList = $("tbody#datasetList", $mP).html(datasetHtml);
		}
	}

	// download
	function confirmDownload(detailId) {
		var $thisBtn = $(this);
		$.confirm("Do you want to download?", function() {
			var $tr = $thisBtn.parents("tr:first");
			/*var param = {
				projectId : mProjectInfo.projectId
				, workId : $tr.find(".workId").attr("workId")
				, contextId : $tr.attr("ctnId")
				, jobType: $tr.find(".jobType").attr("jobType")
			};*/
			var param = {
				detailId : detailId
			}
			MindsJS.movePage(
				requestApi.contentDownload,
				param
			);
		}, null, "Download", "Yes", "No");
	}
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();