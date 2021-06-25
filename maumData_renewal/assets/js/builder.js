/* MINDsLab. NBR. 20210604 */
$(document).ready(function(){
    // -------------------- 공통 -------------------- //
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
    $('.aside .btn_expand').on('click', function(){
        $('.aside').toggleClass('on');
        
        var contentWidth = $('.content').outerWidth(),
            asideWidth = $('.aside').outerWidth(),
            videoFrameAreaWidth = $('.videoFrameArea').outerWidth();

        if($('.aside').hasClass('on') == true){
            videoFrameAreaWidth = videoFrameAreaWidth - asideWidth;
            $('.videoFrameArea').animate({width: videoFrameAreaWidth}, 300);
        }else{
            videoFrameAreaWidth = contentWidth;
            $('.videoFrameArea').animate({width: videoFrameAreaWidth}, 300);
        }
    });    

    // comments 클릭 시 박스 슬라이드 & height 조절
    $('.comments .tit').on('click', function(){
        var asideHeight = $('.aside').outerHeight(),
            currentFileHeight = $('.aside .currentFile').outerHeight(),
            guideFileHeight = $('.aside .guideFile').outerHeight(), 
            commentsHeight = $('.aside .comments').outerHeight(), 
            commentBoxHeight = $('.aside .comments .cmt_box').outerHeight(),            
            deleteBoxHeight = $('.aside .deleteBox').outerHeight(),
            scriptHeight = $('.aside .script').outerHeight();

        if(commentsHeight < 55){
            var height = currentFileHeight + guideFileHeight + commentsHeight + commentBoxHeight + deleteBoxHeight + scriptHeight;

            $('.comments .cmt_box').slideDown(200);
            $('.aside .tabWrap').animate({height: asideHeight - height}, 200);
        }else{
            var height = currentFileHeight + guideFileHeight + commentsHeight + deleteBoxHeight + scriptHeight - commentBoxHeight;

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

    // 태그 리스트 반려건만 클론하여 목록 만들기
    $('.tag_list li.reject').clone().appendTo('.reject_list'); 

    // 태그 리스트의 전체영역을 클릭 시 활성화
    $('.tabWrap .tab_cont > ul li .tagBox').on('click', function(e){
        e.stopPropagation();
        
        var thisParentList = $(this).parent('li');

        if(thisParentList.is('.active')){
            thisParentList.removeClass('active');

            if(thisParentList.find('.reject_txt').length){
                thisParentList.find('.reject_txt').slideToggle(200);
            }
        }else{
            $('.tabWrap .tab_cont > ul li').removeClass('active');
            thisParentList.addClass('active');

            if(thisParentList.find('.reject_txt').length){
                thisParentList.find('.reject_txt').slideToggle(200);
            }
        }
    });

    // 태그 리스트의 선택박스 클릭 시 활성화
    $('.tabWrap .tab_cont > ul li .select').on('click', function(e){
        e.stopPropagation();

        var thisParentList = $(this).parents('li');

        $('.tabWrap .tab_cont > ul li .tagBox button').removeClass('active');
        $(this).addClass('active');
        $('.tabWrap .tab_cont > ul li').removeClass('active');
        thisParentList.addClass('active');

        if($(this).is('.btn_add_comment')){
            thisParentList.find('.editCommentBox').slideToggle(200);
        }
    });

    // 태그 리스트의 툴 메뉴 버튼 클릭 시 활성화
    $('.tabWrap .tab_cont > ul li .tagBox button').on('click', function(e){
        e.stopPropagation();

        var thisParentList = $(this).parents('li');

        $('.tabWrap .tab_cont > ul li .tagBox button').removeClass('active');
        $(this).addClass('active');
        $('.tabWrap .tab_cont > ul li').removeClass('active');
        thisParentList.addClass('active');

        if($(this).is('.btn_add_comment')){
            thisParentList.find('.editCommentBox').slideToggle(200);
        }
    });  
    
    // videoFrameArea 영역 확장 버튼
    $('.videoFrameArea .btn_expand').on('click', function(){
        $('.videoFrameArea').toggleClass('on');
    });

    // videoFrameArea width 조절
    function handleVideoFrameAreaWidth(){
        var contentWidth = $('.content').outerWidth(),
            asideWidth = $('.aside').width(),
            videoFrameAreaWidth = $('.videoFrameArea').outerWidth();

        if($('.aside').hasClass('on') == true){
            videoFrameAreaWidth = contentWidth - asideWidth;
            $('.videoFrameArea').css('width', videoFrameAreaWidth);
        }else{
            videoFrameAreaWidth = contentWidth;
            $('.videoFrameArea').css('width', videoFrameAreaWidth);
        }
    }
    handleVideoFrameAreaWidth();

    // window resize func 모음
    $(window).resize(function(){
        handleVideoFrameAreaWidth();
    });

    // frame pagination number 가져오기
    function getframeNumInfo(){
        var totalFrameNum = $('.frame_list li').length,
            currentFrameNum = $('.frame_list li.active').index();

        $('.frameInfo .currentNum').text(currentFrameNum + 1);
        $('.frameInfo .totalNum').text(totalFrameNum);
    }
    getframeNumInfo();

    // frame pagination
    function clickPrevBtn(){    // 이전 버튼 
        var currentFrameIndex = $('.frame_list li.active').index();
            currentFrameIndex = currentFrameIndex - 1;

        var currentFrameNum = $('.frameInfo .currentNum').text();
            currentFrameNum = parseInt(currentFrameNum);

        if(currentFrameNum == 1){
            return false;
        }

        $('.frameInfo .currentNum').text(currentFrameIndex);
        $('.frame_list li').eq(currentFrameIndex).trigger('click');
    }

    function clickNextBtn(){    // 다음 버튼 
        var currentFrameIndex = $('.frame_list li.active').index();
            currentFrameIndex = currentFrameIndex + 1;

        var totalFrameNum = $('.frame_list li').length;
        var currentFrameNum = $('.frameInfo .currentNum').text();
            currentFrameNum = parseInt(currentFrameNum);

        if(totalFrameNum == currentFrameNum){
            return false;
        }
        
        $('.frameInfo .currentNum').text(currentFrameIndex);
        $('.frame_list li').eq(currentFrameIndex).trigger('click');
    }

    function activeFrameMoveScroll(){   // 현재 프레임으로 스크롤 이동
        var currentOffsetLeft = $('.frame_list li.active').offset().left,
            frameListOffsetLeft = $('.frame_list').offset().left,
            frameListScrollLeft = $('.frame_list').scrollLeft();

        $('.frame_list').animate({scrollLeft: currentOffsetLeft - frameListOffsetLeft * 2 + frameListScrollLeft + 40}, 200);
    }

    // frame pagination 버튼 클릭 시
    $('.frame_pagination .btn_paging').on('click', function(){
        if($(this).is('.btn_prev')){
            clickPrevBtn();
            activeFrameMoveScroll();
        }else if($(this).is('.btn_next')){
            clickNextBtn();
            activeFrameMoveScroll();
        }       
    });

    // frame list scroll 이동 버튼
    $('.frame_list_wrap .btn_scroll').on('click', function(){        
        if($(this).is('.btn_scroll_left')){      
            $('.frame_list').animate({scrollLeft: '-=94'}, 200);          
        }else if($(this).is('.btn_scroll_right')){
            $('.frame_list').animate({scrollLeft: '+=94'}, 200);  
        }
    });

    // frame 선택 활성화
    $('.frame_list li').on('click', function(){
        $('.frame_list li').removeClass('active');
        $(this).addClass('active');
        getframeNumInfo();
        activeFrameMoveScroll();
    });

    // frame list mouse wheel scroll
    function scrollHorizontally(e){
        e.preventDefault();
        e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        document.querySelector('.frame_list').scrollLeft -= (delta * 94);           
    }   
    $('.frame_list').on('mousewheel DOMMouseScroll', scrollHorizontally);    // IE9, Chrome, Safari, Opera, Firefox


    // -------------------- 검수자 화면 -------------------- //
    // 태그 리스트 세부 코멘트 리스트 내 버튼 클릭 시 
    $('.editCommentBox .cmt_list li button').on('click', function(e){
        e.stopPropagation();

        if($(this).is('.btn_check')){   // 확인 처리 하기
            $(this).parent('li').toggleClass('checked');
        }else if($(this).is('.btn_delete')){    // 삭제 하기
            $(this).parent('li').remove();

            $('.cmt_list').each(function(){
                var length = $(this).find('li').length;

                if(length == 0){
                    $(this).parent('.cmt_list_box').find('.unprocessed').addClass('empty');
                }
            });
        }
    });
});

