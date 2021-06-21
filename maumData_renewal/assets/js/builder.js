/* MINDsLab. NBR. 20210604 */
$(document).ready(function(){
    // 공통 layer popup 
	$('.btn_lyr_open').on('click',function(){	
        var btnLyrName = $(this).data('lyr-name'),
            popId = '#' + btnLyrName;
        
        // open
        $(popId).css('display', 'block');
        $(popId).prepend('<div class="lyr_bg"></div>');
        
        // close 
        $('.btn_lyr_close, .lyr_bg').on('click',function(){
            $(popId).css('display', 'none'); 
            $('.lyr_bg').remove(); 
        });	
    });	

    // 공통 토스트 알림 
    $('.btn_toast_open').on('click', function(){
        var btnLyrName = $(this).data('toast-name'),
            toastId = '#' + btnLyrName;
    
        // open
        $(toastId).addClass('on');
        setTimeout(function(){
            $(toastId).removeClass('on');
        }, 3000);
        
        // close 
        $('.btn_toast_close').on('click',function(){
            $(toastId).removeClass('on');
        });	
    });

    // 작업 히스토리 파일 목록
    $('.btn_history').on('click', function(){
        if($('.historyBox').is('.active')){
            $('.historyBox').removeClass('active');
        }else{
            $('.historyBox').addClass('active');
        }

        $('.history_list li a').on('click', function(){
            $('.history_list li a').removeClass('active');
            $(this).addClass('active');
        });
    });

    // tool menu 활성화
    var toolMenuBtn = $('.menu_list li button');
    var classBox = $('.menu_list li .classBox');

    toolMenuBtn.on('click', function(){
        var thisClassBox = $(this).next('.classBox');

        if($(this).hasClass('active')){
            $(this).removeClass('active open');
            thisClassBox.removeClass('active');
        }else{
            toolMenuBtn.removeClass('active');
            classBox.removeClass('active');
            thisClassBox.addClass('active'); 
            if($(this).next('.classBox').length){
                $(this).addClass('active open'); 
            }else{
                $(this).addClass('active'); 
            }           
        }
    });

    // aside 영역 확장 버튼
    $('.btn_expand').on('click', function(){
        $('.aside').toggleClass('on');
    });    

    // comments 클릭 시 박스 슬라이드 & height 조절
    $('.comments .tit').on('click', function(){
        var asideHeight = $('.aside').outerHeight(),
            currentFileHeight = $('.aside .currentFile').outerHeight(),
            guideFileHeight = $('.aside .guideFile').outerHeight(), 
            commentsHeight = $('.aside .comments').outerHeight(), 
            commentBoxHeight = $('.aside .comments .cmt_box').outerHeight(),            
            deleteBoxHeight = $('.aside .deleteBox').outerHeight();

        if(commentsHeight < 55){
            var height = currentFileHeight + guideFileHeight + commentsHeight + deleteBoxHeight + commentBoxHeight;

            $('.comments .cmt_box').slideDown(200);
            $('.aside .tabWrap').animate({height: asideHeight - height}, 200);
        }else{
            var height = currentFileHeight + guideFileHeight + commentsHeight + deleteBoxHeight - commentBoxHeight;

            $('.comments .cmt_box').slideUp(200);  
            $('.aside .tabWrap').animate({height: asideHeight - height}, 200);         
        }
    });

    // resize 시 박스 슬라이드 & height 조절
    function handleTabWrapHeight(){
        var asideHeight = $('.aside').outerHeight(),
            currentFileHeight = $('.aside .currentFile').outerHeight(),
            guideFileHeight = $('.aside .guideFile').outerHeight(), 
            commentsHeight = $('.aside .comments').outerHeight(),            
            deleteBoxHeight = $('.aside .deleteBox').outerHeight();

        var height = currentFileHeight + guideFileHeight + commentsHeight + deleteBoxHeight;
        $('.aside .tabWrap').css({height: asideHeight - height});
    } 
    handleTabWrapHeight();  

    $(window).resize(function(){
        handleTabWrapHeight();
    });

    // aside tab
    var asideTabBtn = $('.tabWrap .tab_btn > button');
    var asideTabCont = $('.tabWrap .tab_cont > ul');

    asideTabCont.eq(0).show();
    asideTabBtn.on('click',function(){
        var index = $(this).index();
        asideTabBtn.removeClass('active');
        $(this).addClass('active');
        asideTabCont.css('display','none');
        asideTabCont.eq(index).css('display','block');
    });

    // 태그 리스트 
    $('.tag_list li.reject').clone().appendTo('.reject_list');  // 반려건만 클론해서 반려목록에 넣기

    $('.tabWrap .tab_cont > ul li .tagBox').on('click', function(){
        var thisParentList = $(this).parent('li');

        if(thisParentList.is('.active')){
            thisParentList.removeClass('active');

            if(thisParentList.find('.reject_txt').length){
                thisParentList.find('.reject_txt').slideToggle(200);
            }else if(thisParentList.find('.editCommentBox').length){
                thisParentList.find('.editCommentBox').slideToggle(200);
            }
        }else{
            $('.tabWrap .tab_cont > ul li').removeClass('active');
            thisParentList.addClass('active');

            if(thisParentList.find('.reject_txt').length){
                thisParentList.find('.reject_txt').slideToggle(200);
            }else if(thisParentList.find('.editCommentBox').length){
                thisParentList.find('.editCommentBox').slideToggle(200);
            }
        }
    });
    $('.tabWrap .tab_cont > ul li .select').on('click', function(e){
        e.stopPropagation();
    });
});