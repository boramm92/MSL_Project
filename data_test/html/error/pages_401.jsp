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
			<span class="error_code">401</span>
		</div>
		<p class="error_txt">
			오랫동안 사용하지 않아 접속이 종료 되었습니다.<br>
			<span>다시 로그인 해주세요.</span>
		</p>
		<button type="button" class="btnMain">로그인 바로가기</button>
	</div>
	<!-- //#contents -->
	<%@ include file="/include/ui/footer-data.jsp"%>
</div>
</body>
<script type="text/javascript">
var error401ViewScript = (function() {
	var $mP;
	function init() {
		$mP = $("div#contents");
		bindEventHandler();
	}
	function bindEventHandler() {
		$("button.btnMain", $mP).on("click", preversionLogin);
	}
	function preversionLogin() {
		MindsJS.replacePage("/");
	}
	return {
		init: init
	}
})();
$(function(){
	error401ViewScript.init();
});
</script>