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
        $('.btn_lyr_close, .btn_confirm').on('click',function(){
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

