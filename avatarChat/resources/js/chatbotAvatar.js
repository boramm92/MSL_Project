/* MINDsLab. UX/UI Team NBR 2021.04.12 */

$(document).ready(function(){
    // 챗봇 아바타 열기
    let chatbotAvatar = $(top.document).find('#chatbotAvatar');
    let chatbotAvatarOpenBtn = $('#btn_chatbotAvatar');
    let chatbotAvatarUI = $('#chatbotAvatar_wrap');

    chatbotAvatarOpenBtn.on('click', function(){
        chatbotAvatar.addClass('open');
        chatbotAvatarOpenBtn.addClass('hide');       
        chatbotAvatarUI.addClass('open');
    });

    // 컨트롤러 기능 - 소리끄기

    // 컨트롤러 기능 - 음성대화

    // 컨트롤러 기능 - 텍스트대화

    // 컨트롤러 기능 - 설정

    // 컨트롤러 기능 - 최소화
    let minimizeBtn = $('.btn_minimize');

    minimizeBtn.on('click', function(){
        chatbotAvatar.removeClass('open');
        chatbotAvatarUI.removeClass('open');
        chatbotAvatarOpenBtn.removeClass('hide');
    });

    // 모바일 버전에서 (width:768px 이하) 스크롤 막기
    function handleMobileScroll(){
        if( $(top.document).width() <= 768 ) {
            $('body').css('overflow', 'hidden');
        }else if( $(top.document).width() > 768 ) {
            $('body').css('overflow', 'visible');
        }
    }  
    handleMobileScroll();  

    $(window).resize(function(){
        handleMobileScroll(); 
    });
});

