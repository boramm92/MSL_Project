// 프로젝트 타입에 맞게 class명 지정
// view 파일(jsp)에서 init할 때 사용하는 클래스 명
var imageSegmentationScriptView = (function() {
	// 프로젝트 공통 관리 객체
	var $mP;		// document object model
	var $Object;	// script object model
	var $UI;		// document ui

	var mContextInfo = { orgFileName : null, atchFile : null, extName : null };		// Main Contents

	var projectType = "P";					// Sound:S, Text:T, Image:P, Video:V
	var defaultJobType = "IS";			 			// xxxJobTypeEnum.java 참고
	var jobClassName = "segmentation";		// 쌍으로 생성할 jsp 파일 id, file name format : audio-{jobClassName}-worker.jsp

	// 전역변수
	var offsetIndex = -1;
	var mCategory = [];
	var mItemIndex = 0;
	var gSelectedWorkType = "Segmentation";
	var gUndoItem = { Segmentation: [], Keypoint: [] };

	// POLYGON 관련 전역변수
	var itemStorage = new Map();
	var polygonTemplate = [];
	var itemTemplate = {
		Segmentation:[]		// polygon1,polygon2,...,polygonN
		,Keypoint:[]		// polygon
		,category_id:'', category_name:'', contextId:null, status:null
	};
	var polygonCount = 0;

	function init() {
		$mP = $("div.contents");
		$Object = $mP.initImageProject({
			projectId: gProjectId,
			projectType: projectType,
			jobType: defaultJobType,
			jobClassName: jobClassName,
			nextCallback: saveResult
		});
		$UI = $mP.regContextUi({
			strokeColor: '#FFCC01',
			checkPoint: generatePolygonAtPoint
		});

		bindEventHandler();
		getCurrentJob();
	}
	function bindEventHandler() {
		// about navi action
		$("button.btnNext", $mP).on("click", saveAndGotoNext);
		$("button.btnIgnore", $mP).on("click", ignoreAndGotoNext);

		// save data
		$("button.btnSave", $mP).on("click", saveWorkData);

		// item control
		$("button.btnAddItem", $mP).on("click", addClothesItem);
		$("button.btnDelItem", $mP).on("click", deleteClothesItem);

		$("button.btnUndo", $mP).on("click", undo);
		$("button.btnRedo", $mP).on("click", redo);
	}
	// 공통 인터페이스 구현 함수
	function goPrevJob() {
	}
	function getCurrentJob() {
		$Object.requestAssignJob(getContext, failCallback);
	}
	function getContext() {
		$Object.getCurrentJobContext(displayContents, failCallback);
	}
	function selectWorkData() {
		$Object.selectData(dataRender, failCallback);
	}
	function clearWorkData() {
		$Object.clearData(clearDisplay, failCallback);
	}
	function saveWorkData() {
		// 임시저장 버튼이 활성화 돼 있을 때만 저장 가능
		if($(this).hasClass("active")) {
			$Object.saveContentForWorkByParameter(
				itemStorage
				, function() {
					emptyTemplateData();
					selectWorkData();
					$.alert("데이터가 임시저장 됐습니다.");
				}
			);
		}
	}
	function saveAndGotoNext() {
		$.confirm(
			"작업을 완료하고 검수요청 하시겠습니까?<br>검수요청이 완료되면 다음파일 작업을 할 수 있습니다."
			, function() {$Object.saveContentForWorkByParameter(itemStorage, $Object.requestInspectForWork);}
			, null
			, "검수요청"
		);
	}
	function ignoreAndGotoNext() {
		$.commentAll(
			"작업불가 사유를 입력하면 작업불가 항목으로 지정됩니다.<br>작업불가 항목으로 지정하시겠습니까?"	// messages
			, function(data) {
				$Object.requestIgnoreForWork(data.comment);
			}					// ok Function
			, null				// cancel Function
			, "작업불가 지정"		// Title
			, "작업불가"				// OK Title
			, "취소"				// Cancel Title
			, [{label:"Comment :", lbl_type:"text", name:"comment", lbl_ph:"작업불가 사유를 입력해 주세요." }]			// label list
		);
	}
	// 작업내용을 저장 한 후에 자동으로 실행할 함수 (변경이 필요하면 함수 내에 구현, 함수명은 변경하지 마세요.)
	function saveResult() {
		$UI.clearUI();
		getCurrentJob();
	}

	///////////////////////////////////// 단독 화면 기능
	$.fn.bindEventItem = function(){
		$(this).find("div.selected_item").off("click").on("click", showCategory);
		$(this).find("button.btn_segment").off("click").on("click", drawSegmentData);
		$(this).find("button.btn_keypoint").off("click").on("click", drawKeyPointData);
		// $(this).find("div.drop_slt_item .radio_box input").off("click").on("click", setCategory);
		$(this).find("div.drop_slt_item .radio_box input").off("click").on("click", function() {
			var $this = $(this);
			var categoryId = $(this).val();
			if(categoryId >= 14) {
				if(!$.isEmptyObject(itemTemplate.Keypoint[0])) {

					var categoryName = $(this).siblings('label').text();
					$.confirm("[" + categoryName + "] 이 카테고리로 변경하면, Keypoint 데이터가 제거됩니다.<br>카테고리를 바꾸시겠습니까?"
						, function() {
							itemTemplate.Keypoint = [];
							$this.parents("tr").find(".keypoint").hide();
							setCategory($this);
						}, null, '경고');
				} else {
					$this.parents("tr").find(".keypoint").hide();
					setCategory($this);
				}
			} else {
				$this.parents("tr").find(".keypoint").css("display", "inline-block");
				setCategory($this);
			}
		});
		$(this).find("input[name=clothes_slt]").off("click").on("click", selectItem);

	};
	function fullTemplateDate() {
		$(".btnSave", $mP).addClass("active");
	}
	function emptyTemplateData() {
		$(".btnSave", $mP).removeClass("active");
	}

	//////////////////////////////// CANVAS 동작
	function generatePolygonAtPoint(point) {
		if($(".btnCanvMove", $mP).hasClass("active")) { return; }
		// 선택된 라디오가 있다면.
		if(!$.isEmptyObject($("input:radio[name=clothes_slt]:checked"))) {
			fullTemplateDate();
			gUndoItem[gSelectedWorkType] = [];
			if($.isEmptyObject(itemTemplate)) {
				itemTemplate = {};
				// itemTemplate[$("ul.tab_title li.on", $mP).attr("name")] = [];
			}
			if($.isEmptyObject(polygonTemplate)) polygonTemplate = [];
			if($.isEmptyObject(itemTemplate[gSelectedWorkType])) {
				itemTemplate[gSelectedWorkType] = [];
			}

			polygonTemplate.push(point.x);
			polygonTemplate.push(point.y);

			var iTemplate = itemTemplate[gSelectedWorkType];
			iTemplate[polygonCount+offsetIndex] = polygonTemplate;

			var offsetKey = $("input:radio[name=clothes_slt]:checked").attr("offset");
			itemStorage.set("_"+offsetKey, itemTemplate);

			// $UI.drawItems(iTemplate);
			if(gSelectedWorkType == 'Keypoint') {
				$UI.drawPointPath(iTemplate);
			} else {
				$UI.drawClosingPath(iTemplate);
			}
		} else {
			$.alert("Items 목록에 아이템을 추가해 주세요.");
		}
	}
	function addClothesItem() {
		var item = {};
		// 카테고리 그리기
		item.categoryHtml = drawCategoryListToHtml(mItemIndex++, "");
		item.itemIndex = mItemIndex;
		item.keypointCount = 0;
		item.segmentCount = 0;

		// item 그리기
		var itemHtml = $.templates("#segment_itemTemplate").render(item);
		var $clotheItem = $("tbody.workInfo", $mP).append(itemHtml);
		$clotheItem.bindEventItem();

		// 신규 아이템 데이터 만들기
		setNewItemData(mItemIndex);

		// Segmentation과 KeyPoint 버튼 활성화 효과 by br
		$('.tbl td button').on('click', function(){
			$('.tbl td button').removeClass('on');
			$(this).addClass('on');
		});

		// 추가 버튼으로 생성된 아이템은 기본으로 선택되게
		// 스크롤을 최신 항목에 맞추기
		$("tbody.workInfo", $mP).parents(".tbl_box:first").scrollTop($("tbody.workInfo", $mP).height());
		// 새로 생성된 것을 선택
		$("tbody.workInfo", $mP).find("tr[offset="+mItemIndex+"]").find("input[type=radio][name=clothes_slt]").click();
		// $("tbody.workInfo", $mP).find("tr[offset="+mItemIndex+"]").find(".btn_segment").click();
	}
	function deleteClothesItem() {
		var chekcedItem = $("tbody.workInfo", $mP).find("input[name=clothes_slt]:checked");
		if (!$.isEmptyObject(chekcedItem)) {
			if(!$.isEmpty(chekcedItem.attr("contextid"))) {
				// 해당 contentsId dB에서 삭제
				// 비동기 callback에서 TR 삭제
				$Object.removeItem(chekcedItem.attr("contextid"), function() {
					itemStorage.delete("_"+chekcedItem.attr("offset"));
				});
				chekcedItem.parents("tr:first").remove();
			} else {
				chekcedItem.parents("tr:first").remove();
				itemStorage.delete("_"+chekcedItem.attr("offset"));
			}
			if(!$.isEmptyObject($("label.clothes_slt", $mP).get(0))) {
				$("label.clothes_slt", $mP).get(0).click();
			} else {
				// $UI.drawItems(null);
				$UI.drawClosingPath(null);
			}
		}
	}
	function undo() {
		var iTemplate = itemTemplate[gSelectedWorkType];

		if(!$.isEmptyObject(iTemplate[polygonCount+offsetIndex])) {
			if(gUndoItem[gSelectedWorkType] == null) gUndoItem[gSelectedWorkType] = [];
			gUndoItem[gSelectedWorkType].push(iTemplate[polygonCount+offsetIndex].pop());
			gUndoItem[gSelectedWorkType].push(iTemplate[polygonCount+offsetIndex].pop());
		}
		// $UI.drawItems(iTemplate);
		if(gSelectedWorkType == 'Keypoint') {
			$UI.drawPointPath(iTemplate);
		} else {
			$UI.drawClosingPath(iTemplate);
		}
	}
	function redo() {
		if(gUndoItem[gSelectedWorkType] != null && gUndoItem[gSelectedWorkType].length > 0) {
			var iTemplate = itemTemplate[gSelectedWorkType];

			iTemplate[polygonCount+offsetIndex].push(gUndoItem[gSelectedWorkType].pop());
			iTemplate[polygonCount+offsetIndex].push(gUndoItem[gSelectedWorkType].pop());

			// $UI.drawItems(iTemplate);
			if(gSelectedWorkType == 'Keypoint') {
				$UI.drawPointPath(iTemplate);
			} else {
				$UI.drawClosingPath(iTemplate);
			}
		}
	}
	function setNewItemData(itemIndex) {
		initTemplateData();
		itemStorage.set("_"+itemIndex, itemTemplate);
		gSelectedWorkType = "Segmentation";
		$UI.setDrawType(gSelectedWorkType);
		// $UI.drawItems(null);
		$UI.drawClosingPath(null);
	}

	//////////////////////////////// ITEM EVENT
	function showCategory() {
		fullTemplateDate();
		var $this = $(this).siblings('.drop_slt_item');
		$this.parents("tr").find("input[name=clothes_slt]").click();

		var selectedItemOffset = $(this).attr("offset");
		$(".drop_slt_item").each(function(i, v) {
			if($(v).siblings(".selected_item").attr("offset") == selectedItemOffset) {
				return;
			}
			if($(v).css("display") == 'block') {
				$(v).hide();
			}
		});
		$(this).siblings('.drop_slt_item').slideDown(200);
	}
	function drawSegmentData() {
		if(gSelectedWorkType == 'Keypoint') {
		} else {
			if($(this).parents("tr:first").find("input:radio[name=clothes_slt]").is(":checked")) {
				appendPolygon();
			}
		}
		gSelectedWorkType = "Segmentation";
		$UI.setDrawType(gSelectedWorkType);
		$(this).parents("tr").find("input[name=clothes_slt]").click();
	}
	function drawKeyPointData() {
		gSelectedWorkType = "Keypoint";
		$UI.setDrawType(gSelectedWorkType);
		$("input:radio[name=clothes_slt]:checked").parents("tr:first").find("span.keypoint_num").html(1);
		$(this).parents("tr").find("input[name=clothes_slt]").click();
	}
	function setCategory($target) {
		var categoryName = $target.siblings('label').text();
		$target.parents('.drop_slt_item:first').siblings('.selected_item').html(categoryName);
		$target.parents('.drop_slt_item:first').slideUp(200);

		itemTemplate.category_id = $target.val();
		itemTemplate.category_name = categoryName;
	}
	function selectItem() {
		initTemplateData();
		// 현재 선택된 ITEM 의 작업데이터를 가져오고
		itemTemplate = itemStorage.get("_"+$(this).attr("offset"));
		var currentDrawItem = itemTemplate[gSelectedWorkType];
		polygonCount = currentDrawItem.length;

		if(polygonCount == 0) {
			currentDrawItem[0] = [];
			polygonCount++;
		}
		polygonTemplate = currentDrawItem[polygonCount+offsetIndex];
		if(!$.isEmpty(itemTemplate.category_id) && itemTemplate.category_id < 14) {
			// $UI.drawItems(currentDrawItem);
			if(gSelectedWorkType == "Keypoint") {
				$UI.drawPointPath(currentDrawItem);
				$('.tbl td button').removeClass('on');
				$(this).parents("tr:first").find(".btn_keypoint").addClass("on");
			} else {
				$UI.drawClosingPath(currentDrawItem);
				$('.tbl td button').removeClass('on');
				$(this).parents("tr:first").find(".btn_segment").addClass("on");
			}
		} else {
			gSelectedWorkType = "Segmentation";
			$UI.setDrawType(gSelectedWorkType);
			// $UI.drawItems(currentDrawItem);
			$UI.drawClosingPath(currentDrawItem);
			$('.tbl td button').removeClass('on');
			$(this).parents("tr:first").find(".btn_segment").addClass("on");
		}
	}
	function appendPolygon() {
		var offsetKey = $("input:radio[name=clothes_slt]:checked").attr("offset");
		itemTemplate = itemStorage.get("_"+offsetKey);
		if($.isEmptyObject(itemTemplate[gSelectedWorkType][polygonCount])) {
			itemTemplate[gSelectedWorkType][polygonCount] = [];
		}
		polygonCount = itemTemplate[gSelectedWorkType].length;
		polygonTemplate = [];
		if(gSelectedWorkType != null && gSelectedWorkType == 'Keypoint') {
			$("input:radio[name=clothes_slt]:checked").parents("tr:first").find("span.keypoint_num").html(polygonCount);
		} else {
			$("input:radio[name=clothes_slt]:checked").parents("tr:first").find("span.area_num").html(polygonCount);
		}
		itemStorage.set("_"+offsetKey, itemTemplate);
	}

	//////////////////////////////// DEFINE CALLBACK
	// 기본 JOB Data 출력
	function displayContents(context) {
		// 0. 화면 표시 데이터를 초기화한다.
		clearDisplay();
		// 1. context info를 local에 임시저장한다.
		mContextInfo = context;
		// 2. JOB과 PROJECT에 관한 정로블 화면에 보여준다.
		$("em.orgFileName", $mP).html(mContextInfo.orgFileName);
		// 3. 원본데이터를 보여줄 필요가 있으면 보여준다.
		if($.isEmptyObject(mContextInfo.atchFile)) {
			$.alert("원본 데이터 파일을 불러오지 못했습니다.");
			return;
		} else {
			// MEDIA 파일을 콘트롤러에 표시한다
			let image64 = mContextInfo.atchFile;
			let base64ImageContent = image64.replace(/^data:image\/(png|jpeg);base64,/, "");
			let extType = mContextInfo.extName == ".png"? "image/png" : "image/jpeg";
			$("img#dataSource").attr("src", URL.createObjectURL(ImageJS.base64ToBlob(base64ImageContent, extType)));
		}
		getSegmentationCategory();
	}
	function dataRender(renderData) {
		itemStorage = new Map();
		// gSelectedWorkType = "Segmentation";
		// $UI.setDrawType(gSelectedWorkType);
		clearDisplay();
		if(!$.isEmptyObject(renderData)) {
			var arrayItems = renderData['itemStorage'];
			if(!$.isEmptyObject(arrayItems)) {
				$.each(arrayItems, function (idx, item) {
					if(item != null && !$.isEmptyObject(item.context)) {
						var dataTemplate = JSON.parse(item.context);
						dataTemplate.status = item.status;
						// 카테고리 그리기
						item.categoryHtml = drawCategoryListToHtml(mItemIndex++, dataTemplate.category_id);
						item.itemIndex = mItemIndex;
						item.category_name = dataTemplate.category_name;
						item.category_id = dataTemplate.category_id;

						item.segmentCount = dataTemplate.Segmentation.length;
						item.keypointCount = dataTemplate.Keypoint.length;
						// item 그리기
						var itemHtml = $.templates("#segment_itemTemplate").render(item);
						var $clotheItem = $("tbody.workInfo", $mP).append(itemHtml);
						$clotheItem.bindEventItem();

						dataTemplate.contextId = item.contextId;
						itemStorage.set("_"+item.itemIndex, dataTemplate);
					}
				});
				// 아이템 다 그렸으면 첫번째 꺼 선택
				// if(!$.isEmptyObject($("input[type=radio][name=clothes_slt]", $mP).get(0))) {
				// 	$("input[type=radio][name=clothes_slt]", $mP).get(0).click();
				// }
				if(!$.isEmptyObject($("label.clothes_slt", $mP).get(0))) {
					$("label.clothes_slt", $mP).get(0).click();
				}
			} else {
				// itemStorage가 없다.
			}
		} else {
			// 표시할 데이터가 없습니다.
		}
	}
	function drawCategoryListToHtml(index, selectedId) {
		var categoryList = { data : mCategory };            // jsrender에서 category를 좌우로 정렬하기 위해 Wrapping 해준다.
		categoryList.itemIndex = index;
		categoryList.selCategoryId = selectedId;
		return $.templates("#category_mapTemplate").render(categoryList);
	}
	function clearDisplay() {
		initTemplateData();
		$("tbody.workInfo tr:gt(0)", $mP).remove();        // workInfo table을 지울 때 안내 메시지를 보호하기 위한 조치
		mItemIndex = 0;
		gSelectedWorkType = "Segmentation";
		$UI.setDrawType(gSelectedWorkType);
	}

	function getSegmentationCategory() {
		mCategory = [];
		// segmentation 카테고리만 가져오는 것으로 수정
		$Object.selectProjectCategorySubList(function(result) {
			result.forEach(function(item) {
				mCategory.push(item);
			});
			// 데이터를 불러 왔지만 Category를 불러오기 전에 worked data를 표시하지 못하는 문제 수정을 위해 첫 로드시에  selectWorkData 는 비동기로 처리
			selectWorkData();
		});
	}

	function initTemplateData() {
		fullTemplateDate();
		polygonTemplate = [];
		itemTemplate = {
			Segmentation:[]		// poligon1,poligon2,...,poligonN
			,Keypoint:[]		// poligon
			,category_id:'', category_name:'', status:'RQ'
		};
		polygonCount = 0;
		gUndoItem = { Segmentation: [], Keypoint: [] };
	}

	function failCallback() {}
	return {
		init: init
	}
})();