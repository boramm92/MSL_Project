var clientRegistrationScript =  (function() {
	var $mP;
	var requestApi = {
			selectClientLicenseCheck: "/oper/management/selectClientLicenseCheck.json",
			insertClientinfo: "/oper/management/insertClientinfo.json"
	};
	var requestPage = {
			moveClientManager: "/oper/management/clientDashboard.do"
	};
	
	function init() {
		$mP = $("div.container");
		
		bindEventHandler();
	}
	
	function bindEventHandler() {
		// 확인
		$(".btnRegistration", $mP).on("click", saveClientInfo);
		
		// 취소
		$(".btnCancel", $mP).on("click", goClientDashboardPage);
		
		// 중복확인
		$(".btnLicenseCheck", $mP).on("click", checkClientLicense);
	}
	
	function saveClientInfo(){
		// 사업자 번호 중복확인 했는지 체크
		var checkedValue = $("#clientLicenseNum", $mP).attr("checkedValue");
		var curValue = $("#clientLicenseNum", $mP).val();
		if(checkedValue != curValue){
			$.alert("고객사 사업자 번호 중복확인이 필요합니다.");
			return false;
		}
		
		// check
		if(checkClientInfo()){
			var param = $("form[name=work-data]", $mP).formJson();
			MindsJS.loadJson(
					requestApi.insertClientinfo,
					param,
					function(result) {
						if(result.success != true){
							$.alert("저장에 실패하였습니다.");
							return false;
						}
						
						$.alert("작업한 내용 저장되었습니다.");
						location.reload();
					}
			);
		}
		
	}
	
	function checkClientInfo(){
		var checkInfo = true;
		// validation check
		$("form[name=work-data]").find("input").each(function(index, item){
			checkInfo = validationCheck($(item, $mP)) ? true : false;
			return checkInfo;
		});
		
		return checkInfo;
	}
	
	function validationCheck(curInput){
		var inputCheck = true;
		var inputId = curInput.attr("id");
		var inputVal = curInput.val();
		var inputNm = curInput.parents(".info_box").find("span").first().text();
		inputNm = inputId == "clientTel" ? "연락처 1" : inputNm;
		
		// null check
		if(isEmpty(inputVal)) {
			if(inputId != "clientSubTel" && inputId != "note"){ // 필수 입력사항만 해당
				$.alert(inputNm + "을(를) 입력해주세요.");
				inputCheck = false;
			}
			
		// validation check
		} else {
			if(inputId == "clientLicenseNum"){		// 고객사 사업자 등록 번호
				inputCheck = checkLicenseNum(inputVal, inputNm);
				
			} else if(inputId == "clientTel") {		// 연락처 1
				inputCheck = checkTel(inputVal, inputNm);
				
			} else if(inputId == "clientSubTel") {	// 연락처 2
				if(!isEmpty(inputVal)){	// 필수 값이 아니기 때문에 값이 있을때만 체크
					inputCheck = checkTel(inputVal, inputNm);
				}
				
			} else if(inputId == "clientEmail") {	// 이메일
				inputCheck = checkEmail(inputVal, inputNm);
				
			} else if(inputId == "certStartDate") {	// 인증기간 시작 일자
				inputCheck = checkDate(inputVal, inputNm);
				
			} else if(inputId == "certExpireDate") {// 인증기간 종료 일자
				inputCheck = checkDate(inputVal, inputNm);
			}
		}
		return inputCheck;
	}
	
	function isEmpty(str){
		if(str != null && str != "") {
			return false;
		}
		return true;
	}
	
	function checkLicenseNum(val, name){
		var licenseNumRegexp = /^[0-9]+$/;
		if(!licenseNumRegexp.test(val)){
			$.alert("잘못된 " + name + "입니다. 숫자만 입력하세요");
			return false;
		} else if(val.length != 10){
			$.alert(name + "은(는) 10자리로 입력해야합니다.");
			return false;
		}
		return true;
	}
	
	function checkTel(val, name){
		var telRegexp1 = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
		var telRegexp2 = /^\d{2,3}-\d{3,4}-\d{4}$/;
		if(!telRegexp1.test(val) && !telRegexp2.test(val)){ // 둘다 아니라면
			$.alert("잘못된 " + name + "입니다. 숫자, - 를 포함한 숫자만 입력하세요.");
			return false;
		}
		return true;
	}
	
	function checkEmail(val, name){
		var emailRegexp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
//		var emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if(!emailRegexp.test(val)){
			$.alert("잘못된 " + name + "입니다. 정확하게 입력해주세요.");
			return false;
		}
		return true;
	}
	
	function checkDate(val, name){
		var datatimeRegexp = /[0-9]{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
		if (!datatimeRegexp.test(val)) {
			$.alert("잘못된 " + name + "입니다. yyyy-mm-dd 형식으로 입력해주세요.");
			return false;
		}
		return true;
	}
	
	function checkClientLicense(){
		var checkInput = $("#clientLicenseNum", $mP);
		if(validationCheck(checkInput)){
			var param = {clientLicenseNum:checkInput.val()};
			MindsJS.loadJson(
					requestApi.selectClientLicenseCheck,
					param,
					function(result) {
						if(result.success == true){
							if(result.data == 0){ // 중복아님
								checkInput.attr("checkedValue", checkInput.val());
								$.alert("사용가능한 사업자 번호입니다.");
							} else { // 중복
								$.alert("중복된 사업자번호입니다.");
							}
						} else {
							$.alert("중복확인에 실패하였습니다.");
							return false;
						}
					}
			);
		}
	}
	
	function goClientDashboardPage() {
		MindsJS.movePage(requestPage.moveClientManager);
	}
	
	return {
		init: init
	}
})();