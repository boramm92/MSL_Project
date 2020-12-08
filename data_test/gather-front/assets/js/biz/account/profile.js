var profileViewScript = (function() {
	var $mP;

	var requestApi = {
		getMyBankAccountInfo : "/profile/selectMyBankInfo.json",
		confirmMobileCert : "/account/mobile/confirmMobileCert.json",
		checkMobileCertificate : "/account/mobile/checkMobileCert.json",
		selectBankCodeList: "/account/bank/selectBankCode.json",
		selectAddressList: "/profile/selectAddressList.json",
		selectMyDetailInfo: "/profile/selectMyDetailInfo.json",
		getMyAcceptInfo: "/profile/getMyAcceptInfo.json",
		saveMyAcceptInfo: "/profile/updateMyAcceptInfo.json",
		saveMyDetailInfo: "/profile/updateMyDetailInfo.json",
		saveAbility : "",
	};
	
	function init() {
		$mP = $("div.container");
		
		bindEventHandler();
		appendTabContent();
	}
	function bindEventHandler() {
		//탭메뉴
		var tabBtn = $('.tab_btn > li');
		var tabCont = $('.tab_cont > div');

		tabCont.hide();
		tabCont.eq(0).show();

		tabBtn.on('click',function(e){
			e.preventDefault();
			var target = $(this);
			var index = target.index();
			tabBtn.removeClass('active');
			target.addClass('active');
			tabCont.css('display','none');
			tabCont.eq(index).css('display','block');
		});

		$("div.btnSavePrivacy", $mP).on("click", savePrivacy);
		$("div.btnMobileCert", $mP).on("click", requestMobileCert);
	}
	function appendTabContent() {
		getMyPrivacyInfo();
		getMyBank();
		getAbility();
	}

	function labelEvent() {
		// 인풋 라벨
		var placeholderLabel = $('input[type="text"], input[type="number"]');
		placeholderLabel.on('focus', function(){
			$(this).siblings('label').hide();
		});
		placeholderLabel.on('focusout', function(){
			if($(this).val() === ''){
				$(this).siblings('label').show();
			}
		});
	}

	function getMyPrivacyInfo() {
		var param = {};
		MindsJS.loadJson(
			requestApi.getMyAcceptInfo
			, param
			, function (result) {
				if(result.success) {
					var data = result.data;
					$("input[name=email_agreement][value="+data.recvMailYn+"]", $mP).attr("checked", true);
					$("input[name=sns_agreement][value="+data.recvSnsYn+"]", $mP).attr("checked", true);
				}
			}
		);
	}

	function savePrivacy() {
		var param = {
			recvMailYn: $("input[name=email_agreement]:checked", $mP).val()
			,recvSnsYn: $("input[name=sns_agreement]:checked", $mP).val()
		};
		MindsJS.loadJson(
			requestApi.saveMyAcceptInfo
			, param
			, function (result) {
				if(result.success) {
					$.alert("저장됐습니다.");
				}
			}
		);
	}

	// function getMyCert() {
	// 	// var data = { certYn : 'N' };
	// 	MindsJS.loadJson(
	// 		requestApi.checkMobileCertificate
	// 		, null
	// 		, function(result) {
	// 			var data = result.data;
	// 			rendingMobileCert(data);
	// 		}
	// 	);
	// }
	//
	// function rendingMobileCert(data) {
	// 	var mobileCertRstHtml = $.templates("#tabMyCertInfoTemplate").render(data);
	// 	var $mobileCertBox = $("div.mobile_cert", $mP).html(mobileCertRstHtml);
	// 	$mobileCertBox.find(".btnMobileCert").on("click", function() {
	// 		requestMobileCert();
	// 	});
	//
	// }

	// function confirmMyCert() {
	// 	var param = {};
	// 	MindsJS.loadJson(
	// 		requestApi.confirmMobileCert
	// 		, param
	// 		, function(result) {
	// 			if(result.success) {
	// 				// 응답 성공시
	// 				$.alert("휴대폰 본인인증을 완료했습니다.");
	// 			}
	// 		}
	// 	);
	// }

	function getMyBank() {
		var param = {};
		MindsJS.loadJson(
			requestApi.getMyBankAccountInfo
			, param
			, function (result) {
				var data = result.data;
				rendingBankAccnt(data);
			}
		);
	}

	function getAbility() {
		MindsJS.loadJson(
			requestApi.selectMyDetailInfo
			, {}
			, function (result) {
				rendingAvility(result.data);
			}
		);
	}

	function requestMobileCert() {
		// var myCertHtml = $.templates("#PersonCertTemplate").render(data);
		// var $myCert = $("li.profile", $mP).html(myCertHtml);
		//
		// $myCert.find("button.btnRequestCert").on("click", function() {
			openDRMOKWindow();
			//$(this).hide();
			//var btnClose = "<button class='btn btnCertConfirm'>계속하기</button>";
			//var $genUI = $(this).after(btnClose);
			//$genUI.find("button.btnCertConfirm").on("click", confirmMyCert);
		// });
	}

	function rendingBankAccnt(data) {
		var myBankHtml = $.templates("#tabAccountAdminTemplate").render(data);
		var $myBank = $("div.account_admin", $mP).append(myBankHtml);
		$myBank.find("div.btn_box").on("click", function() {
			selectStandardBankAccount();
		});
	}

	function rendingAvility(data) {
		var myAptitudeHtml = $.templates("#tabMachingTemplate").render();
		var $myAptitudeBox = $("div.maching_info", $mP).append(myAptitudeHtml);
		if(data != null){
			$myAptitudeBox.find('[name=sido]').val(data['sido']);
			selectAddressList(2, function(){
				$myAptitudeBox.find('[name=gugun]').val(data['gugun']);
				selectAddressList(3, function(){
					$myAptitudeBox.find('[name=dong]').val(data['dong']);
				});
			});
			$myAptitudeBox.find('[name=isForeing]').prop('checked', data['isForeing'] === 'Y' ? true : false);
			data['lang'].forEach(function(sv, si){
				var langArea = $('div[data-lang-cd="'+sv.langCd+'"]');
				langArea.find('[name=level]').val(sv.level);
				langArea.find('[name=period]').val(sv.period);
				if(sv.license !== ''){
					langArea.find('[name=license]').siblings('label').hide();
				}
				langArea.find('[name=license]').val(sv.license);
			});
		}
		$myAptitudeBox.find("div.btn_box").on("click", function() {
			saveAbility();
		});
		$myAptitudeBox.find("select#si_do").on("change", function() {
			selectAddressList(2);

			var optionHtml = $.templates("#selectOptionTemplate").render({isEmpty:true});
			$("select#dong").html(optionHtml);
		});
		$myAptitudeBox.find("select#gu_gun").on("change", function() {
			selectAddressList(3);
		});
		labelEvent();
	}

	function selectAddressList(type, callback) {
		var param = {};
		param.type = type;
		param.sidoCode = $("select#si_do option:selected").val();
		if(type == 3) {
			param.gugunCode = $("select#gu_gun option:selected").val();
		}
		MindsJS.loadJson(
			requestApi.selectAddressList
			, param
			, function(data) {
				if(data.success) {
					var selIdName = "";
					if(type == 2) {
						// 시군구에 랜더링
						selIdName = "gu_gun";
					} else if(type == 3) {
						// 읍면동에 랜더링
						selIdName = "dong";
					}
					var optionHtml = $.templates("#selectOptionTemplate").render(data);
					$("select#"+selIdName).html(optionHtml);
					if(callback != undefined){
						callback();
					}
				}
			}
		);
	}

	function selectStandardBankAccount(customCallback) {
		MindsJS.loadJson(
			requestApi.selectBankCodeList
			,null
			, function(bankCodeList) {
				MindsJS.loadJson(
					requestApi.checkMobileCertificate			// 모바일 인증이 돼 있는지 확인
					, null
					, function(result) {
						var rendData = result.data;
						rendData.bankList = bankCodeList;

						// var popupAccntAdminHtml = $.templates("#accntAdminTemplate").render(rendData);
						// var $popupAccnt = $("body").append(popupAccntAdminHtml);

						var classList = [ "account_admin" ];
						$popupAccnt = MindsJS.generalPopup("accntAdminTemplate", rendData, classList);
						// $popupAccnt.fadeOut(100).css('z-index', 1060);

						// $popupAccnt.find(".pop_simple.account_admin").fadeOut(100).css('z-index', 1060);
						// $popupAccnt.find(".ico_close").on("click", function() {
						// 	var $popSimple = $(this).parents(".pop_simple:first");
						// 	$popSimple.children().remove();
						// 	$popSimple.hide();
						// });
						$popupAccnt.find("button.btnAlertMobileCert").on("click", function() {
							requestMobileCert();
						});
						$popupAccnt.find("button.save").on("click", function() {
							var param = {};
							param.bankAccnt = $popupAccnt.find("input[name=bankAccnt]").val();
							param.JUMINNO = $popupAccnt.find("input[name=JUMINNO]").val();
							param.bankCode = $popupAccnt.find("select[name=bankCode] option:selected").val();
							param.accntNm = rendData.userNm;
							//param.service = "2";
							//param.svcGbn = "2";
							param.service = "1";
							param.svcGbn = "5";
							param.svc_cls = "";
							bankInputViewScript.verifyBankAccount(param, customCallback);
						});
					}
				);
			}
 		);

		// MindsJS.loadJson(
		// 	requestApi.checkMobileCertificate
		// 	, null
		// 	, function(result) {
		// 		if(result.success) {
		// 			window.open("/account/bank/bank_input.jsp", "a", "width=600, height=300, left=100, top=50");
		// 		} else {
		// 			$.alert("계좌등록은 휴대폰 본인 확인을 먼저 해야 합니다.");
		// 		}
		// 	}
		// );
	}

	function saveAbility() {
		function isEmpty(e, msg) {
			if($('[name='+e+']').val() == "" || $('[name='+e+']').val() == undefined){
				$('[name='+e+']').focus();
				$.alert(msg);
				return false;
			}else{
				return true;
			}
		}

		if(
			isEmpty('sido', '시/도 구분을 선택해주세요.') &&
			isEmpty('gugun', '구/군 구분을 선택해주세요.') &&
			isEmpty('dong', '동/면/읍 구분을 선택해주세요.')
		){
			var param = {
				sido : $('[name=sido]').val(),
				gugun : $('[name=gugun]').val(),
				dong : $('[name=dong]').val(),
				isForeing : $('[name=isForeing]').is(':checked') ? 'Y' : 'N',
				lang : null,
			}
			var langParam = [];
			$('div[data-lang-cd]').each(function(i, v){
				langParam.push({
					langCd : $(v).attr('data-lang-cd'),
					level : $(v).find('[name=level] option:selected').val(),
					license : $(v).find('[name=license]').val(),
					period : $(v).find('[name=period]').val() == '' ? 0 : $(v).find('[name=period]').val(),
				});
			});
			param.lang = JSON.stringify(langParam);
			MindsJS.loadJson(
				requestApi.saveMyDetailInfo
				, param
				, function(result) {
					if(result.success) {
						if(result.data.result){
							$.alert("정보 입력이 완료되었습니다.");
						}else{
							$.alert(result.data.msg);
						}
					}
				}
			);
		}
	}

	// PUBLIC FUNCTION
	return {
		init: init,
		selectStandardBankAccount: selectStandardBankAccount,
		requestMobileCert: requestMobileCert
	}
})();