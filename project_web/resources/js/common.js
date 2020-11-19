/* MINDsLab. NBR. 20201118 */

jQuery.event.add(window,"load",function(){
    $(document).ready(function(){
        // // 공통 레이어 팝업
        // $('.btn_lyr_open').on('click',function(){
        //     var popHref = $(this).attr('href');
        //
        //     // popup open
        //     $('body').addClass('lyr_bg_dim');
        //     $(popHref).css({'display': 'block'});
        //
        //     // popup close
        //     $('.btn_lyr_close, .btn_lyr_save').on('click',function(){
        //         $('body').removeClass('lyr_bg_dim');
        //         $('.lyrBox').css({'display': 'none'});
        //     });
        // });

        // 공통 레이어 팝업
        $('.btn_lyr_open').on('click',function(){
            var popHref = $(this).attr('href');

            // popup open
            $('body').css({'overflow': 'hidden'});
            $(popHref).css({'display': 'block'});

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
