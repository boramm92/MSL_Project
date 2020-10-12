var pointViewScript = (function() {
	var $mP;
	var mMyWallet;
	var mBankInfo;

	var requestApi = {
		selectWithrawHist: "/profile/selectWithdrawList.json",
		requestWithdraw: "/profile/requestWithdrawPoint.json",
		getMyWallet: "/profile/getMyWallet.json",
		getMyBankAccountInfo : "/profile/selectMyBankInfo.json",
	};
	
	function init() {
		$mP = $("div.container");
		getMyWallet();
		getMyBank();
		
		bindEventHandler();
		selectMyWithdrawHistory();
	}
	function bindEventHandler() {
		$("button.btnReqWithdraw", $mP).on("click", requestWithdraw);
		$("button.btnSearch", $mP).on("click", selectMyWithdrawHistory);
	}

	// 수익금 관련 내용 가져오기
	function getMyWallet() {
		MindsJS.loadJson(
			requestApi.getMyWallet,
			null,
			function(result) {
				if(result.success) {
					mMyWallet = result.data;
				} else {
					mMyWallet.totPoint = 0;
					mMyWallet.usePoint = 0;
					mMyWallet.remainPoint = 0;
					mMyWallet.depositPoint = 0;
					mMyWallet.usefulPoint = 0;
				}
				$("div.mypoint_box p.payment_info span").html(mMyWallet.usefulPoint.format());
			}
		);
	}
	function getMyBank() {
		var param = {};
		MindsJS.loadJson(
			requestApi.getMyBankAccountInfo
			, param
			, function (result) {
				var data = result.data;
				mBankInfo = data;
			}
		);
	}
	
	function selectMyWithdrawHistory() {
		var param = { title: "진행중인 작업", title_eng: "WORKING LIST" };
		param.language = navigator.language || navigator.userLanguage;
		param.state = $("select#work_type option:selected", $mP).val();
		param.condition = $("select.condition option:selected", $mP).val();
		param.startDate = $("input[name=startDate]", $mP).val();
		param.endDate = $("input[name=endDate]", $mP).val();
		$("#myList", $mP).paging({
			dataURI: requestApi.selectWithrawHist,
			renderCallback: renderMyPoint,
			param: param,
			pageBlock: 10,
			length: 10,
			/*order: {
				column:"withdrawId", dir:"desc"
			},*/
			pageNav: $("div.confirmPagingBox", $mP)
		});
	}
	function renderMyPoint(data) {
		var myCardHtml = "";
		if(data != null && data.length > 0) {
			myCardHtml = $.templates("#outRequestHistory").render(data);
		} else {
			var emptyParam = { colspan: 10, message: "No withdraw history." };
			myCardHtml = $.templates("#contentsEmptyTemplate").render(emptyParam);
		}
		var $cardListTable = $("#myList", $mP).html(myCardHtml);
	}

	function resultForMobileCert() {
		profileViewScript.selectStandardBankAccount();
	}

	function popWithdrawInfo(param) {
		var amount = $("input[name=amount]", $mP).val();
		var param = {
			totPoint : mMyWallet ? mMyWallet.totPoint : 0
			,amount : amount
			,sumMonth : mMyWallet ? mMyWallet.depositPoint : 0
			,accntNo : mBankInfo ? mBankInfo.bankAccnt : null
			,bankNm : mBankInfo ? mBankInfo.bankNm : null
			,accntNm : mBankInfo ? mBankInfo.accntNm : null
		};

		var extend = new Array();
		extend.push("request");
		extend.push("account");

		var $banKRecheckPopup = MindsJS.generalPopup("verifyWithdrawTemplate", param, extend);

		// 계좌 등록이 안돼 있을 때 계좌 등록 popup 띄우기
		$banKRecheckPopup.find("button.btnRegAccnt").on("click", function() {
			profileViewScript.selectStandardBankAccount(popWithdrawInfo);
		});

		// 수익금 신청 완료
		$banKRecheckPopup.find("button.save").on("click", function() {
			MindsJS.loadJson(
				requestApi.requestWithdraw,
				param,
				function(result) {
					getMyWallet();		// 포인트 변수 갱신
					$("input[name=amount]", $mP).val('Default Value').focus();
					$.alert(
						"포인트의 수익금 신청이 완료되었습니다. 진행<br>사항은 <em>마이페이지 > 수익금 신청</em>에서 확인할<br>수 있어요."
						, selectMyWithdrawHistory
						, "신청 완료"
					);
				}
			);
		});
	}

	function requestWithdraw() {
		if(verifyParam()) {
			$.confirm("3.3%의 사업소득세가 차감된 금액이 지급되며,<br>월간 누적 세금이 1,000원 미만일 경우 익월 10일경에 일괄 지급됩니다."
				, function() {
					popWithdrawInfo();
				}
				, null
				, "세금 확인 및 동의"
				,"동의", "취소");
		} else {
			//$.alert("준비중입니다.");
		}
	}

	function verifyParam() {
		if($("input[name=amount]", $mP).val().length > 0) {
			if (mMyWallet.usefulPoint > 0) {
				var amount = $("input[name=amount]", $mP).val();
				if(amount < 1000) {
					$.alert("출금신청 최소금액은 1,000 Point 입니다.");
					return false;
				}
				else if(amount > mMyWallet.usefulPoint) {
					$.alert("출금 신청 잔액이 부족합니다.", null, "잔액 부족");
					return false;
				}
				else {
					return true;
				}
			} else {
				return true;
			}
		} else {
			$.alert("신청 금액을 입력해 주세요.", function() {
				$("input[name=amount]", $mP).focus();
			});
			return false;
		}
	}
	
	// PUBLIC FUNCTION
	return {
		init: init,
		resultForMobileCert: resultForMobileCert,
		popWithdrawInfo: popWithdrawInfo
	}
})();