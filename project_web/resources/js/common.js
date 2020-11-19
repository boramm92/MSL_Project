/* MINDsLab. NBR. 20201118 */

jQuery.event.add(window,"load",function(){
    $(document).ready(function(){
        // 공통 레이어 팝업
        $('.btn_lyr_open').on('click',function(){
            var popHref = $(this).attr('href');

            var layerPopupWidth = $(popHref).find('.lyrBox').width() / 2;
            var layerPopupHeight = $(popHref).find('.lyrBox').height() / 2;

            // popup open
            $('body').css({'overflow': 'hidden'});
            $(popHref).css({'display': 'block'});
            $(popHref).find('.lyrBox').css({
                marginTop: -layerPopupHeight,
                marginRight: 0,
                marginBottom: 0,
                marginLeft: -layerPopupWidth
            });

            // popup close
            $('.btn_lyr_close, .btn_lyr_save').on('click',function(){
                $('body').css({'overflow': 'visible'});
                $('.lyr_wrap').css({'display': 'none'});
            });
        });

        // 인풋 라벨
        var placeholderLabel = $('.iptText');

        placeholderLabel.on('focus', function(){
            $(this).siblings('label').hide();
        });
        placeholderLabel.on('focusout', function(){
            if($(this).val() === ''){
                $(this).siblings('label').show();
            }
        });
    });
});
