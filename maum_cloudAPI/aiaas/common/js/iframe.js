$("#mAI_English").click(function(){
	$(".active").removeClass("active");
	$(this).addClass("active");
	$("#list4_sub").slideDown('fast');
	$("#list4_sub").css('max-height', '120px');	
	$("#collapsible_list4_sub").addClass("active");
	$(".content").empty();
	$(".content").html(
						"<iframe src='https://maieng.maum.ai:28088/console/showContent.do?lang=kr' "
							+"width='1015px' height='950px' frameborder=0 framespacing=0 marginheight=0 marginwidth=0 scrolling=no vspace=0 allowTransparency='true'>"
						);
	$(".path").html('<span><img src="/aiaas/kr/images/ico_path_home_bk.png" alt="HOME"></span><span>Application</span><span>mAI English</span>')
})

$("#voc").click(function(){
	$(".content").empty();
	$(".active").removeClass("active");
	$(this).addClass("active");
	$("#list4_sub").slideDown('fast');
	$("#list4_sub").css('max-height', '120px');	
	$("#collapsible_list4_sub").addClass("active");
	$(".content").html(
						"<iframe src='https://voc.maum.ai/voc/sa/sv' "
							+"width='1015px' height='950px' frameborder=0 framespacing=0 marginheight=0 marginwidth=0 scrolling=no vspace=0 allowTransparency='true'>"
						);
	$(".path").html('<span><img src="/aiaas/kr/images/ico_path_home_bk.png" alt="HOME"></span><span>Application</span><span>maum VOC</span>')
})