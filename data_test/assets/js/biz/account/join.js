var joinViewScript = (function() {
	var $mP;
	var mIsSocialId =  false;
	var mFormInfo = {};

	var requestApi = {
		searchUser : "/accnt/searchUser.json",
		registUser : "/accnt/registUser.json",
		requestAuth : "/accnt/requestEmailAuthKey.json",
		getTermContent : "/term/getTermContent.json"
	};
	
	function init(email) {
		$mP = $("div#wrap");
		bindEventHandler();
		// 약관/개인정보처리방침 불러오기
		loadTerm(function() {
			if(!$.isEmpty(email)) {
				loadGraph();
				mIsSocialId = true;
				mFormInfo.userId = email;
				showTerm();
			} else {
				loadGraph();
				mIsSocialId = false;
				mFormInfo.userId = "";
			}
		});
	}

	function loadGraph() {
		$(".page_loading").addClass("pageldg_hide").delay(300).queue(function() {
			$(this).remove();
		});
	}

	function bindEventHandler() {
		$(".registEmail", $mP).on("click", showTerm);
		$(".registGoogle", $mP).on("click", loginGoogle);
		$(".back", $mP).on("click", function() { history.back(); });
	}

	var termContents = {};
	function loadTerm(callback) {
		MindsJS.loadJson(
			requestApi.getTermContent, null, function(result) {
				if(result.success) {
					var data = result.data;
					if(data != null) {
						data.forEach(function (v, i) {
							if (v.contentType == 'P') {
								termContents.privacy = v.content;
								termContents.pVer = v.version;
							} else if (v.contentType == 'T') {
								termContents.term = v.content;
								termContents.tVer = v.version;
							}
						});
						if(typeof callback === 'function') {
							callback();
						}
					}
				}
			}
		);
	}

	function loginGoogle() {
		MindsJS.movePage("/login.do");
	}
	// 약관 동의 화면 띄우기
	function showTerm() {
		$("body").addClass("stage");
		var termsHtml = $.templates("#termConfirmTemplate").render(termContents);
		var $termConfirm = $("div#contents", $mP).html(termsHtml).addClass("stage");

		$termConfirm.find("input#all_agree").on("click", function() {
			$("input[type=checkbox]", $termConfirm).prop("checked", $(this).is(":checked"));
		});
		$termConfirm.find("button.btnNext").on("click", function() {
			if(isCheckConfirm()) {
				mFormInfo.termYn = "Y";
				mFormInfo.lastTermVer = termContents.tVer;
				mFormInfo.privacyYn = "Y";
				mFormInfo.lastPrivVer = termContents.pVer;
				mFormInfo.recvMailYn = $("input#event_agree").is(":checked") ? "Y" : "N";
				showMobileRegist();
			} else {
				$.alert("필수 약관동의 해 주세요");
			}
		});
	}
	// 약관동의 여부 체크
	function isCheckConfirm() {
		return $("input#svc_agree").is(":checked") && $("input#user_agree").is(":checked");
	}
	// 본인 인증 화면 띄우기
	function showMobileRegist() {
		$("body").addClass("certify");
		var termsHtml = $.templates("#personalRegistTemplate").render();
		var $personalResult = $("div#contents", $mP).html(termsHtml).removeClass("stage");
		$personalResult.find(".btnConfirm").on("click", function() {
			// 휴대폰 본인인증 화면 띄우기
			requestMobileCert();
		});
		$personalResult.find(".btnReject").on("click", function() {
			mobileResult(false);
		});
	}
	function mobileResult(isAuth) {
		// 휴대폰 본인인증 결과
		if(isAuth) {
			isAuth.checkType = true;

			mFormInfo.userNm = isAuth.userNm;
			mFormInfo.mobile = isAuth.mobile;
			mFormInfo.mobileCertYn = "Y";
			mFormInfo.genderCd = isAuth.genderCd;

			// 해당 번호로 인증받은 ID가 있는지 확인
			MindsJS.loadJson(
				requestApi.searchUser,
				isAuth,
				function(result) {
					if(result.success) {
						if(result.data) {
							resultExist(result.data);
						} else {
							showInputForm();
						}
					} else {
						// 응답 실패시 (타임아웃 등)
					}
				}
			);
		} else {
			showInputForm();
		}
	}

	function setAuthTimer() {
		$("span.remain_time em").text("03:00");
		$.alert("인증코드를 전송했습니다.");
	}
	function showInputForm() {
		$("body").removeClass("certify").addClass("form");
		var enterformName = mIsSocialId ? "enterInformationForOAuthTemplate" : "enterInformationTemplate";

		var termsHtml = $.templates("#"+enterformName).render(mFormInfo);
		var $inputForm = $("div#contents", $mP).html(termsHtml).addClass("stage");

		$inputForm.find("button.btnReqAuthKey").on("click", function() {
			// 인증하기 버튼 on 하고, 타이머 돌리기
			var $this = $(this);
			var email = $('.email_chk').val();
			if(!$.checkEmail(email)) {
				$(".email_chk_result").show();
				$("input.auth_key").prop("disabled", true);
				$this.parents("tr:first").siblings("tr.classify_code").find(".ipt_box").removeClass("on");
			} else {
				$('.email_chk_result').hide();
				$("input.auth_key").prop("disabled", false);
				$this.parents("tr:first").siblings("tr.classify_code").find(".ipt_box").addClass("on");
				$this.text("인증코드 다시받기");
				setAuthTimer();
			}
		});
		$inputForm.find("button.btnReqDupl").on("click", function() {
			var param = {
				userId : $("input.email_chk[name=userId]", $mP).val()
			};
			if(!$.checkEmail(param.userId)) {
				$(".email_chk_result").show();
				mFormInfo.userId = "";
				return;
			} else {
				$('.email_chk_result').hide();
				mFormInfo.userId = param.userId;
				mFormInfo.password = param.password;
			}
			MindsJS.loadJson(
				requestApi.searchUser,
				param,
				function(result) {
					if(result.success) {
						if(result.data) {
							// 중복된 ID가 있을 때
							$.alert("이미 사용중인 Email입니다.");
						} else {
							// 중복된 ID가 없을 때
							$.alert("사용 가능한 ID 입니다.");
						}
					} else {
					}
				}
			);
		});
		$inputForm.find("button.btnAuth").on("click", function() {

		});
		$inputForm.find("button.btnReMobile").on("click", function() {
			requestMobileCert();
		});
		$inputForm.find("button.btnReqRegist").on("click", function() {
			mFormInfo.translate = $("input[name=route_slt]:checked").attr("id");
			mFormInfo.rcmdCode = $("input.rcmdCd").val();
			mFormInfo.password = $("input[name=password]", $mP).val();
			mFormInfo.isSocialId = mIsSocialId ? "Y" : "N";

			if(!$.isEmpty(mFormInfo.userId)) {
				if(!mIsSocialId) {
					var passComp = $(".my_pw_chk", $mP).val();
					if(!$.checkPasswd(mFormInfo.password, passComp, 8)) {
						return;
					}
				}
				MindsJS.loadJson(
					requestApi.registUser,
					mFormInfo,
					function(result) {
						if(result.success) {
							if(result.data) {
								$("body").removeClass("form").addClass("complete");
								// 가입 성공
								var resultHtml = $.templates("#resultBTemplate").render();
								var $resultForm = $("div#contents", $mP).html(resultHtml).removeClass("stage form");
								$resultForm.find("button.btnBack").on("click", function() {
									MindsJS.movePage("/");
								});
							} else {
								// 가입 실패
								$.alert("회원가입에 실패 했습니다. 입력정보를 확인해 주세요.");
							}
						} else {
						}
					}
				);
			} else {
				$.alert("아이디를 확인해 주세요.");
				return;
			}
		});
		$inputForm.find("input.auth_key").on("keyup", function() {
			if(!$.isEmpty($(this).val())
				&& $(this).val().length == $(this).attr("maxLength"))
			{
				$(this).parents("tr:first").find(".btn_box").addClass("on");
			} else {
				$(this).parents("tr:first").find(".btn_box").removeClass("on");
			}
		});
		$inputForm.find("input.my_pw_chk").on("blur", function() {
			var pwd1 = $('.my_pw').val();
			var pwd2 = $('.my_pw_chk').val();

			if(pwd1 != '' || pwd2 != ''){
				if(pwd1 == pwd2){
					$('.pw_chk_result').hide();
				}else{
					$('.pw_chk_result').show();
				}
			}else{
				$('.pw_chk_result').show();
			}
		});
	}
	function requestMobileCert() {
		openDRMOKWindow();
	}
	function result() {
		var termsHtml = $.templates("#resultBTemplate").render();
		$("div#contents", $mP).html(termsHtml);
	}
	function resultExist(data) {
		var certHtml = $.templates("#resultATemplate").render(data);
		var $certHtml = $("div#contents", $mP).html(certHtml).removeClass("stage");
		$certHtml.find("button.btnHome").on("click", function() {
			MindsJS.movePage("/");
		});
	}

	// PUBLIC FUNCTION
	return {
		init: init,
		mobileResult: mobileResult
	}
})();