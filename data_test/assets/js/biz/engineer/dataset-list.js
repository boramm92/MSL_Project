var datasetViewerScript = (function() {
	var $mP;
	var mSelectedCategory;

	var requestApi = {
		getCategory: "/dataset/getCategoryList.json",
		selectDataSet: "/dataset/selectDataSetList.json"
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
				var $categoryCard = $("ul.ai-engine-list", $mP).html(categoryHtml);
				$categoryCard.find("li").on("click", function() {
					var $this = $(this);
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
		if(searchText != null)	searchText = searchText.trim();

		if(category != null) mSelectedCategory = category;
		selectDatasetList(mSelectedCategory, searchText, engine);
	}

	function selectDatasetList(category, searchText, engine) {
		var param = {};
		if(category != null) {
			param.category = category;
		}
		if(searchText != null && searchText.length > 0) {
			param.searchText = searchText;
		}
		if(category != null) {
			param.egType = engine;
		}
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

	function renderMyList(data) {
		var datasetHtml = "";

		if(!$.isEmpty(data)) {
			datasetHtml = $.templates("#datasetListTemplate").render(data);
		} else {
			datasetHtml = $.templates("#emptyProjectTemplate").render();
		}
		var $dataSetList = $("div#datasetList", $mP).html(datasetHtml);
		//$("span.myCnt", $mP).html("10");
	}
	
	// PUBLIC FUNCTION
	return {
		init: init
	}
})();