<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<%@ include file="/include/defaultMainJSP.jsp"%>
<body id="maum_data" class="error_page">
<!-- #wrap -->
<div id="wrap">
    <!-- #header -->
    <div id="header" class="logo_only">
        <h1>
            <a href="/">
                <img src="/assets/images/img_data_logo.svg" alt="maum.ai로고">
            </a>
        </h1>
    </div>
    <!-- //#header -->
    <!-- #contents -->
    <div id="contents">
        <div class="error_sign">
            <span class="error_code">500</span>
        </div>
        <p class="error_txt">
            서비스 처리중 오류가 발생하여 요청을 수행할 수 없습니다.<br>
            <span>다시 요청해 주세요.</span>
        </p>
        <button type="button" class="btnMain">뒤로가기</button>
    </div>
    <!-- //#contents -->
    <%@ include file="/include/ui/footer-data.jsp"%>
</div>
</body>
<script type="text/javascript">
    var error501ViewScript = (function() {
        var $mP;
        function init() {
            $mP = $("div#contents");
            bindEventHandler();
        }
        function bindEventHandler() {
            $("button.btnMain", $mP).on("click", goBack);
        }
        function goBack() {
            history.back();
        }
        return {
            init: init
        }
    })();
    $(function(){
        error501ViewScript.init();
    });
</script>