var bankInputViewScript = (function() {
    var $mP;

    var requestApi = {
        verifyBank: "/account/bank/verifyAccount.json"
    };

    function init() {}

    function verifyBankAccount(param, customCallback) {
        var focusName = validateParameter(param);
        if(focusName == "") {
            MindsJS.loadJson(requestApi.verifyBank, param, function(result) {
               if(result.data) {
                   $.alert("입금계좌 등록이 완료 됐습니다.", function() {
                       if(customCallback != null && typeof customCallback === 'function') {
                           customCallback();
                       } else {
                           location.reload();
                       }
                   });
               } else {
               }
            });
        } else {
            return focusName;
        }
    }

    function validateParameter(param) {
        if($.isEmpty(param.bankAccnt)) {
            $.alert("계좌번호를 입력해 주세요.");
            return "bankAccnt";
        }

        if(!$.checkBirth(param.JUMINNO) && !$.checkSaup(param.JUMINNO)) {
            $.alert("주민번호/사업자번호 형식을 확인해 주세요");
            return "JUMINNO";
        }

        return "";
    }

    return {
        init: init,
        verifyBankAccount: verifyBankAccount
    }
})();