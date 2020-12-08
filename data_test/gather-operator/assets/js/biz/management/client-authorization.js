var clientAuthorizationScript =  (function() {
	var $mP;
	var thisClientId;	// 현재 페이지 clientId
	
	var $posBx;			// 작업자, 검수자 영역
	var posPageNum;		// 작업자, 검수자 다음 목록을 불러오기 위한 pageNum
	var poslistLength;	// 작업자, 검수자 list 길이
	
	var $setBx;			// 확정자 영역
	var setPageNum;		// 확정자 다음 목록을 불러오기 위한 pageNum
	var setlistLength;	// 확정자 list 길이
	
	var chkIdx = 1;		// checkbox index
	
	var requestApi = {
			selectClientPjtList: "/oper/management/selectClientPjtList.json",
			selectPossibleUserList: "/oper/management/selectPossibleUserList.json",
			selectSettledUserList: "/oper/management/selectSettledUserList.json",
			saveProjectUser: "/oper/management/saveProjectUser.json"
	};
	
	var requestPage = {
			moveClientManager: "/oper/management/clientDashboard.do"
	}
	
	function init(clientId) {
		$mP = $("div.container");
		$posBx = $mP.find("div.slate_box");
		$setBx = $mP.find("div.decide_box");
		thisClientId = clientId;
		
		bindEventHandler();
		
		// 고객사 프로젝트 리스트
		getClientPjtList();
		
//		$(".page_loading").addClass("pageldg_hide").delay(300).queue(function() {
//			$(this).remove();
//		});
	}
	
	function bindEventHandler() {
		// 검색
		$(".btnSrchPjt", $mP).on("click", getClientPjtList, checkRevision);
		$(".btnSrchPossibleUser", $mP).on("click", getPossibleUserList);
//		$(".btnSrchSettledUser", $mP).on("click", getSettledUserList);
		
		// 검색 enter키
		$("#search_pjt", $mP).on("keydown", getClientPjtList, enterKeyEvent);
		$(".srch_box input", $posBx).on("keydown", getPossibleUserList, enterKeyEvent);
//		$(".srch_box input", $setBx).on("keydown", getSettledUserList, enterKeyEvent);
		
		// 스크롤
		$(".table_bd", $posBx).scroll(getPossibleUserList, scrollEvent);
		$(".table_bd", $setBx).scroll(getSettledUserList, scrollEvent);
		
		// tab
		$('.designate_btn li').on("click", tabClickEvent, checkRevision);
		
		// 추가버튼
		$(".btnAddUser", $mP).on("click", addSettledUser);
		
		// 선택삭제버튼
		$(".btnDeleteUser", $mP).on("click", deleteSettledUser);
		
		// 완료버튼
		$(".complete", $mP).on("click", saveProjectUser);
		
		// 취소버튼
		$(".cancel", $mP).on("click", goClientDashboardPage, checkRevision);
	}
	
	function enterKeyEvent(e){
		if(e.keyCode == 13) {
			if($(this).attr("id") == "search_pjt") {
				$(".btnSrchPjt", $mP).trigger("click");
				
			} else {
				e.data();
			}
		}
	}
	
	function scrollEvent(e) {
		// listLength
		var checkList = $(this).parents('.slate_box').length > 0 ? "pos" : "set";
		var listLength = checkList == "pos" ? poslistLength : setlistLength;
		if(listLength == 30){ // ajax통신 시 가져오는 row -> 30
			var scrollT = $(this).scrollTop();
			var scrollH = $(this).height();
			var contentH = checkList == "pos" ? $(this).find('.slateList').height() : $(this).find('.decideList').height();
			
			if(Math.round(scrollT)>= contentH - scrollH){
				checkList == "pos" ? posPageNum++ : setPageNum++;
				e.data();
			}
		}
	}
	
	function resetContents() {
		$(".slateList", $mP).html("");
		$(".decideList", $mP).html("");
		
		// 검색어 제거
		$('.manpower_box .srch_box input').val("");
		
		// 체크박스 초기화
		$('#slate_chk').prop('checked', false);
		$('#decide_id').prop('checked', false);
		
		chkIdx = 1;
		
		posPageNum = 1;
		setPageNum = 1;
		
		// 작업자 목록, 작업확정자 목록 가져오기
		getPossibleUserList();
		getSettledUserList();
	}
	
	function tabClickEvent(target) {
		var index = target.index();
		$('.designate_btn li').removeClass('on');
		target.addClass('on');
		$('.lst_title li').css('display','none');
		$('.lst_title li', $posBx).eq(index).css('display','block');
		$('.lst_title li', $setBx).eq(index).css('display','block');
		$('.manpower_box .srch_box input').removeClass('on');
		$('.srch_box input', $posBx).eq(index).addClass('on');
		
		// 추가버튼 text변경
		var addBtnTxt = index == 0 ? "작업자 추가" : "검수자 추가";
		$(".btnAddUser div").text(addBtnTxt);
		
		// contents clear
		resetContents();
	}
	
	function getClientPjtList(){
		var projectNm = $("#search_pjt", $mP).val();
		var param = {clientId:thisClientId, projectNm:projectNm};
		MindsJS.loadJson(
			requestApi.selectClientPjtList,
			param,
			function(result) {
				if(result.recordsTotal == 0){
					$.alert("해당 고객사에 존재하는 프로젝트가 없습니다.");
					return false;
				}
				var tableHtml = $.templates("#cilentProjectTemplate").render(result.data);
				
				$(".srch_lst", $mP).html(tableHtml);
				$(".slateList", $mP).html("");
				$(".decideList", $mP).html("");
				
				
				$('.srch_lst li span').on('click', function(){
					var curLi = $(this).parent();
					if(!curLi.hasClass("active")){
						curLi.siblings().removeClass("active");
						curLi.addClass("active");
						
						resetContents();
					}
				});
			}
		);
	}
	
	function getPossibleUserList() {
		var curPjtId = $(".srch_lst li.active").attr("pjtid");
		if(curPjtId == undefined || curPjtId == ""){
			return false;
		}
		var userId = $(".srch_box input.on", $posBx).val();
		var userKind = $(".designate_btn").find("li").hasClass("worker on")? "W" : "I"; // 활성화 된 tab
		var param = {projectId:curPjtId, userId:userId, userKind:userKind};
		var pageNum = posPageNum;
		$("tbody#slateList", $mP).paging({
			dataURI: requestApi.selectPossibleUserList,
			renderCallback: setPossibleUserList,
			param: param,
			pageBlock: 10,
			length: 30,
			initPage:pageNum
		});
	}
	
	function getSettledUserList() {
		var curPjtId = $(".srch_lst li.active").attr("pjtid");
		if(curPjtId == undefined || curPjtId == ""){
			return false;
		}
//		var userId = $(".srch_box input.on", $setBx).val();
		var userKind = $(".designate_btn").find("li").hasClass("worker on")? "W" : "I";
		var param = {projectId:curPjtId, userKind:userKind};
		var pageNum = setPageNum;
		$("tbody#decideList", $mP).paging({
			dataURI: requestApi.selectSettledUserList,
			renderCallback: setSettledUserList,
			param: param,
			pageBlock: 10,
			length: 30,
			initPage:pageNum
		});
	}
	
	function setPossibleUserList(data) {
		poslistLength = data.length;
		var tableHtml = "";
//		var idx = (posPageNum-1)*30+1;
		var lstRow = $(".slate_row").last().text() == ""? 0 : $(".slate_row").last().text();
		var curRow = parseInt(lstRow)+1;
		if(data != null && data.length > 0) {
			for(var i=0; i < data.length; i++) {
				data[i].row = curRow++;
				data[i].idx = chkIdx++;
				tableHtml += $.templates("#possibleUserTemplate").render(data[i]);
			}
			
			if(data.curPage == 1) {
				$("tbody.slateList", $mP).html(tableHtml);
			} else {
				$("tbody.slateList", $mP).append(tableHtml);
			}
			
			// checkBox
			$('.slate_id').click(function(){
				if(!$(this).attr("checked")){
					$('#slate_chk').prop('checked', false);
				}
			});
			
		} else {
			if(data.curPage == 1) {
				var emptyParam = { colspan : 3, message : "추가 가능한 id가 없습니다." };
				tableHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);
				$("tbody.slateList", $mP).html(tableHtml);
			}
		}
		
		// totalCount
		if(data.curPage == 1) {
			$(".total_person span", $posBx).text(data.totCount);
		}
	}
	
	function setSettledUserList(data) {
		setlistLength = data.length;
		var tableHtml = "";
//		var idx = (setPageNum-1)*30+1;
		var lstRow = parseInt($('.decideList tr:visible').last().find(".decide_row").text()) || 0;
		var curRow = lstRow + 1;
		if(data != null && data.length > 0) {
			for(var i=0; i < data.length; i++) {
				data[i].row = curRow++;
				data[i].idx = chkIdx++;
				tableHtml += $.templates("#settledUserTemplate").render(data[i]);
			}
			
			if(data.curPage == 1) {
				$("tbody.decideList", $mP).html(tableHtml);
			} else {
				$("tbody.decideList", $mP).append(tableHtml);
			}
			
			// checkBox
			$('.decide_id').click(function(){
				if(!$(this).attr("checked")){
					$('#decide_chk').prop('checked', false);
				}
			});
			
		} else {
			if(data.curPage == 1) {
				var emptyParam = { colspan : 3, message : "확정자 id가 없습니다." };
				tableHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);
				$("tbody.decideList", $mP).html(tableHtml);
			}
		}
		
		// totalCount
		if(data.curPage == 1) {
			$(".total_person span", $setBx).text(data.totCount);
		}
	}
	
	function addSettledUser() {
		// 작업자 목록에서 checkbox확인하기
		var checkedInput = $('input:checkbox[class="slate_id"]:checked');
		var checkedLength = checkedInput.length;
		if(checkedInput.length > 0) {
			// totalCount 수정
			var totalSetRow = parseInt($(".total_person span", $setBx).text());
			
			// list row
			var lstRow = parseInt($('.decideList tr:visible').last().find(".decide_row").text()) || 0;
			var curRow = lstRow+1;
			var addHtml = "";
			for(var i=0; i<checkedInput.length; i++) {
				var param = new Map();
				var userId = checkedInput.eq(i).val();
				param.userId = userId;
				param.projectId = $(".srch_lst li.active").attr("pjtid");
				param.userKind = $(".designate_btn").find("li").hasClass("worker on")? "W" : "I";
				
				// 해당 id가 존재하는지 확인
				var curInput = $(".userData input[value='"+userId+"']");
				var idChk = curInput.length;
				if(idChk > 0) {
					// delete일 때 지우고 row 추가
					var status = curInput.siblings("input[name='status']").val();
					if(status == "delete"){
						curInput.parents("tr").remove();
						// list에 더하기
						param.status = "";
						param.row = curRow++;
						param.idx = chkIdx++;
						addHtml += $.templates("#settledUserTemplate").render(param);
						
					} else { // status == "insert" || status == "" 일때
						--checkedLength;
					}
				} else {
					// list에 더하기
					param.status = "insert";
					param.row = curRow++;
					param.idx = chkIdx++;
					addHtml += $.templates("#settledUserTemplate").render(param);
				}
				
			}
			
			if(totalSetRow == 0 && addHtml != ""){
				$("tbody.decideList", $mP).html(addHtml);
			} else {
				$("tbody.decideList", $mP).append(addHtml);
			}
			
			// checkBox
			$('.decide_id').click(function(){
				if(!$(this).attr("checked")){
					$('#decide_chk').prop('checked', false);
				}
			});
			
			// totalCount
			var totalSetCnt = totalSetRow + checkedLength;
			$(".total_person span", $setBx).text(totalSetCnt);

		} else {
			$.alert("목록에서 체크박스를 선택해주세요.");
		}
	}
	
	function deleteSettledUser() {
		// check 확인
		var checkedInput = $('input:checkbox[class="decide_id"]:checked:visible');
		var checkedLength = checkedInput.length;
		if(checkedLength > 0) {
			// totalCount 수정
			var totalSetRow = parseInt($(".total_person span", $setBx).text());
			var totalSetCnt = totalSetRow - checkedLength;
			
			var addHtml = "";
			for(var i=0; i<checkedLength; i++) {
				var param = new Map();
				var userId = checkedInput.eq(i).val();
				
				// status확인
				var curInput = $(".userData input[value='"+userId+"']");
				var status = curInput.parents("tr").find("input[name='status']").val();
				if(status == "insert") {
					// 해당 row 제거
					curInput.parents("tr").remove();
				} else if(status == ""){
					// 해당 row status 변경
					curInput.parents("tr").find("input[name='status']").val("delete")
					curInput.parents("tr").hide();
				}
			}
			
			$(".total_person span", $setBx).text(totalSetCnt);
			
			// row 재배치
			var reRow = 1;
			var trLength = $(".decideList").find("tr").length;
			for(var j=0; j < trLength; j++) {
				var decideTr = $(".decide_row").eq(j).parents("tr").css("display");
				if(decideTr != "none"){
					$(".decide_row").eq(j).text(reRow++);
				}
			}
			
			// 스크롤 없어지면 다음 list불러오기
			var talbleH = $("div.table_bd", $setBx).height();
			var contentH = $("div.table_bd", $setBx).find('.decideList').height();
			if(talbleH > contentH){
				setPageNum++;
				getSettledUserList();
			}
			
		} else {
			$.alert("확정자에서 체크박스를 선택해주세요.");
		}
	}
	
	function saveProjectUser() {
		var param = $("form[name=work-data]", $mP).formJson();
		$.confirm(
			"변경된 내용을 저장하시겠습니까?"
			, function() {
				MindsJS.loadJson(
					requestApi.saveProjectUser,
					param,
					function(result) {
						if(result.success != true){
							$.alert("저장에 실패하였습니다.");
							return false;
						}
						
						$.alert("작업한 내용 저장되었습니다.", resetContents);
					}
				);
			}
			, null
			, "저장"
		);
	}
	
	function checkRevision(e) {
		var insertRow = $(".decideList input[name='status'][value='insert']").length;
		var deleteRow = $(".decideList input[name='status'][value='delete']").length;
		if(insertRow + deleteRow > 0){
			$.confirm(
				"현재 작업중이던 사항이 초기화됩니다.<br>계속 진행하시겠습니까?"
				, function() {
					e.data($(this));
				}
				, null
				, "확인"
			);
		} else {
			e.data($(this));
		}
	}
	
	function goClientDashboardPage() {
		MindsJS.movePage(requestPage.moveClientManager);
	}
	
	return {
		init: init
	}
})();