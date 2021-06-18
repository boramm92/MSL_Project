/* MINDsLab. NBR. 20210604 */
$(document).ready(function(){
    // tool menu active func
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

    // aside expand func
    $('.btn_expand').on('click', function(){
        $('.aside').toggleClass('on');
    });    

    // comments slide toggle & tab height 
    var clicked = false; 
    $('.comments .tit').on('click', function(){
        var asideHeight = $('.aside').height();
        var commentsHeight = $('.comments').height();

        if(!clicked){
            var height = commentsHeight + 260;
            $('.comments .cmt_box').slideDown(200);
            clicked = true;
            $('.aside .tabWrap').animate({height: asideHeight - height}, 200);
        }else{
            var height = commentsHeight + 44;
            $('.comments .cmt_box').slideUp(200);  
            $('.aside .tabWrap').animate({height: asideHeight - height}, 200);         
            clicked = false;
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

    // 
    $('.tabWrap .tab_cont > ul li').on('click', function(){
        if($(this).is('.active')){
            $(this).removeClass('active');
        }else{
            $('.tabWrap .tab_cont > ul li').removeClass('active');
            $(this).addClass('active');
        }
    });
    $('.tabWrap .tab_cont > ul li .select').on('click', function(e){
        e.stopPropagation();
    });

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

    // toast notification
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

    // history
    $('.btn_history').on('click', function(){
        if($('.history_list').is('.active')){
            $('.history_list').removeClass('active');
        }else{
            $('.history_list').addClass('active');
        }
    });
});