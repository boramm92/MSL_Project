/* MINDsLab. NBR. 20210422 */

// header 스크롤 효과
function headerScrollFunc(e){ 
    var header = document.getElementById('header');

    if (pageYOffset > 5){ 
        header.classList.add('fixed'); 
    }else{ 
        header.classList.remove('fixed'); 
    } 
    
    // var target = e.target;
    // console.log(target);
    // var scrollX = window.scrollLeft;
    // header.style.left = scrollX + 'px';
    // console.log(scrollX);
} 
window.addEventListener('load', headerScrollFunc);
window.addEventListener('scroll', headerScrollFunc);

// window.addEventListener('scroll', function(){
//     var header = document.querySelector('#header');
//     var scrollX = window.scrollLeft;
//     header.style.left = '500px';
//     console.log(scrollX)
// });

// header 좌우 스크롤 처리
$(window).scroll(function(){
    var scrollX = $(window).scrollLeft()
    $('#header').css('left', - scrollX);
})

// header 언어선택 (웹, 모바일 별 기능)
var langSelectWrap = document.querySelector('.lang_slt_wrap'),
    langSelectBox = document.querySelector('.slt_box'),
    langSelectBtn = document.getElementsByClassName('btn_lang_slt');

function webLangSeleceFunc(){
    langSelectBox.addEventListener('click', function(){
        langSelectWrap.classList.add('open');
        for(var i = 0; i < langSelectBtn.length; i++){
            langSelectBtn[i].classList.add('on');
            langSelectBtn[i].addEventListener('click', function(e){
                var target = e.target;
                langSelectWrap.classList.remove('open');
                if(target.classList.contains('lang_ko')){
                    document.querySelector('.lang_en').classList.remove('on');
                }else{
                    document.querySelector('.lang_ko').classList.remove('on');
                }
            });
        }    
    });
}
function mobileLangSeleceFunc(){
    function btnClick(i){
        langSelectBtn[i].addEventListener('click', function(){
            langSelectBtn[i].classList.add('on');
            if(langSelectBtn[i].classList.contains('lang_ko')){
                document.querySelector('.lang_en').classList.remove('on');
            }else{
                document.querySelector('.lang_ko').classList.remove('on');
            }
        });
    }
    for(var i = 0; i < langSelectBtn.length; i++){
        btnClick(i);  
    }   
}
window.addEventListener('load', function(){
    if(window.innerWidth <= 768){
        mobileLangSeleceFunc();
    }else{
        webLangSeleceFunc();
    }
});
window.addEventListener('resize', function(){
    if(window.innerWidth <= 768){
        mobileLangSeleceFunc();
    }else{
        webLangSeleceFunc();
    }
});   

// header 모바일 메뉴 햄버거 버튼
// var hamBtn = document.querySelector('.btn_ham'),
//     sta = document.querySelector('.sta'),
//     bgDim = document.querySelector('.bg_dim'),
//     headerCont = document.getElementById('header').childNodes[1],
//     clicked = false;

// hamBtn.addEventListener('click', function(){
//     if(!clicked){
//         hamBtn.classList.add('active');
//         sta.classList.add('active');
//         // document.getElementsByTagName('body')[0].style.overflow = 'hidden';
//         var bgDimCreat = document.createElement('div');
//         bgDimCreat.innerHTML = '<div class="bg_dim"></div>';
//         headerCont.insertAdjacentText('beforeend', bgDimCreat);
//         clicked = true;

//         bgDim.addEventListener('click', function(){
//             hamBtn.classList.remove('active');
//             sta.classList.remove('active');
//             document.getElementsByTagName('body')[0].style.overflow = '';
//             bgDim.remove();
//             clicked = false;
//         });
//     }else{
//         hamBtn.classList.remove('active');
//         sta.classList.remove('active');
//         document.getElementsByTagName('body')[0].style.overflow = '';
//         bgDim.remove();
//         clicked = false;
//     }
// });

var clicked = false;

$('.btn_ham').click(function(){
    if(!clicked){
        $(this).addClass('active');
        $('.sta').addClass('active');
        $('body').css('overflow', 'hidden');
        $('#header .contBox').append('<div class="bg_dim"></div>');
        clicked = true;
        $('.bg_dim').on('click', function(){
            $('.btn_ham').removeClass('active');
            $('.sta').removeClass('active');
            $('body').css('overflow', '');
            $(this).remove();
            clicked = false;
        });       
    }else{
        $(this).removeClass('active');
        $('.sta').removeClass('active');
        $('body').css('overflow', '');
        $('.bg_dim').remove();
        clicked = false;
    }
});

// 모바일 gnb nav li 순서 변경
// function gnbNavOrderChange(){
//     var navDataVoucher = document.querySelector('.dataVoucher'),
//         parent = navDataVoucher.parentNode;

//     if(window.innerWidth <= 768){
//         parent.insertBefore(navDataVoucher, parent.childNodes[2]);
//     }else{
//         parent.insertBefore(navDataVoucher, parent.lastChild);
//     }
// }
// window.addEventListener('load', gnbNavOrderChange);
// window.addEventListener('resize', gnbNavOrderChange);

// swiper
new Swiper('.company_wrap', { 
    slidesPerView: 4, 
    slidesPerGroup: 1, 
    spaceBetween: 48,
    slidesPerColumn: 2,
    slidesPerColumnFill: 'row',
    observer: true,
    observeParents: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
    },
    breakpoints: {
        320: {
            spaceBetween: 8,
            slidesPerColumn: 2,
        },
        768: {
            spaceBetween: 8,
            slidesPerColumn: 2,
        },
    },
});





